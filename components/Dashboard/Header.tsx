
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronDown } from 'lucide-react';
import { MoodOption } from '../../types';

const MOODS: MoodOption[] = [
  { value: 'happy', label: '开心', icon: '🤩', color: 'bg-yellow-400' },
  { value: 'calm', label: '平静', icon: '😌', color: 'bg-blue-300' },
  { value: 'tired', label: '疲惫', icon: '😴', color: 'bg-indigo-300' },
  { value: 'stressed', label: '压力', icon: '🤯', color: 'bg-red-400' },
];

export const Header: React.FC = () => {
  const [isMoodOpen, setIsMoodOpen] = useState(false);
  const [currentMood, setCurrentMood] = useState<MoodOption>(MOODS[0]);

  return (
    <div className="px-8 pt-20 pb-6 text-white w-full relative z-0">
      <div className="flex flex-col gap-1">
        
        {/* Row 1: Greeting + Mood Badge */}
        <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold leading-tight tracking-tight">
                你好, 李华!
            </h1>
            
            {/* Mood Selector - Inline Badge Style */}
            <div className="relative">
                <button 
                    onClick={() => setIsMoodOpen(!isMoodOpen)}
                    className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full pl-1.5 pr-2.5 py-1 transition-colors active:scale-95"
                >
                    <span className="text-lg leading-none">{currentMood.icon}</span>
                    <ChevronDown size={12} className="text-white/60" />
                </button>

                {/* Dropdown */}
                <AnimatePresence>
                    {isMoodOpen && (
                        <>
                            <div className="fixed inset-0 z-30" onClick={() => setIsMoodOpen(false)}></div>
                            <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.9 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.9 }}
                                className="absolute top-full left-0 mt-2 bg-white rounded-2xl p-2 shadow-xl z-40 flex gap-1 min-w-max"
                            >
                                {MOODS.map((mood) => (
                                    <button
                                        key={mood.value}
                                        onClick={() => {
                                            setCurrentMood(mood);
                                            setIsMoodOpen(false);
                                        }}
                                        className={`w-9 h-9 rounded-xl flex items-center justify-center text-xl hover:scale-110 transition-transform ${currentMood.value === mood.value ? 'bg-gray-100 ring-2 ring-brand/20' : 'hover:bg-gray-50'}`}
                                    >
                                        {mood.icon}
                                    </button>
                                ))}
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        </div>

        {/* Row 2: Subtitle */}
        <span className="text-white/60 text-lg font-medium">
            准备好开启今天的探索了吗？
        </span>

      </div>
    </div>
  );
};
