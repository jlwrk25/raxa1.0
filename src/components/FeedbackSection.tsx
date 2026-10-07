import React, { useState } from 'react';
import { Star, Send, CheckCircle2, MessageSquare, AlertCircle } from 'lucide-react';
import { FeedbackEntry } from '../types';
import { apiService } from '../services/raxaApi';

export const FeedbackSection: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState<FeedbackEntry[]>(() => apiService.getFeedbacks());
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [category, setCategory] = useState<string>('General Feedback');
  const [rating, setRating] = useState<number>(5);
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim() || !email.trim() || !message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const saved = await apiService.submitFeedback({
        name: name.trim(),
        email: email.trim(),
        category,
        rating,
        message: message.trim(),
      });
      setFeedbacks([saved, ...feedbacks]);
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err: any) {
      setError(err.message || 'Failed to submit feedback.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="feedback" className="py-16 md:py-24 px-4 md:px-8 bg-[var(--sec)] border-b border-[var(--line)]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Information & Recent Testimonials */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--sub)] mb-2">
                <span>Community Voice</span>
                <span>·</span>
                <span>Feedback Portal</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--ink)]">
                Comments & Reviews
              </h2>
              <p className="text-sm md:text-base text-[var(--sub)] mt-2">
                Share your operational experience or report workflow recommendations. Every review posts into the Google Sheets Feedback database.
              </p>
            </div>

            {/* RaXa Brand Seal */}
            <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--line)] flex items-center gap-4">
              <img
                src="/assets/logo.png"
                alt="RaXa"
                className="w-12 h-12 object-contain"
              />
              <div>
                <h4 className="font-extrabold text-sm text-[var(--ink)]">RaXa Quality Assurance</h4>
                <p className="text-xs text-[var(--sub)]">
                  Feedback audited by Juan & the RaXa Systems core engineering team.
                </p>
              </div>
            </div>

            {/* List of recent feedback cards */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-[var(--sub)] uppercase tracking-wider">
                Recent Verified Feedback
              </h4>
              {feedbacks.slice(0, 3).map((fb) => (
                <div
                  key={fb.id}
                  className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--line)] shadow-sm"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-sm text-[var(--ink)]">{fb.name}</div>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      {[...Array(fb.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-[var(--sub)] leading-relaxed italic">
                    "{fb.message}"
                  </p>
                  <div className="mt-2 pt-2 border-t border-[var(--line)]/50 flex items-center justify-between text-[11px] text-[var(--sub)] font-mono">
                    <span>{fb.category}</span>
                    <span>{new Date(fb.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Interactive Form */}
          <div className="lg:col-span-7">
            <div className="p-6 md:p-8 rounded-3xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
              <h3 className="text-xl font-bold text-[var(--ink)] mb-1">Leave a Comment</h3>
              <p className="text-xs text-[var(--sub)] mb-6">
                Your feedback helps us refine the cloud workspace and Google Sheets integration.
              </p>

              {submitted && (
                <div className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 text-sm font-semibold flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span>Thank you! Your feedback has been recorded in the database.</span>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-600 text-sm font-semibold flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--ink)] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Maria Santos"
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-[var(--field)] border border-[var(--line)] text-[var(--ink)] focus:outline-none focus:border-[#2f72bf]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--ink)] mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. maria@enterprise.ph"
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-[var(--field)] border border-[var(--line)] text-[var(--ink)] focus:outline-none focus:border-[#2f72bf]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--ink)] mb-1">
                      Topic / Category
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-2.5 text-sm rounded-xl bg-[var(--field)] border border-[var(--line)] text-[var(--ink)] focus:outline-none"
                    >
                      <option value="General Feedback">General Feedback</option>
                      <option value="Modules & UI">Modules & Cloud UI</option>
                      <option value="Google Sheets Sync">Google Sheets Sync</option>
                      <option value="User Management">User Management</option>
                      <option value="Performance">Speed & Performance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--ink)] mb-1">
                      Rating
                    </label>
                    <div className="flex items-center gap-2 py-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className="p-1 text-slate-300 hover:text-amber-400 transition-colors focus:outline-none"
                        >
                          <Star
                            className={`w-6 h-6 ${
                              star <= rating ? 'fill-amber-400 text-amber-400' : ''
                            }`}
                          />
                        </button>
                      ))}
                      <span className="text-xs font-bold text-[var(--sub)] ml-2">
                        {rating} / 5
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[var(--ink)] mb-1">
                    Your Comments *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your thoughts, feedback, or feature request..."
                    className="w-full px-4 py-3 text-sm rounded-xl bg-[var(--field)] border border-[var(--line)] text-[var(--ink)] focus:outline-none focus:border-[#2f72bf]"
                  />
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#12263a] hover:bg-[#1a3854] text-white font-bold text-sm border-2 border-[#95d600] transition-all disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 text-[#95d600]" />
                    <span>{isSubmitting ? 'Submitting...' : 'Post Comment'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
