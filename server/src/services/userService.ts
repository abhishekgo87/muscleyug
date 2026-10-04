import crypto from 'crypto';
import { supabase } from '../config/supabaseClient';
import { SafeUser } from '../types/database.types';
import { hashPassword } from '../utils/password';

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export class UserAlreadyExistsError extends Error {
  constructor(message = 'An account with this email already exists') {
    super(message);
    this.name = 'UserAlreadyExistsError';
  }
}

export const registerUser = async (userData: CreateUserData): Promise<SafeUser> => {
  const hashedPassword = await hashPassword(userData.password);
  const userId = crypto.randomUUID();
  const createdAt = new Date().toISOString();

  // Omit .select() to avoid triggering Postgres SELECT RLS checks for anon role
  const { error } = await supabase.from('users').insert([
    {
      id: userId,
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      created_at: createdAt
    }
  ]);

  if (error) {
    // Error code 23505 represents a unique constraint violation in PostgreSQL
    if (error.code === '23505') {
      throw new UserAlreadyExistsError();
    }
    throw new Error(error.message);
  }

  return {
    id: userId,
    name: userData.name,
    email: userData.email,
    created_at: createdAt
  };
};
