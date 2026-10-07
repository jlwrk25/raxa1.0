import React, { useState } from 'react';
import {
  X,
  Database,
  ExternalLink,
  Check,
  Copy,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  FolderOpen,
  Code2,
} from 'lucide-react';
import {
  apiService,
  DEFAULT_APPS_SCRIPT_URL,
  DEFAULT_SHEETS_FOLDER_ID,
  DEFAULT_ASSETS_FOLDER_ID,
} from '../services/raxaApi';

interface DatabaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseModal: React.FC<DatabaseModalProps> = ({ isOpen, onClose }) => {
  const [currentUrl, setCurrentUrl] = useState<string>(() => apiService.getApiUrl());
  const [isTesting, setIsTesting] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<{
    ok: boolean;
    message: string;
    latencyMs?: number;
  } | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'status' | 'code'>('status');

  if (!isOpen) return null;

  const handleTest = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await apiService.testConnection();
      setTestResult(res);
    } catch (err: any) {
      setTestResult({
        ok: false,
        message: err.message || 'Connection test failed',
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSaveUrl = () => {
    apiService.setApiUrl(currentUrl);
    setTestResult({
      ok: true,
      message: 'API URL updated in application storage.',
    });
  };

  const scriptCode = apiService.getAppsScriptDeploymentTemplate();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[var(--card)] rounded-3xl border border-[var(--line)] shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="px-6 py-5 bg-[var(--sec)] border-b border-[var(--line)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#12263a] text-[#95d600]">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-[var(--ink)]">
                Google Sheets & Apps Script Integration
              </h3>
              <p className="text-xs text-[var(--sub)] mt-0.5">
                Connected Google Workspace endpoints and storage folders.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[var(--sub)] hover:text-[var(--ink)] rounded-full hover:bg-[var(--card)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subnav tabs */}
        <div className="flex items-center gap-2 px-6 pt-4 border-b border-[var(--line)] bg-[var(--card)]">
          <button
            onClick={() => setActiveTab('status')}
            className={`pb-3 text-xs font-bold border-b-2 transition-colors ${
              activeTab === 'status'
                ? 'border-[#2f72bf] text-[#2f72bf]'
                : 'border-transparent text-[var(--sub)] hover:text-[var(--ink)]'
            }`}
          >
            Connection Status & Resources
          </button>
          <button
            onClick={() => setActiveTab('code')}
            className={`pb-3 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'code'
                ? 'border-[#2f72bf] text-[#2f72bf]'
                : 'border-transparent text-[var(--sub)] hover:text-[var(--ink)]'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Apps Script Backend Code</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {activeTab === 'status' ? (
            <>
              {/* Endpoint configuration */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-[var(--ink)]">
                  Google Apps Script Web App URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={currentUrl}
                    onChange={(e) => setCurrentUrl(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 text-xs font-mono rounded-xl bg-[var(--field)] border border-[var(--line)] text-[var(--ink)] focus:outline-none focus:border-[#2f72bf]"
                  />
                  <button
                    onClick={handleSaveUrl}
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-[var(--sec)] border border-[var(--line)] hover:bg-[#2f72bf] hover:text-white transition-colors"
                  >
                    Save
                  </button>
                </div>
                <p className="text-[11px] text-[var(--sub)]">
                  The web app sends text/plain requests to this URL to bypass CORS preflight restrictions.
                </p>
              </div>

              {/* Ping / Test connection */}
              <div className="p-4 rounded-2xl bg-[var(--sec)] border border-[var(--line)]">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-xs font-bold text-[var(--ink)]">Live Health Check</h4>
                    <p className="text-[11px] text-[var(--sub)]">
                      Sends a live diagnostic ping to the Apps Script macro.
                    </p>
                  </div>
                  <button
                    onClick={handleTest}
                    disabled={isTesting}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-[#12263a] text-white text-xs font-bold border border-[#95d600] hover:bg-[#1c3854] transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isTesting ? 'animate-spin' : ''}`} />
                    <span>{isTesting ? 'Testing...' : 'Test Connection'}</span>
                  </button>
                </div>

                {testResult && (
                  <div
                    className={`p-3 rounded-xl text-xs font-semibold flex items-start gap-2.5 ${
                      testResult.ok
                        ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {testResult.ok ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <div>{testResult.message}</div>
                      {testResult.latencyMs && (
                        <div className="text-[11px] font-mono mt-1 opacity-80">
                          Response time: {testResult.latencyMs}ms
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Linked Drive Folders */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[var(--sub)] uppercase tracking-wider">
                  Associated Google Drive Resources
                </h4>

                {/* Database Sheets Folder */}
                <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--line)] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600">
                      <FolderOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[var(--ink)]">
                        Database Sheets Folder
                      </div>
                      <div className="text-[11px] font-mono text-[var(--sub)]">
                        ID: {DEFAULT_SHEETS_FOLDER_ID}
                      </div>
                    </div>
                  </div>
                  <a
                    href={`https://drive.google.com/drive/folders/${DEFAULT_SHEETS_FOLDER_ID}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-[var(--sub)] hover:text-[#2f72bf] hover:bg-[var(--sec)] rounded-lg transition-colors"
                    title="Open in Google Drive"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>

                {/* Assets Folder */}
                <div className="p-4 rounded-2xl bg-[var(--card)] border border-[var(--line)] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-blue-500/15 text-blue-600">
                      <FolderOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[var(--ink)]">
                        Assets Folder (Images, CSS, JS)
                      </div>
                      <div className="text-[11px] font-mono text-[var(--sub)]">
                        ID: {DEFAULT_ASSETS_FOLDER_ID}
                      </div>
                    </div>
                  </div>
                  <a
                    href={`https://drive.google.com/drive/folders/${DEFAULT_ASSETS_FOLDER_ID}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-[var(--sub)] hover:text-[#2f72bf] hover:bg-[var(--sec)] rounded-lg transition-colors"
                    title="Open in Google Drive"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-[var(--ink)]">
                    Ready-to-Deploy Google Apps Script
                  </h4>
                  <p className="text-[11px] text-[var(--sub)]">
                    Paste this into your Google Spreadsheet (Extensions &gt; Apps Script) and deploy as a Web App.
                  </p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--sec)] hover:bg-[#2f72bf] hover:text-white border border-[var(--line)] text-xs font-semibold transition-colors"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>

              <div className="relative rounded-2xl bg-[#0b1826] text-[#eef1f7] p-4 text-xs font-mono max-h-[380px] overflow-y-auto border border-[#24405a]">
                <pre>{scriptCode}</pre>
              </div>

              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-[var(--sub)] space-y-1">
                <div className="font-bold text-[var(--ink)]">How to deploy:</div>
                <ol className="list-decimal list-inside space-y-0.5">
                  <li>Open your Google Sheet inside folder <code className="text-[#2f72bf]">{DEFAULT_SHEETS_FOLDER_ID}</code></li>
                  <li>Click <strong>Extensions &gt; Apps Script</strong></li>
                  <li>Paste the code above into <code className="text-[#2f72bf]">Code.gs</code></li>
                  <li>Click <strong>Deploy &gt; New deployment &gt; Web app</strong></li>
                  <li>Set <strong>Execute as:</strong> Me, and <strong>Who has access:</strong> Anyone</li>
                </ol>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[var(--sec)] border-t border-[var(--line)] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold rounded-full bg-[#12263a] text-white hover:bg-[#1c3854] transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
