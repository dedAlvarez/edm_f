import React, { useState, useEffect } from 'react';
import '../styles/pages/Integrador.css';
import useConfig from '../hooks/useConfig'; 

function ETL() {
  const config = useConfig();
  const [opcionesA, setOpcionesA] = useState([]);
  const [opcionesB, setOpcionesB] = useState([]);
  const [seleccionA, setSeleccionA] = useState(null);
  const [seleccionB, setSeleccionB] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [progreso, setProgreso] = useState('');
  const [jobEnEjecucion, setJobEnEjecucion] = useState(null);
  const [jobEjecutadoExitoso, setJobEjecutadoExitoso] = useState(null);
  const [cargandoOpciones, setCargandoOpciones] = useState({ ODS: true, SGT: true });
  const [errorCarga, setErrorCarga] = useState({ ODS: null, SGT: null });

  // Cargar opciones desde la API al iniciar
  useEffect(() => {
    async function fetchOpciones(grupo, setOpciones) {
      setCargandoOpciones(prev => ({ ...prev, [grupo]: true }));
      setErrorCarga(prev => ({ ...prev, [grupo]: null }));
      
      try {
        const response = await fetch(`${config.apiSeguridad}/api/Grupos/GetValoresEtl?esquema=${grupo}`, {
          headers: {
            'X-Api-Key': config.apiKeySeguridad
          }
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data = await response.json();
        setOpciones(data);
      } catch (error) {
        console.error(`Error al cargar opciones de ${grupo}:`, error);
        setErrorCarga(prev => ({ ...prev, [grupo]: `Error al cargar datos: ${error.message}` }));
      } finally {
        setCargandoOpciones(prev => ({ ...prev, [grupo]: false }));
      }
    }

    fetchOpciones('ODS', setOpcionesA);
    fetchOpciones('SGT', setOpcionesB);
  }, [config]);


  // Efecto de animación para el progreso
  useEffect(() => {
    if (jobEnEjecucion) {
      const interval = setInterval(() => {
        setProgreso(prev => (prev.length >= 3 ? '' : prev + '.'));
      }, 500);
      return () => clearInterval(interval);
    } else {
      setProgreso('');
    }
  }, [jobEnEjecucion]);

  const handleClick = async (itemSeleccionado) => {
    if (!itemSeleccionado || jobEnEjecucion) return;

    setJobEnEjecucion(itemSeleccionado.nombre);
    setJobEjecutadoExitoso(null);
    setMensaje({ texto: `🚀 Ejecutando ETL: ${itemSeleccionado.nombre}`, tipo: 'info' });

    const body = {
      repositorio: itemSeleccionado.repositorio,
      usuario: config.etl.usuario,
      password: config.etl.password,
      directorio: itemSeleccionado.ruta,
      nombreJob: itemSeleccionado.job,
      parametros: {}
    };

    try {
      const response = await fetch(`${config.apiSeguridad}/api/Grupos/ejecutar-job-repo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': config.apiKeySeguridad
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        setMensaje({ texto: `✅ ETL ejecutada correctamente`, tipo: 'exito' });
        setJobEjecutadoExitoso(itemSeleccionado.titulo);
      } else {
        setMensaje({ texto: `❌ Error al ejecutar (status ${response.status})`, tipo: 'error' });
      }
    } catch (error) {
      console.error('Error al llamar la API:', error);
      setMensaje({ texto: `❌ Error de red al ejecutar ${itemSeleccionado.titulo}`, tipo: 'error' });
    } finally {
      setJobEnEjecucion(null);
    }
  };

  const getButtonClass = (titulo) => {
    if (jobEnEjecucion === titulo) return 'btn-ejecutando';
    if (jobEjecutadoExitoso === titulo) return 'btn-exito';
    return 'play-button';
  };

    const renderOptions = (options) => {
    return options.map((item, index) => (
        <option key={index} value={item.nombre}>
        {item.nombre}
        </option>
    ));
    };

  return (
    <main className="integrador-area">
      <h1 className="main-title">Ejecución de ETL</h1>
      <div className="boton-instrucciones-container">
        <button
          className="btn-instrucciones"
          onClick={() => window.open('../../public/Manual_ConsolaAdm-ETL.pdf', '_blank')}
        >
          📄 Ver Instructivo
        </button>
      </div>

      {mensaje && (
        <div className={`mensaje-flotante ${mensaje.tipo}`} style={{ marginBottom: '20px', fontWeight: 'bold' }}>
          {mensaje.texto}{jobEnEjecucion && <span>{progreso}</span>}
        </div>
      )}

      <section className="bloque">
        <h2>ODS</h2>
        <div className="combo-container">
          {cargandoOpciones.ODS ? (
            <div className="cargando-mensaje">Cargando opciones...</div>
          ) : errorCarga.ODS ? (
            <div className="error-mensaje">{errorCarga.ODS}</div>
          ) : (
            <>
              <select
                value={seleccionA?.nombre || ''}
                onChange={(e) => {
                  const seleccionada = opcionesA.find(o => o.nombre === e.target.value);
                  setSeleccionA(seleccionada);
                }}
                className="combo-select"
                disabled={!!jobEnEjecucion}
              >
                <option value="">-- Seleccione una opción --</option>
                {renderOptions(opcionesA)}
              </select>
              <button
                className={getButtonClass(seleccionA?.nombre)}
                onClick={() => handleClick(seleccionA)}
                disabled={!seleccionA || !!jobEnEjecucion}
              >
                ▶
              </button>
            </>
          )}
        </div>
      </section>

      <section className="bloque">
        <h2>SGT</h2>
        <div className="combo-container">
          {cargandoOpciones.SGT ? (
            <div className="cargando-mensaje">Cargando opciones...</div>
          ) : errorCarga.SGT ? (
            <div className="error-mensaje">{errorCarga.SGT}</div>
          ) : (
            <>
              <select
                value={seleccionB?.nombre || ''}
                onChange={(e) => {
                  const seleccionada = opcionesB.find(o => o.nombre === e.target.value);
                  setSeleccionB(seleccionada);
                }}
                className="combo-select"
                disabled={!!jobEnEjecucion}
              >
                <option value="">-- Seleccione una opción --</option>
                {renderOptions(opcionesB)}
              </select>
              <button
                className={getButtonClass(seleccionB?.nombre)}
                onClick={() => handleClick(seleccionB)}
                disabled={!seleccionB || !!jobEnEjecucion}
              >
                ▶
              </button>
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default ETL;