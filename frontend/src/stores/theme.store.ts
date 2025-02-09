import { create } from 'zustand';
import { THEMES } from '@/constants/themes';

type Theme = (typeof THEMES)[number];

type ThemeStates = {
  theme: Theme;
};

type ThemeActions = {
  setTheme: (theme: Theme) => void;
};

export const useThemeStore = create<ThemeStates & ThemeActions>((set) => ({
  theme: (localStorage.getItem('theme') as Theme) || 'dark',

  setTheme: (theme: Theme) => {
    localStorage.setItem('theme', theme);
    set({ theme });
  },
}));
