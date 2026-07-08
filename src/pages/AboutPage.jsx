import React from 'react';
import { Target, Users, Code2, Heart, Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  const team = [
    { name: 'Dr. Evelyn Carter', role: 'Chief AI Scientist', bio: 'Former NLP research lead at Stanford. Designs speech analysis schemas.', initials: 'EC' },
    { name: 'Marcus Sterling', role: 'Head of Engineering', bio: 'Ex-Netflix Staff Architect. Focused on low-latency terminal sandboxes.', initials: 'MS' },
    { name: 'Sonia Patel', role: 'Lead Career Advisor', bio: 'Recruiter with 10+ years experience in technical talent loops at Google.', initials: 'SP' }
  ];

  const values = [
    { title: 'Technical Accuracy', desc: 'Grades syntax compilations, DB normalization paradigms, and algorithmic bounds strictly.', icon: Target },
    { title: 'Simulated Empathy', desc: 'Adapts AI interviewer response tones depending on selected difficulty parameters.', icon: Heart },
    { title: 'Modern Engineering', desc: 'Builds low-latency interactive browser editors, audio recorders, and ATS density calculators.', icon: Code2 },
    { title: 'Continuous Growth', desc: 'Maps aggregate mock interview scores into clear milestones in learning roadmaps.', icon: Users }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-16">
      
      {/* Hero Section */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-violet-500">
          Our Mission
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          We empower software engineers, developers, and product teams to pass high-stress technical interviews by offering lifelike simulated sandboxes, speech feedback, and resume optimization tips.
        </p>
      </div>

      {/* Philosophy Splits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center bg-light-hover/30 dark:bg-dark-hover/10 p-6 md:p-8 rounded-2xl border border-light-border dark:border-dark-border shadow-sm">
        <div className="space-y-4">
          <span className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5 fill-current" /> AI Interview Simulation
          </span>
          <h3 className="text-xl md:text-2xl font-display font-bold text-gray-800 dark:text-gray-100">
            Why We Built PrepAI
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            Technical preparation is often fragmented. Candidates switch between coding sandboxes, generic flashcard sites, and expensive coaching consultation loops.
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
            PrepAI brings everything together into a unified cockpit: resume audits, interactive coding compilers, adaptive voice recorders, and career advisors.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card text-center">
            <p className="text-3xl font-extrabold font-display text-indigo-500">12k+</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Interviews Run</p>
          </div>
          <div className="p-4 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card text-center">
            <p className="text-3xl font-extrabold font-display text-emerald-500">89%</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">Success Rate</p>
          </div>
          <div className="p-4 rounded-xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card text-center col-span-2">
            <p className="text-3xl font-extrabold font-display text-violet-500">4.8 / 5</p>
            <p className="text-[10px] font-bold text-gray-400 uppercase mt-1">User Satisfaction Rating</p>
          </div>
        </div>
      </div>

      {/* Values Grid */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h3 className="text-xl font-display font-bold">Core Foundations</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">The philosophies driving our feedback algorithms.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div key={idx} className="p-6 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm space-y-4">
                <div className="p-2.5 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 w-fit">
                  <Icon className="h-5 w-5" />
                </div>
                <h4 className="font-semibold text-sm">{val.title}</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{val.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Team Grid */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h3 className="text-xl font-display font-bold">Our Advisors & Engineers</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Meet the engineers building a smarter prep arena.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, idx) => (
            <div key={idx} className="p-6 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card text-center space-y-4 shadow-sm hover:scale-[1.02] transition-transform">
              <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-lg font-bold font-display shadow-sm">
                {member.initials}
              </div>
              <div>
                <h4 className="font-semibold text-sm">{member.name}</h4>
                <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-wide mt-1">{member.role}</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA section Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-700 text-white p-8 md:p-12 text-center space-y-6 shadow-xl shadow-indigo-500/20">
        <div className="max-w-xl mx-auto space-y-3">
          <h3 className="text-2xl font-display font-extrabold">Ready to Land Your Dream Offer?</h3>
          <p className="text-xs text-indigo-100 leading-relaxed">
            Create a free account to audit your resume keyword density, test coding compiler bounds, and practice with simulated interview queries.
          </p>
        </div>
        <Link
          to="/register"
          className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white text-indigo-600 hover:bg-indigo-50 px-6 py-3 rounded-xl transition-all shadow-md"
        >
          <span>Get Started Now</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

    </div>
  );
}
