import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { WorkspaceSection, MODULES_DATA } from './components/WorkspaceSection';
import { UserManagement } from './components/UserManagement';
import { TraitsSection } from './components/TraitsSection';
import { UsersChartSection } from './components/UsersChartSection';
import { FeedbackSection } from './components/FeedbackSection';
import { DatabaseModal } from './components/DatabaseModal';
import { LoginModal } from './components/LoginModal';
import { ModuleDrawer } from './components/ModuleDrawer';
import { ModuleItem } from './types';
import { apiService, DEFAULT_SHEETS_FOLDER_ID, DEFAULT_ASSETS_FOLDER_ID } from './services/raxaApi';

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('raxa-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  const [activeTab, setActiveTab] = useState<'home' | 'workspace' | 'users' | 'analytics' | 'feedback'>('home');
  const [selectedModule, setSelectedModule] = useState<ModuleItem | null>(null);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [isDatabaseOpen, setIsDatabaseOpen] = useState<boolean>(false);

  // User session
  const [session, setSession] = useState(() => apiService.getSession());
  const [trialDaysLeft, setTrialDaysLeft] = useState<number>(40);

  // Sync theme attribute on document root
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('raxa-theme', theme);
  }, [theme]);

  // Load client trial data
  useEffect(() => {
    apiService.getClient(session.accountId).then((client) => {
      if (client && client.signupDate) {
        const signup = new Date(client.signupDate);
        const today = new Date();
        const usedDays = Math.max(0, Math.round((today.getTime() - signup.getTime()) / 86400000));
        setTrialDaysLeft(Math.max(0, 52 - usedDays));
      }
    });
  }, [session.accountId]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleLoginSuccess = (accountId: string, userName: string) => {
    setSession({
      accountId,
      userName,
      token: 'tok_active_' + Date.now(),
    });
  };

  const handleLogout = () => {
    apiService.clearSession();
    setSession({
      accountId: 'ACC-8801',
      userName: 'Guest',
      token: '',
    });
  };

  const handleSelectModule = (moduleId: string) => {
    if (moduleId === 'management') {
      setActiveTab('users');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const found = MODULES_DATA.find((m) => m.id === moduleId);
    if (found) {
      setSelectedModule(found);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg)] text-[var(--ink)] selection:bg-[#95d600] selection:text-[#12263a]">
      {/* Top Bar Contract (3 zones) */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenLogin={() => setIsLoginOpen(true)}
        onOpenDatabase={() => setIsDatabaseOpen(true)}
        onNavigateTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        activeTab={activeTab}
        userName={session.userName}
        accountId={session.accountId}
        isLoggedIn={Boolean(session.token)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <HeroSection
              theme={theme}
              onExploreWorkspace={() => {
                setActiveTab('workspace');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenManagement={() => {
                setActiveTab('users');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenDatabase={() => setIsDatabaseOpen(true)}
            />
            <WorkspaceSection
              onSelectModule={handleSelectModule}
              accountId={session.accountId}
              userName={session.userName}
              trialDaysLeft={trialDaysLeft}
            />
            <TraitsSection />
            <UsersChartSection />
            <FeedbackSection />
          </>
        )}

        {activeTab === 'workspace' && (
          <div className="py-8">
            <WorkspaceSection
              onSelectModule={handleSelectModule}
              accountId={session.accountId}
              userName={session.userName}
              trialDaysLeft={trialDaysLeft}
            />
            <div className="max-w-7xl mx-auto px-4 md:px-8 mt-6">
              <div className="p-6 rounded-3xl bg-[var(--sec)] border border-[var(--line)] flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-base text-[var(--ink)]">
                    Looking for User RBAC Permissions?
                  </h3>
                  <p className="text-xs text-[var(--sub)] mt-0.5">
                    Configure users, roles, and administrative access codes stored in Google Sheets.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab('users');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="px-6 py-2.5 text-xs font-bold rounded-full bg-[#12263a] text-white border-2 border-[#95d600] hover:bg-[#1a3854] transition-all shrink-0"
                >
                  Open User Management
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <UserManagement accountId={session.accountId} />
        )}

        {activeTab === 'analytics' && (
          <UsersChartSection />
        )}

        {activeTab === 'feedback' && (
          <FeedbackSection />
        )}
      </main>

      {/* Modals & Overlays */}
      <DatabaseModal
        isOpen={isDatabaseOpen}
        onClose={() => setIsDatabaseOpen(false)}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSuccess={handleLoginSuccess}
      />

      <ModuleDrawer
        module={selectedModule}
        onClose={() => setSelectedModule(null)}
        onOpenUserManagement={() => {
          setSelectedModule(null);
          setActiveTab('users');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Footer */}
      <footer className="py-8 px-6 md:px-12 bg-[#12263a] text-white border-t border-[#24405a]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-[#9fb2c6]">
          <div className="flex items-center gap-3">
            <img
              src="/assets/logo.png"
              alt="RaXa Systems"
              className="w-6 h-6 object-contain"
            />
            <span className="font-bold text-white">RaXa Systems</span>
            <span>·</span>
            <span>Simple Web App</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsDatabaseOpen(true)}
              className="hover:text-[#95d600] transition-colors underline"
            >
              Google Apps Script API
            </button>
            <a
              href={`https://drive.google.com/drive/folders/${DEFAULT_SHEETS_FOLDER_ID}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#95d600] transition-colors"
            >
              Sheets Database
            </a>
            <a
              href={`https://drive.google.com/drive/folders/${DEFAULT_ASSETS_FOLDER_ID}`}
              target="_blank"
              rel="noreferrer"
              className="hover:text-[#95d600] transition-colors"
            >
              Drive Assets
            </a>
          </div>

          <div>
            <span>© {new Date().getFullYear()} RaXa Systems. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
