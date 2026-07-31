import express from 'express';
import cors from 'cors';
import path from 'path';
import mediaRoutes from './routes/media';
import streamRoutes from './routes/stream';
import { PORT } from './config';

const app = express();

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/media', mediaRoutes);
app.use('/api/stream', streamRoutes);

// Serve frontend build (if present)
const clientBuild = path.join(__dirname, '../client/build');
app.use(express.static(clientBuild));
app.get('*', (req, res, next) => {
  // If the static build exists, return index.html for non-API routes.
  // Otherwise 404 to keep dev tidy.
  res.sendFile(path.join(clientBuild, 'index.html'), (err) => {
    if (err) next();
  });
});

app.listen(PORT, () => {
  console.log('=================================');
  console.log(`Media Server running on port ${PORT}`);
  console.log('Cross-platform (Windows / Linux)');
  console.log('=================================');
});
