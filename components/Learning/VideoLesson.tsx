
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Play, Pause, ChevronRight, RotateCcw, Maximize, Volume2, Settings, BookOpen, AlertTriangle, Languages, PenTool, Highlighter, ChevronDown, Check, Mic, MessageCircle } from 'lucide-react';
import { Task } from '../../types';

interface VideoLessonProps {
  onComplete: () => void;
  onExit: () => void;
  task?: Task | null;
  mode?: 'learn' | 'review';
}

// --- Data Models ---

type SubjectType = '数学' | '语文' | '英语';

interface BaseLessonPoint {
  time: number; // Seconds to jump to
  id: string;
}

interface MathFormula extends BaseLessonPoint {
  latex: string; // For prototype we use text representation
  explanation: string;
  isKeyStep?: boolean;
}

interface ChineseLine extends BaseLessonPoint {
  text: string;
  translation: string;
  notes?: string[];
}

interface EnglishDialogue extends BaseLessonPoint {
  speaker: string;
  role: 'A' | 'B'; // A is usually left/interviewer, B is right/interviewee
  avatar: string;
  text: string;
  translation?: string;
}

interface LessonData {
  subject: SubjectType;
  title: string;
  duration: number;
  tabs: { id: string; label: string }[];
  content: {
    // Math
    formulas?: MathFormula[];
    pitfalls?: { title: string; desc: string }[];
    // Chinese
    poem?: { title: string; author: string; dynasty: string; lines: ChineseLine[] };
    appreciation?: { title: string; content: string }[];
    // English
    dialogue?: EnglishDialogue[];
    vocab?: { word: string; phonetics: string; meaning: string }[];
  };
}

// --- Mock Data ---

const LESSON_DB: Record<string, LessonData> = {
  '数学': {
    subject: '数学',
    title: '一元一次方程：移项与合并',
    duration: 180,
    tabs: [{ id: 'board', label: '板书笔记' }, { id: 'pitfalls', label: '易错陷阱' }],
    content: {
      formulas: [
        { id: 'step1', time: 5, latex: '2x + 5 = 15', explanation: '原方程' },
        { id: 'step2', time: 15, latex: '2x = 15 - 5', explanation: '移项：+5 变 -5', isKeyStep: true },
        { id: 'step3', time: 35, latex: '2x = 10', explanation: '合并同类项' },
        { id: 'step4', time: 50, latex: 'x = 5', explanation: '系数化为 1', isKeyStep: true },
      ],
      pitfalls: [
        { title: '移项忘记变号', desc: '这是最常见的错误！把数从等号一边移到另一边时，正号要变负号，负号变正号。' },
        { title: '等号对齐', desc: '书写步骤时，注意等号上下对齐，保持卷面整洁逻辑清晰。' }
      ]
    }
  },
  '语文': {
    subject: '语文',
    title: '古诗鉴赏：次北固山下',
    duration: 150,
    tabs: [{ id: 'poem', label: '原文精读' }, { id: 'analysis', label: '名师赏析' }],
    content: {
      poem: {
        title: '次北固山下',
        author: '王湾',
        dynasty: '唐',
        lines: [
          { id: 'l1', time: 5, text: '客路青山外，行舟绿水前。', translation: '旅途在青山之外，行舟于绿水之中。', notes: ['客路：旅途', '青山：指北固山'] },
          { id: 'l2', time: 15, text: '潮平两岸阔，风正一帆悬。', translation: '潮水上涨，两岸之间水面宽阔；顺风行船，一片白帆高高挂起。' },
          { id: 'l3', time: 30, text: '海日生残夜，江春入旧年。', translation: '夜幕还没有褪尽，旭日已在江上冉冉升起；还在旧年时分，江南已有了春天的气息。' },
          { id: 'l4', time: 45, text: '乡书何处达？归雁洛阳边。', translation: '寄出去的家信不知何时才能到达？希望北归的大雁捎到洛阳去。' },
        ]
      },
      appreciation: [
        { title: '写作背景', content: '诗人王湾往来于吴、楚间，途经北固山下，见大江直流，波平浪静，景色壮阔，遂有此作。' },
        { title: '哲理升华', content: '“海日生残夜，江春入旧年”不仅写景逼真，叙事确切，而且表现出具有普遍意义的生活真理，给人以乐观、积极、向上的艺术鼓舞力量。' }
      ]
    }
  },
  '英语': {
    subject: '英语',
    title: 'Unit 3: Daily Routine',
    duration: 120,
    tabs: [{ id: 'script', label: '情景对话' }, { id: 'vocab', label: '核心词汇' }],
    content: {
      dialogue: [
        { id: 'd1', time: 2, speaker: 'Rick', role: 'A', avatar: '👦', text: 'Hi Scott. What time do you usually get up?', translation: '嗨 Scott，你通常几点起床？' },
        { id: 'd2', time: 8, speaker: 'Scott', role: 'B', avatar: '🧑‍🦱', text: 'I usually get up at six thirty.', translation: '我通常六点半起床。' },
        { id: 'd3', time: 14, speaker: 'Rick', role: 'A', avatar: '👦', text: 'That\'s early! Do you exercise?', translation: '真早啊！你会锻炼吗？' },
        { id: 'd4', time: 19, speaker: 'Scott', role: 'B', avatar: '🧑‍🦱', text: 'Yes. I usually run at seven o\'clock.', translation: '是的，我通常七点钟跑步。' },
        { id: 'd5', time: 26, speaker: 'Rick', role: 'A', avatar: '👦', text: 'Then what time do you go to school?', translation: '那你几点去学校？' },
        { id: 'd6', time: 32, speaker: 'Scott', role: 'B', avatar: '🧑‍🦱', text: 'At eight o\'clock. I take the bus.', translation: '八点。我坐公交车去。' },
      ],
      vocab: [
        { word: 'usually', phonetics: '/ˈjuːʒuəli/', meaning: 'adv. 通常地；一般地' },
        { word: 'get up', phonetics: '/ɡet ʌp/', meaning: 'phr. 起床；站起' },
        { word: 'exercise', phonetics: '/ˈeksəsaɪz/', meaning: 'v. & n. 锻炼；练习' },
        { word: 'o\'clock', phonetics: '/əˈklɒk/', meaning: 'adv. …点钟' },
        { word: 'take the bus', phonetics: '-', meaning: 'phr. 乘公交车' },
      ]
    }
  }
};

