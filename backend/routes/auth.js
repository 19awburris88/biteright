import express from 'express';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import prisma from '../lib/prisma.js';
import { signToken, requireAuth, publicUser } from '../lib/auth.js';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { error: 'Too many attempts. Please wait a few minutes and try again.' },
});

// Accounts created before real auth existed were stored with this marker.
const LEGACY_PASSWORD = 'placeholder';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PRICES = ['', '$', '$$', '$$$'];
const DIETS = ['vegetarian', 'vegan', 'pescatarian'];

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

// POST /api/auth/signup
router.post('/signup', authLimiter, async (req, res) => {
  const name = String(req.body.name || '').trim().slice(0, 60);
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || '');

  if (!name) return res.status(400).json({ error: 'Please tell us your name.' });
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'Enter a valid email address.' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });

  try {
    const hash = await bcrypt.hash(password, 10);
    const existing = await prisma.user.findUnique({ where: { email } });

    let user;
    if (existing && existing.password !== LEGACY_PASSWORD) {
      return res.status(409).json({ error: 'An account with this email already exists. Try signing in.' });
    } else if (existing) {
      // Claim a pre-auth account: keep its swipes, set a real password.
      user = await prisma.user.update({ where: { id: existing.id }, data: { name, password: hash } });
    } else {
      user = await prisma.user.create({ data: { name, email, password: hash, zipcode: '' } });
    }

    res.status(201).json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    console.error('[POST /auth/signup]', err);
    res.status(500).json({ error: 'Could not create your account. Please try again.' });
  }
});

// POST /api/auth/login
router.post('/login', authLimiter, async (req, res) => {
  const email = normalizeEmail(req.body.email);
  const password = String(req.body.password || '');

  try {
    const user = await prisma.user.findUnique({ where: { email } });
    const ok =
      user && user.password !== LEGACY_PASSWORD && (await bcrypt.compare(password, user.password));
    if (!ok) return res.status(401).json({ error: 'That email and password don’t match.' });

    res.json({ token: signToken(user), user: publicUser(user) });
  } catch (err) {
    console.error('[POST /auth/login]', err);
    res.status(500).json({ error: 'Could not sign you in. Please try again.' });
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) return res.status(401).json({ error: 'Account not found.' });
  res.json(publicUser(user));
});

// PATCH /api/auth/me — name and preferences
router.patch('/me', requireAuth, async (req, res) => {
  const data = {};
  const { name, pricePreference, dietaryTags, favoriteCategories, onboarded } = req.body;

  if (name !== undefined) {
    const trimmed = String(name).trim().slice(0, 60);
    if (!trimmed) return res.status(400).json({ error: 'Name can’t be empty.' });
    data.name = trimmed;
  }
  if (pricePreference !== undefined) {
    if (!PRICES.includes(pricePreference)) return res.status(400).json({ error: 'Invalid price range.' });
    data.pricePreference = pricePreference || null;
  }
  if (dietaryTags !== undefined) {
    data.dietaryTags = [...new Set([].concat(dietaryTags))].filter((d) => DIETS.includes(d));
  }
  if (favoriteCategories !== undefined) {
    data.favoriteCategories = [...new Set([].concat(favoriteCategories))].map(String).slice(0, 20);
  }
  if (onboarded !== undefined) data.onboarded = Boolean(onboarded);

  try {
    const user = await prisma.user.update({ where: { id: req.userId }, data });
    res.json(publicUser(user));
  } catch (err) {
    console.error('[PATCH /auth/me]', err);
    res.status(500).json({ error: 'Could not save your changes.' });
  }
});

// DELETE /api/auth/me — permanently delete the account and its data
router.delete('/me', requireAuth, async (req, res) => {
  try {
    await prisma.user.delete({ where: { id: req.userId } });
    res.status(204).end();
  } catch (err) {
    console.error('[DELETE /auth/me]', err);
    res.status(500).json({ error: 'Could not delete your account.' });
  }
});

export default router;
