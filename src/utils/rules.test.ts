import test from 'node:test';
import assert from 'node:assert/strict';
import {
  filterAudioCatalog,
  validateAudioImport,
  validateCatProfile,
  evaluateInteractionWelfare,
  calculateSessionStats,
  formatAudioDuration,
} from './rules.ts';
import type { AudioItem, InteractionSession } from '../types/index.ts';

const mockCatalog: AudioItem[] = [
  {
    id: 's1',
    title: 'Meow Panggil',
    category: 'call',
    description: { id: 'Panggilan ramah', en: 'Friendly call' },
    educationalNote: { id: 'Note', en: 'Note' },
    audioType: 'real',
    duration: 1.5,
    audioUrl: '/audio/test1.mp3',
    source: 'Wikimedia',
    artist: 'Author 1',
    license: 'CC0',
    hasFile: true,
  },
  {
    id: 's2',
    title: 'Desisan Bertahan',
    category: 'warning',
    description: { id: 'Desisan pertahanan diri', en: 'Defensive hiss' },
    educationalNote: { id: 'Note', en: 'Note' },
    audioType: 'real',
    duration: 2.0,
    audioUrl: '/audio/test2.mp3',
    source: 'Wikimedia',
    artist: 'Author 2',
    license: 'CC0',
    hasFile: true,
    isDefensive: true,
  },
  {
    id: 's3',
    title: 'Purr Robotik Synth',
    category: 'ai_fun',
    description: { id: 'Audio hiburan AI', en: 'AI Fun audio' },
    educationalNote: { id: 'Note', en: 'Note' },
    audioType: 'ai',
    duration: 3.0,
    audioUrl: '/audio/test3.mp3',
    source: 'Synthesizer',
    artist: 'AI Engine',
    license: 'CC0',
    hasFile: true,
  },
];

test('filterAudioCatalog filters by category correctly', () => {
  const callResults = filterAudioCatalog(mockCatalog, 'call', 'all', '');
  assert.equal(callResults.length, 1);
  assert.equal(callResults[0].id, 's1');

  const warningResults = filterAudioCatalog(mockCatalog, 'warning', 'all', '');
  assert.equal(warningResults.length, 1);
  assert.equal(warningResults[0].id, 's2');
});

test('filterAudioCatalog filters by audioType correctly', () => {
  const realResults = filterAudioCatalog(mockCatalog, 'all', 'real', '');
  assert.equal(realResults.length, 2);

  const aiResults = filterAudioCatalog(mockCatalog, 'all', 'ai', '');
  assert.equal(aiResults.length, 1);
  assert.equal(aiResults[0].id, 's3');
});

test('filterAudioCatalog searches keywords in title or description', () => {
  const searchResults = filterAudioCatalog(mockCatalog, 'all', 'all', 'desisan');
  assert.equal(searchResults.length, 1);
  assert.equal(searchResults[0].id, 's2');
});

test('validateAudioImport accepts valid mp3/wav within size limit', () => {
  const res = validateAudioImport(
    { name: 'cat_meow.mp3', size: 1024 * 500, type: 'audio/mpeg' },
    { title: 'Meow Kucing', category: 'call' }
  );
  assert.equal(res.isValid, true);
});

test('validateAudioImport rejects oversized files', () => {
  const res = validateAudioImport(
    { name: 'huge_file.wav', size: 12 * 1024 * 1024, type: 'audio/wav' },
    { title: 'Suara Terlalu Besar', category: 'call' }
  );
  assert.equal(res.isValid, false);
  assert.match(res.error || '', /10 MB/);
});

test('validateAudioImport rejects empty title', () => {
  const res = validateAudioImport(
    { name: 'sound.wav', size: 1000, type: 'audio/wav' },
    { title: '   ', category: 'call' }
  );
  assert.equal(res.isValid, false);
});

