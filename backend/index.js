// index.js (server entry point)

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import path from 'path';
import { fileURLToPath } from 'url';
import prisma from './lib/prisma.js';

import authRouter from './routes/auth.js';
import dishesRouter from './routes/dishes.js';
import restaurantsRouter from './routes/restaurants.js';
import swipesRouter from './routes/swipes.js';
import tasteRouter from './routes/taste.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isProduction = process.env.NODE_ENV === 'production' || Boolean(process.env.RAILWAY_ENVIRONMENT);

const app = express();
app.set('trust proxy', 1); // Railway sits behind a proxy; needed for rate limiting by IP

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        imgSrc: ["'self'", 'data:', 'blob:', 'https://images.unsplash.com'],
        styleSrc: ["'self'", "'unsafe-inline'"],
        fontSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        scriptSrc: ["'self'"],
        workerSrc: ["'self'"],
        manifestSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);
app.use(compression());
if (!isProduction) app.use(cors());
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true });
  } catch {
    res.status(503).json({ ok: false });
  }
});

app.use('/api/auth', authRouter);
app.use('/api/dishes', dishesRouter);
app.use('/api/restaurants', restaurantsRouter);
app.use('/api/swipes', swipesRouter);
app.use('/api/taste', tasteRouter);

app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

if (isProduction) {
  const distPath = path.join(__dirname, '../dist');
  // Hashed assets can be cached forever; the shell and service worker must revalidate.
  app.use(
    express.static(distPath, {
      setHeaders(res, filePath) {
        if (filePath.includes(`${path.sep}assets${path.sep}`)) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else {
          res.setHeader('Cache-Control', 'no-cache');
        }
      },
    })
  );
  app.use((_req, res) => {
    res.setHeader('Cache-Control', 'no-cache');
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (_req, res) => res.send('BiteRight API is running — open the Vite dev server for the app.'));
}

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[unhandled]', err);
  res.status(err.status || 500).json({ error: err.status === 400 ? 'Bad request.' : 'Something went wrong.' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 BiteRight API on http://localhost:${PORT}`);
});
