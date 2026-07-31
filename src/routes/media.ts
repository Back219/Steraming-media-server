import { Router, Request, Response } from 'express';
import { MEDIA_ROOT } from '../config';
import { scanDirectory } from '../services/scanner';
import { fetchMetadataByTitle } from '../services/metadata';

const router = Router();

/**
 * Scan media root and return list of media files found.
 * Query param `path` can override the scan root.
 */
router.get('/scan', async (req: Request, res: Response) => {
  const dir = (req.query.path as string) || MEDIA_ROOT;
  try {
    const files = scanDirectory(dir);
    res.json({ root: dir, count: files.length, files });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

/**
 * Get metadata for a file (best-effort by title)
 */
router.get('/metadata/:fileId', async (req: Request, res: Response) => {
  try {
    const filePath = Buffer.from(req.params.fileId, 'base64url').toString('utf8');
    const title = filePath ? filePath.split(/[\\/]/).pop()?.replace(/\.[^/.]+$/, '') : undefined;
    if (!title) return res.status(400).json({ error: 'Invalid file id' });
    const meta = await fetchMetadataByTitle(title);
    res.json({ title, metadata: meta });
  } catch (err) {
    res.status(500).json({ error: (err as Error).message });
  }
});

export default router;
