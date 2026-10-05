import { supabase } from '../config/supabaseClient';
import { User } from '../types/database.types';

export class RepositoryError extends Error {
  public readonly code: string | undefined;

  constructor(message: string, code?: string) {
    super(message);
    this.name = 'RepositoryError';
    this.code = code;
  }
}

export const createUser = async (userRecord: User): Promise<User> => {
  // Omit .select() to avoid triggering Postgres SELECT RLS checks for anon role
  const { error } = await supabase.from('users').insert([userRecord]);

  if (error) {
    throw new RepositoryError(error.message, error.code);
  }

  return userRecord;
};
