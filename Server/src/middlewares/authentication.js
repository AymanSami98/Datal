// middleware/authentication.js
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../models/user.js';

// Verify JWT token and attach user to request
export async function authenticate(req, res, next) {
  const token = req.header('Authorization').replace('Bearer ', '');

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
}
