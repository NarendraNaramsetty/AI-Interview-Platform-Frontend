import React, { useState } from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API request delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  const contactInfo = [
    { icon: Mail, title: 'Email Address', desc: 'support@prepai.dev', sub: '24/7 technical ticket reviews' },
    { icon: Phone, title: 'Phone Support', desc: '+1 (555) 019-2834', sub: 'Mon-Fri 9:00 AM - 6:00 PM PST' },
    { icon: MapPin, title: 'Office Location', desc: 'San Francisco, California', sub: 'PrepAI Technologies Inc.' },
    { icon: Clock, title: 'Working Hours', desc: 'Monday - Friday', sub: '9:00 AM - 6:00 PM PST' }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 text-gray-800 dark:text-gray-100 space-y-12">
      
      {/* Header Section */}
      <div className="text-center space-y-4 max-w-xl mx-auto">
        <span className="text-[10px] uppercase tracking-widest font-bold text-indigo-500 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
          Support Cockpit
        </span>
        <h1 className="text-3xl md:text-4xl font-display font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
          Get in Touch
        </h1>
        <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
          Encountered a platform bug? Have suggestion reviews for AI interview parameters? Our client engineering team reads all feedback tickets.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Contact Cards */}
        <div className="lg:col-span-1 space-y-4 flex flex-col justify-between">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
            {contactInfo.map((info, idx) => {
              const Icon = info.icon;
              return (
                <Card key={idx} className="!bg-white/70 dark:!bg-dark-card/50 !backdrop-blur-md !border !border-light-border dark:!border-dark-border !rounded-2xl !shadow-none hover:!shadow-sm transition-shadow">
                  <CardContent className="!p-4 flex gap-4 items-start">
                    <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <Typography variant="subtitle2" className="!font-semibold !text-xs !text-gray-400 !uppercase !tracking-wider">
                        {info.title}
                      </Typography>
                      <Typography variant="body1" className="!font-bold !text-sm !text-gray-900 dark:!text-gray-100 !truncate">
                        {info.desc}
                      </Typography>
                      <Typography variant="caption" className="!text-[10px] !text-gray-500 dark:!text-gray-400 !block">
                        {info.sub}
                      </Typography>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Social Links Panel */}
          <Card className="!bg-gradient-to-tr !from-indigo-600/5 !to-violet-600/5 !border !border-indigo-500/10 !rounded-2xl !shadow-none !p-5 text-center space-y-4">
            <Typography variant="subtitle1" className="!font-bold !text-sm text-gray-900 dark:text-gray-100">
              Follow Our Developers
            </Typography>
            <div className="flex justify-center gap-5">
              {[
                { href: 'https://github.com', icon: FaGithub, label: 'GitHub', color: 'hover:text-indigo-500' },
                { href: 'https://linkedin.com', icon: FaLinkedin, label: 'LinkedIn', color: 'hover:text-blue-500' },
                { href: 'https://twitter.com', icon: FaTwitter, label: 'Twitter', color: 'hover:text-sky-500' },
                { href: 'https://instagram.com', icon: FaInstagram, label: 'Instagram', color: 'hover:text-pink-500' }
              ].map((social, idx) => {
                const Icon = social.icon;
                return (
                  <a
                    key={idx}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-gray-400 transition-colors ${social.color}`}
                    aria-label={social.label}
                  >
                    <Icon size={20} />
                  </a>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Side: Message Form */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="!bg-white/70 dark:!bg-dark-card/50 !backdrop-blur-md !border !border-light-border dark:!border-dark-border !rounded-3xl !shadow-none">
            <CardContent className="!p-6 md:!p-8 space-y-6">
              <Typography variant="h5" component="h3" className="!font-display !font-bold text-gray-900 dark:text-gray-100">
                Open Support Ticket
              </Typography>

              {isSuccess && (
                <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-500 flex items-center gap-2.5">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span className="text-xs font-semibold">Your ticket was logged! We will reach out to you via email shortly.</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Full Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover/30 dark:bg-dark-hover/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs"
                      placeholder="Alex Developer"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Email Address</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover/30 dark:bg-dark-hover/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Subject</label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover/30 dark:bg-dark-hover/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs"
                    placeholder="Short summary of question..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Detailed Inquiry Message</label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-light-border dark:border-dark-border bg-light-hover/30 dark:bg-dark-hover/10 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-xs leading-relaxed"
                    placeholder="Provide full context for your ticket review..."
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
            </CardContent>
          </Card>
        </div>

      </div>

      {/* Mock Google Map Embed Container */}
      <Card className="!bg-white/70 dark:!bg-dark-card/50 !backdrop-blur-md !border !border-light-border dark:!border-dark-border !rounded-3xl !shadow-none !overflow-hidden">
        <div className="h-64 w-full relative bg-gray-100 dark:bg-dark-hover flex items-center justify-center">
          {/* Iframe map representation or stylish mock placeholder */}
          <iframe 
            title="Office Location Map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d100939.98555078516!2d-122.50764020141648!3d37.757815003504825!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80859a6d00690021%3A0x4a501367f076adff!2sSan%20Francisco%2C%20CA!5e0!3m2!1sen!2sus!4v1700000000000!5m2!1sen!2sus"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 grayscale contrast-125 dark:opacity-85"
          ></iframe>
        </div>
      </Card>

    </div>
  );
}
