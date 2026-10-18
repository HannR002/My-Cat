import React, { useState, useEffect } from 'react';
import { X, Cat, Camera, Check, AlertCircle } from 'lucide-react';
import { CatProfile } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface CatProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cat: CatProfile) => void;
  catToEdit?: CatProfile | null;
}

const AVATAR_PRESETS = [
  { id: 'cat_orange', label: 'Tabby Oranye', emoji: '🐱', bg: 'bg-orange-100 border-orange-300 text-orange-700' },
  { id: 'cat_calico', label: 'Belang Tiga (Calico)', emoji: '🐈', bg: 'bg-amber-100 border-amber-300 text-amber-700' },
  { id: 'cat_tuxedo', label: 'Tuxedo Hitam Putih', emoji: '🐾', bg: 'bg-gray-800 border-gray-600 text-white' },
  { id: 'cat_siamese', label: 'Siam / Point', emoji: '✨', bg: 'bg-stone-100 border-stone-300 text-stone-700' },
  { id: 'cat_white', label: 'Putih Murni', emoji: '🤍', bg: 'bg-slate-100 border-slate-300 text-slate-700' },
  { id: 'cat_gray', label: 'Abu-Abu British', emoji: '🩶', bg: 'bg-zinc-200 border-zinc-400 text-zinc-700' },
];

export const CatProfileModal: React.FC<CatProfileModalProps> = ({
  isOpen,
  onClose,
  onSave,
  catToEdit,
}) => {
  const { language, t } = useLanguage();

  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('cat_orange');
  const [ageYears, setAgeYears] = useState<number>(2);
  const [ageMonths, setAgeMonths] = useState<number>(0);
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState<'male' | 'female' | 'unknown'>('male');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (catToEdit) {
      setName(catToEdit.name);
      setAvatar(catToEdit.avatar);
      setAgeYears(catToEdit.ageYears);
      setAgeMonths(catToEdit.ageMonths || 0);
      setBreed(catToEdit.breed);
      setGender(catToEdit.gender);
      setNotes(catToEdit.notes);
    } else {
      setName('');
      setAvatar('cat_orange');
      setAgeYears(2);
      setAgeMonths(0);
      setBreed('');
      setGender('male');
      setNotes('');
    }
    setError(null);
  }, [catToEdit, isOpen]);

  if (!isOpen) return null;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError(language === 'id' ? 'Ukuran foto maksimal 2 MB.' : 'Photo size limit is 2 MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setAvatar(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError(language === 'id' ? 'Nama kucing wajib diisi.' : 'Cat name is required.');
      return;
    }

    const catData: CatProfile = {
      id: catToEdit ? catToEdit.id : `cat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: name.trim(),
      avatar,
      ageYears: Number(ageYears) || 0,
      ageMonths: Number(ageMonths) || 0,
      breed: breed.trim() || (language === 'id' ? 'Domestik / Campuran' : 'Domestic / Mix'),
      gender,
      notes: notes.trim(),
      createdAt: catToEdit ? catToEdit.createdAt : Date.now(),
      updatedAt: Date.now(),
    };

    onSave(catData);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="cat-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-orange-100 max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100 transition"
          aria-label={t.cancelBtn}
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-2xl">
            <Cat className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <h3 id="cat-modal-title" className="text-xl font-black text-gray-900 leading-tight">
              {catToEdit ? t.editCat : t.addNewCat}
            </h3>
            <p className="text-xs text-gray-500 font-medium">
              {language === 'id' ? 'Tersimpan aman di penyimpanan lokal Anda' : 'Stored securely on your local device'}
            </p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
          {/* Avatar selection */}
          <div>
            <label className="block text-gray-700 font-bold mb-2">
              {t.catAvatarLabel}
            </label>
            <div className="grid grid-cols-3 gap-2 mb-2">
              {AVATAR_PRESETS.map((preset) => {
                const isSelected = avatar === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => setAvatar(preset.id)}
                    className={`p-2.5 rounded-2xl border flex flex-col items-center justify-center gap-1 transition ${
                      preset.bg
                    } ${isSelected ? 'ring-2 ring-orange-500 ring-offset-1 font-bold' : 'opacity-70 hover:opacity-100'}`}
                  >
                    <span className="text-2xl">{preset.emoji}</span>
                    <span className="text-[10px] truncate max-w-full leading-tight">
                      {preset.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Custom Photo Upload */}
            <div className="relative mt-2">
              <label className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-dashed border-gray-300 hover:border-orange-400 bg-gray-50 hover:bg-orange-50/30 cursor-pointer transition text-gray-600">
                <Camera className="w-4 h-4 text-orange-500" />
                <span className="text-xs font-semibold">
                  {avatar.startsWith('data:image')
                    ? (language === 'id' ? '✓ Foto Pribadi Terpilih' : '✓ Custom Photo Selected')
                    : (language === 'id' ? 'Unggah Foto Kucing Sendiri' : 'Upload Cat Photo')}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-gray-700 font-bold mb-1">
              {t.catNameLabel} *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Milo, Luna, Oyen"
              className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white text-sm"
            />
          </div>

          {/* Age (Years & Months) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-bold mb-1">
                {t.catAgeYearsLabel}
              </label>
              <input
                type="number"
                min={0}
                max={30}
                value={ageYears}
                onChange={(e) => setAgeYears(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1">
                {t.catAgeMonthsLabel}
              </label>
              <input
                type="number"
                min={0}
                max={11}
                value={ageMonths}
                onChange={(e) => setAgeMonths(Math.max(0, Math.min(11, parseInt(e.target.value) || 0)))}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white text-sm"
              />
            </div>
          </div>

          {/* Breed & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-gray-700 font-bold mb-1">
                {t.catBreedLabel}
              </label>
              <input
                type="text"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                placeholder="Misal: Domestik, Persia, Siam"
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white text-sm"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-bold mb-1">
                {t.catGenderLabel}
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as 'male' | 'female' | 'unknown')}
                className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white text-sm"
              >
                <option value="male">{t.genderMale}</option>
                <option value="female">{t.genderFemale}</option>
                <option value="unknown">{t.genderUnknown}</option>
              </select>
            </div>
          </div>

          {/* Personality notes */}
          <div>
            <label className="block text-gray-700 font-bold mb-1">
              {t.catNotesLabel}
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Contoh: Suka mendengkur saat dielus dagunya, takut suara vacum cleaner."
              className="w-full px-3.5 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-gray-50 focus:bg-white text-xs resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="pt-2 flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="w-1/3 py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition"
            >
              {t.cancelBtn}
            </button>
            <button
              type="submit"
              className="w-2/3 py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm shadow-md shadow-orange-600/20 transition active:scale-95 flex items-center justify-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{t.saveCatBtn}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
