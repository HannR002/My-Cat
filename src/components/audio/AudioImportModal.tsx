import React, { useState } from 'react';
import { X, Upload, Music, AlertCircle, CheckCircle2, FileAudio } from 'lucide-react';
import { AudioCategory, UserImportedAudioRecord } from '../../types';
import { CATEGORIES } from '../../data/bundledAudio';
import { dbService } from '../../services/db';
import { useLanguage } from '../../context/LanguageContext';

interface AudioImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AudioImportModal: React.FC<AudioImportModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { language, t } = useLanguage();

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<AudioCategory>('call');
  const [description, setDescription] = useState('');
  const [audioType, setAudioType] = useState<'user_imported' | 'ai'>('user_imported');
  const [artist, setArtist] = useState('');
  const [source, setSource] = useState('');
  const [license, setLicense] = useState('Rekaman Pribadi (Milik Pengguna)');

  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [isValidFile, setIsValidFile] = useState(false);
  const [fileDuration, setFileDuration] = useState<number>(0);
  const validationTokenRef = React.useRef(0);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setIsValidFile(false);
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) {
      setFile(null);
      setFileDuration(0);
      return;
    }

    // Check non-empty file
    if (selectedFile.size === 0) {
      setFile(null);
      setFileDuration(0);
      setError(language === 'id' ? 'Berkas audio kosong (0 bytes).' : 'Audio file is empty (0 bytes).');
      return;
    }

    // Validate size (max 10MB)
    const MAX_SIZE = 10 * 1024 * 1024;
    if (selectedFile.size > MAX_SIZE) {
      setFile(null);
      setFileDuration(0);
      setError(t.fileTooLarge);
      return;
    }

    // Validate mime type & extension
    const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/ogg', 'audio/webm', 'audio/m4a'];
    const isMimeValid = validTypes.includes(selectedFile.type) || /\.(mp3|wav|ogg|m4a)$/i.test(selectedFile.name);

    if (!isMimeValid) {
      setFile(null);
      setFileDuration(0);
      setError(t.invalidFileType);
      return;
    }

    // Test playback capability & get duration with token to prevent async races
    const currentToken = ++validationTokenRef.current;
    setIsValidating(true);
    const testAudio = new Audio();
    const objectUrl = URL.createObjectURL(selectedFile);
    testAudio.src = objectUrl;

    testAudio.onloadedmetadata = () => {
      if (validationTokenRef.current !== currentToken) {
        URL.revokeObjectURL(objectUrl);
        return;
      }
      if (!isFinite(testAudio.duration) || testAudio.duration <= 0) {
        setError(language === 'id' ? 'Durasi audio tidak terbaca atau berkas tidak valid.' : 'Invalid or unreadable audio duration.');
        setIsValidFile(false);
        setFile(null);
        setFileDuration(0);
        setIsValidating(false);
        URL.revokeObjectURL(objectUrl);
        return;
      }

      setFileDuration(Math.round(testAudio.duration * 10) / 10);
      setIsValidFile(true);
      setFile(selectedFile);
      setIsValidating(false);
      URL.revokeObjectURL(objectUrl);

      if (!title) {
        const cleanName = selectedFile.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
        setTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    };

    testAudio.onerror = () => {
      if (validationTokenRef.current !== currentToken) {
        URL.revokeObjectURL(objectUrl);
        return;
      }
      setError(language === 'id' ? 'Berkas audio rusak atau format tidak didukung oleh browser Anda.' : 'Corrupt audio file or unsupported codec.');
      setIsValidFile(false);
      setFile(null);
      setFileDuration(0);
      setIsValidating(false);
      URL.revokeObjectURL(objectUrl);
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError(language === 'id' ? 'Silakan pilih berkas audio terlebih dahulu.' : 'Please choose an audio file first.');
      return;
    }
    if (!title.trim()) {
      setError(language === 'id' ? 'Judul rekaman wajib diisi.' : 'Recording title is required.');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      const newRecord: UserImportedAudioRecord = {
        id: `user_imported_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        title: title.trim(),
        category,
        description: description.trim() || (language === 'id' ? 'Rekaman audio yang diimpor oleh pengguna.' : 'User-imported audio recording.'),
        audioType,
        duration: fileDuration || 3,
        artist: artist.trim() || (language === 'id' ? 'Pengguna My Cat' : 'My Cat User'),
        source: source.trim() || (language === 'id' ? 'Berkas Lokal Pengguna' : 'User Local File'),
        license: license.trim() || 'Personal Use',
        mimeType: file.type || 'audio/mpeg',
        blob: file,
        createdAt: Date.now(),
      };

      await dbService.saveImportedAudio(newRecord);
      setIsSubmitting(false);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setIsSubmitting(false);
      const msg = err instanceof Error ? err.message : 'Gagal menyimpan audio ke database lokal.';
      setError(msg);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-orange-100 max-h-[92vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
          aria-label={t.closeBtn}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
            <Upload className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h3 id="import-modal-title" className="text-xl font-black text-gray-900 leading-tight">
              {t.importModalTitle}
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              {language === 'id' ? 'Tersimpan aman & privat di browser Anda' : 'Stored securely & privately in local IndexedDB'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
          {/* File input */}
          <div>
            <label className="block text-gray-700 font-bold mb-1.5">
              {t.fileSelectLabel}
            </label>
            <div className="relative border-2 border-dashed border-orange-200 hover:border-orange-400 rounded-2xl p-4 text-center transition bg-orange-50/30">
              <input
                type="file"
                accept="audio/mp3,audio/wav,audio/ogg,audio/mpeg,.mp3,.wav,.ogg"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                aria-label={t.fileSelectLabel}
              />
              {file ? (
                <div className="flex items-center justify-center gap-2 text-emerald-700 font-semibold">
                  <FileAudio className="w-5 h-5" />
                  <span className="truncate max-w-[240px]">{file.name}</span>
                  <span className="text-[10px] bg-emerald-100 px-2 py-0.5 rounded-full">
                    {Math.round(file.size / 1024)} KB
                  </span>
                </div>
              ) : (
                <div className="space-y-1">
                  <Upload className="w-6 h-6 text-orange-400 mx-auto" />
                  <p className="text-gray-600 font-semibold">
                    {language === 'id' ? 'Klik atau seret berkas ke sini' : 'Click or drag file here'}
                  </p>
                  <p className="text-[10px] text-gray-400">MP3, WAV, atau OGG (maks. 10MB)</p>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-gray-700 font-bold mb-1">
              {t.audioTitleLabel} *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Meow Lapar Si Milo"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white text-sm"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-700 font-bold mb-1">
              {t.audioCategoryLabel}
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as AudioCategory)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white text-sm"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {language === 'id' ? cat.name.id : cat.name.en}
                </option>
              ))}
            </select>
          </div>

          {/* Audio Type */}
          <div>
            <label className="block text-gray-700 font-bold mb-1">
              {language === 'id' ? 'Klasifikasi Audio' : 'Audio Classification'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setAudioType('user_imported')}
                className={`py-2 px-3 rounded-xl border text-center transition ${
                  audioType === 'user_imported'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-bold'
                    : 'border-gray-200 bg-gray-50 text-gray-600'
                }`}
              >
                🐱 {language === 'id' ? 'Rekaman Kucing Nyata' : 'Real Cat Recording'}
              </button>
              <button
                type="button"
                onClick={() => setAudioType('ai')}
                className={`py-2 px-3 rounded-xl border text-center transition ${
                  audioType === 'ai'
                    ? 'border-purple-500 bg-purple-50 text-purple-800 font-bold'
                    : 'border-gray-200 bg-gray-50 text-gray-600'
                }`}
              >
                🤖 {language === 'id' ? 'AI / Sintetis' : 'AI / Synthetic'}
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-gray-700 font-bold mb-1">
              {t.audioDescLabel}
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contoh: Suara saat minta makan malam di depan pintu."
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white text-sm resize-none"
            />
          </div>

          {/* Artist & License */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-bold mb-1">
                {t.audioSourceLabel}
              </label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Nama perekam / pemilik"
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white text-xs"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1">
                {t.audioLicenseLabel}
              </label>
              <input
                type="text"
                value={license}
                onChange={(e) => setLicense(e.target.value)}
                placeholder="Misal: CC0, CC BY, atau Hak Cipta Pribadi"
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white text-xs"
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="pt-3 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition"
            >
              {t.cancelBtn}
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isValidating || !isValidFile || !file || !title.trim()}
              className="w-2/3 py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-orange-600/20 transition active:scale-95 flex items-center justify-center gap-2"
            >
              {isValidating ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4" />
              )}
              <span>
                {isSubmitting
                  ? 'Menyimpan...'
                  : isValidating
                  ? (language === 'id' ? 'Memvalidasi...' : 'Validating...')
                  : t.submitImportBtn}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
