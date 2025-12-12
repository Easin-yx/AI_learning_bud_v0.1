
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { AssessmentResultData } from '../../types';
import { Sparkles, Bot, X, RefreshCw, Zap, Maximize2, Lightbulb, GraduationCap } from 'lucide-react';

interface AbilityPersonaCardProps {
  data: AssessmentResultData;
  onRetake: () => void;
}

export const AbilityPersonaCard: React.FC<AbilityPersonaCardProps> = ({ data, onRetake }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    // Find the portal root in App.tsx
    const target = document.getElementById('modal-root');
    if (target) {
        setPortalTarget(target);
    } else {
        console.warn("LumiLearn: modal-root not found, falling back to body");
        setPortalTarget(document.body);
    }
  }, []);

  // Default to first subject analysis if none selected
  const activeSubject = selectedSubject || data.radarData[0].subject;
  const activeAnalysis = data.radarData.find(d => d.subject === activeSubject);

  // Find strongest attribute for dynamic strategy text
  const strongest = data.radarData.reduce((prev, current) => (prev.score > current.score) ? prev : current);
  
  // Determine learning style based on tags (Mock logic for display)
  const learningStyle = data.personaTags.find(t => t.includes('视') || t.includes('听') || t.includes('动')) || '探索型';

  return (
    <>
      {/* 1. Collapsed Hero Card - LIGHT MODE GLASSMORPHISM */}
      <div className="relative">
          <motion.div 
            // Only assign layoutId if NOT expanded, effectively transferring it to the portal component
            layoutId={isExpanded ? undefined : "persona-card"}
            onClick={(e) => {
                e.stopPropagation(); 
                setIsExpanded(true);
            }}
            className={`relative overflow-hidden rounded-[32px] bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.05)] cursor-pointer group transition-opacity duration-200 ${isExpanded ? 'opacity-0 pointer-events-none' : 'opacity-100 hover:shadow-[0_25px_50px_-12px_rgba(108,93,211,0.1)] hover:border-brand/20'}`}
          >
            {/* Background Ambience (Subtle Light) */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-50%] right-[-50%] w-[100%] h-[100%] bg-brand/5 rounded-full blur-[80px]"></div>
                <div className="absolute bottom-[-50%] left-[-50%] w-[80%] h-[80%] bg-accent/5 rounded-full blur-[60px]"></div>
            </div>

            <div className="relative z-10 p-6 md:p-8">
                {/* Header */}
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h3 className="text-gray-400 text-xs font-black uppercase tracking-wider mb-2 flex items-center gap-2">
                            <Sparkles size={12} className="text-brand" />
                            能力画像
                        </h3>
                        {/* Persona Tags */}
                        <div className="flex flex-wrap gap-2">
                            {data.personaTags.map((tag, i) => (
                                <span 
                                    key={i}
                                    className={`text-lg md:text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r ${i===0 ? 'from-blue-500 to-indigo-500' : i===1 ? 'from-orange-500 to-yellow-500' : 'from-purple-500 to-pink-500'}`}
                                >
                                    {tag}{i < data.personaTags.length -1 && <span className="text-gray-300 mx-1">·</span>}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="p-2 bg-gray-100 rounded-full text-gray-400 group-hover:bg-brand/10 group-hover:text-brand transition-colors">
                        <Maximize2 size={18} />
                    </div>
                </div>

                {/* Content Row */}
                <div className="flex flex-col md:flex-row md:items-center gap-6">
                    {/* Mini Chart (Light Theme Colors) */}
                    <div className="w-full md:w-auto flex justify-center md:justify-start">
                        <div className="w-32 h-32 md:w-40 md:h-40 relative flex-shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data.radarData}>
                                    <PolarGrid stroke="rgba(0,0,0,0.05)" />
                                    <PolarAngleAxis dataKey="subject" tick={false} />
                                    <Radar
                                        name="Ability"
                                        dataKey="score"
                                        stroke="#F59E0B"
                                        strokeWidth={2}
                                        fill="#FCD34D"
                                        fillOpacity={0.4}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Right Side: AI Strategy Grid (Light) */}
                    <div className="flex-1 border-t md:border-t-0 md:border-l border-gray-100 pt-6 md:pt-0 md:pl-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        
                        {/* Item 1: Exclusive Track */}
                        <div className="bg-white/40 border border-white/60 rounded-2xl p-4 flex items-center gap-3 hover:bg-white/80 transition-colors shadow-sm">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500 shrink-0 border border-indigo-100">
                                <GraduationCap size={18} />
                            </div>
                            <div className="min-w-0">
                                <h4 className="text-gray-800 font-bold text-sm leading-tight mb-1 truncate">极速挑战模式</h4>
                                <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-wider block truncate">专属赛道</span>
                            </div>
                        </div>

                        {/* Item 2: Learning Style */}
                        <div className="bg-white/40 border border-white/60 rounded-2xl p-4 flex items-center gap-3 hover:bg-white/80 transition-colors shadow-sm">
                            <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shrink-0 border border-orange-100">
                                <Lightbulb size={18} />
                            </div>
                            <div className="min-w-0">
                                <h4 className="text-gray-800 font-bold text-sm leading-tight mb-1 truncate">{learningStyle}定制版</h4>
                                <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wider block truncate">最优学法</span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
          </motion.div>
      </div>

      {/* 2. Expanded Modal (Portaled) - KEEPING DARK THEME FOR IMMERSIVE ANALYSIS? OR SWITCH TO LIGHT? 
          Let's stick to Dark for the detailed analysis to make the data pop, similar to Apple's Fitness details,
          or use a very clean Light mode. Given the prompt asked for "Light Mode Glassmorphism" for the card on the page, 
          the modal can remain distinct or follow suit. Let's keep the modal consistent with the card: Light Mode.
      */}
      {portalTarget && createPortal(
        <AnimatePresence>
            {isExpanded && (
                <>
                    {/* Backdrop */}
                    <motion.div 
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm pointer-events-auto z-[55]"
                        onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                    />
                    
                    {/* Card Container - EXPANDED LIGHT MODE */}
                    <motion.div 
                        layoutId="persona-card"
                        className="absolute top-8 left-4 right-4 bottom-24 md:relative md:inset-auto md:w-[500px] md:h-auto md:max-h-[85%] bg-white rounded-[40px] shadow-2xl z-[60] flex flex-col overflow-hidden pointer-events-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Close Btn */}
                        <button 
                            onClick={(e) => { e.stopPropagation(); setIsExpanded(false); }}
                            className="absolute top-6 right-6 z-20 p-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors"
                        >
                            <X size={20} />
                        </button>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto no-scrollbar p-8 bg-gradient-to-b from-white to-gray-50">
                            
                            {/* Header Section */}
                            <div className="text-center mb-8 mt-4">
                                <div className="inline-block px-3 py-1 bg-brand/10 rounded-full text-brand font-black text-xs uppercase mb-4 tracking-widest">
                                    Detailed Analysis
                                </div>
                                <h2 className="text-3xl font-black text-gray-800 mb-2">能力详细画像</h2>
                                <div className="flex justify-center gap-2 text-gray-400 text-sm font-bold">
                                点击雷达图查看单项解读
                                </div>
                            </div>

                            {/* Big Interactive Chart - Light Mode Config */}
                            <div className="w-full h-64 relative mb-10">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data.radarData}>
                                    <PolarGrid stroke="rgba(0,0,0,0.08)" />
                                    <PolarAngleAxis 
                                        dataKey="subject" 
                                        tick={({ payload, x, y, textAnchor, stroke, radius }) => (
                                            <g className="cursor-pointer" onClick={() => setSelectedSubject(payload.value)}>
                                                <text
                                                    x={x}
                                                    y={y}
                                                    textAnchor={textAnchor}
                                                    fill={selectedSubject === payload.value || (!selectedSubject && payload.value === activeSubject) ? "#F59E0B" : "#9CA3AF"}
                                                    fontSize={14}
                                                    fontWeight="bold"
                                                >
                                                    {payload.value}
                                                </text>
                                            </g>
                                        )} 
                                    />
                                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                                    <Radar
                                        name="Ability"
                                        dataKey="score"
                                        stroke="#F59E0B"
                                        strokeWidth={3}
                                        fill="#FCD34D"
                                        fillOpacity={0.5}
                                    />
                                </RadarChart>
                            </ResponsiveContainer>
                            </div>

                            {/* Analysis Box - Light Mode */}
                            <AnimatePresence mode="wait">
                                <motion.div 
                                key={activeSubject}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="bg-white border border-gray-100 shadow-xl shadow-gray-200/50 rounded-3xl p-6 relative mb-6 overflow-hidden"
                                >
                                    {/* New Header Header */}
                                    <div className="flex justify-between items-end mb-3 z-10 relative">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-brand/10 rounded-xl text-brand border border-brand/20">
                                                <Sparkles size={18} fill="currentColor" />
                                            </div>
                                            <h3 className="text-gray-800 text-xl font-extrabold tracking-tight">{activeSubject}</h3>
                                        </div>
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-4xl font-black text-brand">
                                                {activeAnalysis?.score}
                                            </span>
                                            <span className="text-sm text-gray-400 font-bold">/100</span>
                                        </div>
                                    </div>

                                    {/* New Progress Bar */}
                                    <div className="h-3 w-full bg-gray-100 rounded-full mb-5 overflow-hidden relative z-10">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${activeAnalysis?.score}%` }}
                                            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                                            className="h-full bg-gradient-to-r from-brand to-brand-light shadow-md relative"
                                        >
                                            <div className="absolute inset-0 bg-white/20"></div>
                                        </motion.div>
                                    </div>
                                    
                                    {/* Description Text */}
                                    <p className="text-gray-600 leading-relaxed pt-1 relative z-10 text-sm font-medium">
                                        <Bot size={16} className="inline mr-2 text-brand relative -top-0.5" />
                                        {activeAnalysis?.analysis}
                                    </p>

                                    {/* Decorative subtle background inside box */}
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
                                </motion.div>
                            </AnimatePresence>

                            {/* AI Strategy Cards */}
                            <div className="grid grid-cols-2 gap-4 mb-8">
                                {/* Card 1 */}
                                <div className="bg-indigo-50 border border-indigo-100 rounded-3xl p-5 relative overflow-hidden">
                                    <div className="flex items-center gap-2 mb-3 z-10 relative">
                                        <div className="p-1.5 bg-indigo-500 rounded-lg text-white">
                                            <GraduationCap size={16} />
                                        </div>
                                        <span className="text-indigo-600 text-xs font-bold uppercase tracking-wide">专属赛道</span>
                                    </div>
                                    <h4 className="text-indigo-900 font-bold text-base mb-2 z-10 relative">
                                        极速挑战模式
                                    </h4>
                                    <p className="text-indigo-800/70 text-xs leading-relaxed font-medium z-10 relative">
                                        检测到你<span className="text-indigo-600 font-bold mx-0.5">{strongest.subject}</span>很强，AI 已为你自动调高题目难度。
                                    </p>
                                </div>

                                {/* Card 2 */}
                                <div className="bg-orange-50 border border-orange-100 rounded-3xl p-5 relative overflow-hidden">
                                    <div className="flex items-center gap-2 mb-3 z-10 relative">
                                        <div className="p-1.5 bg-orange-500 rounded-lg text-white">
                                            <Lightbulb size={16} />
                                        </div>
                                        <span className="text-orange-600 text-xs font-bold uppercase tracking-wide">最优学法</span>
                                    </div>
                                    <h4 className="text-orange-900 font-bold text-base mb-2 z-10 relative">
                                        {learningStyle}定制版
                                    </h4>
                                    <p className="text-orange-800/70 text-xs leading-relaxed font-medium z-10 relative">
                                        为你匹配了大量<span className="text-orange-600 font-bold mx-0.5">互动演示</span>和图解。
                                    </p>
                                </div>
                            </div>
                            
                            {/* Footer Action */}
                            <button 
                            onClick={(e) => { e.stopPropagation(); onRetake(); }}
                            className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 hover:text-brand hover:border-brand hover:bg-brand/5 transition-all text-sm font-bold flex items-center justify-center gap-2"
                            >
                                <RefreshCw size={16} />
                                重新评估能力
                            </button>
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
