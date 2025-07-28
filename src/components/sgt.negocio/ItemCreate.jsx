import React, { useState, useEffect } from 'react';
import '../../styles/components/sgt.negocio/ItemForm.css';

const ItemForm = ({ initialData = {}, onSubmit, onCancel, onRefresh }) => {
  const [formData, setFormData] = useState({
    id_negocio: initialData.id_negocio || '',
    dsc_negocio: initialData.dsc_negocio || '',
    abr_negocio: initialData.abr_negocio || '',
    cod_moneda_gpi: initialData.cod_moneda_gpi || '',
    activo: initialData.activo ?? true,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (initialData && Object.keys(formData).every(key => !formData[key])) {
      setFormData({
        id_negocio: initialData.id_negocio || '',
        dsc_negocio: initialData.dsc_negocio || '',
        abr_negocio: initialData.abr_negocio || '',
        cod_moneda_gpi: initialData.cod_moneda_gpi || '',
        activo: initialData.activo || true
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
    if (!formData.id_negocio.trim()) newErrors.id_negocio = 'ID de negocio es requerido';
    if (!formData.dsc_negocio.trim()) newErrors.dsc_negocio = 'Descripción del negocio es requerida';
    if (!formData.abr_negocio.trim()) newErrors.abr_negocio = 'Abreviación del negocio es requerida';
    if (!formData.cod_moneda_gpi.trim()) newErrors.cod_moneda_gpi = 'Código de moneda es requerido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!validate()) return;
  
    setLoading(true);
    setApiError('');
  
    const body = {
      ID_NEGOCIO: formData.id_negocio,
      DSC_NEGOCIO: formData.dsc_negocio,
      ABR_NEGOCIO: formData.abr_negocio,
      COD_MONEDA_GPI: formData.cod_moneda_gpi,
      ACTIVO: formData.activo,
    };
  
    try {
      const response = await fetch('https://apiconsolaadmqa.vantrustcapital.cl/api/Tables/insert-data/NEGOCIO', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Api-Key': 'N3v3rG0nnaG1v3Y0uUp-9f8e42b7-4c21-420a-b71f-bc2e13f9b1ca'
        },
        body: JSON.stringify(body),
      });
  
      if (!response.ok) {
        throw new Error('Error al enviar los datos');
      }
  
      const result = await response.json();
      console.log('Success:', result);
  
      if (onSubmit) onSubmit(formData);
  
      // Limpia el formulario
      setFormData({
        id_negocio: '',
        dsc_negocio: '',
        abr_negocio: '',
        cod_moneda_gpi: '',
        activo: true,
      });
  
      // Llama a onRefresh si existe
      if (onRefresh) onRefresh();
  
    } catch (error) {
      setApiError(error.message || 'Hubo un problema al enviar los datos.');
    } finally {
      setLoading(false);
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
        <input
          type="text"
          id="cod_moneda_gpi"
          name="cod_moneda_gpi"
          value={formData.cod_moneda_gpi}
          onChange={handleChange}
          className={errors.cod_moneda_gpi ? 'error' : ''}
        />
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
                  value: e.target.checked,
                },
              })
            }
          />
          <span className="slider round"></span>
        </label>
      </div>

      {apiError && <div className="error-message">{apiError}</div>}

      <div className="form-actions">
        <button type="button" className="button cancel" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="button primary" disabled={loading}>
          {loading ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
};

export default ItemForm;
