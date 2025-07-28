import '../styles/components/sidebar.css';
import { useState } from 'react';

export default function Sidebar({
  menuOpen,
  activeItem,
  setActiveItem,
  closeMenu,
  menuItems = []
}) {
  const [openSubmenus, setOpenSubmenus] = useState({});

  const toggleSubmenu = (id) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const padres = menuItems.filter(item => item.opcioN_PADRE === null);
  const hijos = (idPadre) => menuItems.filter(item => item.opcioN_PADRE === idPadre);

  return (
    <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
      <nav>
        <ul>
          <li
            className={activeItem === "Inicio" ? "active" : ""}
            onClick={() => {
              setActiveItem("Inicio");
              closeMenu();
            }}
          >
            Inicio
          </li>

          {padres.map(padre => (
            <li key={padre.iD_OPCIONMENU}>
              <div
                onClick={() => {
                  const tieneHijos = hijos(padre.iD_OPCIONMENU).length > 0;
                  if (tieneHijos) {
                    toggleSubmenu(padre.iD_OPCIONMENU);
                  } else {
                    setActiveItem(padre.opcionmenu);
                    closeMenu();
                  }
                }}
                className={activeItem === padre.opcionmenu ? "active" : ""}
              >
                {padre.opcionmenu}
                {hijos(padre.iD_OPCIONMENU).length > 0 && (
                  <span className={`submenu-arrow ${openSubmenus[padre.iD_OPCIONMENU] ? 'open' : ''}`}>▼</span>
                )}
              </div>

              {openSubmenus[padre.iD_OPCIONMENU] && hijos(padre.iD_OPCIONMENU).length > 0 && (
                <ul className="submenu">
                  {hijos(padre.iD_OPCIONMENU).map(hijo => (
                    <li
                      key={hijo.iD_OPCIONMENU}
                      className={activeItem === hijo.opcionmenu ? "active" : ""}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveItem(hijo.opcionmenu);
                        closeMenu();
                      }}
                    >
                      {hijo.opcionmenu}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