export const VideoLesson: React.FC<VideoLessonProps> = ({ onComplete, onExit, task }) => {
  // 1. Identify Subject & Load Data
  const subjectStr = task?.subject || '数学';
  // Fallback map for loose matching
  const mapSubject = (s: string): SubjectType => {
      // Fix: Check for English first because "英语" contains "语" which would match Chinese
      if (s.includes('英')) return '英语'; 
      if (s.includes('数')) return '数学';
      if (s.includes('语') || s.includes('诗')) return '语文';
      return '数学';
  };
  const activeSubject = mapSubject(subjectStr);
  const data = LESSON_DB[activeSubject];

  // 2. Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0); // 0-100
  const [currentTime, setCurrentTime] = useState(0); // seconds
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  
  // 3. UI State
  const [activeTabId, setActiveTabId] = useState(data.tabs[0].id);
  
  // Ref for auto-scrolling dialogue
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-Simulation of Video Progress
  useEffect(() => {
    let interval: any;
    if (isPlaying) {
      interval = setInterval(() => {
        setCurrentTime((prev) => {
           if (prev >= data.duration) {
               setIsPlaying(false);
               return data.duration;
           }
           return prev + (0.5 * playbackSpeed); // Update every 500ms
        });
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, data.duration, playbackSpeed]);

  // Sync Progress Bar
  useEffect(() => {
      setProgress((currentTime / data.duration) * 100);
  }, [currentTime, data.duration]);
  
  // Auto-scroll logic for Script
  useEffect(() => {
      if (activeSubject === '英语' && isPlaying) {
          const activeEl = document.getElementById(`dialogue-${Math.floor(currentTime)}`); // approximate mapping or use ID logic
          // A better way is finding the active line ID and scrolling to it
          const currentLine = data.content.dialogue?.find((l, idx, arr) => {
             const next = arr[idx + 1];
             return currentTime >= l.time && (!next || currentTime < next.time);
          });
          
          if (currentLine) {
             const el = document.getElementById(`msg-${currentLine.id}`);
             if (el && scrollRef.current) {
                 // Smooth scroll to element
                 el.scrollIntoView({ behavior: 'smooth', block: 'center' });
             }
          }
      }
  }, [currentTime, activeSubject, isPlaying, data.content.dialogue]);

  const handleSeek = (time: number) => {
      setCurrentTime(time);
      setIsPlaying(true);
  };

  const formatTime = (seconds: number) => {
      const m = Math.floor(seconds / 60);
      const s = Math.floor(seconds % 60);
      return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // --- RENDERERS ---

  // A. The Video Player Area (Subject Specific Visuals)
  const renderPlayerVisual = () => {
    // 1. MATH: Logic Board
    if (activeSubject === '数学') {
        const currentFormula = data.content.formulas?.slice().reverse().find(f => f.time <= currentTime);
        return (
            <div className="absolute inset-0 bg-[#1a1d21] flex flex-col items-center justify-center p-8 overflow-hidden">
                {/* Grid Background */}
                <div className="absolute inset-0 opacity-10" 
                     style={{backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '40px 40px'}}>
                </div>
                
                {/* Simulated Writing Content */}
                <AnimatePresence mode="wait">
                    {currentFormula ? (
                        <motion.div 
                            key={currentFormula.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.1 }}
                            className="text-white text-center z-10"
                        >
                            <div className="text-4xl md:text-5xl font-mono font-bold mb-4 text-blue-100 tracking-wider">
                                {currentFormula.latex}
                            </div>
                            <div className="inline-block px-3 py-1 bg-blue-500/20 text-blue-300 rounded-lg text-sm border border-blue-500/30">
                                {currentFormula.explanation}
                            </div>
                        </motion.div>
                    ) : (
                        <div className="text-gray-500 font-mono text-sm">Waiting for teacher...</div>
                    )}
                </AnimatePresence>

                {/* Teacher Avatar / Cursor Mock */}
                <motion.div 
                    animate={{ x: [0, 10, 0], y: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 4 }}
                    className="absolute bottom-4 right-4 flex items-center gap-2 opacity-50"
                >
                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs font-bold">师</div>
                    <span className="text-xs text-gray-400">正在讲解...</span>
                </motion.div>
            </div>
        );
    }

    // 2. CHINESE: Ink Scroll
    if (activeSubject === '语文') {
        const currentLine = data.content.poem?.lines.find((l, idx, arr) => {
            const next = arr[idx + 1];
            return currentTime >= l.time && (!next || currentTime < next.time);
        });

        return (
            <div className="absolute inset-0 bg-[#fdfbf7] flex flex-col items-center justify-center overflow-hidden">
                {/* Ink Background */}
                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/shattered-island.png')]"></div>
                
                {/* Animated Poem Line */}
                <AnimatePresence mode="wait">
                    {currentLine ? (
                        <motion.div 
                            key={currentLine.id}
                            initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
                            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
                            transition={{ duration: 0.8 }}
                            className="z-10 text-center px-8"
                        >
                            <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-4 font-serif leading-relaxed" style={{ textShadow: '2px 2px 0px rgba(0,0,0,0.05)' }}>
                                {currentLine.text}
                            </h2>
                            <p className="text-gray-500 font-serif italic text-sm md:text-base border-t border-gray-200 pt-4 inline-block px-4">
                                {currentLine.translation}
                            </p>
                        </motion.div>
                    ) : (
                         <div className="z-10 flex flex-col items-center">
                            <span className="text-2xl font-black text-gray-800 font-serif mb-2">{data.content.poem?.title}</span>
                            <span className="text-sm text-gray-500 font-serif bg-red-50 text-red-800 px-2 py-0.5 rounded border border-red-100">{data.content.poem?.dynasty} · {data.content.poem?.author}</span>
                         </div>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    // 3. ENGLISH: Immersive Dialogue Mode
    if (activeSubject === '英语') {
        const currentLine = data.content.dialogue?.find((l, idx, arr) => {
             const next = arr[idx + 1];
             return currentTime >= l.time && (!next || currentTime < next.time);
        });

        return (
            <div className="absolute inset-0 bg-gradient-to-br from-teal-900 via-[#0f2e2e] to-emerald-950 flex flex-col items-center justify-center overflow-hidden">
                 {/* Ambient Blobs */}
                 <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[80px] animate-pulse"></div>
                 <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-400/10 rounded-full blur-[60px]"></div>

                 {/* Center Stage Content */}
                 <AnimatePresence mode="wait">
                    {currentLine ? (
                        <motion.div 
                            key={currentLine.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            className="flex flex-col items-center z-10 px-8 w-full max-w-2xl text-center"
                        >
                            {/* Avatar with Ring */}
                            <div className="relative mb-8">
                                <motion.div 
                                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute inset-0 rounded-full border-2 border-emerald-400/30"
                                />
                                <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-emerald-400/50 flex items-center justify-center text-5xl shadow-[0_0_30px_rgba(52,211,153,0.2)]">
                                    {currentLine.avatar}
                                </div>
                                <div className="absolute -bottom-3 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-lg">
                                    {currentLine.speaker}
                                </div>
                            </div>

                            {/* Text */}
                            <h2 className="text-2xl md:text-3xl font-black text-white leading-relaxed mb-4 drop-shadow-md">
                                {currentLine.text}
                            </h2>
                            {currentLine.translation && (
                                <p className="text-emerald-200/60 font-medium text-lg">
                                    {currentLine.translation}
                                </p>
                            )}
                        </motion.div>
                    ) : (
                        <div className="z-10 text-white/30 text-center">
                            <Languages size={48} className="mx-auto mb-4 opacity-50" />
                            <p className="font-bold tracking-widest uppercase">Listening Section</p>
                        </div>
                    )}
                 </AnimatePresence>
            </div>
        );
    }
  };

  // B. Content Area (Below Video)
  const renderContentArea = () => {
    // 1. Math Content
    if (activeSubject === '数学') {
        if (activeTabId === 'board') {
            return (
                <div className="flex flex-col gap-4 p-4 md:p-6 pb-40">
                     {data.content.formulas?.map((formula, idx) => {
                         const isActive = currentTime >= formula.time && (!data.content.formulas![idx+1] || currentTime < data.content.formulas![idx+1].time);
                         return (
                            <button 
                                key={formula.id}
                                onClick={() => handleSeek(formula.time)}
                                className={`group flex items-start gap-4 p-4 rounded-2xl border-2 transition-all text-left ${isActive ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-transparent hover:border-gray-100 hover:bg-gray-50'}`}
                            >
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400 group-hover:bg-blue-100 group-hover:text-blue-500'}`}>
                                    {idx + 1}
                                </div>
                                <div className="flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className={`text-xs font-bold ${isActive ? 'text-blue-600' : 'text-gray-400'}`}>{formula.explanation}</span>
                                        <span className="text-[10px] bg-gray-100 text-gray-400 px-1.5 py-0.5 rounded font-mono group-hover:text-blue-500">{formatTime(formula.time)}</span>
                                    </div>
                                    <div className={`font-mono text-lg font-bold ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                                        {formula.latex}
                                    </div>
                                </div>
                                {formula.isKeyStep && (
                                    <div className="mt-1 text-amber-500">
                                        <PenTool size={16} />
                                    </div>
                                )}
                            </button>
                         )
                     })}
                </div>
            )
        } else {
            return (
                <div className="flex flex-col gap-4 p-4 md:p-6 pb-40">
                    {data.content.pitfalls?.map((pit, idx) => (
                        <div key={idx} className="bg-red-50 border border-red-100 rounded-2xl p-4 flex gap-4">
                            <div className="mt-1 text-red-500 shrink-0">
                                <AlertTriangle size={24} />
                            </div>
                            <div>
                                <h4 className="font-bold text-red-800 text-base mb-1">{pit.title}</h4>
                                <p className="text-red-700/80 text-sm leading-relaxed">{pit.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )
        }
    }

    // 2. Chinese Content
    if (activeSubject === '语文') {
        if (activeTabId === 'poem') {
            return (
                <div className="flex flex-col items-center py-8 pb-40 px-4 text-center">
                    <h1 className="text-2xl font-black text-gray-900 font-serif mb-2 tracking-widest">{data.content.poem?.title}</h1>
                    <div className="text-xs text-gray-400 font-bold mb-8 bg-gray-100 px-3 py-1 rounded-full">
                        [{data.content.poem?.dynasty}] {data.content.poem?.author}
                    </div>

                    <div className="flex flex-col gap-8 w-full max-w-md">
                        {data.content.poem?.lines.map((line) => {
                             const isActive = currentTime >= line.time && currentTime < (line.time + 10); // Simple duration logic
                             return (
                                <button 
                                    key={line.id}
                                    onClick={() => handleSeek(line.time)}
                                    className={`relative transition-all duration-500 p-4 rounded-xl ${isActive ? 'scale-110 bg-amber-50 shadow-sm' : 'hover:bg-gray-50 opacity-60 hover:opacity-100'}`}
                                >
                                    <p className={`text-xl md:text-2xl font-bold font-serif mb-2 ${isActive ? 'text-gray-900' : 'text-gray-600'}`}>
                                        {line.text}
                                    </p>
                                    {isActive && (
                                        <motion.p 
                                            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                                            className="text-amber-700 text-sm font-medium"
                                        >
                                            {line.translation}
                                        </motion.p>
                                    )}
                                    {line.notes && isActive && (
                                        <div className="flex flex-wrap justify-center gap-2 mt-3">
                                            {line.notes.map((n, i) => (
                                                <span key={i} className="text-[10px] bg-white border border-amber-200 text-amber-600 px-2 py-0.5 rounded shadow-sm">
                                                    {n}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </button>
                             )
                        })}
                    </div>
                </div>
            )
        }
        // Analysis Tab
        return (
            <div className="p-6 pb-40 flex flex-col gap-6">
                {data.content.appreciation?.map((sec, i) => (
                    <div key={i}>
                        <h3 className="font-bold text-gray-800 text-lg mb-2 flex items-center gap-2">
                            <span className="w-1 h-5 bg-red-400 rounded-full"></span>
                            {sec.title}
                        </h3>
                        <p className="text-gray-600 leading-loose text-justify text-sm">
                            {sec.content}
                        </p>
                    </div>
                ))}
            </div>
        )
    }

    // 3. ENGLISH: Chat Stream & Vocab Cards
    if (activeSubject === '英语') {
        if (activeTabId === 'script') {
            return (
                <div ref={scrollRef} className="flex flex-col gap-6 p-6 pb-40">
                     {data.content.dialogue?.map((line) => {
                         const isActive = currentTime >= line.time && currentTime < (line.time + 5); 
                         const isMe = line.role === 'B'; // Let's assume Role B is "Right Side"
                         
                         return (
                             <motion.div 
                                id={`msg-${line.id}`}
                                key={line.id} 
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                className={`flex gap-3 w-full ${isMe ? 'flex-row-reverse' : ''}`}
                             >
                                 {/* Avatar */}
                                 <div className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shrink-0 border shadow-sm mt-1 transition-all duration-300 ${isActive ? 'ring-2 ring-emerald-400 scale-110 bg-emerald-50 border-emerald-200' : 'bg-white border-gray-100 grayscale opacity-80'}`}>
                                     {line.avatar}
                                 </div>
                                 
                                 {/* Bubble */}
                                 <div className={`flex flex-col max-w-[80%] ${isMe ? 'items-end' : 'items-start'}`}>
                                     <button 
                                         onClick={() => handleSeek(line.time)}
                                         className={`px-5 py-4 text-left shadow-sm transition-all border group relative overflow-hidden ${
                                             isActive 
                                                 ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-200 shadow-md scale-[1.02]' 
                                                 : 'bg-white border-gray-100 hover:bg-gray-50 text-gray-700'
                                         } ${isMe ? 'rounded-2xl rounded-tr-sm' : 'rounded-2xl rounded-tl-sm'}`}
                                     >
                                         <div className="flex items-center justify-between gap-4 mb-1">
                                            <span className={`text-[10px] font-black uppercase tracking-wider ${isActive ? 'text-emerald-200' : 'text-gray-400'}`}>
                                                {line.speaker}
                                            </span>
                                            {isActive && <Volume2 size={12} className="text-white animate-pulse" />}
                                         </div>
                                         <p className={`font-bold text-base md:text-lg leading-relaxed ${isActive ? 'text-white' : 'text-gray-800'}`}>
                                             {line.text}
                                         </p>
                                         {line.translation && (
                                             <p className={`text-sm mt-2 pt-2 border-t border-dashed ${isActive ? 'border-white/20 text-emerald-100' : 'border-gray-100 text-gray-400'}`}>
                                                 {line.translation}
                                             </p>
                                         )}
                                     </button>
                                 </div>
                             </motion.div>
                         )
                     })}
                </div>
            )
        }
        // Vocab Tab - Flashcards Grid
        return (
            <div className="p-4 pb-40 grid grid-cols-1 sm:grid-cols-2 gap-4">
                 {data.content.vocab?.map((v, i) => (
                     <div key={i} className="group bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-emerald-200 transition-all cursor-pointer flex flex-col justify-between h-32 relative overflow-hidden">
                         <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
                                 <Volume2 size={16} />
                             </div>
                         </div>
                         <div>
                            <h4 className="font-black text-xl text-gray-800 group-hover:text-emerald-700 transition-colors">{v.word}</h4>
                            <span className="text-xs text-gray-400 font-mono font-bold mt-1 block">{v.phonetics}</span>
                         </div>
                         <div className="pt-3 border-t border-gray-50 mt-2">
                            <span className="text-sm text-gray-600 font-bold bg-gray-50 px-2 py-1 rounded group-hover:bg-emerald-50 group-hover:text-emerald-700 transition-colors">{v.meaning}</span>
                         </div>
                     </div>
                 ))}
            </div>
        )
    }
    
    return null;
  };


  return (
    <div className="w-full h-full flex flex-col lg:flex-row bg-black relative z-40">
        
        {/* === SECTION 1: VIDEO PLAYER === */}
        <div className="w-full lg:flex-[2] lg:h-full aspect-video lg:aspect-auto bg-black relative shrink-0 z-20 group flex flex-col justify-center">
             {/* Main Visual Content */}
             {renderPlayerVisual()}
             
             {/* Top Overlay: Back & Title */}
             <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start bg-gradient-to-b from-black/60 to-transparent opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 z-30 pointer-events-none">
                 <button onClick={onExit} className="pointer-events-auto p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md">
                     <ChevronLeft size={24} />
                 </button>
                 <div className="text-right">
                     <h2 className="text-white font-bold text-sm md:text-base shadow-sm">{data.title}</h2>
                     <span className="text-white/60 text-xs font-mono">{activeSubject}课堂</span>
                 </div>
             </div>

             {/* Bottom Overlay: Controls */}
             <div className="absolute bottom-0 left-0 right-0 px-4 pb-4 pt-12 bg-gradient-to-t from-black/80 to-transparent z-30 flex flex-col gap-3">
                 {/* Progress Bar */}
                 <div 
                    className="w-full h-1.5 bg-white/20 rounded-full cursor-pointer relative group/progress"
                    onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const x = e.clientX - rect.left;
                        const newTime = (x / rect.width) * data.duration;
                        handleSeek(newTime);
                    }}
                 >
                     <div 
                        className={`h-full rounded-full relative ${activeSubject === '语文' ? 'bg-amber-500' : activeSubject === '英语' ? 'bg-emerald-500' : 'bg-blue-500'}`} 
                        style={{ width: `${progress}%` }}
                     >
                         <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-md scale-0 group-hover/progress:scale-100 transition-transform"></div>
                     </div>
                 </div>

                 <div className="flex justify-between items-center text-white">
                     <div className="flex items-center gap-4">
                         <button onClick={() => setIsPlaying(!isPlaying)} className="hover:text-gray-300 transition-colors">
                             {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                         </button>
                         <div className="text-xs font-mono font-bold space-x-1">
                             <span>{formatTime(currentTime)}</span>
                             <span className="opacity-50">/</span>
                             <span className="opacity-50">{formatTime(data.duration)}</span>
                         </div>
                     </div>
                     <div className="flex items-center gap-4">
                         <button 
                            onClick={() => setPlaybackSpeed(s => s === 1 ? 1.5 : s === 1.5 ? 2 : 1)}
                            className="text-xs font-bold border border-white/30 rounded px-1.5 py-0.5 hover:bg-white/10"
                         >
                             {playbackSpeed}x
                         </button>
                         <Maximize size={20} className="opacity-70 hover:opacity-100 cursor-pointer" />
                     </div>
                 </div>
             </div>
        </div>

        {/* === SECTION 2: SMART CONTENT PANEL === */}
        <div className="flex-1 flex flex-col min-h-0 bg-white relative lg:rounded-l-[32px] overflow-hidden z-30">
            {/* Tabs Header */}
            <div className="flex items-center px-4 py-3 gap-2 border-b border-gray-100 bg-white shadow-sm z-10 shrink-0">
                {data.tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTabId(tab.id)}
                        className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all relative overflow-hidden ${
                            activeTabId === tab.id 
                                ? 'bg-gray-900 text-white shadow-md' 
                                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                        }`}
                    >
                        {tab.label}
                        {activeTabId === tab.id && (
                            <motion.div 
                                layoutId="activeTabGlow"
                                className="absolute inset-0 bg-white/10"
                            />
                        )}
                    </button>
                ))}
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto scroll-smooth">
                {renderContentArea()}
            </div>

            {/* Floating "Go to Quiz" Action - Persistent at Bottom */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30">
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onComplete}
                    className={`flex items-center gap-2 pl-6 pr-5 py-3 rounded-full text-white font-black shadow-lg transition-all ${
                        activeSubject === '语文' ? 'bg-amber-600 shadow-amber-200' :
                        activeSubject === '英语' ? 'bg-emerald-600 shadow-emerald-200' :
                        'bg-blue-600 shadow-blue-200'
                    }`}
                >
                    <span>随堂测验</span>
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <ChevronRight size={16} />
                    </div>
                </motion.button>
            </div>
        </div>
    </div>
  );
};
