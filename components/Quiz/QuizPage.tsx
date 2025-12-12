
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Clock, PenTool, CheckCircle2, ChevronRight, X, Bot, Sparkles, LayoutGrid, Keyboard, Check, AlertCircle, Play, LogOut, Headphones } from 'lucide-react';
import { Task } from '../../types';
import { FloatingAction } from '../Layout/FloatingAction';

interface QuizPageProps {
  onExit: () => void;
  onReview?: () => void; // New callback for reviewing transcript
  task?: Task | null;
}

type QuestionType = 'single' | 'multiple' | 'text';

interface Question {
  id: string;
  type: QuestionType;
  tag: string;
  content: string;
  image?: string;
  options?: string[];
  correctAnswer?: string | string[]; // For result checking
  explanation?: string; // For analysis
}

// Mock Data
const MATH_QUESTIONS: Question[] = [
  {
    id: 'q1',
    type: 'single',
    tag: '一元一次方程',
    content: '已知方程 2x + 5 = 15，求 x 的值是多少？',
    options: ['x = 2', 'x = 5', 'x = 10', 'x = 4'],
    correctAnswer: 'x = 5',
    explanation: '移项得 2x = 15 - 5，即 2x = 10，解得 x = 5。'
  },
  {
    id: 'q2',
    type: 'multiple',
    tag: '移项',
    content: '关于移项，下列说法正确的是？(多选)',
    options: ['移项要变号', '移项是从方程的一边移到另一边', '常数项不能移项', '移项相当于方程两边同时加减'],
    correctAnswer: ['移项要变号', '移项是从方程的一边移到另一边', '移项相当于方程两边同时加减'],
    explanation: '移项的依据是等式的性质1。移项必须变号。常数项和含未知数的项都可以移项。'
  },
  {
    id: 'q3',
    type: 'text',
    tag: '合并同类项',
    content: '化简 3x - 5x 的结果是 ______。',
    correctAnswer: '-2x',
    explanation: '系数相加减：3 - 5 = -2，字母和指数不变，所以是 -2x。'
  }
];

const POEM_QUESTIONS: Question[] = [
  {
    id: 'p1',
    type: 'text',
    tag: '默写',
    content: '请补全诗句：海日生残夜，___________。',
    correctAnswer: '江春入旧年',
    explanation: '“海日生残夜，江春入旧年”是千古名句，描写了夜退日出、冬去春来的变化，蕴含新事物必将取代旧事物的哲理。'
  },
  {
    id: 'p2',
    type: 'single',
    tag: '理解',
    content: '“乡书何处达？归雁洛阳边。”表达了诗人怎样的情感？',
    options: ['忧国忧民', '思念家乡', '壮志未酬', '隐逸山林'],
    correctAnswer: '思念家乡',
    explanation: '通过“乡书”（家书）和“归雁”（北归的大雁）两个意象，寄托了诗人对家乡的深切思念。'
  },
  {
    id: 'p3',
    type: 'multiple',
    tag: '赏析',
    content: '关于《次北固山下》，下列说法正确的是？(多选)',
    options: ['作者是唐代诗人王湾', '诗中“次”意为“停泊”', '这是一首七言律诗', '颈联对仗工整'],
    correctAnswer: ['作者是唐代诗人王湾', '诗中“次”意为“停泊”', '颈联对仗工整'],
    explanation: '这是一首五言律诗，不是七言。颈联“海日生残夜，江春入旧年”对仗非常工整。'
  }
];

const ENGLISH_QUESTIONS: Question[] = [
    {
        id: 'e1',
        type: 'single',
        tag: 'Detail',
        content: 'What time does Tom usually get up?',
        options: ['At 6:30', 'At 7:00', 'At 7:30', 'At 8:00'],
        correctAnswer: 'At 6:30',
        explanation: 'Conversation transcript: "I usually wake up at half past six."'
    },
    {
        id: 'e2',
        type: 'multiple',
        tag: 'Inference',
        content: 'How does Tom go to school? (Select all mentioned details)',
        options: ['By bus', 'Takes 30 mins', 'With his sister', 'By subway'],
        correctAnswer: ['By subway', 'Takes 30 mins'],
        explanation: 'He takes the subway because it is fast. It takes about 30 minutes.'
    },
    {
        id: 'e3',
        type: 'text',
        tag: 'Dictation',
        content: 'Tom thinks math is ______ but interesting.',
        correctAnswer: 'difficult',
        explanation: 'Transcript: "Math is difficult for me, but it is also interesting."'
    }
];

