import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, Send, Mic, PhoneCall, Sparkles, Shirt, X, MoreHorizontal, Plus, Clock, Settings, Zap } from 'lucide-react';
import { LumiCallOverlay } from './LumiCallOverlay';

// Mock Chat Data
const MOCK_CHAT_HISTORY = [
    { id: '1', sender: 'lumi', type: 'text', content: '嗨！今天过得怎么样？', time: '18:30' },
    { id: '2', sender: 'user', type: 'text', content: '还可以，就是数学作业有点难。', time: '18:31' },
    { id: '3', sender: 'lumi', type: 'text', content: '别担心，哪部分卡住了？是一元一次方程吗？', time: '18:31' },
    { id: '4', sender: 'lumi', type: 'card', content: 'Review: Equation Basics', time: '18:31', meta: { title: '复习：移项变号口诀', action: '查看卡片' } },
];

const GREETINGS = [
    "系统就绪。今天想探索什么知识？⚡️",
    "监测到思维活跃度提升。随时待命。🚀",
    "嘿，我是 Lumi。你的专属 AI 领航员。🌌",
    "数据同步完成。准备好解决难题了吗？🧠"
];

const QUICK_CHIPS = ['🎯 制定今日计划', '😭 我好累求安慰', '📖 考前复习', '🎲 玩个成语接龙'];

