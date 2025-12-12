
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { VideoLesson } from './VideoLesson';
import { QuizPage } from '../Quiz/QuizPage';
import { Task } from '../../types';

interface LearningFlowProps {
  onExit: () => void;
  task?: Task | null;
}

type Phase = 'video' | 'quiz' | 'review';

export const LearningFlow: React.FC<LearningFlowProps> = ({ onExit, task }) => {
  const [phase, setPhase] = useState<Phase>('video');

  return (
    <div className="w-full h-full bg-white relative overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === 'video' ? (
          <motion.div 
            key="video"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="w-full h-full"
          >
            <VideoLesson 
                mode="learn"
                onComplete={() => setPhase('quiz')} 
                onExit={onExit}
                task={task}
            />
          </motion.div>
        ) : phase === 'quiz' ? (
          <motion.div 
            key="quiz"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full h-full"
          >
             <QuizPage 
                onExit={onExit} 
                onReview={() => setPhase('review')}
                task={task} 
             />
          </motion.div>
        ) : (
          <motion.div 
            key="review"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full h-full"
          >
            <VideoLesson 
                mode="review"
                onComplete={onExit} 
                onExit={onExit}
                task={task}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
