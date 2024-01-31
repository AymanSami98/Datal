import bcrypt from 'bcrypt';
import { User } from '../../database/models/index.js';

async function signupService(email, password) {
  console.log(email);
  // Check if the user already exists with the provided email
  const existingUser = await User.findOne({ where: { email } });
  if (existingUser) {
    // Handle duplicate user case
    throw new Error('User already exists.');
  }

  // Hash the password and create the user
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashedPassword });

  return user;
}

export default signupService;
