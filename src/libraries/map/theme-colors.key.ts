import { key } from 'piqure';

export type ThemeColors = {
  primary: string;
  background: string;
};

export const THEME_COLORS = key<() => ThemeColors>('theme-colors');
