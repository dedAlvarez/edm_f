import './styles/App.css';
import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import Home from './home'

function LoginScreen() {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect({ 
      scopes: ['user.read'],
      prompt: "select_account"
    });
  };

  return (
    <div className="waiting-screen">
      <h1>🔒 Ingreso Consola Administracion</h1>
      <p>Haz clic en el botón para iniciar sesión con tu cuenta Microsoft:</p>
      <button className="login-button" onClick={handleLogin}>
        Iniciar sesión
      </button>
    </div>
  );
}

function App() {
  const isAuthenticated = useIsAuthenticated();

  if (!isAuthenticated) return <LoginScreen />;
  
  return <Home />;
}

export default App;