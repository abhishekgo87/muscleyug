import { Request, Response } from 'express';
import { registerUser, UserAlreadyExistsError } from '../services/userService';

export const signupUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      typeof name !== 'string' ||
      typeof email !== 'string' ||
      typeof password !== 'string'
    ) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    const trimmedName = name.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName || !trimmedEmail || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: password.length < 6
          ? 'Password must be at least 6 characters long'
          : 'Name and email cannot be empty'
      });
    }

    const user = await registerUser({
      name: trimmedName,
      email: trimmedEmail,
      password
    });

    return res.status(201).json({
      success: true,
      message: 'User successfully created!',
      user
    });
  } catch (err: unknown) {
    if (err instanceof UserAlreadyExistsError) {
      return res.status(409).json({
        success: false,
        message: err.message
      });
    }

    const errorMessage = err instanceof Error ? err.message : 'Unknown server error';
    return res.status(500).json({
      success: false,
      message: 'Server error',
      error: errorMessage
    });
  }
};
