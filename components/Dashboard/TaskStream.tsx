
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DayPlan, Task } from '../../types';
import { CheckCircle, Circle, GripVertical, Clock, Sparkles, Play } from 'lucide-react';

interface TaskStreamProps {
  plan: DayPlan | null;
  onStartQuiz: (task: Task) => void;
}

export const TaskStream: React.FC<TaskStreamProps> = ({ plan, onStartQuiz }) => {
  const [completedTasks, setCompletedTasks] = useState<Set<string>>(new Set());

  if (!plan) return <div className="p-8 text-center text-gray-400">正在生成你的任务...</div>;

  const toggleTask = (e: React.MouseEvent, taskId: string) => {
    e.stopPropagation();
    const next = new Set(completedTasks);
    if (next.has(taskId)) {
      next.delete(taskId);
    } else {
      next.add(taskId);
    }
    setCompletedTasks(next);
  };

  return (
    <div className="flex flex-col gap-4">
        {/* Render Task List Directly - Removed Hero Card Wrapper */}
        {plan.tasks.map((task, index) => (
            <motion.div 
                key={task.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-2xl flex items-center gap-4 group/task transition-all shadow-sm border border-gray-100 cursor-pointer ${completedTasks.has(task.id) ? 'bg-gray-50 opacity-60' : 'bg-white hover:bg-gray-50 hover:shadow-md'}`}
                onClick={(e) => {
                    e.stopPropagation(); // Don't trigger other clicks
                    onStartQuiz(task); // Enter quiz mode with task context
                }}
            >
                <div className="text-gray-300 cursor-grab active:cursor-grabbing hover:text-gray-500" onClick={(e) => e.stopPropagation()}>
                    <GripVertical size={20} />
                </div>
                
                <button 
                    onClick={(e) => toggleTask(e, task.id)}
                    className={`transition-colors ${completedTasks.has(task.id) ? 'text-green-500' : 'text-gray-300 hover:text-brand'}`}
                >
                    {completedTasks.has(task.id) ? <CheckCircle size={24} fill="currentColor" className="text-white" /> : <Circle size={24} />}
                </button>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                            task.subject === '数学' ? 'bg-blue-100 text-blue-600' :
                            task.subject === '语文' ? 'bg-orange-100 text-orange-600' :
                            task.subject === '英语' ? 'bg-green-100 text-green-600' :
                            'bg-gray-100 text-gray-600'
                        }`}>
                            {task.subject}
                        </span>
                        {/* Time label moved here for better compact layout */}
                        <div className="flex items-center gap-1 text-gray-400 text-xs font-semibold">
                            <Clock size={10} />
                            {task.durationMinutes}分钟
                        </div>
                    </div>
                    <h4 className={`font-bold text-gray-800 text-lg truncate ${completedTasks.has(task.id) ? 'line-through decoration-gray-400 text-gray-400' : ''}`}>
                        {task.title}
                    </h4>
                    {task.aiReasoning && !completedTasks.has(task.id) && (
                        <p className="text-xs text-brand/80 mt-1 flex items-center gap-1">
                            <Sparkles size={10} /> {task.aiReasoning}
                        </p>
                    )}
                </div>

                {/* Start Action */}
                <div className="flex items-center gap-1">
                    <button className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-all shadow-sm">
                        <Play size={16} fill="currentColor" className="ml-0.5" />
                    </button>
                </div>
            </motion.div>
        ))}
    </div>
  );
};
