
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { HeroScene, QuantumComputerScene } from './components/QuantumScene';
import { SurfaceCodeDiagram, TransformerDecoderDiagram, PerformanceMetricDiagram } from './components/Diagrams';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Menu, X, BookOpen, Sun, Moon, Languages, ExternalLink, Cpu, Sparkles, ChevronDown, ChevronUp, Zap, Target, ShieldCheck } from 'lucide-react';

// --- Translations ---
const translations = {
  en: {
    common: {
      readMore: "Read More",
      showLess: "Show Less"
    },
    nav: {
      overview: "Overview",
      intro: "Introduction",
      science: "The Surface Code",
      impact: "Impact",
      authors: "Authors",
      viewPaper: "View Paper"
    },
    hero: {
      tag: "Nature • Nov 2024",
      title: "AlphaQubit",
      subtitle: "AI for Quantum Error Correction",
      desc: "A recurrent, transformer-based neural network that learns to decode the surface code with unprecedented accuracy.",
      discover: "DISCOVER"
    },
    overview: {
      label: "PROJECT OVERVIEW",
      title: "Decoding the Future",
      summary: "AlphaQubit represents a landmark collaboration between Google DeepMind and Google Quantum AI, addressing one of the most significant hurdles in quantum computing: error correction. As quantum processors scale, the complexity of noise patterns—including crosstalk and leakage—outpaces traditional human-designed decoders. AlphaQubit leverages a state-of-the-art recurrent transformer architecture to learn these intricate hardware-specific error distributions directly from the Sycamore processor. By treating decoding as a sequence-to-sequence problem, it achieves unprecedented accuracy and robustness. This neural approach significantly lowers the threshold for fault-tolerant operation, paving the way for the realization of large-scale, reliable quantum computation in the near future.",
      metrics: [
        { icon: Cpu, label: "Architecture", value: "Recurrent Transformer" },
        { icon: Target, label: "Platform", value: "Sycamore Processor" },
        { icon: ShieldCheck, label: "Objective", value: "Fault Tolerance" }
      ]
    },
    intro: {
      label: "Introduction",
      title: "The Noise Barrier",
      p1: "Building a large-scale quantum computer requires correcting the errors that inevitably arise in physical systems. The state of the art is the surface code, which encodes information redundantly across many physical qubits.",
      p2: "However, interpreting the noisy signals from these codes—a task called \"decoding\"—is a massive challenge. Complex noise effects like cross-talk and leakage confuse standard algorithms. AlphaQubit uses machine learning to learn these complex error patterns directly from the quantum processor, achieving accuracy far beyond human-designed algorithms."
    },
    science: {
      label: "THE SYSTEM",
      title: "The Surface Code",
      p1: "In a surface code, \"Data Qubits\" hold the quantum information, while \"Stabilizer Qubits\" interspersed between them act as watchdogs. They measure parity checks (X and Z type) to detect errors without destroying the quantum state.",
      p2: "When a data qubit flips, adjacent stabilizers light up. The pattern of these lights is the \"syndrome.\" The decoder's job is to look at the syndrome and guess which data qubit flipped.",
      innovation: "THE INNOVATION",
      innovationTitle: "Neural Decoding",
      innovationP1: "Standard decoders assume simple, independent errors. Real hardware is messier. AlphaQubit treats decoding as a sequence prediction problem, using a Recurrent Transformer architecture.",
      innovationP2: "It ingests the history of stabilizer measurements and uses \"soft\" analog information—probabilities rather than just binary 0s and 1s—to make highly informed predictions about logical errors.",
      resultsTitle: "Outperforming the Standard",
      resultsP1: "AlphaQubit was tested on Google's Sycamore processor and accurate simulations. It consistently outperforms \"Minimum-Weight Perfect Matching\" (MWPM), the industry standard, effectively making the quantum computer appear cleaner than it actually is."
    },
    impact: {
      label: "IMPACT",
      title: "Towards Fault Tolerance",
      p1: "AlphaQubit maintains its advantage even as the code distance increases (up to distance 11). It handles realistic noise including cross-talk and leakage, effects that often cripple standard decoders.",
      p2: "By learning from data directly, machine learning decoders can adapt to the unique quirks of each quantum processor, potentially reducing the hardware requirements for useful quantum computing.",
      quote: "\"Our work illustrates the ability of machine learning to go beyond human-designed algorithms by learning from data directly, highlighting machine learning as a strong contender for decoding in quantum computers.\"",
      cite: "— Bausch et al., Nature (2024)"
    },
    team: {
      label: "RESEARCH TEAM",
      title: "Key Contributors",
      subtitle: "A collaboration between Google DeepMind and Google Quantum AI.",
      footer: "And many others contributing to hardware, theory, and engineering."
    },
    footer: {
      desc: "Visualizing \"Learning high-accuracy error decoding for quantum processors\"",
      note: "Based on research published in Nature (2024). Generated by AI."
    }
  },
  zh: {
    common: {
      readMore: "阅读更多",
      showLess: "收起内容"
    },
    nav: {
      overview: "项目概览",
      intro: "项目介绍",
      science: "表面码技术",
      impact: "研究影响",
      authors: "作者团队",
      viewPaper: "查看论文"
    },
    hero: {
      tag: "《自然》杂志 • 2024年11月",
      title: "AlphaQubit",
      subtitle: "用于量子纠错的人工智能",
      desc: "一种基于循环 Transformer 的神经网络，以前所未有的准确性学习解码量子表面码。",
      discover: "开启探索"
    },
    overview: {
      label: "项目概览",
      title: "解码未来",
      summary: "AlphaQubit 由谷歌 DeepMind 与量子 AI 团队协作研发，利用循环 Transformer 架构直接从 Sycamore 处理器学习复杂的硬件噪声模式。它在解码准确率上实现突破，显著降低了纠错门槛，是迈向容错量子计算的关键一步。",
      metrics: [
        { icon: Cpu, label: "架构模型", value: "循环 Transformer" },
        { icon: Target, label: "实验平台", value: "Sycamore 处理器" },
        { icon: ShieldCheck, label: "核心目标", value: "容错计算" }
      ]
    },
    intro: {
      label: "介绍",
      title: "噪声之墙",
      p1: "构建大规模量子计算机需要纠正物理系统中不可避免产生的错误。目前最先进的技术是“表面码”，它通过在许多物理量子位上冗余编码信息来保护量子态。",
      p2: "然而，解释来自这些代码的噪声信号（即“解码”）是一项巨大的挑战。串扰和泄漏等复杂的噪声效应会干扰标准算法。AlphaQubit 利用机器学习直接从量子处理器中学习这些复杂的错误模式，实现了远超传统算法的准确率。"
    },
    science: {
      label: "核心系统",
      title: "量子表面码",
      p1: "在表面码中，“数据量子位”承载量子信息，而散布在其中的“稳定器量子位”充当监视器。它们执行奇偶校验（X型和Z型）以在不破坏量子态的情况下检测错误。",
      p2: "当数据量子位发生翻转时，相邻的稳定器会亮起。这些亮起的模式被称为“校验子（Syndrome）”。解码器的任务就是观察校验子并推断哪个数据量子位发生了错误。",
      innovation: "核心创新",
      innovationTitle: "神经解码",
      innovationP1: "标准解码器假设错误是简单且相互独立的. 现实硬件则更为复杂。AlphaQubit 将解码视为一个序列预测问题，采用了循环 Transformer 架构。",
      innovationP2: "它接收稳定器测量值的历史记录，并利用“软”模拟信息——即概率而非单纯的二进制0和1——对逻辑错误做出高度知情的预测。",
      resultsTitle: "超越行业标准",
      resultsP1: "AlphaQubit 在谷歌的 Sycamore 处理器和精确模拟中进行了测试。它始终优于行业标准算法“最小权重完美匹配”（MWPM），实际上让量子计算机看起来比实际硬件更“干净”。"
    },
    impact: {
      label: "研究影响",
      title: "迈向容错量子计算",
      p1: "随着编码距离的增加（最高可达11距离），AlphaQubit 依然保持优势。它能处理现实中的噪声，包括常使标准解码器失效的串扰和泄漏效应。",
      p2: "通过直接从数据中学习，机器学习解码器可以适应每个量子处理器的独特特性，从而可能降低实现实用量子计算所需的硬件门槛。",
      quote: "“我们的工作展示了机器学习通过直接从数据中学习，从而超越人为设计的算法的能力，突显了机器学习作为量子计算机解码强有力竞争者的地位。”",
      cite: "— Bausch 等，《自然》(2024)"
    },
    team: {
      label: "研究团队",
      title: "主要贡献者",
      subtitle: "谷歌 DeepMind 与谷歌量子 AI 团队的深度协作成果。",
      footer: "以及许多其他在硬件、理论和工程方面做出贡献的成员。"
    },
    footer: {
      desc: "可视化项目：“学习量子处理器的高精度错误解码”",
      note: "基于 2024 年发表于《自然》杂志的研究。由 AI 生成。"
    }
  }
};

