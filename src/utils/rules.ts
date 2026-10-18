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
 * Converts a base64 Data URL back to a Blob (supports both browser and Node.js)
 */
export function dataUrlToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(',');
  const mime = parts[0]?.match(/:(.*?);/)?.[1] || 'audio/mpeg';
  const base64Str = parts[1] || '';
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
}

/**
 * Validates backup JSON structure and determines if it is a full or metadata-only backup
 */
export function validateBackupPayload(data: unknown): {
  isValid: boolean;
  error?: string;
  isFullBackup: boolean;
  summary?: {
    catsCount: number;
    interactionsCount: number;
    favoritesCount: number;
    importedAudioCount: number;
  };
} {
  if (!data || typeof data !== 'object') {
    return { isValid: false, error: 'Format berkas tidak valid: data bukan objek JSON.', isFullBackup: false };
  }
  const d = data as Record<string, unknown>;
  if (d.app !== 'My Cat') {
    return { isValid: false, error: 'Berkas cadangan tidak dikenali (bukan cadangan aplikasi My Cat).', isFullBackup: false };
  }
  if (!Array.isArray(d.cats)) {
    return { isValid: false, error: 'Format data profil kucing (cats) tidak valid atau hilang.', isFullBackup: false };
  }
  if (!Array.isArray(d.interactions)) {
    return { isValid: false, error: 'Format data riwayat interaksi (interactions) tidak valid atau hilang.', isFullBackup: false };
  }
  if (!Array.isArray(d.favorites)) {
    return { isValid: false, error: 'Format data favorit (favorites) tidak valid atau hilang.', isFullBackup: false };
  }

  const isFullBackup = d.backupType === 'full_backup' && Array.isArray(d.importedAudio);
  const audioCount = isFullBackup
    ? (d.importedAudio as unknown[]).length
    : typeof d.importedAudioCount === 'number'
    ? d.importedAudioCount
    : 0;

  return {
    isValid: true,
    isFullBackup,
    summary: {
      catsCount: (d.cats as unknown[]).length,
      interactionsCount: (d.interactions as unknown[]).length,
      favoritesCount: (d.favorites as unknown[]).length,
      importedAudioCount: audioCount,
    },
  };
}

