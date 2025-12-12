
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MistakeVaultData, MistakeItem } from '../../types';
import { getMistakeVaultData } from '../../services/geminiService';
import { Card } from '../UI/Card';
import { AlertCircle, CheckCircle2, ChevronRight, Filter, Zap, BookX, ArrowRight, Bookmark, Star, Flag, Trophy, X, Circle, TrendingDown, Crown, Sparkles } from 'lucide-react';
import { MistakeDetailModal } from './MistakeDetailModal';
import { DailyConquerModal } from './DailyConquerModal';

export const MistakeVault: React.FC = () => {
  const [data, setData] = useState<MistakeVaultData | null>(null);
  const [selectedMistake, setSelectedMistake] = useState<MistakeItem | null>(null);
  
  // Filtering State
  const [activeSubjectFilter, setActiveSubjectFilter] = useState<string | 'All'>('All');
  // Status Filter: 'pending' (Default, excludes mastered), 'new', 'reviewing'
  const [activeStatusFilter, setActiveStatusFilter] = useState<'pending' | 'new' | 'reviewing'>('pending');
  
  // State for Confirmation Modal
  const [confirmAction, setConfirmAction] = useState<{ item: MistakeItem; type: 'master' | 'unmaster' } | null>(null);

  // State for Daily Challenge
  const [isDailyChallengeOpen, setIsDailyChallengeOpen] = useState(false);

  useEffect(() => {
    getMistakeVaultData().then(setData);
  }, []);

  const handleStarToggle = (item: MistakeItem) => {
      if (!data) return;
      const newGroups = data.groups.map(g => ({
          ...g,
          items: g.items.map(i => i.id === item.id ? { 
              ...i, 
              stats: { ...i.stats, isStarred: !i.stats.isStarred } 
          } : i)
      }));
      setData({ ...data, groups: newGroups });
  };

  const handleFlagClick = (item: MistakeItem) => {
      setConfirmAction({
          item,
          type: item.status === 'mastered' ? 'unmaster' : 'master'
      });
  };

  const confirmFlagChange = () => {
      if (!data || !confirmAction) return;
      const { item, type } = confirmAction;
      
      const newStatus = type === 'master' ? 'mastered' : 'reviewing';
      
      const newGroups = data.groups.map(g => ({
          ...g,
          items: g.items.map(i => i.id === item.id ? { 
              ...i, 
              status: newStatus as any,
              stats: { ...i.stats, mastered: type === 'master' }
          } : i)
      }));

      // Update pending count logic
      let newPending = data.totalPending;
      if (type === 'master' && item.status !== 'mastered') newPending = Math.max(0, newPending - 1);
      if (type === 'unmaster' && item.status === 'mastered') newPending = newPending + 1;

      setData({ ...data, groups: newGroups, totalPending: newPending });
      setConfirmAction(null);
  };

  const handleDailyChallengeComplete = ({ masteredIds, xpEarned }: { masteredIds: string[], xpEarned: number }) => {
      if (!data) return;
      
      // Batch update status to mastered
      const newGroups = data.groups.map(g => ({
          ...g,
          items: g.items.map(i => masteredIds.includes(i.id) ? {
              ...i,
              status: 'mastered' as any,
              stats: { ...i.stats, mastered: true }
          } : i)
      }));

      const newPending = Math.max(0, data.totalPending - masteredIds.length);
      setData({ ...data, groups: newGroups, totalPending: newPending });
  };

  // --- Filtering Logic (Revised) ---
  const getFilteredGroups = () => {
      if (!data) return [];
      
      return data.groups.map(group => {
          const filteredItems = group.items.filter(item => {
              // 1. Subject Filter
              const matchSubject = activeSubjectFilter === 'All' || item.subject === activeSubjectFilter;
              
              // 2. Status Filter
              let matchStatus = true;
              if (activeStatusFilter === 'pending') {
                  // Show New + Reviewing (Hide Mastered)
                  matchStatus = item.status !== 'mastered';
              } else {
                  matchStatus = item.status === activeStatusFilter;
              }

              return matchSubject && matchStatus;
          });
          return { ...group, items: filteredItems };
      }).filter(group => group.items.length > 0); 
  };

  const filteredGroups = getFilteredGroups();

  if (!data) return <div className="p-8 text-center text-gray-400">加载错题本...</div>;

  // Visual Calc for Progress Bar (Mocked ratio if data items are partial)
  // In a real app, calculate strict counts. Here we ensure the bar looks good even with mock data.
  const isZeroState = data.totalPending === 0;
  // Let's assume ~40% are new, 60% reviewing for the visual if we rely on totalPending
  const pendingNewCount = Math.floor(data.totalPending * 0.4);
  const pendingReviewCount = data.totalPending - pendingNewCount;
  
  const percentNew = data.totalPending > 0 ? (pendingNewCount / data.totalPending) * 100 : 0;
  const percentReview = data.totalPending > 0 ? (pendingReviewCount / data.totalPending) * 100 : 0;

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth bg-gray-50/50 relative">
      <div className="w-full px-4 md:px-6 lg:px-8 pt-28 pb-32 max-w-4xl mx-auto flex flex-col gap-6">
        
        {/* 3.1 Stats Header - REIMPLEMENTED: DASHBOARD GAUGE */}
        <div className="flex flex-col md:flex-row gap-4 h-auto md:h-44">
            {/* Left: Enhanced Total Count Card */}
            <Card 
                onClick={() => {
                    setActiveSubjectFilter('All');
                    setActiveStatusFilter('pending');
                }}
                className={`flex-1 md:flex-[0.4] border flex flex-col relative overflow-hidden cursor-pointer transition-all duration-500 group
                    ${isZeroState 
                        ? 'bg-gradient-to-br from-green-400 to-emerald-600 border-emerald-400 shadow-lg shadow-emerald-200' 
                        : activeSubjectFilter === 'All' 
                            ? 'bg-white border-orange-200 ring-4 ring-orange-50 shadow-lg shadow-orange-100' 
                            : 'bg-white border-gray-100 hover:border-orange-200'
                    }
                `}
                noPadding
            >
                {/* Background Decor */}
                {isZeroState ? (
                    <>
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                        <div className="absolute top-[-50%] right-[-50%] w-[100%] h-[100%] bg-white/20 rounded-full blur-[60px] animate-pulse"></div>
                    </>
                ) : (
                    <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/40 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>
                )}

                <div className="p-6 flex flex-col h-full justify-between relative z-10">
                    
                    {/* Top Row: Title + Trend */}
                    <div className="flex justify-between items-start">
                        <div className="flex flex-col">
                            <h3 className={`text-xs font-black uppercase tracking-wider mb-1 ${isZeroState ? 'text-green-100' : 'text-gray-400'}`}>
                                {isZeroState ? '当前状态' : '错题大盘'}
                            </h3>
                            {isZeroState && <span className="text-white font-bold text-lg">全部消灭!</span>}
                        </div>
                        
                        {/* Trend Badge */}
                        {!isZeroState && (
                            <div className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-lg text-[10px] font-bold shadow-sm">
                                <TrendingDown size={12} strokeWidth={3} />
                                <span>今日消灭 3</span>
                            </div>
                        )}
                    </div>

                    {/* Middle: Big Number or Trophy */}
                    <div className="flex items-end gap-2 my-2">
                        {isZeroState ? (
                            <div className="flex items-center gap-4">
                                <motion.div 
                                    initial={{ scale: 0 }} animate={{ scale: 1 }} 
                                    transition={{ type: "spring", bounce: 0.5 }}
                                    className="text-white"
                                >
                                    <Crown size={48} fill="currentColor" className="drop-shadow-lg" />
                                </motion.div>
                                <div className="text-green-100 text-xs font-medium leading-tight">
                                    太棒了！<br/>保持这种势头！
                                </div>
                            </div>
                        ) : (
                            <div className="flex items-baseline w-full">
                                <span className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-gray-800 to-gray-600 tracking-tight">
                                    {data.totalPending}
                                </span>
                                <span className="text-gray-400 text-sm font-bold ml-1 mb-2">题待办</span>
                            </div>
                        )}
                    </div>

                    {/* Bottom: Stacked Progress Bar */}
                    {!isZeroState && (
                        <div className="flex flex-col gap-2">
                            {/* The Bar */}
                            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden flex">
                                {/* New (Red) */}
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentNew}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                    className="h-full bg-red-500 relative group/bar"
                                >
                                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover/bar:opacity-100 transition-opacity"></div>
                                </motion.div>
                                
                                {/* Reviewing (Yellow) */}
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentReview}%` }}
                                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                                    className="h-full bg-yellow-400 relative group/bar"
                                >
                                     <div className="absolute inset-0 bg-white/20 opacity-0 group-hover/bar:opacity-100 transition-opacity"></div>
                                </motion.div>
                            </div>

                            {/* Legend */}
                            <div className="flex justify-between items-center text-[10px] font-bold text-gray-400">
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-red-500"></div>
                                        {pendingNewCount} 新题
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
                                        {pendingReviewCount} 复习中
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Right: Subject Stats (Grid layout on mobile, row on desktop) */}
            <div className="flex-1 md:flex-[0.6] flex gap-3 overflow-x-auto no-scrollbar pb-2 md:pb-0 px-1 snap-x">
                {data.subjectStats.map((stat, idx) => {
                    const isActive = activeSubjectFilter === stat.subject;
                    return (
                        <Card 
                            key={idx} 
                            onClick={() => setActiveSubjectFilter(isActive ? 'All' : stat.subject)}
                            className={`min-w-[130px] flex-1 flex flex-col justify-between items-center bg-white shadow-sm relative group transition-all cursor-pointer snap-start
                                ${isActive 
                                    ? 'border-2 border-brand ring-4 ring-brand/10 bg-brand/5' 
                                    : 'border border-gray-100 hover:border-brand/30 hover:shadow-md'
                                }`}
                        >
                            <div className="w-full flex justify-between items-start mb-2">
                                <span className={`font-bold transition-colors ${isActive ? 'text-brand' : 'text-gray-700'}`}>{stat.subject}</span>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isActive ? 'bg-brand text-white' : 'bg-gray-50 text-gray-400 group-hover:bg-brand/10 group-hover:text-brand'}`}>
                                    <BookX size={14} />
                                </div>
                            </div>
                            
                            {/* Radial Progress */}
                            <div className="relative w-14 h-14 md:w-16 md:h-16 shrink-0 flex items-center justify-center rounded-full" 
                                style={{ background: `conic-gradient(#6C5DD3 ${stat.solvedPercentage}%, #E5E7EB 0)` }}>
                                <div className="absolute inset-1 bg-white rounded-full flex flex-col items-center justify-center">
                                    <span className="text-[9px] md:text-[10px] text-gray-400 font-bold">已解决</span>
                                    <span className="text-sm md:text-base font-extrabold text-brand">{stat.solvedPercentage}%</span>
                                </div>
                            </div>

                            <p className="text-[10px] text-gray-400 mt-3 font-medium text-center w-full bg-white/50 rounded-lg py-1">
                                待消灭 <span className={`font-bold text-base ${stat.pendingCount > 5 ? 'text-red-500' : 'text-orange-500'}`}>{stat.pendingCount}</span>
                            </p>
                        </Card>
                    );
                })}
            </div>
        </div>

        {/* 3.2 Smart Action Entry */}
        <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsDailyChallengeOpen(true)}
            className="w-full bg-gradient-to-r from-brand to-purple-600 rounded-[28px] p-1 shadow-lg shadow-brand/20 group"
        >
            <div className="bg-white/10 backdrop-blur-sm rounded-[24px] px-6 py-5 flex items-center justify-between border border-white/20">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center text-brand-dark shadow-lg shadow-accent/20 group-hover:animate-pulse">
                        <Zap size={24} fill="currentColor" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-white text-lg font-bold flex items-center gap-2">
                            每日攻克
                        </h3>
                        <p className="text-brand-light text-sm font-medium">AI 为你精选 10 道高频错题</p>
                    </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white group-hover:translate-x-1 transition-transform">
                    <ArrowRight size={20} />
                </div>
            </div>
        </motion.button>

        {/* 3.3 Mistake List & Filters */}
        <div>
            {/* Filter Header - Interactive Toggle */}
            <div className="flex justify-between items-center mb-4 px-1">
                <div className="flex gap-2">
                    {/* Active Subject Indicator */}
                    <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 text-white rounded-lg text-xs font-bold shadow-sm">
                        <span>{activeSubjectFilter === 'All' ? '全部学科' : activeSubjectFilter}</span>
                        {activeSubjectFilter !== 'All' && <button onClick={() => setActiveSubjectFilter('All')} className="p-0.5 rounded-full hover:bg-white/20"><X size={10}/></button>}
                    </div>
                    
                    {/* Status Toggles */}
                    <div className="flex bg-gray-200 rounded-lg p-1">
                        <button 
                            onClick={() => setActiveStatusFilter('pending')}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${activeStatusFilter === 'pending' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                        >
                            全部待办
                        </button>
                        <button 
                            onClick={() => setActiveStatusFilter('new')}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${activeStatusFilter === 'new' ? 'bg-red-500 text-white shadow-sm' : 'text-gray-500 hover:text-red-500'}`}
                        >
                            {activeStatusFilter === 'new' && <Circle size={6} fill="currentColor" />}
                            未掌握
                        </button>
                        <button 
                            onClick={() => setActiveStatusFilter('reviewing')}
                            className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1 ${activeStatusFilter === 'reviewing' ? 'bg-yellow-400 text-yellow-900 shadow-sm' : 'text-gray-500 hover:text-yellow-600'}`}
                        >
                            {activeStatusFilter === 'reviewing' && <Circle size={6} fill="currentColor" />}
                            半生不熟
                        </button>
                    </div>
                </div>
                
                <button className="flex items-center gap-1 text-gray-400 text-xs font-bold">
                    <Filter size={12} /> 筛选
                </button>
            </div>

            {/* Groups */}
            <div className="flex flex-col gap-6">
                {filteredGroups.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <BookX size={32} />
                        </div>
                        <p className="font-bold text-sm">
                            {activeStatusFilter === 'pending' ? '该分类下暂无错题' : 
                             activeStatusFilter === 'new' ? '太棒了，没有完全陌生的错题！' : '没有正在复习中的题目'}
                        </p>
                    </div>
                ) : (
                    filteredGroups.map((group, gIdx) => (
                        <div key={gIdx} className="flex flex-col gap-3">
                            {/* Section Header */}
                            <div className="flex items-center gap-2 px-1">
                                <h4 className="text-gray-800 font-bold text-base">{group.topic}</h4>
                                <span className="bg-gray-200 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-full">{group.items.length}题</span>
                            </div>

                            {/* List Items */}
                            <div className="flex flex-col gap-3">
                                {group.items.map((item) => (
                                    <SwipeableMistakeCard 
                                        key={item.id} 
                                        item={item} 
                                        onClick={() => setSelectedMistake(item)} 
                                        onStar={handleStarToggle}
                                        onFlag={handleFlagClick}
                                    />
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
      </div>

      {/* Daily Challenge Modal */}
      {isDailyChallengeOpen && data && (
          <DailyConquerModal 
            items={data.groups.flatMap(g => g.items)}
            onClose={() => setIsDailyChallengeOpen(false)}
            onComplete={handleDailyChallengeComplete}
          />
      )}

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmAction && (
             <div className="absolute inset-0 z-[80] flex items-center justify-center p-4">
                 <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-gray-900/40 backdrop-blur-[2px]" 
                    onClick={() => setConfirmAction(null)} 
                 />
                 <motion.div 
                    initial={{ scale: 0.9, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 10 }}
                    className="bg-white rounded-[32px] p-6 shadow-2xl relative z-10 w-full max-w-sm text-center border border-white/50"
                 >
                     <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg ${confirmAction.type === 'master' ? 'bg-green-100 text-green-500' : 'bg-orange-100 text-orange-500'}`}>
                         {confirmAction.type === 'master' ? <Trophy size={32} strokeWidth={2} /> : <Zap size={32} strokeWidth={2} />}
                     </div>
                     
                     <h3 className="text-xl font-black text-gray-800 mb-2">
                        {confirmAction.type === 'master' ? '确认已掌握？' : '撤销掌握状态？'}
                     </h3>
                     <p className="text-sm text-gray-500 font-medium leading-relaxed mb-8">
                        {confirmAction.type === 'master' 
                           ? '太棒了！标记为【已掌握】后，该题将移出待复习列表，并为你增加 20 XP。' 
                           : '该题将重新回到【需复习】列表，方便你再次巩固知识点。'
                        }
                     </p>
                     
                     <div className="flex gap-3">
                         <button 
                            onClick={() => setConfirmAction(null)}
                            className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-colors"
                         >
                             再想想
                         </button>
                         <button 
                            onClick={confirmFlagChange}
                            className={`flex-1 py-3 rounded-xl text-white font-bold shadow-lg transition-transform active:scale-95 ${confirmAction.type === 'master' ? 'bg-green-500 shadow-green-200' : 'bg-orange-500 shadow-orange-200'}`}
                         >
                             {confirmAction.type === 'master' ? '确认掌握' : '确认撤销'}
                         </button>
                     </div>
                 </motion.div>
             </div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
          {selectedMistake && (
              <MistakeDetailModal 
                  item={selectedMistake} 
                  onClose={() => setSelectedMistake(null)} 
              />
          )}
      </AnimatePresence>
    </div>
  );
};

// Sub-component for Swipeable Card
const SwipeableMistakeCard: React.FC<{ 
    item: MistakeItem; 
    onClick: () => void;
    onStar: (item: MistakeItem) => void;
    onFlag: (item: MistakeItem) => void;
}> = ({ item, onClick, onStar, onFlag }) => {
    // Determine status color
    const statusColor = item.status === 'new' ? 'bg-red-500' : item.status === 'reviewing' ? 'bg-yellow-400' : 'bg-green-500';
    
    // Tag Color
    const tagColor = item.errorType === '计算错误' ? 'bg-blue-100 text-blue-600' : 
                     item.errorType === '概念模糊' ? 'bg-purple-100 text-purple-600' : 'bg-gray-100 text-gray-600';

    const isMastered = item.status === 'mastered';
    const isStarred = item.stats.isStarred;
    
    // Calculate Mastery Dots (Max 3)
    // Logic: consecutiveCorrect / 3. 
    // If status is 'new', usually 0. If reviewing, can be 1 or 2.
    const masteryLevel = Math.min(3, item.stats.correctCount || 0);

    return (
        <div className="relative h-28 w-full group">
             {/* Background Actions */}
            <div className="absolute inset-0 bg-green-100 rounded-2xl flex items-center justify-start px-6">
                <div className="flex items-center gap-2 text-green-600 font-bold">
                    <CheckCircle2 size={24} />
                    <span>标记已掌握</span>
                </div>
            </div>
            <div className="absolute inset-0 bg-gray-100 rounded-2xl flex items-center justify-end px-6">
                 <div className="flex items-center gap-2 text-gray-500 font-bold">
                    <Bookmark size={24} />
                    <span>收藏</span>
                </div>
            </div>

            {/* Foreground Card */}
            <motion.div 
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.05}
                whileTap={{ cursor: "grabbing" }}
                onClick={onClick}
                className="absolute inset-0 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex gap-4 cursor-pointer hover:shadow-md transition-shadow z-10"
            >
                {/* Status Indicator Bar */}
                <div className={`w-1.5 h-full rounded-full ${statusColor} opacity-80 shrink-0`}></div>

                {/* Content */}
                <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div className="flex justify-between items-start">
                        <p className="text-gray-800 font-bold text-sm line-clamp-2 leading-relaxed flex-1 mr-3">
                            {item.questionSnippet}
                        </p>
                        
                        {/* Action Icons Top Right */}
                        <div className="flex items-center gap-1 shrink-0 -mt-1 -mr-1">
                            <button 
                                onClick={(e) => { e.stopPropagation(); onStar(item); }}
                                className="p-2 hover:bg-gray-100 rounded-full text-gray-300 transition-colors active:scale-90"
                            >
                                <Star 
                                    size={18} 
                                    fill={isStarred ? "#FFCE51" : "none"} 
                                    className={`transition-colors ${isStarred ? "text-accent" : ""}`}
                                />
                            </button>
                            <button 
                                onClick={(e) => { e.stopPropagation(); onFlag(item); }}
                                className={`p-2 hover:bg-gray-100 rounded-full transition-colors active:scale-90 ${isMastered ? 'text-green-500' : 'text-gray-300'}`}
                            >
                                <Flag 
                                    size={18} 
                                    fill={isMastered ? "#10B981" : "none"}
                                />
                            </button>
                        </div>
                    </div>

                    <div className="flex items-end justify-between">
                        <div className="flex items-center gap-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${tagColor}`}>
                                {item.errorType}
                            </span>
                            
                            {/* Visual Mastery Progress - The Product Insight */}
                            {item.status !== 'new' && !isMastered && (
                                <div className="flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                                    <span className="text-[8px] text-gray-400 font-bold mr-0.5">熟练度</span>
                                    {[1, 2, 3].map(dot => (
                                        <div 
                                            key={dot} 
                                            className={`w-1.5 h-1.5 rounded-full ${dot <= masteryLevel ? 'bg-green-500' : 'bg-gray-200'}`}
                                        />
                                    ))}
                                </div>
                            )}
                            
                            {item.status === 'new' && (
                                <span className="text-[10px] text-red-400 font-medium">
                                    需初次复习
                                </span>
                            )}
                        </div>
                        
                        {/* Status Label (Right) */}
                        <div className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                             {item.lastReview}
                             <ChevronRight size={14} />
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
