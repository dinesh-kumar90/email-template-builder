export interface User {
  id: string;
  name: string | null;
  email: string | null;
  password: string | null;
  role: string;
}

export interface createUserInput {
  name?: string | null;
  email?: string | null;
  password?: string | null;
  role?: string;
}
