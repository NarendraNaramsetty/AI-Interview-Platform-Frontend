import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, Typography, Box, Button } from '@mui/material';
import { Sparkles, Target, Eye, ShieldCheck, Cpu, Code2, LineChart, Milestone, ArrowRight } from 'lucide-react';
import { FaReact, FaPython, FaAws } from 'react-icons/fa';
import { SiTailwindcss, SiPostgresql } from 'react-icons/si';

const OpenAiIcon = (props) => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" {...props}>
    <path d="M21.3,11.1c0.2-0.7,0.1-1.4-0.3-2c-0.4-0.6-1.1-1-1.8-1c-0.1,0-0.3,0-0.4,0.1c-0.4-0.9-1.1-1.6-2.1-1.9c-0.9-0.3-2-0.2-2.8,0.3c-0.5-0.6-1.2-0.9-2-0.9c-0.8,0-1.5,0.3-2.1,0.9c-0.8-0.5-1.9-0.6-2.8-0.3c-0.9,0.3-1.7,1-2.1,1.9C4.8,8.2,4.6,8.2,4.5,8.2C3.8,8.2,3.1,8.6,2.7,9.2c-0.4,0.6-0.5,1.3-0.3,2c0.2,0.9,0.8,1.6,1.6,1.9c-0.2,0.7-0.1,1.4,0.3,2c0.4,0.6,1.1,1,1.8,1c0.1,0,0.3,0,0.4-0.1c0.4,0.9,1.1,1.6,2.1,1.9c0.5,0.2,1,0.2,1.5,0.2c0.5,0,0.9-0.1,1.3-0.3c0.5,0.6,1.2,0.9,2,0.9c0.8,0,1.5-0.3,2.1-0.9c0.8,0.5,1.9,0.6,2.8,0.3c0.9-0.3,1.7-1,2.1-1.9c0.1,0.1,0.3,0.1,0.4,0.1c0.7,0,1.4-0.4,1.8-1c0.4-0.6,0.5-1.3,0.3-2C22.1,12.7,21.5,12,20.7,11.7C20.9,11.5,21.1,11.3,21.3,11.1z M12.8,4.7c0.4,0,0.8,0.2,1,0.5c0,0.1,0.1,0.2,0.1,0.3c-0.2,0.1-0.4,0.2-0.6,0.3l-3.3,1.9c-0.3,0.2-0.5,0.5-0.5,0.9v4.6l-2,1.2V9.8L12.8,4.7z M4.8,10.6c0-0.4,0.2-0.8,0.5-1c0.1-0.1,0.2-0.1,0.3-0.1V13c0,0.4,0.2,0.7,0.5,0.9l3.3,1.9c0.2,0.1,0.4,0.2,0.6,0.2v2.3L4.8,15.2C4.5,14.6,4.5,13.9,4.8,10.6z M6.9,16.5l2-1.2v-2.4c0-0.4,0.2-0.7,0.5-0.9l3.3-1.9c0.2-0.1,0.4-0.2,0.6-0.2v-2.3l5.2,3v5.4L14.3,15c-0.3,0.2-0.5,0.5-0.5,0.9v4.6L12,21.2v-4.6c0-0.4-0.2-0.7-0.5-0.9L8.2,13.8v-2.3L6.9,16.5z M19.2,13.4c0,0.4-0.2,0.8-0.5,1c-0.1,0.1-0.2,0.1-0.3,0.1v-3.7c0-0.4-0.2-0.7-0.5-0.9l-3.3-1.9c-0.2-0.1-0.4-0.2-0.6-0.2V5.5l5.2,3L19.2,13.4z M11.2,19.3c-0.4,0-0.8-0.2-1-0.5c0-0.1-0.1-0.2-0.1-0.3c0.2-0.1,0.4-0.2,0.6-0.3l3.3-1.9c0.3-0.2,0.5-0.5,0.5-0.9v-4.6l2-1.2v4.6L11.2,19.3z" />
  </svg>
);

