
import { GoogleGenAI } from "@google/genai";
import { DayPlan, SubjectData, SubjectType, MistakeVaultData, UserProfileData, VariantQuestion } from "../types";

// This service handles AI interactions. 
// For this prototype, we primarily mock the data to match the visual requirements,
// but this structure allows easy integration of real Gemini calls.

const apiKey = process.env.API_KEY || 'mock-key';
const ai = new GoogleGenAI({ apiKey });

export const generateDailyPlan = async (): Promise<DayPlan> => {
  // Real implementation would use:
  // const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: '...' });
  
  // Returning mock data for the prototype visualization
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 'plan-1',
        title: '今日能量加油站',
        description: 'AI 根据你昨天的数学测验结果，为你定制了今天的专属计划。',
        totalXp: 450,
        tasks: [
          {
            id: 't1',
            title: '一元一次方程：移项与合并同类项',
            subject: '数学',
            durationMinutes: 20,
            completed: false,
            aiReasoning: '检测到你在昨天的作业中，移项时经常忘记变号，建议重点突击。'
          },
          {
            id: 't2',
            title: '古诗鉴赏：次北固山下',
            subject: '语文',
            durationMinutes: 15,
            completed: false,
            aiReasoning: '这首诗是期中考的必考重点，特别是颔联的哲理。'
          },
          {
            id: 't3',
            title: '英语听力：Unit 3 Daily Routine',
            subject: '英语',
            durationMinutes: 30,
            completed: false,
            aiReasoning: '针对你“长对话理解”薄弱项，生成了专项强化训练。'
          }
        ]
      });
    }, 500);
  });
};

export const getSubjectMapData = async (subject: SubjectType): Promise<SubjectData> => {
  // Simulate fetching different data structure for the map
  // Structure: 6 Levels, 2 Chests, 1 Boss. Zigzag path logic applied to xOffset.
  return new Promise((resolve) => {
    setTimeout(() => {
      let nodes = [];
      if (subject === '数学') {
        nodes = [
          // Phase 1
          { id: 'm1', level: 1, nodeType: 'level', title: '有理数运算', status: 'completed', stars: 3, xOffset: 0 },
          { id: 'm2', level: 2, nodeType: 'level', title: '整式的加减', status: 'completed', stars: 2, xOffset: -60 },
          { id: 'chest1', level: 0, nodeType: 'chest', title: '阶段奖励', status: 'completed', stars: 0, xOffset: 0, description: '包含 50 金币' },
          
          // Phase 2
          { id: 'm3', level: 3, nodeType: 'level', title: '一元一次方程', status: 'current', stars: 0, xOffset: 60, description: '重点攻克：移项与合并同类项', duration: '25分钟' },
          { id: 'm4', level: 4, nodeType: 'level', title: '几何图形初步', status: 'locked', stars: 0, xOffset: -60 },
          { id: 'chest2', level: 0, nodeType: 'chest', title: '神秘宝箱', status: 'locked', stars: 0, xOffset: 0, description: '通关后解锁稀有装扮' },
          
          // Phase 3
          { id: 'm5', level: 5, nodeType: 'level', title: '相交线与平行线', status: 'locked', stars: 0, xOffset: 60 },
          { id: 'm6', level: 6, nodeType: 'level', title: '实数与根号', status: 'locked', stars: 0, xOffset: -60 },
          
          // Boss
          { id: 'boss1', level: 7, nodeType: 'boss', title: '第一章：单元挑战', status: 'locked', stars: 0, xOffset: 0, description: '综合测试，全真模拟' },
        ];
      } else if (subject === '语文') {
        nodes = [
          { id: 'c1', level: 1, nodeType: 'level', title: '古诗十九首', status: 'completed', stars: 3, xOffset: 0 },
          { id: 'c2', level: 2, nodeType: 'level', title: '文言文实词', status: 'current', stars: 0, xOffset: -60, description: '掌握常见的20个实词含义', duration: '20分钟' },
          { id: 'chest1', level: 0, nodeType: 'chest', title: '背诵奖励', status: 'locked', stars: 0, xOffset: 0 },
          { id: 'c3', level: 3, nodeType: 'level', title: '现代文阅读', status: 'locked', stars: 0, xOffset: 60 },
          { id: 'c4', level: 4, nodeType: 'level', title: '作文：叙事技巧', status: 'locked', stars: 0, xOffset: -60 },
          { id: 'boss1', level: 5, nodeType: 'boss', title: '期中模拟', status: 'locked', stars: 0, xOffset: 0 },
        ];
      } else {
        nodes = [
          { id: 'e1', level: 1, nodeType: 'level', title: '一般现在时', status: 'completed', stars: 3, xOffset: 0 },
          { id: 'e2', level: 2, nodeType: 'level', title: '名词复数变化', status: 'completed', stars: 3, xOffset: 60 },
          { id: 'chest1', level: 0, nodeType: 'chest', title: '听力奖励', status: 'completed', stars: 0, xOffset: 0 },
          { id: 'e3', level: 3, nodeType: 'level', title: '情态动词 Can', status: 'current', stars: 0, xOffset: -60 },
          { id: 'e4', level: 4, nodeType: 'level', title: '一般过去时', status: 'locked', stars: 0, xOffset: 60 },
          { id: 'boss1', level: 5, nodeType: 'boss', title: '语法大闯关', status: 'locked', stars: 0, xOffset: 0 },
        ];
      }
      
      resolve({
        subject,
        nodes: nodes as any
      });
    }, 300);
  });
}

