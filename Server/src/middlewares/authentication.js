// middlewares/authentication.js
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import { User } from '../database/index.js';
export async function authenticate(req, res, next) {
  console.log(req.signedCookies);
  let token;
  if (req.header('Authorization')) {
    token = req.header('Authorization').replace('Bearer ', '');
  } else if (req.cookies && req.cookies.accessToken) {
    token = req.cookies.accessToken;  // Retrieve the token from cookies
  }

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Authentication failed' });
  }
}