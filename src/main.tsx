
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import './polyfills';
import { ThemeProvider } from './components/ui/theme-provider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="study-bee-theme">
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
