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
        <div className="w-12 h-12 rounded-full bg-[rgba(30,158,107,0.12)] text-[#1E9E6B] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h2 className="text-[20px] font-semibold text-[#16181C]">Message Received</h2>
        <p className="text-[14px] text-[#5B6169] max-w-[420px] mx-auto leading-relaxed">
          Thank you for reaching out. We review all creator suggestions, feature requests, and bug reports promptly.
        </p>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setMessage('');
          }}
          className="px-4 py-2 text-[14px] font-medium text-[#16181C] border border-[#E8E7E3] hover:border-[#16181C] active:scale-95 transition-all cursor-pointer"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label htmlFor="contact-name" className="text-[14px] font-medium text-[#16181C]">
          Your Name (Optional)
        </label>
        <input
          id="contact-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Alex or Channel Name"
          className="w-full px-3.5 py-2.5 text-[14px] text-[#16181C] bg-[#FCFCFB] border border-[#E8E7E3] focus:border-[#16181C] focus:bg-white focus:outline-none transition-colors"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="contact-email" className="text-[14px] font-medium text-[#16181C]">
          Email Address <span className="text-[#D6293C]">*</span>
        </label>
        <input
          id="contact-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="creator@example.com"
          className="w-full px-3.5 py-2.5 text-[14px] text-[#16181C] bg-[#FCFCFB] border border-[#E8E7E3] focus:border-[#16181C] focus:bg-white focus:outline-none transition-colors"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="contact-subject" className="text-[14px] font-medium text-[#16181C]">
          Inquiry Topic
        </label>
        <select
          id="contact-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full px-3.5 py-2.5 text-[14px] text-[#16181C] bg-[#FCFCFB] border border-[#E8E7E3] focus:border-[#16181C] focus:bg-white focus:outline-none transition-colors"
        >
          <option value="General Feedback">General Feedback</option>
          <option value="Bug Report">Bug Report</option>
          <option value="Tool Feature Request">Tool Feature Request</option>
          <option value="Data Accuracy Question">Data Accuracy Question</option>
          <option value="Partnership / API Inquiry">Partnership / API Inquiry</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="contact-message" className="text-[14px] font-medium text-[#16181C]">
          Message <span className="text-[#D6293C]">*</span>
        </label>
        <textarea
          id="contact-message"
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Describe your inquiry, link to the relevant YouTube channel or video..."
          className="w-full px-3.5 py-2.5 text-[14px] text-[#16181C] bg-[#FCFCFB] border border-[#E8E7E3] focus:border-[#16181C] focus:bg-white focus:outline-none transition-colors"
        />
      </div>

      <button
        type="submit"
        className="btn-interactive w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-[14px] font-semibold text-white bg-[#D6293C] hover:bg-[#B8202F] active:scale-95 transition-all cursor-pointer"
      >
        <span>Send Message</span>
        <Send className="w-3.5 h-3.5" />
      </button>
    </form>
  );
}
