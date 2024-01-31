// services/authService.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../../database/models/index.js';

// Login service
 async function loginService(email, password) {
  const user = await User.findOne({ where: { email } });

  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h', // Token expires in 1 hour
  });

  return token;
}

export default loginService;
