import {
  CatProfile,
  InteractionSession,
  AppSettings,
  UserImportedAudioRecord,
} from '../types';

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
        const cats = req.result as CatProfile[];
        if (cats.length === 0) {
          // Initialize default friendly demo cat
          const defaultCat: CatProfile = {
            id: 'demo-cat-milo',
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
          this.saveCat(defaultCat).then(() => resolve([defaultCat]));
        } else {
          resolve(cats);
        }
      };
      req.onerror = () => reject(req.error);
    });
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

  // EXPORT ALL DATA TO JSON
  async exportAllUserData(): Promise<string> {
    const [cats, interactions, favorites, imported] = await Promise.all([
      this.getAllCats(),
      this.getAllInteractions(),
      this.getFavoriteIds(),
      this.getAllImportedAudio(),
    ]);

    const payload = {
      app: 'My Cat',
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      cats,
      interactions,
      favorites,
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
