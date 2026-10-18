import { AudioItem, AudioCategory } from '../types';

export interface CategoryInfo {
  id: AudioCategory;
  name: {
    id: string;
    en: string;
  };
  subtitle: {
    id: string;
    en: string;
  };
  badgeColor: string;
  iconName: string;
  isDefensiveCategory?: boolean;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'call',
    name: { id: 'Panggil Aku', en: 'Call Me' },
    subtitle: { id: 'Meow pendek, trill, dan panggilan perhatian', en: 'Short meows, trills, and attention calls' },
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
    iconName: 'Bell',
  },
  {
    id: 'food',
    name: { id: 'Waktunya Makan', en: 'Mealtime' },
    subtitle: { id: 'Meow mendesak dan antisipasi pakan', en: 'Urgent meows and feeding anticipation' },
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    iconName: 'Utensils',
  },
  {
    id: 'play',
    name: { id: 'Ayo Bermain', en: 'Let’s Play' },
    subtitle: { id: 'Celoteh ceria dan vokalisasi aktif', en: 'Playful chirps and active vocalizations' },
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    iconName: 'Sparkles',
  },
  {
    id: 'calm',
    name: { id: 'Tenang & Nyaman', en: 'Calm & Purr' },
    subtitle: { id: 'Dengkuran ritmis (purr) dan suara santai', en: 'Rhythmic purring and relaxing sounds' },
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    iconName: 'HeartHandshake',
  },
  {
    id: 'mother_kitten',
    name: { id: 'Ibu & Anak Kucing', en: 'Mother & Kitten' },
    subtitle: { id: 'Panggilan anak kucing dan vokalisasi induk', en: 'Kitten calls and maternal vocalizations' },
    badgeColor: 'bg-pink-100 text-pink-800 border-pink-200',
    iconName: 'Baby',
  },
  {
    id: 'communication',
    name: { id: 'Komunikasi Kucing', en: 'Cat Dialogue' },
    subtitle: { id: 'Rangkaian dialog sosial kucing & manusia', en: 'Social dialogue between cats & humans' },
    badgeColor: 'bg-blue-100 text-blue-800 border-blue-200',
    iconName: 'MessageCircle',
  },
  {
    id: 'warning',
    name: { id: 'Marah & Peringatan', en: 'Defensive & Warning' },
    subtitle: { id: 'HANYA EDUKASI — Desisan dan geraman pertahanan', en: 'EDUCATIONAL ONLY — Defensive hiss & growl' },
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    iconName: 'AlertTriangle',
    isDefensiveCategory: true,
  },
  {
    id: 'ai_fun',
    name: { id: 'My Cat Fun — Suara AI', en: 'My Cat Fun — AI Synthetic' },
    subtitle: { id: 'Suara sintetis hiburan & eksperimental (Bukan kucing asli)', en: 'Synthetic entertainment & experimental sounds' },
    badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
    iconName: 'Bot',
  },
];

