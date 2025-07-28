import Header from './header';
import Sidebar from './sidebar';
import '../styles/components/layout.css'

export default function Layout({
  children,
  menuOpen,
  toggleMenu,
  userName,
  activeItem,
  setActiveItem,
  handleLogout,
  closeMenu,
  menuItems // Añadida la propiedad menuItems que faltaba
}) {
  return (
    <div className="app-layout">
      <Header 
        toggleMenu={toggleMenu} 
        menuOpen={menuOpen} 
        userName={userName} 
        handleLogout={handleLogout} 
      />
      <div className={`main-layout ${menuOpen ? 'menu-open' : ''}`}>
        <Sidebar
          menuOpen={menuOpen}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          handleLogout={handleLogout}
          closeMenu={closeMenu}
          menuItems={menuItems} // Pasando los items del menú al Sidebar
        />
        {children} {/* El children ya incluye la clase content-area y el onClick en HomePage */}
      </div>
    </div>
  );
}