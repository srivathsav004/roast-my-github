
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Analytics } from '@vercel/analytics/react';
import { fetchGitHubData } from './services/githubService';
import { generateRoast } from './services/geminiService';
import { AppState, GitHubUserData, RoastData } from './types';
import LandingPage from './components/LandingPage';
import LoadingScreen from './components/LoadingScreen';
import Dashboard from './components/Dashboard';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.LANDING);
  const [username, setUsername] = useState('');
  const [userData, setUserData] = useState<GitHubUserData | null>(null);
  const [roastData, setRoastData] = useState<RoastData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleRoast = async (name: string) => {
    if (!name.trim()) return;
    
    setUsername(name);
    setError(null);
    setState(AppState.LOADING);

    try {
      const data = await fetchGitHubData(name);
      setUserData(data);
      const roast = await generateRoast(data);
      setRoastData(roast);
      
      // Delay slightly for dramatic effect if it was too fast
      setTimeout(() => {
        setState(AppState.DASHBOARD);
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong. Even our roast engine cringed at that username.');
      setState(AppState.ERROR);
    }
  };

  const handleReset = () => {
    setState(AppState.LANDING);
    setUsername('');
    setUserData(null);
    setRoastData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen selection:bg-[#00ff88] selection:text-black">
      <AnimatePresence mode="wait">
        {state === AppState.LANDING && (
          <motion.div key="landing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LandingPage onRoast={handleRoast} />
          </motion.div>
        )}

        {state === AppState.LOADING && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <LoadingScreen />
          </motion.div>
        )}

        {state === AppState.DASHBOARD && userData && roastData && (
          <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Dashboard 
              userData={userData} 
              roastData={roastData} 
              onReset={handleReset} 
            />
          </motion.div>
        )}

        {state === AppState.ERROR && (
          <motion.div 
            key="error" 
            className="flex flex-col items-center justify-center min-h-screen p-6 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h1 className="text-6xl mb-4 text-[#ff0055] font-bold">CRITICAL ERROR</h1>
            <p className="text-xl text-gray-400 max-w-md mb-8">{error}</p>
            <button 
              onClick={handleReset}
              className="px-8 py-4 bg-[#00ff88] text-black font-bold brutalist-border hover:bg-[#00ff88]/90 transition-all active:scale-95"
            >
              TRY AGAIN, IF YOU DARE
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      <Analytics />
    </div>
  );
};

export default App;
