import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, BookOpen, Palette, Check, X, ChevronRight, Zap, Play, Sparkles, Bot } from 'lucide-react';
import { AssessmentPhase } from '../../types';

// --- 1. Header Component ---
export const AssessmentStageHeader: React.FC<{ currentPhase: AssessmentPhase }> = ({ currentPhase }) => {
    const stages = [
        { id: 'cognitive', icon: Brain, label: '思维潜能' }, // Was 脑力潜能
        { id: 'academic', icon: BookOpen, label: '知识地基' }, // Was 学科摸底
        { id: 'style', icon: Palette, label: '学习基因' }, // Was 学习风格
    ];

    const activeIndex = stages.findIndex(s => s.id === currentPhase);

    return (
        <div className="pt-8 pb-4 px-6 bg-gray-900 z-20">
            <div className="max-w-3xl mx-auto">
                <div className="flex justify-between items-center relative mb-4">
                    {/* Background Line */}
                    <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-800 -z-10"></div>
                    
                    {stages.map((stage, idx) => {
                        const isActive = idx === activeIndex;
                        const isCompleted = idx < activeIndex;
                        
                        return (
                            <div key={stage.id} className="flex flex-col items-center gap-2 relative">
                                <motion.div 
                                    initial={false}
                                    animate={{ 
                                        scale: isActive ? 1.2 : 1,
                                        backgroundColor: isActive ? '#6C5DD3' : isCompleted ? '#10B981' : '#1F2937',
                                        borderColor: isActive ? '#8B80F9' : isCompleted ? '#10B981' : '#374151'
                                    }}
                                    className={`w-12 h-12 rounded-full flex items-center justify-center border-4 shadow-lg z-10 transition-colors duration-300`}
                                >
                                    {isCompleted ? (
                                        <Check size={20} className="text-white" strokeWidth={3} />
                                    ) : (
                                        <stage.icon size={20} className={isActive ? 'text-white' : 'text-gray-500'} />
                                    )}
                                </motion.div>
                                <span className={`text-xs font-bold ${isActive ? 'text-white' : 'text-gray-600'}`}>
                                    {stage.label}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// --- 2. Stage Summary Component ---
export const StageSummary: React.FC<{ data: { title: string, desc: string }, onNext: () => void }> = ({ data, onNext }) => {
    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="w-full h-full flex items-center justify-center p-6"
        >
            <div className="bg-brand/10 backdrop-blur-xl border border-white/10 rounded-[40px] p-8 max-w-md w-full text-center relative overflow-hidden shadow-2xl">
                {/* Confetti / Decor */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle,rgba(255,206,81,0.1)_1px,transparent_1px)] bg-[length:20px_20px] animate-spin-slow"></div>
                </div>

                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200, damping: 10 }}
                    className="w-20 h-20 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-[0_0_30px_rgba(16,185,129,0.4)]"
                >
                    <Check size={40} className="text-white" strokeWidth={4} />
                </motion.div>
                
                <h2 className="text-2xl font-black text-white mb-2">{data.title}</h2>
                <p className="text-gray-300 mb-10 leading-relaxed font-medium">{data.desc}</p>
                
                <button 
                    onClick={onNext}
                    className="w-full bg-brand hover:bg-brand-light text-white font-bold py-4 rounded-2xl transition-all active:scale-95 flex items-center justify-center gap-2 group"
                >
                    进入下一阶段 <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>
            </div>
        </motion.div>
    );
};

// --- 3. Stage 1: Cognitive (Gamified) -> Logic & Agility & Focus ---
export const CognitiveStage: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const totalSteps = 4;

    const handleInteraction = () => {
        if (step < totalSteps - 1) {
            setStep(s => s + 1);
        } else {
            onComplete();
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 relative">
            <div className="absolute top-4 right-6 text-white/30 font-mono text-sm">
                Q: {step + 1}/{totalSteps}
            </div>

            <motion.div 
                key={step}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                className="w-full max-w-md"
            >
                {step % 2 === 0 ? (
                    // Type A: Reaction / Focus -> Measures "Focus"
                    <div className="bg-white rounded-[32px] p-8 shadow-2xl text-center">
                        <div className="mb-6">
                            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs font-black uppercase">专注力检测</span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-8">点击蓝色的方块！</h3>
                        
                        <div className="grid grid-cols-3 gap-4 aspect-square">
                            {Array.from({ length: 9 }).map((_, i) => {
                                const isTarget = i === 4; // Center for demo
                                return (
                                    <button
                                        key={i}
                                        onClick={isTarget ? handleInteraction : undefined}
                                        className={`rounded-2xl transition-all active:scale-90 ${isTarget ? 'bg-blue-500 shadow-lg shadow-blue-500/30 hover:bg-blue-400' : 'bg-gray-100'}`}
                                    ></button>
                                )
                            })}
                        </div>
                    </div>
                ) : (
                    // Type B: Logic Pattern -> Measures "Logic"
                    <div className="bg-white rounded-[32px] p-8 shadow-2xl text-center">
                        <div className="mb-6">
                            <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-xs font-black uppercase">逻辑推理</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 mb-8">下一个图形是？</h3>
                        
                        <div className="flex justify-center gap-4 mb-8 text-gray-800">
                             <div className="w-16 h-16 border-4 border-gray-800 rounded-lg flex items-center justify-center text-2xl font-black">1</div>
                             <div className="w-16 h-16 border-4 border-gray-800 rounded-lg flex items-center justify-center text-2xl font-black">2</div>
                             <div className="w-16 h-16 border-4 border-gray-800 rounded-lg flex items-center justify-center text-2xl font-black">3</div>
                             <div className="w-16 h-16 border-4 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-2xl font-black text-gray-300">?</div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <button onClick={handleInteraction} className="p-4 bg-gray-50 rounded-xl font-bold hover:bg-brand/10 hover:text-brand border-2 border-transparent hover:border-brand transition-all">4</button>
                            <button onClick={handleInteraction} className="p-4 bg-gray-50 rounded-xl font-bold hover:bg-brand/10 hover:text-brand border-2 border-transparent hover:border-brand transition-all">5</button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

// --- 4. Stage 2: Academic (Adaptive CAT) -> Measures Base & Calculation ---
export const AcademicStage: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [qIndex, setQIndex] = useState(0);
    const [showAiFeedback, setShowAiFeedback] = useState(false);
    const [aiMessage, setAiMessage] = useState('');
    
    // Updated questions to test "Base" (Memory/Knowledge) and "Calculation"
    const questions = [
        { q: '计算：25 × 4 - 10 = ?', options: ['80', '90', '100'], tag: '计算能力' },
        { q: 'Identify the verb: "The cat sat on the mat."', options: ['cat', 'sat', 'mat'], tag: '英语基础' },
        { q: '“白日依山尽” 的下一句是？', options: ['黄河入海流', '及第必争先', '举头望明月'], tag: '语文积累' },
        { q: '若 x = 3, 则 2x + 1 等于多少?', options: ['5', '7', '6'], tag: '代数基础' },
    ];

    const feedbackMessages = [
        "计算速度很快！看来你的数感不错。⚡️",
        "基础很扎实！这点难不倒你。✨",
        "记忆提取准确！👏",
        "全对！看来你已经准备好进入更难的挑战了。🏆"
    ];

    const handleAnswer = () => {
        // Show AI Bubble
        setAiMessage(feedbackMessages[qIndex]);
        setShowAiFeedback(true);

        setTimeout(() => {
            setShowAiFeedback(false);
            if (qIndex < questions.length - 1) {
                setQIndex(qIndex + 1);
            } else {
                onComplete();
            }
        }, 1800);
    };

    return (
        <div className="w-full h-full flex flex-col items-center justify-center p-6 relative">
             <div className="absolute top-4 right-6 text-white/30 font-mono text-sm">
                Q: {qIndex + 1}/{questions.length}
            </div>

            {/* AI Avatar & Bubble Area */}
            <div className="h-32 w-full flex items-end justify-center mb-6 relative">
                 {/* The Bubble */}
                 <AnimatePresence>
                    {showAiFeedback && (
                        <motion.div 
                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            className="absolute bottom-full mb-2 bg-white px-4 py-3 rounded-2xl rounded-bl-none shadow-xl max-w-[200px] z-20"
                        >
                            <p className="text-sm font-bold text-gray-800">{aiMessage}</p>
                        </motion.div>
                    )}
                 </AnimatePresence>

                 {/* The Avatar */}
                 <div className="relative">
                    <div className="w-16 h-16 bg-brand rounded-full flex items-center justify-center shadow-lg border-2 border-white/20">
                        <Bot className="text-white" size={32} />
                        {/* Eyes */}
                        <div className="absolute top-[35%] left-[25%] w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse"></div>
                        <div className="absolute top-[35%] right-[25%] w-1.5 h-1.5 bg-cyan-300 rounded-full animate-pulse"></div>
                    </div>
                 </div>
            </div>

            {/* Question Card (Lightweight) */}
            <motion.div 
                key={qIndex}
                initial={{ x: 100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -100, opacity: 0 }}
                className="w-full max-w-md bg-surface border border-white/50 rounded-[32px] p-8 shadow-xl"
            >
                <div className="mb-4">
                     <span className="bg-brand/10 text-brand text-xs font-black px-2 py-1 rounded-md">
                         {questions[qIndex].tag}
                     </span>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-8 leading-relaxed">
                    {questions[qIndex].q}
                </h3>

                <div className="flex flex-col gap-3">
                    {questions[qIndex].options.map((opt, i) => (
                        <button 
                            key={i}
                            onClick={handleAnswer}
                            className="w-full text-left p-4 rounded-xl bg-white border border-gray-100 hover:border-brand hover:bg-brand/5 transition-all font-bold text-gray-600 active:scale-[0.98]"
                        >
                            {opt}
                        </button>
                    ))}
                </div>
            </motion.div>
        </div>
    );
};

// --- 5. Stage 3: Style (Would You Rather) -> Measures Agility & Style ---
export const StyleStage: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const [step, setStep] = useState(0);
    const pairs = [
        { left: '听老师讲故事', right: '自己动手做实验', colorL: 'bg-orange-400', colorR: 'bg-blue-500' },
        { left: '遇到难题立刻问', right: '自己先想十分钟', colorL: 'bg-red-400', colorR: 'bg-indigo-500' },
        { left: '喜欢小组合作', right: '喜欢独自钻研', colorL: 'bg-green-500', colorR: 'bg-purple-500' },
        { left: '按计划按部就班', right: '随心所欲灵感流', colorL: 'bg-teal-500', colorR: 'bg-pink-500' },
    ];

    const handleChoice = () => {
        if (step < pairs.length - 1) {
            setStep(step + 1);
        } else {
            onComplete();
        }
    };

    return (
        <div className="w-full h-full flex flex-col items-center p-6">
            <h2 className="text-white text-xl font-bold mb-8 mt-4">你更倾向于...?</h2>
            
            <div className="flex-1 w-full max-w-4xl flex gap-4 md:gap-8 items-stretch pb-12">
                <AnimatePresence mode="popLayout">
                    <motion.button 
                        key={`L-${step}`}
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -50, opacity: 0 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleChoice}
                        className={`flex-1 rounded-[32px] ${pairs[step].colorL} shadow-lg flex items-center justify-center p-8 relative overflow-hidden group`}
                    >
                         <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                         <span className="text-2xl md:text-3xl font-black text-white text-center leading-tight relative z-10">
                            {pairs[step].left}
                         </span>
                         {/* Decor */}
                         <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -ml-10 -mt-10 blur-2xl"></div>
                    </motion.button>

                    <div className="flex items-center justify-center">
                        <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-black text-gray-900 shadow-lg z-10">
                            VS
                        </div>
                    </div>

                    <motion.button 
                        key={`R-${step}`}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 50, opacity: 0 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleChoice}
                        className={`flex-1 rounded-[32px] ${pairs[step].colorR} shadow-lg flex items-center justify-center p-8 relative overflow-hidden group`}
                    >
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                        <span className="text-2xl md:text-3xl font-black text-white text-center leading-tight relative z-10">
                            {pairs[step].right}
                        </span>
                        {/* Decor */}
                        <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mb-10 blur-2xl"></div>
                    </motion.button>
                </AnimatePresence>
            </div>
            
            <div className="h-1 bg-gray-800 w-32 rounded-full overflow-hidden">
                <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${((step + 1) / pairs.length) * 100}%` }}
                    className="h-full bg-white"
                />
            </div>
        </div>
    );
};
