import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';
import { Shield, Lock, FileText, Trash2, Key, Info } from 'lucide-react';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-12 text-gray-800 dark:text-gray-100 space-y-8">
      
      {/* Header */}
      <div className="space-y-3 border-b border-light-border dark:border-dark-border pb-6">
        <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-500 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 w-fit">
          Legal
        </span>
        <h1 className="text-3xl font-display font-extrabold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <Shield className="h-7 w-7 text-indigo-500" />
          Privacy Policy
        </h1>
        <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
          <span>AI Interview Platform</span>
          <span>Last Updated: October 2026</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-6 text-xs md:text-sm leading-relaxed text-gray-600 dark:text-gray-400">
        
        {/* Intro */}
        <Card className="!bg-white/70 dark:!bg-dark-card/50 !backdrop-blur-md !border !border-light-border dark:!border-dark-border !rounded-2xl !shadow-none">
          <CardContent className="!p-6 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-gray-100">
              <Info className="h-4 w-4 text-indigo-500" />
              1. Introduction
            </div>
            <Typography variant="body2" className="!text-gray-500 dark:!text-gray-400 !leading-relaxed !text-xs">
              Welcome to PrepAI ("we," "our," "us"). We are committed to protecting your privacy and ensuring your personal information is handled safely and responsibly. This Privacy Policy details how we collect, use, store, share, and protect your information when you access our AI Interview Platform, utilize our ATS Resume Scanner, and practice technical interview assessments.
            </Typography>
          </CardContent>
        </Card>

        {/* Info We Collect */}
        <Card className="!bg-white/70 dark:!bg-dark-card/50 !backdrop-blur-md !border !border-light-border dark:!border-dark-border !rounded-2xl !shadow-none">
          <CardContent className="!p-6 space-y-4">
            <div className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-gray-100">
              <FileText className="h-4 w-4 text-indigo-500" />
              2. Information We Collect
            </div>
            
            <div className="space-y-3 pl-4 border-l border-indigo-500/20">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-xs">Information You Provide</h4>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  We collect profile credentials such as your name, email address, password settings, and career focus details when you create an account on our platform.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-xs">Google Authentication</h4>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  When you select "Continue with Google," we receive profile metadata (your email address, name, avatar URL, and OIDC identifier) from Google APIs to securely authenticate your credentials without storing passwords.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-xs">LinkedIn Authentication</h4>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  When you choose to register using LinkedIn, we extract OpenID metadata including email addresses and profile pictures to link to your developer account profiles.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-xs">Resume Upload Information</h4>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  If you upload a resume (PDF/DOCX) for review inside the Resume Analyzer, we scan and parse the document text to calculate ATS optimization scores, keywords, and skill structures.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-xs">Interview Data</h4>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  We log user transcripts, question challenges, grading evaluations, technical editor compiles, and feedback reports generated during mock sessions to track progress milestones.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-xs">Cookies & Cookies Policy</h4>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  We use system cookies, secure tokens, and local storage variables (such as JWT keys) to persist login states, verify authorization headers, and maintain theme preferences.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-xs">Analytics</h4>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  We collect runtime device logs, performance diagnostics, browser orientations, and navigation events to find API bottlenecks and optimize server scaling parameters.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Your Info */}
        <Card className="!bg-white/70 dark:!bg-dark-card/50 !backdrop-blur-md !border !border-light-border dark:!border-dark-border !rounded-2xl !shadow-none">
          <CardContent className="!p-6 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-gray-100">
              <Lock className="h-4 w-4 text-indigo-500" />
              3. How We Use Your Information
            </div>
            <Typography variant="body2" className="!text-gray-500 dark:!text-gray-400 !leading-relaxed !text-xs">
              We process personal information to configure user accounts, deliver AI interview transcripts, parse and analyze uploaded resumes, score code compilations, send system notices, and verify subscription tokens.
            </Typography>
          </CardContent>
        </Card>

        {/* Storage and Security */}
        <Card className="!bg-white/70 dark:!bg-dark-card/50 !backdrop-blur-md !border !border-light-border dark:!border-dark-border !rounded-2xl !shadow-none">
          <CardContent className="!p-6 space-y-4">
            <div className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-gray-100">
              <Shield className="h-4 w-4 text-indigo-500" />
              4. Data Storage & Security
            </div>
            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-xs">Data Storage</h4>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  All databases and parsed file assets are hosted on secure servers in PostgreSQL databases and AWS infrastructure, using encryption mechanisms for data at rest and in transit (SSL/TLS).
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-xs">Data Security</h4>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  We use secure standards (salted password hashing, JSON Web Tokens) to defend credential layers. However, no database over public channels can be guaranteed to be 100% impenetrable.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Third Party Services */}
        <Card className="!bg-white/70 dark:!bg-dark-card/50 !backdrop-blur-md !border !border-light-border dark:!border-dark-border !rounded-2xl !shadow-none">
          <CardContent className="!p-6 space-y-4">
            <div className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-gray-100">
              <Key className="h-4 w-4 text-indigo-500" />
              5. Third Party Services
            </div>
            
            <div className="space-y-3 pl-4 border-l border-indigo-500/20">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-xs">Google OAuth</h4>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  We share user actions solely to complete login exchanges with Google. Review Google's privacy policies to check how they handle consent details.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-xs">LinkedIn OAuth</h4>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  We pass state codes to LinkedIn during social handshakes. LinkedIn handles user authentication scopes independently.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 text-xs">OpenAI API</h4>
                <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">
                  We send parsed resume data, editor scripts, and transcript text to OpenAI's endpoints to calculate technical interview ratings. We do not pass billing or account passwords to OpenAI.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Rights & Account Deletion */}
        <Card className="!bg-white/70 dark:!bg-dark-card/50 !backdrop-blur-md !border !border-light-border dark:!border-dark-border !rounded-2xl !shadow-none">
          <CardContent className="!p-6 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-gray-100">
              <Trash2 className="h-4 w-4 text-indigo-500" />
              6. User Rights & Account Deletion
            </div>
            <Typography variant="body2" className="!text-gray-500 dark:!text-gray-400 !leading-relaxed !text-xs">
              You retain full rights to update your personal details or purge your account records at any time. When you click **Delete Account** under settings, all related resumes, transcript histories, and profile records are permanently erased from our live server databases.
            </Typography>
          </CardContent>
        </Card>

        {/* Contact Info */}
        <Card className="!bg-white/70 dark:!bg-dark-card/50 !backdrop-blur-md !border !border-light-border dark:!border-dark-border !rounded-2xl !shadow-none">
          <CardContent className="!p-6 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-gray-100">
              <Info className="h-4 w-4 text-indigo-500" />
              7. Contact Information
            </div>
            <Typography variant="body2" className="!text-gray-500 dark:!text-gray-400 !leading-relaxed !text-xs">
              If you have any questions or data requests regarding this Privacy Policy, please contact our support department at **support@prepai.dev**.
            </Typography>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
