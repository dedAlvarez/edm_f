import React, { useState, useEffect } from "react";
import {
  getPm2Processes,
  restartPm2Process,
  stopPm2Process,
  logPm2Process,
} from "../services/nodeprocess";
import { RotateCcw, Square, X } from "lucide-react";
import "../styles/pages/ProcesosNode.css";

function ProcesosNode() {
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedLog, setSelectedLog] = useState("");
  const [selectedProcessName, setSelectedProcessName] = useState("");

  const fetchProcesses = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPm2Processes();
      setProcesses(data);
    } catch (e) {
      setError("Error al cargar procesos.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcesses();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchProcesses();
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  const handleRestart = async (name) => {
    await restartPm2Process(name);
    fetchProcesses();
  };

  const handleStop = async (name) => {
    await stopPm2Process(name);
    fetchProcesses();
  };

  const handleShowLogs = async (name) => {
    const logs = await logPm2Process(name);
    setSelectedLog(logs);
    setSelectedProcessName(name);
  };

  const handleCloseLogs = () => {
    setSelectedLog("");
    setSelectedProcessName("");
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="title">🖥️ Procesos PM2</h1>
      </header>

      {loading && processes.length === 0 ? (
        <p className="loading">Cargando procesos...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="process-list">
          <table className="process-table">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Estado</th>
                <th>Instancias</th>
                <th>Uptime</th>
                <th>CPU (%)</th>
                <th>Memoria</th>
                <th>Versión PM2</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {processes.length > 0 ? (
                processes.map((proc, i) => (
                  <tr key={i}>
                    <td>{proc.name || proc.pm2_env?.name}</td>
                    <td>{proc.pm2_env?.status || proc.status}</td>
                    <td>{proc.pm2_env?.instances ?? "-"}</td>
                    <td>
                      {proc.pm2_env?.pm_uptime
                        ? new Date(proc.pm2_env.pm_uptime).toLocaleString()
                        : "-"}
                    </td>
                    <td>{proc.monit?.cpu ?? "-"}</td>
                    <td>
                      {proc.monit?.memory
                        ? `${(proc.monit.memory / 1024 / 1024).toFixed(2)} MB`
                        : "-"}
                    </td>
                    <td>{proc.pm2_version || "-"}</td>
                    <td>
                      <button
                        className="btn-icon"
                        onClick={() =>
                          handleRestart(proc.name || proc.pm2_env?.name)
                        }
                        title="Reiniciar"
                      >
                        <RotateCcw size={18} />
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() =>
                          handleStop(proc.name || proc.pm2_env?.name)
                        }
                        title="Detener"
                      >
                        <Square size={18} />
                      </button>
                      <button
                        className="btn-icon"
                        onClick={() =>
                          handleShowLogs(proc.name || proc.pm2_env?.name)
                        }
                        title="Ver Logs"
                      >
                        📄
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center" }}>
                    No hay procesos activos
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {selectedLog && (
            <div className="log-output">
              <div className="log-header">
                <h3>📄 Logs de: {selectedProcessName}</h3>
                <button onClick={handleCloseLogs} className="btn-close-log">
                  <X size={18} />
                </button>
              </div>
              <pre className="log-content">{selectedLog}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ProcesosNode;
