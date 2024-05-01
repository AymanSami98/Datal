import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../../database/models/index.js';

async function loginController(req, res) {
  try {
    const { email, password } = req.body;

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
    res.cookie('accessToken', token, {
      httpOnly: true,
      sameSite: 'None', // or 'Lax' if you want some CSRF protection but ensure compatibility with your use case
      secure: false, // Set to true if using HTTPS, important for production
      path: '/',
      maxAge: 3600000, // Expires in 1 hour; adjust as needed
    }).json({
      message: "Login successful",
      payload: {
        email,
      },
    });
  } catch (error) {
    res.status(401).json(
      {
        message: "Login failed",
        error: error.message,
      }
    );
  }
}

export default loginController;
