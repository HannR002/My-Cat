import React, { useState } from 'react';
import {
  Globe,
  ShieldAlert,
  Upload,
  Download,
  Trash2,
  Award,
  Info,
  CheckCircle2,
  ExternalLink,
  Smartphone,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { dbService } from '../services/db';
import { BUNDLED_AUDIO } from '../data/bundledAudio';
import { AudioImportModal } from '../components/audio/AudioImportModal';

interface SettingsViewProps {
  onRefreshAllData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onRefreshAllData }) => {
  const { language, setLanguage, t } = useLanguage();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [showAttributionsTable, setShowAttributionsTable] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Handle Export to JSON
  const handleExportData = async () => {
    try {
      const jsonString = await dbService.exportAllUserData();
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `my_cat_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExportNotice(language === 'id' ? 'Berkas cadangan JSON berhasil diunduh!' : 'JSON backup downloaded successfully!');
      setTimeout(() => setExportNotice(null), 4000);
    } catch {
      alert('Gagal mengekspor data.');
    }
  };

  // Handle Clear Local Data
  const handleClearAllData = async () => {
    if (confirm(t.clearDataConfirm)) {
      await dbService.clearAllUserData();
      onRefreshAllData();
      alert(language === 'id' ? 'Seluruh data lokal telah dibersihkan.' : 'All local data has been reset.');
    }
  };

  return (
    <div className="space-y-6 pb-28 animate-fadeIn max-w-2xl mx-auto">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-black text-gray-900 tracking-tight">
          {t.settingsTitle}
        </h2>
        <p className="text-xs text-gray-500 font-medium mt-0.5">
          {t.settingsSubtitle}
        </p>
      </div>

      {exportNotice && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-600" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Language Section */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-orange-100 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
          <Globe className="w-4 h-4 text-orange-600" />
          <span>{t.langSectionTitle}</span>
        </div>
        <p className="text-xs text-gray-500 font-normal">
          {language === 'id'
            ? 'Pilih bahasa tampilan antarmuka aplikasi. Bahasa Indonesia adalah bahasa utama.'
            : 'Select interface language. Bahasa Indonesia is the primary language.'}
        </p>
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={() => setLanguage('id')}
            className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
              language === 'id'
                ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <span>🇮🇩 Bahasa Indonesia</span>
            {language === 'id' && <Check className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setLanguage('en')}
            className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition flex items-center justify-between ${
              language === 'en'
                ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'
            }`}
          >
            <span>🇬🇧 English</span>
            {language === 'en' && <Check className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Animal Welfare Guidance Section */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-rose-100 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-rose-800">
          <ShieldAlert className="w-4 h-4 text-rose-600" />
          <span>{t.audioWelfareSectionTitle}</span>
        </div>
        <p className="text-xs text-gray-600 leading-relaxed font-normal bg-rose-50/50 p-3.5 rounded-2xl border border-rose-100/60">
          {t.audioWelfareDesc}
        </p>
      </div>

      {/* User Audio Import Manager Section */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-orange-100 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
          <Upload className="w-4 h-4 text-orange-600" />
          <span>{t.importAudioSectionTitle}</span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed font-normal">
          {t.importAudioDesc}
        </p>
        <button
          onClick={() => setIsImportModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 text-xs font-bold border border-orange-200 transition flex items-center gap-2 active:scale-95"
        >
          <Upload className="w-3.5 h-3.5 text-orange-600" />
          <span>{t.importBtn}</span>
        </button>
      </div>

      {/* Data Export & Backup Section */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-orange-100 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
          <Download className="w-4 h-4 text-orange-600" />
          <span>{t.exportSectionTitle}</span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed font-normal">
          {t.exportDesc}
        </p>
        <button
          onClick={handleExportData}
          className="px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold shadow-sm transition active:scale-95 flex items-center gap-2"
        >
          <Download className="w-3.5 h-3.5" />
          <span>{t.exportBtn}</span>
        </button>
      </div>

      {/* Clear Data Section */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-200 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
          <Trash2 className="w-4 h-4 text-gray-500" />
          <span>{t.clearDataSectionTitle}</span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed font-normal">
          {t.clearDataDesc}
        </p>
        <button
          onClick={handleClearAllData}
          className="px-4 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold border border-rose-200 transition flex items-center gap-2 active:scale-95"
        >
          <Trash2 className="w-3.5 h-3.5 text-rose-600" />
          <span>{t.clearDataBtn}</span>
        </button>
      </div>

      {/* Audio Licensing & Full Attribution Table */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-orange-100 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <Award className="w-4 h-4 text-orange-600" />
            <span>{t.attributionSectionTitle}</span>
          </div>
          <button
            onClick={() => setShowAttributionsTable(!showAttributionsTable)}
            className="text-xs font-bold text-orange-600 hover:text-orange-700 underline"
          >
            {showAttributionsTable
              ? language === 'id'
                ? 'Sembunyikan'
                : 'Hide'
              : t.viewAttributionsBtn}
          </button>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed font-normal">
          {t.attributionDesc}
        </p>

        {showAttributionsTable && (
          <div className="space-y-3 pt-2 max-h-96 overflow-y-auto pr-1">
            {BUNDLED_AUDIO.map((audio) => (
              <div
                key={audio.id}
                className="p-3 bg-gray-50 rounded-2xl border border-gray-200 text-xs space-y-1"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-gray-900">{audio.title}</span>
                  <span className="font-mono text-[10px] bg-white px-2 py-0.5 rounded border border-gray-200">
                    {audio.license}
                  </span>
                </div>
                <p className="text-gray-600 text-[11px]">
                  <strong>Artis / Kontributor:</strong> {audio.artist}
                </p>
                <p className="text-gray-500 text-[10px] break-all">
                  <strong>Sumber:</strong> {audio.source}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PWA & Platform Information */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-orange-100 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
          <Smartphone className="w-4 h-4 text-orange-600" />
          <span>{language === 'id' ? 'Status PWA & Distribusi' : 'PWA & Distribution Status'}</span>
        </div>
        <div className="p-3 bg-gray-50 rounded-2xl text-xs space-y-1.5 text-gray-600 font-normal">
          <p className="flex items-center gap-1.5 font-bold text-gray-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>PWA Ready: Web Manifest, Service Worker & Offline Cache Aktif</span>
          </p>
          <p className="text-[11px] text-gray-500">
            {language === 'id'
              ? 'Dapat dipasang langsung ke layar utama Android, iOS Safari, atau Desktop tanpa biaya hosting khusus.'
              : 'Installable directly to home screen on Android, iOS Safari, or Desktop without proprietary costs.'}
          </p>
          <p className="text-[11px] text-gray-500">
            {language === 'id'
              ? 'Rute Android masa depan: Arsitektur siap dibundel sebagai Trusted Web Activity (TWA) menggunakan Bubblewrap/Android Studio.'
              : 'Future Android route: Ready for Trusted Web Activity (TWA) packaging via Bubblewrap.'}
          </p>
        </div>

        {isInstallable && (
          <button
            onClick={install}
            className="w-full py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs shadow-md transition active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Download className="w-4 h-4" />
            <span>{t.installPwaBtn}</span>
          </button>
        )}

        {isIOS && !isInstalled && (
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 space-y-1">
            <p className="font-bold">📱 Panduan PWA di iOS Safari:</p>
            <p className="text-[11px]">
              Ketuk tombol <strong>Bagikan (Share)</strong> di bilah Safari, lalu pilih{' '}
              <strong>Tambahkan ke Layar Utama (Add to Home Screen)</strong>.
            </p>
          </div>
        )}
      </div>

      {/* About My Cat Section */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-200 space-y-2 text-xs text-gray-600">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
          <Info className="w-4 h-4 text-orange-600" />
          <span>{t.aboutSectionTitle}</span>
        </div>
        <p className="leading-relaxed font-normal">{t.aboutAppDesc}</p>
        <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-gray-400 font-mono text-[11px]">
          <span>{t.appVersion}</span>
          <span>Open Web Standard</span>
        </div>
      </div>

      {/* Audio Import Modal */}
      <AudioImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={onRefreshAllData}
      />
    </div>
  );
};
