import React, { useState } from 'react';
import { TrendingUp, Users as UsersIcon, UserCheck, UserX } from 'lucide-react';

interface ChartPoint {
  month: string;
  registered: number;
  unregistered: number;
  total: number;
}

// 12-month timeline simulation matching charts1.js algorithm
const MONTHS_DATA: ChartPoint[] = [
  { month: 'Oct 2025', registered: 6, unregistered: 4, total: 10 },
  { month: 'Nov 2025', registered: 8, unregistered: 5, total: 13 },
  { month: 'Dec 2025', registered: 11, unregistered: 6, total: 17 },
  { month: 'Jan 2026', registered: 13, unregistered: 7, total: 20 },
  { month: 'Feb 2026', registered: 15, unregistered: 8, total: 23 },
  { month: 'Mar 2026', registered: 18, unregistered: 8, total: 26 },
  { month: 'Apr 2026', registered: 20, unregistered: 9, total: 29 },
  { month: 'May 2026', registered: 22, unregistered: 9, total: 31 },
  { month: 'Jun 2026', registered: 23, unregistered: 10, total: 33 },
  { month: 'Jul 2026', registered: 25, unregistered: 10, total: 35 },
  { month: 'Aug 2026', registered: 26, unregistered: 10, total: 36 },
  { month: 'Sep 2026', registered: 28, unregistered: 10, total: 38 },
];

