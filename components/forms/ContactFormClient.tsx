'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export function ContactFormClient() {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('General Feedback');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !message.trim()) return;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h2 className="text-[20px] font-bold text-[#181135]">Message Received</h2>
        <p className="text-[14px] text-[#635B80] max-w-[420px] mx-auto leading-relaxed">
          Thank you for reaching out. We review all creator suggestions, feature requests, and bug reports promptly. You will receive a response at{' '}
          <strong className="text-[#181135]">{email}</strong> within 24–48 hours.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setMessage('');
          }}
          className="px-5 py-2.5 text-[14px] font-bold text-[#181135] bg-white/80 border border-[#DDD0FA] hover:border-[#7C3AED] rounded-2xl transition-colors cursor-pointer"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <label htmlFor="contact-name" className="text-[14px] font-bold text-[#181135]">
          Your Name (Optional)
        </label>
        <input
          id="contact-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Alex or Channel Name"
          className="w-full px-4 py-3 text-[14px] text-[#181135] bg-white/70 border border-[#EDE8F9] rounded-2xl focus:border-[#7C3AED] focus:bg-white focus:outline-none transition-colors"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="contact-email" className="text-[14px] font-bold text-[#181135]">
          Email Address <span className="text-[#EF4444]">*</span>
        </label>
        <input
          id="contact-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="creator@example.com"
          className="w-full px-4 py-3 text-[14px] text-[#181135] bg-white/70 border border-[#EDE8F9] rounded-2xl focus:border-[#7C3AED] focus:bg-white focus:outline-none transition-colors"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="contact-subject" className="text-[14px] font-bold text-[#181135]">
          Inquiry Topic
        </label>
        <select
          id="contact-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-4 py-3 text-[14px] text-[#181135] bg-white/70 border border-[#EDE8F9] rounded-2xl focus:border-[#7C3AED] focus:bg-white focus:outline-none transition-colors"
        >
          <option value="General Feedback">General Feedback</option>
          <option value="Bug Report">Bug Report</option>
          <option value="Tool Feature Request">Tool Feature Request</option>
          <option value="Data Accuracy Question">Data Accuracy Question</option>
          <option value="Partnership / API Inquiry">Partnership / API Inquiry</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="contact-message" className="text-[14px] font-bold text-[#181135]">
          Message <span className="text-[#EF4444]">*</span>
        </label>
        <textarea
          id="contact-message"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your inquiry, link to the relevant YouTube channel or video..."
          className="w-full px-4 py-3 text-[14px] text-[#181135] bg-white/70 border border-[#EDE8F9] rounded-2xl focus:border-[#7C3AED] focus:bg-white focus:outline-none transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        className="btn-siampay-primary w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 text-[14px] font-bold text-white transition-colors cursor-pointer"
      >
        <span>Send Message</span>
        <Send className="w-3.5 h-3.5" />
      </button>
    </form>
  );
}
