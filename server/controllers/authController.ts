import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { supabase } from '../supabaseClient';
import { User } from '../types/database.types';

export const signupUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    // Step 1: Check karein saari fields aayi hain ya nahi
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Sab fields zaroori hain' });
    }

    // Step 2: Password ko hash karein
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 3: Database mein user save karein
    const { data, error } = await supabase
      .from('users')
      .insert([{ name, email, password: hashedPassword }])
      .select();

    if (error) {
      return res.status(400).json({ message: 'Signup fail hua', error: error.message });
    }

    res.status(201).json({ message: 'User successfully bana!', user: data as User[] });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};