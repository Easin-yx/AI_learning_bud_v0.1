
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MapNode, SubjectType, SubjectData } from '../../types';
import { getSubjectMapData } from '../../services/geminiService';
import { Lock, Star, Play, LineChart, AudioWaveform, BookA, X, Package, Gift, Crown, Sword, ChevronRight, BookOpen, Layers, CheckCircle2, ChevronDown, Settings2, Scroll, Headphones } from 'lucide-react';

// Toolbox items mapping
const TOOLBOX_ITEMS = {
  '数学': { icon: LineChart, label: '函数生成', color: 'bg-blue-500' },
  '语文': { icon: BookA, label: '汉语词典', color: 'bg-red-500' },
  '英语': { icon: AudioWaveform, label: '音标助手', color: 'bg-green-500' },
};

// Stage Context Configuration
const SUBJECT_STAGE_CONFIG = {
    '数学': {
        grade: '七年级上',
        textbook: '人教版',
        chapter: '第三章：一元一次方程',
        icon: Layers,
        themeColor: 'bg-brand',
        gradient: 'from-brand/5 to-white/50',
        iconColor: 'text-brand',
        shadow: 'shadow-[0_8px_30px_rgba(108,93,211,0.15)] hover:shadow-[0_12px_40px_rgba(108,93,211,0.25)]'
    },
    '语文': {
        grade: '七年级上',
        textbook: '部编版',
        chapter: '第二单元：古诗文诵读',
        icon: Scroll,
        themeColor: 'bg-red-500',
        gradient: 'from-red-50 to-orange-50/50',
        iconColor: 'text-red-500',
        shadow: 'shadow-[0_8px_30px_rgba(239,68,68,0.15)] hover:shadow-[0_12px_40px_rgba(239,68,68,0.25)]'
    },
    '英语': {
        grade: '七年级上',
        textbook: '人教版 (Go For It!)',
        chapter: 'Unit 3: What time do you go to school?',
        icon: Headphones,
        themeColor: 'bg-emerald-500',
        gradient: 'from-emerald-50 to-teal-50/50',
        iconColor: 'text-emerald-500',
        shadow: 'shadow-[0_8px_30px_rgba(16,185,129,0.15)] hover:shadow-[0_12px_40px_rgba(16,185,129,0.25)]'
    }
};

// Mock Syllabus Data per Subject
const MOCK_SYLLABUS_DATA = {
    '数学': [
        { id: 'm1', title: '第一章：有理数', status: 'completed' },
        { id: 'm2', title: '第二章：整式的加减', status: 'completed' },
        { id: 'm3', title: '第三章：一元一次方程', status: 'current' },
        { id: 'm4', title: '第四章：几何图形初步', status: 'locked' },
        { id: 'm5', title: '第五章：相交线与平行线', status: 'locked' },
    ],
    '语文': [
        { id: 'c1', title: '第一单元：四季美景', status: 'completed' },
        { id: 'c2', title: '第二单元：古诗文诵读', status: 'current' },
        { id: 'c3', title: '第三单元：写人记事', status: 'locked' },
        { id: 'c4', title: '第四单元：人生之舟', status: 'locked' },
        { id: 'c5', title: '第五单元：动物与人', status: 'locked' },
    ],
    '英语': [
        { id: 'e1', title: 'Unit 1: My name\'s Gina', status: 'completed' },
        { id: 'e2', title: 'Unit 2: This is my sister', status: 'completed' },
        { id: 'e3', title: 'Unit 3: What time do you go to school?', status: 'current' },
        { id: 'e4', title: 'Unit 4: Don\'t eat in class', status: 'locked' },
        { id: 'e5', title: 'Unit 5: Why do you like pandas?', status: 'locked' },
    ]
};

const GRADES = ['七年级上', '七年级下', '八年级上', '八年级下', '九年级上'];
const TEXTBOOKS = ['人教版', '北师大版', '苏教版', '部编版'];

interface SubjectMapProps {
    activeSubject: SubjectType;
    onStartLevel?: () => void;
}

