
import React, { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import html2canvas from 'html2canvas';
import { GitHubUserData, RoastData } from '../types';
import { 
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { 
  LayoutDashboard, BookOpen, GitCommit, Code2, Users, Share2, 
  ArrowLeft, Star, GitFork, Trash2, Github,
  Twitter, Download, RefreshCw, Zap, Award, ShieldAlert, Cpu, Check, Eye, Clock, MessageSquare
} from 'lucide-react';

interface Props {
  userData: GitHubUserData;
  roastData: RoastData;
  onReset: () => void;
}

const Dashboard: React.FC<Props> = ({ userData, roastData, onReset }) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isDownloading, setIsDownloading] = useState(false);
  const shareCardRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'repos', label: 'Repos', icon: BookOpen },
    { id: 'commits', label: 'Commits', icon: GitCommit },
    { id: 'languages', label: 'Languages', icon: Code2 },
    { id: 'social', label: 'Social', icon: Users },
    { id: 'share', label: 'Share', icon: Share2 },
  ];

  const languageData = useMemo(() => {
    const total = Object.values(userData.languages).reduce((acc, curr) => acc + curr, 0);
    return Object.entries(userData.languages)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count], index) => ({
        name,
        value: count,
        percentage: ((count / total) * 100).toFixed(1),
        color: ['#00ff88', '#ff0055', '#3b82f6', '#ffaa00', '#a855f7', '#666'][index % 6]
      }));
  }, [userData.languages]);

  const commitActivityData = useMemo(() => {
    return userData.commitHoursDistribution.map((count, hour) => ({
      hour: `${hour}:00`,
      count,
      displayHour: hour
    }));
  }, [userData.commitHoursDistribution]);

  const handleShareTwitter = () => {
    const text = `I just got absolutely roasted! 💀\n\n"${roastData.bestOneLiners[0]}"\n\nSee your profile audit at REPOCRITIC.VERCEL.APP #GitHubRoast #DevCulture`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  };

  const handleDownloadImage = async () => {
    if (!shareCardRef.current) return;
    
    setIsDownloading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 150));
      
      const canvas = await html2canvas(shareCardRef.current, {
        backgroundColor: '#050505',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      });
      
      const image = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = image;
      link.download = `audit-${userData.username}.png`;
      link.click();
    } catch (err) {
      console.error('Failed to generate image', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const StatCard = ({ icon: Icon, value, label, roast, color = "#00ff88" }: any) => (
    <motion.div 
      whileHover={{ y: -4, borderColor: color }}
      className="bg-[#111] border-2 border-[#222] p-5 transition-colors group"
    >
      <div className="flex items-center gap-3 mb-3">
        <Icon className="w-5 h-5" style={{ color }} />
        <span className="text-xs uppercase tracking-widest text-gray-500 font-bold">{label}</span>
      </div>
      <div className="text-3xl font-bold mb-2 mono-font tracking-tight">{value}</div>
      <p className="text-xs text-gray-500 leading-tight italic">"{roast}"</p>
    </motion.div>
  );

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-black border-2 border-[#00ff88] p-3 shadow-2xl z-50 pointer-events-none">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2" style={{ backgroundColor: payload[0].payload.color || '#00ff88' }} />
            <p className="text-white font-black mono-font uppercase text-[10px] tracking-widest">{payload[0].name || 'VAL'}</p>
          </div>
          <p className="text-[#00ff88] font-bold mono-font text-xs uppercase">{payload[0].value} UNITS</p>
        </div>
      );
    }
    return null;
  };

  const auditId = useMemo(() => Math.random().toString(36).substring(2, 10).toUpperCase(), []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24 text-white">
      <header className="sticky top-0 z-30 bg-[#0a0a0a]/90 backdrop-blur-xl border-b-2 border-[#222]">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onReset}
              className="p-3 hover:bg-[#111] border-2 border-[#222] hover:border-[#00ff88] transition-all group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:text-[#00ff88]" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 border-2 border-[#00ff88] overflow-hidden">
                <img src={userData.avatarUrl} alt={userData.username} className="w-full h-full object-cover" />
              </div>
              <div>
                <span className="block font-black heading-font tracking-tighter text-xl leading-none">{userData.username.toUpperCase()}</span>
                <span className="text-[10px] mono-font text-[#ff0055] font-bold">STATUS: ROASTED</span>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex gap-2">
            <motion.a 
              href="https://github.com/srivathsav004/roast-my-github" 
              target="_blank" 
              className="relative group flex items-center gap-2 px-5 py-2.5 border-2 border-[#222] bg-[#111] hover:border-[#ffaa00] transition-all text-xs font-black tracking-widest overflow-hidden"
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#ffaa00]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <motion.div 
                className="relative z-10 flex items-center gap-2"
              >
                <Star className="w-4 h-4 group-hover:fill-[#ffaa00] transition-all" />
                <span className="group-hover:text-[#ffaa00] transition-colors">STAR_MY_REPO</span>
              </motion.div>
              <motion.div 
                className="absolute -top-1 -right-1 w-2 h-2 bg-[#ffaa00] rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.a>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-6 overflow-x-auto scrollbar-hide">
          <nav className="flex items-center gap-1 sm:gap-4 min-w-max">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-4 px-4 text-[10px] sm:text-xs font-black uppercase tracking-[0.2em] transition-all relative ${
                  activeTab === tab.id 
                    ? 'text-[#00ff88]' 
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-[#00ff88]" />
                )}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 pt-10">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 flex flex-col items-center justify-center bg-[#111] border-2 border-[#222] p-8 text-center relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[#ff0055]" />
                  <div className="w-32 h-32 border-4 border-[#ff0055] overflow-hidden mb-6">
                    <img src={userData.avatarUrl} alt={userData.username} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                  </div>
                  <h2 className="text-3xl font-black mb-1 tracking-tighter heading-font uppercase">{userData.name}</h2>
                  <p className="text-[#00ff88] mono-font text-sm mb-6">ID: {userData.username}</p>
                  <div className="bg-black/40 p-4 border border-[#222] mb-6">
                    <p className="text-gray-400 italic text-sm">"{userData.bio || 'Silence is better than your code.'}"</p>
                  </div>
                  <div className="flex flex-wrap justify-center gap-2">
                    <span className="px-3 py-1 bg-[#1a1a1a] border border-[#333] text-[10px] text-gray-400 font-black uppercase">CLASS: {userData.accountAgeYears > 5 ? 'VETERAN' : 'NEWBIE'}</span>
                    <span className="px-3 py-1 bg-[#1a1a1a] border border-[#333] text-[10px] text-gray-400 font-black uppercase">LVL: {userData.publicRepos}</span>
                  </div>
                </div>
                
                <div className="lg:col-span-2 bg-black border-4 border-[#ff0055] p-8 sm:p-12 relative flex flex-col justify-center shadow-[15px_15px_0px_rgba(255,0,85,0.1)]">
                  <div className="absolute top-4 right-6 text-[40px] sm:text-[80px] opacity-10 select-none font-black italic heading-font text-[#ff0055]">UNFILTERED</div>
                  <div className="flex items-center gap-3 mb-8">
                    {/* <ShieldAlert className="w-8 h-8 text-[#ff0055]" /> */}
                    <h3 className="text-2xl font-black text-[#ff0055] uppercase tracking-tighter heading-font">VERDICT</h3>
                  </div>
                  <p className="text-2xl sm:text-4xl font-bold heading-font leading-[1.1] text-white tracking-tight">
                    {roastData.overviewRoast}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard icon={BookOpen} label="Total Projects" value={userData.repoCount} roast="A cemetery of half-baked ideas." />
                <StatCard icon={Star} label="Star Power" value={userData.totalStars} color="#ffaa00" roast="Most are probably pity stars." />
                <StatCard icon={GitCommit} label="Annual Pushes" value={userData.totalContributionsYear} color="#ff0055" roast="'Fixed typo' doesn't count as work." />
                <StatCard icon={Code2} label="Tech Stack" value={Object.keys(userData.languages).length} color="#00ff88" roast="Mediocrity in 12 languages." />
                <StatCard icon={Users} label="Followers" value={userData.followers} color="#3b82f6" roast="Likely bots or family members." />
                <StatCard icon={Award} label="Experience" value={`${userData.accountAgeYears}Y`} color="#a855f7" roast="All those years and still no exit." />
              </div>
            </motion.div>
          )}

          {activeTab === 'repos' && (
            <motion.div key="repos" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <h3 className="text-4xl font-black tracking-tighter uppercase heading-font text-[#ff0055]">PROJECT FAILURES</h3>
              <div className="space-y-4">
                {userData.topRepos.map((repo, i) => (
                  <div key={repo.name} className="bg-[#111] border-2 border-[#222] p-6 flex flex-col md:flex-row justify-between gap-6 hover:border-[#ff0055] transition-all">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-2xl font-black text-[#00ff88] uppercase italic">{repo.name}</h4>
                        {i === 0 && <span className="text-[10px] bg-[#ffaa00] text-black px-2 py-0.5 font-bold">TOP_FAILURE</span>}
                      </div>
                      <p className="text-gray-400 text-sm mb-6 max-w-2xl">{repo.description || "No documentation? Just like your career path."}</p>
                      <div className="flex gap-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">
                        <span className="flex items-center gap-1.5"><Star className="w-3 h-3 text-[#ffaa00]" /> {repo.stars} STARS</span>
                        <span className="flex items-center gap-1.5"><GitFork className="w-3 h-3 text-[#3b82f6]" /> {repo.forks} FORKS</span>
                        <span className="flex items-center gap-1.5"><Code2 className="w-3 h-3 text-[#00ff88]" /> {repo.language}</span>
                      </div>
                    </div>
                    <div className="md:w-1/3 bg-black border border-[#333] p-6 flex items-center italic">
                      <p className="text-sm text-gray-300 leading-relaxed">
                        "{roastData.repoRoasts.find(r => r.repo === repo.name)?.roast || 'Standard boilerplate garbage.'}"
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'languages' && (
            <motion.div key="languages" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
              <h3 className="text-4xl font-black tracking-tighter uppercase heading-font text-[#00ff88]">STACK ANALYSIS</h3>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                <div className="bg-[#111] border-2 border-[#222] p-8 flex flex-col items-center justify-between min-h-[550px]">
                  <div className="w-full flex justify-between items-center mb-6">
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">MODALITY: {userData.topLanguage}</span>
                    <Code2 className="w-5 h-5 text-[#00ff88]" />
                  </div>
                  
                  <div className="h-[300px] w-full relative">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={languageData}
                          cx="50%"
                          cy="50%"
                          innerRadius={85}
                          outerRadius={115}
                          paddingAngle={6}
                          dataKey="value"
                          stroke="none"
                        >
                          {languageData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip 
                          content={<CustomTooltip />} 
                          cursor={{ fill: 'transparent' }}
                          wrapperStyle={{ zIndex: 100 }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                       <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 opacity-60">DOMINANT</span>
                       <span className="text-3xl font-black text-white heading-font tracking-tighter uppercase leading-none">{userData.topLanguage}</span>
                    </div>
                  </div>

                  <div className="w-full mt-10">
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {languageData.map((lang) => (
                          <div 
                            key={lang.name}
                            className="bg-black/60 border border-[#333] px-3 py-3 flex items-center gap-3 hover:border-[#00ff88] transition-all hover:bg-black/80"
                          >
                            <div className="w-3 h-3 shrink-0 rounded-full" style={{ backgroundColor: lang.color }} />
                            <div className="flex flex-col min-w-0">
                              <span className="text-[10px] font-black text-white uppercase truncate tracking-tighter">{lang.name}</span>
                              <span className="text-[9px] font-bold text-[#00ff88] leading-none">{lang.percentage}%</span>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-6">
                   <div className="flex-1 bg-black border-4 border-[#00ff88] p-10 shadow-[15px_15px_0px_rgba(0,255,136,0.05)] relative overflow-hidden flex items-center">
                      <div className="absolute bottom-2 right-2 text-6xl font-black italic text-[#00ff88] opacity-10 select-none">CRITIQUE</div>
                      <p className="text-2xl sm:text-3xl font-bold heading-font leading-tight italic text-white relative z-10">
                        {roastData.languageRoast}
                      </p>
                   </div>
                   
                   {/* <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 bg-[#111] border-2 border-[#222] text-center flex flex-col justify-center">
                        <div className="text-4xl font-black text-[#ff0055] mb-1 heading-font">{roastData.diversityScore}</div>
                        <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest">DIVERSITY_INDEX</div>
                      </div>
                      <div className="p-6 bg-[#111] border-2 border-[#222] text-center flex flex-col justify-center">
                        <div className="text-4xl font-black text-[#00ff88] mb-1 heading-font">{roastData.effortScore}</div>
                        <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest">COMPLEXITY_LVL</div>
                      </div>
                   </div> */}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'commits' && (
            <motion.div key="commits" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
              <h3 className="text-4xl font-black tracking-tighter uppercase heading-font text-[#ff0055]">WORK ETHIC ANALYSIS</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Roast & Consistency */}
                <div className="bg-black border-4 border-[#ff0055] p-8 shadow-[10px_10px_0px_rgba(255,0,85,0.1)] relative overflow-hidden flex flex-col justify-center">
                   <div className="absolute top-0 right-0 p-4 opacity-5">
                      <ShieldAlert className="w-32 h-32 text-[#ff0055]" />
                   </div>
                   <h4 className="text-xl font-black mb-6 flex items-center gap-3 uppercase heading-font text-[#ff0055]">
                    <Zap className="w-5 h-5 fill-current" /> BEHAVIORAL_AUDIT
                  </h4>
                  <p className="text-3xl font-bold heading-font mb-10 italic leading-tight text-white relative z-10">
                    {roastData.commitRoast}
                  </p>
                  <div className="space-y-6 relative z-10 bg-black/40 p-6 border border-[#222]">
                    <div className="flex justify-between items-end">
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">COMMIT_CONSISTENCY_SCORE</span>
                      <span className="text-2xl font-black text-[#ff0055] mono-font">{roastData.consistencyScore}%</span>
                    </div>
                    <div className="h-4 bg-[#1a1a1a] border border-[#333] w-full p-0.5">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${roastData.consistencyScore}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="h-full bg-[#ff0055] shadow-[0_0_10px_rgba(255,0,85,0.5)]" 
                      />
                    </div>
                    <p className="text-[10px] text-gray-600 italic uppercase">SYSTEM_NOTE: INCONSISTENCY DETECTED. EGO OVERFLOW LIKELY.</p>
                  </div>
                </div>

                {/* 24H Activity Chart */}
                <div className="bg-[#111] border-2 border-[#222] p-8 flex flex-col">
                  <div className="flex justify-between items-center mb-10">
                    <h4 className="text-xl font-black uppercase tracking-widest text-[#3b82f6] flex items-center gap-3">
                       <Clock className="w-5 h-5" /> 24H_ACTIVITY_CYCLE
                    </h4>
                    <div className="px-3 py-1 bg-black border border-[#222] text-[10px] text-[#3b82f6] font-black">PEAK: {userData.peakHour}:00</div>
                  </div>
                  
                  <div className="flex-1 h-[250px] w-full min-h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={commitActivityData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" vertical={false} />
                        <XAxis 
                          dataKey="displayHour" 
                          stroke="#444" 
                          fontSize={10} 
                          tickLine={false} 
                          axisLine={false}
                          tickFormatter={(val) => `${val}h`}
                        />
                        <YAxis hide />
                        <Tooltip 
                          content={<CustomTooltip />} 
                          cursor={{ fill: 'rgba(59, 130, 246, 0.1)' }}
                        />
                        <Bar 
                          dataKey="count" 
                          fill="#3b82f6" 
                          radius={[2, 2, 0, 0]}
                        >
                          {commitActivityData.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.displayHour === userData.peakHour ? '#00ff88' : '#3b82f6'} 
                              fillOpacity={0.8}
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  
                  <div className="mt-8 pt-8 border-t border-[#222] grid grid-cols-2 gap-4">
                     <div className="space-y-1">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">BURST_MODE</span>
                        <p className="text-sm font-bold text-white italic">
                          {userData.peakHour < 6 ? "NOCTURNAL_GREMLIN" : "OFFICE_NORMIE"}
                        </p>
                     </div>
                     <div className="space-y-1">
                        <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">RELIABILITY</span>
                        <p className="text-sm font-bold text-white italic">
                          {roastData.consistencyScore > 70 ? "ROBOTIC_DRIVE" : "FLAKY_AT_BEST"}
                        </p>
                     </div>
                  </div>
                </div>
              </div>

              {/* Commit Message Log */}
              {/* <div className="bg-[#050505] border-2 border-[#222] p-8">
                 <div className="flex items-center gap-3 mb-8 border-b border-[#222] pb-4">
                    <MessageSquare className="w-5 h-5 text-gray-500" />
                    <h4 className="text-xl font-black uppercase tracking-[0.3em] text-gray-500">RAW_COMMIT_STREAM_LOG</h4>
                 </div>
                 <div className="space-y-4">
                    {userData.recentCommitMessages.length > 0 ? (
                      userData.recentCommitMessages.map((msg, idx) => (
                        <div key={idx} className="flex gap-4 group">
                           <span className="text-gray-700 mono-font text-xs pt-1">[{idx.toString().padStart(2, '0')}]</span>
                           <div className="flex-1 bg-[#111] p-4 border border-[#222] group-hover:border-[#00ff88] transition-colors relative overflow-hidden">
                              <div className="absolute top-0 right-0 w-1 h-full bg-[#ff0055] opacity-20 group-hover:opacity-100 transition-opacity" />
                              <code className="text-sm text-gray-300 block mb-1">
                                {msg}
                              </code>
                              <span className="text-[8px] font-black text-gray-600 uppercase tracking-tighter">
                                {msg.toLowerCase().includes('fix') ? 'STATUS: DESPERATE_PATCH' : 'STATUS: UNKNOWN_PAYLOAD'}
                              </span>
                           </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-gray-700 italic mono-font">
                        NO_PUBLIC_PUSH_EVENTS_DETECTED_IN_LOG
                      </div>
                    )}
                 </div>
              </div> */}
            </motion.div>
          )}

          {activeTab === 'social' && (
            <motion.div key="social" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="bg-[#111] border-2 border-[#222] p-12 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#3b82f6] opacity-5 -translate-y-1/2 translate-x-1/2 rotate-45" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                  <div className="space-y-10">
                    <h3 className="text-4xl font-black heading-font text-[#3b82f6] uppercase tracking-tighter">SOCIAL_RELEVANCE_ZERO</h3>
                    <p className="text-3xl font-bold heading-font leading-tight italic">
                      {roastData.socialRoast}
                    </p>
                    <div className="flex gap-16">
                      <div>
                        <div className="text-5xl font-black text-white heading-font">{userData.followers}</div>
                        <div className="text-xs font-black text-[#3b82f6] uppercase tracking-widest mt-2">FOLLOWERS</div>
                      </div>
                      <div>
                        <div className="text-5xl font-black text-white heading-font">{userData.following}</div>
                        <div className="text-xs font-black text-[#ff0055] uppercase tracking-widest mt-2">FOLLOWING</div>
                      </div>
                    </div>
                  </div>
                  <div className="bg-black border-4 border-[#3b82f6] p-12 text-center shadow-[12px_12px_0px_#3b82f6]">
                    <div className="text-[100px] font-black text-white italic heading-font leading-none tracking-tighter">F-</div>
                    <p className="text-sm font-black text-gray-500 uppercase tracking-[0.5em] mt-4">INFLUENCE_GRADE</p>
                    <p className="mt-8 text-xs italic text-[#3b82f6]">"The ratio is screaming 'unimportant'."</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'share' && (
            <motion.div key="share" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="max-w-2xl mx-auto space-y-12">
              <div ref={shareCardRef} className="bg-[#0f0f0f] border-[4px] border-[#00ff88] p-0 relative overflow-hidden rounded-none shadow-2xl">
                <div className="absolute inset-0 pointer-events-none opacity-[0.08] z-50 bg-[linear-gradient(45deg,transparent_48%,rgba(0,255,136,0.03)_50%,transparent_52%),linear-gradient(-45deg,transparent_48%,rgba(255,0,85,0.03)_50%,transparent_52%)] bg-[length:20px_20px,20px_20px]" />
                
                <div className="bg-gradient-to-r from-[#ff0055] via-[#ff0055]/70 to-[#00ff88] px-6 py-3.5 flex justify-between items-center text-black font-black uppercase text-[9px] tracking-[0.4em] shadow-lg relative overflow-hidden">
                  <div className="absolute inset-0 bg-black/5"></div>
                  <div className="relative flex items-center gap-3">
                    <div className="w-2 h-2 bg-black/50 rounded-full animate-pulse"></div>
                    <span className="drop-shadow-[0_1px_2px_rgba(255,255,255,0.3)]">SYSTEM_AUDIT_COMPLETE</span>
                  </div>
                  <div className="relative text-red-500 font-black text-lg rotate-[-15deg] heading-font leading-none border-2 border-red-500/30 px-2 py-1 rounded">
                    ROASTED
                  </div>
                </div>

                <div className="p-10 sm:p-12 space-y-10 relative">

                  <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start relative z-10">
                    <div className="relative shrink-0">
                      <div className="relative w-40 h-40 bg-black overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-[#cc0044] to-[#00cc66] p-1">
                          <div className="w-full h-full bg-black">
                            <img 
                              src={userData.avatarUrl} 
                              alt={userData.username} 
                              crossOrigin="anonymous"
                              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 brightness-90 contrast-125" 
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0 text-center sm:text-left space-y-6 pt-2">
                      <h4 className="text-4xl sm:text-5xl font-black heading-font tracking-tighter leading-none text-white italic break-words uppercase bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
                        {userData.username}
                      </h4>
                      
                      <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                         <div className="px-3 py-1.5 bg-gradient-to-r from-black/90 to-black/70 border-2 border-[#00ff88]/50 flex items-center gap-2 shadow-lg hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all">
                            <div className="w-2 h-2 bg-[#00ff88] rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-black text-[#00ff88] tracking-widest">GRADE</span>
                            <span className="text-xl font-black text-white italic">F-</span>
                         </div>
                         <div className="px-3 py-1.5 bg-gradient-to-r from-black/90 to-black/70 border-2 border-[#ff0055]/50 flex items-center gap-2 shadow-lg hover:shadow-[0_0_20px_rgba(255,0,85,0.3)] transition-all">
                            <div className="w-2 h-2 bg-[#ff0055] rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-black text-[#ff0055] tracking-widest">CONSISTENCY</span>
                            <span className="text-xl font-black text-white italic">{roastData.consistencyScore}%</span>
                         </div>
                      </div>
                      <div className="text-[11px] mono-font text-gray-300 font-bold tracking-[0.3em] uppercase opacity-90 bg-black/60 backdrop-blur-sm px-3 py-1.5 inline-block border border-gray-700">
                         MEMBER_SINCE: {new Date(userData.createdAt).getFullYear()}
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 pt-6">
                    <div className="bg-gradient-to-br from-[#1a1a1a] via-black to-[#0a0a0a] p-8 border-l-[8px] border-[#ff0055] shadow-2xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#ff0055]/20 to-transparent opacity-60 rounded-bl-full"></div>
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-[#00ff88]/10 to-transparent opacity-40 rounded-tr-full"></div>
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/20 to-transparent pointer-events-none"></div>
                      <p className="text-2xl sm:text-3xl font-black heading-font leading-[1.15] tracking-tight italic text-white relative z-10 uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                        "{roastData.bestOneLiners[0]}"
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 relative z-10">
                    <div className="p-4 bg-gradient-to-br from-[#1a1a1a] via-black to-[#0f0f0f] border-2 border-[#333]/50 text-center hover:border-[#00ff88]/50 hover:shadow-[0_0_25px_rgba(0,255,136,0.2)] transition-all group">
                      <div className="text-3xl font-black text-[#00ff88] heading-font italic tracking-tighter group-hover:scale-110 transition-transform">{userData.repoCount}</div>
                      <div className="text-[10px] font-black text-gray-300 uppercase mt-3 tracking-widest">FAILURES</div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-[#1a1a1a] via-black to-[#0f0f0f] border-2 border-[#333]/50 text-center hover:border-[#ffaa00]/50 hover:shadow-[0_0_25px_rgba(255,170,0,0.2)] transition-all group">
                      <div className="text-3xl font-black text-[#ffaa00] heading-font italic tracking-tighter group-hover:scale-110 transition-transform">{userData.totalStars}</div>
                      <div className="text-[10px] font-black text-gray-300 uppercase mt-3 tracking-widest">PITY_STARS</div>
                    </div>
                    <div className="p-4 bg-gradient-to-br from-[#1a1a1a] via-black to-[#0f0f0f] border-2 border-[#333]/50 text-center hover:border-[#3b82f6]/50 hover:shadow-[0_0_25px_rgba(59,130,246,0.2)] transition-all group">
                      <div className="text-3xl font-black text-[#3b82f6] heading-font italic tracking-tighter group-hover:scale-110 transition-transform">{userData.followers}</div>
                      <div className="text-[10px] font-black text-gray-300 uppercase mt-3 tracking-widest">BOTS</div>
                    </div>
                  </div>

                  <div className="pt-8 border-t border-[#333]/50 flex justify-between items-center opacity-70 relative z-10">
                    <div className="flex items-center gap-4">
                       <div className="flex gap-0.5">
                         <div className="w-1 h-8 bg-[#00ff88]/80"></div>
                         <div className="w-0.5 h-8 bg-[#00ff88]/60"></div>
                         <div className="w-1.5 h-8 bg-[#00ff88]/80"></div>
                         <div className="w-0.5 h-8 bg-[#00ff88]/60"></div>
                         <div className="w-1 h-8 bg-[#00ff88]/80"></div>
                         <div className="w-1.5 h-8 bg-[#00ff88]/80"></div>
                         <div className="w-0.5 h-8 bg-[#00ff88]/60"></div>
                         <div className="w-1 h-8 bg-[#00ff88]/80"></div>
                         <div className="w-0.5 h-8 bg-[#00ff88]/60"></div>
                         <div className="w-1.5 h-8 bg-[#00ff88]/80"></div>
                         <div className="w-1 h-8 bg-[#00ff88]/80"></div>
                         <div className="w-0.5 h-8 bg-[#00ff88]/60"></div>
                         <div className="w-1.5 h-8 bg-[#00ff88]/80"></div>
                         <div className="w-1 h-8 bg-[#00ff88]/80"></div>
                         <div className="w-0.5 h-8 bg-[#00ff88]/60"></div>
                         <div className="w-2 h-8 bg-[#00ff88]/80"></div>
                         <div className="w-0.5 h-8 bg-[#00ff88]/60"></div>
                         <div className="w-1 h-8 bg-[#00ff88]/80"></div>
                         <div className="w-1.5 h-8 bg-[#00ff88]/80"></div>
                         <div className="w-0.5 h-8 bg-[#00ff88]/60"></div>
                         <div className="w-1 h-8 bg-[#00ff88]/80"></div>
                         <div className="w-0.5 h-8 bg-[#00ff88]/60"></div>
                         <div className="w-1.5 h-8 bg-[#00ff88]/80"></div>
                         <div className="w-1 h-8 bg-[#00ff88]/80"></div>
                         <div className="w-0.5 h-8 bg-[#00ff88]/60"></div>
                         <div className="w-1 h-8 bg-[#00ff88]/80"></div>
                         <div className="w-1.5 h-8 bg-[#00ff88]/80"></div>
                         <div className="w-0.5 h-8 bg-[#00ff88]/60"></div>
                         <div className="w-1 h-8 bg-[#00ff88]/80"></div>
                         <div className="w-0.5 h-8 bg-[#00ff88]/60"></div>
                         <div className="w-1.5 h-8 bg-[#00ff88]/80"></div>
                       </div>
                    </div>
                    <a 
                      href="https://repocritic.vercel.app" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-[10px] font-black uppercase mono-font tracking-[0.3em] bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent hover:from-[#00ff88] hover:to-[#00ffee] transition-all cursor-pointer"
                    >
                      REPOCRITIC.VERCEL.APP
                    </a>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={handleShareTwitter}
                  className="flex items-center justify-center gap-3 px-10 py-5 bg-[#00ff88] text-black font-black uppercase heading-font shadow-[8px_8px_0px_rgba(0,255,136,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                >
                  <Twitter className="w-5 h-5" /> SHARE_ON_X
                </button>
                <button 
                  disabled={isDownloading}
                  onClick={handleDownloadImage}
                  className="flex items-center justify-center gap-3 px-10 py-5 bg-white text-black font-black uppercase heading-font shadow-[8px_8px_0px_rgba(255,255,255,0.1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all relative overflow-hidden"
                >
                  {isDownloading ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin" /> GENERATING_PNG...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Download className="w-5 h-5" /> DOWNLOAD_ID_CARD
                    </div>
                  )}
                </button>
                <button 
                  className="sm:col-span-2 flex items-center justify-center gap-3 px-10 py-5 bg-[#ff0055] text-white font-black uppercase heading-font shadow-[8px_8px_0px_rgba(255,0,85,0.2)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                  onClick={onReset}
                >
                  <RefreshCw className="w-5 h-5" /> ROAST_ANOTHER_FAILURE
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 sm:hidden">
        <button 
          onClick={() => setActiveTab('share')}
          className="flex items-center gap-3 px-8 py-4 bg-[#00ff88] text-black font-black uppercase text-xs rounded-none shadow-[8px_8px_0px_rgba(0,0,0,1)] border-2 border-black"
        >
          <Share2 className="w-5 h-5" /> GET_CARD
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
