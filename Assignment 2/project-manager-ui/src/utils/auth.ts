const TOKEN_KEY = 'auth_token';
const USER_KEY = 'user_data';

export const saveToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const removeToken = (): void => {
  localStorage.removeItem(TOKEN_KEY);
};

export const saveUser = (email: string, fullName: string): void => {
  localStorage.setItem(USER_KEY, JSON.stringify({ email, fullName }));
};

export const getUser = (): { email: string; fullName: string } | null => {
  const userData = localStorage.getItem(USER_KEY);
  return userData ? JSON.parse(userData) : null;
};

export const removeUser = (): void => {
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = (): boolean => {
  return getToken() !== null;
};

export const logout = (): void => {
  removeToken();
  removeUser();
};