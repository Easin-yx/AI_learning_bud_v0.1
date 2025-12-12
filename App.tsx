
import React, { useEffect, useState, useRef } from 'react';
import { Header } from './components/Dashboard/Header';
import { TopStatusBar } from './components/Layout/TopStatusBar';
import { TaskStream } from './components/Dashboard/TaskStream';
import { StatsWidget } from './components/Dashboard/StatsWidget';
import { SubjectMap } from './components/SubjectMap/SubjectMap';
import { MistakeVault } from './components/MistakeVault/MistakeVault';
import { GrowthProfile } from './components/Growth/GrowthProfile';
import { LumiSpace } from './components/LumiSpace/LumiSpace';
import { BottomNav } from './components/Layout/BottomNav';
import { FloatingAction } from './components/Layout/FloatingAction';
import { LearningFlow } from './components/Learning/LearningFlow'; 
import { AssessmentFlow } from './components/Assessment/AssessmentFlow';
import { CoinStoreModal } from './components/Store/CoinStoreModal';
import { DemoControls } from './components/Demo/DemoControls'; // Import Demo Controls
import { generateDailyPlan } from './services/geminiService';
import { DayPlan, UserStats, SubjectType, Task } from './types';

const MOCK_STATS: UserStats = {
  xpToday: 350,
  xpTarget: 600,
  studyMinutesToday: 120,
  streakDays: 14,
  coins: 850
};

type ViewState = 'dashboard' | 'learning' | 'assessment';

