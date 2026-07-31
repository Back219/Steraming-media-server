# media-server (Open Media Server)

Lightweight TypeScript/Node media server scaffold that:
- Scans a media directory for supported files
- Exposes a REST API to list and fetch metadata
- Serves byte-range streams for direct playback
- Includes helpers to generate HLS via FFmpeg

Quickstart
1. Copy files into a new repo or folder.
2. Install:
   npm install
3. Set environment (create .env):
   MEDIA_ROOT=/path/to/your/media
   TMDB_API_KEY=your_tmdb_api_key (optional)
   PORT=3500
4. Dev:
   npm run dev
5. Build:
   npm run build
   npm start

Notes
- HLS generation requires `ffmpeg` binary available on PATH.
- I can add Dockerfile, docker-compose, and GitHub Actions next if you want them.
