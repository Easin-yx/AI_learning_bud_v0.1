
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, RotateCcw, Unlock, User, BookOpen, X } from 'lucide-react';
import { SubjectType } from '../../types';

interface DemoControlsProps {
    onReset: () => void;
    onUnlockAll: () => void;
    onSwitchPersona: (type: 'high' | 'low') => void;
    onForceSubject: (subject: SubjectType) => void;
}

export const DemoControls: React.FC<DemoControlsProps> = ({ onReset, onUnlockAll, onSwitchPersona, onForceSubject }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed bottom-4 right-4 z-[9999] pointer-events-auto font-sans">
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="absolute bottom-14 right-0 bg-gray-900/90 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl w-64 flex flex-col gap-4"
                    >
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                            <h3 className="text-white text-xs font-bold uppercase tracking-wider">调研控制台</h3>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white"><X size={16} /></button>
                        </div>

                        {/* Actions */}
                        <div className="space-y-2">
                            <div className="text-[10px] text-gray-500 font-bold uppercase">状态重置</div>
                            <button onClick={onReset} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs transition-colors">
                                <RotateCcw size={14} className="text-red-400" /> 重置今日任务 (First Run)
                            </button>
                            <button onClick={onUnlockAll} className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-xs transition-colors">
                                <Unlock size={14} className="text-green-400" /> 解锁所有地图关卡
                            </button>
                        </div>

                        <div className="space-y-2">
                            <div className="text-[10px] text-gray-500 font-bold uppercase">用户画像模拟</div>
                            <div className="flex gap-2">
                                <button onClick={() => onSwitchPersona('high')} className="flex-1 px-3 py-2 rounded-lg bg-blue-500/20 text-blue-300 text-xs hover:bg-blue-500/30">
                                    学霸模式
                                </button>
                                <button onClick={() => onSwitchPersona('low')} className="flex-1 px-3 py-2 rounded-lg bg-orange-500/20 text-orange-300 text-xs hover:bg-orange-500/30">
                                    后进模式
                                </button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="text-[10px] text-gray-500 font-bold uppercase">强制跳转学科</div>
                            <div className="grid grid-cols-3 gap-2">
                                {['数学', '语文', '英语'].map(s => (
                                    <button key={s} onClick={() => onForceSubject(s as SubjectType)} className="px-2 py-2 rounded-lg bg-gray-800 text-gray-300 text-xs hover:bg-gray-700">
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>

                    </motion.div>
                )}
            </AnimatePresence>

            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all ${isOpen ? 'bg-brand text-white' : 'bg-gray-800/50 text-white/30 hover:bg-gray-800 hover:text-white'}`}
            >
                <Settings size={20} />
            </button>
        </div>
    );
};
