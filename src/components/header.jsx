import '../styles/components/header.css';

export default function Header({ toggleMenu, menuOpen, userName, handleLogout }) {
  return (
    <header className="app-header">
      <button className="hamburger-button" onClick={toggleMenu}>
        <div className={`hamburger-icon ${menuOpen ? 'open' : ''}`}>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </div>
      </button>

      <h1 className="app-title">ConsolaADM</h1>

      <div className="user-card">
        <span className="user-name">👤 {userName}</span>
        <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>
      </div>
    </header>
  );
}
