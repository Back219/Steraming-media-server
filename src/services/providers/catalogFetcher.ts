import { Router, Request, Response } from 'express';
import { AccountManager } from '../services/providers/accountManager';
import { CatalogFetcher } from '../services/providers/catalogFetcher';

const router = Router();

// GET /api/accounts - List all connected accounts
router.get('/', (req: Request, res: Response) => {
  const accounts = AccountManager.getAccounts();
  res.json(accounts);
});

// POST /api/accounts/login - Save session or auth token for a provider
router.post('/login', (req: Request, res: Response) => {
  const { provider, accountName, authToken } = req.body;

  if (!provider || !authToken) {
    return res.status(400).json({ error: 'Provider and authToken are required' });
  }

  const account = AccountManager.saveAccount({
    provider,
    accountName: accountName || 'Default Profile',
    authToken,
    isActive: true
  });

  res.json({ message: 'Account saved successfully', account });
});

// DELETE /api/accounts/:provider - Unlink provider account
router.delete('/:provider', (req: Request, res: Response) => {
  AccountManager.removeAccount(req.params.provider);
  res.json({ message: `Disconnected ${req.params.provider}` });
});

// GET /api/accounts/catalog - Get unified catalog across active accounts
router.get('/catalog', async (req: Request, res: Response) => {
  try {
    const catalog = await CatalogFetcher.fetchUnifiedCatalog();
    res.json(catalog);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch catalog' });
  }
});

export default router;
