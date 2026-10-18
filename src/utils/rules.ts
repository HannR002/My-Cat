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
