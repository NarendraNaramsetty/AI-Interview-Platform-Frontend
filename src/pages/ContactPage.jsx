import React, { useState } from 'react';
import { Mail, MessageSquare, ShieldAlert, Sparkles, Send, CheckCircle2 } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState('technical');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setTimeout(() => setIsSuccess(false), 4000);
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-display font-extrabold tracking-tight text-gray-800 dark:text-gray-100">
          Get in Touch
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
          Encountered a bug? Have advice for our AI simulation patterns? We review all support tickets and feedback suggestions.
        </p>
      </div>

      {/* Main Grid split */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column Info Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="p-6 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm space-y-6">
            <h3 className="font-display font-bold text-base">Support Channels</h3>
            
            <div className="space-y-4.5">
              <div className="flex gap-3 items-start">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  <Mail className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-gray-500 dark:text-gray-400">Email Help</h4>
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-0.5">support@prepai.dev</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-gray-500 dark:text-gray-400">Response Speed</h4>
                  <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-0.5">Typically within 24 business hours</p>
                </div>
              </div>

              <div className="flex gap-3 items-start">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                  <ShieldAlert className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-xs text-gray-500 dark:text-gray-400">System Status</h4>
                  <p className="text-xs font-semibold text-emerald-500 mt-0.5">All services operational</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-indigo-500/10 bg-indigo-600/5 dark:bg-indigo-600/10">
            <h4 className="font-bold text-sm flex items-center gap-1.5">
              <Sparkles className="h-4 w-4 text-indigo-500" />
              Community Slack
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mt-2">
              Join 5,000+ engineers discussing preparation paths, mock score milestones, and open roles in tech.
            </p>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); alert('Redirecting to slack invitation...'); }}
              className="inline-block mt-4 text-xs font-bold text-indigo-500 hover:text-indigo-600 transition-colors"
            >
              Get Invite Link &rarr;
            </a>
          </div>
        </div>

        {/* Right Column Form Card */}
        <div className="md:col-span-2">
          <div className="p-6 md:p-8 rounded-2xl border border-light-border dark:border-dark-border bg-white dark:bg-dark-card shadow-sm">
            <h3 className="font-display font-bold text-lg mb-6">Open Support Ticket</h3>

            {isSuccess && (
              <div className="mb-6 p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 flex items-center gap-2.5 animate-pulse-slow">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span className="text-xs font-medium">Ticket submitted successfully! We will follow up via email shortly.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs"
                    placeholder="Alex Developer"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs"
                    placeholder="alex@example.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Inquiry Scope</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { id: 'technical', label: 'Tech Issue' },
                    { id: 'billing', label: 'Billing' },
                    { id: 'feedback', label: 'Feedback' },
                    { id: 'other', label: 'General' }
                  ].map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`py-2 px-3 text-xs font-semibold rounded-xl border text-center transition-all ${
                        category === cat.id
                          ? 'border-indigo-500 bg-indigo-500/5 text-indigo-500 font-bold'
                          : 'border-light-border dark:border-dark-border hover:bg-light-hover dark:hover:bg-dark-hover text-gray-500 dark:text-gray-400'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs"
                  placeholder="Summary of your inquiry..."
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">Detailed Message</label>
                <textarea
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover dark:bg-dark-hover focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs leading-relaxed"
                  placeholder="Describe your inquiry..."
                />
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-5 py-2.5 rounded-xl text-xs transition-all duration-200 disabled:opacity-50 flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
                >
                  {isSubmitting ? 'Sending Ticket...' : 'Send Message'}
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
}
