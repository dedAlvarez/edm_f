import React, { useState, useEffect } from 'react';
import '../../styles/pages/Integrador.css';
import useConfig from '../../hooks/useConfig';

function Indices() {
  const config = useConfig(); 

  const [mensaje, setMensaje] = useState(null);
  const [progreso, setProgreso] = useState('');
  const [jobEnEjecucion, setJobEnEjecucion] = useState(null);
  const [jobEjecutadoExitoso, setJobEjecutadoExitoso] = useState(null);


  if (!config) {
    return <p>Cargando configuración...</p>;
  }


  const {
    etl,
    apiSeguridad,
    apiKeySeguridad
  } = config;


  const handleClick = async () => {
    if (jobEnEjecucion) return;

    setJobEnEjecucion(etl.job);
    setJobEjecutadoExitoso(null);
    setMensaje({ texto: `Enviando Correo: ${etl.descripcion}`, tipo: 'info' });

    const body = {
      repositorio: etl.repositorio,
      usuario: etl.usuario,
      password: etl.password,
      directorio: etl.ruta,
      nombreJob: etl.job,
      parametros: { "Id_envio": etl.Id_envio }
    };

    try {
      const response = await fetch(`${apiSeguridad}/api/Grupos/ejecutar-job-repo`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': apiKeySeguridad
        },
        body: JSON.stringify(body)
      });

      console.log('Response:', response);
      console.log('Body:', body);

      if (response.ok) {
        setMensaje({ texto: `✅ Correo enviado correctamente`, tipo: 'exito' });
        setJobEjecutadoExitoso(etl.job);
      } else {
        setMensaje({ texto: `❌ Error al enviar (status ${response.status})`, tipo: 'error' });
      }
    } catch (error) {
      console.error('Error al llamar la API:', error);
      setMensaje({ texto: `❌ Error de red al enviar ${etl.job}`, tipo: 'error' });
    } finally {
      setJobEnEjecucion(null);
    }
  };

  const getButtonClass = () => {
    if (jobEnEjecucion === etl.job) return 'btn-ejecutando';
    if (jobEjecutadoExitoso === etl.job) return 'btn-exito';
    return 'play-button';
  };

  return (
    <main className="integrador-area">
      <h1 className="main-title">Índices Contables</h1>
      {mensaje && (
        <div className={`mensaje-flotante ${mensaje.tipo}`} style={{ marginBottom: '20px', fontWeight: 'bold' }}>
          {mensaje.texto}{jobEnEjecucion && <span>{progreso}</span>}
        </div>
      )}

      <section className="bloque">
        <div className="combo-container">
          <h2 className="titleIndice">Indices: Proceso Diario</h2>
          <button
            className={getButtonClass()}
            onClick={handleClick}
            disabled={!!jobEnEjecucion}
          >
            ▶
          </button>
        </div>
      </section>
    </main>
  );
}

export default Indices;