export const LumiSpace: React.FC = () => {
    // --- State ---
    const [messages, setMessages] = useState(MOCK_CHAT_HISTORY);
    const [inputValue, setInputValue] = useState('');
    const [isWardrobeOpen, setIsWardrobeOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCalling, setIsCalling] = useState(false);
    const [isCallMinimized, setIsCallMinimized] = useState(false);
    const [greeting, setGreeting] = useState("");
    
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // --- Effects ---
    useEffect(() => {
        let i = 0;
        setGreeting("");
        const randomGreeting = GREETINGS[Math.floor(Math.random() * GREETINGS.length)];
        
        const timer = setInterval(() => {
            if (i < randomGreeting.length) {
                setGreeting(prev => randomGreeting.substring(0, i + 1));
                i++;
            } else {
                clearInterval(timer);
            }
        }, 50);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // --- Handlers ---
    const handleSend = () => {
        if (!inputValue.trim()) return;
        const newMsg = { id: Date.now().toString(), sender: 'user', type: 'text', content: inputValue, time: 'Now' };
        setMessages(prev => [...prev, newMsg]);
        setInputValue('');

        const textarea = document.getElementById('chat-input') as HTMLTextAreaElement;
        if(textarea) {
            textarea.style.height = 'auto';
        }

        setTimeout(() => {
            setMessages(prev => [...prev, { 
                id: (Date.now()+1).toString(), 
                sender: 'lumi', 
                type: 'text', 
                content: '收到指令。正在分析解题路径...', 
                time: 'Now' 
            }]);
        }, 1000);
    };

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInputValue(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
    };

    const handleNewChat = () => {
        setMessages([]);
        setGreeting("新会话已建立。");
        setIsMenuOpen(false);
    };

    return (
        <div className="w-full h-full flex flex-col lg:flex-row bg-[#F5F7FA] relative overflow-hidden">
            
            {/* === LEFT PANEL: LUMI HOLOGRAPHIC CORE === */}
            {/* Dark Card containing the avatar */}
            <div className="shrink-0 w-full lg:w-[420px] h-[40vh] lg:h-full p-4 lg:p-6 lg:pr-2 flex flex-col z-10">
                <div className="w-full h-full bg-[#1A1D26] rounded-[36px] relative overflow-hidden shadow-[0_20px_40px_-10px_rgba(0,0,0,0.15)] flex flex-col items-center justify-center border border-white/5">
                    
                    {/* Background Tech Grid */}
                    <div className="absolute inset-0 opacity-20 pointer-events-none" style={{backgroundImage: 'linear-gradient(rgba(108, 93, 211, 0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(108, 93, 211, 0.3) 1px, transparent 1px)', backgroundSize: '30px 30px'}}></div>
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#1A1D26] pointer-events-none"></div>

                    {/* Wardrobe Button (Top Left) */}
                    <button 
                        onClick={() => setIsWardrobeOpen(true)}
                        className="absolute top-6 left-6 z-20 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/90 hover:text-white transition-all backdrop-blur-md border border-white/10 shadow-sm"
                    >
                        <Shirt size={20} />
                    </button>
                    
                    {/* Context Bubble */}
                    <div className="relative z-10 mb-8 px-6 text-center w-full max-w-xs">
                        <motion.div 
                            key={greeting}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-brand/10 border border-brand/20 backdrop-blur-md px-4 py-3 rounded-2xl inline-block shadow-[0_0_20px_rgba(108,93,211,0.2)]"
                        >
                            <p className="text-cyan-300 text-xs md:text-sm font-mono font-bold leading-relaxed">{greeting}</p>
                        </motion.div>
                    </div>

                    {/* Hologram Core */}
                    <div className="relative w-48 h-48 flex items-center justify-center group cursor-pointer" onClick={() => setGreeting("系统自检正常，核心温度稳定。")}>
                        {/* Rings */}
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 10, ease: "linear" }} className="absolute inset-0 rounded-full border border-cyan-500/20 border-dashed"></motion.div>
                        <motion.div animate={{ rotate: -360 }} transition={{ repeat: Infinity, duration: 15, ease: "linear" }} className="absolute inset-4 rounded-full border border-brand/30 border-t-transparent"></motion.div>
                        
                        {/* Core Sphere */}
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-brand to-cyan-500 shadow-[0_0_60px_rgba(34,211,238,0.5)] flex items-center justify-center relative z-10 group-active:scale-95 transition-transform">
                            <Bot size={40} className="text-white drop-shadow-md" strokeWidth={1.5} />
                            {/* Inner Particles */}
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-50 animate-spin-slow mix-blend-overlay"></div>
                        </div>
                    </div>

                    {/* Status Text */}
                    <div className="absolute bottom-6 flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_#22c55e]"></div>
                        <span className="text-white/30 text-[10px] font-mono tracking-[0.2em] font-bold">LUMI_CORE_ONLINE</span>
                    </div>

                </div>
            </div>

            {/* === RIGHT PANEL: CHAT STREAM === */}
            <div className="flex-1 flex flex-col h-full relative overflow-hidden">
                 {/* Header */}
                 <div className="h-16 px-6 flex justify-between items-center bg-[#F5F7FA] shrink-0">
                     <div className="flex items-center gap-2">
                         <Sparkles size={16} className="text-brand" />
                         <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Neural Link</span>
                     </div>
                     
                     <div className="relative">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 hover:bg-white rounded-full text-gray-400 transition-colors">
                            <MoreHorizontal size={20} />
                        </button>
                        {/* Menu Dropdown */}
                        <AnimatePresence>
                            {isMenuOpen && (
                                <>
                                <div className="fixed inset-0 z-30" onClick={() => setIsMenuOpen(false)}></div>
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-xl border border-gray-100 z-40 overflow-hidden"
                                >
                                    <button onClick={handleNewChat} className="w-full text-left px-4 py-3 hover:bg-gray-50 text-xs font-bold text-gray-700 flex items-center gap-2">
                                        <Plus size={14} /> 新对话
                                    </button>
                                    <button className="w-full text-left px-4 py-3 hover:bg-gray-50 text-xs font-bold text-gray-700 flex items-center gap-2">
                                        <Clock size={14} /> 历史记录
                                    </button>
                                    <div className="h-px bg-gray-100 mx-2"></div>
                                    <button className="w-full text-left px-4 py-3 hover:bg-gray-50 text-xs font-bold text-gray-700 flex items-center gap-2">
                                        <Settings size={14} /> 设置
                                    </button>
                                </motion.div>
                                </>
                            )}
                        </AnimatePresence>
                     </div>
                 </div>

                 {/* Messages List - Huge Bottom Padding to clear the floating input */}
                 <div className="flex-1 overflow-y-auto px-4 lg:px-6 pb-60 space-y-6">
                      {messages.map((msg) => {
                         const isMe = msg.sender === 'user';
                         return (
                             <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                                 {!isMe && (
                                     <div className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-brand shrink-0 mt-1 shadow-sm">
                                         <Bot size={16} />
                                     </div>
                                 )}
                                 <div className={`flex flex-col gap-1 max-w-[85%] ${isMe ? 'items-end' : 'items-start'}`}>
                                     <div className={`px-5 py-3 rounded-2xl text-sm lg:text-base leading-relaxed shadow-sm ${
                                         isMe 
                                             ? 'bg-brand text-white rounded-tr-sm' 
                                             : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm'
                                     }`}>
                                         {msg.type === 'text' ? msg.content : (
                                             <div className="flex flex-col gap-2">
                                                 <div className="flex items-center gap-2 font-bold text-brand-dark">
                                                     <Zap size={14} />
                                                     {msg.meta?.title}
                                                 </div>
                                                 <div className="h-px bg-current opacity-10"></div>
                                                 <button className="text-xs bg-white/50 hover:bg-white rounded px-2 py-1 transition-colors self-start text-brand-dark font-bold">
                                                     {msg.meta?.action}
                                                 </button>
                                             </div>
                                         )}
                                     </div>
                                     <span className="text-[10px] text-gray-400 font-bold px-1 opacity-60">
                                         {msg.time}
                                     </span>
                                 </div>
                             </div>
                         )
                     })}
                     <div ref={messagesEndRef} />
                 </div>

                 {/* 
                    Input Area - Absolute Floating 
                    Positioned ~85px from bottom to sit above BottomNav (h-14 + padding)
                 */}
                 <div className="absolute bottom-[90px] left-0 right-0 px-4 lg:px-6 z-40 flex flex-col gap-3 pointer-events-none">
                     
                     {/* Quick Chips - Floating Bubbles */}
                     <div className="flex gap-2 overflow-x-auto no-scrollbar px-1 pointer-events-auto justify-end md:justify-start">
                         {QUICK_CHIPS.map(chip => (
                             <button 
                                 key={chip} 
                                 onClick={() => { setInputValue(chip); }}
                                 className="px-4 py-2 bg-white/90 backdrop-blur-sm border border-white/50 rounded-2xl text-xs font-bold text-brand-dark shadow-lg shadow-brand/5 hover:bg-white hover:scale-105 transition-all active:scale-95 whitespace-nowrap"
                             >
                                 {chip}
                             </button>
                         ))}
                     </div>

                     {/* Main Input Bar */}
                     <div className="flex items-end gap-3 pointer-events-auto">
                         <div className="flex-1 bg-white/90 backdrop-blur-xl p-1.5 pl-4 rounded-[32px] shadow-[0_8px_40px_-10px_rgba(0,0,0,0.15)] border border-white flex items-end gap-2 focus-within:ring-2 focus-within:ring-brand/20 transition-all">
                             <textarea 
                                id="chat-input"
                                className="flex-1 bg-transparent border-none outline-none text-gray-700 py-3.5 min-h-[48px] max-h-32 resize-none text-sm font-bold placeholder:text-gray-400"
                                placeholder="输入消息..."
                                rows={1}
                                value={inputValue}
                                onChange={handleInput}
                                onKeyDown={(e) => {
                                    if(e.key === 'Enter' && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSend();
                                    }
                                }}
                             />
                             {inputValue.trim() ? (
                                <button onClick={handleSend} className="p-3 bg-brand text-white rounded-full shadow-lg shadow-brand/20 hover:bg-brand-dark transition-colors mb-0.5">
                                    <Send size={18} className="ml-0.5" />
                                </button>
                             ) : (
                                <button className="p-3 text-gray-400 hover:bg-gray-100 rounded-full transition-colors mb-0.5">
                                    <Mic size={20} />
                                </button>
                             )}
                         </div>
                         
                         <button 
                            onClick={() => setIsCalling(true)}
                            className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white shadow-[0_8px_20px_-5px_rgba(34,197,94,0.4)] hover:scale-105 transition-all shrink-0 border-2 border-white"
                         >
                            <PhoneCall size={24} fill="currentColor" />
                         </button>
                     </div>
                 </div>
            </div>
            
            {/* === OVERLAYS === */}
            
            {/* Wardrobe Modal */}
            <AnimatePresence>
                {isWardrobeOpen && (
                    <>
                        <motion.div 
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                            onClick={() => setIsWardrobeOpen(false)}
                        />
                        <motion.div 
                            initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="absolute top-0 bottom-0 left-0 w-80 bg-gray-900 border-r border-white/10 z-[70] shadow-2xl flex flex-col overflow-hidden"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-gray-800/50">
                                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                                    <Shirt size={20} className="text-brand" /> 
                                    <span>外观核心</span>
                                </h3>
                                <button onClick={() => setIsWardrobeOpen(false)} className="p-2 bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-6 grid grid-cols-2 gap-4">
                                {['🌀', '🔷', '🟣', '🔥', '💎', '🌈', '⚙️', '🌌'].map((item, i) => (
                                    <div key={i} className="aspect-square bg-gray-800 rounded-2xl flex items-center justify-center text-4xl border-2 border-transparent hover:border-brand hover:shadow-[0_0_15px_rgba(108,93,211,0.5)] cursor-pointer transition-all">
                                        {item}
                                    </div>
                                ))}
                            </div>
                            <div className="p-4 bg-gray-800 border-t border-white/10">
                                <button className="w-full py-3 rounded-xl bg-brand text-white font-bold text-sm hover:bg-brand-light transition-colors shadow-lg shadow-brand/20">
                                    解锁更多皮肤
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Call Overlay */}
            {isCalling && (
                <LumiCallOverlay 
                    onEndCall={() => setIsCalling(false)} 
                    isMinimized={isCallMinimized}
                    onToggleMinimize={() => setIsCallMinimized(!isCallMinimized)}
                />
            )}

        </div>
    );
};