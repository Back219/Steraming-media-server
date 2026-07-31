import fs from 'fs';
import path from 'path';

export interface MediaFile {
  id: string;
  title: string;
  filePath: string;
  extension: string;
  size: number;
  mtime: number;
}

const SUPPORTED_EXTENSIONS = ['.mp4', '.mkv', '.avi', '.mov', '.webm', '.mp3', '.flac'];

export function scanDirectory(dirPath: string): MediaFile[] {
  let results: MediaFile[] = [];
  if (!fs.existsSync(dirPath)) {
    console.warn(`Directory not found: ${dirPath}`);
    return results;
  }
  const list = fs.readdirSync(dirPath);
  list.forEach((entry) => {
    const fullPath = path.join(dirPath, entry);
    try {
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        results = results.concat(scanDirectory(fullPath));
      } else if (stat.isFile()) {
        const ext = path.extname(entry).toLowerCase();
        if (SUPPORTED_EXTENSIONS.includes(ext)) {
          results.push({
            id: Buffer.from(fullPath).toString('base64url'),
            title: path.basename(entry, ext),
            filePath: fullPath,
            extension: ext,
            size: stat.size,
            mtime: stat.mtimeMs
          });
        }
      }
    } catch (err) {
      console.warn(`Skipping ${fullPath}: ${(err as Error).message}`);
    }
  });
  return results;
}
