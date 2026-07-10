import { create } from 'zustand';
import { auth } from '../services/auth';
import { users } from '../services/users';

const mapUser = (data) => ({
  id: data?.id,
  name: [data?.first_name, data?.last_name].filter(Boolean).join(' ') || data?.name || 'User',
  first_name: data?.first_name || '',
  last_name: data?.last_name || '',
  email: data?.email || '',
  role: data?.role || 'Developer',
  tier: data?.tier || 'Free Tier',
  joined: data?.created_at ? String(data.created_at).split('T')[0] : new Date().toISOString().split('T')[0],
  bio: data?.bio || '',
  phone_number: data?.phone_number || '',
  country: data?.country || '',
  linkedin_url: data?.linkedin_url || '',
  github_url: data?.github_url || '',
  portfolio_url: data?.portfolio_url || '',
  profile_picture: data?.profile_picture || ''
});

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('auth_user')) || null,
  theme: 'light',
  isAuthReady: false,
  setUser: (user) => set({ user: user ? mapUser(user) : null }),

  initTheme: () => {
    const root = window.document.documentElement;
    root.classList.add('light');
    root.classList.remove('dark');
  },

  hydrateUser: async () => {
    try {
      const res = await auth.me();
      const userData = res?.data || res;
      const user = mapUser(userData);
      localStorage.setItem('auth_user', JSON.stringify(user));
      set({ user, isAuthReady: true });
      return user;
    } catch {
      set({ isAuthReady: true });
      return get().user;
    }
  },

  toggleTheme: () => {},

  login: async (email, password) => {
    const response = await auth.login({ email, password });
    const tokens = response?.tokens || response?.data?.tokens || {};
    const user = mapUser(response?.user || response?.data?.user);
    if (tokens.access) localStorage.setItem('access_token', tokens.access);
    if (tokens.refresh) localStorage.setItem('refresh_token', tokens.refresh);
    localStorage.setItem('auth_user', JSON.stringify(user));
    set({ user });
    return user;
  },

  register: async (name, email, password) => {
    const [first_name, ...rest] = String(name || '').trim().split(/\s+/);
    const last_name = rest.join(' ') || '.';
    const response = await auth.register({
      first_name: first_name || name,
      last_name,
      email,
      password,
      password_confirm: password
    });
    const tokens = response?.tokens || response?.data?.tokens || {};
    const user = mapUser(response?.user || response?.data?.user);
    if (tokens.access) localStorage.setItem('access_token', tokens.access);
    if (tokens.refresh) localStorage.setItem('refresh_token', tokens.refresh);
    localStorage.setItem('auth_user', JSON.stringify(user));
    set({ user });
    return user;
  },

  logout: async () => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        await auth.logout(refresh);
      }
    } catch {
      // Ignore logout transport failures and clear local session anyway.
    }
    localStorage.removeItem('auth_user');
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    set({ user: null });
  },

  updateProfile: async (updatedFields) => {
    const res = await auth.updateProfile(updatedFields);
    const userData = res?.data || res;
    const user = mapUser(userData);
    localStorage.setItem('auth_user', JSON.stringify(user));
    set({ user });
    return user;
  },

  googleLogin: async (code, redirectUri) => {
    const response = await auth.googleLogin({ code, redirect_uri: redirectUri });
    const tokens = response?.tokens || response?.data?.tokens || {};
    const user = mapUser(response?.user || response?.data?.user);
    if (tokens.access) localStorage.setItem('access_token', tokens.access);
    if (tokens.refresh) localStorage.setItem('refresh_token', tokens.refresh);
    localStorage.setItem('auth_user', JSON.stringify(user));
    set({ user });
    return user;
  },

  linkedinLogin: async (code, redirectUri) => {
    const response = await auth.linkedinLogin({ code, redirect_uri: redirectUri });
    const tokens = response?.tokens || response?.data?.tokens || {};
    const user = mapUser(response?.user || response?.data?.user);
    if (tokens.access) localStorage.setItem('access_token', tokens.access);
    if (tokens.refresh) localStorage.setItem('refresh_token', tokens.refresh);
    localStorage.setItem('auth_user', JSON.stringify(user));
    set({ user });
    return user;
  }
}));
