import React from 'react';
import { motion } from 'framer-motion';
import { Bot, ArrowRight, X } from 'lucide-react';

interface AssessmentStartProps {
  onStart: () => void;
  onExit: () => void;
  userName?: string;
}

export const AssessmentStart: React.FC<AssessmentStartProps> = ({ onStart, onExit, userName = '李华' }) => {
  return (
    <div className="w-full h-full relative bg-gray-900 flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand/30 rounded-full blur-[100px] animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-[80px]"></div>
          
          {/* Grid lines */}
          <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)', backgroundSize: '50px 50px' }}></div>
      </div>

      {/* Exit Button */}
      <button 
        onClick={onExit}
        className="absolute top-8 right-8 z-50 text-white/50 hover:text-white transition-colors bg-white/10 p-2 rounded-full backdrop-blur-sm"
      >
        <X size={24} />
      </button>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-8 max-w-lg">
        
        {/* Breathing AI Orb */}
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-12 relative"
        >
            <motion.div 
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute inset-0 bg-brand rounded-full blur-3xl"
            ></motion.div>
            
            <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="w-48 h-48 bg-gradient-to-b from-brand to-brand-dark rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(108,93,211,0.6)] relative z-20 border-4 border-white/10"
            >
                 {/* Face */}
                 <Bot size={100} className="text-white drop-shadow-xl" />
                 {/* Glowing Eyes */}
                 <div className="absolute top-[38%] left-[28%] w-3 h-3 bg-cyan-300 rounded-full shadow-[0_0_10px_#67e8f9] animate-pulse"></div>
                 <div className="absolute top-[38%] right-[28%] w-3 h-3 bg-cyan-300 rounded-full shadow-[0_0_10px_#67e8f9] animate-pulse"></div>
            </motion.div>

            {/* Orbiting Elements */}
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                className="absolute inset-[-20px] rounded-full border border-white/20 border-dashed"
            ></motion.div>
        </motion.div>

        {/* Text */}
        <motion.div
             initial={{ y: 20, opacity: 0 }}
             animate={{ y: 0, opacity: 1 }}
             transition={{ delay: 0.3 }}
             className="flex flex-col gap-4 mb-16"
        >
            <h1 className="text-3xl font-extrabold text-white leading-tight">
                你好，{userName}！<br/>
                我是你的专属 AI 伙伴。
            </h1>
            <p className="text-gray-300 text-lg leading-relaxed font-medium">
                为了能更好地帮助你学习，<br/>我需要了解你的“<span className="text-accent font-bold">超能力</span>”属性。
            </p>
        </motion.div>

        {/* Action Button */}
        <motion.button
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onStart}
            className="w-full bg-accent hover:bg-yellow-300 text-brand-dark font-black text-xl py-5 rounded-[24px] shadow-[0_10px_30px_rgba(255,206,81,0.3)] flex items-center justify-center gap-3 group relative overflow-hidden"
        >
            <span className="relative z-10">开始测评</span>
            <ArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform" strokeWidth={3} />
            
            {/* Shine effect */}
            <div className="absolute top-0 -left-full w-full h-full bg-white/30 skew-x-[-20deg] group-hover:animate-[shine_1s_ease-in-out]"></div>
        </motion.button>
        
        {/* Helper text */}
        <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 1 }}
            className="mt-6 text-white/30 text-xs font-bold"
        >
            预计耗时 3 分钟 · AI 实时分析
        </motion.p>
      </div>

    </div>
  );
};