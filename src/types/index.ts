export type UserRole = 'Admin' | 'Manager' | 'Staff' | 'Cashier' | 'Viewer';

export interface User {
  userId: string;
  accountId: string;
  nickname: string;
  username: string;
  password?: string;
  role: UserRole;
  accessCode?: string;
  modules: string;
  fields: string;
  status: 'Active' | 'Inactive';
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientAccount {
  id: string;
  name: string;
  username: string;
  signupDate: string;
  trialDays: number;
}

export interface FeedbackEntry {
  id: string;
  name: string;
  email: string;
  category: string;
  rating: number;
  message: string;
  createdAt: string;
}

export interface ModuleItem {
  id: string;
  title: string;
  category: string;
  description: string;
  tag: string;
  features: string[];
  metrics: { label: string; value: string }[];
  stylePosition: {
    x: string;
    y: string;
    w?: string;
    h?: string;
  };
}

export interface ApiConfig {
  appsScriptUrl: string;
  sheetsFolderId: string;
  assetsFolderId: string;
  isLiveConnected: boolean;
  statusMessage: string;
  lastChecked?: string;
}
