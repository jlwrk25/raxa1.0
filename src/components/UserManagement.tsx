import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Filter,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Shield,
  RefreshCw,
  X,
  Lock,
} from 'lucide-react';
import { User, UserRole } from '../types';
import { apiService } from '../services/raxaApi';

interface UserManagementProps {
  accountId: string;
}

const ROLES: UserRole[] = ['Admin', 'Manager', 'Staff', 'Cashier', 'Viewer'];

// 5 password / access code security checks matching RaXa rules
function checkPasswordRules(v: string) {
  return [
    { ok: v.length >= 8, text: '8+ characters' },
    { ok: /[A-Z]/.test(v), text: '1 uppercase letter' },
    { ok: /\d/.test(v), text: '1 number' },
    { ok: /[^A-Za-z0-9\s]/.test(v), text: '1 special character' },
    { ok: v.length > 0 && !/\s/.test(v), text: 'No spaces' },
  ];
}

export const UserManagement: React.FC<UserManagementProps> = ({ accountId }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Form State
  const [nickname, setNickname] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [role, setRole] = useState<UserRole>('Staff');
  const [accessCode, setAccessCode] = useState<string>('');
  const [showAccessCode, setShowAccessCode] = useState<boolean>(false);
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [formError, setFormError] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  // Feedback Toast
  const [toastMessage, setToastMessage] = useState<string>('');

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await apiService.getUsers(accountId);
      setUsers(data);
    } catch {
      setUsers(apiService.getLocalUsers());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [accountId]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const openAddModal = () => {
    setEditingUser(null);
    setNickname('');
    setUsername('');
    setPassword('');
    setRole('Staff');
    setAccessCode('');
    setStatus('Active');
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setNickname(user.nickname);
    setUsername(user.username);
    setPassword(''); // leave blank if unchanged
    setRole(user.role);
    setAccessCode(user.accessCode || '');
    setStatus(user.status);
    setFormError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormError('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!nickname.trim()) {
      setFormError('Nickname is required.');
      return;
    }
    if (!username.trim()) {
      setFormError('Username is required.');
      return;
    }

    // Password validations
    if (!editingUser && !password) {
      setFormError('Password is required for new accounts.');
      return;
    }

    if (password) {
      const pRules = checkPasswordRules(password);
      if (!pRules.every((r) => r.ok)) {
        setFormError('Password does not satisfy all security requirements.');
        return;
      }
    }

    // Admin access code validations
    if (role === 'Admin') {
      if (!editingUser && !accessCode) {
        setFormError('Access Code is required for the Admin role.');
        return;
      }
      if (accessCode) {
        const cRules = checkPasswordRules(accessCode);
        if (!cRules.every((r) => r.ok)) {
          setFormError('Access Code must satisfy all security requirements.');
          return;
        }
      }
    }

    setIsSaving(true);
    try {
      if (editingUser) {
        await apiService.updateUser(editingUser.userId, {
          nickname: nickname.trim(),
          username: username.trim(),
          role,
          status,
          ...(password ? { password } : {}),
          ...(role === 'Admin' && accessCode ? { accessCode } : {}),
        });
        showToast('User updated successfully.');
      } else {
        await apiService.createUser({
          accountId,
          nickname: nickname.trim(),
          username: username.trim(),
          password,
          role,
          accessCode: role === 'Admin' ? accessCode : '',
          modules: 'Standard',
          fields: 'Read/Write',
          status,
        });
        showToast('New user added successfully.');
      }
      closeModal();
      await loadData();
    } catch (err: any) {
      setFormError(err.message || 'Failed to save user.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (userId: string, name: string) => {
    if (window.confirm(`Are you sure you want to remove user "${name}"?`)) {
      try {
        await apiService.deleteUser(userId);
        showToast(`User ${name} removed.`);
        await loadData();
      } catch (err: any) {
        alert(err.message || 'Failed to delete user.');
      }
    }
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.nickname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.userId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || u.role.toLowerCase() === roleFilter.toLowerCase();
    const matchesStatus = statusFilter === 'all' || u.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesRole && matchesStatus;
  });

  const passwordRules = checkPasswordRules(password);
  const codeRules = checkPasswordRules(accessCode);

  return (
    <section id="users-management" className="py-12 md:py-16 px-4 md:px-8 bg-[var(--bg)] min-h-[700px]">
      <div className="max-w-7xl mx-auto">
        {/* Toast notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-[#12263a] text-white px-5 py-3 rounded-xl shadow-2xl border border-[#95d600] flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-[#95d600]" />
            <span className="text-sm font-semibold">{toastMessage}</span>
          </div>
        )}

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[var(--sub)] mb-2">
              <span>Google Sheets Database Table</span>
              <span>·</span>
              <span className="text-[#95d600]">[Users]</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--ink)]">
              User Management
            </h2>
            <p className="text-sm md:text-base text-[var(--sub)] mt-1">
              Synchronized live with your Google Sheets database through the Google Apps Script Web App.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              className="p-2.5 rounded-xl border border-[var(--line)] bg-[var(--card)] hover:bg-[var(--sec)] text-[var(--sub)] transition-colors"
              title="Refresh Users"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#2f72bf]' : ''}`} />
            </button>
            <button
              onClick={openAddModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#12263a] hover:bg-[#1a3854] text-[#eef1f7] font-bold text-sm border-2 border-[#95d600] transition-all shadow-sm"
            >
              <Plus className="w-4 h-4 text-[#95d600]" />
              <span>Add User</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 rounded-2xl bg-[var(--sec)] border border-[var(--line)] mb-6">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--sub)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, username or ID..."
              className="w-full pl-10 pr-4 py-2 text-sm rounded-xl bg-[var(--card)] border border-[var(--line)] text-[var(--ink)] placeholder-[var(--sub)] focus:outline-none focus:border-[#2f72bf]"
            />
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-[var(--sub)] shrink-0" />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="w-full sm:w-auto px-3 py-2 text-xs font-semibold rounded-xl bg-[var(--card)] border border-[var(--line)] text-[var(--ink)] focus:outline-none"
              >
                <option value="all">All Roles</option>
                {ROLES.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-2 text-xs font-semibold rounded-xl bg-[var(--card)] border border-[var(--line)] text-[var(--ink)] focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-2xl border border-[var(--line)] bg-[var(--card)] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[var(--line)] bg-[var(--sec)]/60 text-xs font-bold text-[var(--sub)] uppercase tracking-wider">
                  <th className="py-3.5 px-4">User ID</th>
                  <th className="py-3.5 px-4">Nickname</th>
                  <th className="py-3.5 px-4">Username</th>
                  <th className="py-3.5 px-4">Password</th>
                  <th className="py-3.5 px-4">Role</th>
                  <th className="py-3.5 px-4">Access Code</th>
                  <th className="py-3.5 px-4">Modules</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--line)]">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-[var(--sub)]">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#2f72bf]" />
                      <span>Synchronizing live sheet records...</span>
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-[var(--sub)]">
                      No matching users found in the database.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => {
                    const isAdmin = u.role === 'Admin';
                    return (
                      <tr key={u.userId} className="hover:bg-[var(--sec)]/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-xs text-[var(--sub)] font-semibold">
                          {u.userId}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-[var(--ink)]">
                          {u.nickname}
                        </td>
                        <td className="py-3.5 px-4 text-[var(--sub)] font-mono text-xs">
                          {u.username}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-xs text-[var(--sub)]">
                          ••••••••
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-bold ${
                              isAdmin
                                ? 'bg-[#95d600]/20 text-[#4a7000] dark:text-[#95d600]'
                                : 'bg-[var(--sec)] text-[var(--ink)] border border-[var(--line)]'
                            }`}
                          >
                            {isAdmin && <Shield className="w-3 h-3 text-[#95d600]" />}
                            {u.role}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-xs text-[var(--sub)]">
                          {isAdmin ? '••••••••' : '—'}
                        </td>
                        <td className="py-3.5 px-4 text-xs text-[var(--sub)] max-w-[160px] truncate">
                          {u.modules}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              u.status === 'Active'
                                ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                                : 'bg-slate-500/15 text-slate-500'
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => openEditModal(u)}
                              className="p-1.5 text-[var(--sub)] hover:text-[#2f72bf] hover:bg-[var(--sec)] rounded-lg transition-colors"
                              title="Edit user"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(u.userId, u.nickname)}
                              className="p-1.5 text-[var(--sub)] hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                              title="Remove user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="py-3 px-4 bg-[var(--sec)]/40 border-t border-[var(--line)] flex items-center justify-between text-xs text-[var(--sub)]">
            <span>
              Showing <strong className="text-[var(--ink)] font-mono">{filteredUsers.length}</strong> of{' '}
              <strong className="text-[var(--ink)] font-mono">{users.length}</strong> users
            </span>
            <span>Account: {accountId}</span>
          </div>
        </div>

        {/* Add / Edit User Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-lg bg-[var(--card)] rounded-3xl border border-[var(--line)] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
              {/* Modal Header */}
              <div className="px-6 py-5 bg-[var(--sec)] border-b border-[var(--line)] flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-extrabold text-[var(--ink)]">
                    {editingUser ? 'Edit User' : 'Add New User'}
                  </h3>
                  <p className="text-xs text-[var(--sub)] mt-0.5">
                    Records save directly into Google Sheets Users table.
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-1.5 text-[var(--sub)] hover:text-[var(--ink)] rounded-full hover:bg-[var(--card)] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-4">
                {formError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 text-xs font-semibold flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{formError}</span>
                  </div>
                )}

                {/* Nickname & Username */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--ink)] mb-1">
                      Nickname *
                    </label>
                    <input
                      type="text"
                      required
                      value={nickname}
                      onChange={(e) => setNickname(e.target.value)}
                      placeholder="e.g. Maria Santos"
                      className="w-full px-3.5 py-2 text-sm rounded-xl bg-[var(--field)] border border-[var(--line)] text-[var(--ink)] focus:outline-none focus:border-[#2f72bf]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--ink)] mb-1">
                      Username *
                    </label>
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. maria.santos"
                      className="w-full px-3.5 py-2 text-sm rounded-xl bg-[var(--field)] border border-[var(--line)] text-[var(--ink)] font-mono focus:outline-none focus:border-[#2f72bf]"
                    />
                  </div>
                </div>

                {/* Password field with rule checks */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-[var(--ink)]">
                      {editingUser ? 'New Password (leave blank to keep current)' : 'Password *'}
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
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={editingUser ? '••••••••' : 'Enter strong password'}
                    className="w-full px-3.5 py-2 text-sm rounded-xl bg-[var(--field)] border border-[var(--line)] text-[var(--ink)] font-mono focus:outline-none focus:border-[#2f72bf]"
                  />

                  {/* 5 Password Rules Indicator */}
                  {password && (
                    <div className="mt-2.5 p-3 rounded-xl bg-[var(--sec)] border border-[var(--line)]">
                      <div className="text-[11px] font-bold text-[var(--sub)] mb-1.5 uppercase tracking-wide">
                        Security Requirements:
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[11px]">
                        {passwordRules.map((rule, idx) => (
                          <div
                            key={idx}
                            className={`flex items-center gap-1.5 ${
                              rule.ok ? 'text-emerald-600 font-semibold' : 'text-[var(--sub)]'
                            }`}
                          >
                            {rule.ok ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            )}
                            <span>{rule.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Role and Status */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[var(--ink)] mb-1">Role *</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full px-3.5 py-2 text-sm rounded-xl bg-[var(--field)] border border-[var(--line)] text-[var(--ink)] focus:outline-none"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[var(--ink)] mb-1">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as 'Active' | 'Inactive')}
                      className="w-full px-3.5 py-2 text-sm rounded-xl bg-[var(--field)] border border-[var(--line)] text-[var(--ink)] focus:outline-none"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                {/* Admin Access Code */}
                {role === 'Admin' && (
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/25">
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-amber-500" />
                        <span>Admin Access Code *</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowAccessCode(!showAccessCode)}
                        className="text-xs text-amber-700 dark:text-amber-400 hover:underline"
                      >
                        {showAccessCode ? 'Hide' : 'Show'}
                      </button>
                    </div>
                    <p className="text-[11px] text-[var(--sub)] mb-2">
                      Required for administrative roles to safeguard sensitive Google Sheets access.
                    </p>
                    <input
                      type={showAccessCode ? 'text' : 'password'}
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      placeholder="Access Code (e.g. Access@2026)"
                      className="w-full px-3.5 py-2 text-sm rounded-xl bg-[var(--card)] border border-amber-500/30 text-[var(--ink)] font-mono focus:outline-none"
                    />

                    {accessCode && (
                      <div className="grid grid-cols-2 gap-1 text-[11px] mt-2">
                        {codeRules.map((r, i) => (
                          <div
                            key={i}
                            className={`flex items-center gap-1.5 ${
                              r.ok ? 'text-emerald-600 font-semibold' : 'text-[var(--sub)]'
                            }`}
                          >
                            {r.ok ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <XCircle className="w-3.5 h-3.5 text-slate-400" />
                            )}
                            <span>{r.text}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-[var(--line)]">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-5 py-2.5 text-sm font-semibold rounded-full border border-[var(--line)] text-[var(--ink)] hover:bg-[var(--sec)] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="px-6 py-2.5 text-sm font-bold rounded-full bg-[#12263a] text-white border-2 border-[#95d600] hover:bg-[#1a3854] transition-all disabled:opacity-50"
                  >
                    {isSaving ? 'Saving to Sheets...' : editingUser ? 'Update User' : 'Save User'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
