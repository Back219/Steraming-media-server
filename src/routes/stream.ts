import { Router, Request, Response } from 'express';
import fs from 'fs';
import mime from 'mime-types';

const router = Router();

router.get('/:fileId', (req: Request, res: Response) => {
  try {
    const filePath = Buffer.from(req.params.fileId, 'base64url').toString('utf8');
    if (!fs.existsSync(filePath)) {
      return res.status(404).send('Media file not found');
    }
    const stat = fs.statSync(filePath);
    const fileSize = stat.size;
    const range = req.headers.range;
    if (range) {
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
      const chunksize = end - start + 1;
      const file = fs.createReadStream(filePath, { start, end });
      const mimeType = mime.lookup(filePath) || 'video/mp4';
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': mimeType
      };
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': mime.lookup(filePath) || 'video/mp4'
      };
      res.writeHead(200, head);
      fs.createReadStream(filePath).pipe(res);
    }
  } catch (err) {
    res.status(500).json({ error: 'Failed to process video stream' });
  }
});

export default router;
