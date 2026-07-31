import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface ProviderAccount {
  id: string;
  provider: 'netflix' | 'hulu' | 'disney' | 'prime';
  accountName: string;
  authToken: string;
  isActive: boolean;
  lastSynced: string;
}

const ACCOUNTS_FILE = path.join(__dirname, '../../../data/accounts.json');

// Helper to ensure storage directory exists
function ensureStorage() {
  const dir = path.dirname(ACCOUNTS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(ACCOUNTS_FILE)) {
    fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify([]));
  }
}

export class AccountManager {
  static getAccounts(): ProviderAccount[] {
    ensureStorage();
    const data = fs.readFileSync(ACCOUNTS_FILE, 'utf8');
    return JSON.parse(data) || [];
  }

  static saveAccount(account: Omit<ProviderAccount, 'id' | 'lastSynced'>): ProviderAccount {
    const accounts = this.getAccounts();
    
    // Check if account for provider already exists
    const existingIndex = accounts.findIndex(a => a.provider === account.provider);
    
    const newEntry: ProviderAccount = {
      ...account,
      id: crypto.randomUUID(),
      lastSynced: new Date().toISOString()
    };

    if (existingIndex >= 0) {
      accounts[existingIndex] = newEntry;
    } else {
      accounts.push(newEntry);
    }

    fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2));
    return newEntry;
  }

  static removeAccount(provider: string): void {
    const accounts = this.getAccounts().filter(a => a.provider !== provider);
    fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2));
  }
}
