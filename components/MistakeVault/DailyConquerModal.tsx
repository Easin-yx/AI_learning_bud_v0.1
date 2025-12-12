
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MistakeItem } from '../../types';
import { X, Zap, CheckCircle2, AlertCircle, ArrowRight, Bot, Sparkles, Trophy, Flame, Play, Repeat } from 'lucide-react';
import { Card } from '../UI/Card';

// Mock options generator
const generateMockOptions = (correctAnswer: string) => {
    const base = parseFloat(correctAnswer);
    if (!isNaN(base)) {
        return [
            (base - 1).toString(),
            correctAnswer,
            (base + 2).toString(),
            (base * 1.5).toFixed(0).toString()
        ].sort(() => Math.random() - 0.5);
    }
    return [correctAnswer, "干扰选项 A", "干扰选项 B", "干扰选项 C"].sort(() => Math.random() - 0.5);
};

interface DailyConquerModalProps {
    items: MistakeItem[];
    onClose: () => void;
    onComplete: (results: { masteredIds: string[], xpEarned: number }) => void;
}

type Phase = 'briefing' | 'battle' | 'debriefing';

export const DailyConquerModal: React.FC<DailyConquerModalProps> = ({ items, onClose, onComplete }) => {
    const [phase, setPhase] = useState<Phase>('briefing');
    
    // Battle State
    const [queue, setQueue] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [combo, setCombo] = useState(0);
    const [maxCombo, setMaxCombo] = useState(0);
    const [masteredCount, setMasteredCount] = useState(0);
    const [masteredIds, setMasteredIds] = useState<string[]>([]);
    
    // Question Interaction State
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [showHint, setShowHint] = useState(false);

    // Portal Target
    const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

    useEffect(() => {
        setPortalTarget(document.getElementById('modal-root'));
        
        const playableItems = items.slice(0, 10).map(item => ({
            ...item,
            options: generateMockOptions(item.correctAnswer)
        }));
        setQueue(playableItems);
    }, [items]);

    // --- HANDLERS ---
    const handleStart = () => setPhase('battle');

    const handleAnswer = (option: string) => {
        if (isAnswered) return;
        const currentItem = queue[currentIndex];
        const correct = option === currentItem.correctAnswer;
        setSelectedOption(option);
        setIsAnswered(true);
        setIsCorrect(correct);
        if (correct) {
            const newCombo = combo + 1;
            setCombo(newCombo);
            if (newCombo > maxCombo) setMaxCombo(newCombo);
            setMasteredCount(c => c + 1);
            setMasteredIds(prev => [...prev, currentItem.id]);
            setTimeout(() => nextQuestion(), 1500);
        } else {
            setCombo(0);
        }
    };

    const nextQuestion = () => {
        setSelectedOption(null);
        setIsAnswered(false);
        setIsCorrect(false);
        setShowHint(false);
        if (currentIndex < queue.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            setPhase('debriefing');
        }
    };

    const handleClaim = () => {
        onComplete({ masteredIds, xpEarned: masteredCount * 20 + maxCombo * 5 });
        onClose();
    };

    if (!portalTarget) return null;

    // --- CONTENT RENDERERS ---

    const renderBriefing = () => (
        <div className="absolute inset-0 bg-gray-900 flex flex-col items-center justify-center p-6 overflow-hidden z-[100] pointer-events-auto">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            
            <div className="relative mb-12">
                <motion.div 
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeOut" }}
                    className="absolute inset-0 bg-brand rounded-full blur-xl"
                />
                <div className="w-32 h-32 rounded-full border-2 border-brand/50 bg-gray-800 flex items-center justify-center relative z-10 overflow-hidden shadow-[0_0_50px_rgba(108,93,211,0.5)]">
                    <div className="absolute inset-0 border-t-2 border-brand animate-spin origin-center"></div>
                    <Bot size={48} className="text-white" />
                </div>
            </div>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center z-10 max-w-sm w-full"
            >
                <h2 className="text-2xl font-black text-white mb-4">
                    AI 正在锁定<br/><span className="text-brand-light">记忆薄弱点...</span>
                </h2>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                    根据艾宾浩斯遗忘曲线，为你抓取了 {queue.length} 道“漏网之鱼”。
                    <br/>今日悬赏：<span className="text-accent font-bold">+200 XP</span>
                </p>
                
                <button 
                    onClick={handleStart}
                    className="w-full bg-brand hover:bg-brand-light text-white font-black text-lg py-4 rounded-2xl shadow-lg shadow-brand/30 transition-all active:scale-95 flex items-center justify-center gap-2 group"
                >
                    <span>开始挑战</span>
                    <Zap size={20} fill="currentColor" className="group-hover:animate-pulse" />
                </button>
                
                <button onClick={onClose} className="mt-4 text-gray-500 text-sm font-bold hover:text-gray-300">
                    暂不挑战
                </button>
            </motion.div>
        </div>
    );

    const renderDebriefing = () => {
        const isPerfect = masteredCount === queue.length;
        const xp = masteredCount * 20 + maxCombo * 5;
        return (
            <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-xl flex items-center justify-center p-6 z-[100] pointer-events-auto">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-sm bg-white rounded-[32px] p-8 text-center shadow-2xl relative overflow-hidden"
                >
                    <div className="flex justify-center mb-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-300 flex items-center justify-center shadow-lg ring-4 ring-white">
                            {isPerfect ? <Trophy size={48} className="text-yellow-700" /> : <CheckCircle2 size={48} className="text-brand" />}
                        </div>
                    </div>
                    <h2 className="text-2xl font-black text-gray-800 mb-2">{isPerfect ? '错题终结者！' : '挑战完成！'}</h2>
                    <p className="text-gray-500 text-sm font-medium mb-8">
                        {isPerfect ? '太强了！所有错题都已被你消灭。' : `不错！消灭了 ${masteredCount} 道错题，继续加油。`}
                    </p>
                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="bg-gray-50 p-4 rounded-2xl">
                            <div className="text-gray-400 text-xs font-bold uppercase mb-1">获得 XP</div>
                            <div className="text-brand text-2xl font-black">+{xp}</div>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-2xl">
                            <div className="text-gray-400 text-xs font-bold uppercase mb-1">最高连击</div>
                            <div className="text-orange-500 text-2xl font-black flex items-center justify-center gap-1">
                                {maxCombo} <Flame size={16} fill="currentColor" />
                            </div>
                        </div>
                    </div>
                    <button onClick={handleClaim} className="w-full bg-brand text-white font-bold py-4 rounded-2xl shadow-lg shadow-brand/20 transition-transform active:scale-95">
                        领取奖励并返回
                    </button>
                </motion.div>
            </div>
        );
    };

    // Battle Phase Render Logic
    const currentItem = queue[currentIndex];

    // Using Portal to ensure it sits inside the device frame "modal-root"
    return createPortal(
        <AnimatePresence mode="wait">
            {phase === 'briefing' && (
                <motion.div key="briefing" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 z-[100]">
                    {renderBriefing()}
                </motion.div>
            )}
            
            {phase === 'debriefing' && (
                <motion.div key="debriefing" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 z-[100]">
                    {renderDebriefing()}
                </motion.div>
            )}

            {phase === 'battle' && (
                <motion.div 
                    key="battle" 
                    initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} 
                    className="absolute inset-0 z-[100] bg-gray-100 flex flex-col overflow-hidden pointer-events-auto"
                >
                    {/* 1. Header (Fixed) */}
                    <div className="bg-white px-4 md:px-6 pt-6 pb-4 shadow-sm z-20 flex justify-between items-end shrink-0">
                        <div className="flex flex-col gap-1 w-full max-w-[140px]">
                            <span className="text-xs font-bold text-gray-400">进度</span>
                            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                <motion.div 
                                    className="h-full bg-brand"
                                    animate={{ width: `${((currentIndex + 1) / queue.length) * 100}%` }}
                                />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {combo > 1 && (
                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1 bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-black text-sm">
                                    <Flame size={14} fill="currentColor" />
                                    x{combo}
                                </motion.div>
                            )}
                            <button onClick={onClose} className="p-2 bg-gray-100 rounded-full text-gray-400 hover:bg-gray-200">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    {/* 2. Content (Scrollable with Responsive Padding) */}
                    <div className="flex-1 overflow-y-auto no-scrollbar px-4 md:px-6 lg:px-8 py-6">
                        <AnimatePresence mode="wait">
                            <motion.div 
                                key={currentItem.id}
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className="flex flex-col gap-6 max-w-4xl mx-auto"
                            >
                                {/* Question Card */}
                                <div className="bg-white rounded-[32px] p-6 md:p-8 shadow-sm border border-white">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="bg-brand/10 text-brand text-xs font-black px-2 py-1 rounded-lg">
                                            {currentItem.subject}
                                        </span>
                                        <span className="text-gray-400 text-xs font-bold">{currentItem.topic}</span>
                                    </div>
                                    <h2 className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed">
                                        {currentItem.fullQuestion}
                                    </h2>
                                </div>

                                {/* Options Grid (Responsive) */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                    {currentItem.options?.map((opt: string, i: number) => {
                                        let stateStyles = "bg-white border-white text-gray-600 shadow-sm hover:border-brand/30";
                                        if (isAnswered) {
                                            if (opt === currentItem.correctAnswer) {
                                                stateStyles = "bg-green-100 border-green-200 text-green-700 shadow-none";
                                            } else if (opt === selectedOption) {
                                                stateStyles = "bg-red-100 border-red-200 text-red-600 shadow-none";
                                            } else {
                                                stateStyles = "bg-gray-50 border-transparent text-gray-300 shadow-none opacity-50";
                                            }
                                        }

                                        return (
                                            <button 
                                                key={i}
                                                onClick={() => handleAnswer(opt)}
                                                disabled={isAnswered}
                                                className={`w-full p-4 md:p-6 rounded-2xl border-2 text-left font-bold text-lg transition-all active:scale-[0.98] flex items-center justify-between ${stateStyles}`}
                                            >
                                                <span>{opt}</span>
                                                {isAnswered && opt === currentItem.correctAnswer && <CheckCircle2 size={24} className="text-green-500" />}
                                                {isAnswered && opt === selectedOption && opt !== currentItem.correctAnswer && <X size={24} className="text-red-500" />}
                                            </button>
                                        );
                                    })}
                                </div>
                                
                                {/* Analysis Card */}
                                {isAnswered && !isCorrect && (
                                    <motion.div 
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-blue-50 rounded-[24px] p-6 border border-blue-100"
                                    >
                                        <div className="flex items-center gap-2 mb-3 text-blue-700 font-bold">
                                            <Bot size={20} />
                                            <span>Lumi 解析</span>
                                        </div>
                                        <p className="text-gray-700 leading-relaxed font-medium text-sm">
                                            {currentItem.analysis}
                                        </p>
                                    </motion.div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* 3. Footer (Fixed) */}
                    <div className="px-4 md:px-6 py-4 bg-white/80 backdrop-blur-md border-t border-white/50 flex items-center justify-between shrink-0 safe-area-bottom">
                         {/* Left: Hint */}
                         <div className="relative">
                             {!isAnswered && (
                                 <>
                                    <AnimatePresence>
                                        {showHint && (
                                            <motion.div 
                                                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0.8 }}
                                                className="absolute bottom-full left-0 mb-4 w-56 bg-gray-800 text-white p-3 rounded-2xl rounded-bl-none shadow-xl text-xs z-30"
                                            >
                                                💡 提示：注意审题中的关键字。
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    <button 
                                        onClick={() => setShowHint(!showHint)}
                                        className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-brand/10 hover:text-brand transition-colors"
                                    >
                                        <Bot size={24} />
                                    </button>
                                 </>
                             )}
                         </div>

                         {/* Right: Next */}
                         {isAnswered && (
                             <button 
                                onClick={nextQuestion}
                                className="px-8 py-3 bg-brand text-white font-bold rounded-2xl shadow-lg shadow-brand/20 flex items-center gap-2 active:scale-95 transition-transform ml-auto"
                             >
                                <span>{isCorrect ? '下一题' : '记住了，下一题'}</span>
                                <ArrowRight size={20} />
                             </button>
                         )}
                    </div>
                </motion.div>
            )}
        </AnimatePresence>,
        portalTarget
    );
};