const AuthorCard = ({ name, role, delay }: { name: string, role: string, delay: number }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: delay * 0.1, duration: 0.6 }}
      className="flex flex-col group items-center p-6 md:p-8 bg-white dark:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 shadow-sm hover:shadow-md transition-all duration-300 w-full md:max-w-xs hover:border-nobel-gold/50"
    >
      <h3 className="font-serif text-xl md:text-2xl text-stone-900 dark:text-stone-100 text-center mb-3">{name}</h3>
      <div className="w-12 h-0.5 bg-nobel-gold mb-4 opacity-60"></div>
      <p className="text-[10px] md:text-xs text-stone-500 dark:text-stone-400 font-bold uppercase tracking-widest text-center leading-relaxed">{role}</p>
    </motion.div>
  );
};

// --- Expandable Text Component ---
const ExpandableText: React.FC<{ initial: React.ReactNode, extra: React.ReactNode, lang: 'en' | 'zh' }> = ({ initial, extra, lang }) => {
  const [expanded, setExpanded] = useState(false);
  const t = translations[lang].common;

  return (
    <div className="space-y-6">
      <div>{initial}</div>
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pt-6 border-t border-stone-100 dark:border-stone-800">
              {extra}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <button 
        onClick={() => setExpanded(!expanded)}
        className="group flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-nobel-gold hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
      >
        {expanded ? (
          <>
            <ChevronUp size={14} className="group-hover:-translate-y-0.5 transition-transform" />
            {t.showLess}
          </>
        ) : (
          <>
            <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
            {t.readMore}
          </>
        )}
      </button>
    </div>
  );
};

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [lang, setLang] = useState<'en' | 'zh'>('en');
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedLang = localStorage.getItem('app-lang') as 'en' | 'zh';
    if (savedLang) {
      setLang(savedLang);
    } else {
      const userLang = navigator.language.split('-')[0];
      if (userLang === 'zh') setLang('zh');
    }

    const savedTheme = localStorage.getItem('app-theme') as 'light' | 'dark';
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    setTheme(initialTheme);
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    }

    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('app-theme')) {
        const newTheme = e.matches ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.classList.toggle('dark', newTheme === 'dark');
      }
    };
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      mediaQuery.removeEventListener('change', handleSystemThemeChange);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleTheme = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('app-theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const toggleLang = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    const newLang = lang === 'en' ? 'zh' : 'en';
    setLang(newLang);
    localStorage.setItem('app-lang', newLang);
  };

  const t = translations[lang];

  const scrollToSection = useCallback((id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#F9F8F4] dark:bg-[#0c0c0c] text-stone-800 dark:text-stone-200 selection:bg-nobel-gold selection:text-white transition-colors duration-700">
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled || menuOpen ? 'bg-[#F9F8F4]/90 dark:bg-[#0c0c0c]/90 backdrop-blur-md shadow-sm py-3 md:py-4' : 'bg-transparent py-5 md:py-6'}`}>
        <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 md:gap-4 cursor-pointer" 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="w-7 h-7 md:w-8 md:h-8 bg-nobel-gold rounded-full flex items-center justify-center text-white font-serif font-bold text-lg md:text-xl shadow-sm pb-1">α</div>
            <span className={`font-serif font-bold text-base md:text-lg tracking-wide text-stone-900 dark:text-stone-100`}>
              ALPHAQUBIT <span className="hidden sm:inline font-normal text-stone-500">2024</span>
            </span>
          </motion.div>
          
          <div className="hidden lg:flex items-center gap-6 text-sm font-medium tracking-wide text-stone-600 dark:text-stone-400">
            {['overview', 'introduction', 'science', 'impact', 'authors'].map((id, idx) => (
              <motion.a 
                key={id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                href={`#${id === 'overview' ? 'project-overview' : id}`} 
                onClick={scrollToSection(id === 'overview' ? 'project-overview' : id)} 
                className="hover:text-nobel-gold transition-colors cursor-pointer uppercase"
              >
                {t.nav[id as keyof typeof t.nav]}
              </motion.a>
            ))}
            
            <div className="flex items-center gap-2 pl-4 border-l border-stone-200 dark:border-stone-700">
              <button onClick={() => toggleTheme()} className="p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-full transition-colors text-stone-700 dark:text-stone-300">
                {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
              </button>
              <button onClick={() => toggleLang()} className="flex items-center gap-1.5 p-2 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors text-stone-700 dark:text-stone-300">
                <Languages size={18} />
                <span className="text-xs font-bold uppercase">{lang === 'en' ? 'CN' : 'EN'}</span>
              </button>
            </div>

            <motion.a 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              href="https://doi.org/10.1038/s41586-024-08148-8" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="ml-2 px-5 py-2 bg-stone-900 dark:bg-stone-100 dark:text-stone-900 text-white rounded-full hover:bg-stone-800 dark:hover:bg-stone-300 transition-all shadow-sm"
            >
              {t.nav.viewPaper}
            </motion.a>
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <button 
              className="p-2 text-stone-900 dark:text-stone-100 bg-white/50 dark:bg-stone-800/50 rounded-full border border-stone-200 dark:border-stone-700" 
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div 
              ref={menuRef}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="lg:hidden absolute top-full left-4 right-4 mt-2 overflow-hidden bg-white dark:bg-stone-800 rounded-2xl shadow-xl border border-stone-200 dark:border-stone-700 p-6 flex flex-col gap-6"
            >
              <div className="grid grid-cols-2 gap-4">
                {[
                  { id: 'project-overview', icon: Sparkles, label: t.nav.overview },
                  { id: 'introduction', icon: BookOpen, label: t.nav.intro },
                  { id: 'science', icon: Cpu, label: t.nav.science },
                  { id: 'impact', icon: Target, label: t.nav.impact },
                ].map((item) => (
                  <a key={item.id} href={`#${item.id}`} onClick={scrollToSection(item.id)} className="flex flex-col items-center gap-2 p-3 bg-stone-50 dark:bg-stone-900/50 rounded-xl">
                    <div className="w-8 h-8 rounded-full bg-nobel-gold/10 flex items-center justify-center text-nobel-gold"><item.icon size={16}/></div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 dark:text-stone-400">{item.label}</span>
                  </a>
                ))}
              </div>

              <div className="h-[1px] bg-stone-100 dark:bg-stone-700"></div>

              <div className="flex justify-between items-center">
                <div className="flex gap-3">
                  <button onClick={() => toggleTheme()} className="flex items-center gap-2 px-4 py-2 bg-stone-50 dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700">
                    {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
                    <span className="text-xs font-bold uppercase">{theme === 'light' ? 'Night' : 'Day'}</span>
                  </button>
                  <button onClick={() => toggleLang()} className="flex items-center gap-2 px-4 py-2 bg-stone-50 dark:bg-stone-900 rounded-lg border border-stone-200 dark:border-stone-700">
                    <Languages size={16} />
                    <span className="text-xs font-bold uppercase">{lang === 'en' ? '中文' : 'EN'}</span>
                  </button>
                </div>
                <a 
                  href="https://doi.org/10.1038/s41586-024-08148-8" 
                  className="flex items-center gap-2 px-4 py-2 bg-nobel-gold text-white rounded-lg font-bold text-xs uppercase"
                >
                  {t.nav.viewPaper} <ExternalLink size={12}/>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* Hero */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden px-4">
        <HeroScene />
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(249,248,244,0.9)_0%,rgba(249,248,244,0.4)_60%,rgba(249,248,244,0)_100%)] dark:bg-[radial-gradient(circle_at_center,rgba(12,12,12,0.95)_0%,rgba(12,12,12,0.6)_60%,rgba(12,12,12,0.2)_100%)]" />

        <div className="relative z-10 container mx-auto text-center">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="inline-block mb-4 px-3 py-1 border border-nobel-gold text-nobel-gold text-[10px] md:text-xs tracking-[0.2em] uppercase font-bold rounded-full backdrop-blur-sm bg-white/30 dark:bg-black/30">{t.hero.tag}</motion.div>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="font-serif text-5xl md:text-7xl lg:text-9xl font-medium leading-tight md:leading-[0.9] mb-6 md:mb-8 text-stone-900 dark:text-stone-100">
            {t.hero.title} <br/><span className="italic font-normal text-stone-600 dark:text-stone-400 text-2xl md:text-5xl block mt-2 md:mt-4">{t.hero.subtitle}</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 0.6 }} className="max-w-2xl mx-auto text-base md:text-xl text-stone-700 dark:text-stone-300 font-light leading-relaxed mb-10 md:mb-12">{t.hero.desc}</motion.p>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 1, repeat: Infinity, repeatType: "reverse" }} className="flex justify-center">
             <a href="#project-overview" onClick={scrollToSection('project-overview')} className="group flex flex-col items-center gap-2 text-xs md:text-sm font-medium text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 transition-colors cursor-pointer">
                <span className="tracking-widest uppercase">{t.hero.discover}</span>
                <span className="p-2 border border-stone-300 dark:border-stone-700 rounded-full group-hover:border-stone-900 dark:group-hover:border-stone-100 transition-colors bg-white/50 dark:bg-stone-800/50"><ArrowDown size={16} /></span>
             </a>
          </motion.div>
        </div>
      </header>

      <main>
        {/* Project Introduction Section */}
        <section id="project-overview" className="py-24 md:py-32 bg-[#F9F8F4] dark:bg-black transition-colors duration-500 overflow-hidden">
          <div className="container mx-auto px-6 md:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-7">
                <div className="inline-block mb-3 text-[10px] font-bold tracking-widest text-nobel-gold uppercase">{t.overview.label}</div>
                <h2 className="font-serif text-4xl md:text-6xl mb-8 leading-tight text-stone-900 dark:text-stone-100">{t.overview.title}</h2>
                <p className="text-xl md:text-2xl text-stone-600 dark:text-stone-400 font-light leading-relaxed mb-10 italic">"{t.overview.summary}"</p>
              </motion.div>
              <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="lg:col-span-5 grid grid-cols-1 gap-4">
                {t.overview.metrics.map((metric, i) => (
                  <div key={i} className="p-6 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl flex items-center gap-6 shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-nobel-gold/10 flex items-center justify-center text-nobel-gold">
                      <metric.icon size={24} />
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">{metric.label}</div>
                      <div className="text-lg font-serif text-stone-900 dark:text-stone-100">{metric.value}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* Noise Barrier Introduction */}
        <section id="introduction" className="py-24 md:py-32 bg-white dark:bg-stone-900 transition-colors duration-500 overflow-hidden">
          <div className="container mx-auto px-6 md:px-12 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="md:col-span-4"
            >
              <div className="inline-block mb-3 text-[10px] font-bold tracking-widest text-stone-500 dark:text-stone-400 uppercase">{t.intro.label}</div>
              <h2 className="font-serif text-4xl md:text-5xl mb-6 leading-tight text-stone-900 dark:text-stone-100">{t.intro.title}</h2>
              <div className="w-16 h-1 bg-nobel-gold mb-6"></div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="md:col-span-8 text-lg md:text-xl text-stone-600 dark:text-stone-400 leading-relaxed"
            >
              <ExpandableText 
                initial={
                  <p>
                    <span className="text-5xl md:text-6xl float-left mr-4 mt-[-4px] md:mt-[-10px] font-serif text-nobel-gold">B</span>{t.intro.p1}
                  </p>
                }
                extra={
                  <p>
                    {t.intro.p2.split('AlphaQubit').map((part, i, arr) => (
                      <React.Fragment key={i}>
                        {part}
                        {i < arr.length - 1 && <strong className="text-stone-900 dark:text-stone-100 font-semibold underline decoration-nobel-gold/30 decoration-2 underline-offset-4">AlphaQubit</strong>}
                      </React.Fragment>
                    ))}
                  </p>
                }
                lang={lang}
              />
            </motion.div>
          </div>
        </section>

        {/* The Science: Surface Code */}
        <section id="science" className="py-24 md:py-32 bg-stone-50 dark:bg-stone-900/50 transition-colors duration-500">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 text-[10px] font-bold tracking-widest uppercase rounded-full mb-6 border border-stone-300 dark:border-stone-700">
                            <BookOpen size={14}/> {t.science.label}
                        </div>
                        <h2 className="font-serif text-4xl md:text-6xl mb-8 text-stone-900 dark:text-stone-100">{t.science.title}</h2>
                        <ExpandableText 
                          initial={<p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 leading-relaxed">{t.science.p1}</p>}
                          extra={<p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 leading-relaxed">{t.science.p2}</p>}
                          lang={lang}
                        />
                    </motion.div>
                    <div className="w-full flex justify-center">
                        <SurfaceCodeDiagram lang={lang} />
                    </div>
                </div>
            </div>
        </section>

        {/* Innovation Section */}
        <section className="py-24 md:py-32 bg-stone-900 dark:bg-stone-950 text-stone-100 overflow-hidden relative transition-colors duration-700">
            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24 items-center">
                     <div className="order-2 lg:order-1 flex justify-center">
                        <TransformerDecoderDiagram lang={lang} />
                     </div>
                     <div className="order-1 lg:order-2">
                        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-800 dark:bg-stone-900 text-nobel-gold text-[10px] font-bold tracking-widest uppercase rounded-full mb-6 border border-stone-700 dark:border-stone-800">{t.science.innovation}</div>
                          <h2 className="font-serif text-4xl md:text-6xl mb-8 text-white">{t.science.innovationTitle}</h2>
                          <ExpandableText 
                            initial={
                              <p className="text-lg md:text-xl text-stone-400 leading-relaxed">
                                {t.science.innovationP1.split('AlphaQubit').map((part, i, arr) => (
                                  <React.Fragment key={i}>
                                    {part}
                                    {i < arr.length - 1 && <strong className="text-white">AlphaQubit</strong>}
                                  </React.Fragment>
                                ))}
                              </p>
                            }
                            extra={<p className="text-lg md:text-xl text-stone-400 leading-relaxed">{t.science.innovationP2}</p>}
                            lang={lang}
                          />
                        </motion.div>
                     </div>
                </div>
            </div>
        </section>

        {/* Results and Performance */}
        <section className="py-24 md:py-32 bg-[#F9F8F4] dark:bg-black transition-colors duration-700">
            <div className="container mx-auto px-6">
                <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-4xl mx-auto text-center mb-16 md:mb-24">
                    <h2 className="font-serif text-4xl md:text-6xl mb-8 text-stone-900 dark:text-stone-100">{t.science.resultsTitle}</h2>
                    <p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 leading-relaxed">{t.science.resultsP1}</p>
                </motion.div>
                <div className="max-w-4xl mx-auto">
                    <PerformanceMetricDiagram lang={lang} />
                </div>
            </div>
        </section>

        {/* Impact Section */}
        <section id="impact" className="py-24 md:py-32 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 transition-colors duration-700">
             <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-24">
                <motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="md:col-span-5 relative">
                    <div className="aspect-square bg-[#F5F4F0] dark:bg-stone-800 rounded-2xl overflow-hidden relative border border-stone-200 dark:border-stone-700 shadow-xl">
                        <QuantumComputerScene theme={theme} />
                        <div className="absolute bottom-4 left-0 right-0 px-4 text-center text-[10px] text-stone-400 dark:text-stone-500 font-serif italic uppercase tracking-widest">Sycamore Architecture Visualization</div>
                    </div>
                </motion.div>
                <div className="md:col-span-7 flex flex-col justify-center">
                    <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
                      <div className="inline-block mb-3 text-[10px] font-bold tracking-widest text-stone-500 dark:text-stone-400 uppercase">{t.impact.label}</div>
                      <h2 className="font-serif text-4xl md:text-5xl mb-8 text-stone-900 dark:text-stone-100">{t.impact.title}</h2>
                      <div className="mb-12">
                        <ExpandableText 
                          initial={<p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 leading-relaxed">{t.impact.p1}</p>}
                          extra={<p className="text-lg md:text-xl text-stone-600 dark:text-stone-400 leading-relaxed">{t.impact.p2}</p>}
                          lang={lang}
                        />
                      </div>
                      <motion.div whileHover={{ scale: 1.02 }} className="p-8 bg-[#F9F8F4] dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl border-l-8 border-l-nobel-gold shadow-sm transition-all">
                          <p className="font-serif italic text-xl md:text-2xl text-stone-800 dark:text-stone-200 mb-6 leading-snug">{t.impact.quote}</p>
                          <span className="text-[10px] md:text-xs font-bold text-stone-500 dark:text-stone-400 tracking-[0.2em] uppercase">{t.impact.cite}</span>
                      </motion.div>
                    </motion.div>
                </div>
             </div>
        </section>

        {/* Authors */}
        <section id="authors" className="py-24 md:py-32 bg-[#F5F4F0] dark:bg-stone-950 border-t border-stone-300 dark:border-stone-800 transition-colors duration-700">
           <div className="container mx-auto px-6">
                <div className="text-center mb-16 md:mb-24">
                    <div className="inline-block mb-3 text-[10px] font-bold tracking-widest text-stone-500 dark:text-stone-400 uppercase">{t.team.label}</div>
                    <h2 className="font-serif text-4xl md:text-6xl mb-6 text-stone-900 dark:text-stone-100">{t.team.title}</h2>
                    <p className="text-lg text-stone-500 dark:text-stone-400 max-w-2xl mx-auto">{t.team.subtitle}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
                    <AuthorCard name="Johannes Bausch" role="Google DeepMind" delay={0} />
                    <AuthorCard name="Andrew W. Senior" role="Google DeepMind" delay={1} />
                    <AuthorCard name="Francisco J. H. Heras" role="Google DeepMind" delay={2} />
                    <AuthorCard name="Thomas Edlich" role="Google DeepMind" delay={3} />
                    <AuthorCard name="Alex Davies" role="Google DeepMind" delay={4} />
                    <AuthorCard name="Michael Newman" role="Google Quantum AI" delay={5} />
                </div>
                <div className="text-center mt-16">
                    <p className="text-sm text-stone-500 dark:text-stone-400 italic px-4 font-serif">{t.team.footer}</p>
                </div>
           </div>
        </section>
      </main>

      <footer className="bg-stone-900 dark:bg-black text-stone-400 dark:text-stone-500 py-16 md:py-24 transition-colors duration-700">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="text-center md:text-left">
                <div className="text-white font-serif font-bold text-2xl md:text-3xl mb-4">AlphaQubit</div>
                <p className="text-xs md:text-sm max-w-sm">{t.footer.desc}</p>
            </div>
            <div className="flex flex-col items-center md:items-end gap-6">
               <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="w-12 h-12 md:w-16 md:h-16 bg-stone-800 rounded-full flex items-center justify-center text-white font-serif font-bold text-xl md:text-2xl pb-1 shadow-lg">α</motion.div>
               <span className="text-[10px] md:text-xs font-mono uppercase tracking-[0.3em] text-stone-500">Google DeepMind × Quantum AI</span>
            </div>
        </div>
        <div className="text-center mt-16 text-[10px] text-stone-600 dark:text-stone-800 px-4 max-w-2xl mx-auto border-t border-stone-800/50 pt-8">{t.footer.note}</div>
      </footer>
    </div>
  );
};

export default App;
