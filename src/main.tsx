import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Get the root element
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Root element not found. Make sure your HTML file has an element with id 'root'.");
}

// Create the root and render the application
createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);