import React from 'react';
import {
  Home,
  Music,
  HeartHandshake,
  BookOpen,
  Cat,
  Settings,
  Heart,
} from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export type NavTab = 'home' | 'sounds' | 'interact' | 'academy' | 'mycats' | 'favorites' | 'settings';

interface BottomNavProps {
  currentTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  favoritesCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onTabChange,
  favoritesCount = 0,
}) => {
  const { language, t } = useLanguage();

  const navItems: {
    tab: NavTab;
    label: string;
    shortLabel?: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { tab: 'home', label: t.navHome, icon: Home },
    { tab: 'sounds', label: t.navSounds, icon: Music },
    { tab: 'interact', label: t.navInteract, icon: HeartHandshake },
    { tab: 'academy', label: t.navAcademy, icon: BookOpen },
    {
      tab: 'mycats',
      label: t.navMyCats,
      shortLabel: language === 'id' ? 'Kucing' : 'Cats',
      icon: Cat,
    },
    {
      tab: 'settings',
      label: t.navSettings,
      shortLabel: language === 'id' ? 'Setelan' : 'Settings',
      icon: Settings,
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-30 bg-[#FFFDF9]/95 backdrop-blur-md border-t border-orange-100/90 pb-safe shadow-[0_-4px_20px_rgba(234,88,12,0.05)]"
      aria-label="Navigasi Utama"
    >
      <div className="max-w-md mx-auto grid grid-cols-6 gap-0.5 px-1 py-1.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.tab;

          return (
            <button
              key={item.tab}
              onClick={() => onTabChange(item.tab)}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-150 min-h-[50px] relative ${
                isActive
                  ? 'text-orange-600 font-bold'
                  : 'text-gray-500 hover:text-gray-900 font-medium'
              }`}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <div
                className={`p-1 rounded-lg transition-transform ${
                  isActive ? 'bg-orange-100 text-orange-600 scale-105' : 'text-gray-400'
                }`}
              >
                <Icon className="w-5 h-5 stroke-[2.2]" />
              </div>
              <span className="text-[9.5px] sm:text-[10px] tracking-tight leading-tight mt-0.5 truncate max-w-full font-medium">
                <span className="hidden sm:inline">{item.label}</span>
                <span className="inline sm:hidden">{item.shortLabel || item.label}</span>
              </span>
              {isActive && (
                <div className="absolute -top-1 w-6 h-1 rounded-full bg-orange-500" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