export const QuizPage: React.FC<QuizPageProps> = ({ onExit, onReview, task }) => {
  // Determine active questions based on task
  let activeQuestions = MATH_QUESTIONS;
  
  // Safely check for English subject first
  if (task?.subject === '英语') {
      activeQuestions = ENGLISH_QUESTIONS;
  } else if (task?.subject === '语文') {
      activeQuestions = POEM_QUESTIONS;
  } else if (task?.subject === '数学') {
      activeQuestions = MATH_QUESTIONS;
  } else {
      // Fallback Logic based on title
      const isEnglish = task?.title.includes('英语') || task?.title.includes('English');
      if (task?.title.includes('古诗')) {
          activeQuestions = POEM_QUESTIONS;
      } else if (isEnglish) {
          activeQuestions = ENGLISH_QUESTIONS;
      }
  }

  const isMath = task?.subject === '数学';
  
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [isIdle, setIsIdle] = useState(false);
  const [showProgressGrid, setShowProgressGrid] = useState(false);
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  
  // New States for Result View
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [viewingDetailId, setViewingDetailId] = useState<string | null>(null);

  // Idle Timer Logic
  const lastInteractionRef = useRef<number>(Date.now());
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isPaused && !isSubmitted) {
          setTimerSeconds(s => s + 1);
          if (Date.now() - lastInteractionRef.current > 15000 && !isIdle) {
            setIsIdle(true);
          }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isIdle, isSubmitted, isPaused]);

  const handleInteraction = () => {
    lastInteractionRef.current = Date.now();
    if (isIdle) setIsIdle(false);
  };

  const handleBack = () => {
      if (isSubmitted) {
          onExit();
      } else {
          setIsPaused(true);
      }
  };

  const currentQ = activeQuestions[currentIdx];
  const progress = ((currentIdx + 1) / activeQuestions.length) * 100;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const ss = secs % 60;
    return `${mins}:${ss < 10 ? '0' : ''}${ss}`;
  };

  const handleOptionSelect = (option: string) => {
    handleInteraction();
    if (currentQ.type === 'single') {
      setAnswers({ ...answers, [currentQ.id]: option });
    } else if (currentQ.type === 'multiple') {
      const currentSelected = (answers[currentQ.id] as string[]) || [];
      if (currentSelected.includes(option)) {
        setAnswers({ ...answers, [currentQ.id]: currentSelected.filter(o => o !== option) });
      } else {
        setAnswers({ ...answers, [currentQ.id]: [...currentSelected, option] });
      }
    }
  };

  const handleNext = () => {
    handleInteraction();
    setIsKeyboardOpen(false);
    if (currentIdx < activeQuestions.length - 1) {
      setCurrentIdx(curr => curr + 1);
    } else {
      setIsSubmitted(true);
    }
  };

  const isCorrect = (qId: string) => {
      const q = activeQuestions.find(item => item.id === qId);
      if (!q) return false;
      
      const userAns = answers[qId];
      if (!userAns) return false; 

      if (q.type === 'multiple') {
         const correctArr = q.correctAnswer as string[];
         const userArr = userAns as string[];
         if (userArr.length !== correctArr.length) return false;
         return userArr.every(val => correctArr.includes(val));
      }
      
      return userAns === q.correctAnswer;
  };

  // --- RESULT VIEW ---
  if (isSubmitted) {
      const correctCount = activeQuestions.filter(q => isCorrect(q.id)).length;
      const isEnglishSubject = task?.subject === '英语' || task?.title.includes('英语') || task?.title.includes('English');

      return (
          <div className="w-full h-full flex flex-col bg-gray-100 relative z-30 overflow-hidden">
               {/* Result Header */}
               <div className="px-6 pt-8 pb-6 bg-brand rounded-b-[40px] shadow-lg relative z-10">
                   <div className="flex justify-between items-center mb-6">
                       <div className="w-10"></div>
                       <h2 className="text-white text-lg font-bold">测评报告</h2>
                       <button onClick={onExit} className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20">
                           <X size={24} />
                       </button>
                   </div>
                   
                   <div className="flex flex-col items-center text-white mb-4">
                       <div className="text-5xl font-black mb-1">{correctCount}/{activeQuestions.length}</div>
                       <p className="opacity-80 font-medium">答对题数</p>
                   </div>
                   
                   {/* REVIEW ENTRY POINT */}
                   {onReview && (
                       <div className="flex justify-center mt-2">
                           <button 
                                onClick={onReview}
                                className="bg-white/20 hover:bg-white/30 text-white border border-white/40 px-6 py-2.5 rounded-full font-bold text-sm flex items-center gap-2 transition-all backdrop-blur-sm"
                           >
                                <Headphones size={16} /> 
                                {isEnglishSubject ? '对照原文复听' : '回顾重点笔记'}
                           </button>
                       </div>
                   )}
               </div>

               {/* Question Grid */}
               <div className="flex-1 p-6 overflow-y-auto">
                   <div className="bg-white rounded-[32px] p-6 shadow-sm mb-6">
                       <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                           <LayoutGrid size={18} className="text-brand" />
                           答题卡
                       </h3>
                       <div className="grid grid-cols-4 gap-4">
                           {activeQuestions.map((q, idx) => {
                               const correct = isCorrect(q.id);
                               return (
                                   <button 
                                      key={q.id}
                                      onClick={() => setViewingDetailId(q.id)}
                                      className={`aspect-square rounded-2xl flex flex-col items-center justify-center gap-1 font-black text-lg transition-transform active:scale-95 ${
                                          correct 
                                          ? 'bg-green-100 text-green-600 border-2 border-green-200' 
                                          : 'bg-red-100 text-red-500 border-2 border-red-200'
                                      }`}
                                   >
                                       <span>{idx + 1}</span>
                                       {correct ? <Check size={16} strokeWidth={4} /> : <X size={16} strokeWidth={4} />}
                                   </button>
                               )
                           })}
                       </div>
                   </div>
               </div>

               {/* Detail Modal Overlay */}
               <AnimatePresence>
                   {viewingDetailId && (
                       <motion.div 
                          initial={{ y: '100%' }}
                          animate={{ y: 0 }}
                          exit={{ y: '100%' }}
                          className="absolute inset-0 bg-gray-50 z-50 flex flex-col"
                       >
                           {(() => {
                               const q = activeQuestions.find(i => i.id === viewingDetailId)!;
                               const correct = isCorrect(q.id);
                               return (
                                   <>
                                       {/* Detail Header */}
                                       <div className="px-6 py-4 bg-white shadow-sm flex justify-between items-center shrink-0">
                                            <h3 className="font-bold text-lg text-gray-800">题目解析</h3>
                                            <button 
                                                onClick={() => setViewingDetailId(null)}
                                                className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 text-gray-500"
                                            >
                                                <ChevronRight size={24} className="rotate-90" />
                                            </button>
                                       </div>
                                       
                                       <div className="flex-1 overflow-y-auto p-6">
                                            {/* Status Badge */}
                                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl mb-6 font-bold ${correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                                                {correct ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                                                {correct ? '回答正确' : '回答错误'}
                                            </div>

                                            {/* Question Content */}
                                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
                                                <h4 className="font-bold text-gray-800 text-lg mb-4">{q.content}</h4>
                                                {q.options && (
                                                    <div className="flex flex-col gap-2">
                                                        {q.options.map((opt, i) => (
                                                            <div key={i} className={`p-3 rounded-xl text-sm font-bold ${
                                                                q.correctAnswer === opt || (Array.isArray(q.correctAnswer) && q.correctAnswer.includes(opt))
                                                                ? 'bg-green-50 text-green-700 border border-green-200'
                                                                : answers[q.id] === opt && !correct
                                                                ? 'bg-red-50 text-red-600 border border-red-200'
                                                                : 'bg-gray-50 text-gray-400'
                                                            }`}>
                                                                {String.fromCharCode(65 + i)}. {opt}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                                {q.type === 'text' && (
                                                    <div className="p-4 bg-gray-50 rounded-xl font-mono text-gray-600">
                                                        你的答案: {answers[q.id] || '未作答'}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Analysis */}
                                            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                                                <div className="flex items-center gap-2 mb-3 text-blue-700 font-bold">
                                                    <Bot size={20} />
                                                    <span>AI 解析</span>
                                                </div>
                                                <p className="text-gray-700 leading-relaxed font-medium">
                                                    {q.explanation}
                                                </p>
                                                <div className="mt-4 pt-4 border-t border-blue-200 flex items-center gap-2 text-xs text-blue-500 font-bold">
                                                    <Sparkles size={14} />
                                                    <span>知识点：{q.tag}</span>
                                                </div>
                                            </div>
                                       </div>
                                   </>
                               )
                           })()}
                       </motion.div>
                   )}
               </AnimatePresence>
          </div>
      )
  }

  // --- NORMAL QUIZ VIEW ---
  return (
    <div ref={containerRef} className="w-full h-full flex flex-col bg-gray-100 relative z-30">
      
      {/* --- 1. Top Immersive Header --- */}
      <div className="flex justify-between items-center px-4 pt-6 pb-2 relative z-20 shrink-0 bg-gray-100">
        {/* Left: Back */}
        <button 
          onClick={handleBack}
          className="p-2 rounded-full hover:bg-white/50 transition-colors text-gray-500"
        >
          <ChevronLeft size={28} />
        </button>

        {/* Center: Progress Capsule */}
        <div className="relative">
          <button 
            onClick={() => setShowProgressGrid(!showProgressGrid)}
            className="relative bg-white rounded-full h-8 px-1 flex items-center gap-2 border border-gray-200 shadow-sm overflow-hidden active:scale-95 transition-transform"
            style={{ width: '140px' }}
          >
             {/* Progress Fill Background */}
             <div 
                className="absolute inset-0 bg-brand/10 transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
             ></div>
             
             <div className="relative z-10 flex items-center justify-between w-full px-3">
                <span className="text-xs font-black text-brand tracking-widest font-mono">
                    {currentIdx + 1}/{activeQuestions.length}
                </span>
                <LayoutGrid size={14} className="text-gray-400" />
             </div>
          </button>
          
          {/* Dropdown Grid */}
          <AnimatePresence>
            {showProgressGrid && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full left-1/2 -translate-x-1/2 mt-3 bg-white rounded-2xl p-4 shadow-xl z-50 w-64 border border-gray-100 grid grid-cols-5 gap-3"
              >
                 {activeQuestions.map((_, idx) => (
                   <button 
                      key={idx}
                      onClick={() => { setCurrentIdx(idx); setShowProgressGrid(false); }}
                      className={`w-10 h-10 rounded-xl font-bold flex items-center justify-center text-sm transition-colors border-2 ${idx === currentIdx ? 'border-brand text-brand bg-brand/5' : answers[activeQuestions[idx].id] ? 'bg-green-500 text-white border-green-500' : 'border-gray-100 bg-gray-50 text-gray-400'}`}
                   >
                     {idx + 1}
                   </button>
                 ))}
                 
                 <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white border-t border-l border-gray-100 transform rotate-45"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Tools */}
        <div className="flex items-center gap-2">
           <button 
             onClick={() => setIsPaused(true)}
             className="bg-white text-brand shadow-sm border border-gray-100 px-3 py-1.5 rounded-full font-mono font-bold flex items-center gap-2 active:scale-95 transition-transform hover:bg-gray-50"
           >
             <Clock size={16} strokeWidth={2.5} />
             <span className="text-sm">{formatTime(timerSeconds)}</span>
           </button>

           <button 
              onClick={() => setIsAnnotating(!isAnnotating)}
              className={`p-2 rounded-full transition-colors ${isAnnotating ? 'bg-accent text-brand-dark shadow-sm' : 'hover:bg-gray-200 text-gray-400'}`}
           >
             <PenTool size={20} />
           </button>
        </div>
      </div>

      {/* --- 2. Main Body --- */}
      <div className="flex-1 flex flex-col px-4 pb-24 pt-2 overflow-hidden gap-4">
        <div className="flex-[0.6] bg-white rounded-[32px] shadow-sm border border-white p-6 md:p-8 overflow-y-auto relative no-scrollbar">
            <div className="flex items-center gap-3 mb-6">
                 <span className="bg-brand/10 text-brand text-xs font-black px-2.5 py-1 rounded-lg">
                    {currentQ.tag}
                 </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed mb-6">
                 {currentQ.content}
            </h2>
            {currentQ.image && (
                 <div className="rounded-2xl overflow-hidden border-2 border-gray-100 relative group cursor-zoom-in max-w-md">
                    <img src={currentQ.image} alt="Attachment" className="w-full h-auto object-cover" />
                 </div>
            )}
        </div>
        <div className="flex-[0.4] flex flex-col">
            {currentQ.type === 'text' ? (
                <div className="bg-white rounded-[32px] p-6 shadow-sm border border-white h-full flex flex-col gap-4">
                     <div className={`flex-1 bg-gray-50 rounded-2xl border-2 transition-all flex flex-col ${isKeyboardOpen ? 'border-brand ring-4 ring-brand/10' : 'border-gray-100'}`}>
                        <textarea 
                            className="w-full h-full p-4 bg-transparent outline-none text-lg font-bold text-gray-800 resize-none placeholder:text-gray-300"
                            placeholder="点击此处输入答案..."
                            value={answers[currentQ.id] || ''}
                            onFocus={() => { handleInteraction(); setIsKeyboardOpen(true); }}
                            onBlur={() => { setTimeout(() => setIsKeyboardOpen(false), 200); }}
                            onChange={(e) => setAnswers({...answers, [currentQ.id]: e.target.value})}
                        />
                     </div>
                     <div className="flex justify-between items-center">
                        <div className="flex gap-2">
                             {isMath && (
                                <>
                                 <button className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200">√x 公式</button>
                                 <button className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200">Ω 符号</button>
                                </>
                             )}
                        </div>
                        {isKeyboardOpen && (
                             <button onClick={() => setIsKeyboardOpen(false)} className="text-brand">
                                 <Keyboard size={20} />
                             </button>
                        )}
                     </div>
                </div>
            ) : (
                <div className="flex flex-col gap-3 h-full overflow-y-auto no-scrollbar">
                     {currentQ.options?.map((opt, idx) => {
                       const isSelected = currentQ.type === 'single' ? answers[currentQ.id] === opt : (answers[currentQ.id] as string[])?.includes(opt);
                       return (
                         <button
                           key={idx}
                           onClick={() => handleOptionSelect(opt)}
                           className={`w-full p-5 rounded-[24px] border-2 text-left transition-all duration-200 flex items-center justify-between group active:scale-[0.98] ${isSelected ? 'border-brand bg-white shadow-md shadow-brand/10' : 'border-white bg-white shadow-sm text-gray-600'}`}
                         >
                           <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-black border transition-colors ${isSelected ? 'bg-brand text-white border-brand' : 'bg-gray-50 text-gray-400 border-gray-100 group-hover:border-brand/30'}`}>
                                 {String.fromCharCode(65 + idx)}
                              </div>
                              <span className={`text-lg font-bold ${isSelected ? 'text-brand-dark' : 'text-gray-700'}`}>{opt}</span>
                           </div>
                           {isSelected && <CheckCircle2 size={24} className="text-brand fill-brand/10" />}
                         </button>
                       )
                     })}
                </div>
            )}
        </div>
      </div>

      <FloatingAction position="left" currentContext="quiz" containerRef={containerRef} customBubbleMessage={`关于「${currentQ.tag}」，需要提示吗？`} />

      {!isKeyboardOpen && (
      <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 pt-4 bg-gradient-to-t from-gray-100 to-transparent z-40 flex items-end justify-end pointer-events-none">
        <button onClick={handleNext} className="pointer-events-auto bg-brand text-white px-8 py-4 rounded-[28px] font-extrabold text-lg shadow-[0_10px_30px_rgba(108,93,211,0.3)] active:scale-95 transition-all flex items-center gap-2 hover:bg-brand-dark">
           <span>{currentIdx === activeQuestions.length - 1 ? '提交试卷' : '下一题'}</span>
           <ChevronRight size={24} strokeWidth={3} />
        </button>
      </div>
      )}

      {/* Pause Modal using Flex centering to avoid Framer motion transform conflict */}
      <AnimatePresence>
        {isPaused && (
           <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm z-[80] pointer-events-auto flex items-center justify-center p-6"
              onClick={() => setIsPaused(false)}
           >
              <motion.div 
                 initial={{ scale: 0.9, opacity: 0, y: 20 }}
                 animate={{ scale: 1, opacity: 1, y: 0 }}
                 exit={{ scale: 0.9, opacity: 0, y: 20 }}
                 onClick={(e) => e.stopPropagation()}
                 className="w-full max-w-sm bg-white rounded-[32px] p-8 text-center shadow-2xl relative z-[90]"
              >
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                      <Clock size={32} />
                  </div>
                  <h3 className="text-2xl font-black text-gray-800 mb-2">考试已暂停</h3>
                  <p className="text-gray-500 font-medium mb-8">别担心，休息一下，随时可以回来。</p>
                  
                  <div className="flex flex-col gap-3">
                      <button onClick={() => setIsPaused(false)} className="w-full py-4 rounded-2xl bg-brand text-white font-bold text-lg shadow-lg shadow-brand/20 flex items-center justify-center gap-2 hover:bg-brand-dark transition-colors">
                         <Play size={20} fill="currentColor" /> 继续答题
                      </button>
                      <button onClick={onExit} className="w-full py-4 rounded-2xl bg-gray-100 text-gray-600 font-bold text-lg hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center gap-2">
                         <LogOut size={20} /> 退出测验
                      </button>
                  </div>
              </motion.div>
           </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
