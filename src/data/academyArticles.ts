export interface AcademyArticle {
  id: string;
  title: {
    id: string;
    en: string;
  };
  category: {
    id: string;
    en: string;
  };
  summary: {
    id: string;
    en: string;
  };
  readMinutes: number;
  iconName: string;
  badgeColor: string;
  sections: {
    heading: { id: string; en: string };
    content: { id: string; en: string };
  }[];
  practicalTips: { id: string; en: string }[];
  editorialNotice?: { id: string; en: string };
}

export interface BodyLanguageItem {
  part: { id: string; en: string };
  signal: { id: string; en: string };
  meaning: { id: string; en: string };
  status: 'friendly' | 'curious' | 'warning' | 'relaxed';
  advice: { id: string; en: string };
}

export const BODY_LANGUAGE_GUIDE: BodyLanguageItem[] = [
  {
    part: { id: 'Ekor Tegak Lurus', en: 'Tail Straight Up' },
    signal: { id: 'Tegak ke atas dengan ujung sedikit melengkung seperti tanda tanya (?)', en: 'Held straight up with tip gently curved like a question mark' },
    meaning: { id: 'Percaya diri, ramah, dan menyambut interaksi hangat.', en: 'Confident, friendly, welcoming warm engagement.' },
    status: 'friendly',
    advice: { id: 'Waktu yang tepat untuk menyapa atau memberikan elusan lembut di pipi.', en: 'Great time to greet them or gently stroke their cheeks.' },
  },
  {
    part: { id: 'Ekor Mengibas Cepat', en: 'Fast Swishing Tail' },
    signal: { id: 'Ujung ekor mengibas ke kiri dan kanan dengan cepat atau menghentak lantai', en: 'Tail whipping side-to-side quickly or thumping against floor' },
    meaning: { id: 'Tanda iritasi, frustrasi, atau overstimulasi sensorik.', en: 'Signs of irritation, sensory overstimulation, or frustration.' },
    status: 'warning',
    advice: { id: 'Segera hentikan sentuhan dan biarkan kucing menenangkan diri.', en: 'Immediately stop petting and give the cat space to decompress.' },
  },
  {
    part: { id: 'Telinga Mengarah ke Depan', en: 'Ears Facing Forward' },
    signal: { id: 'Telinga tegak rileks mengarah ke sumber suara atau objek menarik', en: 'Ears erect and alert pointing toward sound or visual focus' },
    meaning: { id: 'Tertarik, penasaran, dan fokus pada eksplorasi positif.', en: 'Curious, interested, engaged in safe exploration.' },
    status: 'curious',
    advice: { id: 'Bagus untuk mengenalkan mainan interaktif atau mengamati suara baru.', en: 'Great opportunity for interactive feather play or testing novel sounds.' },
  },
  {
    part: { id: 'Telinga Pesawat (Airplane Ears)', en: 'Airplane Ears (Flat)' },
    signal: { id: 'Telinga diputar ke samping dan diratakan ke belakang kepala', en: 'Ears turned sideways and pinned flat against the skull' },
    meaning: { id: 'Takut, sangat terancam, atau bersiap untuk mempertahankan diri.', en: 'Intense fear, perceived threat, or defensive readiness.' },
    status: 'warning',
    advice: { id: 'JANGAN dekati dengan tangan! Hentikan semua suara dan hindari kontak mata langsung.', en: 'NEVER approach! Silence all sounds and avoid direct confrontational eye contact.' },
  },
  {
    part: { id: 'Kedipan Lambat (Slow Blink)', en: 'Slow Blink (Cat Kiss)' },
    signal: { id: 'Menatap santai lalu menutup dan membuka mata secara perlahan', en: 'Gazing gently then closing and opening eyes in a slow rhythm' },
    meaning: { id: 'Tanda kepercayaan mendalam dan perasaan aman di dekat Anda.', en: 'Deep trust, affection, and feeling completely secure with you.' },
    status: 'relaxed',
    advice: { id: 'Balas dengan kedipan lambat lembut untuk menegaskan kembali ikatan persahabatan.', en: 'Blink slowly in return to reaffirm your mutual bond and safety.' },
  },
  {
    part: { id: 'Kumis Rileks Menyebar', en: 'Relaxed Whiskers' },
    signal: { id: 'Kumis terbentang santai ke samping tanpa tegang', en: 'Whiskers splayed loosely to the sides without tension' },
    meaning: { id: 'Kondisi rileks, tenang, dan tidak merasakan ancaman lingkungan.', en: 'Calm emotional state, no perceived environmental threat.' },
    status: 'relaxed',
    advice: { id: 'Kucing merasa nyaman di lingkungannya saat ini.', en: 'The cat feels peaceful and settled in its immediate environment.' },
  },
];

