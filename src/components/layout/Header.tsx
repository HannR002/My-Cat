import React from 'react';
import { Volume2, Globe, Download, HelpCircle, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface HeaderProps {
  onOpenAttributions?: () => void;
  onNavigateToFavorites?: () => void;
  favoritesCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAttributions,
  onNavigateToFavorites,
  favoritesCount = 0,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { isInstallable, install, isIOS } = usePWAInstall();

  return (
    <header className="sticky top-0 z-30 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-orange-100/80 px-4 py-3 transition-colors">
      <div className="max-w-5xl mx-auto flex items-center justify-between gap-3">
        {/* Brand identity */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-600 to-amber-500 p-0.5 shadow-sm shadow-orange-500/20 flex-shrink-0 flex items-center justify-center">
            <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center overflow-hidden">
              <img
                src="/icon.svg"
                alt="My Cat Logo"
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <span className="hidden w-full h-full flex items-center justify-center text-lg font-black text-orange-600">🐱</span>
            </div>
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-gray-900 leading-none">
                My Cat
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-700 border border-orange-200/60 uppercase tracking-wider">
                V1.3 PWA
              </span>
            </div>
            <p className="text-xs text-gray-500 truncate mt-0.5 font-medium">
              {t.tagline}
            </p>
          </div>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
          {/* Favorites shortcut */}
          {onNavigateToFavorites && (
            <button
              onClick={onNavigateToFavorites}
              className="relative p-2 rounded-xl text-gray-600 hover:text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-100"
              aria-label={t.navFavorites}
              title={t.navFavorites}
            >
              <Heart className="w-5 h-5 text-rose-500 fill-rose-500/20" />
              {favoritesCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                  {favoritesCount}
                </span>
              )}
            </button>
          )}

          {/* In-app PWA install button */}
          {isInstallable && (
            <button
              onClick={install}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white text-xs font-semibold shadow-sm transition active:scale-95"
              aria-label="Install My Cat PWA"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Pasang PWA</span>
            </button>
          )}

          {/* Language toggle */}
          <button
            onClick={() => setLanguage(language === 'id' ? 'en' : 'id')}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-100 text-orange-800 text-xs font-bold transition border border-orange-200/60 active:scale-95"
            aria-label={`Ganti Bahasa (Sekarang: ${language.toUpperCase()})`}
            title="Ganti Bahasa / Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-orange-600" />
            <span>{language === 'id' ? 'ID' : 'EN'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
