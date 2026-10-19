import test from 'node:test';
import assert from 'node:assert/strict';
import { indexedDB, IDBKeyRange } from 'fake-indexeddb';
import { LocalDatabase } from './db.ts';
import type { CatProfile, InteractionSession, UserImportedAudioRecord } from '../types/index.ts';

// Inject fake-indexeddb globally for Node test environment
(globalThis as unknown as { indexedDB: typeof indexedDB }).indexedDB = indexedDB;
(globalThis as unknown as { IDBKeyRange: typeof IDBKeyRange }).IDBKeyRange = IDBKeyRange;

test('Full backup exports audio binaries correctly as Base64 Data URLs', async () => {
  const db = new LocalDatabase();
  await db.clearAllUserData();

  // Seed sample cat and audio
  const cat: CatProfile = {
    id: 'cat_test_1',
    name: 'Whiskers',
    avatar: 'cat_orange',
    ageYears: 3,
    ageMonths: 2,
    breed: 'Tabby',
    gender: 'female',
    notes: 'Likes purring',
    createdAt: 1000,
    updatedAt: 1000,
  };
  await db.saveCat(cat);

  const audioBlob = new Blob(['TEST_AUDIO_BYTES_12345'], { type: 'audio/mpeg' });
  const audioRecord: UserImportedAudioRecord = {
    id: 'audio_test_1',
    title: 'Suara Whiskers',
    category: 'call',
    description: 'Suara asli rumahan',
    audioType: 'user_imported',
    duration: 3.5,
    artist: 'Pemilik',
    source: 'Rekaman HP',
    license: 'Personal Use',
    mimeType: 'audio/mpeg',
    blob: audioBlob,
    createdAt: 1000,
  };
  await db.saveImportedAudio(audioRecord);

  // Export full backup
  const jsonStr = await db.exportFullBackup();
  const parsed = JSON.parse(jsonStr);

  assert.equal(parsed.app, 'My Cat');
  assert.equal(parsed.backupType, 'full_backup');
  assert.equal(parsed.cats.length, 1);
  assert.equal(parsed.cats[0].name, 'Whiskers');
  assert.equal(parsed.importedAudio.length, 1);
  assert.equal(parsed.importedAudio[0].id, 'audio_test_1');
  assert.ok(
    parsed.importedAudio[0].dataUrl.startsWith('data:audio/mpeg;base64,'),
    'Data URL must contain valid base64 audio header'
  );
});

test('Full backup restores profiles, favorites, sessions, settings, and playable audio', async () => {
  const db = new LocalDatabase();
  await db.clearAllUserData();

  const backupJson = JSON.stringify({
    app: 'My Cat',
    version: '1.2.1',
    schemaVersion: 2,
    backupType: 'full_backup',
    exportedAt: new Date().toISOString(),
    cats: [
      {
        id: 'cat_restore_1',
        name: 'Luna',
        avatar: 'cat_calico',
        ageYears: 2,
        breed: 'Calico',
        gender: 'female',
        notes: 'Suka tidur di sofa',
        createdAt: 2000,
        updatedAt: 2000,
      },
    ],
    interactions: [
      {
        id: 'session_restore_1',
        catId: 'cat_restore_1',
        catName: 'Luna',
        soundId: 'call_crisp',
        soundTitle: 'Panggilan Akrab',
        timestamp: 2500,
        reaction: 'approaching',
        notes: 'Mendekat ceria',
      },
    ],
    favorites: ['call_crisp', 'audio_restore_1'],
    settings: {
      language: 'id',
      hasSeenWelfareIntro: true,
      enableHaptic: false,
    },
    importedAudio: [
      {
        id: 'audio_restore_1',
        title: 'Meow Pagi Luna',
        category: 'call',
        description: 'Vokalisasi pagi',
        audioType: 'user_imported',
        duration: 2.1,
        artist: 'Pengguna',
        source: 'Rekaman',
        license: 'Personal',
        mimeType: 'audio/mpeg',
        createdAt: 2000,
        dataUrl: `data:audio/mpeg;base64,${Buffer.from('RESTORED_LUNA_AUDIO_STREAM').toString('base64')}`,
      },
    ],
  });

  const summary = await db.validateAndRestoreBackup(backupJson, 'replace');
  assert.equal(summary.importedCats, 1);
  assert.equal(summary.importedInteractions, 1);
  assert.equal(summary.importedFavs, 2);
  assert.equal(summary.importedAudio, 1);

  // Verify records in DB
  const cats = await db.getAllCats();
  assert.equal(cats.length, 1);
  assert.equal(cats[0].name, 'Luna');

  const interactions = await db.getAllInteractions();
  assert.equal(interactions.length, 1);
  assert.equal(interactions[0].reaction, 'approaching');

  const favs = await db.getFavoriteIds();
  assert.equal(favs.length, 2);
  assert.ok(favs.includes('call_crisp'));

  const audioList = await db.getAllImportedAudio();
  assert.equal(audioList.length, 1);
  assert.equal(audioList[0].id, 'audio_restore_1');
  const text = await audioList[0].blob.text();
  assert.equal(text, 'RESTORED_LUNA_AUDIO_STREAM');
});

