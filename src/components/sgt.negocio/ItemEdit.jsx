import React, { useState, useEffect } from 'react';
import '../../styles/components/sgt.negocio/ItemForm.css';

const EditItemForm = ({ initialData = {}, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    id_negocio: initialData.ID_NEGOCIO || '',
    dsc_negocio: initialData.DSC_NEGOCIO || '',
    abr_negocio: initialData.ABR_NEGOCIO || '',
    cod_moneda_gpi: initialData.COD_MONEDA_GPI || '',
    activo: initialData.ACTIVO || ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    // Actualizar formData cuando initialData cambia
    if (initialData) {
      setFormData({
        id_negocio: initialData.ID_NEGOCIO || '',
        dsc_negocio: initialData.DSC_NEGOCIO || '',
        abr_negocio: initialData.ABR_NEGOCIO || '',
        cod_moneda_gpi: initialData.COD_MONEDA_GPI || '',
        activo: initialData.ACTIVO || ''
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.dsc_negocio.trim()) {
      newErrors.dsc_negocio = 'Descripción del negocio es requerida';
    }
    if (!formData.abr_negocio.trim()) {
      newErrors.abr_negocio = 'Abreviación del negocio es requerida';
    }
    if (!formData.cod_moneda_gpi.trim()) {
      newErrors.cod_moneda_gpi = 'Código de moneda es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (validate()) {
      setLoading(true);
      setApiError('');
  
      const updateBody = {
        primaryKeyColumn: "ID_NEGOCIO",
        primaryKeyValue: formData.id_negocio,
        data: {
          DSC_NEGOCIO: formData.dsc_negocio,
          ABR_NEGOCIO: formData.abr_negocio,
          COD_MONEDA_GPI: formData.cod_moneda_gpi,
          ACTIVO: formData.activo
        }
      };
  
      try {
        const response = await fetch('https://apiconsolaadmqa.vantrustcapital.cl//api/Tables/update-data/Negocio', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Api-Key': 'N3v3rG0nnaG1v3Y0uUp-9f8e42b7-4c21-420a-b71f-bc2e13f9b1ca'
          },
          body: JSON.stringify(updateBody),
        });
  
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Error al actualizar los datos');
        }
  
        const result = await response.json();
        console.log('Update Success:', result);
  
        const updatedItem = {
          id_negocio: formData.id_negocio,
          dsc_negocio: formData.dsc_negocio,
          abr_negocio: formData.abr_negocio,
          cod_moneda_gpi: formData.cod_moneda_gpi,
          activo: formData.activo
        };
  
        // Elimina el window.location.reload() y reemplázalo con:
        if (onSubmit) {
          onSubmit(updatedItem);
        }
  
  
      } catch (error) {
        console.error('Update Error:', error);
        setApiError(error.message || 'Hubo un problema al actualizar los datos.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <form className="item-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="id_negocio">ID Negocio</label>
        <input
          type="text"
          id="id_negocio"
          name="id_negocio"
          value={formData.id_negocio}
          onChange={handleChange}
          className={errors.id_negocio ? 'error' : ''}
          disabled={true} // Campo bloqueado para edición
          readOnly
        />
        {errors.id_negocio && <span className="error-message">{errors.id_negocio}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="dsc_negocio">Descripción</label>
        <input
          type="text"
          id="dsc_negocio"
          name="dsc_negocio"
          value={formData.dsc_negocio}
          onChange={handleChange}
          className={errors.dsc_negocio ? 'error' : ''}
        />
        {errors.dsc_negocio && <span className="error-message">{errors.dsc_negocio}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="abr_negocio">Abreviación</label>
        <input
          type="text"
          id="abr_negocio"
          name="abr_negocio"
          value={formData.abr_negocio}
          onChange={handleChange}
          className={errors.abr_negocio ? 'error' : ''}
        />
        {errors.abr_negocio && <span className="error-message">{errors.abr_negocio}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="cod_moneda_gpi">Código Moneda</label>
        <select
          id="cod_moneda_gpi"
          name="cod_moneda_gpi"
          value={formData.cod_moneda_gpi}
          onChange={handleChange}
          className={errors.cod_moneda_gpi ? 'error' : ''}
        >
          {/* Aquí puedes agregar las opciones de la moneda */}
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="MXN">MXN</option>
          <option value="CLP">CLP</option>
          {/* Agrega más monedas según sea necesario */}
        </select>
        {errors.cod_moneda_gpi && <span className="error-message">{errors.cod_moneda_gpi}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="activo">Activo</label>
        <label className="switch">
          <input
            type="checkbox"
            id="activo"
            name="activo"
            checked={formData.activo === true}
            onChange={(e) =>
              handleChange({
                target: {
                  name: 'activo',
                  value: e.target.checked, // ahora es true o false directamente
                },
              })
            }
          />
          <span className="slider round"></span>
        </label>
        {errors.activo && <span className="error-message">{errors.activo}</span>}
      </div>


      {apiError && <div className="error-message">{apiError}</div>}

      <div className="form-actions">
        <button type="button" className="button cancel" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="button primary" disabled={loading}>
          {loading ? 'Actualizando...' : 'Actualizar'}
        </button>
      </div>
    </form>
  );
};

export default EditItemForm;