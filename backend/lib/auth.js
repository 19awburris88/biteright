import crypto from 'crypto';
import jwt from 'jsonwebtoken';

// Prefer an explicit JWT_SECRET. If one isn't set (e.g. a fresh Railway deploy),
// derive a stable secret from DATABASE_URL — it already contains the DB password,
// so it's private to the server and survives restarts.
const SECRET =
  process.env.JWT_SECRET ||
  crypto.createHash('sha256').update(`biteright:${process.env.DATABASE_URL || 'dev'}`).digest('hex');

if (!process.env.JWT_SECRET) {
  console.warn('[auth] JWT_SECRET not set — using a secret derived from DATABASE_URL.');
}

const TOKEN_TTL = '60d';

export function signToken(user) {
  return jwt.sign({ sub: user.id }, SECRET, { expiresIn: TOKEN_TTL });
}

function readUserId(req) {
  const header = req.get('authorization') || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) return null;
  try {
    const payload = jwt.verify(token, SECRET);
    return Number(payload.sub) || null;
  } catch {
    return null;
  }
}

export function requireAuth(req, res, next) {
  const userId = readUserId(req);
  if (!userId) return res.status(401).json({ error: 'Please sign in to continue.' });
  req.userId = userId;
  next();
}

export function optionalAuth(req, _res, next) {
  req.userId = readUserId(req);
  next();
}

// Strip secrets before a user leaves the server.
export function publicUser(user) {
  if (!user) return null;
  const { password: _password, ...rest } = user;
  return rest;
}
