
import React, { useState, useEffect } from 'react';
import { UserStats, SubjectType } from '../../types';
import { Bell, Zap, Coins, ChevronDown, Calculator, BookA, Languages, Check, Clock, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TopStatusBarProps {
  stats: UserStats;
  activeSubject?: SubjectType;
  onSubjectChange?: (subject: SubjectType) => void;
  showSubjectSwitcher?: boolean;
  variant?: 'dark' | 'light';
  onOpenStore?: () => void;
}

const SUBJECT_CONFIG = {
    '数学': { icon: Calculator, color: 'text-blue-400', label: '数学' },
    '语文': { icon: BookA, color: 'text-red-400', label: '语文' },
    '英语': { icon: Languages, color: 'text-green-400', label: '英语' },
};

export const TopStatusBar: React.FC<TopStatusBarProps> = ({ 
    stats, 
    activeSubject = '数学', 
    onSubjectChange, 
    showSubjectSwitcher = true,
    variant = 'dark',
    onOpenStore
}) => {
  const [showXpDetails, setShowXpDetails] = useState(false);
  const [isSubjectMenuOpen, setIsSubjectMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  // Portal Target
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  useEffect(() => {
    setPortalTarget(document.getElementById('modal-root'));
  }, []);

  const xpPercentage = Math.min(100, (stats.xpToday / stats.xpTarget) * 100);

  // --- Theme Logic ---
  const isDark = variant === 'dark';

  // Styles configuration based on variant
  const styles = {
      dark: {
          pill: "bg-black/20 border-white/10 text-white hover:bg-white/10",
          textMain: "text-white",
          textSub: "text-white/50",
          iconMain: "text-white",
          iconChevron: "text-white/60",
          coinPill: "border-yellow-500/30 bg-yellow-500/10 hover:bg-yellow-500/20",
          coinIcon: "text-yellow-400",
          coinText: "text-yellow-100",
          hasCoinGlow: true,
          bellDotBorder: "border-white/10"
      },
      light: {
          pill: "bg-white/60 border-white/40 text-gray-800 hover:bg-white/80 shadow-sm",
          textMain: "text-gray-800",
          textSub: "text-gray-400",
          iconMain: "text-gray-600",
          iconChevron: "text-gray-400",
          coinPill: "bg-white/60 border-white/40 hover:bg-white/80 shadow-sm",
          coinIcon: "text-yellow-500 fill-yellow-500", 
          coinText: "text-gray-800",
          hasCoinGlow: false,
          bellDotBorder: "border-white"
      }
  };

  const currentStyle = isDark ? styles.dark : styles.light;
  const basePillClass = `h-9 rounded-full flex items-center justify-center transition-colors active:scale-95 select-none backdrop-blur-md border ${currentStyle.pill}`;

  const ActiveIcon = SUBJECT_CONFIG[activeSubject].icon;

  return (
    <>
    <div className="absolute top-0 left-0 right-0 z-50 px-6 py-6 flex justify-between items-start pointer-events-none">
      
      {/* LEFT: Subject Switcher */}
      <div className="pointer-events-auto relative h-9 flex items-center">
        {showSubjectSwitcher && (
            <>
            <button 
                onClick={() => setIsSubjectMenuOpen(!isSubjectMenuOpen)}
                className={`${basePillClass} pl-3 pr-3 gap-2`}
            >
                <ActiveIcon size={14} className={SUBJECT_CONFIG[activeSubject].color} />
                <span className={`text-xs font-bold tracking-wide ${currentStyle.textMain}`}>{activeSubject}</span>
                <ChevronDown size={12} className={`transition-transform ${isSubjectMenuOpen ? 'rotate-180' : ''} ${currentStyle.iconChevron}`} />
            </button>

            {/* Subject Dropdown */}
            <AnimatePresence>
                {isSubjectMenuOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsSubjectMenuOpen(false)}></div>
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute top-full left-0 mt-2 w-32 bg-white/90 backdrop-blur-xl rounded-2xl p-1 shadow-xl border border-white/50 z-50 origin-top-left"
                        >
                            {(Object.keys(SUBJECT_CONFIG) as SubjectType[]).map((subj) => {
                                const Config = SUBJECT_CONFIG[subj];
                                const isActive = activeSubject === subj;
                                return (
                                    <button
                                        key={subj}
                                        onClick={() => {
                                            if (onSubjectChange) onSubjectChange(subj);
                                            setIsSubjectMenuOpen(false);
                                        }}
                                        className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-colors ${isActive ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:bg-gray-100'}`}
                                    >
                                        <Config.icon size={14} className={Config.color} />
                                        <span className="flex-1 text-left">{subj}</span>
                                        {isActive && <Check size={12} className="text-brand" />}
                                    </button>
                                );
                            })}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
            </>
        )}
      </div>

      {/* RIGHT: Stats Group */}
      <div className="flex items-center gap-2 pointer-events-auto">
        
        {/* 1. XP Capsule */}
        <div className="relative">
            <motion.button 
                onClick={() => setShowXpDetails(!showXpDetails)}
                className={`${basePillClass} pl-1 pr-3 gap-2 relative overflow-hidden group`}
                style={{ minWidth: '100px' }}
            >
                {/* Progress Fill Background */}
                <div 
                    className={`absolute left-0 top-0 bottom-0 transition-all duration-1000 ease-out ${isDark ? 'bg-white/10' : 'bg-brand/10'}`}
                    style={{ width: `${xpPercentage}%` }}
                ></div>

                {/* Icon Circle */}
                <div className="w-7 h-7 rounded-full bg-brand-light flex items-center justify-center text-white shadow-sm z-10">
                    <Zap size={14} fill="currentColor" />
                </div>

                {/* Text */}
                <div className="flex items-baseline gap-0.5 z-10">
                    <span className={`text-xs font-black ${currentStyle.textMain}`}>{stats.xpToday}</span>
                    <span className={`text-[10px] font-bold ${currentStyle.textSub}`}>/{stats.xpTarget}</span>
                </div>
            </motion.button>
            
            {/* XP Tooltip */}
            <AnimatePresence>
              {showXpDetails && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowXpDetails(false)}></div>
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className="absolute top-full right-0 mt-2 w-48 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 z-50 text-gray-800 origin-top-right"
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-gray-400 uppercase">Lv.5 进阶</span>
                            <span className="text-brand font-black">{Math.floor(xpPercentage)}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-2">
                            <div className="h-full bg-brand" style={{ width: `${xpPercentage}%` }}></div>
                        </div>
                        <p className="text-[10px] text-gray-500 font-medium">
                            加油！达成今日目标还需 <span className="text-brand font-bold">{stats.xpTarget - stats.xpToday} XP</span>
                        </p>
                    </motion.div>
                  </>
              )}
          </AnimatePresence>
        </div>

        {/* 2. Coin Capsule */}
        <button 
            onClick={onOpenStore} 
            className={`h-9 rounded-full flex items-center justify-center transition-colors active:scale-95 select-none backdrop-blur-md border pl-3 pr-3 gap-2 ${currentStyle.coinPill}`}
        >
             <div className="relative">
                 {currentStyle.hasCoinGlow && <div className="absolute inset-0 bg-yellow-400 blur-[8px] opacity-40"></div>}
                 <Coins size={16} className={`${currentStyle.coinIcon} relative z-10`} strokeWidth={isDark ? 2.5 : 2} />
             </div>
             <span className={`text-xs font-black ${currentStyle.coinText}`}>{stats.coins}</span>
        </button>

        {/* 3. Bell Button (With Dropdown) */}
        <div className="relative">
            <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`${basePillClass} w-9 px-0 relative`}
            >
                <Bell size={16} className={currentStyle.iconMain} />
                <span className={`absolute top-2 right-2.5 w-1.5 h-1.5 bg-red-500 rounded-full ${currentStyle.bellDotBorder}`}></span>
            </button>

            {/* Notification Dropdown */}
            <AnimatePresence>
                {isNotifOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsNotifOpen(false)}></div>
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.9 }}
                            className="absolute top-full right-0 mt-2 w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 z-50 origin-top-right overflow-hidden"
                        >
                            <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                                <h3 className="text-sm font-bold text-gray-800">通知中心</h3>
                                <button className="text-[10px] text-brand font-bold">全部已读</button>
                            </div>
                            <div className="max-h-64 overflow-y-auto p-2">
                                <NotifItem type="study" title="错题复习提醒" desc="你有 5 道数学错题已到遗忘临界点。" time="10分钟前" />
                                <NotifItem type="system" title="成就解锁" desc="恭喜获得【早起鸟】徽章！" time="1小时前" />
                                <NotifItem type="study" title="Lumi 消息" desc="发现你在‘一元二次方程’进步很快，继续保持！" time="2小时前" />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>

      </div>
    </div>
    </>
  );
};

const NotifItem: React.FC<{ type: 'study'|'system', title: string, desc: string, time: string }> = ({ type, title, desc, time }) => (
    <div className="p-3 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors flex gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${type === 'study' ? 'bg-blue-100 text-blue-600' : 'bg-orange-100 text-orange-600'}`}>
            {type === 'study' ? <BookA size={18} /> : <AlertCircle size={18} />}
        </div>
        <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-gray-800">{title}</h4>
            <p className="text-xs text-gray-500 leading-tight line-clamp-2 mt-0.5">{desc}</p>
            <p className="text-[10px] text-gray-400 mt-1 flex items-center gap-1"><Clock size={10} /> {time}</p>
        </div>
        <div className="w-2 h-2 rounded-full bg-brand shrink-0 mt-2"></div>
    </div>
);
