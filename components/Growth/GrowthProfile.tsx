
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { UserProfileData } from '../../types';
import { getUserGrowthData } from '../../services/geminiService';
import { AbilityPersonaCard } from './AbilityPersonaCard';
import { Bot, ShoppingBag, Trophy, Lock, Settings, Coins, ChevronRight } from 'lucide-react';

interface GrowthProfileProps {
  onStartAssessment?: () => void;
  onOpenStore?: () => void;
  coins?: number; // Added prop to sync with global state
}

export const GrowthProfile: React.FC<GrowthProfileProps> = ({ onStartAssessment, onOpenStore, coins }) => {
  const [data, setData] = useState<UserProfileData | null>(null);

  useEffect(() => {
    getUserGrowthData().then(setData);
  }, []);

  if (!data) return <div className="p-8 text-center text-gray-400">加载档案...</div>;
  
  // Use passed prop coins if available, else fallback to fetched data
  const currentCoins = coins !== undefined ? coins : data.coins;

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar bg-[#F5F7FA]">
       
       {/* 4.1 Header Profile Section - Premium Gradient & Layout */}
       <div className="relative bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-[#6C5DD3] via-[#7c66dc] to-[#9F94FF] pt-6 pb-14 px-6 rounded-b-[48px] shadow-lg mb-8 overflow-hidden">
            {/* Noise Texture Overlay for Texture */}
            <div className="absolute inset-0 opacity-[0.15] pointer-events-none mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}></div>
            
            {/* Ambient Blobs */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mr-20 -mt-20 blur-[80px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/20 rounded-full -ml-20 -mb-20 blur-[60px] pointer-events-none"></div>
            
            {/* Top Toolbar (Settings) */}
            <div className="relative z-20 flex justify-end mb-2">
                <button className="p-2.5 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors backdrop-blur-md shadow-sm border border-white/10">
                    <Settings size={20} />
                </button>
            </div>

            <div className="max-w-3xl mx-auto flex items-end justify-between relative z-10">
                <div className="flex flex-col gap-4 text-white pl-2">
                    {/* Name and Level Row */}
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-3xl font-black tracking-tight drop-shadow-sm">{data.name}</h1>
                            <div className="bg-gradient-to-r from-accent to-yellow-300 text-brand-dark font-black text-xs px-2.5 py-1 rounded-lg shadow-lg shadow-yellow-400/20 transform rotate-3 flex items-center gap-1 border border-white/20">
                                Lv.{data.level}
                            </div>
                        </div>
                        {/* Coins Badge */}
                        <div className="flex items-center gap-1.5 text-yellow-100 font-bold text-sm bg-black/10 w-fit px-3 py-1 rounded-full border border-white/5 backdrop-blur-md">
                             <Coins size={14} className="text-yellow-400 fill-yellow-400" />
                             <span>{currentCoins}</span>
                        </div>
                    </div>
                    
                    {/* XP Info Row */}
                    <div className="mt-1">
                        <div className="flex items-center justify-between text-xs font-bold text-indigo-100 mb-2 px-1">
                            <span>累计成长</span>
                            <span className="text-white font-mono">{data.currentXp}/{data.nextLevelXp} XP</span>
                        </div>
                        {/* XP Bar */}
                        <div className="w-60 h-3 bg-black/20 rounded-full overflow-hidden ring-1 ring-white/10 backdrop-blur-sm shadow-inner">
                            <div 
                                className="h-full bg-gradient-to-r from-accent to-yellow-300 shadow-[0_0_15px_rgba(255,206,81,0.5)] relative" 
                                style={{ width: `${(data.currentXp / data.nextLevelXp) * 100}%` }}
                            >
                                <div className="absolute inset-0 bg-white/30 w-full h-full" style={{backgroundImage: 'linear-gradient(45deg,rgba(255,255,255,0.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,0.15) 50%,rgba(255,255,255,0.15) 75%,transparent 75%,transparent)', backgroundSize: '10px 10px'}}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI Companion - Adjusted Position (Moved Left) */}
                <div className="relative group cursor-pointer -mb-6 mr-8">
                    <motion.div 
                        animate={{ y: [0, -6, 0] }} 
                        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                        className="w-36 h-36 relative drop-shadow-2xl"
                    >
                        {/* Unified Robot Representation */}
                        <Bot size={144} className="text-white" strokeWidth={1} />
                        {/* Eyes */}
                        <div className="absolute top-11 left-9 w-3.5 h-3.5 bg-cyan-300 rounded-full animate-pulse shadow-[0_0_15px_#22d3ee]"></div>
                        <div className="absolute top-11 right-9 w-3.5 h-3.5 bg-cyan-300 rounded-full animate-pulse shadow-[0_0_15px_#22d3ee]"></div>
                    </motion.div>
                </div>
            </div>
       </div>

       <div className="max-w-3xl mx-auto px-6 pb-32 flex flex-col gap-8">
            
            {/* 4.2 Ability Radar Chart (Glassmorphism Light) */}
            {data.assessmentResult ? (
                <AbilityPersonaCard 
                    data={data.assessmentResult} 
                    onRetake={onStartAssessment || (() => {})} 
                />
            ) : (
                <div className="bg-white/60 backdrop-blur-xl p-8 rounded-[32px] text-center shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] border border-white/60">
                    <p className="text-gray-500 mb-4 font-bold">暂无能力分析</p>
                    <button onClick={onStartAssessment} className="text-brand font-black underline">立即测评</button>
                </div>
            )}

            {/* 4.4 Shop Entry (Light Glass Style) */}
            <button 
                onClick={onOpenStore}
                className="w-full bg-white/70 backdrop-blur-xl border border-white/60 rounded-[32px] p-5 shadow-[0_15px_40px_-10px_rgba(0,0,0,0.05)] flex items-center justify-between group active:scale-98 transition-all hover:shadow-[0_20px_50px_-10px_rgba(108,93,211,0.15)] hover:border-brand/20"
            >
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-brand/5 rounded-2xl flex items-center justify-center text-brand group-hover:scale-105 transition-transform border border-brand/5">
                        <ShoppingBag size={30} strokeWidth={2} />
                    </div>
                    <div className="text-left">
                         <h3 className="font-bold text-gray-800 text-lg mb-1 group-hover:text-brand transition-colors">积分商店</h3>
                         <p className="text-gray-400 text-xs font-bold">
                            余额 <span className="text-accent-dark font-black text-sm mx-0.5">{currentCoins}</span> 
                         </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 text-brand font-bold text-sm px-4 py-2 rounded-xl bg-brand/5 border border-brand/10 group-hover:bg-brand group-hover:text-white transition-all">
                    去兑换 <ChevronRight size={16} />
                </div>
            </button>

            {/* 4.3 Achievements */}
            <div>
                <div className="flex justify-between items-center mb-6 px-2">
                    <h3 className="font-black text-gray-800 flex items-center gap-2 text-lg">
                        <span className="w-1.5 h-5 bg-gradient-to-b from-accent to-yellow-400 rounded-full"></span>
                        成就墙
                    </h3>
                    <div className="bg-gray-100/80 px-3 py-1 rounded-full text-xs font-bold text-gray-400 border border-white/50">
                        {data.achievements.filter(a => a.unlocked).length}/{data.achievements.length} 点亮
                    </div>
                </div>
                
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-8 -mx-6 px-6 md:mx-0 md:px-0 snap-x">
                    {data.achievements.map((ach) => (
                        <div 
                            key={ach.id} 
                            className={`snap-start min-w-[140px] p-5 rounded-[24px] flex flex-col items-center text-center gap-4 transition-all relative group
                                ${ach.unlocked 
                                ? 'bg-white border border-white/60 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.05)]' 
                                : 'bg-gray-50/50 border border-gray-100 opacity-60 grayscale'
                            }`}
                        >
                            {/* Achievement Icon */}
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl shadow-inner relative overflow-hidden ${ach.unlocked ? 'bg-gradient-to-br from-yellow-50 to-orange-50' : 'bg-gray-200'}`}>
                                {ach.unlocked ? (
                                    <>
                                        <div className="absolute inset-0 bg-white/40 blur-md"></div>
                                        <span className="relative z-10 drop-shadow-sm">{ach.icon}</span>
                                    </>
                                ) : <Lock size={20} className="text-gray-400"/>}
                            </div>
                            
                            {/* Text Info */}
                            <div>
                                <h4 className="font-bold text-sm text-gray-800 mb-1.5">{ach.title}</h4>
                                <p className="text-[10px] text-gray-400 font-medium leading-tight h-8 line-clamp-2 px-1">
                                    {ach.unlocked ? ach.description : '???'}
                                </p>
                            </div>

                            {ach.unlocked && <div className="absolute top-3 right-3 w-2 h-2 bg-accent rounded-full shadow-[0_0_10px_rgba(255,206,81,0.8)] animate-pulse"></div>}
                        </div>
                    ))}
                </div>
            </div>

       </div>
    </div>
  );
};
