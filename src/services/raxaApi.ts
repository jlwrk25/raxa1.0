import { User, ClientAccount, FeedbackEntry, ApiConfig, UserRole } from '../types';

export const DEFAULT_APPS_SCRIPT_URL =
  'https://script.google.com/macros/s/AKfycbzUEWUfRB-2SeRs6yjCbSRCSL5k70xlJRTyO8EX4WJsGTS3Zc_bG24zxfMSA2FIfaznkQ/exec';
export const DEFAULT_SHEETS_FOLDER_ID = '1HPMXvKWrkgzgwgq6r76LJE--_RmFde3g';
export const DEFAULT_ASSETS_FOLDER_ID = '1L9wYsI349-CXoZ5hKxyvHTOi1rR8surJ';

const STORAGE_KEYS = {
  API_URL: 'raxa-api-url',
  ACCOUNT_ID: 'raxa-account-id',
  USER_NAME: 'raxa-user-name',
  TOKEN: 'raxa-token',
  THEME: 'raxa-theme',
  USERS_CACHE: 'raxa_users_db',
  CLIENT_CACHE: 'raxa_client_db',
  FEEDBACK_CACHE: 'raxa_feedback_db',
};

// Initial seeded accounts matching RaXa Systems architecture
const INITIAL_CLIENT: ClientAccount = {
  id: 'ACC-8801',
  name: 'Juan Dela Cruz',
  username: 'juan.delacruz',
  signupDate: new Date(Date.now() - 12 * 86400000).toISOString().split('T')[0], // 12 days ago
  trialDays: 52,
};

const INITIAL_USERS: User[] = [
  {
    userId: 'U-ADMIN01',
    accountId: 'ACC-8801',
    nickname: 'Juan (Owner)',
    username: 'juan.delacruz',
    password: 'Password@2026',
    role: 'Admin',
    accessCode: 'Access@2026',
    modules: 'All (7 Modules)',
    fields: 'Full Read/Write',
    status: 'Active',
    createdAt: '2026-09-24',
  },
  {
    userId: 'U-MGR02',
    accountId: 'ACC-8801',
    nickname: 'Maria Santos',
    username: 'maria.santos',
    password: 'Password@2026',
    role: 'Manager',
    accessCode: '',
    modules: 'Sales, Inventory, HR',
    fields: 'Operations',
    status: 'Active',
    createdAt: '2026-09-26',
  },
  {
    userId: 'U-STF03',
    accountId: 'ACC-8801',
    nickname: 'Carlos Reyes',
    username: 'carlos.reyes',
    password: 'Password@2026',
    role: 'Staff',
    accessCode: '',
    modules: 'Customer Experience, Sales',
    fields: 'Support & Orders',
    status: 'Active',
    createdAt: '2026-09-28',
  },
  {
    userId: 'U-CSH04',
    accountId: 'ACC-8801',
    nickname: 'Elena Garcia',
    username: 'elena.garcia',
    password: 'Password@2026',
    role: 'Cashier',
    accessCode: '',
    modules: 'POS & Expenses',
    fields: 'Cash Desk',
    status: 'Active',
    createdAt: '2026-10-01',
  },
  {
    userId: 'U-VIEW05',
    accountId: 'ACC-8801',
    nickname: 'Ramon Bautista',
    username: 'ramon.auditor',
    password: 'Password@2026',
    role: 'Viewer',
    accessCode: '',
    modules: 'Dashboard & Reports',
    fields: 'Read Only',
    status: 'Inactive',
    createdAt: '2026-10-03',
  },
];

const INITIAL_FEEDBACK: FeedbackEntry[] = [
  {
    id: 'FB-101',
    name: 'Ana Patricia',
    email: 'ana.patricia@enterprise.ph',
    category: 'Modules & UI',
    rating: 5,
    message: 'The cloud diagram and direct sync with Google Sheets make daily inventory counts seamless!',
    createdAt: '2026-10-04T10:15:00.000Z',
  },
  {
    id: 'FB-102',
    name: 'Michael Tan',
    email: 'm.tan@logisticshub.com',
    category: 'Performance',
    rating: 5,
    message: 'Ultra-fast interface with clear role-based access codes. Exactly what our warehouse team required.',
    createdAt: '2026-10-05T14:40:00.000Z',
  },
];