export const ACADEMY_ARTICLES: AcademyArticle[] = [
  {
    id: 'why-cats-meow',
    title: {
      id: 'Mengapa Kucing Mengeong pada Manusia?',
      en: 'Why Do Cats Meow at Humans?',
    },
    category: {
      id: 'Komunikasi Vokal',
      en: 'Vocal Communication',
    },
    summary: {
      id: 'Fakta menarik bahwa meow dewasa adalah jembatan komunikasi khusus yang dikembangkan kucing untuk berdialog dengan manusia.',
      en: 'The fascinating reality that adult meowing is a bespoke vocal bridge cats developed to interact with humans.',
    },
    readMinutes: 3,
    iconName: 'MessageSquare',
    badgeColor: 'bg-orange-100 text-orange-800 border-orange-200',
    sections: [
      {
        heading: {
          id: 'Perbedaan Alam Liar dan Domestik',
          en: 'Wild vs. Domestic Differences',
        },
        content: {
          id: 'Di alam bebas, kucing dewasa umumnya berkomunikasi satu sama lain melalui aroma (feromon), bahasa tubuh, dan kontak mata. Mereka jarang sekali mengeong antar sesama kucing dewasa kecuali anak kucing kepada induknya.',
          en: 'In the wild, adult felids primarily communicate via scent markings, posture, and subtle facial cues. Adult cats rarely meow at peers unless a kitten is signaling its mother.',
        },
      },
      {
        heading: {
          id: 'Adaptasi Terhadap Pendengaran Manusia',
          en: 'Adapting to Human Auditory Sensitivity',
        },
        content: {
          id: 'Karena manusia kurang peka terhadap aroma feromon dan gerak mikro tubuh, kucing belajar bahwa suara vokal sangat efektif memancing perhatian manusia. Setiap kucing bahkan mengembangkan "kamus meow" unik dengan pemiliknya.',
          en: 'Because humans lack fine pheromone detection, cats adapted by vocalizing. Over time, each companion cat co-creates a custom sound vocabulary with their specific human.',
        },
      },
    ],
    practicalTips: [
      {
        id: 'Dengarkan nada: meow bernada tinggi biasanya bersifat ramah/menyapa, sedangkan nada rendah berulang sering menandakan tuntutan atau keluhan.',
        en: 'Tune your ears: higher pitches convey friendly greetings, while repetitive lower tones signal demands or unease.',
      },
      {
        id: 'Jangan abaikan meow yang tiba-tiba berubah frekuensi atau intensitasnya tanpa sebab jelas, karena bisa menandakan ketidaknyamanan fisik.',
        en: 'Never ignore abrupt changes in vocal habits, as sudden changes can reflect underlying medical discomfort.',
      },
    ],
    editorialNotice: {
      id: 'Materi edukasi umum berdasarkan observasi etologi kucing domestik. Bukan diagnosa medis.',
      en: 'General educational content based on feline behavioral ethology. Not a clinical diagnosis.',
    },
  },
  {
    id: 'purring-mysteries',
    title: {
      id: 'Rahasia Dengkuran: Kapan Kucing Melakukannya?',
      en: 'The Purring Mystery: Why and When Cats Purr',
    },
    category: {
      id: 'Bioakustik Kucing',
      en: 'Feline Bioacoustics',
    },
    summary: {
      id: 'Dengkuran bukan hanya tanda kebahagiaan. Pelajari bagaimana getaran ajaib ini juga berfungsi sebagai mekanisme penyembuhan diri.',
      en: 'Purring is not solely an indicator of joy. Discover how this vibration also aids self-healing and stress soothing.',
    },
    readMinutes: 4,
    iconName: 'Activity',
    badgeColor: 'bg-teal-100 text-teal-800 border-teal-200',
    sections: [
      {
        heading: {
          id: 'Bagaimana Dengkuran Dihasilkan?',
          en: 'How Is Purring Generated?',
        },
        content: {
          id: 'Dengkuran dihasilkan oleh impuls saraf berulang yang menggetarkan otot laring (pita suara) secara ritmis saat bernapas masuk maupun keluar. Frekuensinya berkisar 20 hingga 140 Hz.',
          en: 'Purring is triggered by neural oscillators driving rapid twitching of laryngeal muscles during both inhalation and exhalation, typically oscillating at 20-140 Hz.',
        },
      },
      {
        heading: {
          id: 'Purring Sebagai Mekanisme Pemulihan',
          en: 'Purring as a Regenerative Mechanism',
        },
        content: {
          id: 'Penelitian bioakustik menunjukkan bahwa getaran pada frekuensi 25-50 Hz dapat merangsang kepadatan tulang dan membantu meredakan rasa sakit. Oleh karena itu, kucing yang sedang sakit atau melahirkan juga sering mendengkur untuk menenangkan diri.',
          en: 'Acoustic frequencies around 25-50 Hz are documented to stimulate bone density and ease musculoskeletal tension. Injured cats purr to self-medicate and soothe pain.',
        },
      },
    ],
    practicalTips: [
      {
        id: 'Perhatikan bahasa tubuh saat mendengkur: jika tubuh rileks dan mata menyipit, itu dengkuran bahagia.',
        en: 'Cross-check posture with purring: relaxed limbs and softened eyes verify genuine contentment.',
      },
      {
        id: 'Jika kucing mendengkur dengan tubuh kaku, napas berat, atau bersembunyi, segera periksa kondisi kesehatannya.',
        en: 'If purring accompanies stiff posture, labored breathing, or hiding, consult a veterinarian promptly.',
      },
    ],
    editorialNotice: {
      id: 'Materi dirangkum dari literatur etologi dan bioakustik kedokteran hewan umum.',
      en: 'Summarized from veterinary ethology and feline bioacoustic literature.',
    },
  },
  {
    id: 'trilling-and-chirping',
    title: {
      id: 'Trill, Chirp, & Celoteh: Vokalisasi Pemburu',
      en: 'Trills, Chirps & Chatter: The Hunter’s Voice',
    },
    category: {
      id: 'Perilaku Berburu',
      en: 'Hunting Behaviors',
    },
    summary: {
      id: 'Mengapa kucing mengeluarkan suara klik atau getaran unik saat melihat burung di balik jendela?',
      en: 'Why do cats chatter their jaws or emit chattering clicks when watching birds through windows?',
    },
    readMinutes: 3,
    iconName: 'Bird',
    badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    sections: [
      {
        heading: {
          id: 'Trill Ramah (Rolling R Sound)',
          en: 'Friendly Trills (Rolling Sound)',
        },
        content: {
          id: 'Trill adalah suara kombinasi antara meow dan purr dengan getaran lidah lembut ("brrr-ow"). Ini adalah salam hangat yang diwarisi dari cara induk memanggil anak-anaknya.',
          en: 'A trill is a melodious blend between a purr and a meow. It originates as an affectionate maternal call summoning kittens.',
        },
      },
      {
        heading: {
          id: 'Chatter Gigi Saat Melihat Mangsa',
          en: 'Jaw Chattering at Prey',
        },
        content: {
          id: 'Gerakan rahang cepat disertai suara klik yang muncul saat mengamati mangsa di luar jangkauan diyakini mencerminkan lonjakan adrenalin perburuan bercampur sedikit rasa frustrasi karena tidak dapat menerkam langsung.',
          en: 'Rapid jaw chattering when viewing unreachable prey is believed to represent hunting anticipation paired with predatory excitation.',
        },
      },
    ],
    practicalTips: [
      {
        id: 'Ketika kucing Anda melakukan trill menyambut Anda pulang, balas dengan suara lembut atau belaian di pangkal dagu.',
        en: 'When your cat greets you with a cheery trill, acknowledge them with gentle verbal warmth or a chin stroke.',
      },
      {
        id: 'Sediakan mainan tongkat bulu ketika kucing mulai berceloteh melihat jendela untuk menyalurkan energi berburunya secara aman.',
        en: 'Channel window-chattering excitement into a safe interactive feather wand play session.',
      },
    ],
  },
  {
    id: 'defensive-sounds-boundaries',
    title: {
      id: 'Desisan & Geraman: Menghormati Batasan Kucing',
      en: 'Hissing & Growls: Respecting Feline Boundaries',
    },
    category: {
      id: 'Kesejahteraan Hewan',
      en: 'Animal Welfare',
    },
    summary: {
      id: 'Panduan penting tentang suara pertahanan. Kucing mendesis bukan karena "nakal", tetapi karena merasa takut atau terpojok.',
      en: 'Critical welfare guide on defensive calls. A hiss is not disobedience, but a genuine expression of fear or boundary.',
    },
    readMinutes: 4,
    iconName: 'ShieldAlert',
    badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
    sections: [
      {
        heading: {
          id: 'Desisan Adalah Sinyal Peringatan Damai',
          en: 'A Hiss Is a Peaceful Distance Warning',
        },
        content: {
          id: 'Kucing sebenarnya berusaha menghindari perkelahian fisik yang berisiko cedera. Desisan adalah cara mereka berkata: "Tolong berhenti, saya merasa terancam, beri saya ruang sekarang."',
          en: 'Cats naturally try to avoid physical fights that cause injuries. A hiss is an honest boundary signal stating: "I feel threatened, back away."',
        },
      },
      {
        heading: {
          id: 'Jangan Pernah Menghukum Kucing yang Mendesis',
          en: 'Never Punish a Hissing Cat',
        },
        content: {
          id: 'Menghukum, membentak, atau memaksa memegang kucing yang mendesis akan merusak rasa percaya mereka dan dapat memicu gigitan pertahanan diri. Mundurlah perlahan dan biarkan ruangan tenang.',
          en: 'Punishing, yelling at, or cornering a hissing cat destroys trust and will escalate defensiveness into reactive scratches or bites. Step back calmly.',
        },
      },
    ],
    practicalTips: [
      {
        id: 'Berikan jalur keluar (exit route) bagi kucing agar tidak merasa terjebak di sudut ruangan.',
        en: 'Always leave an unobstructed escape route so the cat never feels trapped in an inescapable corner.',
      },
      {
        id: 'Jangan memainkan audio suara desisan atau ancaman di dekat kucing sungguhan karena dapat menimbulkan kecemasan berat.',
        en: 'Never playback recorded hisses or aggressive sounds near living cats; it causes distress and confusion.',
      },
    ],
    editorialNotice: {
      id: 'Disusun sesuai standar etika kesejahteraan hewan dan penanganan bebas rasa takut (Fear Free Pets guidelines).',
      en: 'Formulated in accordance with animal welfare principles and Fear-Free handling standards.',
    },
  },
  {
    id: 'safe-interaction-guidelines',
    title: {
      id: 'Panduan Berinteraksi yang Aman & Bahagia',
      en: 'Guidelines for Safe & Joyful Interactions',
    },
    category: {
      id: 'Hubungan & Ikatan',
      en: 'Bonding & Safety',
    },
    summary: {
      id: 'Cara membangun rasa percaya, aturan "tes jari telunjuk", dan area sentuhan yang paling disukai kucing.',
      en: 'How to build lasting trust, the "index finger test", and the most comforting tactile areas for cats.',
    },
    readMinutes: 3,
    iconName: 'Smile',
    badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
    sections: [
      {
        heading: {
          id: 'Aturan Tes Jari Telunjuk (The Finger Test)',
          en: 'The Index Finger Invitation',
        },
        content: {
          id: 'Alih-alih langsung menyentuh kepala, ulurkan jari telunjuk Anda setinggi hidung kucing pada jarak 15-20 cm. Jika kucing mendekat dan menggosokkan pipinya, itu tanda persetujuan (consent) untuk berinteraksi.',
          en: 'Rather than reaching over their head, present your curled index finger at nose height 15-20 cm away. If the cat rubs its cheeks against your finger, consent is granted.',
        },
      },
      {
        heading: {
          id: 'Area Sentuhan Favorit vs. Area Rawan',
          en: 'Preferred Petting Zones vs. Sensitive Zones',
        },
        content: {
          id: 'Sebagian besar kucing menyukai sentuhan di sekitar kelenjar aroma: di bawah dagu, pangkal telinga, dan pipi. Hindari memegang perut, kaki belakang, dan ekor kecuali kucing Anda sangat mempercayai Anda.',
          en: 'Most cats adore strokes near facial scent glands: under the chin, base of the ears, and cheeks. Avoid the vulnerable belly and hind paws.',
        },
      },
    ],
    practicalTips: [
      {
        id: 'Berikan jeda setiap 30 detik elusan untuk melihat apakah kucing masih meminta sentuhan lanjutan atau sudah cukup.',
        en: 'Pause every 30 seconds of petting to check if the cat actively asks for more or is satiated.',
      },
      {
        id: 'Biarkan kucing yang berinisiatif memulai dan mengakhiri sesi interaksi.',
        en: 'Always allow the cat to initiate and terminate sessions on their own terms.',
      },
    ],
  },
];

export const REFERENCES_LIST = [
  {
    title: 'Bradshaw, J. (2013). Cat Sense: How the New Feline Science Can Make You a Better Friend to Your Pet.',
    notes: 'Basic feline ethology and communication differences.',
  },
  {
    title: 'McComb, K. et al. (2009). The cry embedded within the purr. Current Biology.',
    notes: 'Solicitation purr & vocal frequencies study.',
  },
  {
    title: 'International Cat Care (iCatCare) Behavioral Guidelines.',
    notes: 'Feline stress indicators and welfare recommendations.',
  },
  {
    title: 'Fear Free Pets (2022). Feline Body Language & Communication Matrix.',
    notes: 'Guidelines on respecting defensive thresholds and consent.',
  },
];
