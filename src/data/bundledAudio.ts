import type { AudioItem, AudioCategory } from '../types/index.ts';

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
    subtitle: { id: 'Meow mendesak saat meminta makanan', en: 'Urgent meows during food solicitation' },
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    iconName: 'Utensils',
  },
  {
    id: 'play',
    name: { id: 'Ayo Bermain & Beraktivitas', en: 'Play & Activity' },
    subtitle: { id: 'Celoteh ceria, rasa penasaran, dan vokalisasi aktif', en: 'Playful chirps, curiosity, and active vocalizations' },
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
    subtitle: { id: 'Panggilan anak kucing dan vokalisasi induk (Belum ada audio terverifikasi)', en: 'Kitten calls and maternal vocalizations (No verified bundled audio yet)' },
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
    subtitle: { id: 'HANYA EDUKASI — Desisan pertahanan (Jangan putar dekat kucing)', en: 'EDUCATIONAL ONLY — Defensive hiss (Do not play near cats)' },
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    iconName: 'AlertTriangle',
    isDefensiveCategory: true,
  },
  {
    id: 'ai_fun',
    name: { id: 'My Cat Fun — Efek Suara Sintetis', en: 'My Cat Fun — Procedural Synth Effects' },
    subtitle: { id: 'Efek audio sintetis prosedural (Bukan rekaman asli, bukan model AI)', en: 'Procedural synth audio effects (Not real cats, not generative AI)' },
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
    duration: 1.6,
    audioUrl: '/audio/real/call_siamese.mp3',
    source: 'Wikimedia Commons (File:Meow of a Siamese cat - freemaster2.wav)',
    artist: 'freemaster2',
    license: 'CC0 1.0 Universal (Public Domain Dedication)',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    hasFile: true,
  },
  {
    id: 'call_crisp',
    title: 'Panggilan Akrab Silas',
    category: 'call',
    description: {
      id: 'Vokalisasi pendek dan jelas dengan intonasi ramah khas kucing Silas (rekaman Dan Crosby).',
      en: 'Crisp short friendly meow from cat Silas (recorded by Dan Crosby).',
    },
    educationalNote: {
      id: 'Intonasi nada yang sedikit naik sering diasosiasikan dengan suasana hati positif dan sapaan akrab terhadap manusia yang dikenal.',
      en: 'Upward inflections are typically associated with welcoming, non-confrontational feline moods toward familiar humans.',
    },
    audioType: 'real',
    duration: 0.8,
    audioUrl: '/audio/real/call_crisp.mp3',
    source: 'Wikimedia Commons (File:Meow.ogg)',
    artist: 'Dan Crosby (Dcrosby)',
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
      id: 'Suara meow berulang dengan ritme mendesak saat kucing betina British Shorthair meminta pakan.',
      en: 'Rhythmic, insistent meow emitted while female British Shorthair solicits food.',
    },
    educationalNote: {
      id: 'Riset bioakustik menunjukkan solicitation meow (meminta makan) sering menyisipkan komponen frekuensi mirip rengekan yang memicu perhatian insting manusia.',
      en: 'Bioacoustic research demonstrates solicitation meows incorporate acoustic components that capture human caregiving instincts.',
    },
    audioType: 'real',
    duration: 12.0,
    audioUrl: '/audio/real/food_british_shorthair.mp3',
    source: 'Wikimedia Commons (File:Weibliche Britisch Kurzhaar will Futter C1277 MIAUEN.wav)',
    artist: 'PantheraLeo1359531',
    license: 'CC BY 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by/4.0/',
    hasFile: true,
  },

  // --- Category C: Ayo Bermain & Beraktivitas ---
  {
    id: 'play_impatient_energy',
    title: 'Meow Tak Sabar Ingin Keluar (Jalan-Jalan)',
    category: 'play',
    description: {
      id: 'Vokalisasi bersemangat dan tidak sabar saat kucing mengetahui bahwa ia akan diajak keluar rumah untuk berjalan-jalan (Heismark).',
      en: 'Energetic, impatient vocalization produced when the cat knows it is getting out for a walk (Heismark).',
    },
    educationalNote: {
      id: 'Kucing mengekspresikan antisipasi aktif dan peningkatan adrenalin positif melalui nada meow cepat saat mengenali rutinitas kegiatan yang disukainya.',
      en: 'The cat expresses active excitement and positive adrenaline via rapid vocalizations upon recognizing anticipated outdoor activities.',
    },
    audioType: 'real',
    duration: 9.5,
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
      id: 'Getaran frekuensi rendah (~25 Hz) yang stabil saat kucing rumahan sedang rileks dan dielus lembut.',
      en: 'Stable low-frequency vibration (~25 Hz) emitted during comfortable, affectionate petting of a house cat.',
    },
    educationalNote: {
      id: 'Dengkuran dihasilkan oleh impuls saraf ritmis pada otot laring. Getaran pada rentang 25-50 Hz diteliti memiliki efek menenangkan dan regenerasi jaringan.',
      en: 'Purring is produced by rhythmic neural twitching of laryngeal muscles; frequencies around 25-50 Hz have natural therapeutic properties.',
    },
    audioType: 'real',
    duration: 12.0,
    audioUrl: '/audio/real/calm_rhythmic_purr.mp3',
    source: 'Wikimedia Commons (File:Cat purring.ogg)',
    artist: 'Peter Hull',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    hasFile: true,
  },
  {
    id: 'calm_bertie_purr',
    title: 'Dengkuran Lembut Bertie Wooster',
    category: 'calm',
    description: {
      id: 'Dengkur kontinu dengan pola pernapasan santai dari kucing bernama Bertie Wooster (rekaman jim_mowatt).',
      en: 'Continuous soothing purr paired with relaxed respiration from cat Bertie Wooster (recorded by jim_mowatt).',
    },
    educationalNote: {
      id: 'Kucing mendengkur pada saat bernapas masuk maupun keluar. Ini adalah sinyal sosial ketenangan lingkungan tanpa ancaman.',
      en: 'Cats purr during both inhalation and exhalation, signaling calm safety in their immediate environment.',
    },
    audioType: 'real',
    duration: 8.8,
    audioUrl: '/audio/real/calm_bertie_purr.mp3',
    source: 'Wikimedia Commons (File:Purring cat bertie.ogg / PDSounds)',
    artist: 'jim_mowatt',
    license: 'Public Domain',
    licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
    hasFile: true,
  },

  // --- Category F: Komunikasi Kucing ---
  {
    id: 'comm_no_trip',
    title: 'Percakapan Ingin Keluar Rumah (No Trip)',
    category: 'communication',
    description: {
      id: 'Percakapan vokal nyata di mana kucing meminta izin keluar 3 kali, pemilik menjawab "Tidak", lalu kucing merespons dengan intonasi kecewa (Heismark).',
      en: 'Real conversational recording where the cat asks three times to go outdoors, the human says "No", and the cat responds with a distinct regretful tone (Heismark).',
    },
    educationalNote: {
      id: 'Dokumentasi otentik komunikasi timbal-balik manusia-kucing oleh Heismark (Public Domain), membuktikan fleksibilitas modulasi intonasi vokal kucing terhadap kata pemilik.',
      en: 'Authentic human-cat communicative exchange documented by Heismark (Public Domain), highlighting feline intonational adaptation.',
    },
    audioType: 'real',
    duration: 11.2,
    audioUrl: '/audio/real/comm_no_trip.mp3',
    source: 'Wikimedia Commons (File:NoTrip.ogg)',
    artist: 'Heismark',
    license: 'Public Domain',
    licenseUrl: 'https://creativecommons.org/publicdomain/mark/1.0/',
    hasFile: true,
  },
  {
    id: 'comm_meow_series',
    title: 'Vokalisasi Panggilan Estrus (Mating Call)',
    category: 'communication',
    description: {
      id: 'Vokalisasi intensif kucing betina pada siklus estrus (birahi reproduktif) yang direkam di Yerusalem (Yair Haklai).',
      en: 'Intensive vocalization of a female cat in reproductive estrus looking for mates, recorded in Jerusalem (Yair Haklai).',
    },
    educationalNote: {
      id: 'Vokalisasi estrus memiliki amplitudo dan intonasi bergelombang khas yang ditujukan untuk terdengar melintasi jarak jauh ke pejantan sekitar.',
      en: 'Estrus vocalizations have undulating amplitude and frequency designed to carry over long distances to prospective mates.',
    },
    audioType: 'real',
    duration: 12.0,
    audioUrl: '/audio/real/comm_meow_series.mp3',
    source: 'Wikimedia Commons (File:Audio file of cat meowing.ogg)',
    artist: 'Yair Haklai',
    license: 'CC BY-SA 4.0',
    licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    hasFile: true,
  },
  {
    id: 'comm_social_call',
    title: '5 Meow Meminta Perhatian',
    category: 'communication',
    description: {
      id: 'Rangkaian lima kali nada meow berturut-turut yang dikeluarkan kucing untuk memanggil perhatian manusia (Tobias Puderer).',
      en: 'A sequence of five consecutive meow calls emitted by a domestic cat soliciting human attention (Tobias Puderer).',
    },
    educationalNote: {
      id: 'Frekuensi vokal kucing domestik berada di sekitar rentang sensitivitas telinga manusia (1-3 kHz), memfasilitasi komunikasi antarspsies yang efektif.',
      en: 'Domestic cat meows sit neatly in the 1-3 kHz frequency range where human auditory perception is most attuned.',
    },
    audioType: 'real',
    duration: 10.7,
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
      id: 'Hembusan udara cepat bertekanan tinggi saat kucing merasa terancam setelah mendengar suara asing yang mengejutkan (Zabuhailo).',
      en: 'High-pressure burst of air produced by an alarmed cat responding defensively to sudden noise (Zabuhailo).',
    },
    educationalNote: {
      id: 'Desisan adalah sinyal jarak jauh agar pihak lain menjauh. Jangan pernah mendekati, memegang, atau menghukum kucing yang mendesis.',
      en: 'A hiss is a defensive distance-increasing warning. Never approach, grab, or punish a hissing cat; grant them space immediately.',
    },
    audioType: 'real',
    duration: 2.4,
    audioUrl: '/audio/real/warning_defensive_hiss.mp3',
    source: 'Wikimedia Commons (File:Cat hissing - Zabuhailo.wav / Freesound)',
    artist: 'Zabuhailo',
    license: 'CC0 1.0 Universal',
    licenseUrl: 'https://creativecommons.org/publicdomain/zero/1.0/',
    hasFile: true,
    isDefensive: true,
    safetyWarning: {
      id: 'PERINGATAN KESEJAHTERAAN HEWAN: Jangan putar suara ini di dekat kucing Anda! Rekaman ini hanya untuk tujuan edukasi manusia guna mengenali sinyal ketakutan dan batas kenyamanan kucing.',
      en: 'ANIMAL WELFARE WARNING: Do NOT play this sound near real cats! This recording is strictly for human education to recognize feline stress signals.',
    },
  },

  // --- Category: My Cat Fun — Efek Suara Sintetis (Procedural Synthesis) ---
  {
    id: 'ai_meow_retro8bit',
    title: 'Meow Sintetis Retro 8-Bit',
    category: 'ai_fun',
    description: {
      id: 'Efek suara gelombang nada meow gaya konsol game 8-bit klasik yang disintesis melalui osilator frekuensi.',
      en: '8-bit chiptune style meow sound effect procedurally synthesized via frequency oscillators.',
    },
    educationalNote: {
      id: 'Transparansi: Ini adalah efek audio sintetis prosedural (bukan rekaman kucing asli dan bukan model AI generatif). Dibuat murni untuk hiburan santai.',
      en: 'Transparency: This is a procedural synthesized audio effect (not a real cat, not generative AI). Created purely for entertainment.',
    },
    audioType: 'procedural_synth',
    duration: 0.6,
    audioUrl: '/audio/ai/ai_meow_retro8bit.mp3',
    source: 'Procedural Oscillator Audio Generator',
    artist: 'My Cat Audio Lab (Procedural Synthesis)',
    license: 'CC0 1.0 Universal (Open Entertainment)',
    hasFile: true,
  },
  {
    id: 'ai_space_purr',
    title: 'Purr Sintetis Ruang Angkasa',
    category: 'ai_fun',
    description: {
      id: 'Efek dengkuran frekuensi rendah dengan modulasi tremolo 25 Hz bergaya ambient fiksi.',
      en: 'Low-frequency drone purr modulated with 25 Hz tremolo resembling fictional ambient space audio.',
    },
    educationalNote: {
      id: 'Transparansi: Efek sintetis prosedural eksperimental. Kucing Anda tidak akan mengenali ini sebagai sesama kucing.',
      en: 'Transparency: Experimental procedural synthetic effect. Your cat will not perceive this as feline purring.',
    },
    audioType: 'procedural_synth',
    duration: 3.0,
    audioUrl: '/audio/ai/ai_space_purr.mp3',
    source: 'Procedural Oscillator Audio Generator',
    artist: 'My Cat Audio Lab (Procedural Synthesis)',
    license: 'CC0 1.0 Universal (Open Entertainment)',
    hasFile: true,
  },
  {
    id: 'ai_fantasy_chirp',
    title: 'Chirp Melodi Sintetis Fantasi',
    category: 'ai_fun',
    description: {
      id: 'Kicauan melodi sintetis bergelombang vibrato lembut ala karakter animasi fiktif.',
      en: 'Gentle vibrato procedural synth chirp resembling animated fantasy creature sound design.',
    },
    educationalNote: {
      id: 'Transparansi: Dibuat murni menggunakan generator nada osilator untuk variasi efek suara.',
      en: 'Transparency: Produced using tonal audio oscillators for sound design experimentation.',
    },
    audioType: 'procedural_synth',
    duration: 1.5,
    audioUrl: '/audio/ai/ai_fantasy_chirp.mp3',
    source: 'Procedural Oscillator Audio Generator',
    artist: 'My Cat Audio Lab (Procedural Synthesis)',
    license: 'CC0 1.0 Universal (Open Entertainment)',
    hasFile: true,
  },
];
