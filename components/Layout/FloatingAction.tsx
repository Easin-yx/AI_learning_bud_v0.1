
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useDragControls, useAnimation } from 'framer-motion';
import { Bot, X, Camera, Send, Mic, ImagePlus } from 'lucide-react';

interface FloatingActionProps {
    currentContext?: 'dashboard' | 'subject' | 'mistake' | 'growth' | 'learning' | 'assessment' | 'quiz';
    containerRef?: React.RefObject<HTMLDivElement>;
    position?: 'left' | 'right';
    customBubbleMessage?: string;
}

const CONTEXT_MESSAGES = {
    dashboard: "今天有 3 个数学任务，先搞定最难的？",
    subject: "卡在 Level 3 了？这关考的是‘移项变号’哦。",
    mistake: "这道几何题你错 3 次了，我们彻底消灭它？",
    growth: "还差 50 XP 升级，去刷两道口算题？",
    learning: "这里是重点！要不要我帮你总结一下？",
    assessment: "别紧张，相信你的第一直觉！",
    quiz: "这道题有点难度，需要提示吗？",
    default: "我是 Lumi，随时准备帮助你！"
};

const CHAT_OPENERS = {
    dashboard: "我们可以先从‘一元一次方程’开始，需要我帮你回顾一下公式吗？",
    subject: "移项变号有个口诀：‘移项要变号，不动符号照’。想看图解吗？",
    mistake: "来，我们一步步分析。首先，你觉得这道题的陷阱在哪里？",
    growth: "好的！我为你准备了 5 道速算题，计时开始！",
    learning: "没问题，这段视频的核心知识点有三个...",
    assessment: "加油！",
    quiz: "没问题，让我们来分析一下这道题。你觉得关键条件是什么？",
    default: "嗨！无论是数学难题还是作文灵感，随时叫我哦！⚡️"
};

