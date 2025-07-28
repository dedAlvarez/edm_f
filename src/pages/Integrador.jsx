import React, { useState } from 'react';
import { useMsal } from '@azure/msal-react';
import '../styles/pages/Integrador.css';
import useConfig from '../hooks/useConfig';

function Integrador() {
  const config = useConfig();
  const [seleccionA, setSeleccionA] = useState('');
  const [seleccionB, setSeleccionB] = useState('');
  const [mensajeFlotante, setMensajeFlotante] = useState(null);
  const [cargando, setCargando] = useState(false);

  const mensajeFijo = {
    texto: '⚠️ ALERTA: Ejecutar siempre en orden ',
    tipo: 'alerta',
  };

  const handleClick = async (descripcion) => {
  if (!descripcion || cargando || !config) return;

  setCargando(true);
  setMensajeFlotante({ texto: `⏳ Ejecutando ${descripcion}...`, tipo: 'info' });

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(`${config.apiIntegrador}/api/Tables/ejecutar-api-externa/${descripcion}`, {
      method: 'GET',
      headers: {
        'X-Api-Key': config.apiKeyIntegrador
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      setMensajeFlotante({ texto: `✅ ${descripcion} ejecutado correctamente`, tipo: 'exito' });
    } else {
      setMensajeFlotante({ texto: `❌ Error al ejecutar ${descripcion} (status ${response.status})`, tipo: 'error' });
    }
  } catch (error) {
    console.error('Error al llamar la API:', error);

    if (error.name === 'AbortError') {
      setMensajeFlotante({ texto: `✅ ${descripcion} ejecutado correctamente`, tipo: 'exito' });
    } else {
      setMensajeFlotante({ texto: `❌ Error de red al ejecutar ${descripcion}`, tipo: 'error' });
    }
  }

  setCargando(false);
};

  const opcionesA = [
    { orden: 3, titulo: 'Asesor - VNT_Employee__c', descripcion: 'ASESOR' },
    { orden: 4, titulo: 'Asesor Apoyo - VNT_EmployeeXEmployee__c', descripcion: 'ASESOR_APOYO' },
    { orden: 6, titulo: 'Tipo Contacto - FinServ__ReciprocalRole__c', descripcion: 'TIPO_CONTACTO' },
    { orden: 5, titulo: 'Cuenta - FinServ__FinancialAccount__c', descripcion: 'CUENTA' },
    { orden: 7, titulo: 'Cliente Asesores - VNT_EmployeeXAccount__c', descripcion: 'CLIENTE_ASESORES' },
    { orden: 8, titulo: 'Datos Bancarios - FinServ__FinancialAccount__c', descripcion: 'DATOS_BANCARIOS' },
    { orden: 9, titulo: 'Datos Compliance - VNT_Mark__c', descripcion: 'DATOS_COMPLIANCE' },
    { orden: 10, titulo: 'Informacion de Contacto - VNT_ContactInformation__c', descripcion: 'INFORMACION_CONTACTO' },
    { orden: 11, titulo: 'Beneficiarios - VNT_Beneficiary__c', descripcion: 'BENEFICIARIOS' },
    { orden: 12, titulo: 'Instrumento - Product2', descripcion: 'INSTRUMENTOS' }
  ];

  const opcionesB = [
    { orden: 1, titulo: 'Cliente Natural - Account', descripcion: 'CLIENTE_PN' },
    { orden: 2, titulo: 'Cliente Juridico - Account', descripcion: 'CLIENTE_PJ' },
    { orden: 13, titulo: 'Cartera Resumida - Asset', descripcion: 'CARTERA_RESUMIDA' },
    { orden: 14, titulo: 'Cierre Caja - FinServ__FinancialAccountTransaction__c', descripcion: 'CIERRE_CAJA' },
    { orden: 15, titulo: 'Operaciones GPI - VNT_TitleMovement__c', descripcion: 'OPERACIONES_GPI' },
    { orden: 16, titulo: 'Movimiento Caja - VNT_FinancialAccountMovement__c', descripcion: 'MOVIMIENTO_CAJA' },
    { orden: 17, titulo: 'Simultaneas Vigentes - VNT_CurrentSimultaneosOperationDetail', descripcion: 'SIMULTANEAS_VIGENTES' },
    { orden: 18, titulo: 'Operaciones Factoring - VNT_FactoringOperation', descripcion: 'OPERACIONES_FACTORING' },
    { orden: 19, titulo: 'Montos Transados - VNT_TradedAmount__c', descripcion: 'MONTO_TRANSADO' },
    { orden: 20, titulo: 'Alertas SID - VNT_SIDAlert__c', descripcion: 'ALERTAS_SID' },
    { orden: 21, titulo: 'Detalle Inversion - VNT_InvestmentDetail__c', descripcion: 'DETALLE_INVERSIONES' },
    { orden: 22, titulo: 'Resumen Factoring - VNT_FactoringSummary__c', descripcion: 'DETALLE_INVERSIONES' }
  ];

  return (
    <>
      {/* ✅ Mensaje flotante (temporal) */}
      {mensajeFlotante && (
        <div className={`mensaje-flotante ${mensajeFlotante.tipo}`}>
          {mensajeFlotante.texto}
        </div>
      )}

      <main className="integrador-area">
        <h1 className="main-title">Integrador de Salesforce</h1>

        {/* ✅ Mensaje fijo centrado */}
        <div className={`mensaje-fijo ${mensajeFijo.tipo}`}>
          {mensajeFijo.texto}
        </div>
        <div className="boton-instrucciones-container">
        <button
            className="btn-instrucciones"
            onClick={() => window.open('../../public/Manual_ConsolaAdm-Integrador.pdf', '_blank')}
          >
            📄 Ver Instructivo
          </button>
        </div>
        <section className="bloque">
          <h2>SGT</h2>
          <div className="combo-container">
            <select
              value={seleccionA}
              onChange={(e) => setSeleccionA(e.target.value)}
              className="combo-select"
            >
              <option value="">-- Seleccione una opción --</option>
              {opcionesA.map((item) => (
                <option key={item.orden} value={item.descripcion}>
                  {item.orden}. {item.titulo}
                </option>
              ))}
            </select>
            <button className="play-button" onClick={() => handleClick(seleccionA)}>▶</button>
          </div>
        </section>

        <section className="bloque">
          <h2>Cierres | FechaCierre</h2>
          <div className="combo-container">
            <select
              value={seleccionB}
              onChange={(e) => setSeleccionB(e.target.value)}
              className="combo-select"
            >
              <option value="">-- Seleccione una opción --</option>
              {opcionesB.map((item) => (
                <option key={item.orden} value={item.descripcion}>
                  {item.orden}. {item.titulo}
                </option>
              ))}
            </select>
            <button className="play-button" onClick={() => handleClick(seleccionB)}>▶</button>
          </div>
        </section>
      </main>
    </>
  );
}

export default Integrador;
