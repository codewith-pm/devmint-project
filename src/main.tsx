import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Remove loading screen once React app is ready
const removeLoadingScreen = () => {
  const loadingScreen = document.querySelector('.loading-screen');
  if (loadingScreen) {
    loadingScreen.style.opacity = '0';
    setTimeout(() => {
      loadingScreen.remove();
    }, 300);
  }
};

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>
  );
  
  // Remove loading screen after a short delay to ensure React has rendered
  // Use multiple methods to ensure loading screen is removed
  setTimeout(removeLoadingScreen, 100);
  
  // Fallback removal after longer delay
  setTimeout(() => {
    const loadingScreen = document.querySelector('.loading-screen');
    if (loadingScreen) {
      loadingScreen.remove();
    }
  }, 2000);
  
  // Remove on window load as final fallback
  window.addEventListener('load', removeLoadingScreen);
}