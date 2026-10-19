import type {
  CatProfile,
  InteractionSession,
  AppSettings,
  UserImportedAudioRecord,
  MetadataBackupPayload,
  FullBackupPayload,
  AnyBackupPayload,
  RestoreSummary,
} from '../types/index.ts';
import { blobToDataUrl, dataUrlToBlob, validateBackupPayload } from '../utils/rules.ts';

const DB_NAME = 'my_cat_db';
const DB_VERSION = 1;

export class LocalDatabase {
  private dbPromise: Promise<IDBDatabase> | null = null;

  private getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Cats store
        if (!db.objectStoreNames.contains('cats')) {
          db.createObjectStore('cats', { keyPath: 'id' });
        }

        // Interactions store
        if (!db.objectStoreNames.contains('interactions')) {
          const interactionStore = db.createObjectStore('interactions', { keyPath: 'id' });
          interactionStore.createIndex('catId', 'catId', { unique: false });
          interactionStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        // Favorites store
        if (!db.objectStoreNames.contains('favorites')) {
          db.createObjectStore('favorites', { keyPath: 'audioId' });
        }

        // Imported Audio store (stores audio blobs)
        if (!db.objectStoreNames.contains('imported_audio')) {
          db.createObjectStore('imported_audio', { keyPath: 'id' });
        }

        // Settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
      };

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => {
        this.dbPromise = null;
        reject(request.error);
      };
    });

    return this.dbPromise;
  }

  // CAT PROFILES
  async getAllCats(): Promise<CatProfile[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('cats', 'readonly');
      const store = tx.objectStore('cats');
      const req = store.getAll();
      req.onsuccess = () => {
        const cats = (req.result as CatProfile[]) || [];
        resolve(cats);
      };
      req.onerror = () => reject(req.error);
    });
  }

  // Voluntarily add friendly sample cat profile
  async addDemoCat(): Promise<CatProfile> {
    const demoCat: CatProfile = {
      id: `demo-cat-milo-${Date.now()}`,
      name: 'Milo',
      avatar: 'cat_orange',
      ageYears: 2,
      ageMonths: 4,
      breed: 'Domestic Shorthair (Tabby Oranye)',
      gender: 'male',
      notes: 'Kucing ramah yang penasaran dengan suara mainan dan suka mendengkur saat santai.',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    await this.saveCat(demoCat);
    return demoCat;
  }

  async saveCat(cat: CatProfile): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('cats', 'readwrite');
      const store = tx.objectStore('cats');
      const req = store.put(cat);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async deleteCat(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['cats', 'interactions'], 'readwrite');
      const catStore = tx.objectStore('cats');
      const interactionStore = tx.objectStore('interactions');

      catStore.delete(id);

      // Clean up interactions associated with this cat
      const index = interactionStore.index('catId');
      const req = index.openCursor(IDBKeyRange.only(id));
      req.onsuccess = (e) => {
        const cursor = (e.target as IDBRequest).result as IDBCursorWithValue;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // INTERACTIONS
  async getAllInteractions(): Promise<InteractionSession[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('interactions', 'readonly');
      const store = tx.objectStore('interactions');
      const req = store.getAll();
      req.onsuccess = () => {
        const list = (req.result as InteractionSession[]).sort((a, b) => b.timestamp - a.timestamp);
        resolve(list);
      };
      req.onerror = () => reject(req.error);
    });
  }

  async saveInteraction(session: InteractionSession): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('interactions', 'readwrite');
      const store = tx.objectStore('interactions');
      const req = store.put(session);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async deleteInteraction(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('interactions', 'readwrite');
      const store = tx.objectStore('interactions');
      const req = store.delete(id);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // FAVORITES
  async getFavoriteIds(): Promise<string[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('favorites', 'readonly');
      const store = tx.objectStore('favorites');
      const req = store.getAll();
      req.onsuccess = () => {
        const records = req.result as Array<{ audioId: string }>;
        resolve(records.map((r) => r.audioId));
      };
      req.onerror = () => reject(req.error);
    });
  }

  async toggleFavorite(audioId: string): Promise<boolean> {
    const db = await this.getDB();
    const current = await this.getFavoriteIds();
    const isFav = current.includes(audioId);

    return new Promise((resolve, reject) => {
      const tx = db.transaction('favorites', 'readwrite');
      const store = tx.objectStore('favorites');
      if (isFav) {
        store.delete(audioId);
      } else {
        store.put({ audioId, addedAt: Date.now() });
      }
      tx.oncomplete = () => resolve(!isFav);
      tx.onerror = () => reject(tx.error);
    });
  }

  // IMPORTED AUDIO
  async getAllImportedAudio(): Promise<UserImportedAudioRecord[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('imported_audio', 'readonly');
      const store = tx.objectStore('imported_audio');
      const req = store.getAll();
      req.onsuccess = () => resolve(req.result as UserImportedAudioRecord[]);
      req.onerror = () => reject(req.error);
    });
  }

  async saveImportedAudio(record: UserImportedAudioRecord): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('imported_audio', 'readwrite');
      const store = tx.objectStore('imported_audio');
      const req = store.put(record);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  async deleteImportedAudio(id: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['imported_audio', 'favorites'], 'readwrite');
      const audioStore = tx.objectStore('imported_audio');
      const favStore = tx.objectStore('favorites');

      audioStore.delete(id);
      favStore.delete(id); // remove from favorites if favorited

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  // SETTINGS
  async getSettings(): Promise<AppSettings> {
    const defaultSettings: AppSettings = {
      language: 'id',
      hasSeenWelfareIntro: false,
      enableHaptic: true,
    };
    try {
      const db = await this.getDB();
      return new Promise((resolve) => {
        const tx = db.transaction('settings', 'readonly');
        const store = tx.objectStore('settings');
        const req = store.get('app_settings');
        req.onsuccess = () => {
          if (req.result && req.result.value) {
            resolve({ ...defaultSettings, ...req.result.value });
          } else {
            resolve(defaultSettings);
          }
        };
        req.onerror = () => resolve(defaultSettings);
      });
    } catch {
      return defaultSettings;
    }
  }

  async saveSettings(settings: Partial<AppSettings>): Promise<void> {
    const current = await this.getSettings();
    const updated = { ...current, ...settings };
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction('settings', 'readwrite');
      const store = tx.objectStore('settings');
      const req = store.put({ key: 'app_settings', value: updated });
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }

  // EXPORT METADATA ONLY (JSON Ringan)
  async exportMetadataOnly(): Promise<string> {
    const [cats, interactions, favorites, imported, settings] = await Promise.all([
      this.getAllCats(),
      this.getAllInteractions(),
      this.getFavoriteIds(),
      this.getAllImportedAudio(),
      this.getSettings(),
    ]);

    const payload: MetadataBackupPayload = {
      app: 'My Cat',
      version: '1.2.0',
      schemaVersion: 2,
      backupType: 'metadata_only',
      exportedAt: new Date().toISOString(),
      cats,
      interactions,
      favorites,
      settings,
      importedAudioCount: imported.length,
      importedAudioMetadata: imported.map((item) => ({
        id: item.id,
        title: item.title,
        category: item.category,
        audioType: item.audioType,
        artist: item.artist,
        license: item.license,
        createdAt: item.createdAt,
      })),
    };

    return JSON.stringify(payload, null, 2);
  }

  // EXPORT FULL BACKUP (Termasuk binary rekaman audio pengguna)
  async exportFullBackup(): Promise<string> {
    const [cats, interactions, favorites, imported, settings] = await Promise.all([
      this.getAllCats(),
      this.getAllInteractions(),
      this.getFavoriteIds(),
      this.getAllImportedAudio(),
      this.getSettings(),
    ]);

    const fullImportedAudio = await Promise.all(
      imported.map(async (item) => {
        const dataUrl = await blobToDataUrl(item.blob);
        return {
          id: item.id,
          title: item.title,
          category: item.category,
          description: item.description,
          audioType: item.audioType,
          duration: item.duration,
          artist: item.artist,
          source: item.source,
          license: item.license,
          mimeType: item.mimeType,
          createdAt: item.createdAt,
          dataUrl,
        };
      })
    );

    const payload: FullBackupPayload = {
      app: 'My Cat',
      version: '1.2.0',
      schemaVersion: 2,
      backupType: 'full_backup',
      exportedAt: new Date().toISOString(),
      cats,
      interactions,
      favorites,
      settings,
      importedAudio: fullImportedAudio,
    };

    return JSON.stringify(payload, null, 2);
  }

  // Backwards compatibility alias
  async exportAllUserData(): Promise<string> {
    return this.exportMetadataOnly();
  }

  // VALIDATE & RESTORE BACKUP (Atomic Single Transaction & Pre-validated)
  async validateAndRestoreBackup(
    backupJsonString: string,
    mode: 'merge' | 'replace' = 'merge'
  ): Promise<RestoreSummary> {
    // Step 1: Parse JSON
    let parsed: unknown;
    try {
      parsed = JSON.parse(backupJsonString);
    } catch {
      throw new Error('Berkas bukan merupakan format JSON yang valid.');
    }

    // Step 2: Validate Schema & Structure
    const validation = validateBackupPayload(parsed);
    if (!validation.isValid) {
      throw new Error(validation.error || 'Berkas cadangan tidak valid.');
    }

    const payload = parsed as AnyBackupPayload;

    // Step 3: Pre-decode and pre-validate all audio records BEFORE touching the database
    // This ensures no async base64 decoding occurs inside the active write transaction
    const preparedAudio: UserImportedAudioRecord[] = [];
    if (payload.backupType === 'full_backup' && Array.isArray(payload.importedAudio)) {
      for (const item of payload.importedAudio) {
        const blob = dataUrlToBlob(item.dataUrl);
        if (!blob || blob.size === 0) {
          throw new Error(`Data audio kosong untuk rekaman "${item.title}".`);
        }
        preparedAudio.push({
          id: item.id,
          title: item.title,
          category: item.category,
          description: item.description || '',
          audioType: item.audioType || 'user_imported',
          duration: item.duration || 1,
          artist: item.artist || 'Pengguna',
          source: item.source || 'Cadangan My Cat',
          license: item.license || 'Personal Use',
          mimeType: blob.type || item.mimeType || 'audio/mpeg',
          blob,
          createdAt: item.createdAt || Date.now(),
        });
      }
    }

    // Step 4: Pre-query existing records to resolve merge conflicts safely
    const [existingCats, existingInteractions, existingFavs, existingAudio, currentSettings] =
      await Promise.all([
        this.getAllCats(),
        this.getAllInteractions(),
        this.getFavoriteIds(),
        this.getAllImportedAudio(),
        this.getSettings(),
      ]);

    let catsToPut: CatProfile[] = [];
    let interactionsToPut: InteractionSession[] = [];
    let favsToPut: string[] = [];
    let audioToPut: UserImportedAudioRecord[] = [];

    if (mode === 'replace') {
      catsToPut = payload.cats || [];
      interactionsToPut = payload.interactions || [];
      favsToPut = payload.favorites || [];
      // If full backup: replace audio with prepared audio.
      // If metadata-only: preserve existing audio (do not delete audio that cannot be restored).
      audioToPut = payload.backupType === 'full_backup' ? preparedAudio : existingAudio;
    } else {
      // Merge mode
      // Cats: insert new; if duplicate, update only if backup updatedAt is newer or equal
      const existingCatMap = new Map(existingCats.map((c) => [c.id, c]));
      for (const cat of payload.cats || []) {
        const existing = existingCatMap.get(cat.id);
        if (!existing || (cat.updatedAt || 0) >= (existing.updatedAt || 0)) {
          catsToPut.push(cat);
        }
      }

      // Interactions: avoid duplicate session IDs
      const existingSessionIds = new Set(existingInteractions.map((s) => s.id));
      for (const s of payload.interactions || []) {
        if (!existingSessionIds.has(s.id)) {
          interactionsToPut.push(s);
        }
      }

      // Favorites: set union (add only non-existing favorites)
      const existingFavSet = new Set(existingFavs);
      for (const favId of payload.favorites || []) {
        if (!existingFavSet.has(favId)) {
          favsToPut.push(favId);
        }
      }

      // Imported Audio: add only non-existing audio IDs to protect local recordings
      const existingAudioIds = new Set(existingAudio.map((a) => a.id));
      for (const a of preparedAudio) {
        if (!existingAudioIds.has(a.id)) {
          audioToPut.push(a);
        }
      }
    }

    // Step 5: Execute Single Atomic Transaction
    const db = await this.getDB();
    const tx = db.transaction(
      ['cats', 'interactions', 'favorites', 'imported_audio', 'settings'],
      'readwrite'
    );

    await new Promise<void>((resolve, reject) => {
      let settled = false;

      tx.onerror = () => {
        if (!settled) {
          settled = true;
          reject(tx.error || new Error('Gagal mengeksekusi transaksi pemulihan basis data.'));
        }
      };

      tx.onabort = () => {
        if (!settled) {
          settled = true;
          reject(new Error('Transaksi pemulihan basis data dibatalkan (rollback).'));
        }
      };

      tx.oncomplete = () => {
        settled = true;
        resolve();
      };

      try {
        const catStore = tx.objectStore('cats');
        const interactionStore = tx.objectStore('interactions');
        const favStore = tx.objectStore('favorites');
        const audioStore = tx.objectStore('imported_audio');
        const settingsStore = tx.objectStore('settings');

        // If replace mode, clear data atomically inside the transaction
        if (mode === 'replace') {
          catStore.clear();
          interactionStore.clear();
          favStore.clear();
          // SAFETY: Only clear imported_audio if this backup actually has audio binaries to restore!
          if (payload.backupType === 'full_backup') {
            audioStore.clear();
          }
        }

        // Put records
        for (const cat of catsToPut) {
          catStore.put(cat);
        }
        for (const session of interactionsToPut) {
          interactionStore.put(session);
        }
        for (const favId of favsToPut) {
          favStore.put({ audioId: favId, addedAt: Date.now() });
        }
        for (const audio of audioToPut) {
          audioStore.put(audio);
        }

        // Settings
        if (payload.settings) {
          settingsStore.put({
            key: 'app_settings',
            value: { ...currentSettings, ...payload.settings },
          });
        }
      } catch (err) {
        try {
          tx.abort();
        } catch {
          // already aborted
        }
        settled = true;
        reject(err);
      }
    });

    // Step 6: Post-commit Verification Read-back
    const [finalCats, finalInteractions, finalFavs, finalAudio] = await Promise.all([
      this.getAllCats(),
      this.getAllInteractions(),
      this.getFavoriteIds(),
      this.getAllImportedAudio(),
    ]);

    if (mode === 'replace') {
      if (finalCats.length !== catsToPut.length) {
        throw new Error('Verifikasi pemulihan gagal: jumlah profil kucing tidak sesuai.');
      }
      if (finalInteractions.length !== interactionsToPut.length) {
        throw new Error('Verifikasi pemulihan gagal: jumlah riwayat interaksi tidak sesuai.');
      }
    }

    return {
      importedCats: catsToPut.length,
      importedInteractions: interactionsToPut.length,
      importedFavs: favsToPut.length,
      importedAudio: payload.backupType === 'full_backup' ? audioToPut.length : 0,
    };
  }

  // CLEAR ALL DATA
  async clearAllUserData(): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(['cats', 'interactions', 'favorites', 'imported_audio'], 'readwrite');
      tx.objectStore('cats').clear();
      tx.objectStore('interactions').clear();
      tx.objectStore('favorites').clear();
      tx.objectStore('imported_audio').clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
}

export const dbService = new LocalDatabase();
