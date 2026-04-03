import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, CheckCircle, Plus, Trash2, ImagePlus, X, Package } from 'lucide-react';
import api, { BACKEND_URL } from '../../api/axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import '../admin/CreateProduct.css';

const MAX_IMAGES = 5;
const emptyVariant = () => ({ color: '', colorName: '', size: '', stock: '', priceOverride: '' });

function isAdmin() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return false;
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        return payload?.roles?.includes('ROLE_ADMIN') ?? false;
    } catch { return false; }
}

export default function EditProduct() {
    const { id } = useParams();
    
    // Basicos
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [basePrice, setBasePrice] = useState('');
    
    // Variantes
    const [variants, setVariants] = useState([]);
    
    // Imagenes
    const [existingImages, setExistingImages] = useState([]); // URLs q ya están en servidor
    const [newImages, setNewImages] = useState([]);           // Archivos nuevos a subir
    const [newPreviews, setNewPreviews] = useState([]);       // URLs temporales de previsualizacion
    
    // UI states
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [savingStep, setSavingStep] = useState('');
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!isAdmin()) { window.location.href = '/'; return; }
        fetchProduct();
        // eslint-disable-next-line
    }, [id]);

    const fetchProduct = () => {
        setLoading(true);
        api.get(`/products/${id}`)
            .then(res => {
                const p = res.data;
                setName(p.name ?? '');
                setDescription(p.description ?? '');
                setBasePrice(p.basePrice ?? '');
                setVariants(p.variants?.length > 0 ? p.variants : [emptyVariant()]);
                setExistingImages(p.images ?? []);
            })
            .catch(() => setError('No se pudo cargar el producto.'))
            .finally(() => setLoading(false));
    };

    // Limpiar temporales
    useEffect(() => {
        return () => newPreviews.forEach(url => URL.revokeObjectURL(url));
    }, [newPreviews]);

    // MANEJO DE VARIANTES
    const updateVariant = (index, field, value) =>
        setVariants(prev => prev.map((v, i) => i === index ? { ...v, [field]: value } : v));

    const addVariant = () => setVariants(prev => [...prev, emptyVariant()]);

    const duplicateVariant = (index) => {
        const toDup = variants[index];
        setVariants(prev => {
            const newArray = [...prev];
            // Clear out SKU and ID when duplicating so it generates a new one on save
            newArray.splice(index + 1, 0, { ...toDup, size: '', stock: '', id: undefined, sku: undefined });
            return newArray;
        });
    };

    const removeVariant = (index) => {
        if (variants.length === 1) return;
        setVariants(prev => prev.filter((_, i) => i !== index));
    };

    // MANEJO DE IMÁGENES
    const totalImages = existingImages.length + newImages.length;

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        const remaining = MAX_IMAGES - totalImages;
        const toAdd = files.slice(0, remaining);
        
        setNewImages(prev => [...prev, ...toAdd]);
        setNewPreviews(prev => [...prev, ...toAdd.map(f => URL.createObjectURL(f))]);
        e.target.value = '';
    };

    const removeNewImage = (index) => {
        URL.revokeObjectURL(newPreviews[index]);
        setNewImages(prev => prev.filter((_, i) => i !== index));
        setNewPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const deleteExistingImage = async (url) => {
        if (!window.confirm('¿Seguro que quieres borrar esta imagen permanentemente?')) return;
        
        try {
            // El backend ahora acepta el filename al final. Extraemos el filename local.
            const filename = url.substring(url.lastIndexOf('/') + 1);
            setSavingStep('Borrando imagen...');
            setSaving(true);
            await api.delete(`/products/${id}/images/${filename}`);
            
            // Actualizar vista local
            setExistingImages(prev => prev.filter(img => img !== url));
        } catch (err) {
            setError(err.response?.data?.message || 'Error al borrar la imagen.');
        } finally {
            setSaving(false);
            setSavingStep('');
        }
    };

    // SUBMIT
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        setSavingStep('Guardando datos del producto...');

        const cleanVariants = variants
            .filter(v => v.color || v.size || v.stock)
            .map(v => ({
                color: v.color || null,
                colorName: v.colorName || null,
                size: v.size || null,
                stock: v.stock !== '' ? Number(v.stock) : 0,
                priceOverride: v.priceOverride !== '' ? Number(v.priceOverride) : null,
            }));

        try {
            // 1. Guardar info básica y variantes
            await api.put(`/products/${id}`, {
                name,
                description,
                basePrice: Number(basePrice),
                variants: cleanVariants
            });

            // 2. Subir si hay imágenes nuevas
            if (newImages.length > 0) {
                setSavingStep('Subiendo imágenes nuevas...');
                const formData = new FormData();
                newImages.forEach(file => formData.append('files', file));
                
                await api.post(`/products/${id}/images`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }

            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message ?? 'Error al guardar los cambios.');
        } finally {
            setSaving(false);
            setSavingStep('');
        }
    };

    // RENDERS
    if (loading) {
        return (
            <div className="cp-layout">
                <Navbar />
                <main className="cp-main">
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '80px 0' }}>
                        <Loader2 size={32} className="cp-spin" color="#6366f1" />
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (success) {
        return (
            <div className="cp-layout">
                <Navbar />
                <main className="cp-main">
                    <div className="cp-success">
                        <CheckCircle size={52} className="cp-success__icon" />
                        <h2>Cambios guardados</h2>
                        <p>El producto <strong>{name}</strong> se ha actualizado correctamente.</p>
                        <div className="cp-success__actions">
                            <button className="cp-btn cp-btn--secondary" onClick={() => { setSuccess(false); fetchProduct(); setNewImages([]); setNewPreviews([]); }}>
                                Seguir editando este producto
                            </button>
                            <a href="/admin/products" className="cp-btn cp-btn--primary">
                                Volver al listado
                            </a>
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="cp-layout">
            <Navbar />
            <main className="cp-main">
                <div className="cp-header">
                    <a href="/admin/products" className="cp-back">
                        <ArrowLeft size={17} /> Volver
                    </a>
                    <div>
                        <h1 className="cp-title">Editar producto</h1>
                        <p className="cp-subtitle">Modifica la información, variantes e imágenes.</p>
                    </div>
                </div>

                {error && <div className="cp-error">{error}</div>}

                <form onSubmit={handleSubmit} className="cp-form">
                    
                    {/* Información básica */}
                    <section className="cp-section">
                        <h2 className="cp-section__title">Información básica</h2>
                        <div className="cp-grid-2">
                            <div className="cp-field cp-field--full">
                                <label className="cp-label">Nombre <span>*</span></label>
                                <input type="text" className="cp-input" placeholder="Nombre del producto"
                                    value={name} onChange={e => setName(e.target.value)} required />
                            </div>
                            <div className="cp-field">
                                <label className="cp-label">Precio base (€) <span>*</span></label>
                                <input type="number" className="cp-input" placeholder="0.00"
                                    value={basePrice} onChange={e => setBasePrice(e.target.value)}
                                    min="0" step="0.01" required />
                            </div>
                            <div className="cp-field cp-field--full">
                                <label className="cp-label">Descripción</label>
                                <textarea className="cp-input cp-textarea" placeholder="Describe el producto..."
                                    value={description} onChange={e => setDescription(e.target.value)} rows={3} />
                            </div>
                        </div>
                    </section>

                    {/* Variantes */}
                    <section className="cp-section">
                        <div className="cp-section__header">
                            <div>
                                <h2 className="cp-section__title">Variantes</h2>
                                <p className="cp-section__desc">Tallas, colores y stock por variante.</p>
                            </div>
                            <button type="button" className="cp-btn cp-btn--secondary cp-btn--sm" onClick={addVariant}>
                                <Plus size={15} /> Añadir variante
                            </button>
                        </div>

                        <div className="cp-variants">
                            {variants.map((v, i) => {
                                // Soporte retroactivo para colores que no son HEX correctos en el selector visual
                                const isHex = v.color && /^#[0-9A-F]{6}$/i.test(v.color);
                                const pickerValue = isHex ? v.color : '#000000';

                                return (
                                    <div key={i} className="cp-variant-row">
                                        <span className="cp-variant-row__num">{i + 1}</span>
                                        <div className="cp-variant-fields">
                                            <div className="cp-field">
                                                <label className="cp-label">Color (Hex)</label>
                                                <div className="cp-color-picker">
                                                    <input 
                                                        type="color" 
                                                        className="cp-color-input" 
                                                        title="Elegir color"
                                                        value={pickerValue} 
                                                        onChange={e => updateVariant(i, 'color', e.target.value)} 
                                                    />
                                                    <input 
                                                        type="text" 
                                                        className="cp-input cp-input--hex" 
                                                        placeholder="#000000 o Nombre"
                                                        value={v.color || ''} 
                                                        onChange={e => updateVariant(i, 'color', e.target.value)} 
                                                    />
                                                </div>
                                            </div>
                                            <div className="cp-field">
                                                <label className="cp-label">Nombre color</label>
                                                <input type="text" className="cp-input" placeholder="ej: rojo"
                                                    value={v.colorName || ''} onChange={e => updateVariant(i, 'colorName', e.target.value)} />
                                            </div>
                                            <div className="cp-field">
                                                <label className="cp-label">Talla</label>
                                                <input type="text" className="cp-input" placeholder="M"
                                                    value={v.size || ''} onChange={e => updateVariant(i, 'size', e.target.value)} />
                                            </div>
                                            <div className="cp-field">
                                                <label className="cp-label">Stock</label>
                                                <input type="number" className="cp-input" placeholder="0"
                                                    value={v.stock ?? ''} onChange={e => updateVariant(i, 'stock', e.target.value)} min="0" />
                                            </div>
                                                <div className="cp-field">
                                                    <label className="cp-label">Precio especial (€)</label>
                                                    <input type="number" className="cp-input" placeholder="—"
                                                        value={v.priceOverride ?? ''} onChange={e => updateVariant(i, 'priceOverride', e.target.value)}
                                                        min="0" step="0.01" />
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', paddingBottom: '2px' }}>
                                                <button type="button" className="cp-variant-row__act cp-variant-row__act--dup"
                                                    onClick={() => duplicateVariant(i)} title="Duplicar color para añadir otra talla">
                                                    <Plus size={16} />
                                                </button>
                                                <button type="button" className="cp-variant-row__act cp-variant-row__act--del"
                                                    onClick={() => removeVariant(i)} disabled={variants.length === 1} title="Borrar variante">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                )
                            })}
                        </div>
                    </section>

                    {/* Imágenes */}
                    <section className="cp-section">
                        <div className="cp-section__header">
                            <div>
                                <h2 className="cp-section__title">Imágenes</h2>
                                <p className="cp-section__desc">Máximo {MAX_IMAGES} imágenes por producto en total.</p>
                            </div>
                            <span className="cp-img-counter">{totalImages} / {MAX_IMAGES}</span>
                        </div>

                        <div className="cp-img-grid">
                            {/* Imágenes que ya están en el servidor */}
                            {existingImages.map((url, i) => (
                                <div key={`exist-${i}`} className="cp-img-thumb" title="Imagen actual">
                                    <img src={url.startsWith('http') ? url : `${BACKEND_URL}${url}`} alt={`existing-${i}`} />
                                    <button 
                                        type="button" 
                                        className="cp-img-thumb__remove" 
                                        onClick={() => deleteExistingImage(url)}
                                        disabled={saving}
                                    >
                                        <X size={13} />
                                    </button>
                                </div>
                            ))}

                            {/* Imágenes nuevas (previsualizaciones) */}
                            {newPreviews.map((url, i) => (
                                <div key={`new-${i}`} className="cp-img-thumb" title="Nueva imagen sin guardar" style={{ borderStyle: 'dashed', borderColor: '#6366f1' }}>
                                    <img src={url} alt={`new-${i}`} />
                                    <button type="button" className="cp-img-thumb__remove" onClick={() => removeNewImage(i)}>
                                        <X size={13} />
                                    </button>
                                </div>
                            ))}

                            {totalImages < MAX_IMAGES && (
                                <button
                                    type="button"
                                    className="cp-img-add"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <ImagePlus size={22} />
                                    <span>Añadir</span>
                                </button>
                            )}
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            multiple
                            style={{ display: 'none' }}
                            onChange={handleImageSelect}
                        />
                    </section>

                    <div className="cp-form-footer">
                        <a href="/admin/products" className="cp-btn cp-btn--ghost">Cancelar</a>
                        <button type="submit" disabled={saving} className="cp-btn cp-btn--primary">
                            {saving
                                ? <><Loader2 size={17} className="cp-spin" /> {savingStep}</>
                                : 'Guardar cambios'
                            }
                        </button>
                    </div>
                </form>
            </main>
            <Footer />
        </div>
    );
}
