/**
 * APPLICATION ENTRY POINT (JAVASCRIPT / JSX)
 * --------------------------------------------------------------------------
 * Mounts the React application into #root and loads global CSS styles.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
