'use client';

import { useTheme } from 'next-themes';
import { RiMoonClearLine, RiSunLine } from 'react-icons/ri';
import { Button } from '@/libraries/ui/primitives/button';
import { ClientOnly } from '@/libraries/utils/client-only';

export const ThemeChanger = () => {
  const { theme, setTheme } = useTheme();

  return (
    <ClientOnly>
      <Button scale='btn-xs' kind='btn-ghost' onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        {theme === 'dark' ? <RiSunLine /> : <RiMoonClearLine />}
        Basculer en thème {theme === 'dark' ? 'clair' : 'sombre'}
      </Button>
    </ClientOnly>
  );
};
