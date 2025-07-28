import { useMsal } from '@azure/msal-react';
import { useState, useEffect } from 'react';
import Layout from './components/layout';
import './styles/home.css';
import useConfig from './hooks/useConfig';
import NEGOCIO from './pages/Negocio';
import Integrador from './pages/Integrador';
import ETL from './pages/ETL';
import ProcesosNode from './pages/ProcesosNode';

export default function HomePage() {
  const config = useConfig();
  const { accounts, instance } = useMsal();
  const [menuOpen, setMenuOpen] = useState(window.innerWidth >= 992);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 992);
  const [activeItem, setActiveItem] = useState("Inicio");
  const [submenuOpen, setSubmenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const [pageComponents, setPageComponents] = useState({});
  const [permissions, setPermissions] = useState({});

  const email = accounts[0]?.username || '';

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const closeMenu = () => setMenuOpen(false);
  const handleLogout = () => instance.logoutRedirect();
  const handleMenuClick = (item) => setActiveItem(item);

  // Mapeo de componentes dinámico
  const componentMap = {
    "NEGOCIO": NEGOCIO,
    "INTEGRADOR": Integrador,
    "ETL": ETL,
    'PROCESOSNODE': ProcesosNode
  };

  useEffect(() => {
    if (!config || !email) return;

    const fetchMenu = async () => {
      try {
        const gruposResp = await fetch(
          `${config.apiSeguridad}/api/Grupos/GetUserGroupsAAD?email=${email}`,
          {
            method: 'GET',
            headers: {
              'X-Api-Key': config.apiKeySeguridad
            }
          }
        );

        if (!gruposResp.ok) throw new Error("Error al obtener grupos.");
        const grupos = await gruposResp.json();

        const opcionesResp = await fetch(
          `${config.apiSeguridad}/api/Grupos/TraeOpcionesMenuUsuario?Id_sistema=1`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'X-Api-Key': config.apiKeySeguridad
            },
            body: JSON.stringify(grupos)
          }
        );

        if (!opcionesResp.ok) throw new Error("Error al obtener opciones del menú.");
        const opciones = await opcionesResp.json();

        setMenuItems(opciones);

        const permissionsMap = {};
        opciones.forEach(item => {
          permissionsMap[item.opcionmenu] = {
            lectura: item.lectura,
            escritura: item.escritura,
            eliminar: item.eliminar
          };
        });
        setPermissions(permissionsMap);

        const componentsToLoad = {};
        opciones.forEach(item => {
          if (componentMap[item.opcionmenu]) {
            componentsToLoad[item.opcionmenu] = componentMap[item.opcionmenu];
          }
        });
        setPageComponents(componentsToLoad);
      } catch (err) {
        console.error("Error obteniendo menú:", err);
      } finally {
        setLoadingMenu(false);
      }
    };

    fetchMenu();
  }, [config, email]);

  if (!config) return <div>Cargando configuración...</div>;

  
  return (
    <Layout
      menuOpen={menuOpen}
      toggleMenu={toggleMenu}
      userName={accounts[0].name.split(' ')[0]}
      activeItem={activeItem}
      setActiveItem={setActiveItem}
      submenuOpen={submenuOpen}
      setSubmenuOpen={setSubmenuOpen}
      handleLogout={handleLogout}
      closeMenu={closeMenu}
      menuItems={menuItems}
    >
      <main className={`content-area ${menuOpen ? 'sidebar-open' : ''}`} onClick={closeMenu}>
        <div className={`content-section ${activeItem === "Inicio" ? "show" : ""}`}>
          {activeItem === "Inicio" && (
            <div className="welcome-box">
              <h2>Bienvenido, {accounts[0].name}</h2>
              <p>{accounts[0].username}</p>
            </div>
          )}
        </div>

        {/* Renderizado dinámico de todas las páginas */}
        {menuItems.map(menuItem => {
        const Component = pageComponents[menuItem.opcionmenu];
        const itemPermissions = permissions[menuItem.opcionmenu] || {
          lectura: false,
          escritura: false,
          eliminar: false
        };
        
        return (
          <div 
            key={menuItem.opcionmenu} 
            className={`content-section ${activeItem === menuItem.opcionmenu ? "show" : ""}`}
          >
            {activeItem === menuItem.opcionmenu && Component && (
              <Component 
                permissions={permissions[menuItem.opcionmenu] || { 
                  escritura: false, 
                  eliminar: false 
                }} 
              />
            )}
          </div>
          );
        })}
      </main>
    </Layout>
  );
}