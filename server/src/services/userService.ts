import crypto from 'crypto';
import { createUser, RepositoryError } from '../repositories/userRepository';
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

  try {
    const userRecord = await createUser({
      id: userId,
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      created_at: createdAt
    });

    return {
      id: userRecord.id,
      name: userRecord.name,
      email: userRecord.email,
      created_at: userRecord.created_at
    };
  } catch (err: unknown) {
    // Error code 23505 represents a unique constraint violation in PostgreSQL
    if (err instanceof RepositoryError && err.code === '23505') {
      throw new UserAlreadyExistsError();
    }
    throw err;
  }
};