test('Corrupted or unrecognized backups are strictly rejected without modifying database', async () => {
  const db = new LocalDatabase();
  await db.clearAllUserData();

  // Seed baseline
  await db.saveCat({
    id: 'baseline_cat',
    name: 'Oyen',
    avatar: 'cat_orange',
    ageYears: 1,
    breed: 'Kampung',
    gender: 'male',
    notes: '',
    createdAt: 100,
    updatedAt: 100,
  });

  // Test 1: Invalid JSON
  await assert.rejects(
    async () => db.validateAndRestoreBackup('{ broken json', 'replace'),
    /bukan merupakan format JSON yang valid/
  );

  // Test 2: Wrong app name
  await assert.rejects(
    async () =>
      db.validateAndRestoreBackup(
        JSON.stringify({ app: 'Fake App', schemaVersion: 2, cats: [], interactions: [], favorites: [] }),
        'replace'
      ),
    /bukan cadangan aplikasi My Cat/
  );

  // Test 3: Invalid cats structure
  await assert.rejects(
    async () =>
      db.validateAndRestoreBackup(
        JSON.stringify({
          app: 'My Cat',
          schemaVersion: 2,
          backupType: 'metadata_only',
          cats: [{ id: '', name: 'No ID' }],
          interactions: [],
          favorites: [],
        }),
        'replace'
      ),
    /tidak memiliki ID valid/
  );

  // Verify baseline is completely intact
  const cats = await db.getAllCats();
  assert.equal(cats.length, 1);
  assert.equal(cats[0].name, 'Oyen');
});

test('Invalid Base64 audio does NOT alter the database', async () => {
  const db = new LocalDatabase();
  await db.clearAllUserData();

  // Baseline cat
  await db.saveCat({
    id: 'cat_safe',
    name: 'SafeCat',
    avatar: 'cat_tuxedo',
    ageYears: 4,
    breed: 'Tuxedo',
    gender: 'male',
    notes: 'Should remain untouched',
    createdAt: 500,
    updatedAt: 500,
  });

  // Malformed Base64 audio
  const corruptedAudioBackup = JSON.stringify({
    app: 'My Cat',
    schemaVersion: 2,
    backupType: 'full_backup',
    exportedAt: new Date().toISOString(),
    cats: [
      {
        id: 'new_cat',
        name: 'NewCat',
        avatar: 'cat_orange',
        ageYears: 2,
        breed: 'Tabby',
        gender: 'male',
        notes: '',
        createdAt: 1000,
        updatedAt: 1000,
      },
    ],
    interactions: [],
    favorites: [],
    importedAudio: [
      {
        id: 'bad_audio',
        title: 'Corrupt Audio File',
        category: 'call',
        audioType: 'user_imported',
        dataUrl: 'data:audio/mpeg;base64,ILLEGAL_CHARS_!@#$%^&*()',
      },
    ],
  });

  await assert.rejects(
    async () => db.validateAndRestoreBackup(corruptedAudioBackup, 'replace'),
    /karakter ilegal/
  );

  // Confirm existing database was NOT altered
  const cats = await db.getAllCats();
  assert.equal(cats.length, 1);
  assert.equal(cats[0].name, 'SafeCat');
  assert.equal(cats[0].id, 'cat_safe');
});

