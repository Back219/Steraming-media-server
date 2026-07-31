import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';
import { HLS_OUTPUT_DIR } from '../config';

/**
 * Generate HLS segments + playlist for a given source file.
 * Returns the output master playlist path.
 */
export function generateHLS(sourcePath: string, outputDir?: string): Promise<string> {
  const outDir = outputDir || HLS_OUTPUT_DIR;
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const safeName = path.basename(sourcePath).replace(/[^a-zA-Z0-9-_\.]/g, '_');
  const playlistName = `${safeName}.m3u8`;
  const playlistPath = path.join(outDir, playlistName);

  return new Promise((resolve, reject) => {
    ffmpeg(sourcePath)
      .outputOptions([
        '-profile:v baseline',
        '-level 3.0',
        '-start_number 0',
        '-hls_time 6',
        '-hls_list_size 0',
        '-f hls'
      ])
      .on('error', (err) => {
        reject(err);
      })
      .on('end', () => {
        resolve(playlistPath);
      })
      .save(playlistPath);
  });
}
