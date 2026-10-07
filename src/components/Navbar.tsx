import React from 'react';
import { Sun, Moon, Database } from 'lucide-react';

interface NavbarProps {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onOpenLogin: () => void;
  onOpenDatabase: () => void;
  onNavigateTab: (tab: 'home' | 'workspace' | 'users' | 'analytics' | 'feedback') => void;
  activeTab: string;
  userName: string;
  accountId: string;
  isLoggedIn: boolean;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  onOpenLogin,
  onOpenDatabase,
  onNavigateTab,
  activeTab,
  userName,
  accountId,
  isLoggedIn,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 py-3.5 bg-[#12263a] text-white shadow-md border-b border-[#24405a]/60">
      {/* Zone 1: Brand Wordmark */}
      <a
        href="#top"
        onClick={(e) => {
          e.preventDefault();
          onNavigateTab('home');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        className="flex items-center gap-3 text-lg font-extrabold tracking-tight text-white hover:opacity-90 transition-opacity shrink-0"
      >
        <img
          src="/assets/logo.png"
          alt="RaXa Logo"
          className="w-8 h-8 object-contain rounded-md bg-white/10 p-0.5"
          onError={(e) => {
            // fallback if image fails
            (e.target as HTMLElement).style.display = 'none';
          }}
        />
        <span className="text-xl font-bold tracking-tight text-[#eef1f7]">RaXa Systems</span>
      </a>

      {/* Zone 2: Clean 4-6 Nav Links */}
      <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-semibold text-[#c8d6e5]">
        <button
          onClick={() => onNavigateTab('home')}
          className={`whitespace-nowrap transition-colors hover:text-[#95d600] ${
            activeTab === 'home' ? 'text-[#95d600]' : ''
          }`}
        >
          Home
        </button>
        <button
          onClick={() => onNavigateTab('workspace')}
          className={`whitespace-nowrap transition-colors hover:text-[#95d600] ${
            activeTab === 'workspace' ? 'text-[#95d600]' : ''
          }`}
        >
          Workspace
        </button>
        <button
          onClick={() => onNavigateTab('users')}
          className={`whitespace-nowrap transition-colors hover:text-[#95d600] ${
            activeTab === 'users' ? 'text-[#95d600]' : ''
          }`}
        >
          User Management
        </button>
        <button
          onClick={() => onNavigateTab('analytics')}
          className={`whitespace-nowrap transition-colors hover:text-[#95d600] ${
            activeTab === 'analytics' ? 'text-[#95d600]' : ''
          }`}
        >
          Analytics
        </button>
        <button
          onClick={() => onNavigateTab('feedback')}
          className={`whitespace-nowrap transition-colors hover:text-[#95d600] ${
            activeTab === 'feedback' ? 'text-[#95d600]' : ''
          }`}
        >
          Comments
        </button>
      </nav>

      {/* Zone 3: 1-2 Primary Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          type="button"
          onClick={onOpenDatabase}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#eef1f7] bg-[#1a344f] hover:bg-[#234568] border border-[#2c4e72] rounded-full transition-colors whitespace-nowrap"
          title="Google Apps Script & Database Sheets Integration"
        >
          <Database className="w-3.5 h-3.5 text-[#95d600]" />
          <span className="hidden sm:inline">Google API</span>
        </button>

        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
          className="p-2 text-[#eef1f7] hover:text-[#95d600] hover:bg-[#1c334b] rounded-full transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-[#ffb703]" /> : <Moon className="w-4 h-4" />}
        </button>

        {isLoggedIn ? (
          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('users')}
              className="px-3.5 py-1.5 text-xs font-bold text-[#12263a] bg-[#95d600] hover:bg-[#a6ec00] rounded-full transition-colors whitespace-nowrap"
            >
              {userName} · {accountId}
            </button>
            <button
              onClick={onLogout}
              className="text-xs text-[#9fb2c6] hover:text-white transition-colors underline whitespace-nowrap hidden sm:inline"
            >
              Log out
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={onOpenLogin}
            className="px-4 py-1.5 text-xs font-bold text-[#eef1f7] border-2 border-[#95d600] hover:bg-[#95d600] hover:text-[#12263a] rounded-full transition-all whitespace-nowrap"
          >
            Sign in
          </button>
        )}
      </div>
    </header>
  );
};
