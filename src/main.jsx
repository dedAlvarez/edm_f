import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/main.css';
import { MsalProvider } from '@azure/msal-react';
import { initializeMSAL } from '../msalConfig'; // Importa solo initializeMSAL
import { BrowserRouter } from 'react-router-dom';
import App from './App';

const startApp = async () => {
  const msalInstance = await initializeMSAL(); // Obtiene la instancia aquí
  
  createRoot(document.getElementById('root')).render(
    <BrowserRouter>
      <MsalProvider instance={msalInstance}>
        <App />
      </MsalProvider>
    </BrowserRouter>
  );
};

startApp();