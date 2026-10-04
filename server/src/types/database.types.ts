export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  created_at: string;
}

export type SafeUser = Omit<User, 'password'>;
