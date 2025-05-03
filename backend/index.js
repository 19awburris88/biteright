// index.js (server entry point)

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';

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

// Health check
app.get('/', (req, res) => {
  res.send('🔥 BiteRight backend is running');
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
