import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import '../../styles/pages/Oportunidades_Arbitraje.css';
import useConfig from '../../hooks/useConfig';

function Oportunidades_Arbitraje() {
  const config = useConfig();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);  // para carga inicial
  const [isRefreshing, setIsRefreshing] = useState(false); // para botón refrescar
  const [error, setError] = useState(null);
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('desc');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchData = () => {
    if (!config) return;

    if (!loading) setIsRefreshing(true);
    setError(null);

    const controller = new AbortController();

    fetch(`${config.apiIntegrador}/api/PrecioMDM/GetArbitraje`, {
      method: 'GET',
      headers: {
        'X-Api-Key': config.apiKeyIntegrador
      },
      signal: controller.signal
    })
      .then(res => {
        if (!res.ok) throw new Error('Error al obtener datos');
        return res.json();
      })
      .then(json => {
  let resultados = json.data || [];

  // Filtrar para eliminar filas con rentabilidad negativa
  resultados = resultados.filter(item => {
    const val = parseFloat(item.rentabilidad.replace('%', '').trim().replace(',', '.'));
    return !isNaN(val) && val >= 0;
  });

  // Ordenar descendente por rentabilidad si no hay sortColumn
  if (!sortColumn) {
    resultados = resultados.sort((a, b) => {
      const valA = parseFloat(a.rentabilidad.replace('%', '').trim().replace(',', '.'));
      const valB = parseFloat(b.rentabilidad.replace('%', '').trim().replace(',', '.'));
      return valB - valA;
    });
  }

  setData(resultados);
  setColumns(resultados.length > 0 ? Object.keys(resultados[0]) : []);
  setLoading(false);
  setIsRefreshing(false);
})


    return () => controller.abort();
  };

  useEffect(() => {
    if (!config) return;

    // Carga inicial
    fetchData();

    if (autoRefresh) { // 🔹 solo activa el intervalo si el switch está encendido
      const intervalId = setInterval(() => {
        fetchData();
      }, config.ReloadTimeRV);
      return () => clearInterval(intervalId);
    }
  }, [config, sortColumn, sortDirection, autoRefresh]); // importante agregar sortColumn y sortDirection

  const handleSort = (col) => {
    let newDirection = 'desc';
    if (sortColumn === col && sortDirection === 'desc') {
      newDirection = 'asc';
    }

    setSortColumn(col);
    setSortDirection(newDirection);

    const sortedData = [...data].sort((a, b) => {
      if (a[col] < b[col]) return newDirection === 'asc' ? -1 : 1;
      if (a[col] > b[col]) return newDirection === 'asc' ? 1 : -1;
      return 0;
    });

    setData(sortedData);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Oportunidades_Arbitraje');

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    XLSX.writeFile(workbook, `Oportunidades_Arbitraje_${formattedDate}.xlsx`);
  };

  if (!config) return <div className="loading">Cargando configuración...</div>;
  if (error) return <div className="loading">Error: {error}</div>;

  return (
    <div className="app-Puntas_RV">
      <div className="header-container">
        <h1 className="title-Puntas_RV">Oportunidades de Arbitraje</h1>
        <div className="btn-group">
          {/* 🔹 Switch para activar/desactivar el auto refresh */}
          <label className="switch">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={() => setAutoRefresh(!autoRefresh)}
            />
            <span className="slider"></span>
          </label>
          <span className={`auto-refresh-label ${autoRefresh ? 'on' : 'off'}`}>
          {autoRefresh ? 'Auto-Refresh ON' : 'Auto-Refresh OFF'}
          </span>
          <button
            className="btn-refresh"
            onClick={fetchData}
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <>
                <span className="spinner"></span> Actualizando...
              </>
            ) : (
              'Actualizar'
            )}
          </button>
          <button className="btn-excel" onClick={exportToExcel}>
            Exportar a Excel
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading">Cargando datos...</div>
      ) : data.length === 0 ? (
        <div className="no-data-message" style={{ textAlign: 'center', marginTop: 30, fontSize: 18, color: '#555' }}>
          No hay datos para mostrar
        </div>
      ) : (
        <table className={`tabla-puntas ${isRefreshing ? 'updating' : ''}`}>
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th
                  key={i}
                  onClick={() => handleSort(col)}
                  style={{ cursor: 'pointer' }}
                >
                  {col}
                  {sortColumn === col && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((fila, i) => (
              <tr key={i}>
                {columns.map((col, j) => {
                  let style = {};
                  let cellValue = fila[col];

                  if (col.toLowerCase() === "rentabilidad") {
                    const cleaned = cellValue
                      .replace('%', '')
                      .trim()
                      .replace(',', '.');

                    const val = parseFloat(cleaned);
                    if (!isNaN(val)) {
                      if (val < 10) style.color = "#FF8C00";
                      else if (val >= 10 && val < 20) style.color = "#1E90FF";
                      else if (val >= 20) style.color = "#1caa1cff";
                    }
                  }

                  return <td key={j} style={style}>{cellValue}</td>;
                })}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Oportunidades_Arbitraje;