export const getMistakeVaultData = async (): Promise<MistakeVaultData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalPending: 28,
        subjectStats: [
          { subject: '数学', pendingCount: 12, solvedPercentage: 65 },
          { subject: '英语', pendingCount: 8, solvedPercentage: 40 },
          { subject: '语文', pendingCount: 5, solvedPercentage: 85 },
          { subject: '物理', pendingCount: 3, solvedPercentage: 20 },
        ],
        groups: [
          {
            topic: '一元二次方程',
            count: 3,
            items: [
              { 
                  id: 'err1', 
                  questionSnippet: '已知方程 x² - 5x + 6 = 0 的两根...', 
                  fullQuestion: '已知方程 x² - 5x + 6 = 0 的两根分别为 x₁ 和 x₂，求 x₁² + x₂² 的值。',
                  subject: '数学', 
                  topic: '一元二次方程', 
                  errorType: '计算错误', 
                  status: 'new', 
                  lastReview: '1天前',
                  stats: { errorCount: 3, reviewCount: 1, correctCount: 0, mastered: false, isStarred: true, lastWrongDate: '2023-10-24' },
                  correctAnswer: '13',
                  userWrongAnswer: '11',
                  analysis: '注意利用韦达定理：x₁+x₂=5, x₁x₂=6。x₁²+x₂² = (x₁+x₂)² - 2x₁x₂ = 25 - 12 = 13。你可能在计算平方和公式时忘记减去 2ab 了。'
              },
              { 
                  id: 'err2', 
                  questionSnippet: '关于x的方程 kx² + 2x - 1 = 0 有实数根...', 
                  fullQuestion: '关于x的方程 kx² + 2x - 1 = 0 有实数根，则 k 的取值范围是？',
                  subject: '数学', 
                  topic: '一元二次方程', 
                  errorType: '概念模糊', 
                  status: 'new', 
                  lastReview: '2天前',
                  stats: { errorCount: 2, reviewCount: 0, correctCount: 0, mastered: false, isStarred: false, lastWrongDate: '2023-10-22' },
                  correctAnswer: 'k ≥ -1 且 k ≠ 0',
                  userWrongAnswer: 'k ≥ -1',
                  analysis: '这是一个典型陷阱！作为一元二次方程，二次项系数 k 不能为 0。判别式 Δ ≥ 0 只是条件之一，必须同时满足 k ≠ 0。'
              },
              { 
                  id: 'err3', 
                  questionSnippet: '用配方法解方程 2x² - 4x + 1 = 0...', 
                  fullQuestion: '用配方法解方程 2x² - 4x + 1 = 0。',
                  subject: '数学', 
                  topic: '一元二次方程', 
                  errorType: '思路卡壳', 
                  status: 'reviewing', 
                  lastReview: '3天前',
                  stats: { errorCount: 1, reviewCount: 2, correctCount: 1, mastered: false, isStarred: false, lastWrongDate: '2023-10-20' },
                  correctAnswer: 'x = (2 ± √2) / 2',
                  analysis: '配方法第一步：系数化为1。方程两边除以2得 x²-2x+0.5=0。移项得 x²-2x=-0.5。配方得 (x-1)²=0.5。'
              },
            ]
          },
          {
            topic: '勾股定理',
            count: 2,
            items: [
              { 
                  id: 'err4', 
                  questionSnippet: '直角三角形两直角边长分别为3和4...', 
                  fullQuestion: '直角三角形两边长分别为 3 和 4，求第三边的长。',
                  subject: '数学', 
                  topic: '勾股定理', 
                  errorType: '审题不清', 
                  status: 'new', 
                  lastReview: '昨天',
                  stats: { errorCount: 4, reviewCount: 1, correctCount: 0, mastered: false, isStarred: true, lastWrongDate: '2023-10-25' },
                  correctAnswer: '5 或 √7',
                  userWrongAnswer: '5',
                  analysis: '陷阱在于没有说明 3 和 4 都是直角边。如果 4 是斜边，则第三边是 √(16-9)=√7；如果都是直角边，则是 5。需要分类讨论。'
              },
              { 
                  id: 'err5', 
                  questionSnippet: '如图，在Rt△ABC中，∠C=90°...', 
                  fullQuestion: '如图，在Rt△ABC中，∠C=90°，AD平分∠CAB，BC=8，BD=5，求点D到AB的距离。',
                  subject: '数学', 
                  topic: '勾股定理', 
                  errorType: '计算错误', 
                  status: 'reviewing', 
                  lastReview: '5天前',
                  stats: { errorCount: 1, reviewCount: 3, correctCount: 2, mastered: false, isStarred: false, lastWrongDate: '2023-10-18' },
                  correctAnswer: '3',
                  analysis: '利用角平分线性质：角平分线上的点到角两边的距离相等。D到AC距离为DC。BC=8, BD=5 -> DC=3。所以D到AB距离也是3。'
              },
            ]
          },
        ]
      });
    }, 400);
  });
};

