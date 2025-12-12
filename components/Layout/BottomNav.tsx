
import React from 'react';
import { Home, Map, BookX, User, Sparkles } from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'today', icon: Home, label: '今日' },
    { id: 'subject', icon: Map, label: '学科' },
    { id: 'mistake', icon: BookX, label: '错题' },
    { id: 'partner', icon: Sparkles, label: '伙伴' },
    { id: 'me', icon: User, label: '我的' },
  ];

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 pb-6 md:pb-5 z-40 rounded-t-[32px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-end max-w-lg mx-auto h-14">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          
          return (
            <button 
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? 'text-brand -translate-y-1' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <div className={`p-2 rounded-2xl transition-all duration-300 ${isActive ? 'bg-brand/10 text-brand' : ''}`}>
                  <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-bold transition-opacity duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                  {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  );
};
