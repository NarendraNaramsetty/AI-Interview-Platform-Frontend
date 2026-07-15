import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';

export default function FAQ() {
  const faqs = [
    {
      q: 'How do I create an account?',
      a: 'Click the "Get Started" button in the upper-right corner of the navigation bar. You can choose to register with an email address and a strong password or complete sign-up instantly using Google or LinkedIn OAuth.'
    },
    {
      q: 'Can I login using Google?',
      a: 'Yes, absolutely. Select the "Continue with Google" button on either the Sign In or Registration screen. This will trigger a secure Google authorization popup to link your account profile details safely.'
    },
    {
      q: 'Can I login using LinkedIn?',
      a: 'Yes. Select the "Continue with LinkedIn" option. This directs you to the LinkedIn login handshake page to fetch and link profile metadata instantly.'
    },
    {
      q: 'How does AI Interview work?',
      a: 'Our mock interviewer conducts real voice questions tailored to specific target scopes (such as frontend developer or algorithms). Under the hood, we analyze your transcript answers, evaluate syntax accuracy inside sandboxes, and rate metrics using OpenAI models.'
    },
    {
      q: 'How is my data stored?',
      a: 'All uploaded resume files, IDE compilations, and interview histories are securely stored in relational PostgreSQL databases hosted on encrypted AWS cloud servers. Transactions are fully secured using SSL/TLS protocols.'
    },
    {
      q: 'Can I delete my account?',
      a: 'Yes. You retain complete ownership of your data. You can delete your account at any time via the "Settings" tab in your dashboard, which permanently deletes all related resume PDFs and mock histories.'
    },
    {
      q: 'Is Resume Analyzer free?',
      a: 'Our platform includes a free evaluation tier for new candidates. You can parse your resume keywords against ATS requirements. For advanced features (detailed AI rating guides, unlimited mock sessions), you can subscribe to our pro plan.'
    },
    {
      q: 'What technologies are supported?',
      a: 'Our code editor sandbox and speech interviewer currently support popular frameworks including React, Node.js, Python, PostgreSQL, AWS configurations, Docker environments, and data structure compilers.'
    },
    {
      q: 'Can I practice unlimited interviews?',
      a: 'Practice bounds are based on your subscription tier. Free trial profiles get initial tokens. Professional plan subscribers get unlimited access to all system design templates, code IDEs, and voice agents.'
    },
    {
      q: 'How can I contact support?',
      a: 'If you encounter platform warnings, payment difficulties, or need to report discrepancies, submit a support ticket via our "Contact Us" page, or email our support desk directly at support@prepai.dev.'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 text-gray-800 dark:text-gray-100 space-y-8">
      
      {/* Header */}
      <div className="text-center space-y-4 max-w-xl mx-auto pb-6">
        <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-500 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
          Knowledge Base
        </span>
        <h1 className="text-3xl font-display font-extrabold text-gray-900 dark:text-gray-100 flex items-center justify-center gap-2">
          <HelpCircle className="h-7 w-7 text-indigo-500" />
          Frequently Asked Questions
        </h1>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          Learn how PrepAI leverages AI and sandboxed compilers to optimize candidate interview readiness.
        </p>
      </div>

      {/* Accordions */}
      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <Accordion 
            key={idx}
            className="!bg-white/70 dark:!bg-dark-card/50 !backdrop-blur-md !border !border-light-border dark:!border-dark-border !rounded-2xl !shadow-none !overflow-hidden before:!hidden"
          >
            <AccordionSummary
              expandIcon={<ChevronDown className="h-4 w-4 text-gray-400 dark:text-gray-300" />}
              aria-controls={`faq-content-${idx}`}
              id={`faq-header-${idx}`}
              className="hover:!bg-indigo-500/5 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <div className="p-1 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shrink-0">
                  <Sparkles className="h-3 w-3" />
                </div>
                <Typography className="!font-semibold !text-xs md:!text-sm text-gray-900 dark:text-gray-100">
                  {faq.q}
                </Typography>
              </div>
            </AccordionSummary>
            <AccordionDetails className="!p-5 !pt-0 border-t border-light-border/50 dark:border-dark-border/50">
              <Typography className="!text-xs md:!text-sm !text-gray-500 dark:!text-gray-400 !leading-relaxed">
                {faq.a}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </div>

    </div>
  );
}
