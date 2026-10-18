import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { useLanguage } from '../../context/LanguageContext';

export const OfflineBanner: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { language } = useLanguage();

  if (isOnline) return null;

  return (
    <div
      role="status"
      className="bg-amber-600 text-white text-xs px-4 py-2 flex items-center justify-center gap-2 shadow-sm font-medium z-40 relative animate-fadeIn"
    >
      <WifiOff className="w-4 h-4 animate-pulse flex-shrink-0" />
      <span>
        {language === 'id'
          ? 'Mode Offline Aktif — Suara bawaan dan data lokal tetap dapat digunakan tanpa internet.'
          : 'Offline Mode Active — Bundled sounds and local data remain accessible without connection.'}
      </span>
    </div>
  );
};