export const FloatingAction: React.FC<FloatingActionProps> = ({ 
    currentContext = 'default', 
    containerRef,
    position = 'right', 
    customBubbleMessage
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleMessage, setBubbleMessage] = useState(CONTEXT_MESSAGES['default']);
  const [initialChat, setInitialChat] = useState("");
  
  // Interaction State
  const [isRightSide, setIsRightSide] = useState(true);
  
  // Dragging Logic
  const controls = useDragControls();
  const animationControls = useAnimation();
  const orbRef = useRef<HTMLDivElement>(null);

  // Context Awareness Effect
  useEffect(() => {
    // Reset
    setShowBubble(false);
    
    const contextKey = currentContext || 'default';
    setBubbleMessage(customBubbleMessage || CONTEXT_MESSAGES[contextKey] || CONTEXT_MESSAGES['default']);

    const timer = setTimeout(() => {
        if (!isExpanded) {
            setShowBubble(true);
        }
    }, 1500);

    return () => clearTimeout(timer);
  }, [currentContext, isExpanded, customBubbleMessage]);

  const handleOpenChat = () => {
      const contextKey = currentContext || 'default';
      setInitialChat(CHAT_OPENERS[contextKey] || CHAT_OPENERS['default']);
      setShowBubble(false);
      setIsExpanded(true);
  };

  const shouldHighlightCapture = currentContext === 'mistake';

  // --- UPDATED: Snap to Side Logic ---
  const handleDragEnd = (event: any, info: any) => {
      if (!containerRef?.current || !orbRef.current) return;

      const parentRect = containerRef.current.getBoundingClientRect();
      const orbRect = orbRef.current.getBoundingClientRect();
      
      const orbCenterX = orbRect.left + orbRect.width / 2;
      const parentCenterX = parentRect.left + parentRect.width / 2;
      
      // Determine if we are closer to the right or left
      const isCloserToRight = orbCenterX > parentCenterX;
      setIsRightSide(isCloserToRight);

      // Snap Calculations
      // Initial Position is `right: 24px` (bottom-right).
      // x=0 means "Stay at Initial Right Position".
      // We only animate X to snap. We leave Y alone so user can adjust vertical height.
      
      let targetX = 0; // Default: Snap to Right (Original Position)

      if (!isCloserToRight) {
          // Snap to Left
          // Calculate distance to move from Right Initial to Left Edge
          // Formula: - (ParentWidth - PaddingLeft - PaddingRight - OrbWidth)
          // Padding = 24px (1.5rem)
          const travelDistance = parentRect.width - 48 - orbRect.width;
          targetX = -travelDistance;
      }

      animationControls.start({ 
          x: targetX,
          // IMPORTANT: Do not animate Y. Let it stay where user dropped it.
          transition: { type: "spring", stiffness: 400, damping: 30 } 
      });
  };

  // Base positioning: Bottom Right. Dragging moves it relative to this.
  const positioningClass = 'bottom-[120px] right-6'; 
  
  // Dynamic Bubble Styling based on side
  const bubblePositionClass = isRightSide 
     ? 'mr-2 text-right rounded-br-sm rounded-bl-2xl rounded-tl-2xl rounded-tr-2xl origin-bottom-right'
     : 'ml-2 text-left rounded-bl-sm rounded-br-2xl rounded-tl-2xl rounded-tr-2xl origin-bottom-left';

  return (
    <>
      {/* Backdrop for Expanded State */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
            className="absolute inset-0 bg-gray-900/20 backdrop-blur-[2px] z-50"
          />
        )}
      </AnimatePresence>

      {/* Expanded Bottom Sheet */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ y: '120%', opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: '120%', opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="absolute bottom-28 left-4 right-4 z-50 bg-white/80 backdrop-blur-xl border border-white/60 rounded-[32px] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.15)] flex flex-col gap-6 ring-1 ring-white/50"
          >
            {/* AI Greeting Header */}
            <div className="flex items-start gap-4">
               <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-brand to-accent flex items-center justify-center shrink-0 shadow-lg border-2 border-white">
                  <div className="relative w-6 h-6">
                      <Bot size={24} className="text-white" />
                      <div className="absolute top-[30%] left-[22%] w-[10%] h-[10%] bg-cyan-300 rounded-full animate-pulse"></div>
                      <div className="absolute top-[30%] right-[22%] w-[10%] h-[10%] bg-cyan-300 rounded-full animate-pulse"></div>
                  </div>
               </div>
               <div className="flex-1 bg-white/60 p-4 rounded-2xl rounded-tl-none shadow-sm border border-white/50">
                  <p className="text-gray-800 text-sm font-bold leading-relaxed">
                    {initialChat}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                      {currentContext === 'dashboard' && (
                          <button className="bg-brand/10 text-brand px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-brand/20 transition-colors">
                              回顾公式 📐
                          </button>
                      )}
                  </div>
               </div>
            </div>

            {/* Input Area */}
            <div className="relative flex items-center gap-2 bg-white/80 border border-white rounded-full p-2 pl-4 shadow-inner backdrop-blur-sm focus-within:ring-2 focus-within:ring-brand/20 transition-all">
                <button 
                    onClick={() => alert("开启相机... (拍摄错题流程)")}
                    className={`transition-all p-1.5 rounded-full ${shouldHighlightCapture ? 'text-brand bg-brand/10 ring-2 ring-brand ring-offset-1 animate-pulse shadow-[0_0_10px_rgba(108,93,211,0.5)]' : 'text-gray-400 hover:text-brand hover:bg-brand/5'}`}
                >
                    <ImagePlus size={20} />
                </button>
                <button className="text-gray-400 hover:text-brand transition-colors p-1.5 rounded-full hover:bg-brand/5 mr-1">
                    <Mic size={20} />
                </button>

                <input 
                    type="text" 
                    placeholder="问点什么..." 
                    className="flex-1 bg-transparent text-sm font-bold text-gray-700 placeholder:text-gray-400 focus:outline-none"
                />
                
                <button className="aspect-square w-10 h-10 bg-brand text-white rounded-full hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20 flex items-center justify-center shrink-0">
                    <Send size={18} className="ml-0.5" />
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* The Companion Orb (Trigger Button) - Hidden when expanded */}
      <AnimatePresence>
        {!isExpanded && (
            // Draggable Wrapper
            <motion.div 
                ref={orbRef}
                drag
                dragControls={controls}
                dragConstraints={containerRef}
                dragElastic={0.1}
                dragMomentum={false} 
                onDragEnd={handleDragEnd}
                animate={animationControls}
                whileDrag={{ scale: 1.1, cursor: 'grabbing' }}
                className={`absolute z-[60] flex flex-col gap-2 cursor-grab touch-none ${positioningClass} ${isRightSide ? 'items-end' : 'items-start'}`}
            >
                
                {/* Context Bubble (Follows Orb) */}
                <AnimatePresence>
                    {showBubble && (
                        <motion.button 
                            initial={{ opacity: 0, y: 10, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.8 }}
                            onTap={handleOpenChat}
                            className={`bg-white/90 backdrop-blur-md px-4 py-3 shadow-xl border border-white/50 text-xs font-bold text-gray-700 max-w-[200px] mb-1 pointer-events-auto ${bubblePositionClass}`}
                        >
                            {bubbleMessage}
                        </motion.button>
                    )}
                </AnimatePresence>

                {/* Orb */}
                <motion.button
                    layout
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    onTap={handleOpenChat}
                    onPointerDown={(e) => controls.start(e)}
                    className="flex items-center justify-center w-16 h-16 rounded-full bg-white backdrop-blur-2xl border border-white/40 shadow-[0_8px_32px_rgba(108,93,211,0.25)] transition-transform pointer-events-auto"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <div className="relative w-full h-full flex items-center justify-center">
                        <div className="relative z-10 w-[3.25rem] h-[3.25rem] rounded-full overflow-hidden border-2 border-white shadow-md bg-brand flex items-center justify-center">
                             <div className="relative w-8 h-8">
                                 <Bot size={32} className="text-white" />
                                 <div className="absolute top-[30%] left-[22%] w-[10%] h-[10%] bg-cyan-300 rounded-full animate-pulse"></div>
                                 <div className="absolute top-[30%] right-[22%] w-[10%] h-[10%] bg-cyan-300 rounded-full animate-pulse"></div>
                             </div>
                        </div>
                        
                        <div className="absolute top-2.5 right-2.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full z-20 shadow-sm"></div>
                    </div>
                </motion.button>
            </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
