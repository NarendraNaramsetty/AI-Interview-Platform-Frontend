import { create } from 'zustand';

export const useAuthStore = create((set, get) => ({
  user: JSON.parse(localStorage.getItem('auth_user')) || {
    name: 'Alex Developer',
    email: 'alex.dev@example.com',
    tier: 'Pro Member',
    joined: '2026-03-10'
  },
  theme: 'light',

  initTheme: () => {
    const root = window.document.documentElement;
    root.classList.add('light');
    root.classList.remove('dark');
  },

  toggleTheme: () => {
    // Theme is forced to light
  },

  login: async (email, password) => {
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 800));
    const mockUser = {
      name: 'Alex Developer',
      email: email,
      tier: 'Pro Member',
      joined: new Date().toISOString().split('T')[0]
    };
    localStorage.setItem('auth_user', JSON.stringify(mockUser));
    set({ user: mockUser });
    return mockUser;
  },

  register: async (name, email, password) => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const mockUser = {
      name: name,
      email: email,
      tier: 'Free Tier',
      joined: new Date().toISOString().split('T')[0]
    };
    localStorage.setItem('auth_user', JSON.stringify(mockUser));
    set({ user: mockUser });
    return mockUser;
  },

  logout: () => {
    localStorage.removeItem('auth_user');
    set({ user: null });
  },

  updateProfile: (updatedFields) => {
    const currentUser = get().user;
    if (!currentUser) return;
    const newUser = { ...currentUser, ...updatedFields };
    localStorage.setItem('auth_user', JSON.stringify(newUser));
    set({ user: newUser });
  }
}));
