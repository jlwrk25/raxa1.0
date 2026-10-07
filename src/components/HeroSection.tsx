import React from 'react';
import { ArrowRight, ShieldCheck, Database, Zap } from 'lucide-react';

interface HeroSectionProps {
  theme: 'light' | 'dark';
  onExploreWorkspace: () => void;
  onOpenManagement: () => void;
  onOpenDatabase: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  theme,
  onExploreWorkspace,
  onOpenManagement,
  onOpenDatabase,
}) => {
  return (
    <section className="relative overflow-hidden py-16 md:py-24 px-6 md:px-12 text-center bg-gradient-to-b from-[#12263a] via-[#102234] to-[var(--bg)] text-white border-b border-[#24405a]/40">
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#2f72bf]/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative max-w-4xl mx-auto flex flex-col items-center">
        {/* RaXa Official Logo */}
        <div className="mb-6 inline-flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 shadow-xl backdrop-blur-sm">
          <img
            src="/assets/logowhite.png"
            alt="RaXa Logo"
            className="h-16 md:h-20 w-auto object-contain filter drop-shadow-[0_2px_12px_rgba(149,214,0,0.3)]"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        </div>

        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white mb-4 [text-wrap:balance]">
          Welcome to <span className="text-[#95d600]">RaXa</span>
        </h1>

        <p className="text-lg md:text-xl text-[#9fb2c6] max-w-2xl mx-auto mb-8 font-normal leading-relaxed [text-wrap:balance]">
          A high-performance cloud operations platform seamlessly powered by Google Apps Script and Google Sheets database storage.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10 w-full sm:w-auto">
          <button
            onClick={onExploreWorkspace}
            className="rx-btn-neon rx-btn-neon--wiggle w-full sm:w-auto text-base"
          >
            52 Days Free Trial
          </button>

          <button
            onClick={onOpenManagement}
            className="w-full sm:w-auto px-6 py-3.5 text-sm font-bold text-white bg-[#1a3652] hover:bg-[#234568] border border-[#305984] rounded-full transition-all flex items-center justify-center gap-2"
          >
            Manage Users
            <ArrowRight className="w-4 h-4 text-[#95d600]" />
          </button>
        </div>

        {/* Integration Status Badges */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-[#9fb2c6]">
          <button
            onClick={onOpenDatabase}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:border-[#95d600]/60 transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-[#95d600]" />
            <span>Google Apps Script Endpoint Active</span>
          </button>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <Zap className="w-3.5 h-3.5 text-[#ffb703]" />
            <span>Google Sheets Database Folder: 1HPMXv...</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
            <ShieldCheck className="w-3.5 h-3.5 text-[#95d600]" />
            <span>Role-Based Access Control</span>
          </div>
        </div>
      </div>
    </section>
  );
};
