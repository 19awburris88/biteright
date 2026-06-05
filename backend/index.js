// index.js (server entry point)

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { PrismaClient } from '@prisma/client';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Route imports
import dishesRouter from './routes/dishes.js';
import restaurantsRouter from './routes/restaurants.js';
import swipesRouter from './routes/swipes.js';
import userRouter from './routes/user.js';

const app = express();
const prisma = new PrismaClient();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/dishes', dishesRouter);
app.use('/api/restaurants', restaurantsRouter);
app.use('/api/swipes', swipesRouter);
app.use('/api/user', userRouter);

// Serve React build in production (Railway sets NODE_ENV=production automatically)
const isProduction = process.env.NODE_ENV === 'production' || process.env.RAILWAY_ENVIRONMENT;
if (isProduction) {
  const distPath = path.join(__dirname, '../dist');
  app.use(express.static(distPath));
  app.use((req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('BiteRight backend is running');
  });
}

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
