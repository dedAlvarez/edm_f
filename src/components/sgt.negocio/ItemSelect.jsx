import React, { useState, useEffect, useCallback } from 'react';
import { Search, SortAsc, SortDesc } from 'lucide-react';
import '../../styles/components/sgt.negocio/ItemList.css';

const ItemList = ({ onEdit, onDelete }) => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState('ID_NEGOCIO');
  const [sortDirection, setSortDirection] = useState('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(9);
  const [isLoading, setIsLoading] = useState(false);

  // Función para cargar datos que puede ser reutilizada
  const loadData = useCallback(() => {
    setIsLoading(true);
    fetch('/api/api/Tables/get-table-data/Negocio', {
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': 'N3v3rG0nnaG1v3Y0uUp-9f8e42b7-4c21-420a-b71f-bc2e13f9b1ca'
      }
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setItems(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching data:', err);
        setIsLoading(false);
      });
  }, []);

  // Carga inicial de datos
  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <SortAsc size={16} /> : <SortDesc size={16} />;
  };

  const filteredItems = items.filter(
    (item) =>
      item.DSC_NEGOCIO?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ABR_NEGOCIO?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedItems = [...filteredItems].sort((a, b) => {
    const aVal = a[sortField];
    const bVal = b[sortField];
    if (typeof aVal === 'string') {
      return sortDirection === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    } else {
      return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
    }
  });

  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const paginatedItems = sortedItems.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="item-list">
      <div className="list-controls">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Buscar negocio..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        <div className="sort-controls">
          <span className="sort-label">Ordenar por:</span>
          {['ID_NEGOCIO', 'DSC_NEGOCIO', 'ABR_NEGOCIO'].map((field) => (
            <button
              key={field}
              className={`sort-button ${sortField === field ? 'active' : ''}`}
              onClick={() => toggleSort(field)}
            >
              {field} {getSortIcon(field)}
            </button>
          ))}
        </div>

      </div>

      {isLoading ? (
        <div className="loading-state">Cargando datos...</div>
      ) : sortedItems.length === 0 ? (
        <div className="empty-state">
          {searchQuery ? '🔍 No hay coincidencias' : '🚀 Aún no hay datos activos.'}
        </div>
      ) : (
        <>
          <div className="table-container">
            <div className="items-table">
              <div className="item-row-horizontal header">
                <div className="item-cell">ID_NEGOCIO</div>
                <div className="item-cell">DSC_NEGOCIO</div>
                <div className="item-cell">ABR_NEGOCIO</div>
                <div className="item-cell">COD_MONEDA_GPI</div>
                <div className="item-cell">ACTIVO</div>
                <div className="item-cell actions">Acciones</div>
              </div>

              {paginatedItems.map((item) => (
                <div className="item-row-horizontal" key={item.ID_NEGOCIO}>
                  <div className="item-cell">{item.ID_NEGOCIO}</div>
                  <div className="item-cell">{item.DSC_NEGOCIO}</div>
                  <div className="item-cell">{item.ABR_NEGOCIO}</div>
                  <div className="item-cell">{item.COD_MONEDA_GPI}</div>
                  <div className="item-cell">{item.ACTIVO ? 'SI' : 'NO'}</div>
                  <div className="item-cell actions">
                    {typeof onEdit === 'function' && (
                      <button onClick={() => onEdit(item)}>✏️</button>
                    )}
                    {typeof onDelete === 'function' && (
                      <button onClick={() => onDelete(item)}>🗑️</button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>      
          <div className="items-per-page">
            <label htmlFor="itemsPerPage">Items por página:</label>
            <select
              id="itemsPerPage"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1); // Reinicia a la primera página
              }}
            >
              {[9, 18, 27, 35, 46].map((num) => (
                <option key={num} value={num}>{num}</option>
              ))}
            </select>
          </div>

          <div className="pagination-controls">
            <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
              ◀ Anterior
            </button>
            <span>Página {currentPage} de {totalPages}</span>
            <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
              Siguiente ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
};

// Exportamos tanto el componente como la función de recarga
export default ItemList;