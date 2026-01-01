
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Cpu, BarChart2, Zap } from 'lucide-react';

const diagramTranslations = {
  en: {
    surface: {
      title: "Interactive: Surface Code Detection",
      desc: "Click the grey Data Qubits to inject errors. Watch the colored Stabilizers light up when they detect an odd number of errors.",
      legendError: "Error",
      legendZ: "Z-Check",
      legendX: "X-Check",
      stable: "System is stable.",
      violations: (count: number) => `Detected ${count} parity violations.`
    },
    arch: {
      title: "AlphaQubit Architecture",
      desc: "The model processes syndrome history using a recurrent transformer, attending to spatial and temporal correlations.",
      syndrome: "Syndrome",
      transformer: "Transformer",
      correction: "Correction"
    },
    perf: {
      title: "Performance vs Standard",
      desc: "AlphaQubit consistently achieves lower logical error rates (LER) than the standard Minimum-Weight Perfect Matching (MWPM) decoder.",
      ler: "LOGICAL ERROR RATE (LOWER IS BETTER)",
      standard: "Standard",
      distance: "Distance"
    }
  },
  zh: {
    surface: {
      title: "交互体验：表面码错误检测",
      desc: "点击灰色的“数据量子位”注入错误。观察彩色“稳定器”在检测到奇数个错误时如何亮起。",
      legendError: "错误",
      legendZ: "Z 校验",
      legendX: "X 校验",
      stable: "系统当前稳定。",
      violations: (count: number) => `检测到 ${count} 处奇偶校验违规。`
    },
    arch: {
      title: "AlphaQubit 系统架构",
      desc: "该模型使用循环 Transformer 处理校验子历史，并关注空间和时间上的相关性。",
      syndrome: "校验子序列",
      transformer: "Transformer 单元",
      correction: "错误校正"
    },
    perf: {
      title: "性能对比：AlphaQubit vs 标准算法",
      desc: "AlphaQubit 的逻辑错误率 (LER) 始终低于行业标准 MWPM 解码器。",
      ler: "逻辑错误率（越低越好）",
      standard: "标准算法",
      distance: "编码距离"
    }
  }
};

