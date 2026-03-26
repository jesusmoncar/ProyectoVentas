import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiImage, FiSearch, FiPackage, FiArrowLeft } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api, { getImageUrl } from '../api/api';
import type { Product } from '../types';
import toast from 'react-hot-toast';

interface ProductForm {
  name: string;
  description: string;
  basePrice: string;
  variants: { color: string; size: string; stock: string; priceOverride: string }[];
}

const emptyForm: ProductForm = {
  name: '', description: '', basePrice: '',
  variants: [{ color: '', size: '', stock: '', priceOverride: '' }]
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; name: string } | null>(null);

  const fetchProducts = () => {
    api.get<Product[]>('/products')
      .then(res => setProducts(res.data))
      .catch(() => toast.error('Error al cargar productos'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProducts(); }, []);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const openCreate = () => {
    setForm(emptyForm); setEditingId(null); setShowForm(true);
  };

  const openEdit = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description || '',
      basePrice: String(product.basePrice),
      variants: product.variants.length > 0
        ? product.variants.map(v => ({
            color: v.color || '', size: v.size || '',
            stock: String(v.stock), priceOverride: v.priceOverride ? String(v.priceOverride) : ''
          }))
        : [{ color: '', size: '', stock: '', priceOverride: '' }]
    });
    setEditingId(product.id);
    setShowForm(true);
  };

  const addVariant = () => {
    setForm(f => ({ ...f, variants: [...f.variants, { color: '', size: '', stock: '', priceOverride: '' }] }));
  };

  const removeVariant = (idx: number) => {
    setForm(f => ({ ...f, variants: f.variants.filter((_, i) => i !== idx) }));
  };

  const updateVariant = (idx: number, field: string, value: string) => {
    setForm(f => ({
      ...f,
      variants: f.variants.map((v, i) => i === idx ? { ...v, [field]: value } : v)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.basePrice) { toast.error('Nombre y precio son obligatorios'); return; }

    const payload = {
      name: form.name,
      description: form.description,
      basePrice: parseFloat(form.basePrice),
      variants: form.variants
        .filter(v => v.size || v.color)
        .map(v => ({
          color: v.color, size: v.size,
          stock: parseInt(v.stock) || 0,
          priceOverride: v.priceOverride ? parseFloat(v.priceOverride) : null
        }))
    };

    setSubmitting(true);
    try {
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        toast.success('Producto actualizado');
      } else {
        await api.post('/products', payload);
        toast.success('Producto creado');
      }
      setShowForm(false);
      fetchProducts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al guardar');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await api.delete(`/products/${deleteConfirm.id}`);
      toast.success('Producto eliminado');
      setProducts(prev => prev.filter(p => p.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    } catch {
      toast.error('Error al eliminar');
    }
  };

  const handleImageUpload = async (productId: number, files: FileList) => {
    const formData = new FormData();
    Array.from(files).forEach(f => formData.append('files', f));
    try {
      await api.post(`/products/${productId}/images`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Imágenes subidas');
      fetchProducts();
    } catch {
      toast.error('Error al subir imágenes');
    }
  };

  return (
    <div className="admin">
      <div className="admin__header">
        <div className="admin__header-left">
          <Link to="/" className="admin__back"><FiArrowLeft size={18} /> Volver a la tienda</Link>
          <h1><FiPackage size={28} /> Gestión de Productos</h1>
        </div>
        <button className="btn btn--primary" onClick={openCreate}>
          <FiPlus size={18} /> Nuevo Producto
        </button>
      </div>

      {/* Search */}
      <div className="admin__toolbar">
        <div className="catalog__search">
          <FiSearch size={18} />
          <input placeholder="Buscar productos..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <span className="admin__count">{filtered.length} producto{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="admin__modal-overlay" onClick={() => setShowForm(false)}>
          <div className="admin__modal admin__modal--product" onClick={e => e.stopPropagation()}>
            <h2>{editingId ? 'Editar Producto' : 'Nuevo Producto'}</h2>
            <form className="admin__form" onSubmit={handleSubmit}>
              <div className="admin__form-group">
                <label className="admin__form-label">Nombre *</label>
                <input className="admin__form-input" placeholder="Nombre del producto" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div className="admin__form-group">
                <label className="admin__form-label">Descripción</label>
                <textarea
                  className="admin__form-input"
                  placeholder="Descripción del producto"
                  value={form.description}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  rows={3}
                />
              </div>
              <div className="admin__form-group">
                <label className="admin__form-label">Precio Base (€) *</label>
                <input className="admin__form-input" type="number" step="0.01" placeholder="29.99" value={form.basePrice} onChange={e => setForm(f => ({ ...f, basePrice: e.target.value }))} />
              </div>

              <div className="admin__variants-section">
                <div className="admin__variants-header">
                  <h3>Variantes</h3>
                  <button type="button" className="btn btn--ghost" onClick={addVariant}><FiPlus size={14} /> Añadir</button>
                </div>
                <div className="admin__variant-grid-header">
                  <span>Color</span>
                  <span>Talla</span>
                  <span>Stock</span>
                  <span>Precio €</span>
                  <span></span>
                </div>
                {form.variants.map((v, idx) => (
                  <div key={idx} className="admin__variant-row">
                    <div className="admin__variant-color-input">
                      <div className="admin__color-btn" style={{ backgroundColor: v.color || '#ffffff' }}>
                        <input 
                          type="color" 
                          value={v.color?.startsWith('#') ? v.color : '#ffffff'} 
                          onChange={e => updateVariant(idx, 'color', e.target.value)} 
                        />
                      </div>
                      <input 
                        placeholder="#HEX" 
                        value={v.color} 
                        onChange={e => updateVariant(idx, 'color', e.target.value)} 
                      />
                    </div>
                    <input placeholder="ej: M, L..." value={v.size} onChange={e => updateVariant(idx, 'size', e.target.value)} />
                    <input type="number" placeholder="0" value={v.stock} onChange={e => updateVariant(idx, 'stock', e.target.value)} />
                    <input type="number" step="0.01" placeholder="Override" value={v.priceOverride} onChange={e => updateVariant(idx, 'priceOverride', e.target.value)} />
                    {form.variants.length > 1 && (
                      <button type="button" className="admin__variant-remove" onClick={() => removeVariant(idx)} title="Eliminar variante"><FiTrash2 size={16} /></button>
                    )}
                  </div>
                ))}
              </div>

              <div className="admin__form-actions">
                <button type="button" className="admin__btn-cancel" onClick={() => setShowForm(false)}>Cancelar</button>
                <button type="submit" className="admin__btn-submit" disabled={submitting}>
                  {submitting ? 'Guardando...' : editingId ? 'Actualizar' : 'Crear Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Products Table */}
      {loading ? (
        <div className="loading-screen"><div className="loading-spinner" /><p>Cargando productos...</p></div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon">📦</div>
          <h3>No hay productos</h3>
          <p>Crea tu primer producto para comenzar</p>
          <button className="btn btn--primary" onClick={openCreate}><FiPlus size={18} /> Crear Producto</button>
        </div>
      ) : (
        <div className="admin__table-wrapper">
          <table className="admin__table">
            <thead>
              <tr>
                <th>Imagen</th>
                <th>Producto</th>
                <th>Precio</th>
                <th>Variantes</th>
                <th>Stock Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(product => {
                const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
                const imageUrl = getImageUrl(product.images?.[0], product.id);
                return (
                  <tr key={product.id}>
                    <td>
                      <div className="admin__product-image">
                        {imageUrl ? <img src={imageUrl} alt={product.name} /> : <FiPackage size={20} />}
                      </div>
                    </td>
                    <td>
                      <strong>{product.name}</strong>
                      <span className="admin__product-desc">{product.description?.substring(0, 60)}</span>
                    </td>
                    <td><strong>€{(product.basePrice || 0).toFixed(2)}</strong></td>
                    <td>{product.variants.length}</td>
                    <td>
                      <span className={`admin__stock ${totalStock <= 5 ? 'admin__stock--low' : ''}`}>
                        {totalStock}
                      </span>
                    </td>
                    <td>
                      <div className="admin__actions">
                        <button className="admin__action-btn" title="Editar" onClick={() => openEdit(product)}>
                          <FiEdit2 size={16} />
                        </button>
                        <label className="admin__action-btn" title="Subir imágenes">
                          <FiImage size={16} />
                          <input type="file" multiple accept="image/*" hidden
                            onChange={e => e.target.files && handleImageUpload(product.id, e.target.files)} />
                        </label>
                        <button className="admin__action-btn admin__action-btn--danger" title="Eliminar" onClick={() => setDeleteConfirm({ id: product.id, name: product.name })}>
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="admin__modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="admin__modal admin__modal--danger" onClick={e => e.stopPropagation()}>
            <div className="admin__modal-danger-icon"><FiTrash2 /></div>
            <h2>¿Eliminar Producto?</h2>
            <div className="admin__delete-confirm-text">
              ¿Estás seguro de que deseas eliminar este producto permanentemente? Esta acción no se puede deshacer.
              <strong>{deleteConfirm.name}</strong>
            </div>
            <div className="admin__form-actions">
              <button className="admin__btn-cancel" onClick={() => setDeleteConfirm(null)}>Cancelar</button>
              <button className="admin__btn-submit" style={{ background: '#FF5252' }} onClick={handleDelete}>
                Eliminar Permanentemente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
