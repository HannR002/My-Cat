import type { AudioCategory, AudioItem, AudioType, CatProfile, CatReaction, InteractionSession } from '../types/index.ts';

/**
 * Filter audio items by category, type, and keyword search
 */
export function filterAudioCatalog(
  items: AudioItem[],
  category: string,
  type: string,
  query: string
): AudioItem[] {
  return items.filter((item) => {
    if (category !== 'all' && item.category !== category) {
      return false;
    }
    if (type !== 'all') {
      if (type === 'real' && item.audioType !== 'real') return false;
      if (type === 'ai' && item.audioType !== 'ai' && item.audioType !== 'procedural_synth') return false;
      if (type === 'imported' && item.audioType !== 'user_imported') return false;
    }
    if (query.trim()) {
      const q = query.toLowerCase();
      const titleMatch = item.title.toLowerCase().includes(q);
      const descMatch =
        (item.description?.id || '').toLowerCase().includes(q) ||
        (item.description?.en || '').toLowerCase().includes(q);
      if (!titleMatch && !descMatch) return false;
    }
    return true;
  });
}

/**
 * Validation rules for user audio import
 */
export function validateAudioImport(
  file: { size: number; name: string; type?: string } | null,
  metadata: { title: string; category: string }
): { isValid: boolean; error?: string } {
  if (!file) {
    return { isValid: false, error: 'Berkas audio wajib dipilih.' };
  }
  const MAX_SIZE = 10 * 1024 * 1024; // 10MB
  if (file.size > MAX_SIZE) {
    return { isValid: false, error: 'Ukuran berkas maksimal 10 MB.' };
  }
  const validExtensions = /\.(mp3|wav|ogg|m4a)$/i;
  const isExtensionValid = validExtensions.test(file.name);
  const isMimeValid = file.type ? file.type.startsWith('audio/') : true;

  if (!isExtensionValid && !isMimeValid) {
    return { isValid: false, error: 'Hanya format audio MP3, WAV, atau OGG yang didukung.' };
  }
  if (!metadata.title.trim()) {
    return { isValid: false, error: 'Judul rekaman wajib diisi.' };
  }
  return { isValid: true };
}

/**
 * Validation rules for Cat Profile
 */
export function validateCatProfile(data: {
  name: string;
  ageYears: number;
  ageMonths?: number;
}): { isValid: boolean; error?: string } {
  if (!data.name || !data.name.trim()) {
    return { isValid: false, error: 'Nama kucing tidak boleh kosong.' };
  }
  if (data.name.trim().length > 50) {
    return { isValid: false, error: 'Nama kucing maksimal 50 karakter.' };
  }
  if (data.ageYears < 0 || data.ageYears > 35) {
    return { isValid: false, error: 'Usia tahun tidak realistis (0 - 35 tahun).' };
  }
  if (data.ageMonths !== undefined && (data.ageMonths < 0 || data.ageMonths > 11)) {
    return { isValid: false, error: 'Usia bulan harus di antara 0 dan 11.' };
  }
  return { isValid: true };
}

/**
 * Evaluates animal welfare risk based on observed cat reaction
 */
export function evaluateInteractionWelfare(reaction: CatReaction): {
  isDistress: boolean;
  recommendation: string;
} {
  if (reaction === 'fear_distress') {
    return {
      isDistress: true,
      recommendation: 'Hentikan interaksi segera. Kucing menunjukkan rasa takut atau tidak nyaman. Berikan ruang tenang.',
    };
  }
  if (reaction === 'moving_away') {
    return {
      isDistress: false,
      recommendation: 'Kucing memilih menjauh. Hormati pilihannya dan jangan memaksakan kontak.',
    };
  }
  return {
    isDistress: false,
    recommendation: 'Interaksi berlangsung dalam ambang kenyamanan wajar.',
  };
}

/**
 * Calculates summary statistics for a cat's sessions
 */
export function calculateSessionStats(sessions: InteractionSession[]): {
  total: number;
  distressCount: number;
  mostCommonReaction: CatReaction | null;
} {
  if (sessions.length === 0) {
    return { total: 0, distressCount: 0, mostCommonReaction: null };
  }

  let distressCount = 0;
  const counts: Record<string, number> = {};

  for (const s of sessions) {
    if (s.reaction === 'fear_distress' || s.stoppedEarlyDueToDistress) {
      distressCount++;
    }
    counts[s.reaction] = (counts[s.reaction] || 0) + 1;
  }

  let maxReaction: CatReaction | null = null;
  let maxCount = -1;
  for (const [reaction, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      maxReaction = reaction as CatReaction;
    }
  }

  return {
    total: sessions.length,
    distressCount,
    mostCommonReaction: maxReaction,
  };
}

/**
 * Formats duration in seconds to m:ss
 */
export function formatAudioDuration(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
}

