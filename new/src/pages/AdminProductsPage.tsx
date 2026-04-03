import { useState, useEffect, useRef } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiImage, FiSearch, FiPackage, FiArrowLeft, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import api, { getImageUrl } from '../api/api';
import type { Product } from '../types';
import toast from 'react-hot-toast';

import { hexToColorName } from '../utils/colorUtils';

interface ProductForm {
  name: string;
  description: string;
  basePrice: string;
  discountPercent: string;
  variants: { color: string; colorName: string; size: string; stock: string; priceOverride: string }[];
}

const emptyForm: ProductForm = {
  name: '', description: '', basePrice: '', discountPercent: '0',
  variants: [{ color: '', colorName: '', size: '', stock: '', priceOverride: '' }]
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
  const [globalDiscountShow, setGlobalDiscountShow] = useState(false);
  const [globalDiscountValue, setGlobalDiscountValue] = useState('0');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const [pendingImages, setPendingImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [existingImages, setExistingImages] = useState<any[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedProducts = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const openCreate = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
    setPendingImages([]); setImagePreviews([]); setExistingImages([]);
  };

  const openEdit = (product: Product) => {
    setForm({
      name: product.name,
      description: product.description || '',
      basePrice: String(product.basePrice),
      discountPercent: String(product.discountPercent || 0),
      variants: product.variants.length > 0
        ? product.variants.map(v => ({
            color: v.color || '', colorName: v.colorName || '', size: v.size || '',
            stock: String(v.stock), priceOverride: v.priceOverride ? String(v.priceOverride) : ''
          }))
        : [{ color: '', colorName: '', size: '', stock: '', priceOverride: '' }]
    });
    setEditingId(product.id);
    setShowForm(true);
    setExistingImages(product.images || []); setPendingImages([]); setImagePreviews([]);
  };

  const addVariant = () => {
    setForm(f => ({ ...f, variants: [...f.variants, { color: '', colorName: '', size: '', stock: '', priceOverride: '' }] }));
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

  const handleImageFiles = (files: FileList | File[]) => {
    const arr = Array.from(files);
    setPendingImages(prev => [...prev, ...arr]);
    arr.forEach(f => {
      const reader = new FileReader();
      reader.onload = e => setImagePreviews(prev => [...prev, e.target?.result as string]);
      reader.readAsDataURL(f);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.basePrice) { toast.error('Nombre y precio son obligatorios'); return; }

    const payload = {
      name: form.name,
      description: form.description,
      basePrice: parseFloat(form.basePrice),
      discountPercent: parseInt(form.discountPercent) || 0,
      variants: form.variants
        .filter(v => v.size || v.color)
        .map(v => ({
          color: v.color, colorName: v.colorName || null, size: v.size,
          stock: parseInt(v.stock) || 0,
          priceOverride: v.priceOverride ? parseFloat(v.priceOverride) : null
        }))
    };

    setSubmitting(true);
    try {
      let productId: number;
      if (editingId) {
        await api.put(`/products/${editingId}`, payload);
        productId = editingId;
        toast.success('Producto actualizado');
      } else {
        const res = await api.post<{ id: number }>('/products', payload);
        productId = res.data.id;
        toast.success('Producto creado');
      }

      if (pendingImages.length > 0) {
        const fd = new FormData();
        pendingImages.forEach(f => fd.append('files', f));
        await api.post(`/products/${productId}/images`, fd, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      setShowForm(false);
      fetchProducts();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Error al guardar');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGlobalDiscount = async () => {
    try {
      await api.put(`/products/discount/global?percent=${globalDiscountValue}`);
      toast.success('Descuento global aplicado correctamente');
      setGlobalDiscountShow(false);
      fetchProducts();
    } catch {
      toast.error('Error al aplicar el descuento global');
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

  return (
    <div className="admin">
      <div className="admin__header">
        <div className="admin__header-left">
          <Link to="/" className="admin__back"><FiArrowLeft size={18} /> Volver a la tienda</Link>
          <h1><FiPackage size={28} /> Gestión de Productos</h1>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn--secondary" onClick={() => setGlobalDiscountShow(true)}>
            Descuento Global
          </button>
          <button className="btn btn--primary" onClick={openCreate}>
            <FiPlus size={18} /> Nuevo Producto
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="admin__toolbar">
        <div className="catalog__search">
          <FiSearch size={18} />
          <input placeholder="Buscar productos..." value={search} onChange={e => { setSearch(e.target.value); setCurrentPage(1); }} />
        </div>
        <span className="admin__count">{filtered.length} producto{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="admin__modal-overlay" onClick={() => setShowForm(false)}>
          <div className="admin__modal admin__modal--product" onClick={e => e.stopPropagation()}>

            {/* Modal header */}
            <div className="apf-header">
              <div className="apf-header__icon">
                <FiPackage size={22} />
              </div>
              <div>
                <h2 className="apf-header__title">{editingId ? 'Editar Producto' : 'Nuevo Producto'}</h2>
                <p className="apf-header__sub">{editingId ? 'Modifica los datos del producto' : 'Completa los datos para crear el producto'}</p>
              </div>
              <button className="apf-close" onClick={() => setShowForm(false)}><FiX size={20} /></button>
            </div>

            <form id="apf-form" className="apf-form" onSubmit={handleSubmit}>

              {/* Section: Info */}
              <div className="apf-section">
                <h3 className="apf-section__title"><FiPackage size={15} /> Información básica</h3>
                <div className="apf-field">
                  <label className="apf-label">Nombre *</label>
                  <input className="apf-input" placeholder="Nombre del producto" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div className="apf-field">
                  <label className="apf-label">Descripción</label>
                  <textarea className="apf-input apf-textarea" placeholder="Descripción del producto..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} />
                </div>
                <div className="apf-grid-2">
                  <div className="apf-field">
                    <label className="apf-label">Precio base (€) *</label>
                    <input className="apf-input" type="number" step="0.01" placeholder="29.99" value={form.basePrice} onChange={e => setForm(f => ({ ...f, basePrice: e.target.value }))} />
                  </div>
                  <div className="apf-field">
                    <label className="apf-label">Descuento (%)</label>
                    <input className="apf-input" type="number" min="0" max="100" placeholder="0" value={form.discountPercent} onChange={e => setForm(f => ({ ...f, discountPercent: e.target.value }))} />
                  </div>
                </div>
              </div>

              {/* Section: Images */}
              <div className="apf-section">
                <h3 className="apf-section__title"><FiImage size={15} /> Fotos del producto</h3>

                {/* Existing images */}
                {existingImages.length > 0 && (
                  <div className="apf-images-row">
                    {existingImages.map((img, i) => (
                      <div key={i} className="apf-thumb apf-thumb--existing">
                        <img src={getImageUrl(img, editingId ?? undefined)} alt="" />
                        <span className="apf-thumb__tag">Actual</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Drop zone */}
                <div
                  className={`apf-dropzone ${dragOver ? 'apf-dropzone--over' : ''}`}
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); handleImageFiles(e.dataTransfer.files); }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <FiImage size={28} />
                  <p className="apf-dropzone__text">Arrastra fotos aquí o <span>haz clic para seleccionar</span></p>
                  <p className="apf-dropzone__hint">PNG, JPG hasta 5MB</p>
                  <input ref={fileInputRef} type="file" multiple accept="image/*" hidden onChange={e => e.target.files && handleImageFiles(e.target.files)} />
                </div>

                {/* New image previews */}
                {imagePreviews.length > 0 && (
                  <div className="apf-images-row">
                    {imagePreviews.map((src, i) => (
                      <div key={i} className="apf-thumb apf-thumb--new">
                        <img src={src} alt="" />
                        <button type="button" className="apf-thumb__remove" onClick={() => {
                          setImagePreviews(prev => prev.filter((_, j) => j !== i));
                          setPendingImages(prev => prev.filter((_, j) => j !== i));
                        }}><FiX size={12} /></button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section: Variants */}
              <div className="apf-section">
                <div className="apf-section__header">
                  <h3 className="apf-section__title"><span>🎨</span> Variantes</h3>
                  <button type="button" className="apf-add-variant" onClick={addVariant}><FiPlus size={14} /> Añadir variante</button>
                </div>

                {form.variants.length === 0 ? (
                  <p className="apf-variants-empty">Sin variantes — el producto se vende sin opciones de color/talla.</p>
                ) : (
                  <div className="apf-variants">
                    {form.variants.map((v, idx) => (
                      <div key={idx} className="apf-variant-card">
                        <div className="apf-variant-card__num">{idx + 1}</div>
                        <div className="apf-variant-card__fields">
                          {/* Color row */}
                          <div className="apf-variant-color-row">
                            <div className="apf-color-swatch" style={{ backgroundColor: v.color || '#ffffff' }}>
                              <input type="color" value={v.color?.startsWith('#') ? v.color : '#ffffff'} onChange={e => {
                                const hex = e.target.value;
                                setForm(f => ({
                                  ...f,
                                  variants: f.variants.map((vv, i) =>
                                    i === idx ? { ...vv, color: hex, colorName: hexToColorName(hex) } : vv
                                  )
                                }));
                              }} title="Elegir color" />
                            </div>
                            <div className="apf-field apf-field--inline">
                              <label className="apf-label-sm">Hex</label>
                              <input className="apf-input apf-input--sm apf-input--mono" placeholder="#000000" value={v.color} onChange={e => updateVariant(idx, 'color', e.target.value)} />
                            </div>
                          </div>
                          {/* Size/Stock/Price row */}
                          <div className="apf-variant-attrs-row">
                            <div className="apf-field apf-field--inline">
                              <label className="apf-label-sm">Talla</label>
                              <input className="apf-input apf-input--sm" placeholder="M, L, XL..." value={v.size} onChange={e => updateVariant(idx, 'size', e.target.value)} />
                            </div>
                            <div className="apf-field apf-field--inline">
                              <label className="apf-label-sm">Stock</label>
                              <input className="apf-input apf-input--sm" type="number" placeholder="0" value={v.stock} onChange={e => updateVariant(idx, 'stock', e.target.value)} />
                            </div>
                            <div className="apf-field apf-field--inline">
                              <label className="apf-label-sm">Precio especial €</label>
                              <input className="apf-input apf-input--sm" type="number" step="0.01" placeholder="—" value={v.priceOverride} onChange={e => updateVariant(idx, 'priceOverride', e.target.value)} />
                            </div>
                          </div>
                        </div>
                        {form.variants.length > 1 && (
                          <button type="button" className="apf-variant-remove" onClick={() => removeVariant(idx)} title="Eliminar"><FiTrash2 size={15} /></button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </form>

            <div className="apf-actions">
              <button type="button" className="admin__btn-cancel" onClick={() => setShowForm(false)}>Cancelar</button>
              <button type="submit" form="apf-form" className="admin__btn-submit" disabled={submitting}>
                {submitting ? 'Guardando...' : editingId ? '✓ Guardar cambios' : '+ Crear Producto'}
              </button>
            </div>
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
                <th>Precio Base</th>
                <th>Descuento</th>
                <th>Variantes</th>
                <th>Stock Total</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map(product => {
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
                    <td>
                      <strong>€{(product.basePrice || 0).toFixed(2)}</strong>
                    </td>
                    <td>
                      {product.discountPercent && product.discountPercent > 0 ? (
                        <span className="product-card__badge product-card__badge--discount" style={{ position: 'relative', top: 0, left: 0 }}>
                          -{product.discountPercent}%
                        </span>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>-</span>
                      )}
                    </td>
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

          {totalPages > 1 && (
            <div className="admin__pagination">
              <button
                className="admin__pagination-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              >
                <FiChevronLeft size={18} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  className={`admin__pagination-btn ${currentPage === page ? 'admin__pagination-btn--active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}

              <button
                className="admin__pagination-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              >
                <FiChevronRight size={18} />
              </button>
            </div>
          )}
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

      {/* Global Discount Modal */}
      {globalDiscountShow && (
        <div className="admin__modal-overlay" onClick={() => setGlobalDiscountShow(false)}>
          <div className="admin__modal" onClick={e => e.stopPropagation()}>
            <h2>Aplicar Descuento Global</h2>
            <p style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>
              Esta acción aplicará el porcentaje de descuento indicado a <strong>TODOS</strong> los productos del catálogo.
            </p>
            <div className="admin__form-group">
              <label className="admin__form-label">Porcentaje de Descuento (%)</label>
              <input
                className="admin__form-input"
                type="number"
                min="0"
                max="100"
                value={globalDiscountValue}
                onChange={e => setGlobalDiscountValue(e.target.value)}
              />
            </div>
            <div className="admin__form-actions">
              <button className="admin__btn-cancel" onClick={() => setGlobalDiscountShow(false)}>Cancelar</button>
              <button className="admin__btn-submit" onClick={handleGlobalDiscount}>
                Aplicar a Todo el Catálogo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
