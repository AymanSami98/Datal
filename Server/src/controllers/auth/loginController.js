import { loginService } from '../../services/index.js';

async function loginController(req, res) {
  try {
    const { email, password } = req.body;
    const token = await loginService(email, password);
    
    res  .cookie("accessToken", token, { httpOnly: true, sameSite: 'none', secure: true }).json({
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