/**
 * Strict animal welfare eligibility check for sounds used in guided cat interactions.
 * Disallows defensive, warning, procedural synth, AI fun, and unverified audio.
 */
export function isSoundEligibleForInteraction(sound: AudioItem): boolean {
  if (!sound || !sound.hasFile) return false;
  if (sound.isDefensive === true || sound.category === 'warning') return false;
  if (
    sound.audioType === 'procedural_synth' ||
    sound.audioType === 'ai' ||
    sound.category === 'ai_fun'
  ) {
    return false;
  }
  // Must be verified authentic real cat recording with valid url
  if (sound.audioType !== 'real') return false;
  if (!sound.audioUrl) return false;
  return true;
}

/**
 * Converts a Blob to a base64 Data URL (supports both browser and Node.js)
 */
export async function blobToDataUrl(blob: Blob): Promise<string> {
  if (typeof FileReader !== 'undefined') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  const arrayBuf = await blob.arrayBuffer();
  const buffer = Buffer.from(arrayBuf);
  const mime = blob.type || 'audio/mpeg';
  return `data:${mime};base64,${buffer.toString('base64')}`;
}

/**
 * Validates whether a string is a well-formed audio Base64 Data URL
 */
export function isValidAudioDataUrl(dataUrl: unknown): { isValid: boolean; error?: string } {
  if (typeof dataUrl !== 'string' || !dataUrl.trim()) {
    return { isValid: false, error: 'Data URL audio kosong atau bukan string.' };
  }
  if (!dataUrl.startsWith('data:audio/')) {
    return {
      isValid: false,
      error: 'Data URL harus berawalan "data:audio/*" (contoh: data:audio/mpeg;base64,...).',
    };
  }
  const parts = dataUrl.split(',');
  if (parts.length !== 2 || !parts[0].includes(';base64')) {
    return {
      isValid: false,
      error: 'Format data URL tidak valid: harus berisi penanda ";base64," dan blok data.',
    };
  }
  const base64Str = parts[1].trim();
  if (!base64Str) {
    return { isValid: false, error: 'Payload data audio base64 kosong.' };
  }
  // Check valid base64 character set
  const base64Regex = /^[A-Za-z0-9+/=]+$/;
  if (!base64Regex.test(base64Str)) {
    return { isValid: false, error: 'Payload base64 mengandung karakter ilegal.' };
  }
  return { isValid: true };
}

/**
 * Converts a base64 Data URL back to a Blob (supports both browser and Node.js)
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const check = isValidAudioDataUrl(dataUrl);
  if (!check.isValid) {
    throw new Error(check.error || 'Data URL audio tidak valid.');
  }

  const parts = dataUrl.split(',');
  const mime = parts[0]?.match(/:(.*?);/)?.[1] || 'audio/mpeg';
  const base64Str = parts[1].trim();

  try {
    if (typeof Buffer !== 'undefined') {
      const buf = Buffer.from(base64Str, 'base64');
      return new Blob([buf], { type: mime });
    }
    const binaryStr = atob(base64Str);
    const bytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      bytes[i] = binaryStr.charCodeAt(i);
    }
    return new Blob([bytes], { type: mime });
  } catch {
    throw new Error('Gagal mendekode data audio base64: payload rusak.');
  }
}

export interface BackupValidationResult {
  isValid: boolean;
  error?: string;
  isFullBackup: boolean;
  schemaVersion?: number;
  summary?: {
    catsCount: number;
    interactionsCount: number;
    favoritesCount: number;
    importedAudioCount: number;
  };
}

/**
 * Validates backup JSON structure and determines if it is a full or metadata-only backup.
 * Strictly verifies schema, app identifier, record integrity, and audio payload.
 */
