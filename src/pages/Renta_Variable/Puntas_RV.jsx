import React, { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import '../../styles/pages/Puntas_RV.css';
import useConfig from '../../hooks/useConfig';

function Puntas_RV() {
  const config = useConfig();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 sortColumn parte en null → así no aparece flechita al inicio
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchData = () => {
    if (!config) return;

    if (!loading) setIsRefreshing(true);
    setError(null);

    const controller = new AbortController();

    fetch(`${config.apiIntegrador}/api/PrecioMDM/GetPreciosMDM`, {
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

        // 🔹 Ordena por instrumento ascendente solo si es la carga inicial
        if (!sortColumn) {
          resultados.sort((a, b) => {
            if (a.instrumento < b.instrumento) return -1;
            if (a.instrumento > b.instrumento) return 1;
            return 0;
          });
        } else {
          // 🔹 Si ya hay columna seleccionada, mantener ese orden
          resultados.sort((a, b) => {
            if (a[sortColumn] < b[sortColumn]) return sortDirection === 'asc' ? -1 : 1;
            if (a[sortColumn] > b[sortColumn]) return sortDirection === 'asc' ? 1 : -1;
            return 0;
          });
        }

        setData(resultados);
        setColumns(resultados.length > 0 ? Object.keys(resultados[0]) : []);
        setLoading(false);
        setIsRefreshing(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
        setIsRefreshing(false);
      });

    return () => controller.abort();
  };

  useEffect(() => {
    if (!config) return;

    fetchData();

    if (autoRefresh) {
      const intervalId = setInterval(() => {
        fetchData();
      }, config.ReloadTimeRV);
      return () => clearInterval(intervalId);
    }
  }, [config, sortColumn, sortDirection, autoRefresh]);

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
    XLSX.utils.book_append_sheet(workbook, worksheet, 'PuntasRV');

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    XLSX.writeFile(workbook, `Puntas_RV_${formattedDate}.xlsx`);
  };

  if (!config) return <div className="loading">Cargando configuración...</div>;
  if (error) return <div className="loading">Error: {error}</div>;

  return (
    <div className="app-Puntas_RV">
      <div className="header-container">
        <h1 className="title-Puntas_RV">Puntas RV</h1>
        <div className="btn-group">
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
                  {/* 🔹 Solo muestra flecha si el usuario seleccionó columna */}
                  {sortColumn === col && (sortDirection === 'asc' ? ' ↑' : ' ↓')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((fila, i) => (
              <tr key={i}>
                {columns.map((col, j) => (
                  <td key={j}>{fila[col]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Puntas_RV;
