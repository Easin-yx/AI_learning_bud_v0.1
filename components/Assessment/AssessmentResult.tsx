import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { Bot, Sparkles, ArrowRight, Zap, CheckCircle2 } from 'lucide-react';

interface AssessmentResultProps {
  onFinish: () => void;
}

export const AssessmentResult: React.FC<AssessmentResultProps> = ({ onFinish }) => {
  const [animateChart, setAnimateChart] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  useEffect(() => {
    // Trigger chart animation after mount
    setTimeout(() => setAnimateChart(true), 500);
  }, []);

  // Mock Result Data - Updated to "Pragmatic 5" Dimensions with Analysis text
  const abilityData = [
    { subject: '逻辑', A: 85, fullMark: 100, analysis: '抽象思维能力 T1 梯队！适合从原理层切入，减少机械记忆。' },
    { subject: '基础', A: 60, fullMark: 100, analysis: '新知识点吸收快，但部分前置概念（如几何定理）存在盲区。' },
    { subject: '专注', A: 90, fullMark: 100, analysis: '心流状态进入极快，是天生的“深度学习者”。' },
    { subject: '悟性', A: 85, fullMark: 100, analysis: '举一反三能力出色，遇到新题型能迅速迁移旧知识。' },
    { subject: '计算', A: 70, fullMark: 100, analysis: '解题思路清晰，但运算准确率有波动，建议加强专项训练。' },
  ];

  // Default to first subject if none selected
  const activeSubject = selectedSubject || abilityData[0].subject;
  const activeAnalysis = abilityData.find(d => d.subject === activeSubject);

  // Animated data state (start from 0)
  const chartData = abilityData.map(d => ({
    ...d,
    A: animateChart ? d.A : 0
  }));

  return (
    <div className="w-full h-full bg-gray-900 relative overflow-hidden flex flex-col items-center">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-brand/20 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-accent/10 rounded-full blur-[100px]"></div>
          {/* Grid lines */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      </div>

      <div className="relative z-10 w-full max-w-2xl flex flex-col items-center flex-1 py-8 px-6 overflow-y-auto no-scrollbar">
          
          {/* 1. The Persona Reveal */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-center mb-8 shrink-0"
          >
              <h1 className="text-white text-lg font-bold mb-4 tracking-widest uppercase opacity-80">测评完成 · 你的专属画像</h1>
              
              <div className="flex flex-wrap justify-center gap-3 items-center">
                  <motion.span 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3, type: 'spring' }}
                    className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400 text-3xl md:text-4xl font-black"
                  >
                    逻辑强
                  </motion.span>
                  <motion.span 
                     initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }}
                     className="w-2 h-2 bg-gray-600 rounded-full"
                  ></motion.span>
                  <motion.span 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.7, type: 'spring' }}
                    className="bg-clip-text text-transparent bg-gradient-to-r from-accent to-yellow-300 text-3xl md:text-4xl font-black"
                  >
                    视觉型
                  </motion.span>
                  <motion.span 
                     initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9 }}
                     className="w-2 h-2 bg-gray-600 rounded-full"
                  ></motion.span>
                  <motion.span 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1.1, type: 'spring' }}
                    className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400 text-3xl md:text-4xl font-black"
                  >
                    挑战者
                  </motion.span>
              </div>
          </motion.div>

          {/* 2. The Interactive Radar Chart */}
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative w-full aspect-square max-w-[320px] max-h-[320px] mb-8 shrink-0"
          >
              {/* Glowing backplate */}
              <div className="absolute inset-0 bg-gradient-to-b from-brand/20 to-transparent rounded-full blur-3xl"></div>
              
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis 
                        dataKey="subject" 
                        tick={({ payload, x, y, textAnchor, stroke, radius }) => (
                            <g className="cursor-pointer group" onClick={() => setSelectedSubject(payload.value)}>
                                <text
                                    x={x}
                                    y={y}
                                    textAnchor={textAnchor}
                                    fill={selectedSubject === payload.value || (!selectedSubject && payload.value === activeSubject) ? "#FFCE51" : "rgba(255,255,255,0.6)"}
                                    fontSize={12}
                                    fontWeight="bold"
                                    className="transition-colors duration-300"
                                >
                                    {payload.value}
                                </text>
                            </g>
                        )} 
                    />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                    <Radar
                        name="Ability"
                        dataKey="A"
                        stroke="#FFCE51"
                        strokeWidth={3}
                        fill="#FFCE51"
                        fillOpacity={0.3}
                        isAnimationActive={true}
                        animationDuration={1500}
                        animationEasing="ease-out"
                    />
                </RadarChart>
              </ResponsiveContainer>
              
              {/* Decor Center */}
              <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-white rounded-full -ml-2 -mt-2 shadow-[0_0_15px_white] animate-pulse pointer-events-none"></div>
              
              {/* Interaction Hint */}
              <div className="absolute -bottom-6 left-0 right-0 text-center text-[10px] text-gray-500 font-bold opacity-60">
                  点击维度查看详情
              </div>
          </motion.div>

          {/* 3. Detailed Analysis Box (Interactive) */}
          <AnimatePresence mode="wait">
            <motion.div 
                key={activeSubject}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 relative mb-6 overflow-hidden shrink-0"
            >
                {/* Header */}
                <div className="flex justify-between items-end mb-3 z-10 relative">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-brand/20 rounded-xl text-accent border border-brand/30">
                            <Sparkles size={18} fill="currentColor" />
                        </div>
                        <h3 className="text-white text-xl font-extrabold tracking-tight">{activeSubject}</h3>
                    </div>
                    <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-black text-accent drop-shadow-[0_0_10px_rgba(255,206,81,0.4)]">
                            {activeAnalysis?.A}
                        </span>
                        <span className="text-sm text-gray-400 font-bold">/100</span>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-3 w-full bg-gray-800 rounded-full mb-5 overflow-hidden ring-1 ring-white/5 relative z-10">
                    <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${activeAnalysis?.A}%` }}
                        transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
                        className="h-full bg-gradient-to-r from-accent to-yellow-300 shadow-[0_0_15px_rgba(255,206,81,0.6)] relative"
                    >
                        <div className="absolute inset-0 bg-white/20"></div>
                    </motion.div>
                </div>
                
                {/* Description Text */}
                <p className="text-gray-200 leading-relaxed pt-1 relative z-10 text-sm font-medium flex gap-2">
                    <Bot size={16} className="text-brand-light shrink-0 relative top-0.5" />
                    <span>{activeAnalysis?.analysis}</span>
                </p>

                {/* Decorative background */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none"></div>
            </motion.div>
          </AnimatePresence>

          {/* 4. AI Strategy Outcome (Strategy Mapping) */}
          <motion.div 
             initial={{ y: 50, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 1.5 }}
             className="w-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-[32px] p-6 mb-12 relative group shrink-0"
          >
              {/* Icon Badge */}
              <div className="absolute -top-3 left-6 bg-brand text-white p-2 rounded-xl shadow-lg border-2 border-gray-900 z-10">
                  <Bot size={20} />
              </div>
              
              <div className="pt-4 relative z-0">
                  <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
                      <Sparkles size={18} className="text-accent" />
                      AI 动态策略已生成
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed mb-5">
                      检测到你<span className="text-white font-bold mx-1">逻辑思维</span>强，但<span className="text-white font-bold mx-1">计算</span>需加强。
                      <br/>
                      已开启<span className="text-accent font-bold mx-1">极速挑战模式</span>：跳过 30% 重复练习，直攻核心！
                  </p>
                  
                  {/* Visual Indicator of "Strategy" - Progress Bar Style */}
                  <div className="relative h-3 w-full bg-gray-700 rounded-full mb-2 overflow-hidden">
                      {/* Grey "Removed" part */}
                      <div className="absolute top-0 left-0 h-full bg-gray-600 w-[30%] flex items-center justify-center overflow-hidden">
                         <div className="w-full h-full opacity-30" style={{backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 5px, rgba(0,0,0,0.8) 5px, rgba(0,0,0,0.8) 10px)'}}></div>
                      </div>
                      
                      {/* Active "Track" part */}
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: '70%' }}
                        transition={{ delay: 2, duration: 1 }}
                        className="absolute top-0 right-0 h-full bg-gradient-to-r from-accent to-yellow-300 shadow-[0_0_15px_rgba(255,206,81,0.6)]"
                      ></motion.div>
                  </div>

                  <div className="flex justify-between text-[10px] font-bold">
                      <span className="text-gray-500">已移除机械作业</span>
                      <span className="text-accent">高能赛道</span>
                  </div>
              </div>
          </motion.div>
      </div>

      {/* 5. Footer Action */}
      <div className="w-full p-6 bg-gray-900/80 backdrop-blur-lg border-t border-white/5 relative z-20 shrink-0">
          <motion.button 
             initial={{ scale: 0.9, opacity: 0 }}
             animate={{ scale: 1, opacity: 1 }}
             transition={{ delay: 2.2 }}
             whileHover={{ scale: 1.02 }}
             whileTap={{ scale: 0.95 }}
             onClick={onFinish}
             className="w-full max-w-md mx-auto bg-gradient-to-r from-brand to-brand-light text-white font-black text-xl py-5 rounded-[24px] shadow-[0_10px_40px_rgba(108,93,211,0.4)] flex items-center justify-center gap-3 relative overflow-hidden group"
          >
              <span className="relative z-10">🚀 开启我的旅程</span>
              {/* Hover shine */}
              <div className="absolute top-0 -left-full w-full h-full bg-white/20 skew-x-[-20deg] group-hover:animate-[shine_1s_ease-in-out]"></div>
          </motion.button>
      </div>

    </div>
  );
};