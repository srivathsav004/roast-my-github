
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, Target, Zap, ShieldAlert, Cpu, ChevronRight } from 'lucide-react';
import { LiquidOcean } from './ui/LiquidOcean';

interface Props {
  onRoast: (username: string) => void;
}

const LandingPage: React.FC<Props> = ({ onRoast }) => {
  const [input, setInput] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [savageMode, setSavageMode] = useState(false);
  const examples = ["torvalds", "gaearon", "tj", "sindresorhus", "your-name"];
  const [placeholderIndex, setPlaceholderIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % examples.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // Easter egg check
  useEffect(() => {
    if (input.toLowerCase() === 'sudo roast') {
      setSavageMode(true);
      setInput('');
    }
  }, [input]);

  const asciiLogo = `
  
██████╗  ██████╗  █████╗ ███████╗████████╗    ███╗   ███╗██╗   ██╗    ██████╗ ██╗████████╗██╗  ██╗██╗   ██╗██████╗ 
██╔══██╗██╔═══██╗██╔══██╗██╔════╝╚══██╔══╝    ████╗ ████║╚██╗ ██╔╝   ██╔════╝ ██║╚══██╔══╝██║  ██║██║   ██║██╔══██╗
██████╔╝██║   ██║███████║███████╗   ██║       ██╔████╔██║ ╚████╔╝    ██║  ███╗██║   ██║   ███████║██║   ██║██████╔╝
██╔══██╗██║   ██║██╔══██║╚════██║   ██║       ██║╚██╔╝██║  ╚██╔╝     ██║   ██║██║   ██║   ██╔══██║██║   ██║██╔══██╗
██║  ██║╚██████╔╝██║  ██║███████║   ██║       ██║ ╚═╝ ██║   ██║      ╚██████╔╝██║   ██║   ██║  ██║╚██████╔╝██████╔╝
╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚══════╝   ╚═╝       ╚═╝     ╚═╝   ╚═╝       ╚═════╝ ╚═╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝ ╚═════╝ 
  `;

  return (
    <div className="relative w-full h-screen overflow-hidden">
      <LiquidOcean
        accentColor="#00ff88"
        backgroundColor="#050505"
        oceanFragments={40}
        waveAmplitude={0.12}
        rotationSpeed={0.0003}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-4xl flex flex-col items-center px-6"
        >
          <motion.pre 
            className="text-[10px] sm:text-[12px] md:text-sm text-[#00ffff] mono-font mb-8 leading-tight text-center opacity-80 pointer-events-none select-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
          >
            {asciiLogo}
          </motion.pre>

          <div className="text-center mb-12 relative w-full">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              className="absolute -top-4 left-0 h-1 bg-[#ff0055]"
            />
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-black mb-4 tracking-tighter heading-font uppercase text-white drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]">
              SILENCE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00ff88] to-[#00ffee]">THE</span>
              <br />
              <span className="text-[#ff0055] italic">CLAIMS.</span>
            </h1>
            <p className="text-gray-400 text-lg sm:text-2xl mono-font max-w-xl mx-auto uppercase tracking-wider">
              {savageMode ? (
                <span className="text-[#ff0055] font-black animate-pulse">SAVAGE MODE: ENABLED (PREPARE TO CRY)</span>
              ) : (
                <>LET THE <span className="text-white font-black">REPOS</span> TALK.</>
              )}
            </p>
          </div>

          <div className="w-full max-w-2xl relative">
            <form 
              onSubmit={(e) => { e.preventDefault(); onRoast(input); }}
              className="relative z-10"
            >
              <div className={`
                bg-[#0a0a0a]/90 backdrop-blur-md border-4 transition-all duration-300 relative
                ${isFocused ? 'border-[#00ff88] shadow-[0_0_30px_rgba(0,255,136,0.3)]' : 'border-[#222] shadow-[12px_12px_0px_rgba(0,0,0,0.5)]'}
              `}>
                {/* Terminal Header */}
                {/* <div className="flex items-center justify-between px-4 py-2 border-b-2 border-inherit bg-black/50">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ff0055] opacity-50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#ffaa00] opacity-50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-[#00ff88] opacity-50" />
                  </div>
                  <div className="text-[10px] font-black mono-font text-gray-500 uppercase tracking-widest flex items-center gap-2">
                    <Cpu className="w-3 h-3" /> ENGINE_v5.0_STABLE
                  </div>
                </div> */}

                <div className="flex flex-col sm:flex-row">
                  <div className="relative flex-1 group">
                    <div className={`absolute left-6 top-1/2 -translate-y-1/2 transition-colors ${isFocused ? 'text-[#00ff88]' : 'text-gray-600'}`}>
                      <ChevronRight className="w-5 h-5" />
                    </div>
                    <input
                      type="text"
                      value={input}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={savageMode ? "LOCKED_ON..." : `DROP THE USERNAME`}
                      className="w-full pl-16 pr-6 py-6 bg-transparent text-white text-lg sm:text-xl font-black mono-font focus:outline-none transition-all placeholder:text-gray-800 uppercase"
                      autoFocus
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={!input.trim()}
                    className="
                      px-8 py-4 sm:py-0 bg-[#00ff88] text-black font-black text-lg heading-font uppercase 
                      tracking-tighter hover:bg-white transition-all active:scale-95 disabled:opacity-30 disabled:grayscale
                      border-l-0 sm:border-l-4 border-inherit flex items-center justify-center gap-3 group/btn relative overflow-hidden
                    "
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      INITIATE <Zap className={`w-4 h-4 fill-current transition-transform duration-300 ${isFocused ? 'scale-125' : ''}`} />
                    </span>
                    <motion.div 
                      className="absolute inset-0 bg-white/40 translate-x-[-100%]"
                      whileHover={{ translateX: '100%' }}
                      transition={{ duration: 0.5 }}
                    />
                  </button>
                </div>

                {/* <div className="px-4 py-2 bg-black/50 border-t-2 border-inherit flex justify-between items-center">
                  <div className="flex items-center gap-3">
                     <div className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${isFocused ? 'bg-[#00ff88] animate-pulse' : 'bg-gray-800'}`} />
                        <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">LIVE_DATA_FEED</span>
                     </div>
                     {savageMode && (
                       <div className="flex items-center gap-1.5 border-l border-gray-800 pl-3">
                          <ShieldAlert className="w-3 h-3 text-[#ff0055]" />
                          <span className="text-[8px] font-black text-[#ff0055] uppercase tracking-widest">SAVAGE_ENABLED</span>
                       </div>
                     )}
                  </div>
                  <span className="text-[8px] font-black text-gray-700 mono-font">Uptime: 99.9%</span>
                </div> */}
              </div>

              <AnimatePresence>
                {isFocused && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute -bottom-8 left-0 right-0 text-center"
                  >
                    <span className="text-[10px] mono-font text-gray-500 uppercase tracking-[0.2em] italic">
                      PRESS ENTER TO UNCOVER THE TRUTH
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>
            </form>

            <div className="mt-12 flex flex-wrap justify-center gap-10 opacity-30 hover:opacity-100 transition-opacity duration-500">
              <div className="flex flex-col items-center gap-2">
                {/* <div className="p-3 border-2 border-[#222] bg-[#111]">
                  <Target className="w-5 h-5 text-gray-400" />
                </div> */}
                {/* <span className="text-[10px] font-black text-gray-600 tracking-widest uppercase">PRECISION_ROAST</span> */}
              </div>
              <div className="flex flex-col items-center gap-2">
                {/* <div className="p-3 border-2 border-[#222] bg-[#111]">
                  <Cpu className="w-5 h-5 text-gray-400" />
                </div> */}
                {/* <span className="text-[10px] font-black text-gray-600 tracking-widest uppercase">GEMINI_SYNTHESIS</span> */}
              </div>
              <div className="flex flex-col items-center gap-2">
                {/* <div className="p-3 border-2 border-[#222] bg-[#111]">
                  <Flame className="w-5 h-5 text-gray-400" />
                </div> */}
                {/* <span className="text-[10px] font-black text-gray-600 tracking-widest uppercase">INSTANT_BURN</span> */}
              </div>
            </div>
          </div>
        </motion.div>
      </LiquidOcean>
    </div>
  );
};

export default LandingPage;
