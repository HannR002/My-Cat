export type AudioCategory =
  | 'call'             // A. Panggil Aku
  | 'food'             // B. Waktunya Makan
  | 'play'             // C. Ayo Bermain
  | 'calm'             // D. Tenang & Nyaman
  | 'mother_kitten'    // E. Ibu & Anak Kucing
  | 'communication'    // F. Komunikasi Kucing
  | 'warning'          // G. Marah & Peringatan
  | 'ai_fun';          // My Cat Fun — Suara AI

export type AudioType = 'real' | 'ai' | 'procedural_synth' | 'user_imported';

export interface AudioItem {
  id: string;
  title: string;
  category: AudioCategory;
  description: {
    id: string;
    en: string;
  };
  educationalNote: {
    id: string;
    en: string;
  };
  audioType: AudioType;
  duration: number; // in seconds
  audioUrl: string;
  source: string;
  artist: string;
  license: string;
  licenseUrl?: string;
  hasFile: boolean;
  isDefensive?: boolean;
  safetyWarning?: {
    id: string;
    en: string;
  };
  createdAt?: number;
}

export type CatReaction =
  | 'approaching'     // Mendekat
  | 'attentive'       // Menoleh / Memperhatikan
  | 'meowing_back'    // Mengeong
  | 'no_response'     // Tidak merespons
  | 'moving_away'     // Menjauh
  | 'fear_distress'   // Tampak takut atau tidak nyaman
  | 'other';          // Respons lainnya

export interface InteractionSession {
  id: string;
  catId: string;
  catName: string;
  soundId: string;
  soundTitle: string;
  timestamp: number;
  reaction: CatReaction;
  notes?: string;
  stoppedEarlyDueToDistress?: boolean;
}

export interface CatProfile {
  id: string;
  name: string;
  avatar: string; // preset key like 'cat_orange', 'cat_calico', or data:image/*
  ageYears: number;
  ageMonths?: number;
  breed: string;
  gender: 'male' | 'female' | 'unknown';
  notes: string;
  createdAt: number;
  updatedAt: number;
}

export type Language = 'id' | 'en';

export interface AppSettings {
  language: Language;
  hasSeenWelfareIntro: boolean;
  enableHaptic: boolean;
}

export interface UserImportedAudioRecord {
  id: string;
  title: string;
  category: AudioCategory;
  description: string;
  audioType: 'user_imported' | 'ai';
  duration: number;
  artist: string;
  source: string;
  license: string;
  mimeType: string;
  blob: Blob;
  createdAt: number;
}

export interface MetadataBackupPayload {
  app: 'My Cat';
  version: string;
  schemaVersion: 1 | 2;
  backupType: 'metadata_only';
  exportedAt: string;
  cats: CatProfile[];
  interactions: InteractionSession[];
  favorites: string[];
  settings?: AppSettings;
  importedAudioCount: number;
  importedAudioMetadata: Array<{
    id: string;
    title: string;
    category: AudioCategory;
    audioType: 'user_imported' | 'ai';
    artist: string;
    license: string;
    createdAt: number;
  }>;
}

export interface FullBackupPayload {
  app: 'My Cat';
  version: string;
  schemaVersion: 2;
  backupType: 'full_backup';
  exportedAt: string;
  cats: CatProfile[];
  interactions: InteractionSession[];
  favorites: string[];
  settings?: AppSettings;
  importedAudio: Array<{
    id: string;
    title: string;
    category: AudioCategory;
    description: string;
    audioType: 'user_imported' | 'ai';
    duration: number;
    artist: string;
    source: string;
    license: string;
    mimeType: string;
    createdAt: number;
    dataUrl: string; // Base64 data URL
  }>;
}

export type AnyBackupPayload = MetadataBackupPayload | FullBackupPayload;

export interface RestoreSummary {
  importedCats: number;
  importedInteractions: number;
  importedFavs: number;
  importedAudio: number;
}