test('Metadata-only backups in replace mode do NOT delete existing imported audio', async () => {
  const db = new LocalDatabase();
  await db.clearAllUserData();

  // Seed audio that should be protected
  const preciousBlob = new Blob(['MY_PRECIOUS_RECORDING'], { type: 'audio/mpeg' });
  await db.saveImportedAudio({
    id: 'precious_recording_1',
    title: 'Meow Kucing Kesayangan',
    category: 'call',
    description: 'Rekaman langka',
    audioType: 'user_imported',
    duration: 5.0,
    artist: 'Pengguna',
    source: 'HP',
    license: 'Personal',
    mimeType: 'audio/mpeg',
    blob: preciousBlob,
    createdAt: 100,
  });

  // Metadata backup (contains no audio binaries)
  const metadataBackup = JSON.stringify({
    app: 'My Cat',
    version: '1.2.1',
    schemaVersion: 2,
    backupType: 'metadata_only',
    exportedAt: new Date().toISOString(),
    cats: [
      {
        id: 'cat_meta_1',
        name: 'Mochi',
        avatar: 'cat_white',
        ageYears: 1,
        breed: 'Shorthair',
        gender: 'female',
        notes: '',
        createdAt: 200,
        updatedAt: 200,
      },
    ],
    interactions: [],
    favorites: [],
    importedAudioCount: 1,
    importedAudioMetadata: [],
  });

  // Execute restore with mode: replace
  await db.validateAndRestoreBackup(metadataBackup, 'replace');

  // Verify cats were replaced
  const cats = await db.getAllCats();
  assert.equal(cats.length, 1);
  assert.equal(cats[0].name, 'Mochi');

  // Verify audio was PRESERVED safely
  const audioList = await db.getAllImportedAudio();
  assert.equal(audioList.length, 1, 'Audio store must not be erased by metadata-only restore');
  assert.equal(audioList[0].id, 'precious_recording_1');
  const content = await audioList[0].blob.text();
  assert.equal(content, 'MY_PRECIOUS_RECORDING');
});