const App: React.FC = () => {
  const [dayPlan, setDayPlan] = useState<DayPlan | null>(null);
  const [activeTab, setActiveTab] = useState('today');
  const [view, setView] = useState<ViewState>('dashboard');
  
  // Track the currently active task for learning mode
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  
  // Lifted Subject State for Global Switcher
  const [activeSubject, setActiveSubject] = useState<SubjectType>('数学');
  
  // Global Store State
  const [isStoreOpen, setIsStoreOpen] = useState(false);

  // Demo State Overrides
  const [userStats, setUserStats] = useState<UserStats>(MOCK_STATS);

  // Ref for drag constraints
  const constraintsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simulate AI loading
    generateDailyPlan().then(setDayPlan);
  }, []);

  // --- Demo Control Handlers ---
  const handleDemoReset = () => {
      // Reset plan to initial state, maybe clear completed tasks visual
      generateDailyPlan().then(setDayPlan);
      setUserStats(MOCK_STATS);
      alert("Demo State: Daily Tasks Reset");
  };

  const handleDemoUnlock = () => {
      // In a real app, this would update the context. 
      // For visual prototype, we can trigger a toast or just log it, 
      // as the Map component mocks its data internally.
      // To make it visible, we might force a refresh of the map component key if we had one.
      alert("Demo State: All Levels Unlocked (Visual Mock)");
  };

  const handlePersonaSwitch = (type: 'high' | 'low') => {
      if (type === 'high') {
          setUserStats({ ...MOCK_STATS, xpToday: 580, coins: 1200, streakDays: 45 });
      } else {
          setUserStats({ ...MOCK_STATS, xpToday: 50, coins: 100, streakDays: 0 });
      }
  };

  const handleForceSubject = (subj: SubjectType) => {
      setActiveSubject(subj);
      if (activeTab !== 'subject') setActiveTab('subject');
  };

  // Determine status bar variant based on active tab
  const statusBarVariant = (activeTab === 'today' || activeTab === 'partner') ? 'dark' : 'light';

  // Determine Context for Lumi
  const getContext = () => {
      if (view === 'learning') return 'learning';
      if (view === 'assessment') return 'assessment';
      if (activeTab === 'today') return 'dashboard';
      if (activeTab === 'subject') return 'subject';
      if (activeTab === 'mistake') return 'mistake';
      if (activeTab === 'me') return 'growth';
      return 'default';
  };

  return (
    // A. Root Container: Dark desktop background
    <div className="min-h-screen w-full flex justify-center items-center bg-gray-900 p-0 lg:p-8 font-sans">
      
      {/* B. Device Viewport */}
      <div ref={constraintsRef} className="w-full h-[100dvh] lg:max-w-[1024px] lg:h-[90vh] bg-brand shadow-2xl relative overflow-hidden flex flex-col lg:rounded-[40px] lg:border-[8px] lg:border-gray-800">
        
        {view === 'learning' ? (
            /* --- LEARNING MODE (Video -> Quiz) --- */
            <LearningFlow 
                onExit={() => {
                    setView('dashboard');
                    setCurrentTask(null);
                }} 
                task={currentTask}
            />
        ) : view === 'assessment' ? (
            /* --- ASSESSMENT MODE --- */
            <AssessmentFlow onExit={() => setView('dashboard')} />
        ) : (
            /* --- DASHBOARD MODE --- */
            <>
                {/* 1. Global Top Status Bar */}
                {activeTab !== 'me' && activeTab !== 'partner' && (
                    <TopStatusBar 
                        stats={userStats} 
                        activeSubject={activeSubject}
                        onSubjectChange={setActiveSubject}
                        showSubjectSwitcher={activeTab === 'subject'} 
                        variant={statusBarVariant}
                        onOpenStore={() => setIsStoreOpen(true)}
                    />
                )}

                {/* 2. Contextual Greeting Header (Only on Today tab) */}
                {activeTab === 'today' && (
                  <div className="flex-shrink-0">
                    <Header />
                  </div>
                )}

                {/* 3. Content Wrapper */}
                <div className={`flex-1 bg-surface relative z-10 overflow-hidden flex flex-col shadow-[0_-20px_60px_rgba(0,0,0,0.2)] ${activeTab === 'today' ? 'rounded-t-[40px]' : ''}`}>
                  
                  {/* View Switcher */}
                  {activeTab === 'today' ? (
                     // --- TAB 1: TODAY ---
                     <div className="flex-1 overflow-y-auto no-scrollbar scroll-smooth">
                       <div className="w-full px-4 md:px-6 lg:px-8 py-8 pb-32 max-w-4xl mx-auto">
                         <div className="flex flex-col gap-6">
                           <section>
                               <div className="flex items-center justify-between mb-4 px-2">
                                   <h3 className="text-gray-700 font-bold text-lg">今日任务</h3>
                               </div>
                               <TaskStream 
                                    plan={dayPlan} 
                                    onStartQuiz={(task) => {
                                        setCurrentTask(task);
                                        setView('learning');
                                    }} 
                               />
                           </section>

                           <section>
                                <StatsWidget />
                           </section>
                         </div>
                       </div>
                     </div>
                  ) : activeTab === 'subject' ? (
                     // --- TAB 2: SUBJECT MAP ---
                     <SubjectMap 
                        activeSubject={activeSubject} 
                        onStartLevel={() => setView('learning')} 
                     />
                  ) : activeTab === 'partner' ? (
                     // --- TAB 3: LUMI SPACE (AI PARTNER) ---
                     <LumiSpace />
                  ) : activeTab === 'mistake' ? (
                     // --- TAB 4: MISTAKE VAULT ---
                     <MistakeVault />
                  ) : activeTab === 'me' ? (
                     // --- TAB 5: GROWTH PROFILE ---
                     <GrowthProfile 
                        onStartAssessment={() => setView('assessment')} 
                        onOpenStore={() => setIsStoreOpen(true)}
                        coins={userStats.coins} 
                     />
                  ) : null}

                </div>

                {/* 4. Navigation Layer */}
                {activeTab !== 'partner' && (
                    <FloatingAction 
                        currentContext={getContext() as any} 
                        containerRef={constraintsRef}
                    />
                )}
                
                <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
            </>
        )}

        {/* 5. Modal Portal Root */}
        <div id="modal-root" className="absolute inset-0 z-[100] pointer-events-none flex items-center justify-center"></div>

        {/* 6. Global Modals */}
        <CoinStoreModal 
            isOpen={isStoreOpen} 
            onClose={() => setIsStoreOpen(false)} 
            coins={userStats.coins} 
        />

        {/* 7. DEMO CONTROLS (Only visible if you know where to look) */}
        <DemoControls 
            onReset={handleDemoReset}
            onUnlockAll={handleDemoUnlock}
            onSwitchPersona={handlePersonaSwitch}
            onForceSubject={handleForceSubject}
        />
        
      </div>
    </div>
  );
};

export default App;