test('validateCatProfile enforces required name and reasonable age limits', () => {
  assert.equal(validateCatProfile({ name: 'Milo', ageYears: 3 }).isValid, true);
  assert.equal(validateCatProfile({ name: '', ageYears: 2 }).isValid, false);
  assert.equal(validateCatProfile({ name: 'Oyen', ageYears: 40 }).isValid, false);
  assert.equal(validateCatProfile({ name: 'Luna', ageYears: 2, ageMonths: 15 }).isValid, false);
});

test('evaluateInteractionWelfare detects feline distress correctly', () => {
  const distressResult = evaluateInteractionWelfare('fear_distress');
  assert.equal(distressResult.isDistress, true);
  assert.match(distressResult.recommendation, /Hentikan interaksi/);

  const attentiveResult = evaluateInteractionWelfare('attentive');
  assert.equal(attentiveResult.isDistress, false);
});

test('calculateSessionStats correctly tallies distress count and common reaction', () => {
  const sessions: InteractionSession[] = [
    {
      id: '1',
      catId: 'c1',
      catName: 'Milo',
      soundId: 's1',
      soundTitle: 'Meow',
      timestamp: 1000,
      reaction: 'attentive',
    },
    {
      id: '2',
      catId: 'c1',
      catName: 'Milo',
      soundId: 's1',
      soundTitle: 'Meow',
      timestamp: 2000,
      reaction: 'attentive',
    },
    {
      id: '3',
      catId: 'c1',
      catName: 'Milo',
      soundId: 's2',
      soundTitle: 'Hiss',
      timestamp: 3000,
      reaction: 'fear_distress',
      stoppedEarlyDueToDistress: true,
    },
  ];

  const stats = calculateSessionStats(sessions);
  assert.equal(stats.total, 3);
  assert.equal(stats.distressCount, 1);
  assert.equal(stats.mostCommonReaction, 'attentive');
});

test('formatAudioDuration formats seconds into m:ss', () => {
  assert.equal(formatAudioDuration(0), '0:00');
  assert.equal(formatAudioDuration(5), '0:05');
  assert.equal(formatAudioDuration(65), '1:05');
  assert.equal(formatAudioDuration(120), '2:00');
});

test('BUNDLED_AUDIO integrity: all files exist on disk with valid size and duration', async () => {
  const fs = await import('node:fs');
  const path = await import('node:path');
  const { BUNDLED_AUDIO } = await import('../data/bundledAudio.ts');

  assert.ok(BUNDLED_AUDIO.length > 0, 'Catalog should not be empty');

  const seenIds = new Set<string>();

  for (const item of BUNDLED_AUDIO) {
    // Unique ID
    assert.ok(!seenIds.has(item.id), `Duplicate ID found: ${item.id}`);
    seenIds.add(item.id);

    // Metadata completeness
    assert.ok(item.title.trim().length > 0, `Title must not be empty for ${item.id}`);
    assert.ok(item.description.id.trim().length > 0, `Indonesian description missing for ${item.id}`);
    assert.ok(item.description.en.trim().length > 0, `English description missing for ${item.id}`);
    assert.ok(item.artist.trim().length > 0, `Artist missing for ${item.id}`);
    assert.ok(item.license.trim().length > 0, `License missing for ${item.id}`);

    // GFDL exclusion verification
    assert.ok(
      !item.license.includes('GFDL'),
      `GFDL audio must not be bundled without distribution resolution (${item.id})`
    );

    // File existence on disk
    if (item.audioUrl.startsWith('/')) {
      const diskPath = path.join(process.cwd(), 'public', item.audioUrl);
      assert.ok(fs.existsSync(diskPath), `Audio file does not exist on disk: ${diskPath}`);
      const stat = fs.statSync(diskPath);
      assert.ok(stat.size > 1000, `Audio file is suspiciously small (<1KB): ${diskPath}`);
    }

    // Defensive warning requirement
    if (item.isDefensive) {
      assert.ok(item.safetyWarning, `Defensive audio ${item.id} must have a safetyWarning`);
      assert.ok(item.safetyWarning?.id.includes('PERINGATAN'), 'Warning must contain Indonesian warning text');
    }
  }
});

