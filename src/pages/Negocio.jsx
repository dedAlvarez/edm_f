import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import ItemList from '../components/sgt.negocio/ItemSelect';
import ItemForm from '../components/sgt.negocio/ItemCreate';
import EditItemForm from '../components/sgt.NEGOCIO/ItemEdit';
import DeleteItemForm from '../components/sgt.negocio/ItemDelete';
import '../styles/components/sgt.negocio/ItemHeader.css';

function NEGOCIO({ permissions = { escritura: false, eliminar: false } }) {

  const { escritura, eliminar } = permissions;
  const [items, setItems] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Añade este estado

  const createItem = (data) => {
    const newItem = { ...data, id: Math.max(0, ...items.map(i => i.id)) + 1 };
    setItems((prevItems) => [...prevItems, newItem]); // Agregar el nuevo item a la lista de items
  };

  const updateItem = (data) => {
    setItems(items.map(item => item.id === data.id ? data : item));
  };

  const deleteItem = (data) => {
    setItems(items.filter(item => item.id !== data.id));
  };

  const refreshList = () => {
    setRefreshTrigger(prev => prev + 1); // Esto hará que ItemList se actualice
  };

  const handleCreateClick = () => {
    setEditingItem(null);
    setIsDeleting(false);
    setIsModalOpen(true);
  };

  const handleEditClick = (item) => {
    setEditingItem(item);
    setIsDeleting(false);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (item) => {
    setEditingItem(item);
    setIsDeleting(true);
    setIsModalOpen(true);
  };

  const handleSubmit = (data) => {
    if (isDeleting) {
      deleteItem(data);
    } else if (editingItem) {
      updateItem(data);
    } else {
      createItem(data);
    }
    setIsModalOpen(false);
    setEditingItem(null);
    setIsDeleting(false);
    refreshList(); // Añade esta línea para actualizar después de guardar
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setIsDeleting(false);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="title">📦 sgt.Negocio</h1>
        {escritura && (
          <button className="create-button" onClick={handleCreateClick}>
            <Plus size={18} />
            <span>Create New</span>
          </button>
        )}
      </header>

      <ItemList
        key={refreshTrigger}
        onEdit={escritura ? handleEditClick : undefined} // Cambiado de null a undefined
        onDelete={eliminar ? handleDeleteClick : undefined} // Cambiado de null a undefined
      />

      {/* Modal para crear, editar o eliminar un ítem */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>
                {isDeleting
                  ? '🗑️ Delete Item'
                  : editingItem
                  ? '✏️ Edit Item'
                  : '🆕 Create New Item'}
              </h2>
              <button className="close-button" onClick={handleCancel}>×</button>
            </div>
            {isDeleting ? (
              <DeleteItemForm
                initialData={editingItem}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                onRefresh={refreshList}
              />
            ) : editingItem ? (
              <EditItemForm
                initialData={editingItem}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                onRefresh={refreshList}
              />
            ) : (
              <ItemForm
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                onRefresh={refreshList}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NEGOCIO;