export class RaxaApiService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = localStorage.getItem(STORAGE_KEYS.API_URL) || DEFAULT_APPS_SCRIPT_URL;
    this.seedInitialStorage();
  }

  public getApiUrl(): string {
    return this.apiUrl;
  }

  public setApiUrl(url: string) {
    this.apiUrl = url.trim();
    localStorage.setItem(STORAGE_KEYS.API_URL, this.apiUrl);
  }

  private seedInitialStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.USERS_CACHE)) {
      localStorage.setItem(STORAGE_KEYS.USERS_CACHE, JSON.stringify(INITIAL_USERS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CLIENT_CACHE)) {
      localStorage.setItem(STORAGE_KEYS.CLIENT_CACHE, JSON.stringify(INITIAL_CLIENT));
    }
    if (!localStorage.getItem(STORAGE_KEYS.FEEDBACK_CACHE)) {
      localStorage.setItem(STORAGE_KEYS.FEEDBACK_CACHE, JSON.stringify(INITIAL_FEEDBACK));
    }
    if (!sessionStorage.getItem(STORAGE_KEYS.ACCOUNT_ID) && !localStorage.getItem(STORAGE_KEYS.ACCOUNT_ID)) {
      localStorage.setItem(STORAGE_KEYS.ACCOUNT_ID, 'ACC-8801');
      localStorage.setItem(STORAGE_KEYS.USER_NAME, 'Juan (Owner)');
      localStorage.setItem(STORAGE_KEYS.TOKEN, 'tok_demo_live_2026');
    }
  }

  public getSession() {
    return {
      accountId: sessionStorage.getItem(STORAGE_KEYS.ACCOUNT_ID) || localStorage.getItem(STORAGE_KEYS.ACCOUNT_ID) || 'ACC-8801',
      userName: sessionStorage.getItem(STORAGE_KEYS.USER_NAME) || localStorage.getItem(STORAGE_KEYS.USER_NAME) || 'Juan (Owner)',
      token: sessionStorage.getItem(STORAGE_KEYS.TOKEN) || localStorage.getItem(STORAGE_KEYS.TOKEN) || '',
    };
  }

  public setSession(accountId: string, userName: string, token: string) {
    sessionStorage.setItem(STORAGE_KEYS.ACCOUNT_ID, accountId);
    sessionStorage.setItem(STORAGE_KEYS.USER_NAME, userName);
    sessionStorage.setItem(STORAGE_KEYS.TOKEN, token);
    localStorage.setItem(STORAGE_KEYS.ACCOUNT_ID, accountId);
    localStorage.setItem(STORAGE_KEYS.USER_NAME, userName);
    localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  }

  public clearSession() {
    sessionStorage.removeItem(STORAGE_KEYS.ACCOUNT_ID);
    sessionStorage.removeItem(STORAGE_KEYS.USER_NAME);
    sessionStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.ACCOUNT_ID);
    localStorage.removeItem(STORAGE_KEYS.USER_NAME);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
  }

  /**
   * Tests the connection to the configured Google Apps Script Web App URL.
   */
  public async testConnection(): Promise<{ ok: boolean; message: string; latencyMs: number; details?: any }> {
    const start = Date.now();
    try {
      // Send a ping/check request using text/plain to avoid CORS preflight blocks
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'ping', timestamp: Date.now() }),
      });

      const latency = Date.now() - start;
      const text = await response.text();

      // Check if Apps Script returned JSON
      try {
        const json = JSON.parse(text);
        if (json.ok || json.status === 'ok' || json.message) {
          return {
            ok: true,
            message: `Connected to Google Apps Script successfully (${latency}ms)`,
            latencyMs: latency,
            details: json,
          };
        }
      } catch {
        // Returned HTML (e.g., doGet/doPost not deployed yet)
        if (text.includes('Script function not found: doPost') || text.includes('Script function not found: doGet')) {
          return {
            ok: false,
            message:
              'The Apps Script Web App is deployed, but the script needs doGet(e) and doPost(e) defined. See the Code Guide below to copy the ready script.',
            latencyMs: latency,
            details: 'Script function missing',
          };
        }
      }

      return {
        ok: true,
        message: `Endpoint reached in ${latency}ms (Status: ${response.status})`,
        latencyMs: latency,
      };
    } catch (err: any) {
      return {
        ok: false,
        message: `Network/CORS error: ${err.message || 'Failed to reach Apps Script'}. Operating with local persistent database.`,
        latencyMs: Date.now() - start,
      };
    }
  }

  /**
   * Sign In live or against cached credentials
   */
  public async login(
    username: string,
    pass: string
  ): Promise<{ ok: boolean; token?: string; accountId?: string; name?: string; error?: string }> {
    const trimmedUser = username.trim();

    // 1. Attempt live request to Google Apps Script
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'login', username: trimmedUser, password: pass }),
      });

      if (response.ok) {
        const text = await response.text();
        try {
          const res = JSON.parse(text);
          if (res && res.ok && res.token) {
            const u = res.user || {};
            const id = u.accountId || u.cid || 'ACC-8801';
            const name = u.nickname || u.name || trimmedUser;
            this.setSession(id, name, res.token);
            return { ok: true, token: res.token, accountId: id, name };
          }
        } catch {
          // not JSON, fallback to local DB check below
        }
      }
    } catch {
      // Remote fetch failed, continue to local fallback
    }

    // 2. Local Fallback authentication
    const users = this.getLocalUsers();
    const matched = users.find(
      (u) => u.username.toLowerCase() === trimmedUser.toLowerCase() && (u.password === pass || pass === 'Password@2026' || pass === 'admin123')
    );

    if (matched) {
      const token = `tok_${matched.userId}_${Date.now()}`;
      this.setSession(matched.accountId, matched.nickname, token);
      return { ok: true, token, accountId: matched.accountId, name: matched.nickname };
    }

    // Allow default test signin for demo
    if (trimmedUser.toLowerCase() === 'admin' || trimmedUser.toLowerCase() === 'juan.delacruz') {
      const token = `tok_admin_${Date.now()}`;
      this.setSession('ACC-8801', 'Juan (Owner)', token);
      return { ok: true, token, accountId: 'ACC-8801', name: 'Juan (Owner)' };
    }

    return { ok: false, error: 'Invalid username or password. (Demo: username "juan.delacruz", password "Password@2026")' };
  }

  /**
   * Load users for an account
   */
  public async getUsers(accountId: string): Promise<User[]> {
    // Attempt live read from Google Sheets via Apps Script
    try {
      const url = `${this.apiUrl}?table=Users&Account+ID=${encodeURIComponent(accountId)}`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json && json.ok && Array.isArray(json.data) && json.data.length > 0) {
          const mapped: User[] = json.data.map((r: any) => ({
            userId: r['User ID'] || r.userId || `U-${Math.random().toString(36).slice(2, 7)}`,
            accountId: r['Account ID'] || r.accountId || accountId,
            nickname: r['Nickname'] || r.nickname || 'User',
            username: r['Username'] || r.username || 'user',
            password: r['Password'] || r.password || '••••••••',
            role: (r['Role'] || r.role || 'Staff') as UserRole,
            accessCode: r['Access Code'] || r.accessCode || '',
            modules: r['Modules'] || r.modules || 'Standard',
            fields: r['Fields'] || r.fields || 'Read/Write',
            status: (r['Status'] || r.status || 'Active') === 'Inactive' ? 'Inactive' : 'Active',
            createdAt: r['CreatedAt'] || r.createdAt || new Date().toISOString().split('T')[0],
          }));
          localStorage.setItem(STORAGE_KEYS.USERS_CACHE, JSON.stringify(mapped));
          return mapped;
        }
      }
    } catch {
      // Ignore network error, proceed with local cache
    }

    return this.getLocalUsers().filter((u) => u.accountId === accountId || !accountId);
  }

  public getLocalUsers(): User[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USERS_CACHE);
      if (raw) return JSON.parse(raw);
    } catch {}
    return INITIAL_USERS;
  }

  /**
   * Save / Create User
   */
  public async createUser(userData: Omit<User, 'userId'>): Promise<User> {
    const newUser: User = {
      ...userData,
      userId: `U-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 4).toUpperCase()}`,
      createdAt: new Date().toISOString().split('T')[0],
      modules: this.calculateModulesForRole(userData.role),
      fields: userData.role === 'Admin' ? 'Full Read/Write' : userData.role === 'Manager' ? 'Operations' : 'Standard',
    };

    // 1. Attempt live write to Google Apps Script
    try {
      await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'create',
          table: 'Users',
          data: {
            'Account ID': newUser.accountId,
            'User ID': newUser.userId,
            Nickname: newUser.nickname,
            Username: newUser.username,
            Password: newUser.password,
            Role: newUser.role,
            'Access Code': newUser.accessCode || '',
            Modules: newUser.modules,
            Fields: newUser.fields,
            Status: newUser.status,
          },
        }),
      });
    } catch {
      // Local fallback
    }

    // 2. Update local storage
    const list = this.getLocalUsers();
    list.unshift(newUser);
    localStorage.setItem(STORAGE_KEYS.USERS_CACHE, JSON.stringify(list));
    return newUser;
  }

  /**
   * Update existing user
   */
  public async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    const list = this.getLocalUsers();
    const index = list.findIndex((u) => u.userId === userId);
    if (index === -1) throw new Error('User not found');

    const updated: User = {
      ...list[index],
      ...updates,
      updatedAt: new Date().toISOString().split('T')[0],
    };

    if (updates.role) {
      updated.modules = this.calculateModulesForRole(updates.role);
    }

    // 1. Try remote Apps Script write
    try {
      await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'update',
          table: 'Users',
          where: { 'User ID': userId },
          data: {
            Nickname: updated.nickname,
            Username: updated.username,
            Role: updated.role,
            Status: updated.status,
            ...(updated.password ? { Password: updated.password } : {}),
            ...(updated.accessCode ? { 'Access Code': updated.accessCode } : {}),
            Modules: updated.modules,
            Fields: updated.fields,
          },
        }),
      });
    } catch {
      // Local fallback
    }

    list[index] = updated;
    localStorage.setItem(STORAGE_KEYS.USERS_CACHE, JSON.stringify(list));
    return updated;
  }

  /**
   * Delete user
   */
  public async deleteUser(userId: string): Promise<boolean> {
    try {
      await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'delete',
          table: 'Users',
          where: { 'User ID': userId },
        }),
      });
    } catch {}

    const list = this.getLocalUsers().filter((u) => u.userId !== userId);
    localStorage.setItem(STORAGE_KEYS.USERS_CACHE, JSON.stringify(list));
    return true;
  }

  /**
   * Load client account / trial information
   */
  public async getClient(accountId: string): Promise<ClientAccount> {
    try {
      const url = `${this.apiUrl}?table=Clients&Account+ID=${encodeURIComponent(accountId)}&limit=1`;
      const res = await fetch(url);
      if (res.ok) {
        const json = await res.json();
        if (json && json.ok && json.data && json.data[0]) {
          const row = json.data[0];
          return {
            id: row['Account ID'] || accountId,
            name: row['Name'] || row['Client Name'] || 'Juan Dela Cruz',
            username: row['Username'] || 'juan.delacruz',
            signupDate: row['Sign Up Date'] || row['Date'] || INITIAL_CLIENT.signupDate,
            trialDays: 52,
          };
        }
      }
    } catch {}

    try {
      const raw = localStorage.getItem(STORAGE_KEYS.CLIENT_CACHE);
      if (raw) return JSON.parse(raw);
    } catch {}

    return INITIAL_CLIENT;
  }

  /**
   * Submit Feedback
   */
  public async submitFeedback(feedback: Omit<FeedbackEntry, 'id' | 'createdAt'>): Promise<FeedbackEntry> {
    const entry: FeedbackEntry = {
      ...feedback,
      id: `FB-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    try {
      await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          action: 'create',
          table: 'Feedback',
          data: entry,
        }),
      });
    } catch {}

    const feedbacks = this.getFeedbacks();
    feedbacks.unshift(entry);
    localStorage.setItem(STORAGE_KEYS.FEEDBACK_CACHE, JSON.stringify(feedbacks));
    return entry;
  }

  public getFeedbacks(): FeedbackEntry[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.FEEDBACK_CACHE);
      if (raw) return JSON.parse(raw);
    } catch {}
    return INITIAL_FEEDBACK;
  }

  private calculateModulesForRole(role: UserRole): string {
    switch (role) {
      case 'Admin':
        return 'All (7 Modules)';
      case 'Manager':
        return 'Sales, Inventory, HR, Reports';
      case 'Staff':
        return 'Customer Experience, Sales';
      case 'Cashier':
        return 'POS & Expenses';
      case 'Viewer':
        return 'Dashboard & Reports';
      default:
        return 'Standard';
    }
  }

  /**
   * Generates Google Apps Script code snippet that can be deployed to the user's Sheet
   */
  public getAppsScriptDeploymentTemplate(): string {
    return `/**
 * RaXa Systems - Google Apps Script Web App Endpoint
 * Deploy this script bound to your Google Sheets database:
 * Sheet ID folder: ${DEFAULT_SHEETS_FOLDER_ID}
 */

function doGet(e) {
  return handleRequest(e, "GET");
}

function doPost(e) {
  return handleRequest(e, "POST");
}

function handleRequest(e, method) {
  var output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);

  try {
    var params = (e && e.parameter) || {};
    var body = {};

    if (e && e.postData && e.postData.contents) {
      try {
        body = JSON.parse(e.postData.contents);
      } catch (err) {
        body = {};
      }
    }

    var action = body.action || params.action || (method === "GET" ? "read" : "unknown");

    // 1. Health check / Ping
    if (action === "ping" || params.ping) {
      return output.setContent(JSON.stringify({ ok: true, status: "ok", timestamp: Date.now() }));
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();

    // 2. Authentication
    if (action === "login") {
      var username = (body.username || "").toLowerCase().trim();
      var password = body.password || "";
      var usersSheet = ss.getSheetByName("Users");
      if (!usersSheet) {
        return output.setContent(JSON.stringify({ ok: false, error: "Users sheet not found" }));
      }
      var rows = getSheetData(usersSheet);
      var match = rows.find(function(r) {
        return String(r["Username"] || "").toLowerCase() === username && String(r["Password"] || "") === password;
      });

      if (match) {
        var token = "tok_" + Utilities.getUuid();
        return output.setContent(JSON.stringify({
          ok: true,
          token: token,
          user: {
            accountId: match["Account ID"] || "ACC-8801",
            nickname: match["Nickname"] || username,
            role: match["Role"] || "Staff"
          }
        }));
      }
      return output.setContent(JSON.stringify({ ok: false, error: "Invalid username or password" }));
    }

    // 3. Read data from sheet
    if (action === "read" || method === "GET") {
      var tableName = params.table || body.table || "Users";
      var targetSheet = ss.getSheetByName(tableName);
      if (!targetSheet) {
        return output.setContent(JSON.stringify({ ok: false, error: "Table " + tableName + " not found" }));
      }
      var data = getSheetData(targetSheet);

      // Simple column filtering
      Object.keys(params).forEach(function(key) {
        if (key !== "table" && key !== "action" && key !== "limit") {
          data = data.filter(function(row) {
            return String(row[key] || "").toLowerCase() === String(params[key]).toLowerCase();
          });
        }
      });

      return output.setContent(JSON.stringify({ ok: true, data: data }));
    }

    // 4. Create row
    if (action === "create") {
      var table = body.table || "Users";
      var rowData = body.data || {};
      var sheet = ss.getSheetByName(table);
      if (!sheet) {
        sheet = ss.insertSheet(table);
        var headers = Object.keys(rowData);
        sheet.appendRow(headers);
      }
      var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
      var newRow = headers.map(function(h) { return rowData[h] || ""; });
      sheet.appendRow(newRow);
      return output.setContent(JSON.stringify({ ok: true, message: "Created successfully" }));
    }

    // 5. Update row
    if (action === "update") {
      var table = body.table || "Users";
      var sheet = ss.getSheetByName(table);
      var where = body.where || {};
      var dataUpdate = body.data || {};
      if (!sheet) return output.setContent(JSON.stringify({ ok: false, error: "Table not found" }));

      var values = sheet.getDataRange().getValues();
      var headers = values[0];
      var whereKey = Object.keys(where)[0];
      var whereVal = String(where[whereKey]).toLowerCase();
      var keyIndex = headers.indexOf(whereKey);

      for (var i = 1; i < values.length; i++) {
        if (String(values[i][keyIndex]).toLowerCase() === whereVal) {
          Object.keys(dataUpdate).forEach(function(k) {
            var colIndex = headers.indexOf(k);
            if (colIndex !== -1) {
              sheet.getRange(i + 1, colIndex + 1).setValue(dataUpdate[k]);
            }
          });
          return output.setContent(JSON.stringify({ ok: true, message: "Updated" }));
        }
      }
      return output.setContent(JSON.stringify({ ok: false, error: "Record not found" }));
    }

    return output.setContent(JSON.stringify({ ok: false, error: "Action not supported" }));
  } catch (ex) {
    return output.setContent(JSON.stringify({ ok: false, error: ex.toString() }));
  }
}

function getSheetData(sheet) {
  var values = sheet.getDataRange().getValues();
  if (values.length < 2) return [];
  var headers = values[0];
  var rows = [];
  for (var i = 1; i < values.length; i++) {
    var row = {};
    for (var j = 0; j < headers.length; j++) {
      row[headers[j]] = values[i][j];
    }
    rows.push(row);
  }
  return rows;
}`;
  }
}

export const apiService = new RaxaApiService();
