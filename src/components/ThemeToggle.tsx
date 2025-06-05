
import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';
import { Toggle } from '@/components/ui/toggle';

export const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <Toggle 
      pressed={isDark} 
      onPressedChange={toggleTheme}
      className="w-12 h-6 bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600"
    >
      <div className={`w-4 h-4 rounded-full transition-transform ${
        isDark ? 'bg-blue-600 translate-x-2' : 'bg-white translate-x-0'
      }`} />
    </Toggle>
  );
};