export const generateMistakeVariant = async (originalId: string): Promise<VariantQuestion> => {
    // In a real app, we would query Gemini here with the original question content
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                id: `variant-${Date.now()}`,
                content: '变式训练：已知直角三角形的两边长分别为 6 和 8，求第三边的长度。',
                correctAnswer: '10 或 2√7',
                options: ['10', '2√7', '10 或 2√7', '14'],
                explanation: '考点与原题一致：分类讨论。① 6,8为直角边 => √(36+64)=10。② 8为斜边 => √(64-36)=√28=2√7。'
            });
        }, 1500); // Simulate network delay
    });
}

export const getUserGrowthData = async (): Promise<UserProfileData> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                name: "李华",
                level: 5,
                currentXp: 3200,
                nextLevelXp: 5000,
                coins: 850,
                abilities: {
                    logic: 85,
                    memory: 60,
                    focus: 90,
                    creativity: 85,
                    grit: 70
                },
                assessmentResult: {
                    personaTags: ['逻辑强', '视觉型', '挑战者'],
                    radarData: [
                        { subject: '逻辑', score: 85, fullMark: 100, analysis: '抽象思维能力 T1 梯队！适合从原理层切入，减少机械记忆。' },
                        { subject: '基础', score: 60, fullMark: 100, analysis: '新知识点吸收快，但部分前置概念（如几何定理）存在盲区。' },
                        { subject: '专注', score: 90, fullMark: 100, analysis: '心流状态进入极快，是天生的“深度学习者”。' },
                        { subject: '悟性', score: 85, fullMark: 100, analysis: '举一反三能力出色，遇到新题型能迅速迁移旧知识。' },
                        { subject: '计算', score: 70, fullMark: 100, analysis: '解题思路清晰，但运算准确率有波动，建议加强专项训练。' },
                    ],
                    aiEfficiency: {
                        removedTasks: 30, // Percentage of repetitive tasks removed
                        savedTime: '2小时' // Calculated saved time
                    }
                },
                achievements: [
                    { id: 'a1', title: '早起鸟', description: '连续7天在早上8点前完成打卡', icon: '🌅', unlocked: true, dateUnlocked: '2023-10-01' },
                    { id: 'a2', title: '数学之星', description: '数学单元测试满分', icon: '📐', unlocked: true, dateUnlocked: '2023-10-15' },
                    { id: 'a3', title: '专注大师', description: '单次专注时长超过60分钟', icon: '🧘', unlocked: true, dateUnlocked: '2023-10-20' },
                    { id: 'a4', title: '单词猎人', description: '累计掌握500个新单词 (当前进度: 340/500)', icon: '🏹', unlocked: false },
                    { id: 'a5', title: '错题清道夫', description: '消灭所有待复习错题 (还有28题)', icon: '🧹', unlocked: false },
                ]
            });
        }, 400);
    });
}
