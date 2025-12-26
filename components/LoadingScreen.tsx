
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, AlertTriangle, Terminal as TerminalIcon } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  const steps = [
    { text: "Fetching GitHub profile...", duration: 800, type: 'success' },
    { text: "Analyzing repositories...", duration: 1200, type: 'success' },
    { text: "Counting commits... this might take a while", duration: 1500, type: 'success' },
    { text: "Judging your code quality... brace yourself", duration: 1800, type: 'warning' },
    { text: "Generating roasts with Gemini AI...", duration: 2500, type: 'success' },
    { text: "Finishing touches on your ego destruction...", duration: 2000, type: 'success' },
  ];

  const [visibleSteps, setVisibleSteps] = useState<number>(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (visibleSteps < steps.length) {
      const timer = setTimeout(() => {
        setVisibleSteps(prev => prev + 1);
        setProgress((visibleSteps + 1) / steps.length * 100);
      }, steps[visibleSteps].duration);
      return () => clearTimeout(timer);
    }
  }, [visibleSteps]);

  const funnyMessages = [
    "Wow, that's a lot of TODO comments...",
    "Found your 3 AM commits. Yikes.",
    "Analyzing your 'fix typo' commit messages...",
    "Detecting excessive use of console.log...",
    "Calculating the probability of you actually testing your code..."
  ];
  const [funnyMsgIndex, setFunnyMsgIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFunnyMsgIndex(prev => (prev + 1) % funnyMessages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] flex flex-col items-center justify-center p-6 z-50">
      <div className="w-full max-w-2xl bg-[#111] brutalist-border p-8 shadow-2xl relative">
        <div className="flex items-center gap-2 mb-8 border-b border-[#222] pb-4">
          <div className="w-3 h-3 rounded-full bg-[#ff0055]" />
          <div className="w-3 h-3 rounded-full bg-[#ffaa00]" />
          <div className="w-3 h-3 rounded-full bg-[#00ff88]" />
          <span className="ml-2 mono-font text-xs text-gray-500 uppercase tracking-widest">System Analysis</span>
        </div>

        <div className="space-y-4 mb-8 min-h-[240px]">
          {steps.slice(0, visibleSteps + 1).map((step, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-start gap-3 mono-font text-sm sm:text-base"
            >
              <span className="text-gray-600">&gt;</span>
              <span className={i === visibleSteps ? "text-[#00ff88]" : "text-gray-300"}>
                {step.text}
              </span>
              {i < visibleSteps && (
                <motion.span 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }}
                  className={step.type === 'success' ? "text-[#00ff88]" : "text-[#ffaa00]"}
                >
                  {step.type === 'success' ? <Check className="w-4 h-4 inline" /> : <AlertTriangle className="w-4 h-4 inline" />}
                </motion.span>
              )}
            </motion.div>
          ))}
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs mono-font text-gray-500 uppercase">
            <span>Analyzing Ego...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-1 bg-[#222] w-full">
            <motion.div 
              className="h-full bg-[#00ff88]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>

        <div className="mt-8 text-center text-[#ff0055] mono-font text-xs animate-pulse">
          {funnyMessages[funnyMsgIndex]}
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;
