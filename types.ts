
export interface Task {
  id: string;
  title: string;
  subject: string;
  durationMinutes: number;
  completed: boolean;
  aiReasoning?: string; // Why AI suggested this
  // difficulty removed
}

export interface DayPlan {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
  totalXp: number;
}

export interface MoodOption {
  value: string;
  label: string;
  icon: string; // Emoji char
  color: string;
}

export interface UserStats {
  xpToday: number;
  xpTarget: number;
  studyMinutesToday: number;
  streakDays: number;
  coins: number;
}

// New types for Subject Map
export type SubjectType = '数学' | '语文' | '英语';

export type NodeStatus = 'locked' | 'current' | 'completed';

export interface MapNode {
  id: string;
  title: string;
  level: number;
  status: NodeStatus;
  nodeType?: 'level' | 'chest' | 'boss'; // NEW: Distinguish node types
  stars?: 0 | 1 | 2 | 3; // For completed or branch nodes
  description?: string;
  duration?: string;
  isBranch?: boolean; // If it sits off the main path
  xOffset?: number; // -100 to 100 range for visual positioning
}

export interface SubjectData {
  subject: SubjectType;
  nodes: MapNode[];
}

// Mistake Vault Types
export interface MistakeStats {
  errorCount: number;
  reviewCount: number;
  correctCount: number; // consecutive correct
  mastered: boolean;
  isStarred: boolean;
  lastWrongDate: string;
}

export interface VariantQuestion {
  id: string;
  content: string;
  options?: string[]; // if multiple choice
  correctAnswer: string;
  explanation: string;
}

export interface MistakeItem {
  id: string;
  questionSnippet: string; // Short preview
  fullQuestion: string;   // Full content (supports latex/image logically)
  subject: SubjectType | string;
  topic: string; // e.g., "Quadratic Equations"
  errorType: '计算错误' | '概念模糊' | '审题不清' | '思路卡壳';
  status: 'new' | 'reviewing' | 'mastered'; // red | yellow | green
  lastReview: string; // Display string like "1天前"
  tags?: string[];
  
  // Detailed Stats
  stats: MistakeStats;
  
  // Content
  correctAnswer: string;
  userWrongAnswer?: string;
  analysis: string; // AI explanation
}

export interface MistakeGroup {
  topic: string;
  count: number;
  items: MistakeItem[];
}

export interface MistakeSubjectStat {
  subject: SubjectType | string;
  pendingCount: number;
  solvedPercentage: number;
}

export interface MistakeVaultData {
  totalPending: number;
  subjectStats: MistakeSubjectStat[];
  groups: MistakeGroup[];
}

// Growth / Profile Types
export interface AbilityStats {
  logic: number;
  memory: number;
  focus: number;
  creativity: number;
  grit: number;
}

export interface RadarDimension {
  subject: string;
  score: number;
  fullMark: number;
  analysis: string; // Detailed breakdown
}

export interface AssessmentResultData {
  personaTags: string[]; 
  radarData: RadarDimension[];
  aiEfficiency: {
      removedTasks: number; // percentage
      savedTime: string;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string; // emoji or icon name
  unlocked: boolean;
  dateUnlocked?: string;
}

export interface UserProfileData {
  name: string;
  level: number;
  currentXp: number;
  nextLevelXp: number;
  abilities: AbilityStats; // Keep for backward compatibility if needed
  assessmentResult?: AssessmentResultData; // The rich data
  achievements: Achievement[];
  coins: number;
}

export type AssessmentPhase = 'launch' | 'cognitive' | 'academic' | 'style' | 'analyzing' | 'final_result';
