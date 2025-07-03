import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import './ThemeToggle.css';

const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
      title={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
    >
      <span className="theme-icon" aria-hidden="true">
        {theme === 'light' ? '🌙' : '☀️'}
      </span>
      <span className="theme-text">
        {theme === 'light' ? 'Modo Oscuro' : 'Modo Claro'}
      </span>
    </button>
  );
};

export default ThemeToggle;