export const BUNDLED_AUDIO: AudioItem[] = [
  // --- Category A: Panggil Aku ---
  {
    id: 'call_siamese',
    title: 'Panggilan Penasaran (Kucing Siam)',
    category: 'call',
    description: {
      id: 'Vokalisasi nada tinggi khas kucing Siam untuk menyapa pemilik dan membuka interaksi.',
      en: 'High-pitched inquisitive meow characteristic of Siamese cats to initiate contact.',
    },
    educationalNote: {
      id: 'Kucing Siam terkenal sangat vokal. Nada tinggi ini sering digunakan untuk mencari tahu di mana anggota keluarga berada.',
      en: 'Siamese cats are famously vocal. This tone is commonly used to pinpoint where companions are located.',
    },
    audioType: 'real',
    duration: 1.5,
    audioUrl: '/audio/real/call_siamese.mp3',
    source: 'Wikimedia Commons (File:Meow of a Siamese cat - freemaster2.wav)',
    artist: 'freemaster2',
    license: 'CC0 1.0 Universal (Public Domain Dedication)',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    hasFile: true,
  },
  {
    id: 'call_short_meow',
    title: 'Meow Kontak Pendek',
    category: 'call',
    description: {
      id: 'Satu nada meow ramah bernada sedang yang sering digunakan kucing saat menyapa manusia.',
      en: 'A friendly, medium-pitch single meow used by cats when acknowledging humans.',
    },
    educationalNote: {
      id: 'Kucing dewasa jarang mengeong satu sama lain di alam liar; meow pendek ini berevolusi khusus untuk berinteraksi dengan manusia.',
      en: 'Adult cats rarely meow at other cats in the wild; short meows evolved primarily for human communication.',
    },
    audioType: 'real',
    duration: 1.2,
    audioUrl: '/audio/real/call_short_meow.mp3',
    source: 'Wikimedia Commons (File:Meow domestic cat.ogg)',
    artist: 'Smser',
    license: 'CC BY-SA 3.0 / GFDL',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    hasFile: true,
  },
  {
    id: 'call_crisp',
    title: 'Panggilan Akrab',
    category: 'call',
    description: {
      id: 'Vokalisasi pendek dan jelas dengan intonasi sedikit naik, menandakan rasa ingin tahu santai.',
      en: 'Crisp short vocalization with rising intonation, signaling gentle curiosity.',
    },
    educationalNote: {
      id: 'Intonasi nada yang naik (upward inflection) sering diasosiasikan dengan suasana hati positif dan tidak mengancam.',
      en: 'Upward inflections are typically associated with welcoming, non-confrontational feline moods.',
    },
    audioType: 'real',
    duration: 1.0,
    audioUrl: '/audio/real/call_crisp.mp3',
    source: 'Wikimedia Commons (File:Meow.ogg)',
    artist: 'Dcrosby',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    hasFile: true,
  },

  // --- Category B: Waktunya Makan ---
  {
    id: 'food_british_shorthair',
    title: 'Meow Meminta Makan (British Shorthair)',
    category: 'food',
    description: {
      id: 'Suara meow berulang dengan ritme mendesak saat kucing melihat persiapan makanan.',
      en: 'Rhythmic, insistent meow emitted while food is prepared or bowls are handled.',
    },
    educationalNote: {
      id: 'Riset bioakustik menunjukkan meow lapar sering menyisipkan frekuensi tinggi mirip tangisan bayi yang sulit diabaikan manusia.',
      en: 'Bioacoustic research demonstrates solicitation meows incorporate high frequencies mimicking distress cries.',
    },
    audioType: 'real',
    duration: 3.5,
    audioUrl: '/audio/real/food_british_shorthair.mp3',
    source: 'Wikimedia Commons (File:Weibliche Britisch Kurzhaar will Futter C1277 MIAUEN.wav)',
    artist: 'PantheraLeo1359531',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    hasFile: true,
  },
  {
    id: 'food_anticipation',
    title: 'Antisipasi Langkah Menuju Dapur',
    category: 'food',
    description: {
      id: 'Meow dinamis penuh semangat ketika mendampingi langkah kaki pemilik saat jam makan tiba.',
      en: 'Energetic vocalization escorting owner steps toward the meal preparation area.',
    },
    educationalNote: {
      id: 'Kucing memiliki ritme sirkadian yang terbiasa dengan jadwal makan. Vokalisasi ini berfungsi sebagai pengingat aktif.',
      en: 'Cats have strong internal circadian clocks and vocalize enthusiastically around habitual feeding hours.',
    },
    audioType: 'real',
    duration: 4.0,
    audioUrl: '/audio/real/food_anticipation.mp3',
    source: 'Wikimedia Commons (File:NoTrip.ogg)',
    artist: 'Heismark',
    license: 'Public Domain',
    licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
    hasFile: true,
  },

  // --- Category C: Ayo Bermain ---
  {
    id: 'play_impatient_energy',
    title: 'Celoteh Penuh Energi',
    category: 'play',
    description: {
      id: 'Vokalisasi cepat dan bersemangat yang dikeluarkan saat kucing aktif mengintai atau mengejar mainan.',
      en: 'Quick, spirited vocalization produced when a cat is keyed up and ready to chase toys.',
    },
    educationalNote: {
      id: 'Saat bersemangat bermain, kucing dapat menggabungkan dengkuran terputus dan meow pendek sebagai pelepasan adrenalin positif.',
      en: 'During play excitation, cats combine brief bursts and vocalizations as part of stimulated hunting drive.',
    },
    audioType: 'real',
    duration: 2.2,
    audioUrl: '/audio/real/play_impatient_energy.mp3',
    source: 'Wikimedia Commons (File:GettingOutImpatient.ogg)',
    artist: 'Heismark',
    license: 'Public Domain',
    licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
    hasFile: true,
  },

  // --- Category D: Tenang & Nyaman ---
  {
    id: 'calm_rhythmic_purr',
    title: 'Dengkuran Ritmis Santai (Purring)',
    category: 'calm',
    description: {
      id: 'Getaran frekuensi rendah (~25 Hz) yang stabil saat kucing sedang rileks dan dielus lembut.',
      en: 'Stable low-frequency vibration (~25 Hz) emitted during comfortable, affectionate petting.',
    },
    educationalNote: {
      id: 'Dengkuran dihasilkan oleh otot laring yang bergetar. Frekuensi 25-50 Hz juga diteliti memiliki efek regenerasi jaringan tulang.',
      en: 'Purring is produced by vibrating laryngeal muscles; frequencies between 25-50 Hz have natural therapeutic properties.',
    },
    audioType: 'real',
    duration: 6.0,
    audioUrl: '/audio/real/calm_rhythmic_purr.mp3',
    source: 'Wikimedia Commons (File:Cat purring.ogg)',
    artist: 'Peter Hull',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    hasFile: true,
  },
  {
    id: 'calm_bertie_purr',
    title: 'Dengkuran Lembut Bertie',
    category: 'calm',
    description: {
      id: 'Dengkur kontinu dengan pola pernapasan santai, tanda kenyamanan fisik dan lingkungan yang aman.',
      en: 'Continuous soothing purr paired with relaxed respiration, indicating contentment.',
    },
    educationalNote: {
      id: 'Meskipun purring sering menunjukkan kenyamanan, kucing juga kadang mendengkur untuk menenangkan diri saat stres atau sakit.',
      en: 'While purring usually signals contentment, cats also self-soothe with purring during stress or recovery.',
    },
    audioType: 'real',
    duration: 5.5,
    audioUrl: '/audio/real/calm_bertie_purr.mp3',
    source: 'Wikimedia Commons (File:Purring cat bertie.ogg)',
    artist: 'jim_mowatt',
    license: 'Public Domain',
    licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
    hasFile: true,
  },

  // --- Category F: Komunikasi Kucing ---
  {
    id: 'comm_meow_series',
    title: 'Dialog Vokal Bertingkat',
    category: 'communication',
    description: {
      id: 'Rangkaian suara meow percakapan yang bervariasi dalam nada dan intonasi ekspresif.',
      en: 'A multi-tone conversational meow sequence displaying expressive pitch variations.',
    },
    educationalNote: {
      id: 'Kucing dapat membedakan tanggapan manusia dan menyesuaikan modulasi suara jika pemiliknya sering merespons percakapan vokal.',
      en: 'Cats adapt vocal modulations over time based on how attentively their human caregivers respond.',
    },
    audioType: 'real',
    duration: 4.5,
    audioUrl: '/audio/real/comm_meow_series.mp3',
    source: 'Wikimedia Commons (File:Audio file of cat meowing.ogg)',
    artist: 'Yair Haklai',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    hasFile: true,
  },
  {
    id: 'comm_social_call',
    title: 'Panggilan Sosial Felis Catus',
    category: 'communication',
    description: {
      id: 'Vokalisasi terbuka khas kucing domestik yang ditujukan untuk menjalin kontak dengan manusia.',
      en: 'Open social meow of domestic cats intended to establish and maintain human contact.',
    },
    educationalNote: {
      id: 'Rentang frekuensi vokal kucing domestik berada di antara 700 Hz hingga 3 kHz, area di mana pendengaran manusia paling sensitif.',
      en: 'Domestic cat meows sit neatly in the 700 Hz - 3 kHz range where human ear sensitivity peaks.',
    },
    audioType: 'real',
    duration: 4.0,
    audioUrl: '/audio/real/comm_social_call.mp3',
    source: 'Wikimedia Commons (File:Felis silvestris catus meows.ogg)',
    artist: 'Tobias Puderer',
    license: 'CC BY-SA 3.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
    hasFile: true,
  },

  // --- Category G: Marah & Peringatan (Animal Welfare Warning) ---
  {
    id: 'warning_defensive_hiss',
    title: 'Desisan Bertahan (Defensive Hiss)',
    category: 'warning',
    description: {
      id: 'Hembusan udara cepat bertekanan tinggi saat kucing merasa sangat terpojok atau terancam.',
      en: 'High-pressure burst of air produced when a cat feels cornered or intensely threatened.',
    },
    educationalNote: {
      id: 'Desisan adalah sinyal jarak jauh agar lawan menjauh. Jangan pernah mendekati atau menghukum kucing yang mendesis.',
      en: 'A hiss is a distance-increasing warning. Never punish or corner a hissing cat; give them quiet space.',
    },
    audioType: 'real',
    duration: 2.5,
    audioUrl: '/audio/real/warning_defensive_hiss.mp3',
    source: 'Wikimedia Commons (File:Cat hissing - Zabuhailo.wav)',
    artist: 'Zabuhailo',
    license: 'CC0 1.0 Universal',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    hasFile: true,
    isDefensive: true,
    safetyWarning: {
      id: 'PERINGATAN KESEJAHTERAAN HEWAN: Jangan putar suara ini di dekat kucing Anda! Suara ini hanya untuk tujuan edukasi manusia guna mengenali sinyal ketakutan dan batas kenyamanan kucing.',
      en: 'ANIMAL WELFARE WARNING: Do NOT play this sound near real cats! This recording is strictly for human education to recognize feline stress signals.',
    },
  },

  // --- Category: My Cat Fun — Suara AI ---
  {
    id: 'ai_meow_retro8bit',
    title: 'Meow Synth Retro 8-Bit',
    category: 'ai_fun',
    description: {
      id: 'Sintesis gelombang nada meow gaya konsol game 8-bit klasik.',
      en: 'Synthesized 8-bit chiptune style meow waveform for retro game fun.',
    },
    educationalNote: {
      id: 'Catatan: Ini adalah audio sintetis buatan (AI/Synth) untuk hiburan. Bukan vokalisasi alami kucing.',
      en: 'Note: This is an artificial synthetic sound for entertainment. Not natural cat communication.',
    },
    audioType: 'ai',
    duration: 1.2,
    audioUrl: '/audio/ai/ai_meow_retro8bit.mp3',
    source: 'My Cat Synthetic Engine (FFmpeg Audio Synthesizer)',
    artist: 'My Cat Studio (AI Synthesized)',
    license: 'CC0 1.0 Universal (Open Entertainment)',
    hasFile: true,
  },
  {
    id: 'ai_space_purr',
    title: 'Purr Harmonik Ruang Angkasa',
    category: 'ai_fun',
    description: {
      id: 'Dengkuran sintetis berfrekuensi rendah dengan modulasi ruang angkasa fiksi.',
      en: 'Low-frequency drone purr modulated with ambient space harmonics.',
    },
    educationalNote: {
      id: 'Catatan: Audio sintetis eksperimental. Kucing Anda mungkin tidak mengenali ini sebagai sesama kucing.',
      en: 'Note: Experimental synthetic audio. Your cat likely will not perceive this as feline communication.',
    },
    audioType: 'ai',
    duration: 3.0,
    audioUrl: '/audio/ai/ai_space_purr.mp3',
    source: 'My Cat Synthetic Engine (FFmpeg Audio Synthesizer)',
    artist: 'My Cat Studio (AI Synthesized)',
    license: 'CC0 1.0 Universal (Open Entertainment)',
    hasFile: true,
  },
  {
    id: 'ai_fantasy_chirp',
    title: 'Chirp Melodi Fantasi',
    category: 'ai_fun',
    description: {
      id: 'Kicauan melodi bergelombang vibrato lembut ala karakter kartun imajiner.',
      en: 'Gentle vibrato synth chirp resembling imaginary cartoon creature sounds.',
    },
    educationalNote: {
      id: 'Catatan: Diciptakan murni untuk efek suara hiburan dan interaksi kreatif.',
      en: 'Note: Created purely for entertainment sound design and creative experiments.',
    },
    audioType: 'ai',
    duration: 1.5,
    audioUrl: '/audio/ai/ai_fantasy_chirp.mp3',
    source: 'My Cat Synthetic Engine (FFmpeg Audio Synthesizer)',
    artist: 'My Cat Studio (AI Synthesized)',
    license: 'CC0 1.0 Universal (Open Entertainment)',
    hasFile: true,
  },
];