export const SubjectMap: React.FC<SubjectMapProps> = ({ activeSubject, onStartLevel }) => {
  const [mapData, setMapData] = useState<SubjectData | null>(null);
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null);
  const [isToolboxOpen, setIsToolboxOpen] = useState(false);
  const [isSyllabusOpen, setIsSyllabusOpen] = useState(false);
  const [isConfigExpanded, setIsConfigExpanded] = useState(false);

  // Current Config based on Subject
  const stageConfig = SUBJECT_STAGE_CONFIG[activeSubject];
  const syllabusList = MOCK_SYLLABUS_DATA[activeSubject];

  // Syllabus State (Synced with subject defaults)
  const [currentGrade, setCurrentGrade] = useState(stageConfig.grade);
  const [currentTextbook, setCurrentTextbook] = useState(stageConfig.textbook);

  // Sync state when subject changes
  useEffect(() => {
      setCurrentGrade(stageConfig.grade);
      setCurrentTextbook(stageConfig.textbook);
  }, [activeSubject, stageConfig]);

  // Portal Target
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.getElementById('modal-root'));
  }, []);

  useEffect(() => {
    // Fetch data when subject changes
    setMapData(null);
    getSubjectMapData(activeSubject).then(setMapData);
  }, [activeSubject]);

  const handleNodeClick = (node: MapNode) => {
    if (node.status !== 'locked') {
      setSelectedNode(node);
    }
  };

  const handleStart = () => {
      setSelectedNode(null);
      if (onStartLevel) onStartLevel();
  };

  return (
    <div className="relative w-full h-full flex flex-col bg-surface overflow-hidden">
      
      {/* Background Decor: Dot Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#6C5DD3 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
      </div>

      {/* 2.4 Toolbox FAB - Bottom Left */}
      <div className="absolute bottom-28 left-6 z-30 flex flex-col items-start gap-3 pointer-events-none">
         <div className="pointer-events-auto flex flex-col-reverse items-start gap-3">
            <button 
                onClick={() => setIsToolboxOpen(!isToolboxOpen)}
                className={`w-14 h-14 bg-white rounded-[20px] shadow-[0_8px_30px_rgba(0,0,0,0.12)] flex items-center justify-center text-brand border border-white hover:scale-105 active:scale-95 transition-all duration-300 z-30 relative ${isToolboxOpen ? 'bg-gray-50 ring-4 ring-brand/10' : ''}`}
            >
                {isToolboxOpen ? <X size={28} /> : <div className="grid grid-cols-2 gap-1"><div className="w-2 h-2 rounded-full bg-brand"></div><div className="w-2 h-2 rounded-full bg-accent"></div><div className="w-2 h-2 rounded-full bg-blue-400"></div><div className="w-2 h-2 rounded-full bg-pink-400"></div></div>}
            </button>

            <AnimatePresence>
                {isToolboxOpen && (
                <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    className="flex flex-col-reverse gap-3 items-start origin-bottom-left mb-2"
                >
                    <button className="flex items-center gap-3 bg-white px-4 py-3 rounded-2xl shadow-xl shadow-gray-200/50 text-sm font-bold text-gray-700 hover:scale-105 transition-transform active:scale-95">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md ${TOOLBOX_ITEMS[activeSubject].color}`}>
                            {React.createElement(TOOLBOX_ITEMS[activeSubject].icon, { size: 16, strokeWidth: 2.5 })}
                        </div>
                        <span>{TOOLBOX_ITEMS[activeSubject].label}</span>
                    </button>
                </motion.div>
                )}
            </AnimatePresence>
         </div>
      </div>

      {/* NEW: Stage Context Card (Sticky Header) */}
      <div className="absolute top-0 w-full z-20 pt-24 px-4 pointer-events-none">
          <div className="pointer-events-auto flex justify-center">
            <motion.button 
                onClick={() => setIsSyllabusOpen(true)}
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                // Re-trigger animation when subject changes
                key={activeSubject} 
                className="w-full max-w-sm group relative"
            >
                {/* Backdrop Blur Container */}
                <div className={`bg-white/90 backdrop-blur-xl border border-white/60 rounded-[24px] p-1 transition-all active:scale-98 ${stageConfig.shadow}`}>
                    <div className={`bg-gradient-to-r ${stageConfig.gradient} rounded-[20px] p-4 flex items-center justify-between`}>
                        <div className="flex flex-col items-start gap-1 min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-black ${stageConfig.themeColor} text-white px-2 py-0.5 rounded-full shadow-sm`}>
                                    进行中
                                </span>
                                <span className="text-xs font-bold text-gray-400 truncate">
                                    {currentGrade} · {currentTextbook}
                                </span>
                            </div>
                            <h2 className="text-xl font-black text-gray-800 flex items-center gap-2 truncate w-full pr-2 leading-tight">
                                {stageConfig.chapter}
                            </h2>
                        </div>
                        <div className={`w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-400 group-hover:scale-110 transition-all shrink-0 ${stageConfig.iconColor}`}>
                            <stageConfig.icon size={20} />
                        </div>
                    </div>
                </div>
            </motion.button>
          </div>
          
          {/* Fade gradient below header for smooth scroll effect */}
          <div className="absolute top-full left-0 w-full h-12 bg-gradient-to-b from-surface to-transparent pointer-events-none"></div>
      </div>

      {/* 2.2 Map Container (Scrolling Area) */}
      <div className="flex-1 overflow-y-auto no-scrollbar relative scroll-smooth z-0 pt-56">
        <div className="min-h-[120%] pb-48 px-4 relative flex flex-col items-center">
            
            {/* The ZigZag Line (SVG) - Simplified Path */}
            <svg className="absolute top-0 left-0 w-full h-[90%] pointer-events-none z-0 overflow-visible" preserveAspectRatio="none">
               <defs>
                 <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                   <stop offset="0%" stopColor="#F5F7FA" stopOpacity="0" />
                   <stop offset="10%" stopColor="#D8B4FE" stopOpacity="1" />
                   <stop offset="90%" stopColor="#D8B4FE" stopOpacity="1" />
                   <stop offset="100%" stopColor="#F5F7FA" stopOpacity="0" />
                 </linearGradient>
               </defs>
               
               {/* Central Dashed Path */}
               <path 
                 d="M 50% 0 L 50% 100%" 
                 fill="none" 
                 stroke="url(#pathGradient)" 
                 strokeWidth="4" 
                 strokeDasharray="12 12"
                 strokeLinecap="round"
                 className="opacity-40"
               />
            </svg>

            {/* Nodes */}
            {mapData && mapData.nodes.map((node, index) => {
               // xOffset comes from API now (0, -60, 60) for zigzag
               return (
                  <div 
                     key={node.id}
                     className="relative flex justify-center items-center z-10 mb-16 last:mb-0"
                     style={{ 
                        transform: `translateX(${node.xOffset || 0}px)`,
                     }}
                  >
                     <GameNodeComponent 
                        node={node} 
                        onClick={() => handleNodeClick(node)} 
                     />
                  </div>
               );
            })}
            
            {/* End of Map Indicator */}
            <div className="mt-20 flex flex-col items-center opacity-40">
                <div className="w-2 h-12 bg-gray-300 rounded-full mb-2"></div>
                <span className="text-xs font-bold text-gray-400">更多关卡开发中...</span>
            </div>
        </div>
      </div>

      {/* NEW: Syllabus Modal (Portal) */}
      {portalTarget && createPortal(
          <AnimatePresence>
              {isSyllabusOpen && (
                  <>
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setIsSyllabusOpen(false)}
                        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm z-[80] pointer-events-auto"
                    />
                    <motion.div
                        initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="absolute inset-x-0 bottom-0 top-32 bg-gray-50 rounded-t-[32px] z-[90] flex flex-col overflow-hidden shadow-2xl pointer-events-auto"
                    >
                        {/* Header */}
                        <div className="px-6 py-4 bg-white border-b border-gray-100 flex justify-between items-center shrink-0">
                            <h2 className="text-xl font-black text-gray-800 flex items-center gap-2">
                                <BookOpen className="text-brand" size={24} />
                                学习蓝图
                            </h2>
                            <button onClick={() => setIsSyllabusOpen(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-500 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {/* Collapsible Config Section */}
                        <div className="bg-white border-b border-gray-100 z-10 transition-all">
                            {/* Toggle Bar */}
                            <button 
                                onClick={() => setIsConfigExpanded(!isConfigExpanded)}
                                className="w-full flex items-center justify-between px-6 py-3 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                            >
                                <span className="flex items-center gap-2">
                                    <Settings2 size={16} />
                                    当前教材：<span className="text-gray-800">{currentGrade} · {currentTextbook}</span>
                                </span>
                                <ChevronDown size={16} className={`transition-transform duration-300 ${isConfigExpanded ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Expanded Controls */}
                            <AnimatePresence>
                                {isConfigExpanded && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="p-4 flex flex-col gap-4 bg-gray-50 border-t border-gray-100 shadow-inner">
                                            {/* Textbook Switcher */}
                                            <div className="flex p-1 bg-white rounded-xl overflow-x-auto no-scrollbar shadow-sm border border-gray-100">
                                                {TEXTBOOKS.map(tb => (
                                                    <button 
                                                        key={tb} 
                                                        onClick={() => setCurrentTextbook(tb)}
                                                        className={`flex-1 min-w-[80px] py-2 rounded-lg text-xs font-bold transition-all ${currentTextbook === tb ? 'bg-brand/10 text-brand' : 'text-gray-500 hover:bg-gray-50'}`}
                                                    >
                                                        {tb}
                                                    </button>
                                                ))}
                                            </div>
                                            
                                            {/* Grade Switcher */}
                                            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                                                {GRADES.map(grade => (
                                                    <button 
                                                        key={grade} 
                                                        onClick={() => setCurrentGrade(grade)}
                                                        className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${currentGrade === grade ? 'border-brand bg-brand text-white shadow-md shadow-brand/20' : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300'}`}
                                                    >
                                                        {grade}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Chapter List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
                            {syllabusList.map((ch, idx) => (
                                <div 
                                    key={ch.id} 
                                    onClick={() => {
                                        setIsSyllabusOpen(false);
                                        // Here you would trigger navigation to that chapter
                                    }}
                                    className={`p-4 rounded-2xl border-2 flex items-center gap-4 cursor-pointer transition-all active:scale-[0.98] ${ch.status === 'current' ? 'bg-white border-brand shadow-md' : 'bg-white border-transparent shadow-sm'}`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm shrink-0 ${ch.status === 'completed' ? 'bg-green-100 text-green-600' : ch.status === 'current' ? `text-white ${stageConfig.themeColor}` : 'bg-gray-100 text-gray-400'}`}>
                                        {ch.status === 'completed' ? <CheckCircle2 size={20} /> : idx + 1}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className={`font-bold text-base ${ch.status === 'locked' ? 'text-gray-400' : 'text-gray-800'}`}>
                                            {ch.title}
                                        </h3>
                                        <p className="text-xs text-gray-400 font-medium">包含 3 个小节 · 1 个 Boss 战</p>
                                    </div>
                                    {ch.status === 'current' && (
                                        <div className={`${stageConfig.themeColor} bg-opacity-10 ${stageConfig.iconColor} px-2 py-1 rounded-md text-[10px] font-bold`}>
                                            进行中
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </motion.div>
                  </>
              )}
          </AnimatePresence>,
          portalTarget
      )}

      {/* 2.3 Node Detail Bottom Sheet */}
      <AnimatePresence>
        {selectedNode && (
          <>
            {/* Backdrop */}
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setSelectedNode(null)}
               className="absolute inset-0 bg-gray-900/20 z-40 backdrop-blur-[2px]"
            />
            
            {/* Sheet - Modified for Internal Scroll */}
            <motion.div 
               initial={{ y: '100%' }}
               animate={{ y: 0 }}
               exit={{ y: '100%' }}
               transition={{ type: 'spring', damping: 25, stiffness: 300 }}
               className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[40px] z-50 shadow-[0_-10px_60px_rgba(0,0,0,0.15)] flex flex-col h-[60vh]"
            >
                {/* Close Button Absolute */}
                <button 
                   onClick={() => setSelectedNode(null)} 
                   className="absolute top-6 right-6 z-10 p-2.5 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
                >
                   <X size={20} className="text-gray-500" />
                </button>

               {/* Handle */}
               <div className="w-16 h-1.5 bg-gray-200 rounded-full mx-auto mt-6 mb-0 shrink-0" />
               
               {/* Scrollable Content Area */}
               <div className="px-8 py-8 flex-1 overflow-y-auto no-scrollbar">
                   
                   {/* Top Header Section */}
                   <div className="flex justify-between items-stretch gap-4 mb-6">
                       <div className="flex-1">
                           <div className="flex items-center gap-2 mb-3">
                                <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-lg uppercase tracking-wider ${selectedNode.nodeType === 'chest' ? 'bg-orange-100 text-orange-600' : selectedNode.nodeType === 'boss' ? 'bg-red-100 text-red-600' : 'bg-brand/10 text-brand'}`}>
                                    {selectedNode.nodeType === 'chest' ? 'Bonus' : selectedNode.nodeType === 'boss' ? 'Boss Level' : `Level ${selectedNode.level}`}
                                </span>
                           </div>
                           <h2 className="text-2xl font-extrabold text-gray-800 leading-tight mb-2 pr-2">{selectedNode.title}</h2>
                           
                           {selectedNode.nodeType === 'level' && (
                               <div className="flex items-center gap-1">
                                  {[1, 2, 3].map((s) => (
                                     <Star 
                                        key={s} 
                                        size={16} 
                                        fill={s <= (selectedNode.stars || 0) ? "#FFCE51" : "#E5E7EB"} 
                                        className={s <= (selectedNode.stars || 0) ? "text-accent" : "text-gray-200"} 
                                     />
                                  ))}
                                  <span className="text-sm text-gray-400 ml-2 font-bold">难度系数</span>
                               </div>
                           )}
                       </div>

                       {/* Action Button */}
                       <button 
                          onClick={handleStart}
                          className="w-28 bg-brand hover:bg-brand-dark text-white rounded-[24px] shadow-lg shadow-brand/30 flex flex-col items-center justify-center gap-2 p-2 transform active:scale-95 transition-all group shrink-0"
                       >
                          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            {selectedNode.nodeType === 'chest' ? <Gift size={20} /> : selectedNode.nodeType === 'boss' ? <Sword size={20} /> : <Play size={20} fill="currentColor" className="ml-0.5" />}
                          </div>
                          <span className="text-xs font-bold">
                            {selectedNode.status === 'completed' ? '回顾' : selectedNode.nodeType === 'chest' ? '打开' : '开始'}
                          </span>
                       </button>
                   </div>

                   {/* Description Box */}
                   <div className="bg-blue-50/50 p-6 rounded-2xl mb-6 border border-blue-100 shadow-inner">
                        <div className="flex items-center gap-2 mb-2 text-blue-600 font-bold text-sm">
                            <span>💡</span> 
                            <span>{selectedNode.nodeType === 'chest' ? '奖励内容' : '本关重点'}</span>
                        </div>
                        <p className="text-gray-600 leading-relaxed text-sm font-medium">
                           {selectedNode.description || (selectedNode.nodeType === 'chest' ? '通关后可获得金币与神秘碎片。' : '掌握本章节的核心概念，并能熟练运用到实际解题中。')}
                        </p>
                   </div>

                   {/* Stats Grid - Hidden for Chests */}
                   {selectedNode.nodeType !== 'chest' && (
                   <div className="grid grid-cols-2 gap-4 pb-4">
                      <div className="bg-surface border border-white shadow-sm rounded-3xl p-4 flex flex-col items-center justify-center">
                         <span className="text-gray-400 text-[10px] font-bold uppercase mb-1">预计耗时</span>
                         <span className="text-gray-800 font-bold text-lg">{selectedNode.duration || '15分钟'}</span>
                      </div>
                      <div className="bg-surface border border-white shadow-sm rounded-3xl p-4 flex flex-col items-center justify-center">
                         <span className="text-gray-400 text-[10px] font-bold uppercase mb-1">XP 奖励</span>
                         <span className="text-brand font-bold text-lg">+{selectedNode.nodeType === 'boss' ? '200' : '50'} XP</span>
                      </div>
                   </div>
                   )}
               </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};

const GameNodeComponent: React.FC<{ node: MapNode, onClick: () => void }> = ({ node, onClick }) => {
   const isCompleted = node.status === 'completed';
   const isCurrent = node.status === 'current';
   const isLocked = node.status === 'locked';
   
   // --- CHEST NODE ---
   if (node.nodeType === 'chest') {
       return (
           <div className="group cursor-pointer flex flex-col items-center" onClick={onClick}>
               <div className={`w-16 h-16 rounded-[20px] flex items-center justify-center shadow-lg border-4 transition-transform hover:scale-110 active:scale-95 ${
                   isLocked ? 'bg-gray-200 border-gray-300' : isCompleted ? 'bg-orange-100 border-orange-200' : 'bg-gradient-to-br from-yellow-300 to-orange-400 border-white'
               }`}>
                   {isLocked ? <Lock size={20} className="text-gray-400" /> : 
                    isCompleted ? <Package size={24} className="text-orange-400 opacity-50" /> : 
                    <Gift size={28} className="text-white animate-bounce" />
                   }
               </div>
               {/* Label */}
               {!isLocked && !isCompleted && (
                   <div className="mt-2 bg-yellow-100 text-yellow-700 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                       可领取
                   </div>
               )}
           </div>
       )
   }

   // --- BOSS NODE ---
   if (node.nodeType === 'boss') {
       return (
           <div className="group cursor-pointer flex flex-col items-center" onClick={onClick}>
                <div className="relative">
                    {/* Pulsing effect for Boss */}
                    {!isLocked && (
                        <div className="absolute inset-0 rounded-full bg-red-500/30 animate-ping duration-[2000ms]"></div>
                    )}
                    <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-2xl border-4 transition-transform hover:scale-105 active:scale-95 ${
                        isLocked ? 'bg-gray-800 border-gray-600 grayscale' : 'bg-gradient-to-br from-red-500 to-pink-600 border-white'
                    }`}>
                        {isLocked ? <Lock size={24} className="text-gray-500" /> : <Crown size={40} className="text-white fill-white/20" />}
                        
                        {/* Boss HP Bar Mock */}
                        {!isLocked && (
                            <div className="absolute -bottom-3 bg-gray-900 rounded-full px-2 py-1 border border-white/20 flex items-center gap-1">
                                <Sword size={10} className="text-red-400" />
                                <span className="text-[8px] font-black text-white">BOSS</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="mt-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-lg">
                    {node.title}
                </div>
           </div>
       )
   }

   // --- STANDARD LEVEL NODE ---
   return (
      <div className="flex flex-col items-center group cursor-pointer" onClick={onClick}>
         
         <div className="relative">
            {/* Ripple effect for current */}
            {isCurrent && (
               <>
                 <div className="absolute inset-0 rounded-[32px] bg-brand/30 animate-ping duration-[2000ms]"></div>
                 <div className="absolute -inset-4 rounded-full bg-brand/10 blur-md"></div>
               </>
            )}

            <div 
                className={`
                relative flex items-center justify-center transition-all duration-300 z-10
                ${isCurrent ? 'w-20 h-20 rounded-[30px] shadow-[0_15px_30px_rgba(108,93,211,0.4)]' : 'w-16 h-16 rounded-[24px] shadow-[0_8px_16px_rgba(0,0,0,0.08)]'}
                ${isCompleted ? 'bg-gradient-to-br from-brand-light to-brand text-white border-4 border-white' : ''}
                ${isCurrent ? 'bg-gradient-to-br from-white to-gray-50 text-brand border-[5px] border-white' : ''}
                ${isLocked ? 'bg-gray-100 text-gray-300 border-4 border-white shadow-none inner-shadow' : ''}
                ${!isLocked && 'group-hover:translate-y-[-4px]'}
                `}
            >
                {isLocked ? (
                <Lock size={20} />
                ) : isCompleted ? (
                    <div className="flex flex-col items-center">
                        <span className="font-extrabold text-2xl drop-shadow-md">{node.level}</span>
                        <div className="flex gap-0.5 mt-0.5">
                            {[1,2,3].map(i => <Star key={i} size={8} fill={i <= (node.stars||0) ? "#FFCE51" : "rgba(255,255,255,0.3)"} className="text-transparent" />)}
                        </div>
                    </div>
                ) : (
                // Current Node
                <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-brand rounded-xl flex items-center justify-center mb-0.5 shadow-lg transform rotate-3">
                        <Play size={16} fill="white" className="text-white ml-1" />
                    </div>
                </div>
                )}
            </div>

            {/* Connecting line to title */}
            {!isLocked && <div className="absolute top-full left-1/2 w-0.5 h-3 bg-gray-300 -translate-x-1/2"></div>}
         </div>

         {/* Title Label */}
         <div className={`
            mt-3 px-3 py-1 rounded-xl text-[10px] font-bold text-center max-w-[100px] truncate transition-all backdrop-blur-sm border
            ${isCurrent ? 'bg-brand text-white scale-110 shadow-lg border-brand/20' : 'bg-white/90 text-gray-600 border-white/50 shadow-sm'}
            ${isLocked ? 'opacity-50 grayscale' : ''}
         `}>
            {node.title}
         </div>
      </div>
   );
};