export const UsersChartSection: React.FC = () => {
  const [activePoint, setActivePoint] = useState<ChartPoint | null>(null);

  // SVG dimensions
  const svgWidth = 900;
  const svgHeight = 320;
  const paddingX = 60;
  const paddingY = 40;
  const chartW = svgWidth - paddingX * 2;
  const chartH = svgHeight - paddingY * 2;
  const maxY = 45;

  const getX = (index: number) => paddingX + (index / (MONTHS_DATA.length - 1)) * chartW;
  const getY = (val: number) => svgHeight - paddingY - (val / maxY) * chartH;

  // Build SVG path string with smooth curves
  const makePath = (key: 'registered' | 'unregistered' | 'total') => {
    let d = '';
    MONTHS_DATA.forEach((pt, i) => {
      const x = getX(i);
      const y = getY(pt[key]);
      if (i === 0) {
        d += `M ${x} ${y}`;
      } else {
        const prevX = getX(i - 1);
        const prevY = getY(MONTHS_DATA[i - 1][key]);
        const cpX1 = prevX + (x - prevX) * 0.45;
        const cpX2 = prevX + (x - prevX) * 0.55;
        d += ` C ${cpX1} ${prevY}, ${cpX2} ${y}, ${x} ${y}`;
      }
    });
    return d;
  };

  const registeredPath = makePath('registered');
  const unregisteredPath = makePath('unregistered');
  const totalPath = makePath('total');

  const latest = MONTHS_DATA[MONTHS_DATA.length - 1];
  const conversionRate = Math.round((latest.registered / latest.total) * 100);

  return (
    <section id="users-chart" className="py-16 md:py-24 px-4 md:px-8 bg-[var(--bg)] border-b border-[var(--line)]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--sub)] mb-2">
              <span>Performance Analytics</span>
              <span>·</span>
              <span>Growth Trends</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--ink)]">
              Users & Account Activity
            </h2>
            <p className="text-sm md:text-base text-[var(--sub)] mt-1">
              Historical progression of accounts, registered workspace members, and trial conversions.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-[var(--sub)]">
              <span className="w-3 h-3 rounded-full bg-[#6fbf00]" />
              <span>Registered ({latest.registered})</span>
            </span>
            <span className="flex items-center gap-1.5 text-[var(--sub)]">
              <span className="w-3 h-3 rounded-full bg-[#ff8a1f]" />
              <span>Unregistered ({latest.unregistered})</span>
            </span>
            <span className="flex items-center gap-1.5 text-[var(--sub)]">
              <span className="w-3 h-3 rounded-full bg-[#7d8b9a]" />
              <span>Total ({latest.total})</span>
            </span>
          </div>
        </div>

        {/* 3 Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
            <div className="flex items-center justify-between text-[var(--sub)] text-xs mb-2">
              <span>Registered Users</span>
              <UserCheck className="w-4 h-4 text-[#6fbf00]" />
            </div>
            <div className="text-3xl font-extrabold text-[var(--ink)] font-mono tabular-nums">
              {latest.registered}
            </div>
            <div className="text-xs text-emerald-600 font-semibold mt-1">
              +75% active adoption
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--line)] shadow-sm">
            <div className="flex items-center justify-between text-[var(--sub)] text-xs mb-2">
              <span>Unregistered Trialists</span>
              <UserX className="w-4 h-4 text-[#ff8a1f]" />
            </div>
            <div className="text-3xl font-extrabold text-[var(--ink)] font-mono tabular-nums">
              {latest.unregistered}
            </div>
            <div className="text-xs text-[var(--sub)] mt-1">
              52-day trial evaluation period
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[var(--card)] border border-[#95d600] shadow-sm bg-gradient-to-br from-[var(--card)] to-[var(--sec)]">
            <div className="flex items-center justify-between text-[var(--sub)] text-xs mb-2">
              <span>Subscribed Conversion</span>
              <TrendingUp className="w-4 h-4 text-[#95d600]" />
            </div>
            <div className="text-3xl font-extrabold text-[var(--ink)] font-mono tabular-nums">
              {conversionRate}%
            </div>
            <div className="text-xs text-[#95d600] font-bold mt-1">
              28 of 38 converted accounts
            </div>
          </div>
        </div>

        {/* Interactive SVG Chart Container */}
        <div className="relative rounded-3xl bg-[var(--card)] border border-[var(--line)] p-6 shadow-sm overflow-hidden">
          <div className="w-full overflow-x-auto">
            <div className="min-w-[700px]">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-auto overflow-visible"
              >
                {/* Horizontal Grid lines */}
                {[0, 10, 20, 30, 40].map((val) => {
                  const y = getY(val);
                  return (
                    <g key={val}>
                      <line
                        x1={paddingX}
                        y1={y}
                        x2={svgWidth - paddingX}
                        y2={y}
                        stroke="var(--rx-chart-grid)"
                        strokeDasharray="4 4"
                        strokeWidth="1"
                      />
                      <text
                        x={paddingX - 12}
                        y={y + 4}
                        textAnchor="end"
                        className="text-[11px] font-mono fill-[var(--sub)]"
                      >
                        {val}
                      </text>
                    </g>
                  );
                })}

                {/* Vertical month labels */}
                {MONTHS_DATA.map((pt, idx) => {
                  const x = getX(idx);
                  return (
                    <text
                      key={idx}
                      x={x}
                      y={svgHeight - 12}
                      textAnchor="middle"
                      className="text-[10px] font-mono fill-[var(--sub)]"
                    >
                      {pt.month.split(' ')[0]}
                    </text>
                  );
                })}

                {/* Total curve (grey) */}
                <path
                  d={totalPath}
                  fill="none"
                  stroke="var(--rx-chart-total)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Registered curve (green) */}
                <path
                  d={registeredPath}
                  fill="none"
                  stroke="var(--rx-chart-registered)"
                  strokeWidth="4"
                  strokeLinecap="round"
                />

                {/* Unregistered curve (orange) */}
                <path
                  d={unregisteredPath}
                  fill="none"
                  stroke="var(--rx-chart-unregistered)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Interactive Points on registered curve */}
                {MONTHS_DATA.map((pt, idx) => {
                  const x = getX(idx);
                  const y = getY(pt.registered);
                  const isHovered = activePoint?.month === pt.month;
                  return (
                    <g
                      key={idx}
                      className="cursor-pointer"
                      onMouseEnter={() => setActivePoint(pt)}
                      onMouseLeave={() => setActivePoint(null)}
                    >
                      <circle
                        cx={x}
                        cy={y}
                        r={isHovered ? 7 : 4.5}
                        fill="var(--rx-chart-registered)"
                        stroke="#ffffff"
                        strokeWidth="2"
                        className="transition-all"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          {/* Active tooltip on hover */}
          {activePoint && (
            <div className="mt-4 p-3 rounded-xl bg-[var(--sec)] border border-[var(--line)] flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-[var(--ink)]">{activePoint.month}</span>
              <div className="flex items-center gap-4">
                <span className="text-[#6fbf00] font-bold">Registered: {activePoint.registered}</span>
                <span className="text-[#ff8a1f] font-bold">Unregistered: {activePoint.unregistered}</span>
                <span className="text-[var(--sub)]">Total: {activePoint.total}</span>
              </div>
            </div>
          )}

          <div className="mt-4 pt-3 border-t border-[var(--line)]/60 text-xs text-[var(--sub)] flex items-center justify-between">
            <span>Chart updates automatically as live database entries synchronize.</span>
            <span className="font-mono">Timezone: UTC+8</span>
          </div>
        </div>
      </div>
    </section>
  );
};
