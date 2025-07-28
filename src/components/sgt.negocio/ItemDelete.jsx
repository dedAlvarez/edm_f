import React, { useState, useEffect } from 'react';
import '../../styles/components/sgt.negocio/ItemDelete.css';

const DeleteItemForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    id_negocio: initialData.ID_NEGOCIO || '',
    dsc_negocio: initialData.DSC_NEGOCIO || '',
    abr_negocio: initialData.ABR_NEGOCIO || '',
    cod_moneda_gpi: initialData.COD_MONEDA_GPI || ''
  });

  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    // Actualizar formData cuando initialData cambia
    if (initialData) {
      setFormData({
        id_negocio: initialData.ID_NEGOCIO || '',
        dsc_negocio: initialData.DSC_NEGOCIO || '',
        abr_negocio: initialData.ABR_NEGOCIO || '',
        cod_moneda_gpi: initialData.COD_MONEDA_GPI || ''
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiError('');
    
    try {
      const primaryKeyColumn = 'ID_NEGOCIO';
      const primaryKeyValue = formData.id_negocio;
  
      const response = await fetch(`https://apiconsolaadmqa.vantrustcapital.cl/api/Tables/delete-logico/NEGOCIO?primaryKeyColumn=${primaryKeyColumn}&primaryKeyValue=${primaryKeyValue}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': 'N3v3rG0nnaG1v3Y0uUp-9f8e42b7-4c21-420a-b71f-bc2e13f9b1ca'
        },
        body: JSON.stringify({}),
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar el negocio.');
      }
  
      // Elimina el window.location.reload() y reemplázalo con:
      if (onSubmit) {
        onSubmit(formData.id_negocio);
      }
  
      // Llama a onRefresh si existe para actualizar la lista
      if (onRefresh) {
        onRefresh();
      }
      
    } catch (error) {
      setApiError(error.message || 'Hubo un problema al eliminar el elemento.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="item-form" onSubmit={handleSubmit}>
      <div className="warning-message">
        <p>¿Estás seguro de que deseas eliminar este negocio? Esta acción no se puede deshacer.</p>
      </div>

      <div className="form-group">
        <label htmlFor="id_negocio">ID Negocio</label>
        <input
          type="text"
          id="id_negocio"
          name="id_negocio"
          value={formData.id_negocio}
          className="readonly-field"
          disabled={true}
          readOnly
        />
      </div>

      <div className="form-group">
        <label htmlFor="dsc_negocio">Descripción</label>
        <input
          type="text"
          id="dsc_negocio"
          name="dsc_negocio"
          value={formData.dsc_negocio}
          className="readonly-field"
          disabled={true}
          readOnly
        />
      </div>

      <div className="form-group">
        <label htmlFor="abr_negocio">Abreviación</label>
        <input
          type="text"
          id="abr_negocio"
          name="abr_negocio"
          value={formData.abr_negocio}
          className="readonly-field"
          disabled={true}
          readOnly
        />
      </div>

      <div className="form-group">
        <label htmlFor="cod_moneda_gpi">Código Moneda</label>
        <input
          type="text"
          id="cod_moneda_gpi"
          name="cod_moneda_gpi"
          value={formData.cod_moneda_gpi}
          className="readonly-field"
          disabled={true}
          readOnly
        />
      </div>

      {apiError && <div className="error-message">{apiError}</div>}

      <div className="form-actions">
        <button type="button" className="button cancel" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="button delete" disabled={loading}>
          {loading ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>
    </form>
  );
};

export default DeleteItemForm;