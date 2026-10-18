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
import { ConfirmModal } from '../components/common/ConfirmModal';
import { validateBackupPayload } from '../utils/rules';

interface SettingsViewProps {
  onRefreshAllData: () => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ onRefreshAllData }) => {
  const { language, setLanguage, t } = useLanguage();
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [showAttributionsTable, setShowAttributionsTable] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  // Restore Modal State
  const [pendingRestoreData, setPendingRestoreData] = useState<{
    jsonString: string;
    isFullBackup: boolean;
    summary: {
      catsCount: number;
      interactionsCount: number;
      favoritesCount: number;
      importedAudioCount: number;
    };
  } | null>(null);
  const [restoreMode, setRestoreMode] = useState<'merge' | 'replace'>('merge');
  const [isRestoring, setIsRestoring] = useState(false);
  const [isConfirmClearOpen, setIsConfirmClearOpen] = useState(false);

  // Handle Export Metadata Only
  const handleExportMetadata = async () => {
    try {
      setExportError(null);
      const jsonString = await dbService.exportMetadataOnly();
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `my_cat_metadata_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExportNotice(language === 'id' ? 'Berkas metadata JSON berhasil diunduh!' : 'Metadata JSON downloaded successfully!');
      setTimeout(() => setExportNotice(null), 4000);
    } catch {
      setExportError(language === 'id' ? 'Gagal mengekspor metadata.' : 'Failed to export metadata.');
    }
  };

  // Handle Export Full Backup (includes audio binaries as Base64 Data URLs)
  const handleExportFullBackup = async () => {
    try {
      setExportError(null);
      const jsonString = await dbService.exportFullBackup();
      const blob = new Blob([jsonString], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `my_cat_full_backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExportNotice(language === 'id' ? 'Cadangan penuh (termasuk audio) berhasil diunduh!' : 'Full backup (audio included) downloaded successfully!');
      setTimeout(() => setExportNotice(null), 4000);
    } catch {
      setExportError(language === 'id' ? 'Gagal membuat cadangan penuh.' : 'Failed to create full backup.');
    }
  };

  // Handle File Selected For Restore
  const handleFileSelectedForRestore = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = reader.result as string;
        const parsed = JSON.parse(text);
        const validation = validateBackupPayload(parsed);
        if (!validation.isValid) {
          setExportError(validation.error || t.restoreErrorMsg);
          return;
        }

        setPendingRestoreData({
          jsonString: text,
          isFullBackup: validation.isFullBackup,
          summary: validation.summary || {
            catsCount: 0,
            interactionsCount: 0,
            favoritesCount: 0,
            importedAudioCount: 0,
          },
        });
      } catch {
        setExportError(t.restoreErrorMsg);
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // reset input
  };

  // Execute Restore
  const handleExecuteRestore = async () => {
    if (!pendingRestoreData) return;
    try {
      setIsRestoring(true);
      setExportError(null);
      const summary = await dbService.validateAndRestoreBackup(
        pendingRestoreData.jsonString,
        restoreMode
      );
      onRefreshAllData();
      setIsRestoring(false);
      setPendingRestoreData(null);
      setExportNotice(
        language === 'id'
          ? `Pemulihan selesai: ${summary.importedCats} kucing, ${summary.importedInteractions} sesi interaksi, ${summary.importedAudio} rekaman audio dipulihkan.`
          : `Restoration complete: ${summary.importedCats} cats, ${summary.importedInteractions} sessions, ${summary.importedAudio} audio recordings restored.`
      );
      setTimeout(() => setExportNotice(null), 5000);
    } catch (err) {
      setIsRestoring(false);
      const msg = err instanceof Error ? err.message : t.restoreErrorMsg;
      setExportError(msg);
    }
  };

  // Handle Clear Local Data
  const handleClearAllData = () => {
    setIsConfirmClearOpen(true);
  };

  const executeClearAllData = async () => {
    await dbService.clearAllUserData();
    onRefreshAllData();
    setIsConfirmClearOpen(false);
    setExportNotice(
      language === 'id'
        ? 'Seluruh data lokal telah berhasil dibersihkan.'
        : 'All local data has been successfully reset.'
    );
    setTimeout(() => setExportNotice(null), 4000);
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

        <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
          <button
            onClick={handleExportMetadata}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition active:scale-95 flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5 text-gray-600" />
            <span>{t.exportBtn}</span>
          </button>
          <button
            onClick={handleExportFullBackup}
            className="flex-1 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold shadow-md shadow-orange-600/20 transition active:scale-95 flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t.exportFullBtn}</span>
          </button>
        </div>

        <div className="p-3 bg-orange-50/70 border border-orange-200/60 rounded-xl text-[11px] text-orange-900 leading-relaxed font-normal">
          {t.backupLimitationNotice}
        </div>
      </div>

      {/* Data Restore Section */}
      <div className="bg-white rounded-3xl p-5 shadow-sm border border-orange-100 space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-gray-900">
          <Upload className="w-4 h-4 text-orange-600" />
          <span>{t.restoreSectionTitle}</span>
        </div>
        <p className="text-xs text-gray-500 leading-relaxed font-normal">
          {t.restoreDesc}
        </p>

        <div>
          <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-900 hover:bg-black text-white text-xs font-bold shadow-sm transition active:scale-95 cursor-pointer">
            <Upload className="w-3.5 h-3.5" />
            <span>{t.restoreBtn}</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileSelectedForRestore}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Restore Confirmation Modal */}
      {pendingRestoreData && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
        >
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-orange-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-gray-900">
                {t.restoreModalTitle}
              </h3>
              <button
                onClick={() => setPendingRestoreData(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100"
              >
                ✕
              </button>
            </div>

            {/* Backup summary details */}
            <div className="p-3.5 bg-orange-50/70 border border-orange-200/80 rounded-2xl text-xs space-y-1.5 text-orange-950">
              <div className="font-bold flex items-center justify-between">
                <span>{language === 'id' ? 'Tipe Berkas:' : 'Archive Type:'}</span>
                <span className="font-mono bg-white px-2 py-0.5 rounded border border-orange-200">
                  {pendingRestoreData.isFullBackup
                    ? (language === 'id' ? 'Cadangan Penuh (+Audio)' : 'Full Backup (+Audio)')
                    : (language === 'id' ? 'Metadata JSON' : 'Metadata Only')}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{language === 'id' ? 'Profil Kucing:' : 'Cat Profiles:'}</span>
                <strong>{pendingRestoreData.summary.catsCount}</strong>
              </div>
              <div className="flex justify-between">
                <span>{language === 'id' ? 'Sesi Interaksi:' : 'Interaction Logs:'}</span>
                <strong>{pendingRestoreData.summary.interactionsCount}</strong>
              </div>
              <div className="flex justify-between">
                <span>{language === 'id' ? 'Rekaman Audio Impor:' : 'Imported Audio Recordings:'}</span>
                <strong>{pendingRestoreData.summary.importedAudioCount}</strong>
              </div>
              <div className="flex justify-between">
                <span>{language === 'id' ? 'Suara Favorit:' : 'Favorites:'}</span>
                <strong>{pendingRestoreData.summary.favoritesCount}</strong>
              </div>
            </div>

            {/* Mode selection */}
            <div className="space-y-2 text-xs">
              <label className="font-bold text-gray-800 block">
                {language === 'id' ? 'Pilih Metode Pemulihan:' : 'Choose Restoration Mode:'}
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-gray-200 bg-gray-50/50 cursor-pointer hover:bg-orange-50/30">
                <input
                  type="radio"
                  name="restoreMode"
                  checked={restoreMode === 'merge'}
                  onChange={() => setRestoreMode('merge')}
                  className="mt-0.5 accent-orange-600"
                />
                <div>
                  <span className="font-bold text-gray-900 block">
                    {t.restoreMergeOption}
                  </span>
                  <span className="text-[11px] text-gray-500 font-normal">
                    {language === 'id'
                      ? 'Menambahkan data dari cadangan tanpa menghapus data lokal yang sudah ada saat ini.'
                      : 'Appends backup data without deleting existing local records.'}
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2.5 p-3 rounded-xl border border-rose-200 bg-rose-50/30 cursor-pointer hover:bg-rose-50/60">
                <input
                  type="radio"
                  name="restoreMode"
                  checked={restoreMode === 'replace'}
                  onChange={() => setRestoreMode('replace')}
                  className="mt-0.5 accent-rose-600"
                />
                <div>
                  <span className="font-bold text-rose-950 block">
                    {t.restoreReplaceOption}
                  </span>
                  <span className="text-[11px] text-rose-800 font-normal">
                    {language === 'id'
                      ? 'PERINGATAN: Menghapus seluruh data lokal yang ada dan menggantinya dengan isi berkas cadangan ini.'
                      : 'WARNING: Clears all current local records and replaces them with this backup.'}
                  </span>
                </div>
              </label>
            </div>

            {/* Actions */}
            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setPendingRestoreData(null)}
                disabled={isRestoring}
                className="w-1/3 py-2.5 px-4 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs transition"
              >
                {t.cancelBtn}
              </button>
              <button
                type="button"
                onClick={handleExecuteRestore}
                disabled={isRestoring}
                className="w-2/3 py-2.5 px-4 rounded-xl bg-orange-600 hover:bg-orange-700 disabled:opacity-50 text-white font-bold text-xs shadow-md shadow-orange-600/20 transition active:scale-95 flex items-center justify-center gap-2"
              >
                {isRestoring ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <CheckCircle2 className="w-4 h-4" />
                )}
                <span>{isRestoring ? 'Memulihkan...' : t.restoreExecuteBtn}</span>
              </button>
            </div>
          </div>
        </div>
      )}

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

      {/* Clear All Data Confirmation Modal */}
      <ConfirmModal
        isOpen={isConfirmClearOpen}
        title={t.clearDataBtn}
        message={t.clearDataConfirm}
        confirmText={language === 'id' ? 'Hapus Semua Data' : 'Reset All Data'}
        cancelText={language === 'id' ? 'Batal' : 'Cancel'}
        isDanger={true}
        onConfirm={executeClearAllData}
        onCancel={() => setIsConfirmClearOpen(false)}
      />
    </div>
  );
};
