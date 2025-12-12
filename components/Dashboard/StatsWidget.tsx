
import React, { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Card } from '../UI/Card';
import { 
    BarChart, Bar, AreaChart, Area, PieChart, Pie, 
    ResponsiveContainer, Cell, XAxis, Tooltip, CartesianGrid 
} from 'recharts';
import { Clock, Zap, Trophy, X, ChevronRight, Crown, Medal, TrendingUp, PieChart as PieIcon, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Types & Mock Data ---

// 1. Leaderboard Data
interface LeaderboardItem {
    id: string;
    name: string;
    avatar: string;
    xp: number;
    rank: number;
    isMe: boolean;
    trend?: 'up' | 'down' | 'same';
}

const generateLeaderboard = (period: 'daily' | 'weekly' | 'monthly'): LeaderboardItem[] => {
    const baseXP = period === 'daily' ? 150 : period === 'weekly' ? 2000 : 8000;
    const range = period === 'daily' ? 200 : period === 'weekly' ? 1500 : 5000;
    
    const names = ['张伟', '王芳', '刘强', '陈杰', '杨洋', '赵敏', '周涛', '吴刚', '郑丽', '孙红', '朱明', '何炅', '谢娜', '汪涵'];
    const avatars = ['👦', '👧', '🧑‍🦱', '👩‍🦰', '👱', '👱‍♀️', '🧔', '👩‍🦱', '👨‍🦲', '👩‍🦳', '🧔‍♂️', '👨‍🦰', '👩‍🦱', '👓'];

    let items: Omit<LeaderboardItem, 'rank'>[] = names.map((name, i) => ({
        id: `student-${i}`,
        name,
        avatar: avatars[i % avatars.length],
        xp: Math.floor(baseXP + Math.random() * range),
        isMe: false,
        trend: (Math.random() > 0.5 ? 'up' : 'same') as 'up' | 'down' | 'same'
    }));

    // Add current user
    const myXP = Math.floor(baseXP + range * 0.6); 
    items.push({
        id: 'me',
        name: '李华',
        avatar: '🤖',
        xp: myXP,
        isMe: true,
        trend: 'up'
    });

    items.sort((a, b) => b.xp - a.xp);
    return items.map((item, index) => ({ ...item, rank: index + 1 }));
};

// 2. Chart Data
const chartData = [
  { name: '周一', short: '一', xp: 300, time: 45, subject: 'math' },
  { name: '周二', short: '二', xp: 450, time: 60, subject: 'eng' },
  { name: '周三', short: '三', xp: 200, time: 30, subject: 'chn' },
  { name: '周四', short: '四', xp: 600, time: 90, subject: 'math' },
  { name: '周五', short: '五', xp: 400, time: 50, subject: 'sci' },
  { name: '周六', short: '六', xp: 100, time: 20, subject: 'eng' },
  { name: '周日', short: '日', xp: 50,  time: 10, subject: 'chn' },
];

const subjectDistribution = [
    { name: '数学', value: 45, color: '#6C5DD3' },
    { name: '英语', value: 30, color: '#FFCE51' },
    { name: '语文', value: 25, color: '#FF754C' },
];

export const StatsWidget: React.FC = () => {
  // State for Modals
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isDataOpen, setIsDataOpen] = useState(false);
  
  const [leaderboardTab, setLeaderboardTab] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.getElementById('modal-root') || document.body);
  }, []);

  const leaderboardData = useMemo(() => generateLeaderboard(leaderboardTab), [leaderboardTab]);
  const myRankData = leaderboardData.find(item => item.isMe);
  
  // Preview data: Top 3 from Weekly
  const top3Preview = useMemo(() => generateLeaderboard('weekly').slice(0, 3), []);

  // Common Modal Styles for Consistency
  const modalContainerClass = "w-[90vw] md:w-full md:max-w-xl h-[80vh] max-h-[800px] bg-white rounded-[32px] shadow-2xl flex flex-col overflow-hidden pointer-events-auto relative";

  return (
    <>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 mt-6 pb-24">
      
      {/* --- Card A: Learning Data Center (Consolidated) --- */}
      <Card 
        className="flex flex-col relative overflow-hidden group cursor-pointer border-2 border-transparent hover:border-brand/20 transition-all p-0"
        onClick={() => setIsDataOpen(true)}
        noPadding
      >
        <div className="p-5 flex-1 flex flex-col gap-4">
            {/* Top Section: XP & Chart */}
            <div className="flex justify-between items-start mb-2">
                <div>
                    <h3 className="text-gray-500 text-sm font-bold flex items-center gap-1">
                        本周经验
                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400" />
                    </h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-extrabold text-brand">2,100</span>
                        <span className="text-xs text-gray-400 font-bold">XP</span>
                    </div>
                </div>
                <div className="p-2 bg-brand/10 rounded-xl text-brand">
                    <Zap size={20} fill="currentColor" />
                </div>
            </div>

            {/* Mini Chart with XAxis */}
            <div className="h-24 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                        <XAxis 
                            dataKey="short" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 'bold' }} 
                            dy={5}
                        />
                        <Bar dataKey="xp" radius={[4, 4, 4, 4]}>
                            {chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 3 ? '#6C5DD3' : '#E2E8F0'} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100 w-full"></div>

            {/* Bottom Section: Study Time Summary */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-gray-400 text-xs font-bold mb-0.5">累计学习时长</h3>
                    <div className="flex items-baseline gap-1">
                        <span className="text-xl font-bold text-gray-800">3.5</span>
                        <span className="text-xs text-gray-400 font-bold">小时</span>
                    </div>
                </div>
                <div className="flex gap-1">
                    {[1,2,3,4,5].map((i) => (
                        <div key={i} className={`w-1.5 h-6 rounded-full ${i<=3 ? 'bg-indigo-400' : 'bg-gray-200'}`}></div>
                    ))}
                </div>
            </div>
        </div>
      </Card>

      {/* --- Card B: Leaderboard (Standalone) --- */}
      <Card 
        className="flex flex-col relative overflow-hidden group cursor-pointer border-2 border-transparent hover:border-yellow-400/30 transition-all bg-gradient-to-b from-white to-orange-50/30"
        onClick={() => setIsLeaderboardOpen(true)}
      >
         <div className="flex justify-between items-center mb-6">
            <h3 className="text-gray-500 text-sm font-bold flex items-center gap-2">
                <Trophy size={16} className="text-yellow-500" />
                风云榜
            </h3>
            <span className="text-[10px] bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-bold">
                周榜 TOP 3
            </span>
         </div>

         {/* Top 3 Preview List */}
         <div className="flex-1 flex flex-col justify-between gap-2">
            {top3Preview.map((student, idx) => (
                <div key={student.id} className="flex items-center justify-between p-2 rounded-xl bg-white border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3">
                        {/* Medal Icon */}
                        <div className="w-6 flex justify-center">
                            {idx === 0 ? <Crown size={18} className="text-yellow-500 fill-yellow-500" /> :
                             idx === 1 ? <Medal size={18} className="text-gray-400 fill-gray-400" /> :
                             <Medal size={18} className="text-orange-400 fill-orange-400" />
                            }
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-sm">
                            {student.avatar}
                        </div>
                        <span className="text-sm font-bold text-gray-700">{student.name}</span>
                    </div>
                    <span className="text-xs font-bold text-brand">{student.xp} XP</span>
                </div>
            ))}
         </div>
         
         <div className="mt-4 text-center">
             <span className="text-xs text-gray-400 font-bold group-hover:text-brand transition-colors flex items-center justify-center gap-1">
                 查看完整榜单 <ChevronRight size={12} />
             </span>
         </div>
      </Card>
    </div>

    {/* ========================================================== */}
    {/* PORTAL 1: LEADERBOARD MODAL                              */}
    {/* ========================================================== */}
    {portalTarget && createPortal(
        <AnimatePresence>
            {isLeaderboardOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setIsLeaderboardOpen(false)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[70] pointer-events-auto"
                    />
                    
                    {/* Modal Content - Centered via Flex parent (modal-root) */}
                    <motion.div 
                         initial={{ opacity: 0, scale: 0.9, y: 20 }}
                         animate={{ opacity: 1, scale: 1, y: 0 }}
                         exit={{ opacity: 0, scale: 0.9, y: 20 }}
                         className={modalContainerClass + " z-[80]"}
                    >
                        {/* 1. Header (Sticky) */}
                        <div className="px-6 pt-6 pb-4 bg-white z-10 shrink-0 border-b border-gray-50">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                                    <span className="bg-accent p-1.5 rounded-lg text-brand-dark">
                                        <Trophy size={20} strokeWidth={2.5} />
                                    </span>
                                    风云榜
                                </h2>
                                <button onClick={() => setIsLeaderboardOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-500">
                                    <X size={20} />
                                </button>
                            </div>
                            
                            {/* Tabs */}
                            <div className="flex p-1 bg-gray-100 rounded-xl relative">
                                <motion.div 
                                    className="absolute top-1 bottom-1 bg-white rounded-lg shadow-sm z-0"
                                    layoutId="lb-tab-bg"
                                    initial={false}
                                    animate={{ 
                                        left: leaderboardTab === 'daily' ? 4 : leaderboardTab === 'weekly' ? '33.33%' : '66.66%',
                                        width: '32%' 
                                    }}
                                />
                                {(['daily', 'weekly', 'monthly'] as const).map((tab) => (
                                    <button key={tab} onClick={() => setLeaderboardTab(tab)} className={`flex-1 py-2 text-sm font-bold relative z-10 transition-colors ${leaderboardTab === tab ? 'text-gray-900' : 'text-gray-400'}`}>
                                        {tab === 'daily' ? '日榜' : tab === 'weekly' ? '周榜' : '月榜'}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 2. My Rank (Sticky below header) */}
                        <div className="px-4 py-2 bg-white shrink-0 z-10">
                            <div className="bg-brand p-4 rounded-2xl text-white shadow-lg flex items-center justify-between relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10"></div>
                                <div className="flex items-center gap-4 relative z-10">
                                    <div className="font-black text-2xl w-8 text-center">{myRankData?.rank}</div>
                                    <div className="flex flex-col">
                                        <span className="font-bold flex items-center gap-2 text-lg">
                                            <span className="text-2xl">{myRankData?.avatar}</span> 我
                                        </span>
                                        <span className="text-brand-light text-xs font-medium">
                                            距上一名还差 {Math.floor(Math.random() * 100 + 50)} XP
                                        </span>
                                    </div>
                                </div>
                                <div className="text-right relative z-10">
                                    <div className="text-2xl font-black">{myRankData?.xp}</div>
                                    <div className="text-xs text-brand-light font-bold">XP</div>
                                </div>
                            </div>
                        </div>

                        {/* 3. List Body (Scrollable) */}
                        <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-2 pb-6 space-y-3">
                            {leaderboardData.map((student, idx) => (
                                <div key={student.id} className={`flex items-center p-3 rounded-2xl ${student.isMe ? 'bg-brand/5 border-2 border-brand/20 hidden' : 'bg-gray-50 border border-transparent'}`}>
                                    <div className="w-10 flex justify-center shrink-0">
                                        {student.rank === 1 ? <Crown size={24} className="text-yellow-500 fill-yellow-500" /> : 
                                         student.rank === 2 ? <Medal size={24} className="text-gray-400 fill-gray-400" /> : 
                                         student.rank === 3 ? <Medal size={24} className="text-orange-400 fill-orange-400" /> : 
                                         <span className="text-gray-400 font-bold">{student.rank}</span>}
                                    </div>
                                    <div className="flex-1 flex items-center gap-3 ml-2">
                                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm border border-gray-100">{student.avatar}</div>
                                        <span className={`font-bold text-sm ${student.isMe ? 'text-brand' : 'text-gray-700'}`}>{student.name}</span>
                                    </div>
                                    <div className="text-right font-bold text-gray-800">{student.xp} <span className="text-xs text-gray-400 font-medium">XP</span></div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        portalTarget
    )}

    {/* ========================================================== */}
    {/* PORTAL 2: DATA ANALYSIS MODAL                            */}
    {/* ========================================================== */}
    {portalTarget && createPortal(
        <AnimatePresence>
            {isDataOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setIsDataOpen(false)}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[70] pointer-events-auto"
                    />
                    
                    {/* Modal Content - Centered via Flex parent */}
                    <motion.div 
                         initial={{ opacity: 0, scale: 0.9, y: 20 }}
                         animate={{ opacity: 1, scale: 1, y: 0 }}
                         exit={{ opacity: 0, scale: 0.9, y: 20 }}
                         className={modalContainerClass + " z-[80]"}
                    >
                        {/* 1. Header (Sticky) */}
                        <div className="px-8 pt-8 pb-4 flex justify-between items-center bg-white z-10 shrink-0 border-b border-gray-50">
                            <div>
                                <h2 className="text-2xl font-black text-gray-800 flex items-center gap-2">
                                    <Activity size={24} className="text-brand" />
                                    学习数据分析
                                </h2>
                                <p className="text-gray-400 text-sm font-bold mt-1">本周学习效率提升 15% 🚀</p>
                            </div>
                            <button onClick={() => setIsDataOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-500">
                                <X size={20} />
                            </button>
                        </div>

                        {/* 2. Scrollable Body */}
                        <div className="flex-1 overflow-y-auto no-scrollbar px-8 py-6">
                            
                            {/* Trend Area Chart */}
                            <div className="mb-8">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="p-1.5 bg-blue-100 rounded-lg text-blue-600">
                                        <TrendingUp size={16} />
                                    </div>
                                    <h3 className="font-bold text-gray-700">经验获取趋势</h3>
                                </div>
                                <div className="h-48 w-full bg-gray-50 rounded-2xl border border-gray-100 p-2 relative overflow-hidden">
                                     <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={chartData}>
                                            <defs>
                                                <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#6C5DD3" stopOpacity={0.3}/>
                                                    <stop offset="95%" stopColor="#6C5DD3" stopOpacity={0}/>
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9CA3AF'}} />
                                            <Tooltip 
                                                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)'}}
                                                itemStyle={{color: '#6C5DD3', fontWeight: 'bold'}}
                                            />
                                            <Area type="monotone" dataKey="xp" stroke="#6C5DD3" strokeWidth={3} fillOpacity={1} fill="url(#colorXp)" />
                                        </AreaChart>
                                     </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Subject Distribution & Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Pie Chart */}
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="p-1.5 bg-orange-100 rounded-lg text-orange-600">
                                            <PieIcon size={16} />
                                        </div>
                                        <h3 className="font-bold text-gray-700">学科投入占比</h3>
                                    </div>
                                    <div className="h-40 relative">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={subjectDistribution}
                                                    innerRadius={40}
                                                    outerRadius={70}
                                                    paddingAngle={5}
                                                    dataKey="value"
                                                >
                                                    {subjectDistribution.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        {/* Legend Overlay */}
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                                            <span className="text-[10px] text-gray-400 font-bold block">主要投入</span>
                                            <span className="text-lg font-black text-brand">数学</span>
                                        </div>
                                    </div>
                                    <div className="flex justify-center gap-4 mt-2">
                                        {subjectDistribution.map(s => (
                                            <div key={s.name} className="flex items-center gap-1">
                                                <div className="w-2 h-2 rounded-full" style={{backgroundColor: s.color}}></div>
                                                <span className="text-xs font-bold text-gray-500">{s.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Key Metrics Cards */}
                                <div className="flex flex-col gap-3 justify-center">
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                            <Clock size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold">平均专注时长</p>
                                            <p className="text-lg font-black text-gray-800">42 <span className="text-xs font-normal">分钟</span></p>
                                        </div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                            <Zap size={20} />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400 font-bold">最高连胜记录</p>
                                            <p className="text-lg font-black text-gray-800">14 <span className="text-xs font-normal">天</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        portalTarget
    )}
    </>
  );
};