test('Merge conflicts follow documented rules: updates cats if newer, preserves existing sessions & audio', async () => {
  const db = new LocalDatabase();
  await db.clearAllUserData();

  // Baseline cat: Milo at age 2 (updatedAt: 1000)
  await db.saveCat({
    id: 'milo_id',
    name: 'Milo',
    avatar: 'cat_orange',
    ageYears: 2,
    breed: 'Tabby',
    gender: 'male',
    notes: 'Initial notes',
    createdAt: 1000,
    updatedAt: 1000,
  });

  // Baseline interaction: session_1
  await db.saveInteraction({
    id: 'session_1',
    catId: 'milo_id',
    catName: 'Milo',
    soundId: 'call_crisp',
    soundTitle: 'Call',
    timestamp: 1000,
    reaction: 'attentive',
  });

  // Baseline favorite: fav_1
  await db.toggleFavorite('fav_1');

  // Baseline audio: audio_1
  await db.saveImportedAudio({
    id: 'audio_1',
    title: 'Original Audio 1',
    category: 'call',
    description: '',
    audioType: 'user_imported',
    duration: 1,
    artist: '',
    source: '',
    license: '',
    mimeType: 'audio/mpeg',
    blob: new Blob(['ORIGINAL_1']),
    createdAt: 1000,
  });

  // Incoming backup:
  // - Milo updated (age 3, updatedAt 2000)
  // - New cat: Felix
  // - Duplicate session_1 with different reaction (should be ignored to prevent duplicate logs)
  // - New session: session_2
  // - Duplicate fav_1 and new fav_2
  // - Incoming audio_1 (should be skipped to preserve local audio) and new audio_2
  const incomingBackup = JSON.stringify({
    app: 'My Cat',
    schemaVersion: 2,
    backupType: 'full_backup',
    exportedAt: new Date().toISOString(),
    cats: [
      {
        id: 'milo_id',
        name: 'Milo',
        avatar: 'cat_orange',
        ageYears: 3,
        breed: 'Tabby',
        gender: 'male',
        notes: 'Updated notes',
        createdAt: 1000,
        updatedAt: 2000,
      },
      {
        id: 'felix_id',
        name: 'Felix',
        avatar: 'cat_tuxedo',
        ageYears: 1,
        breed: 'Tuxedo',
        gender: 'male',
        notes: 'New cat',
        createdAt: 2000,
        updatedAt: 2000,
      },
    ],
    interactions: [
      {
        id: 'session_1',
        catId: 'milo_id',
        catName: 'Milo',
        soundId: 'call_crisp',
        soundTitle: 'Call',
        timestamp: 1000,
        reaction: 'fear_distress',
      },
      {
        id: 'session_2',
        catId: 'felix_id',
        catName: 'Felix',
        soundId: 'comm_no_trip',
        soundTitle: 'NoTrip',
        timestamp: 2100,
        reaction: 'approaching',
      },
    ],
    favorites: ['fav_1', 'fav_2'],
    importedAudio: [
      {
        id: 'audio_1',
        title: 'Incoming audio 1 that would overwrite',
        category: 'call',
        audioType: 'user_imported',
        dataUrl: `data:audio/mpeg;base64,${Buffer.from('OVERWRITE_ATTEMPT').toString('base64')}`,
      },
      {
        id: 'audio_2',
        title: 'Brand New Audio 2',
        category: 'play',
        audioType: 'user_imported',
        dataUrl: `data:audio/mpeg;base64,${Buffer.from('NEW_AUDIO_2').toString('base64')}`,
      },
    ],
  });

  await db.validateAndRestoreBackup(incomingBackup, 'merge');

  // Verify cats: Milo updated to age 3, Felix added
  const cats = await db.getAllCats();
  assert.equal(cats.length, 2);
  const milo = cats.find((c) => c.id === 'milo_id');
  assert.equal(milo?.ageYears, 3);
  assert.equal(milo?.notes, 'Updated notes');

  // Verify interactions: session_1 preserved with original reaction; session_2 added
  const interactions = await db.getAllInteractions();
  assert.equal(interactions.length, 2);
  const s1 = interactions.find((s) => s.id === 'session_1');
  assert.equal(s1?.reaction, 'attentive'); // preserved original

  // Verify favorites: set union {fav_1, fav_2}
  const favs = await db.getFavoriteIds();
  assert.equal(favs.length, 2);
  assert.ok(favs.includes('fav_1'));
  assert.ok(favs.includes('fav_2'));

  // Verify audio: audio_1 kept original content; audio_2 added
  const audios = await db.getAllImportedAudio();
  assert.equal(audios.length, 2);
  const a1 = audios.find((a) => a.id === 'audio_1');
  const a1Text = await a1?.blob.text();
  assert.equal(a1Text, 'ORIGINAL_1', 'Local audio 1 must not be overwritten in merge mode');
  const a2 = audios.find((a) => a.id === 'audio_2');
  const a2Text = await a2?.blob.text();
  assert.equal(a2Text, 'NEW_AUDIO_2');
});
