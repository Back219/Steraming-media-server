import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3500;
export const MEDIA_ROOT = process.env.MEDIA_ROOT || path.resolve(process.cwd(), 'media');
export const TMDB_API_KEY = process.env.TMDB_API_KEY || '';
export const HLS_OUTPUT_DIR = process.env.HLS_OUTPUT_DIR || path.resolve(process.cwd(), 'hls');
