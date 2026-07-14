import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { 
  Sparkles, 
  Upload, 
  Cpu, 
  MessageSquare, 
  TrendingUp, 
  Play, 
  FileText, 
  ArrowRight,
  ShieldCheck,
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
      description: 'Upload your resume for instant ATS scores, keyword checks, and improvement tips.',
      icon: Upload,
      color: 'from-blue-500 to-indigo-500'
    },
    {
      title: 'AI Simulator Arena',
      description: 'Simulate coding or behavioral loops with custom roles, stack filters, and levels.',
      icon: Cpu,
      color: 'from-violet-500 to-fuchsia-500'
    },
    {
      title: 'Multimodal Inputs',
      description: 'Answer questions in realistic layouts using text typing or voice recording mode.',
      icon: MessageSquare,
      color: 'from-pink-500 to-rose-500'
    },
    {
      title: 'Precision Scorecards',
      description: 'Review instant AI metrics for technical depth, confidence indexes, and answers.',
      icon: TrendingUp,
      color: 'from-emerald-500 to-teal-500'
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

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Staff Frontend Engineer at Stripe',
      quote: 'PrepAI was absolute key for my preparation. The simulated voice mode made me feel exactly like I was presenting in front of an interviewer. I landed my target role!',
      initials: 'SC'
    },
    {
      name: 'Marcus Brody',
      role: 'Senior Backend Developer at Amazon',
      quote: 'The ATS scan found 4 critical missing keywords in my resume. Combined with the hard-mode database system design simulations, this app got me fully prepared.',
      initials: 'MB'
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
      
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] pointer-events-none opacity-30 dark:opacity-20 z-0">
        <div className="absolute top-10 left-1/4 w-[300px] h-[300px] rounded-full bg-indigo-600 blur-[120px]" />
        <div className="absolute top-40 right-1/4 w-[250px] h-[250px] rounded-full bg-violet-500 blur-[100px]" />
      </div>

      {/* Hero Section */}
      <section className="relative max-w-7xl mx-auto pt-20 pb-16 px-6 text-center z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold mb-6 bg-indigo-500/10 text-indigo-400 border-indigo-500/20 backdrop-blur-sm animate-pulse">
          <Sparkles className="h-4.5 w-4.5 text-indigo-400" />
          <span>Next-Gen AI Interview Trainer</span>
        </div>
        
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-7xl leading-tight tracking-tight max-w-4xl mx-auto mb-6">
          Nail Your Next Interview with{' '}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-violet-500 to-fuchsia-500">
            Real-Time AI feedback
          </span>
        </h1>
        
        <p className={`text-base sm:text-lg lg:text-xl max-w-xl mx-auto mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
          Scan your resume for ATS gaps, run realistic mock interview sessions, and get detailed AI feedback in minutes.
        </p>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25"
          >
            <span>Start Practice Free</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
          <Link
            to="/login"
            className={`w-full sm:w-auto border font-bold px-8 py-4 rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 ${
              theme === 'dark' 
                ? 'border-dark-border text-gray-300 hover:bg-dark-hover hover:text-white' 
                : 'border-light-border text-gray-700 hover:bg-light-hover hover:text-gray-900'
            }`}
          >
            <Play className="h-4.5 w-4.5 text-indigo-500 fill-indigo-500" />
            <span>Interactive Demo</span>
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto py-16 px-6 relative z-10 border-t border-dashed border-gray-500/20">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl mb-4">
            A Complete Tech Interview Toolkit
          </h2>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Everything you need to benchmark your technical and communication skill sets against production benchmarks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div 
                key={feat.title}
                className={`glow-card p-6 border transition-all duration-300 flex flex-col justify-between ${
                  theme === 'dark' ? 'bg-dark-card/50 border-dark-border' : 'bg-white border-light-border'
                }`}
              >
                <div>
                  <div className={`p-3 rounded-xl bg-gradient-to-tr ${feat.color} text-white w-12 h-12 flex items-center justify-center mb-6`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-display font-bold text-lg mb-2">{feat.title}</h3>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {feat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works Section */}
      <section className={`py-20 px-6 relative border-t border-dashed border-gray-500/20 ${theme === 'dark' ? 'bg-dark-card/10' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-16">
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl mb-4">
              How It Works
            </h2>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Follow four simple steps to audit your skills, analyze metrics, and prepare for your loops.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, idx) => (
              <div key={s.step} className="relative space-y-4">
                <div className="flex items-center gap-3">
                  <div className="font-display font-extrabold text-4xl bg-clip-text text-transparent bg-gradient-to-tr from-indigo-500 to-violet-500">
                    {s.step}
                  </div>
                  <div className={`h-px flex-1 ${theme === 'dark' ? 'bg-dark-border' : 'bg-gray-200'} ${idx === steps.length - 1 ? 'hidden lg:block lg:opacity-0' : ''}`} />
                </div>
                <h3 className="font-display font-bold text-lg">{s.title}</h3>
                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto py-16 px-6 border-t border-dashed border-gray-500/20">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="font-display font-extrabold text-2xl sm:text-4xl mb-4">
            Trusted by Software Engineers
          </h2>
          <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
            Read how other developers used PrepAI to land technical positions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((t) => (
            <div 
              key={t.name}
              className={`p-8 rounded-2xl border flex flex-col justify-between ${
                theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-white border-light-border shadow-sm'
              }`}
            >
              <p className={`italic mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold font-display">
                  {t.initials}
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{t.name}</h4>
                  <p className="text-xs text-gray-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing Comparison */}
      <section className={`py-16 px-6 border-t border-dashed border-gray-500/20 ${theme === 'dark' ? 'bg-dark-card/10' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-xl mx-auto mb-12">
            <h2 className="font-display font-extrabold text-2xl sm:text-4xl mb-4">
              Flexible Practice Tiers
            </h2>
            <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
              Get started with free diagnostic practice, or unlock unlimited customization tools.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Free tier */}
            <div className={`p-8 rounded-2xl border flex flex-col justify-between ${
              theme === 'dark' ? 'bg-dark-card border-dark-border' : 'bg-white border-light-border'
            }`}>
              <div className="space-y-4">
                <h3 className="font-display font-bold text-lg text-gray-400">Free Tier</h3>
                <div className="font-display font-extrabold text-4xl">
                  $0 <span className="text-sm font-normal text-gray-500">/ forever</span>
                </div>
                <p className="text-sm text-gray-500">Perfect for initial ATS resume scan diagnostic audits.</p>
                <div className="space-y-2 pt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>1 ATS Resume Compatibility Scan</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>3 Mock AI Interview Questions</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Basic Text-Mode responses</span>
                  </div>
                </div>
              </div>
              <Link 
                to="/register" 
                className={`w-full text-center font-bold px-4 py-3 rounded-xl border mt-8 transition-all duration-200 ${
                  theme === 'dark' ? 'border-dark-border hover:bg-dark-hover text-gray-300' : 'border-light-border hover:bg-light-hover text-gray-700'
                }`}
              >
                Sign Up Free
              </Link>
            </div>

            {/* Pro tier */}
            <div className="p-8 rounded-2xl border border-indigo-500/50 bg-gradient-to-b from-indigo-900/10 to-violet-950/10 dark:from-indigo-950/20 dark:to-transparent relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 bg-indigo-500 text-white text-xs font-bold font-display px-3 py-1 rounded-bl-xl uppercase tracking-wider">
                Popular
              </div>
              <div className="space-y-4">
                <h3 className="font-display font-bold text-lg text-indigo-400 flex items-center gap-1.5">
                  <Zap className="h-4 w-4 fill-indigo-400" />
                  <span>Pro Member</span>
                </h3>
                <div className="font-display font-extrabold text-4xl">
                  $19 <span className="text-sm font-normal text-gray-500">/ month</span>
                </div>
                <p className="text-sm text-gray-500">Complete toolset for serious candidates in active search loops.</p>
                <div className="space-y-2 pt-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-indigo-500" />
                    <span>Unlimited ATS Resume Scans</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-indigo-500" />
                    <span>Unlimited Mock Interviews</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-indigo-500" />
                    <span>Simulated Voice Mode + Transcripts</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-indigo-500" />
                    <span>Interactive Performance Score Analytics</span>
                  </div>
                </div>
              </div>
              <Link 
                to="/register" 
                className="w-full text-center bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white font-bold px-4 py-3 rounded-xl mt-8 transition-all duration-200 shadow-md shadow-indigo-500/20"
              >
                Go Pro Now
              </Link>
            </div>
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
