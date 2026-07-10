import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { Scale, Users, ShieldAlert, BookOpen, AlertOctagon, HelpCircle } from 'lucide-react';

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 text-gray-800 dark:text-gray-100 space-y-8">
      
      {/* Header */}
      <div className="space-y-3 border-b border-light-border dark:border-dark-border pb-6">
        <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-500 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 w-fit">
          Legal
        </span>
        <h1 className="text-3xl font-display font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Scale className="h-7 w-7 text-indigo-500" />
          Terms & Conditions
        </h1>
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span>AI Interview Platform</span>
          <span>Last Updated: October 2026</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6 text-xs md:text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        
        {/* Acceptance of Terms & Eligibility */}
        <Card className="!bg-white/70 dark:!bg-dark-card/50 !backdrop-blur-md !border !border-light-border dark:!border-dark-border !rounded-2xl !shadow-none">
          <CardContent className="!p-6 space-y-4">
            <div className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-gray-100">
              <BookOpen className="h-4 w-4 text-indigo-500" />
              1. Acceptance & Eligibility
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-xs">Acceptance of Terms</h4>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  By accessing, browsing, or registering for PrepAI ("Platform"), you acknowledge that you have read, understood, and agree to be bound by these Terms & Conditions.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-xs">Eligibility</h4>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  You must be at least 18 years of age (or the legal age of majority in your jurisdiction) to sign up, compile code, or purchase platform plan tiers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Accounts & Social Logins */}
        <Card className="!bg-white/70 dark:!bg-dark-card/50 !backdrop-blur-md !border !border-light-border dark:!border-dark-border !rounded-2xl !shadow-none">
          <CardContent className="!p-6 space-y-4">
            <div className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-gray-100">
              <Users className="h-4 w-4 text-indigo-500" />
              2. User Accounts & Identity Checks
            </div>
            <div className="space-y-3">
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                To access mock interviews and custom roadmaps, you must register a developer profile. You are responsible for preserving credentials and access token security.
              </p>
              <div className="pl-4 border-l border-indigo-500/20 space-y-2">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-xs">Google & LinkedIn Sign-In</h4>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-0.5">
                  We integrate with official Google and LinkedIn OAuth handshakes. You authorize us to manage profile handles returned by their respective consent frameworks.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Acceptable Use */}
        <Card className="!bg-white/70 dark:!bg-dark-card/50 !backdrop-blur-md !border !border-light-border dark:!border-dark-border !rounded-2xl !shadow-none">
          <CardContent className="!p-6 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-gray-100">
              <ShieldAlert className="h-4 w-4 text-indigo-500" />
              3. Acceptable Use
            </div>
            <Typography variant="body2" className="!text-gray-500 dark:!text-gray-400 !leading-relaxed !text-xs">
              You agree not to reverse-engineer technical compiler sandboxes, write scraper scripts to extract question lists, attempt authentication bypass checks, bypass payment gateway layers, or input malicious packages.
            </Typography>
          </CardContent>
        </Card>

        {/* Disclaimers */}
        <Card className="!bg-white/70 dark:!bg-dark-card/50 !backdrop-blur-md !border !border-light-border dark:!border-dark-border !rounded-2xl !shadow-none">
          <CardContent className="!p-6 space-y-4">
            <div className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-gray-100">
              <AlertOctagon className="h-4 w-4 text-indigo-500" />
              4. Platform Disclaimers
            </div>
            
            <div className="space-y-3 pl-4 border-l border-indigo-500/20">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-xs">AI-Generated Content Disclaimer</h4>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  AI interview assessments, grading guidelines, and roadmap steps are dynamically constructed via OpenAI model outputs. We make no guarantees regarding content precision or structural accuracy.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-xs">Interview Feedback Disclaimer</h4>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  Simulated ratings (communication, technical score metrics) are meant exclusively for study purposes. Passing PrepAI mock interviews does not guarantee real-world hiring outcomes.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-xs">Resume Analysis Disclaimer</h4>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  The ATS Analyzer optimizes resume parameters based on general keyword filters. It does not guarantee job matching or interview callback guarantees.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Intellectual Property & Termination */}
        <Card className="!bg-white/70 dark:!bg-dark-card/50 !backdrop-blur-md !border !border-light-border dark:!border-dark-border !rounded-2xl !shadow-none">
          <CardContent className="!p-6 space-y-4">
            <div className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-gray-100">
              <BookOpen className="h-4 w-4 text-indigo-500" />
              5. Intellectual Property & Termination
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-xs">Intellectual Property</h4>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  PrepAI systems, vector graphics, layouts, and question banks are protected under trademark and copy protection regulations.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-xs">Termination</h4>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  We reserve the right to temporarily lock or permanently delete accounts exhibiting token abuse, payment fraud, or server attack indicators.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Liability and Changes */}
        <Card className="!bg-white/70 dark:!bg-dark-card/50 !backdrop-blur-md !border !border-light-border dark:!border-dark-border !rounded-2xl !shadow-none">
          <CardContent className="!p-6 space-y-4">
            <div className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-gray-100">
              <ShieldAlert className="h-4 w-4 text-indigo-500" />
              6. Limitation of Liability & Privacy
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-xs">Limitation of Liability</h4>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  PrepAI shall not be liable for any indirect, incidental, or consequential damages resulting from system downtime, compiler errors, API latency, or data losses.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-xs">Privacy Reference</h4>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  All transactions and profile modifications are processed under our official Privacy Policy.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact info and Changes */}
        <Card className="!bg-white/70 dark:!bg-dark-card/50 !backdrop-blur-md !border !border-light-border dark:!border-dark-border !rounded-2xl !shadow-none">
          <CardContent className="!p-6 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-gray-100">
              <HelpCircle className="h-4 w-4 text-indigo-500" />
              7. Terms Modifications & Contacts
            </div>
            <Typography variant="body2" className="!text-gray-500 dark:!text-gray-400 !leading-relaxed !text-xs">
              We reserve the right to modify these terms at any time. Updates are active immediately upon deployment. If you have any inquiries regarding this document, please reach out to **support@prepai.dev**.
            </Typography>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
