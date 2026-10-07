import React, { useState } from 'react';
import { X, Eye, EyeOff, Lock, User, AlertCircle, ArrowRight } from 'lucide-react';
import { apiService } from '../services/raxaApi';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (accountId: string, userName: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [username, setUsername] = useState<string>('juan.delacruz');
  const [password, setPassword] = useState<string>('Password@2026');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Enter your username and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await apiService.login(username.trim(), password);
      if (res.ok && res.accountId && res.name) {
        onSuccess(res.accountId, res.name);
        onClose();
      } else {
        setError(res.error || 'Sign-in failed. Please check your credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'Can’t reach the server. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (user: string, pass: string) => {
    setUsername(user);
    setPassword(pass);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[var(--card)] rounded-3xl border border-[var(--line)] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-6 bg-gradient-to-b from-[#12263a] to-[#102234] text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/logo.png"
              alt="RaXa"
              className="w-8 h-8 object-contain"
            />
            <div>
              <h3 className="text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                <span>Hi!</span>
                <span className="text-[#95d600]">Welcome back</span>
              </h3>
              <p className="text-xs text-[#9fb2c6] mt-0.5">
                Sign in to your RaXa workspace.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white/70 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[var(--ink)] mb-1">
              Username
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--sub)]" />
              <input
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username (e.g. juan.delacruz)"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-[var(--field)] border border-[var(--line)] text-[var(--ink)] font-mono focus:outline-none focus:border-[#2f72bf]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-[var(--ink)]">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs text-[#2f72bf] hover:underline flex items-center gap-1"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPassword ? 'Hide' : 'Show'}</span>
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--sub)]" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-[var(--field)] border border-[var(--line)] text-[var(--ink)] font-mono focus:outline-none focus:border-[#2f72bf]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 text-sm font-extrabold rounded-full bg-[#12263a] text-white border-2 border-[#95d600] hover:bg-[#1a3854] transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-4 shadow-md"
          >
            <span>{loading ? 'Authenticating...' : 'Sign in'}</span>
            <ArrowRight className="w-4 h-4 text-[#95d600]" />
          </button>

          {/* Quick Demo Credentials */}
          <div className="pt-4 border-t border-[var(--line)]">
            <div className="text-[11px] font-bold text-[var(--sub)] mb-2 uppercase tracking-wider text-center">
              Quick Test Credentials
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => handleFillDemo('juan.delacruz', 'Password@2026')}
                className="p-2 rounded-xl bg-[var(--sec)] hover:bg-[#2f72bf]/10 border border-[var(--line)] text-left transition-colors"
              >
                <div className="font-bold text-[var(--ink)]">Admin (Owner)</div>
                <div className="text-[11px] text-[var(--sub)] font-mono">juan.delacruz</div>
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('maria.santos', 'Password@2026')}
                className="p-2 rounded-xl bg-[var(--sec)] hover:bg-[#2f72bf]/10 border border-[var(--line)] text-left transition-colors"
              >
                <div className="font-bold text-[var(--ink)]">Manager</div>
                <div className="text-[11px] text-[var(--sub)] font-mono">maria.santos</div>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
