
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneOff, Mic, MicOff, Volume2, Maximize2, Minimize2, Bot } from 'lucide-react';

interface LumiCallOverlayProps {
    onEndCall: () => void;
    isMinimized?: boolean;
    onToggleMinimize?: () => void;
}

export const LumiCallOverlay: React.FC<LumiCallOverlayProps> = ({ onEndCall, isMinimized, onToggleMinimize }) => {
    const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
    const [isMuted, setIsMuted] = useState(false);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        setPortalTarget(document.getElementById('modal-root'));
        
        const timer = setInterval(() => setDuration(d => d + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    if (!portalTarget) return null;

    return createPortal(
        <AnimatePresence>
            {!isMinimized && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 z-[90] bg-gray-900/90 backdrop-blur-2xl flex flex-col pointer-events-auto overflow-hidden"
                >
                    {/* Background Ambient Lights */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand/20 rounded-full blur-[100px] animate-pulse"></div>
                        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[80px]"></div>
                    </div>

                    {/* Top Controls */}
                    <div className="relative z-10 flex justify-between items-center px-6 py-12 lg:py-6">
                        <button onClick={onToggleMinimize} className="p-3 bg-white/10 rounded-full text-white/70 hover:bg-white/20 transition-colors">
                            <Minimize2 size={24} />
                        </button>
                        <div className="flex flex-col items-center">
                            <span className="text-white/60 text-xs font-bold tracking-widest uppercase">Lumi 连线中</span>
                            <span className="text-white font-mono font-bold">{formatTime(duration)}</span>
                        </div>
                        <div className="w-12"></div> {/* Spacer */}
                    </div>

                    {/* Main Stage: Avatar & Visualizer */}
                    <div className="flex-1 relative flex flex-col items-center justify-center z-10">
                        
                        {/* Avatar */}
                        <div className="relative w-48 h-48 lg:w-64 lg:h-64 mb-12">
                            {/* Pulse Rings */}
                            <motion.div 
                                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0, 0.3] }}
                                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                                className="absolute inset-0 rounded-full border border-brand/50"
                            />
                            <motion.div 
                                animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0, 0.1] }}
                                transition={{ repeat: Infinity, duration: 2, delay: 0.5, ease: "easeInOut" }}
                                className="absolute inset-0 rounded-full border border-brand/30"
                            />

                            {/* Core Avatar */}
                            <div className="relative w-full h-full bg-gradient-to-b from-brand to-brand-dark rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(108,93,211,0.5)] border-4 border-white/10">
                                <Bot size={100} className="text-white drop-shadow-2xl" strokeWidth={1.5} />
                                {/* Speaking Indicator Eyes */}
                                <motion.div 
                                    animate={{ height: [12, 4, 12] }}
                                    transition={{ repeat: Infinity, duration: 0.2, repeatDelay: 3 }}
                                    className="absolute top-[38%] left-[28%] w-3 bg-cyan-300 rounded-full shadow-[0_0_15px_#67e8f9]"
                                />
                                <motion.div 
                                    animate={{ height: [12, 4, 12] }}
                                    transition={{ repeat: Infinity, duration: 0.2, repeatDelay: 3 }}
                                    className="absolute top-[38%] right-[28%] w-3 bg-cyan-300 rounded-full shadow-[0_0_15px_#67e8f9]"
                                />
                            </div>
                        </div>

                        {/* Audio Waveform (Simulated) */}
                        <div className="h-16 flex items-center justify-center gap-1.5 w-full max-w-xs">
                             {[...Array(12)].map((_, i) => (
                                 <motion.div
                                    key={i}
                                    animate={{ height: [10, Math.random() * 40 + 10, 10] }}
                                    transition={{ repeat: Infinity, duration: 0.5 + Math.random() * 0.5, ease: "easeInOut" }}
                                    className="w-2 bg-white/40 rounded-full"
                                 />
                             ))}
                        </div>

                        {/* Live Transcriptions (Mock) */}
                        <div className="mt-8 text-center px-8 h-12">
                            <motion.p 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={Math.floor(duration / 5)} // Mock changing text
                                className="text-white/80 font-medium text-lg lg:text-xl"
                            >
                                "{duration % 10 < 5 ? "这道题其实有个小陷阱..." : "你能试着画个辅助线吗？"}"
                            </motion.p>
                        </div>
                    </div>

                    {/* Bottom Controls */}
                    <div className="relative z-10 px-8 pb-12 pt-8 flex items-center justify-center gap-8 lg:gap-12">
                        <button 
                            onClick={() => setIsMuted(!isMuted)}
                            className={`p-4 rounded-full transition-all ${isMuted ? 'bg-white text-gray-900' : 'bg-white/10 text-white hover:bg-white/20'}`}
                        >
                            {isMuted ? <MicOff size={28} /> : <Mic size={28} />}
                        </button>
                        
                        <button 
                            onClick={onEndCall}
                            className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-500/40 hover:bg-red-600 active:scale-95 transition-all"
                        >
                            <PhoneOff size={36} fill="currentColor" />
                        </button>

                        <button className="p-4 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors">
                            <Volume2 size={28} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>,
        portalTarget
    );
};