export function validateBackupPayload(data: unknown): BackupValidationResult {
  if (!data || typeof data !== 'object') {
    return { isValid: false, error: 'Format berkas tidak valid: data bukan objek JSON.', isFullBackup: false };
  }
  const d = data as Record<string, unknown>;

  // 1. App Identifier
  if (d.app !== 'My Cat') {
    return { isValid: false, error: 'Berkas cadangan tidak dikenali (bukan cadangan aplikasi My Cat).', isFullBackup: false };
  }

  // 2. Schema Version
  if (typeof d.schemaVersion !== 'number' || d.schemaVersion < 1) {
    return { isValid: false, error: 'Versi skema cadangan tidak valid atau hilang.', isFullBackup: false };
  }

  // 3. Backup Type
  if (d.backupType !== 'metadata_only' && d.backupType !== 'full_backup') {
    return { isValid: false, error: 'Tipe cadangan (backupType) tidak dikenali.', isFullBackup: false };
  }

  // 4. Cats Array & Records
  if (!Array.isArray(d.cats)) {
    return { isValid: false, error: 'Format data profil kucing (cats) tidak valid atau hilang.', isFullBackup: false };
  }
  for (let i = 0; i < d.cats.length; i++) {
    const c = d.cats[i];
    if (!c || typeof c !== 'object') {
      return { isValid: false, error: `Profil kucing pada indeks [${i}] bukan objek valid.`, isFullBackup: false };
    }
    const cat = c as Record<string, unknown>;
    if (typeof cat.id !== 'string' || !cat.id.trim()) {
      return { isValid: false, error: `Profil kucing pada indeks [${i}] tidak memiliki ID valid.`, isFullBackup: false };
    }
    if (typeof cat.name !== 'string' || !cat.name.trim()) {
      return { isValid: false, error: `Profil kucing "${cat.id}" tidak memiliki nama yang valid.`, isFullBackup: false };
    }
    if (typeof cat.ageYears !== 'number' || cat.ageYears < 0 || cat.ageYears > 35) {
      return { isValid: false, error: `Profil kucing "${cat.name || cat.id}" memiliki data usia tidak wajar.`, isFullBackup: false };
    }
  }

  // 5. Interactions Array & Records
  if (!Array.isArray(d.interactions)) {
    return { isValid: false, error: 'Format data riwayat interaksi (interactions) tidak valid atau hilang.', isFullBackup: false };
  }
  const validReactions = new Set([
    'approaching',
    'attentive',
    'meowing_back',
    'no_response',
    'moving_away',
    'fear_distress',
    'other',
  ]);
  for (let i = 0; i < d.interactions.length; i++) {
    const s = d.interactions[i];
    if (!s || typeof s !== 'object') {
      return { isValid: false, error: `Catatan interaksi pada indeks [${i}] bukan objek valid.`, isFullBackup: false };
    }
    const session = s as Record<string, unknown>;
    if (typeof session.id !== 'string' || !session.id.trim()) {
      return { isValid: false, error: `Catatan interaksi pada indeks [${i}] tidak memiliki ID valid.`, isFullBackup: false };
    }
    if (typeof session.catId !== 'string' || !session.catId.trim()) {
      return { isValid: false, error: `Catatan interaksi "${session.id}" tidak memiliki ID kucing yang valid.`, isFullBackup: false };
    }
    if (typeof session.reaction !== 'string' || !validReactions.has(session.reaction)) {
      return { isValid: false, error: `Catatan interaksi "${session.id}" memiliki reaksi kucing tidak valid.`, isFullBackup: false };
    }
  }

  // 6. Favorites Array
  if (!Array.isArray(d.favorites)) {
    return { isValid: false, error: 'Format data favorit (favorites) tidak valid atau hilang.', isFullBackup: false };
  }
  for (let i = 0; i < d.favorites.length; i++) {
    if (typeof d.favorites[i] !== 'string' || !d.favorites[i].trim()) {
      return { isValid: false, error: `Item favorit pada indeks [${i}] bukan ID audio valid.`, isFullBackup: false };
    }
  }

  // 7. Audio Validation (Full Backup)
  const isFullBackup = d.backupType === 'full_backup';
  let audioCount = 0;

  if (isFullBackup) {
    if (!Array.isArray(d.importedAudio)) {
      return {
        isValid: false,
        error: 'Cadangan penuh harus memiliki daftar rekaman audio (importedAudio).',
        isFullBackup: true,
      };
    }
    audioCount = d.importedAudio.length;
    for (let i = 0; i < d.importedAudio.length; i++) {
      const a = d.importedAudio[i];
      if (!a || typeof a !== 'object') {
        return { isValid: false, error: `Rekaman audio pada indeks [${i}] bukan objek valid.`, isFullBackup: true };
      }
      const audio = a as Record<string, unknown>;
      if (typeof audio.id !== 'string' || !audio.id.trim()) {
        return { isValid: false, error: `Rekaman audio pada indeks [${i}] tidak memiliki ID valid.`, isFullBackup: true };
      }
      if (typeof audio.title !== 'string' || !audio.title.trim()) {
        return { isValid: false, error: `Rekaman audio "${audio.id}" tidak memiliki judul valid.`, isFullBackup: true };
      }
      if (audio.audioType !== 'user_imported' && audio.audioType !== 'ai') {
        return { isValid: false, error: `Tipe audio untuk "${audio.title}" tidak didukung.`, isFullBackup: true };
      }
      const urlValidation = isValidAudioDataUrl(audio.dataUrl);
      if (!urlValidation.isValid) {
        return {
          isValid: false,
          error: `Data audio untuk "${audio.title}" korup atau tidak valid: ${urlValidation.error}`,
          isFullBackup: true,
        };
      }
    }
  } else {
    audioCount = typeof d.importedAudioCount === 'number' ? d.importedAudioCount : 0;
  }

  return {
    isValid: true,
    isFullBackup,
    schemaVersion: d.schemaVersion as number,
    summary: {
      catsCount: d.cats.length,
      interactionsCount: d.interactions.length,
      favoritesCount: d.favorites.length,
      importedAudioCount: audioCount,
    },
  };
}

