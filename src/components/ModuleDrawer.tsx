import React from 'react';
import {
  X,
  ExternalLink,
  Users,
  TrendingUp,
  Boxes,
  HeartHandshake,
  Receipt,
  LayoutDashboard,
  ShieldCheck,
  CheckCircle2,
  FileSpreadsheet,
} from 'lucide-react';
import { ModuleItem } from '../types';
import { DEFAULT_SHEETS_FOLDER_ID } from '../services/raxaApi';

interface ModuleDrawerProps {
  module: ModuleItem | null;
  onClose: () => void;
  onOpenUserManagement: () => void;
}

export const ModuleDrawer: React.FC<ModuleDrawerProps> = ({
  module,
  onClose,
  onOpenUserManagement,
}) => {
  if (!module) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="w-full max-w-lg h-full bg-[var(--card)] border-l border-[var(--line)] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="px-6 py-5 bg-[var(--sec)] border-b border-[var(--line)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#12263a] text-[#95d600]">
              {module.id === 'human-resource' && <Users className="w-6 h-6" />}
              {module.id === 'customers-sales' && <TrendingUp className="w-6 h-6" />}
              {module.id === 'inventory-logistics' && <Boxes className="w-6 h-6" />}
              {module.id === 'customer-experience' && <HeartHandshake className="w-6 h-6 text-[#95d600]" />}
              {module.id === 'purchase-expenses' && <Receipt className="w-6 h-6" />}
              {module.id === 'dashboard' && <LayoutDashboard className="w-6 h-6" />}
              {module.id === 'management' && <ShieldCheck className="w-6 h-6" />}
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--sub)] font-mono">
                {module.category}
              </span>
              <h3 className="text-xl font-extrabold text-[var(--ink)] leading-tight">
                {module.title}
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[var(--sub)] hover:text-[var(--ink)] rounded-full hover:bg-[var(--card)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div>
            <h4 className="text-xs font-bold text-[var(--sub)] uppercase tracking-wider mb-1.5">
              Module Overview
            </h4>
            <p className="text-sm text-[var(--ink)] leading-relaxed">{module.description}</p>
          </div>

          {/* Metrics */}
          <div>
            <h4 className="text-xs font-bold text-[var(--sub)] uppercase tracking-wider mb-3">
              Operational Indicators
            </h4>
            <div className="grid grid-cols-2 gap-3">
              {module.metrics.map((m, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[var(--sec)] border border-[var(--line)]"
                >
                  <div className="text-xs text-[var(--sub)]">{m.label}</div>
                  <div className="text-2xl font-black text-[var(--ink)] font-mono mt-1">
                    {m.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Features */}
          <div>
            <h4 className="text-xs font-bold text-[var(--sub)] uppercase tracking-wider mb-3">
              Subsystems & Capabilities
            </h4>
            <div className="space-y-2">
              {module.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-[var(--card)] border border-[var(--line)] flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2.5 font-semibold text-[var(--ink)]">
                    <CheckCircle2 className="w-4 h-4 text-[#95d600]" />
                    <span>{feat}</span>
                  </div>
                  <span className="text-[11px] font-mono text-[var(--sub)]">Operational</span>
                </div>
              ))}
            </div>
          </div>

          {/* Google Sheets Sync Note */}
          <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-xs space-y-2">
            <div className="flex items-center gap-2 text-[#2f72bf] font-bold">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Google Sheets Database Sync</span>
            </div>
            <p className="text-[var(--sub)]">
              This module writes transaction logs and retrieves lookups from the Google Sheets database inside Drive folder:
            </p>
            <div className="p-2 rounded-lg bg-[var(--card)] font-mono text-[11px] text-[var(--ink)] truncate">
              {DEFAULT_SHEETS_FOLDER_ID}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 bg-[var(--sec)] border-t border-[var(--line)] flex items-center justify-between gap-3">
          {module.id === 'management' ? (
            <button
              onClick={() => {
                onClose();
                onOpenUserManagement();
              }}
              className="w-full py-3 text-sm font-bold rounded-full bg-[#12263a] text-white border-2 border-[#95d600] hover:bg-[#1c3854] transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <ShieldCheck className="w-4 h-4 text-[#95d600]" />
              <span>Open User Management Table</span>
            </button>
          ) : (
            <a
              href={`https://drive.google.com/drive/folders/${DEFAULT_SHEETS_FOLDER_ID}`}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 text-xs font-bold rounded-full bg-[#12263a] text-white border border-[var(--line)] hover:bg-[#1c3854] transition-all flex items-center justify-center gap-2 text-center"
            >
              <span>View Data in Google Sheets</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#95d600]" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
