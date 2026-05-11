import { get, post } from './client';
import type { AuthSession, AuthUser } from './types';

export const authApi = {
  signUp: (body: { name: string; email: string; password: string }) =>
    post<{ user: AuthUser }>('/api/auth/sign-up/email', body),

  signIn: (body: { email: string; password: string }) =>
    post<AuthSession>('/api/auth/sign-in/email', body),

  signOut: () =>
    post<void>('/api/auth/sign-out'),

  getSession: () =>
    get<AuthSession | null>('/api/auth/get-session'),
};