export default function About() {
  const team = [
    { name: 'Dr. Evelyn Carter', role: 'Chief AI Scientist', bio: 'Former NLP research lead at Stanford. Architect of our audio assessment engines.', initials: 'EC' },
    { name: 'Marcus Sterling', role: 'Head of Engineering', bio: 'Ex-Netflix Staff Architect. Focused on low-latency IDE sandboxes and scalability.', initials: 'MS' },
    { name: 'Sonia Patel', role: 'Lead Career Advisor', bio: 'Recruiter with 10+ years experience guiding technical talent pathways at Google.', initials: 'SP' }
  ];

  const features = [
    {
      title: 'Resume Analyzer',
      desc: 'Get immediate feedback on resume formatting, keyword density matching ATS parsers, and impact metric highlights.',
      icon: Code2,
      color: 'text-indigo-500 bg-indigo-500/10'
    },
    {
      title: 'Technical Practice',
      desc: 'Compile code in real-time inside our sandboxed browser editors across popular algorithms and data structures.',
      icon: Cpu,
      color: 'text-violet-500 bg-violet-500/10'
    },
    {
      title: 'Mock Interview Arena',
      desc: 'Engage with voice-based simulated interviewers that dynamically adapt difficulty based on answer quality.',
      icon: Sparkles,
      color: 'text-emerald-500 bg-emerald-500/10'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-20 px-4 md:px-8 py-10 text-gray-800 dark:text-gray-100">
      
      {/* Hero Section */}
      <div className="relative text-center space-y-6 max-w-3xl mx-auto py-12">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-violet-500/10 blur-3xl rounded-full -z-10"></div>
        <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-500 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
          About PrepAI
        </span>
        <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 leading-tight">
          Next-Generation AI Interview Preparation
        </h1>
        <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 leading-relaxed">
          PrepAI is a production-grade preparation cockpit built to help engineers, builders, and developers bypass interview anxiety and pass the most challenging technical screening loops.
        </p>
      </div>

      {/* Company Intro & Mission / Vision */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        <Card className="!bg-white/70 dark:!bg-dark-card/50 !backdrop-blur-md !border !border-light-border dark:!border-dark-border !rounded-2xl !shadow-sm flex flex-col justify-between">
          <CardContent className="space-y-4 !p-6 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 w-fit">
                <Target className="h-6 w-6" />
              </div>
              <Typography variant="h5" component="h3" className="!font-display !font-bold text-gray-900 dark:text-gray-100">
                Our Mission
              </Typography>
              <Typography variant="body2" className="!text-gray-500 dark:!text-gray-400 !leading-relaxed !text-xs">
                To democratize quality career coaching. We believe candidates from all backgrounds deserve access to top-tier technical training platforms, voice-simulated interviewers, and resume optimization heuristics without expensive consultation costs.
              </Typography>
            </div>
          </CardContent>
        </Card>

        <Card className="!bg-white/70 dark:!bg-dark-card/50 !backdrop-blur-md !border !border-light-border dark:!border-dark-border !rounded-2xl !shadow-sm flex flex-col justify-between">
          <CardContent className="space-y-4 !p-6 flex-1 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-500 border border-violet-500/20 w-fit">
                <Eye className="h-6 w-6" />
              </div>
              <Typography variant="h5" component="h3" className="!font-display !font-bold text-gray-900 dark:text-gray-100">
                Our Vision
              </Typography>
              <Typography variant="body2" className="!text-gray-500 dark:!text-gray-400 !leading-relaxed !text-xs">
                To build the ultimate end-to-end sandbox where candidates can analyze their technical capabilities, follow custom study roadmaps, practice algorithmic limits, and continuously track performance analytics indicators.
              </Typography>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Why Choose Us */}
      <div className="space-y-8 bg-light-hover/30 dark:bg-dark-hover/10 border border-light-border dark:border-dark-border p-8 rounded-3xl backdrop-blur-md">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h3 className="text-2xl font-display font-bold">Why Choose PrepAI?</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">What makes our preparation ecosystem stand out from simple text questionnaires.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <Card key={idx} className="!bg-white dark:!bg-dark-card !border !border-light-border dark:!border-dark-border !rounded-xl !shadow-none hover:!shadow-md transition-shadow">
                <CardContent className="space-y-4 !p-6">
                  <div className={`p-2.5 rounded-lg w-fit ${feat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <Typography variant="h6" className="!font-bold !text-sm text-gray-900 dark:text-gray-100">
                    {feat.title}
                  </Typography>
                  <Typography variant="body2" className="!text-gray-500 dark:!text-gray-400 !text-xs !leading-relaxed">
                    {feat.desc}
                  </Typography>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Our Technologies */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h3 className="text-2xl font-display font-bold">Powered by Modern Technology</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Our unified platform relies on robust production frameworks.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-6 text-center">
          {[
            { icon: FaReact, name: 'React & Vite', color: 'text-sky-400' },
            { icon: SiTailwindcss, name: 'Tailwind CSS', color: 'text-teal-400' },
            { icon: FaPython, name: 'Django Rest', color: 'text-blue-500' },
            { icon: SiPostgresql, name: 'PostgreSQL', color: 'text-indigo-400' },
            { icon: OpenAiIcon, name: 'OpenAI GPT-4o', color: 'text-emerald-500' },
            { icon: FaAws, name: 'AWS Cloud', color: 'text-amber-500' }
          ].map((tech, idx) => {
            const Icon = tech.icon;
            return (
              <div key={idx} className="p-4 rounded-xl border border-light-border dark:border-dark-border bg-white/50 dark:bg-dark-card/30 backdrop-blur-sm flex flex-col items-center gap-2">
                <Icon className={`h-8 w-8 ${tech.color}`} />
                <span className="text-[10px] font-bold tracking-wide uppercase mt-1">{tech.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Roadmap Section */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h3 className="text-2xl font-display font-bold">Future Product Roadmap</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Active features we are deploying next to expand candidate cockpit bounds.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { step: 'Q3 2026', title: 'Interactive Whiteboard', desc: 'Flowcharting algorithms and system design models dynamically.' },
            { step: 'Q4 2026', title: 'Live Peer-to-Peer Mocking', desc: 'Connect with developers around the globe to conduct mock interviews.' },
            { step: 'Q1 2027', title: 'Speech Rate Assessment', desc: 'AI speech rate indicators assessing communication stutter levels.' },
            { step: 'Q2 2027', title: 'Integrated ATS Pipelines', desc: 'Submit polished profiles directly to hiring companies inside PrepAI.' }
          ].map((item, idx) => (
            <Card key={idx} className="!bg-white dark:!bg-dark-card !border !border-light-border dark:!border-dark-border !rounded-xl !shadow-none relative">
              <div className="absolute top-4 right-4 text-[10px] font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-full">
                {item.step}
              </div>
              <CardContent className="space-y-3 !p-6 pt-10">
                <Milestone className="h-5 w-5 text-indigo-500" />
                <Typography variant="h6" className="!font-bold !text-sm text-gray-900 dark:text-gray-100">
                  {item.title}
                </Typography>
                <Typography variant="body2" className="!text-gray-500 dark:!text-gray-400 !text-xs !leading-relaxed">
                  {item.desc}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h3 className="text-2xl font-display font-bold">Our Advisors & Engineers</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Meet the product teams driving our simulation engines.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, idx) => (
            <Card key={idx} className="!bg-white dark:!bg-dark-card !border !border-light-border dark:!border-dark-border !rounded-2xl !shadow-none text-center hover:!scale-[1.02] transition-transform duration-300">
              <CardContent className="!p-6 space-y-4">
                <div className="mx-auto h-16 w-16 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center text-white text-lg font-bold font-display shadow-sm">
                  {member.initials}
                </div>
                <div>
                  <Typography variant="subtitle1" className="!font-semibold !text-sm text-gray-900 dark:text-gray-100">
                    {member.name}
                  </Typography>
                  <Typography variant="caption" className="!text-[10px] !font-bold !text-indigo-500 !uppercase !tracking-wide">
                    {member.role}
                  </Typography>
                </div>
                <Typography variant="body2" className="!text-gray-500 dark:!text-gray-400 !text-xs !leading-relaxed">
                  {member.bio}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* CTA section Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-700 text-white p-8 md:p-12 text-center space-y-6 shadow-xl shadow-indigo-500/20">
        <div className="max-w-xl mx-auto space-y-3">
          <h3 className="text-2xl md:text-3xl font-display font-extrabold">Ready to Land Your Dream Offer?</h3>
          <p className="text-xs text-indigo-100 leading-relaxed">
            Create your account today. Optimize your resume for target job descriptions, practice programming sandboxes, and run AI interviews.
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
