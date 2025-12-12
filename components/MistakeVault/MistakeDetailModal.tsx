
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MistakeItem, VariantQuestion } from '../../types';
import { generateMistakeVariant } from '../../services/geminiService';
import { X, Clock, AlertCircle, RotateCcw, Bot, Sparkles, Eye, Bookmark, Target, History, Check, XCircle, Trophy, ArrowRight, CheckCircle2 } from 'lucide-react';

interface MistakeDetailModalProps {
  item: MistakeItem;
  onClose: () => void;
}

export const MistakeDetailModal: React.FC<MistakeDetailModalProps> = ({ item, onClose }) => {
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [variant, setVariant] = useState<VariantQuestion | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewState, setViewState] = useState<'original' | 'variant'>('original');
  const [selectedVariantOption, setSelectedVariantOption] = useState<string | null>(null);
  
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setPortalTarget(document.getElementById('modal-root'));
  }, []);

  const handleGenerateVariant = async () => {
    setIsGenerating(true);
    setSelectedVariantOption(null);
    setShowAnalysis(false); 
    try {
        const v = await generateMistakeVariant(item.id);
        setVariant(v);
        setViewState('variant');
    } catch (e) {
        console.error(e);
    } finally {
        setIsGenerating(false);
    }
  };

  const handleVariantSelect = (option: string) => {
      if (selectedVariantOption) return; 
      setSelectedVariantOption(option);
  };

  const checkCorrectness = (opt: string) => {
      if (!variant) return false;
      return variant.correctAnswer.includes(opt) || opt.includes(variant.correctAnswer.split(' ')[0]);
  }

  const isSelectedCorrect = selectedVariantOption && checkCorrectness(selectedVariantOption);

  if (!portalTarget) return null;

  return createPortal(
    <>
        {/* Backdrop - Fills absolute parent */}
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm z-[60] pointer-events-auto"
        />

        {/* Modal Container - Centered or Floating Sheet style */}
        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="absolute inset-4 md:inset-12 lg:inset-x-32 lg:inset-y-16 bg-white rounded-[32px] shadow-2xl z-[70] flex flex-col overflow-hidden pointer-events-auto"
        >
            {/* --- 1. Top Bar (Fixed) --- */}
            <div className="flex justify-between items-center px-4 md:px-6 py-4 border-b border-gray-100 bg-gray-50/50 shrink-0">
                <div className="flex items-center gap-3">
                    <span className="bg-brand/10 text-brand font-black text-xs px-2.5 py-1 rounded-lg">
                        {item.subject}
                    </span>
                    <span className="text-gray-400 font-bold text-sm truncate max-w-[150px]">
                        {item.topic}
                    </span>
                </div>
                <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-500 transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* --- 2. Scrollable Body --- */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative bg-gray-50/30">
                <div className="p-4 md:p-6 lg:p-8 flex flex-col gap-6">
                    
                    {/* A. Info Stats Header */}
                    {viewState === 'original' && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                            <StatBadge icon={<Clock size={16} />} label="上次做错" value={item.stats.lastWrongDate} color="text-gray-500" bg="bg-gray-100" />
                            <StatBadge icon={<AlertCircle size={16} />} label="错误次数" value={`${item.stats.errorCount} 次`} color="text-red-500" bg="bg-red-50" />
                            <StatBadge icon={<History size={16} />} label="复习次数" value={`${item.stats.reviewCount} 次`} color="text-orange-500" bg="bg-orange-50" />
                            <StatBadge icon={<Target size={16} />} label="正确连胜" value={`${item.stats.correctCount} 次`} color="text-green-500" bg="bg-green-50" />
                        </div>
                    )}

                    {/* B. View Switcher Tabs */}
                    {variant && (
                        <div className="flex p-1 bg-gray-200 rounded-xl self-start">
                            <button onClick={() => setViewState('original')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${viewState === 'original' ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>原题</button>
                            <button onClick={() => setViewState('variant')} className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all flex items-center gap-1 ${viewState === 'variant' ? 'bg-brand text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                                <Sparkles size={12} /> 变式题
                            </button>
                        </div>
                    )}

                    {/* C. Question Content Area */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={viewState}
                            initial={{ opacity: 0, x: viewState === 'variant' ? 50 : -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: viewState === 'variant' ? 50 : -50 }}
                            className="bg-white rounded-[24px] p-6 md:p-8 shadow-sm border border-gray-100 min-h-[200px]"
                        >
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed mb-6">
                                {viewState === 'original' ? item.fullQuestion : variant?.content}
                            </h2>
                            
                            {viewState === 'original' && (
                                <div className="flex gap-2 mb-2">
                                    <div className={`px-3 py-1.5 rounded-lg text-xs font-bold bg-red-100 text-red-600`}>{item.errorType}</div>
                                    {item.stats.isStarred && (
                                         <div className="px-3 py-1.5 rounded-lg text-xs font-bold bg-yellow-100 text-yellow-600 flex items-center gap-1">
                                            <Bookmark size={12} fill="currentColor" /> 重点收藏
                                         </div>
                                    )}
                                </div>
                            )}

                            {viewState === 'original' && (
                                <div className="mt-8 p-4 bg-gray-50 rounded-xl border border-gray-100 flex flex-col md:flex-row gap-4 md:items-center justify-between">
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-gray-400 uppercase">你的误答</span>
                                        <span className="font-mono font-bold text-red-500 text-lg line-through">{item.userWrongAnswer || '未作答'}</span>
                                    </div>
                                    <div className="hidden md:block w-px h-8 bg-gray-200"></div>
                                    <div className="flex flex-col">
                                        <span className="text-xs font-bold text-gray-400 uppercase">正确答案</span>
                                        <div className={`transition-all duration-300 ${showAnalysis ? 'blur-0' : 'blur-sm select-none'}`}>
                                            <span className="font-mono font-bold text-green-600 text-lg">{item.correctAnswer}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {viewState === 'variant' && variant?.options && (
                                <div className="mt-8 flex flex-col gap-3">
                                    {variant.options.map((opt, i) => {
                                        let btnClass = "border-gray-200 hover:border-brand hover:bg-brand/5 text-gray-600";
                                        let icon = <span className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-xs font-bold text-gray-400">{String.fromCharCode(65+i)}</span>;
                                        
                                        if (selectedVariantOption) {
                                            const isThisSelected = selectedVariantOption === opt;
                                            const isThisCorrect = checkCorrectness(opt);
                                            if (isThisCorrect) {
                                                btnClass = "border-green-500 bg-green-50 text-green-700";
                                                icon = <CheckCircle2 size={24} className="text-green-500" />;
                                            } else if (isThisSelected && !isThisCorrect) {
                                                btnClass = "border-red-400 bg-red-50 text-red-600";
                                                icon = <XCircle size={24} className="text-red-500" />;
                                            } else {
                                                btnClass = "border-gray-100 opacity-50";
                                            }
                                        }

                                        return (
                                            <button key={i} onClick={() => handleVariantSelect(opt)} disabled={!!selectedVariantOption} className={`w-full text-left p-4 rounded-xl border-2 transition-all font-bold flex items-center justify-between ${btnClass}`}>
                                                <span>{opt}</span>
                                                {icon}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                    
                    {/* D. Analysis Section */}
                    <AnimatePresence>
                        {viewState === 'original' && showAnalysis && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                                <div className="bg-blue-50/50 rounded-[24px] p-6 border border-blue-100">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"><Bot size={18} /></div>
                                        <span className="font-bold text-blue-800">AI 深度解析</span>
                                    </div>
                                    <p className="text-gray-700 leading-relaxed text-sm md:text-base">{item.analysis}</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                     {/* E. Result Feedback */}
                     <AnimatePresence>
                        {viewState === 'variant' && selectedVariantOption && (
                            <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className={`rounded-[24px] p-6 border-l-4 shadow-lg ${isSelectedCorrect ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'}`}>
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSelectedCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                        {isSelectedCorrect ? <Trophy size={20} /> : <Bot size={20} />}
                                    </div>
                                    <div>
                                        <h4 className={`font-black text-lg ${isSelectedCorrect ? 'text-green-800' : 'text-red-800'}`}>{isSelectedCorrect ? '太棒了！完全正确！' : '哎呀，有点小遗憾'}</h4>
                                        <p className={`text-xs font-bold ${isSelectedCorrect ? 'text-green-600' : 'text-red-600'}`}>{isSelectedCorrect ? '你已经掌握了这个知识点。' : '别灰心，看看解析哪里出了问题。'}</p>
                                    </div>
                                </div>
                                <div className="bg-white/60 rounded-xl p-4 mb-4 text-sm font-medium text-gray-700 leading-relaxed">
                                    <span className="font-bold mr-1">💡 解析：</span>{variant?.explanation}
                                </div>
                                <div className="flex gap-3">
                                    {isSelectedCorrect ? (
                                        <button onClick={onClose} className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-bold shadow-lg shadow-green-200 transition-all active:scale-95 flex items-center justify-center gap-2">
                                            <Check size={18} /> 标记原题已掌握
                                        </button>
                                    ) : (
                                        <button onClick={handleGenerateVariant} className="flex-1 bg-white border border-red-200 text-red-600 hover:bg-red-50 py-3 rounded-xl font-bold transition-all active:scale-95 flex items-center justify-center gap-2">
                                            <RotateCcw size={18} /> 再练一题
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* --- 3. Bottom Action Bar (Fixed) --- */}
            {!(viewState === 'variant' && selectedVariantOption) && (
            <div className="p-4 md:p-6 bg-white border-t border-gray-100 flex flex-col md:flex-row gap-4 items-center shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-10 shrink-0">
                {viewState === 'original' && (
                <>
                    <button onClick={() => setShowAnalysis(!showAnalysis)} className={`flex-1 w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all ${showAnalysis ? 'bg-gray-100 text-gray-600' : 'bg-white border-2 border-gray-100 text-gray-600 hover:border-gray-300'}`}>
                        {showAnalysis ? <Eye size={20} className="opacity-50" /> : <Eye size={20} />} {showAnalysis ? '收起解析' : '查看解析'}
                    </button>
                    <div className="flex-1 w-full flex gap-3">
                        <button className="flex-1 py-4 rounded-2xl font-bold bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors flex items-center justify-center gap-2">
                            <RotateCcw size={20} /> 复习
                        </button>
                        <button onClick={handleGenerateVariant} disabled={isGenerating} className={`flex-[1.5] py-4 rounded-2xl font-bold text-white shadow-lg shadow-brand/20 flex items-center justify-center gap-2 transition-all relative overflow-hidden bg-brand hover:bg-brand-dark`}>
                            {isGenerating ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div><span className="opacity-90">生成中...</span></> : <><Sparkles size={20} /> 举一反三</>}
                        </button>
                    </div>
                </>
                )}
                {viewState === 'variant' && !selectedVariantOption && (
                     <div className="w-full text-center text-gray-400 text-sm font-bold flex items-center justify-center gap-2 py-2">
                         <Sparkles size={16} className="animate-pulse text-brand" /> 请选择一个你认为正确的选项
                     </div>
                )}
            </div>
            )}
        </motion.div>
    </>,
    portalTarget
  );
};

const StatBadge: React.FC<{ icon: React.ReactNode, label: string, value: string, color: string, bg: string }> = ({ icon, label, value, color, bg }) => (
    <div className={`flex flex-col items-center justify-center p-3 rounded-2xl ${bg}`}>
        <div className={`mb-1 opacity-80 ${color}`}>{icon}</div>
        <div className={`text-xs font-bold opacity-60 uppercase mb-0.5 ${color}`}>{label}</div>
        <div className={`text-sm font-black ${color} truncate max-w-full`}>{value}</div>
    </div>
);
