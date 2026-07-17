import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { 
  Sparkles, 
  ArrowRight, 
  Play,
  Zap,
  Brain,
  Target,
  MessageSquare
} from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';

export default function Hero() {
  const { theme } = useAuthStore();
  const [isMobile, setIsMobile] = useState(false);
  const containerRef = useRef(null);
  
  // Mouse tracking for 3D tilt effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [7, -7]), { stiffness: 100, damping: 30 });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-7, 7]), { stiffness: 100, damping: 30 });

  useEffect(() => {
    // Check if mobile/tablet
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e) => {
    if (isMobile || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Floating animation variants
  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: (i) => ({
      opacity: 1,
      scale: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.25, 0.4, 0.25, 1]
      }
    })
  };

  return (
    <section 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative min-h-[90vh] flex items-center overflow-hidden"
    >
      {/* Advanced Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient Orbs */}
        <motion.div 
          className="absolute top-20 left-[10%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-emerald-500/30 via-teal-500/20 to-transparent blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div 
          className="absolute top-40 right-[15%] w-[350px] h-[350px] rounded-full bg-gradient-to-br from-purple-500/30 via-violet-500/20 to-transparent blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div 
          className="absolute bottom-20 left-[40%] w-[300px] h-[300px] rounded-full bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />
        
        {/* Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(${theme === 'dark' ? '#ffffff' : '#000000'} 1px, transparent 1px),
              linear-gradient(90deg, ${theme === 'dark' ? '#ffffff' : '#000000'} 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20 relative z-10 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* LEFT: Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            className="space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-purple-500/10 border border-emerald-500/20 backdrop-blur-sm"
            >
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span className="text-sm font-semibold bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">
                AI-Powered Interview Mastery
              </span>
            </motion.div>

            {/* Headline */}
            <div className="space-y-4">
              <h1 className="font-display font-black text-5xl sm:text-6xl lg:text-7xl leading-[1.1] tracking-tight">
                <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>
                  Ace Your Next
                </span>
                <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-purple-500 bg-clip-text text-transparent">
                  Tech Interview
                </span>
              </h1>
              
              <p className={`text-lg sm:text-xl max-w-xl leading-relaxed ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                Practice with <span className="font-semibold text-emerald-400">AI-powered mock interviews</span>, 
                get real-time feedback, and master coding, system design, and behavioral questions.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/register"
                  className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 font-bold rounded-2xl text-white overflow-hidden shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300"
                >
                  {/* Animated gradient background */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-teal-500 to-purple-600"
                    animate={{
                      backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    style={{ backgroundSize: '200% 200%' }}
                  />
                  <span className="relative z-10">Start Practicing Free</span>
                  <ArrowRight className="relative z-10 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  to="/login"
                  className={`inline-flex items-center justify-center gap-2 px-8 py-4 font-bold rounded-2xl border-2 transition-all duration-300 ${
                    theme === 'dark'
                      ? 'border-gray-700 text-gray-300 hover:bg-gray-800/50 hover:border-gray-600'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100 hover:border-gray-400'
                  }`}
                >
                  <Play className="h-5 w-5 text-emerald-500 fill-emerald-500" />
                  <span>Watch Demo</span>
                </Link>
              </motion.div>
            </div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-wrap items-center gap-6 pt-4"
            >
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 border-2 border-white dark:border-gray-900" />
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  2,500+ students practicing
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  85% success rate
                </span>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT: 3D Interactive Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8, ease: [0.25, 0.4, 0.25, 1] }}
            className="relative"
          >
            {/* 3D Card Stack */}
            <motion.div
              style={!isMobile ? { rotateX, rotateY, transformStyle: "preserve-3d" } : {}}
              className="relative w-full max-w-lg mx-auto"
            >
              {/* Main Card */}
              <motion.div
                variants={floatingVariants}
                animate="animate"
                className={`relative p-8 rounded-3xl border-2 backdrop-blur-xl shadow-2xl ${
                  theme === 'dark'
                    ? 'bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 border-gray-700/50'
                    : 'bg-gradient-to-br from-white/90 via-gray-50/80 to-white/90 border-gray-200/50'
                }`}
                style={{ transform: "translateZ(50px)" }}
              >
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-purple-500/20 blur-xl" />
                
                <div className="relative z-10 space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-emerald-400">Live Interview Mode</span>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30">
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      <span className="text-xs font-medium text-red-400">Recording</span>
                    </div>
                  </div>

                  {/* Mock Question */}
                  <div className="space-y-3">
                    <p className="text-2xl font-bold leading-tight">
                      "Explain the difference between var, let, and const in JavaScript"
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      {['JavaScript', 'Easy', '5 min'].map((tag, i) => (
                        <span 
                          key={i}
                          className={`px-3 py-1 rounded-lg text-xs font-medium ${
                            theme === 'dark' ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* AI Feedback Preview */}
                  <div className="space-y-2 pt-4 border-t border-gray-700/50 dark:border-gray-300/10">
                    <div className="flex items-center gap-2">
                      <Brain className="h-4 w-4 text-purple-400" />
                      <span className="text-sm font-medium text-gray-400">AI Analyzing...</span>
                    </div>
                    <div className="space-y-1.5">
                      {[
                        { label: 'Technical Accuracy', value: 92 },
                        { label: 'Code Quality', value: 88 },
                        { label: 'Communication', value: 95 }
                      ].map((metric, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-500">{metric.label}</span>
                            <span className="font-semibold text-emerald-400">{metric.value}%</span>
                          </div>
                          <div className="h-1.5 bg-gray-800 dark:bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${metric.value}%` }}
                              transition={{ delay: 0.5 + i * 0.1, duration: 1, ease: "easeOut" }}
                              className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Floating Feature Cards */}
              {[
                { icon: Target, label: '1000+ Questions', color: 'from-emerald-500 to-teal-500', position: 'top-4 -left-16' },
                { icon: MessageSquare, label: 'Voice Mode', color: 'from-purple-500 to-violet-500', position: 'bottom-8 -right-12' },
              ].map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={i}
                    custom={i}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
                    className={`absolute ${feature.position} hidden lg:block`}
                    style={{ transform: `translateZ(${100 + i * 20}px)` }}
                  >
                    <div className={`px-4 py-3 rounded-2xl bg-gradient-to-r ${feature.color} shadow-lg backdrop-blur-sm flex items-center gap-2`}>
                      <Icon className="h-4 w-4 text-white" />
                      <span className="text-sm font-bold text-white whitespace-nowrap">{feature.label}</span>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
