import { signupService } from '../../services/auth/index.js';

 async function signupController(req, res) {
  try {
    const { email, password } = req.body;
    const user = await signupService(email, password);
    res.json({
      message: "Signup successful",
      payload: {
        user,
      },
    });
  } catch (error) {

    res.status(500).json(
      {
        message: "Signup failed",
        error: error.message,
      }
    );
  }
}

export default signupController;
