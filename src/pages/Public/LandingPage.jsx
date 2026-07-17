import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import Hero from '../../components/landing/Hero';
import FeatureCard from '../../components/landing/FeatureCard';
import { 
  Upload, 
  Cpu, 
  MessageSquare, 
  TrendingUp, 
  Zap,
  CheckCircle,
  HelpCircle,
  ChevronDown
} from 'lucide-react';

export default function LandingPage() {
  const { theme } = useAuthStore();
  const [activeFaq, setActiveFaq] = useState(null);

  const features = [
    {
      title: 'ATS Resume Optimizer',
      description: 'Upload your resume for instant ATS scores, keyword checks, and improvement tips tailored to your target role.',
      icon: Upload,
      gradient: 'from-blue-500 via-indigo-500 to-purple-500'
    },
    {
      title: 'AI Simulator Arena',
      description: 'Simulate realistic coding, behavioral, and technical interviews with custom difficulty levels and tech stacks.',
      icon: Cpu,
      gradient: 'from-violet-500 via-purple-500 to-fuchsia-500'
    },
    {
      title: 'Multimodal Inputs',
      description: 'Answer questions using text or voice mode in realistic interview layouts, perfect for practicing communication.',
      icon: MessageSquare,
      gradient: 'from-pink-500 via-rose-500 to-red-500'
    },
    {
      title: 'Precision Scorecards',
      description: 'Get instant AI-powered feedback with detailed metrics on technical depth, communication, and confidence levels.',
      icon: TrendingUp,
      gradient: 'from-emerald-500 via-teal-500 to-cyan-500'
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Sync Your Resume',
      desc: 'Drag & drop your resume file. Our AI immediately parses your skills and matches them against typical industry demands.'
    },
    {
      step: '02',
      title: 'Customize Your Sandbox',
      desc: 'Choose your desired tech stack, seniority target, difficulty rating, and interview mode (text or simulated voice).'
    },
    {
      step: '03',
      title: 'Perform the Interview',
      desc: 'Interact with simulated AI interview questions, capture voice transcripts, or code answers in real time.'
    },
    {
      step: '04',
      title: 'Analyze & Level Up',
      desc: 'Get aggregate performance feedback, detailed keyword checklists, and structured growth timelines.'
    }
  ];


  const faqs = [
    {
      q: 'How does the voice interview recording work?',
      a: 'The voice option records your audio directly in the browser. It simulates a speech-to-text transcript analyzer that grades pronunciation, structural coherence, and technical vocabulary coverage.'
    },
    {
      q: 'Is there a limit to how many mock interviews I can perform?',
      a: 'The free tier provides 3 full mock interviews. Upgrading to Pro Member grants unlimited resume parsing, custom role-definition parameters, and advanced tech stack customization.'
    },
    {
      q: 'How is the ATS compatibility score calculated?',
      a: 'We parse your resume text and calculate a density check against industry standard keywords for your target role. We check formatting structure, experience duration, and tag gaps.'
    }
  ];

  return (
    <div className="relative overflow-hidden">

      {/* Hero Section - New Component */}
      <Hero />

      {/* Features Grid - Updated with 3D Cards */}
      <section className="max-w-7xl mx-auto py-20 px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <h2 className="font-display font-black text-3xl sm:text-5xl mb-4 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-white dark:via-gray-100 dark:to-white bg-clip-text text-transparent">
            Everything You Need to Succeed
          </h2>
          <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
            A complete toolkit designed for students and early-career professionals preparing for technical interviews.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat, index) => (
            <FeatureCard
              key={feat.title}
              title={feat.title}
              description={feat.description}
              icon={feat.icon}
              gradient={feat.gradient}
              index={index}
            />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className={`py-24 px-6 relative border-t border-gray-200 dark:border-gray-800 ${theme === 'dark' ? 'bg-gradient-to-b from-gray-900 to-black' : 'bg-gradient-to-b from-gray-50 to-white'}`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="font-display font-black text-3xl sm:text-5xl mb-4">
              <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>How It Works</span>
            </h2>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Four simple steps to transform your interview preparation and land your dream role.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, idx) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="relative space-y-4"
              >
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                    className="font-display font-extrabold text-5xl bg-gradient-to-br from-emerald-400 via-teal-500 to-purple-500 bg-clip-text text-transparent"
                  >
                    {s.step}
                  </motion.div>
                  {idx < steps.length - 1 && (
                    <div className={`hidden lg:block h-px flex-1 bg-gradient-to-r from-emerald-500/50 to-transparent`} />
                  )}
                </div>
                <h3 className="font-display font-bold text-xl">{s.title}</h3>
                <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {s.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>


      {/* Pricing Comparison */}
      <section className={`py-20 px-6 border-t border-gray-200 dark:border-gray-800 ${theme === 'dark' ? 'bg-black' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <h2 className="font-display font-black text-3xl sm:text-5xl mb-4">
              <span className={theme === 'dark' ? 'text-white' : 'text-gray-900'}>Simple, Transparent Pricing</span>
            </h2>
            <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Start free, upgrade when you're ready to unlock unlimited practice sessions.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Free tier */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -10 }}
              className={`p-8 rounded-3xl border-2 flex flex-col justify-between transition-all duration-300 ${
                theme === 'dark' ? 'bg-gray-900 border-gray-800 hover:border-gray-700' : 'bg-white border-gray-200 hover:border-gray-300 shadow-lg'
              }`}
            >
              <div className="space-y-6">
                <div>
                  <h3 className="font-display font-bold text-lg text-gray-500 mb-2">Free Tier</h3>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display font-extrabold text-5xl">$0</span>
                    <span className="text-sm font-medium text-gray-500">/ forever</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">Perfect for exploring interview prep tools and getting started.</p>
                <div className="space-y-3 pt-4">
                  {[
                    '1 ATS Resume Scan',
                    '3 Mock Interview Sessions',
                    'Basic Text-Mode Responses',
                    'Performance Feedback'
                  ].map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <Link 
                to="/register" 
                className={`w-full text-center font-bold px-6 py-4 rounded-2xl border-2 mt-8 transition-all duration-300 ${
                  theme === 'dark' ? 'border-gray-700 hover:bg-gray-800 text-gray-300' : 'border-gray-300 hover:bg-gray-100 text-gray-700'
                }`}
              >
                Get Started Free
              </Link>
            </motion.div>

            {/* Pro tier */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="p-8 rounded-3xl border-2 border-emerald-500/50 bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent relative overflow-hidden flex flex-col justify-between shadow-2xl shadow-emerald-500/20"
            >
              <div className="absolute top-0 right-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-xs font-bold font-display px-4 py-1.5 rounded-bl-2xl uppercase tracking-wider">
                Popular
              </div>
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-emerald-400 fill-emerald-400" />
                    <h3 className="font-display font-bold text-lg text-emerald-400">Pro Member</h3>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display font-extrabold text-5xl">$19</span>
                    <span className="text-sm font-medium text-gray-500">/ month</span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">For serious candidates preparing for technical interviews at top companies.</p>
                <div className="space-y-3 pt-4">
                  {[
                    'Unlimited ATS Resume Scans',
                    'Unlimited Mock Interviews',
                    'Voice Mode + Transcripts',
                    'Advanced Analytics Dashboard',
                    'Coding Sandbox Access',
                    'Priority Support'
                  ].map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" />
                      <span className="text-sm font-medium">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                <Link 
                  to="/register" 
                  className="block w-full text-center bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold px-6 py-4 rounded-2xl mt-8 transition-all duration-300 shadow-lg shadow-emerald-500/30"
                >
                  Upgrade to Pro
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Accordion */}
      <section className="max-w-4xl mx-auto py-16 px-6">
        <div className="text-center mb-12">
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl mb-4">
            Frequently Asked Questions
          </h2>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Find quick answers to common questions about the PrepAI system.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = activeFaq === index;
            return (
              <div 
                key={index}
                className={`border rounded-xl transition-all duration-200 overflow-hidden ${
                  theme === 'dark' ? 'bg-dark-card/50 border-dark-border' : 'bg-white border-light-border'
                }`}
              >
                <button
                  onClick={() => setActiveFaq(isOpen ? null : index)}
                  className="w-full px-6 py-4 flex items-center justify-between font-bold text-left gap-4"
                >
                  <span className="flex items-center gap-2.5">
                    <HelpCircle className="h-5 w-5 text-indigo-500" />
                    {faq.q}
                  </span>
                  <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                {isOpen && (
                  <div className={`px-6 pb-4 text-sm leading-relaxed border-t pt-3 ${
                    theme === 'dark' ? 'border-dark-border text-gray-400' : 'border-light-border text-gray-600'
                  }`}>
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
