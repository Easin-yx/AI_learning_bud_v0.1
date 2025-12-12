import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AssessmentStart } from './AssessmentStart';
import { AssessmentResult } from './AssessmentResult';
import { AssessmentStageHeader, CognitiveStage, AcademicStage, StyleStage, StageSummary } from './AssessmentStages';
import { AssessmentPhase } from '../../types';

interface AssessmentFlowProps {
  onExit: () => void;
}

export const AssessmentFlow: React.FC<AssessmentFlowProps> = ({ onExit }) => {
  const [phase, setPhase] = useState<AssessmentPhase>('launch');
  const [showSummary, setShowSummary] = useState(false);
  
  // Track specific summary data to show between stages
  const [summaryData, setSummaryData] = useState({ title: '', desc: '' });

  // Stage Transitions
  const handleStageComplete = (currentPhase: AssessmentPhase) => {
    let nextPhase: AssessmentPhase = 'launch';
    let sTitle = '';
    let sDesc = '';

    if (currentPhase === 'cognitive') {
        nextPhase = 'academic';
        sTitle = '脑力潜能分析完成';
        sDesc = '你的反应速度超越了 95% 的同龄人！逻辑思维非常敏捷。';
    } else if (currentPhase === 'academic') {
        nextPhase = 'style';
        sTitle = '学科摸底完成';
        sDesc = '数学基础很扎实，但在空间几何方面还有提升空间哦。';
    } else if (currentPhase === 'style') {
        nextPhase = 'final_result';
        sTitle = '默契测试完成';
        sDesc = 'Lumi 已经完全了解你的学习偏好了！';
    }

    setSummaryData({ title: sTitle, desc: sDesc });
    setShowSummary(true);
  };

  const advancePhase = () => {
      setShowSummary(false);
      if (summaryData.title.includes('脑力')) setPhase('academic');
      else if (summaryData.title.includes('学科')) setPhase('style');
      else if (summaryData.title.includes('默契')) {
          setPhase('final_result');
      }
  };

  return (
    <div className="w-full h-full bg-gray-900 relative overflow-hidden flex flex-col">
      
      {/* 1. Launch Screen */}
      {phase === 'launch' && (
        <AssessmentStart 
            onStart={() => setPhase('cognitive')} 
            onExit={onExit}
        />
      )}

      {/* 2. Result Screen */}
      {phase === 'final_result' && (
         <AssessmentResult onFinish={onExit} />
      )}

      {/* 3. Main Assessment Content */}
      {phase !== 'launch' && phase !== 'final_result' && (
          <>
            {/* Top Progress Header */}
            <AssessmentStageHeader currentPhase={phase} />

            {/* Stage Content Container */}
            <div className="flex-1 relative">
                <AnimatePresence mode="wait">
                    {showSummary ? (
                        <StageSummary 
                            key="summary"
                            data={summaryData}
                            onNext={advancePhase}
                        />
                    ) : (
                        phase === 'cognitive' ? (
                            <CognitiveStage key="cog" onComplete={() => handleStageComplete('cognitive')} />
                        ) : phase === 'academic' ? (
                            <AcademicStage key="aca" onComplete={() => handleStageComplete('academic')} />
                        ) : (
                            <StyleStage key="style" onComplete={() => handleStageComplete('style')} />
                        )
                    )}
                </AnimatePresence>
            </div>
          </>
      )}
    </div>
  );
};
