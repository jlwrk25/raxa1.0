import React from 'react';
import {
  Users,
  TrendingUp,
  Boxes,
  HeartHandshake,
  Receipt,
  LayoutDashboard,
  ShieldCheck,
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import { ModuleItem } from '../types';

interface WorkspaceSectionProps {
  onSelectModule: (moduleId: string) => void;
  accountId: string;
  userName: string;
  trialDaysLeft: number;
}

export const MODULES_DATA: ModuleItem[] = [
  {
    id: 'human-resource',
    title: 'Human Resource',
    category: 'Workforce',
    description: 'Employee records, attendance schedules, shift logs, and payroll calculations linked to Google Sheets.',
    tag: 'HR & Personnel',
    features: ['Employee Roster', 'Time Tracking', 'Payroll Formulae', 'Access Badges'],
    metrics: [
      { label: 'Active Staff', value: '24' },
      { label: 'On Shift', value: '18' },
    ],
    stylePosition: { x: '19.94%', y: '7.5%' },
  },
  {
    id: 'customers-sales',
    title: 'Customers & Sales',
    category: 'Commercial',
    description: 'Client profiles, customer orders, point of sale transactions, and revenue tracking.',
    tag: 'Revenue Engine',
    features: ['Customer Directory', 'Order Processing', 'Invoicing & Receipts', 'Sales Analytics'],
    metrics: [
      { label: 'Today Sales', value: '₱42,850' },
      { label: 'Open Orders', value: '12' },
    ],
    stylePosition: { x: '3.75%', y: '37.5%' },
  },
  {
    id: 'inventory-logistics',
    title: 'Inventory & Logistics',
    category: 'Supply Chain',
    description: 'SKU master list, stock levels, warehouse bins, reorder alarms, and shipment consignments.',
    tag: 'Stock & Storage',
    features: ['Real-time SKU Count', 'Reorder Triggers', 'Bin Location', 'Batch Tracking'],
    metrics: [
      { label: 'SKU Items', value: '380' },
      { label: 'Low Stock Alert', value: '3' },
    ],
    stylePosition: { x: '3.75%', y: '70%' },
  },
  {
    id: 'customer-experience',
    title: 'Customer Experience',
    category: 'Satisfaction',
    description: 'Central hub for customer feedback, support tickets, sentiment ratings, and service inquiries.',
    tag: 'Core Experience',
    features: ['Live Feedback Stream', 'Issue Resolution', 'CSAT / NPS Scoring', 'Response SLA'],
    metrics: [
      { label: 'CSAT Score', value: '98.4%' },
      { label: 'Resolution Rate', value: '99.1%' },
    ],
    stylePosition: { x: '41.75%', y: '1%', w: '16.5%', h: '28%' },
  },
  {
    id: 'purchase-expenses',
    title: 'Purchase & Expenses',
    category: 'Finance',
    description: 'Supplier purchase orders, petty cash vouchers, expense receipts, and balance sheets.',
    tag: 'Outflows',
    features: ['Vendor Ledger', 'Expense Approvals', 'Receipt OCR Matching', 'Budget Caps'],
    metrics: [
      { label: 'Monthly Expenses', value: '₱18,240' },
      { label: 'Pending Approvals', value: '2' },
    ],
    stylePosition: { x: '65.56%', y: '7.5%' },
  },
  {
    id: 'dashboard',
    title: 'Dashboard',
    category: 'Intelligence',
    description: 'Executive overview, real-time KPI metrics, conversion ratios, and sheet synchronization health.',
    tag: 'Analytics Center',
    features: ['Executive Summary', 'Growth Trends', 'Google Sheets Sync', 'Activity Stream'],
    metrics: [
      { label: 'Subscribed %', value: '74%' },
      { label: 'Cloud Uptime', value: '99.98%' },
    ],
    stylePosition: { x: '83.125%', y: '37.5%' },
  },
  {
    id: 'management',
    title: 'User Management',
    category: 'Governance',
    description: 'Role-Based Access Control (RBAC), Access Codes, user credentials, and permissions table.',
    tag: 'Security & Access',
    features: ['Admin & Staff Accounts', 'Access Code Verification', 'Table Sync', 'Permission Rules'],
    metrics: [
      { label: 'Total Users', value: '5' },
      { label: 'Admins', value: '1' },
    ],
    stylePosition: { x: '83.125%', y: '70%' },
  },
];

export const WorkspaceSection: React.FC<WorkspaceSectionProps> = ({
  onSelectModule,
  accountId,
  userName,
  trialDaysLeft,
}) => {
  return (
    <section id="modules" className="py-12 md:py-16 px-4 md:px-8 bg-[var(--sec)] border-b border-[var(--line)]">
      <div className="max-w-7xl mx-auto">
        {/* Header & Account Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--sub)] mb-2">
              <span>Cloud Architecture</span>
              <span>·</span>
              <span>7 Interconnected Modules</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--ink)]">
              Your Workspace
            </h2>
            <p className="text-sm md:text-base text-[var(--sub)] mt-1">
              Click any module node from the cloud to view real-time data and operations.
            </p>
          </div>

          {/* Account Status Pill */}
          <div className="flex items-center gap-3 bg-[var(--card)] px-4 py-2.5 rounded-xl border border-[var(--line)] shadow-sm shrink-0">
            <div className="w-8 h-8 rounded-full bg-[#12263a] text-[#95d600] font-extrabold text-sm flex items-center justify-center">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-[var(--ink)] leading-none">{userName}</div>
              <div className="text-[11px] text-[var(--sub)] font-mono mt-1">{accountId}</div>
            </div>
            <div className="h-6 w-[1px] bg-[var(--line)] mx-1" />
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#ff7a45]">
              <Clock className="w-3.5 h-3.5" />
              <span>Trial: {trialDaysLeft} days left</span>
            </div>
          </div>
        </div>

        {/* Desktop Interactive Cloud SVG Canvas */}
        <div className="relative w-full rounded-3xl bg-[var(--card)] border border-[var(--line)] p-4 md:p-8 shadow-sm overflow-hidden hidden lg:block">
          {/* Cloud SVG Canvas */}
          <div className="relative w-full aspect-[16/8] max-h-[680px]">
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none"
              viewBox="0 0 1600 800"
              preserveAspectRatio="xMidYMid meet"
              aria-hidden="true"
            >
              <defs>
                <filter id="rxGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="6" />
                </filter>
                <filter id="rxShadow" x="-20%" y="-20%" width="140%" height="150%">
                  <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#14283c" floodOpacity=".18" />
                </filter>
                <linearGradient id="rxCloudFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--rx-cloud-1)" />
                  <stop offset="100%" stopColor="var(--rx-cloud-2)" />
                </linearGradient>

                {/* Wire paths connecting modules to cloud center */}
                <path id="rxW1" d="M435 260V318Q435 338 455 338H650" />
                <path id="rxW2" d="M270 400H570" />
                <path id="rxW3" d="M270 660H430" />
                <path id="rxW4" d="M800 232V300" />
                <path id="rxW5" d="M1165 260V318Q1165 338 1145 338H980" />
                <path id="rxW6" d="M1330 400H1080" />
                <path id="rxW7" d="M1330 660H1180" />
              </defs>

              {/* Animated pulsing wires */}
              <g>
                <use href="#rxW1" className="rx-wire" />
                <use href="#rxW1" className="rx-flow" />
                <use href="#rxW2" className="rx-wire" />
                <use href="#rxW2" className="rx-flow" />
                <use href="#rxW3" className="rx-wire" />
                <use href="#rxW3" className="rx-flow" />
                <use href="#rxW4" className="rx-wire" />
                <use href="#rxW4" className="rx-flow" />
                <use href="#rxW5" className="rx-wire" />
                <use href="#rxW5" className="rx-flow" />
                <use href="#rxW6" className="rx-wire" />
                <use href="#rxW6" className="rx-flow" />
                <use href="#rxW7" className="rx-wire" />
                <use href="#rxW7" className="rx-flow" />
              </g>

              {/* Central RaXa Cloud silhouette */}
              <g filter="url(#rxShadow)">
                <path
                  d="M520 740C400 740 340 680 340 600C340 520 400 470 470 460C470 380 540 330 620 340C650 270 730 230 810 240C900 250 950 300 960 350C1050 330 1130 380 1140 450C1220 460 1270 520 1270 600C1270 690 1200 740 1120 740Z"
                  fill="url(#rxCloudFill)"
                  stroke="var(--rx-blue)"
                  strokeWidth="8"
                  strokeLinejoin="round"
                />
              </g>

              {/* Glowing connection node dots */}
              <g>
                <circle className="rx-dot-glow" cx="435" cy="260" r="14" filter="url(#rxGlow)" />
                <circle className="rx-dot" cx="435" cy="260" r="7" />

                <circle className="rx-dot-glow" cx="270" cy="400" r="14" filter="url(#rxGlow)" />
                <circle className="rx-dot" cx="270" cy="400" r="7" />

                <circle className="rx-dot-glow" cx="270" cy="660" r="14" filter="url(#rxGlow)" />
                <circle className="rx-dot" cx="270" cy="660" r="7" />

                <circle className="rx-dot-glow" cx="800" cy="232" r="14" filter="url(#rxGlow)" />
                <circle className="rx-dot" cx="800" cy="232" r="7" />

                <circle className="rx-dot-glow" cx="1165" cy="260" r="14" filter="url(#rxGlow)" />
                <circle className="rx-dot" cx="1165" cy="260" r="7" />

                <circle className="rx-dot-glow" cx="1330" cy="400" r="14" filter="url(#rxGlow)" />
                <circle className="rx-dot" cx="1330" cy="400" r="7" />

                <circle className="rx-dot-glow" cx="1330" cy="660" r="14" filter="url(#rxGlow)" />
                <circle className="rx-dot" cx="1330" cy="660" r="7" />
              </g>
            </svg>

            {/* Cloud Logo in Center */}
            <div className="absolute top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
              <img
                src="/assets/logo.png"
                alt="RaXa Center"
                className="w-16 h-16 object-contain drop-shadow-md"
              />
              <span className="text-xs font-black tracking-widest uppercase text-[#2f72bf] mt-1">
                Central Core
              </span>
            </div>

            {/* Module Interactive Nodes Positioned Absolutely */}
            {MODULES_DATA.map((mod) => {
              const isLarge = mod.id === 'customer-experience';
              return (
                <button
                  key={mod.id}
                  onClick={() => onSelectModule(mod.id)}
                  style={{
                    left: mod.stylePosition.x,
                    top: mod.stylePosition.y,
                    width: mod.stylePosition.w || '17%',
                    height: mod.stylePosition.h || '25%',
                  }}
                  className={`absolute rounded-2xl bg-[var(--card)] border-2 transition-all duration-200 text-left p-3.5 flex flex-col justify-between group shadow-md hover:shadow-xl hover:scale-105 z-10 ${
                    isLarge
                      ? 'border-[#95d600] ring-2 ring-[#95d600]/30 bg-gradient-to-br from-[var(--card)] to-[var(--sec)]'
                      : 'border-[var(--line)] hover:border-[#2f72bf]'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="p-2 rounded-xl bg-[var(--sec)] text-[#2f72bf] group-hover:bg-[#95d600] group-hover:text-[#12263a] transition-colors">
                      {mod.id === 'human-resource' && <Users className="w-5 h-5" />}
                      {mod.id === 'customers-sales' && <TrendingUp className="w-5 h-5" />}
                      {mod.id === 'inventory-logistics' && <Boxes className="w-5 h-5" />}
                      {mod.id === 'customer-experience' && <HeartHandshake className="w-6 h-6 text-[#95d600]" />}
                      {mod.id === 'purchase-expenses' && <Receipt className="w-5 h-5" />}
                      {mod.id === 'dashboard' && <LayoutDashboard className="w-5 h-5" />}
                      {mod.id === 'management' && <ShieldCheck className="w-5 h-5" />}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-[var(--sub)] group-hover:text-[#95d600] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </div>

                  <div>
                    <h3 className="font-extrabold text-sm md:text-base text-[var(--ink)] leading-tight group-hover:text-[#2f72bf] transition-colors">
                      {mod.title}
                    </h3>
                    <p className="text-[11px] text-[var(--sub)] mt-0.5 line-clamp-2">
                      {mod.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-[var(--line)]/50 text-[var(--sub)] font-mono">
                    <span>{mod.metrics[0].label}</span>
                    <span className="font-bold text-[var(--ink)]">{mod.metrics[0].value}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Responsive Mobile / Tablet Grid of Module Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
          {MODULES_DATA.map((mod) => (
            <button
              key={mod.id}
              onClick={() => onSelectModule(mod.id)}
              className="p-5 rounded-2xl bg-[var(--card)] border border-[var(--line)] hover:border-[#95d600] transition-all text-left flex flex-col justify-between shadow-sm active:scale-[0.98]"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <span className="p-2.5 rounded-xl bg-[var(--sec)] text-[#2f72bf]">
                    {mod.id === 'human-resource' && <Users className="w-5 h-5" />}
                    {mod.id === 'customers-sales' && <TrendingUp className="w-5 h-5" />}
                    {mod.id === 'inventory-logistics' && <Boxes className="w-5 h-5" />}
                    {mod.id === 'customer-experience' && <HeartHandshake className="w-5 h-5 text-[#95d600]" />}
                    {mod.id === 'purchase-expenses' && <Receipt className="w-5 h-5" />}
                    {mod.id === 'dashboard' && <LayoutDashboard className="w-5 h-5" />}
                    {mod.id === 'management' && <ShieldCheck className="w-5 h-5" />}
                  </span>
                  <div>
                    <h3 className="font-bold text-base text-[var(--ink)]">{mod.title}</h3>
                    <span className="text-xs text-[var(--sub)]">{mod.category}</span>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-[var(--sub)]" />
              </div>

              <p className="text-xs text-[var(--sub)] mb-4">{mod.description}</p>

              <div className="grid grid-cols-2 gap-2 p-2.5 rounded-xl bg-[var(--sec)] text-xs font-mono">
                {mod.metrics.map((m, idx) => (
                  <div key={idx}>
                    <div className="text-[10px] text-[var(--sub)] uppercase">{m.label}</div>
                    <div className="font-bold text-[var(--ink)]">{m.value}</div>
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
