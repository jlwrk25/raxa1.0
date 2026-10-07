import React from 'react';
import { Sparkles, Compass, Gauge, Zap, Contrast, Radio } from 'lucide-react';

export const TraitsSection: React.FC = () => {
  const traits = [
    {
      title: 'Bamboo specialists',
      description: 'Ultra-efficient dedicated microservices engineered for focused enterprise business execution without bloat.',
      icon: <Compass className="w-6 h-6 text-[#95d600]" />,
    },
    {
      title: 'A built-in “thumb”',
      description: 'Direct dexterity: reads and writes natively to Google Sheets databases with zero middleware barriers.',
      icon: <Sparkles className="w-6 h-6 text-[#2f72bf]" />,
    },
    {
      title: 'Energy savers',
      description: 'Zero idle costs: cloud execution runs on demand through Google Apps Script serverless infrastructure.',
      icon: <Gauge className="w-6 h-6 text-[#95d600]" />,
    },
    {
      title: 'Tiny beginnings',
      description: 'Instant onboarding with 52 days full-featured free trial, allowing rapid evaluation with zero lock-in.',
      icon: <Zap className="w-6 h-6 text-[#ffb703]" />,
    },
    {
      title: 'Bold black and white',
      description: 'Uncompromising clarity with high-contrast accessibility across synchronized Light and Dark UI modes.',
      icon: <Contrast className="w-6 h-6 text-[#2f72bf]" />,
    },
    {
      title: 'Scent and sound messages',
      description: 'Live telemetry, instant notifications, and unified state dispatch across interconnected operational units.',
      icon: <Radio className="w-6 h-6 text-[#95d600]" />,
    },
  ];

  return (
    <section id="traits" className="py-16 md:py-24 px-4 md:px-8 bg-[var(--sec)] border-b border-[var(--line)]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--sub)] mb-2">
            <span>Core Principles</span>
            <span>·</span>
            <span>Design Philosophy</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--ink)] [text-wrap:balance]">
            Panda traits, A.I. tools
          </h2>
          <p className="text-sm md:text-base text-[var(--sub)] mt-2 [text-wrap:balance]">
            Nature-inspired architectural principles designed for agile enterprise operations and Google ecosystem synergy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {traits.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-3xl bg-[var(--card)] border border-[var(--line)] hover:border-[#95d600] transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-[var(--sec)] flex items-center justify-center mb-5 border border-[var(--line)]">
                  {t.icon}
                </div>
                <h3 className="text-lg font-bold text-[var(--ink)] mb-2">{t.title}</h3>
                <p className="text-sm text-[var(--sub)] leading-relaxed">{t.description}</p>
              </div>

              <div className="mt-6 pt-4 border-t border-[var(--line)]/50 flex items-center justify-between text-xs text-[var(--sub)] font-mono">
                <span>Trait 0{idx + 1}</span>
                <span className="text-[#95d600] font-bold">Verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
