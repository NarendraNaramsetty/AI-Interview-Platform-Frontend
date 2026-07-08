import React, { useState } from 'react';
import { Compass, CheckCircle2, Circle, ArrowRight, BookOpen, Link as LinkIcon, Cpu, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const ROADMAP_DATA = {
  frontend: {
    title: 'Frontend Engineering Track',
    description: 'Master semantic layout structures, client side responsiveness, advanced frameworks, and bundle optimizations.',
    milestones: [
      {
        id: 'fe-m1',
        title: 'Foundations of the Web',
        subtopics: [
          { id: 'fe-s1', title: 'Semantic HTML5 structure & accessibility rules', completed: true },
          { id: 'fe-s2', title: 'CSS layouts (Grid, Flexbox, Specificity hierarchy)', completed: true },
          { id: 'fe-s3', title: 'Responsive design patterns & Tailwind CSS configurations', completed: false }
        ]
      },
      {
        id: 'fe-m2',
        title: 'JavaScript & Dynamic Interactivity',
        subtopics: [
          { id: 'fe-s4', title: 'ES6+ features (Promises, Async/Await, Destructuring)', completed: true },
          { id: 'fe-s5', title: 'DOM manipulation mechanics & Event Bubbling', completed: false },
          { id: 'fe-s6', title: 'JavaScript Engine execution context & Call Stack', completed: false }
        ]
      },
      {
        id: 'fe-m3',
        title: 'Modern Single Page Applications (React)',
        subtopics: [
          { id: 'fe-s7', title: 'React component lifecycles & reconciliation virtual DOM', completed: false },
          { id: 'fe-s8', title: 'Hook architecture (useState, useEffect, useMemo, useCallback)', completed: false },
          { id: 'fe-s9', title: 'State management solutions (Zustand, Context API)', completed: false }
        ]
      },
      {
        id: 'fe-m4',
        title: 'Testing, Bundling & Optimization',
        subtopics: [
          { id: 'fe-s10', title: 'Vite & Webpack configurations (tree-shaking, lazy loading)', completed: false },
          { id: 'fe-s11', title: 'Unit testing frameworks (Jest, React Testing Library)', completed: false },
          { id: 'fe-s12', title: 'Core Web Vitals auditing (LCP, CLS, FID optimizations)', completed: false }
        ]
      }
    ],
    resources: [
      { title: 'MDN Web Docs - HTML & CSS Essentials', link: 'https://developer.mozilla.org' },
      { title: 'Eloquent JavaScript (3rd Edition)', link: 'https://eloquentjavascript.net' },
      { title: 'React official docs - Beta walkthrough', link: 'https://react.dev' }
    ]
  },
  backend: {
    title: 'Backend Engineering Track',
    description: 'Master server scripting, database design patterns, caching systems, and security layers.',
    milestones: [
      {
        id: 'be-m1',
        title: 'Server Core & HTTP Protocol',
        subtopics: [
          { id: 'be-s1', title: 'Node.js event loop & non-blocking execution models', completed: true },
          { id: 'be-s2', title: 'RESTful API principles and HTTP status specs', completed: true },
          { id: 'be-s3', title: 'Routing structures and middleware architectures', completed: false }
        ]
      },
      {
        id: 'be-m2',
        title: 'Database & Persistent Storage',
        subtopics: [
          { id: 'be-s4', title: 'Relational Database indexing & B-tree constraints', completed: false },
          { id: 'be-s5', title: 'NoSQL document structure (MongoDB/Redis caches)', completed: false },
          { id: 'be-s6', title: 'SQL Joins, Subqueries and aggregate performance analysis', completed: false }
        ]
      },
      {
        id: 'be-m3',
        title: 'System Design & High Availability',
        subtopics: [
          { id: 'be-s7', title: 'Load Balancing & Rate Limiting algorithms', completed: false },
          { id: 'be-s8', title: 'Caching protocols (Write-through vs Write-back)', completed: false },
          { id: 'be-s9', title: 'Message queues (RabbitMQ, Kafka stream triggers)', completed: false }
        ]
      }
    ],
    resources: [
      { title: 'Designing Data-Intensive Applications', link: 'https://www.oreilly.com' },
      { title: 'System Design Primer (GitHub Reference)', link: 'https://github.com' },
      { title: 'Node.js Design Patterns book', link: 'https://www.nodejsdesignpatterns.com' }
    ]
  }
};

export default function RoadmapPage() {
  const [activeTrack, setActiveTrack] = useState('frontend');
  const [tracks, setTracks] = useState(ROADMAP_DATA);

  const toggleSubtopic = (trackId, milestoneIdx, subtopicIdx) => {
    const updatedTracks = { ...tracks };
    const currentCompleted = updatedTracks[trackId].milestones[milestoneIdx].subtopics[subtopicIdx].completed;
    updatedTracks[trackId].milestones[milestoneIdx].subtopics[subtopicIdx].completed = !currentCompleted;
    setTracks(updatedTracks);
  };

  const getProgress = (trackId) => {
    const track = tracks[trackId];
    let total = 0;
    let completed = 0;
    track.milestones.forEach((m) => {
      m.subtopics.forEach((s) => {
        total++;
        if (s.completed) completed++;
      });
    });
    return total === 0 ? 0 : Math.round((completed / total) * 100);
  };

  const currentTrack = tracks[activeTrack];
  const progressPercent = getProgress(activeTrack);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Top Header Panel */}
      <div className="p-6 md:p-8 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-2xl font-display font-bold flex items-center gap-2">
            <Compass className="h-6 w-6 text-indigo-500" />
            Interactive Learning Pathways
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-xl">
            Audit your readiness indicators. Toggle checkboxes to map out your completed skills and track overall readiness values.
          </p>
        </div>

        {/* Tracks Selector Buttons */}
        <div className="flex gap-2 bg-light-hover dark:bg-dark-hover p-1.5 rounded-xl border border-light-border dark:border-dark-border">
          <button
            onClick={() => setActiveTrack('frontend')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTrack === 'frontend'
                ? 'bg-white dark:bg-dark-card text-indigo-500 shadow-sm border border-light-border dark:border-dark-border'
                : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Frontend
          </button>
          <button
            onClick={() => setActiveTrack('backend')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
              activeTrack === 'backend'
                ? 'bg-white dark:bg-dark-card text-indigo-500 shadow-sm border border-light-border dark:border-dark-border'
                : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
            }`}
          >
            Backend
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Progress summary & Guides */}
        <div className="space-y-6 lg:col-span-1">
          {/* Progress Tracker Card */}
          <div className="p-6 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm">
            <h3 className="font-semibold text-base mb-4">Track Progress</h3>
            
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Total Completion</span>
                <span className="font-bold text-indigo-500 font-mono">{progressPercent}%</span>
              </div>
              
              <div className="w-full bg-light-hover dark:bg-dark-hover h-2.5 rounded-full overflow-hidden border border-light-border dark:border-dark-border">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-violet-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed pt-2">
                We recommend hitting at least 80% completion across all milestones before launching your mock system simulation to maximize scores.
              </p>
            </div>
          </div>

          {/* Curated Guides resources */}
          <div className="p-6 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm">
            <h3 className="font-semibold text-base mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-indigo-500" />
              Recommended Resources
            </h3>
            <div className="space-y-3.5">
              {currentTrack.resources.map((res, idx) => (
                <a
                  key={idx}
                  href={res.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-3 p-3 rounded-xl border border-light-border dark:border-dark-border hover:bg-light-hover dark:hover:bg-dark-hover/50 transition-colors group text-left"
                >
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shrink-0">
                    <LinkIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-xs text-gray-800 dark:text-gray-200 group-hover:text-indigo-500 transition-colors">
                      {res.title}
                    </h4>
                    <p className="text-[10px] text-gray-400 mt-1">Official Resource Link</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Jump to mock interview shortcut */}
          <div className="p-6 rounded-2xl border border-indigo-500/10 bg-indigo-600/5 dark:bg-indigo-600/10 text-center space-y-4">
            <div className="mx-auto w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center text-white">
              <Cpu className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-sm">Ready to Test Your Skill?</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Launch a customized AI simulation with your progress filter.
              </p>
            </div>
            <Link
              to="/interview/setup"
              className="inline-flex items-center gap-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white px-4.5 py-2.5 rounded-xl transition-colors shadow-md shadow-indigo-500/20"
            >
              <span>Setup Interview Session</span>
              <Play className="h-3.5 w-3.5 fill-current" />
            </Link>
          </div>

        </div>

        {/* Right Column: Visual Timeline Roadmap */}
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 md:p-8 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm space-y-8">
            <div className="border-b border-light-border dark:border-dark-border pb-4">
              <h3 className="font-display font-bold text-xl text-gray-800 dark:text-gray-100">{currentTrack.title}</h3>
              <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">{currentTrack.description}</p>
            </div>

            {/* Path Milestones Timeline */}
            <div className="relative pl-6 md:pl-8 border-l border-light-border dark:border-dark-border space-y-12 ml-4">
              {currentTrack.milestones.map((m, mIdx) => (
                <div key={m.id} className="relative group">
                  
                  {/* Timeline point indicator */}
                  <span className="absolute -left-10 md:-left-12 top-1 bg-white dark:bg-dark-card border border-light-border dark:border-dark-border rounded-full p-1 z-10 shrink-0">
                    <div className="h-4.5 w-4.5 rounded-full bg-indigo-500 text-white flex items-center justify-center font-display font-extrabold text-[9px]">
                      {mIdx + 1}
                    </div>
                  </span>

                  {/* Milestone Content block */}
                  <div className="space-y-4">
                    <h4 className="font-display font-bold text-base text-gray-800 dark:text-gray-100 group-hover:text-indigo-500 transition-colors">
                      {m.title}
                    </h4>

                    {/* Subtopics Checklist cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {m.subtopics.map((s, sIdx) => (
                        <button
                          key={s.id}
                          onClick={() => toggleSubtopic(activeTrack, mIdx, sIdx)}
                          className={`flex items-start gap-3 p-4 rounded-xl border text-left transition-all ${
                            s.completed
                              ? 'border-indigo-500/20 bg-indigo-500/5 text-gray-900 dark:text-gray-100'
                              : 'border-light-border dark:border-dark-border bg-light-hover/10 dark:bg-dark-hover/10 hover:bg-light-hover dark:hover:bg-dark-hover/50 text-gray-500 dark:text-gray-400'
                          }`}
                        >
                          <span className="shrink-0 mt-0.5">
                            {s.completed ? (
                              <CheckCircle2 className="h-4.5 w-4.5 text-indigo-500" />
                            ) : (
                              <Circle className="h-4.5 w-4.5 text-gray-400" />
                            )}
                          </span>
                          <span className="text-xs font-semibold leading-relaxed">{s.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