// --- SURFACE CODE DIAGRAM ---
export const SurfaceCodeDiagram: React.FC<{ lang: 'en' | 'zh' }> = ({ lang }) => {
  const [errors, setErrors] = useState<number[]>([]);
  const t = diagramTranslations[lang].surface;
  
  const adjacency: Record<number, number[]> = {
    0: [0, 1],
    1: [0, 2],
    2: [1, 3],
    3: [2, 3],
    4: [0, 1, 2, 3],
  };

  const toggleError = (id: number) => {
    setErrors(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };

  const activeStabilizers = [0, 1, 2, 3].filter(stabId => {
    let errorCount = 0;
    Object.entries(adjacency).forEach(([dataId, stabs]) => {
        if (errors.includes(parseInt(dataId)) && stabs.includes(stabId)) {
            errorCount++;
        }
    });
    return errorCount % 2 !== 0;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      className="flex flex-col items-center p-8 bg-white dark:bg-stone-800 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-700 my-8 transition-colors duration-500"
    >
      <h3 className="font-serif text-2xl mb-4 text-stone-800 dark:text-stone-100">{t.title}</h3>
      <p className="text-sm text-stone-500 dark:text-stone-400 mb-8 text-center max-w-md leading-relaxed">
        {t.desc}
      </p>
      
      <div className="relative w-64 h-64 bg-stone-50 dark:bg-stone-900 rounded-xl border border-stone-200 dark:border-stone-700 p-4 flex flex-wrap justify-between content-between shadow-inner">
         <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-10">
            <div className="w-2/3 h-2/3 border border-stone-500"></div>
            <div className="absolute w-full h-[1px] bg-stone-500"></div>
            <div className="absolute h-full w-[1px] bg-stone-500"></div>
         </div>

         {[
             {id: 0, x: '50%', y: '20%', type: 'Z', color: 'bg-blue-500'},
             {id: 1, x: '20%', y: '50%', type: 'X', color: 'bg-red-500'},
             {id: 2, x: '80%', y: '50%', type: 'X', color: 'bg-red-500'},
             {id: 3, x: '50%', y: '80%', type: 'Z', color: 'bg-blue-500'},
         ].map(stab => (
             <motion.div
                key={`stab-${stab.id}`}
                animate={{ 
                  scale: activeStabilizers.includes(stab.id) ? 1.15 : 1,
                  backgroundColor: activeStabilizers.includes(stab.id) ? (stab.type === 'Z' ? '#3B82F6' : '#EF4444') : themeIsDark() ? '#292524' : '#E7E5E4'
                }}
                className={`absolute w-12 h-12 -ml-6 -mt-6 flex items-center justify-center text-white text-xs font-black rounded-lg shadow-md transition-all duration-500 ${activeStabilizers.includes(stab.id) ? 'opacity-100 ring-4 ring-nobel-gold/30' : 'opacity-40'}`}
                style={{ left: stab.x, top: stab.y }}
             >
                 {stab.type}
                 {activeStabilizers.includes(stab.id) && (
                   <motion.div 
                     initial={{ opacity: 0, scale: 0 }}
                     animate={{ opacity: 0.5, scale: 2 }}
                     transition={{ repeat: Infinity, duration: 1 }}
                     className="absolute inset-0 rounded-lg bg-white"
                   />
                 )}
             </motion.div>
         ))}

         {[
             {id: 0, x: '20%', y: '20%'}, {id: 1, x: '80%', y: '20%'},
             {id: 4, x: '50%', y: '50%'},
             {id: 2, x: '20%', y: '80%'}, {id: 3, x: '80%', y: '80%'},
         ].map(q => (
             <motion.button
                key={`data-${q.id}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => toggleError(q.id)}
                className={`absolute w-10 h-10 -ml-5 -mt-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 z-10 shadow-sm ${errors.includes(q.id) ? 'bg-stone-800 dark:bg-stone-200 border-stone-900 dark:border-white text-nobel-gold' : 'bg-white dark:bg-stone-800 border-stone-300 dark:border-stone-600 hover:border-nobel-gold'}`}
                style={{ left: q.x, top: q.y }}
             >
                {errors.includes(q.id) && <motion.div initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}><Activity size={18} className="dark:text-stone-900" /></motion.div>}
             </motion.button>
         ))}
      </div>

      <div className="mt-8 flex items-center gap-6 text-[10px] md:text-xs font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-stone-800 dark:bg-stone-200"></div> {t.legendError}</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-blue-500"></div> {t.legendZ}</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-red-500"></div> {t.legendX}</div>
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div 
          key={errors.length === 0 ? 'stable' : 'violations'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="mt-6 h-6 text-sm md:text-base font-serif italic text-stone-600 dark:text-stone-400 font-medium"
        >
          {errors.length === 0 ? t.stable : t.violations(activeStabilizers.length)}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
};

// --- TRANSFORMER DECODER DIAGRAM ---
export const TransformerDecoderDiagram: React.FC<{ lang: 'en' | 'zh' }> = ({ lang }) => {
  const [step, setStep] = useState(0);
  const t = diagramTranslations[lang].arch;

  useEffect(() => {
    const interval = setInterval(() => {
        setStep(s => (s + 1) % 4);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      className="flex flex-col items-center p-8 bg-stone-50 dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 my-8 shadow-2xl transition-colors duration-500"
    >
      <h3 className="font-serif text-2xl mb-4 text-stone-900 dark:text-stone-100">{t.title}</h3>
      <p className="text-sm text-stone-600 dark:text-stone-400 mb-10 text-center max-w-md leading-relaxed">
        {t.desc}
      </p>

      <div className="relative w-full max-w-lg h-64 bg-white dark:bg-stone-900 rounded-2xl shadow-inner overflow-hidden mb-10 border border-stone-200 dark:border-stone-700 flex items-center justify-center gap-10 p-6">
        
        {/* Input Stage */}
        <div className="flex flex-col items-center gap-4">
            <motion.div 
              animate={{ 
                scale: step === 0 ? 1.1 : 1,
                borderColor: step === 0 ? '#C5A059' : themeIsDark() ? '#444' : '#eee'
              }}
              className={`w-20 h-20 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-700 ${step === 0 ? 'bg-nobel-gold/5 shadow-[0_0_15px_rgba(197,160,89,0.2)]' : 'bg-stone-50 dark:bg-stone-800'}`}
            >
                <div className="grid grid-cols-3 gap-1.5">
                    {[...Array(9)].map((_, i) => (
                      <motion.div 
                        key={i} 
                        animate={{ 
                          opacity: step === 0 ? [0.3, 1, 0.3] : 0.2,
                          scale: step === 0 ? [1, 1.2, 1] : 1
                        }}
                        transition={{ repeat: Infinity, duration: 2, delay: i * 0.1 }}
                        className={`w-2.5 h-2.5 rounded-full ${Math.random() > 0.6 ? 'bg-stone-800 dark:bg-stone-200' : 'bg-stone-400 dark:bg-stone-600'}`}
                      ></motion.div>
                    ))}
                </div>
            </motion.div>
            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-stone-500 dark:text-stone-400">{t.syndrome}</span>
        </div>

        <motion.div animate={{ opacity: step >= 1 ? 1 : 0.2, scale: step >= 1 ? 1.2 : 1 }} className="text-nobel-gold"><Zap size={20}/></motion.div>

        {/* Transformer Stage */}
        <div className="flex flex-col items-center gap-4">
             <motion.div 
               animate={{ 
                 scale: (step === 1 || step === 2) ? 1.1 : 1,
                 rotate: step === 1 ? 360 : 0,
                 backgroundColor: (step === 1 || step === 2) ? themeIsDark() ? '#eee' : '#111' : themeIsDark() ? '#1c1917' : '#fafaf9'
               }}
               transition={{ duration: 1.5, ease: "easeInOut" }}
               className={`w-28 h-28 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 transition-all duration-700 relative overflow-hidden ${step === 1 || step === 2 ? 'border-nobel-gold shadow-2xl' : 'border-stone-200 dark:border-stone-700'}`}
             >
                <Cpu size={32} className={(step === 1 || step === 2) ? 'text-nobel-gold animate-pulse' : 'text-stone-300 dark:text-stone-600'} />
                {step === 1 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div 
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: [0, 1, 0], scale: 2 }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                          className="w-full h-full border-2 border-nobel-gold rounded-full"
                        />
                    </div>
                )}
             </motion.div>
             <span className="text-[10px] uppercase font-black tracking-[0.2em] text-stone-500 dark:text-stone-400">{t.transformer}</span>
        </div>

        <motion.div animate={{ opacity: step >= 3 ? 1 : 0.2, scale: step >= 3 ? 1.2 : 1 }} className="text-nobel-gold"><Zap size={20}/></motion.div>

        {/* Output Stage */}
        <div className="flex flex-col items-center gap-4">
            <motion.div 
              animate={{ 
                scale: step === 3 ? 1.1 : 1,
                borderColor: step === 3 ? '#22c55e' : themeIsDark() ? '#444' : '#eee'
              }}
              className={`w-20 h-20 rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-700 ${step === 3 ? 'bg-green-500/10 shadow-[0_0_15px_rgba(34,197,94,0.2)]' : 'bg-stone-50 dark:bg-stone-800'}`}
            >
                {step === 3 ? (
                    <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-3xl font-serif font-black text-green-600 dark:text-green-400">X</motion.span>
                ) : (
                    <span className="text-3xl font-serif text-stone-300 dark:text-stone-600">?</span>
                )}
            </motion.div>
            <span className="text-[10px] uppercase font-black tracking-[0.2em] text-stone-500 dark:text-stone-400">{t.correction}</span>
        </div>

      </div>

      <div className="flex gap-4">
          {[0, 1, 2, 3].map(s => (
              <motion.div 
                key={s} 
                animate={{ 
                  width: step === s ? 48 : 8,
                  backgroundColor: step === s ? '#C5A059' : themeIsDark() ? '#444' : '#d6d3d1'
                }}
                className={`h-2 rounded-full transition-all duration-500`}
              ></motion.div>
          ))}
      </div>
    </motion.div>
  );
};

// --- PERFORMANCE CHART ---
export const PerformanceMetricDiagram: React.FC<{ lang: 'en' | 'zh' }> = ({ lang }) => {
    const [distance, setDistance] = useState<3 | 5 | 11>(5);
    const t = diagramTranslations[lang].perf;
    
    const data = {
        3: { mwpm: 3.5, alpha: 2.9 },
        5: { mwpm: 3.6, alpha: 2.75 },
        11: { mwpm: 0.0041, alpha: 0.0009 } 
    };

    const currentData = data[distance];
    const maxVal = Math.max(currentData.mwpm, currentData.alpha) * 1.35;
    
    const formatValue = (val: number) => {
        if (val < 0.01) return val.toFixed(4) + '%';
        return val.toFixed(2) + '%';
    }

    return (
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row gap-12 items-center p-10 bg-stone-900 text-stone-100 rounded-3xl my-12 border border-stone-800 shadow-2xl relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
                <BarChart2 size={240} />
            </div>

            <div className="flex-1 z-10">
                <h3 className="font-serif text-3xl mb-4 text-nobel-gold">{t.title}</h3>
                <p className="text-stone-400 text-lg mb-8 leading-relaxed">
                    {t.desc}
                </p>
                <div className="flex flex-wrap gap-3 mt-8">
                    {[3, 5, 11].map((d) => (
                        <motion.button 
                            key={d}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setDistance(d as any)} 
                            className={`px-5 py-2.5 rounded-xl text-sm font-black transition-all duration-300 border uppercase tracking-widest ${distance === d ? 'bg-nobel-gold text-stone-900 border-nobel-gold shadow-[0_0_15px_rgba(197,160,89,0.3)]' : 'bg-stone-800/50 text-stone-400 border-stone-700 hover:border-stone-500'}`}
                        >
                            {t.distance} {d}
                        </motion.button>
                    ))}
                </div>
                <div className="mt-10 font-mono text-xs text-stone-500 flex items-center gap-3">
                    <BarChart2 size={16} className="text-nobel-gold" /> 
                    <span className="tracking-[0.2em]">{t.ler}</span>
                </div>
            </div>
            
            <div className="relative w-full max-w-sm h-80 bg-stone-800/30 rounded-2xl border border-stone-700/50 p-8 flex justify-around items-end z-10 backdrop-blur-sm">
                <div className="absolute inset-0 p-8 flex flex-col justify-between pointer-events-none opacity-5">
                   {[...Array(5)].map((_, i) => <div key={i} className="w-full h-[1px] bg-stone-400"></div>)}
                </div>

                {/* MWPM Bar */}
                <div className="w-24 flex flex-col justify-end items-center h-full">
                    <div className="flex-1 w-full flex items-end justify-center relative mb-4">
                        <motion.div 
                          key={`mwpm-${distance}`}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute -top-8 w-full text-center text-xs font-mono text-stone-500 font-black"
                        >
                          {formatValue(currentData.mwpm)}
                        </motion.div>
                        <motion.div 
                            className="w-full bg-stone-700 rounded-t-xl border-t border-x border-stone-600/50 shadow-lg"
                            initial={{ height: 0 }}
                            animate={{ height: `${(currentData.mwpm / maxVal) * 100}%` }}
                            transition={{ type: "spring", stiffness: 100, damping: 15 }}
                        />
                    </div>
                    <div className="h-6 flex items-center text-[10px] font-black text-stone-500 uppercase tracking-[0.2em]">{t.standard}</div>
                </div>

                {/* AlphaQubit Bar */}
                <div className="w-24 flex flex-col justify-end items-center h-full">
                     <div className="flex-1 w-full flex items-end justify-center relative mb-4">
                        <motion.div 
                          key={`alpha-${distance}`}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute -top-8 w-full text-center text-xs font-mono text-nobel-gold font-black"
                        >
                          {formatValue(currentData.alpha)}
                        </motion.div>
                        <motion.div 
                            className="w-full bg-nobel-gold rounded-t-xl shadow-[0_0_30px_rgba(197,160,89,0.2)] relative overflow-hidden"
                            initial={{ height: 0 }}
                            animate={{ height: Math.max(2, (currentData.alpha / maxVal) * 100) + '%' }}
                            transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
                        >
                           <motion.div 
                            animate={{ y: ["-100%", "100%"] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-b from-transparent via-white/30 to-transparent"
                           />
                        </motion.div>
                    </div>
                     <div className="h-6 flex items-center text-[10px] font-black text-nobel-gold uppercase tracking-[0.2em]">AlphaQubit</div>
                </div>
            </div>
        </motion.div>
    )
}

function themeIsDark() {
  return document.documentElement.classList.contains('dark');
}
