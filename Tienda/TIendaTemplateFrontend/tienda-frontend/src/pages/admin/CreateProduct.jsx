import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, ArrowLeft, Loader2, CheckCircle, Package, ImagePlus, X } from 'lucide-react';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './CreateProduct.css';

const MAX_IMAGES = 5;
const emptyVariant = () => ({ color: '', size: '', stock: '', priceOverride: '' });

function isAdmin() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return false;
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        return payload?.roles?.includes('ROLE_ADMIN') ?? false;
    } catch {
        return false;
    }
}

export default function CreateProduct() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [variants, setVariants] = useState([emptyVariant()]);
    const [images, setImages] = useState([]);       // File[]
    const [previews, setPreviews] = useState([]);   // string[] (object URLs)
    const [loading, setLoading] = useState(false);
    const [loadingStep, setLoadingStep] = useState('');
    const [success, setSuccess] = useState(null);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!isAdmin()) window.location.href = '/';
    }, []);

    // Limpiar object URLs al desmontar
    useEffect(() => {
        return () => previews.forEach(url => URL.revokeObjectURL(url));
    }, [previews]);

    const handleImageSelect = (e) => {
        const files = Array.from(e.target.files);
        const remaining = MAX_IMAGES - images.length;
        const toAdd = files.slice(0, remaining);
        setImages(prev => [...prev, ...toAdd]);
        setPreviews(prev => [...prev, ...toAdd.map(f => URL.createObjectURL(f))]);
        e.target.value = '';
    };

    const removeImage = (index) => {
        URL.revokeObjectURL(previews[index]);
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const updateVariant = (index, field, value) =>
        setVariants(prev => prev.map((v, i) => i === index ? { ...v, [field]: value } : v));

    const addVariant = () => setVariants(prev => [...prev, emptyVariant()]);

    const removeVariant = (index) => {
        if (variants.length === 1) return;
        setVariants(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const cleanVariants = variants
            .filter(v => v.color || v.size || v.stock)
            .map(v => ({
                color: v.color || null,
                size: v.size || null,
                stock: v.stock !== '' ? Number(v.stock) : 0,
                priceOverride: v.priceOverride !== '' ? Number(v.priceOverride) : null,
            }));

        try {
            setLoadingStep('Creando producto...');
            const res = await api.post('/products', {
                name,
                description,
                basePrice: Number(basePrice),
                variants: cleanVariants,
            });

            const product = res.data;

            if (images.length > 0) {
                setLoadingStep('Subiendo imágenes...');
                const formData = new FormData();
                images.forEach(file => formData.append('files', file));
                const imgRes = await api.post(`/products/${product.id}/images`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
                setSuccess(imgRes.data);
            } else {
                setSuccess(product);
            }
        } catch (err) {
            setError(err.response?.data?.message ?? 'Error al crear el producto.');
        } finally {
            setLoading(false);
            setLoadingStep('');
        }
    };

    const handleReset = () => {
        previews.forEach(url => URL.revokeObjectURL(url));
        setName(''); setDescription(''); setBasePrice('');
        setVariants([emptyVariant()]);
        setImages([]); setPreviews([]);
        setSuccess(null); setError('');
    };

    if (success) {
        return (
            <div className="cp-layout">
                <Navbar />
                <main className="cp-main">
                    <div className="cp-success">
                        <CheckCircle size={52} className="cp-success__icon" />
                        <h2>Producto creado</h2>
                        <p>
                            <strong>{success.name}</strong> guardado con ID #{success.id}
                            {success.images?.length > 0 && ` · ${success.images.length} imagen${success.images.length !== 1 ? 'es' : ''}`}.
                        </p>
                        <div className="cp-success__actions">
                            <button className="cp-btn cp-btn--secondary" onClick={handleReset}>
                                <Plus size={16} /> Crear otro
                            </button>
                            <a href="/" className="cp-btn cp-btn--primary">
                                <Package size={16} /> Ver todos los productos
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
                        <h1 className="cp-title">Nuevo producto</h1>
                        <p className="cp-subtitle">Rellena los datos del producto y sus variantes.</p>
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

                    {/* Imágenes */}
                    <section className="cp-section">
                        <div className="cp-section__header">
                            <div>
                                <h2 className="cp-section__title">Imágenes</h2>
                                <p className="cp-section__desc">Máximo {MAX_IMAGES} imágenes por producto.</p>
                            </div>
                            <span className="cp-img-counter">{images.length} / {MAX_IMAGES}</span>
                        </div>

                        <div className="cp-img-grid">
                            {previews.map((url, i) => (
                                <div key={i} className="cp-img-thumb">
                                    <img src={url} alt={`preview-${i}`} />
                                    <button type="button" className="cp-img-thumb__remove" onClick={() => removeImage(i)}>
                                        <X size={13} />
                                    </button>
                                </div>
                            ))}

                            {images.length < MAX_IMAGES && (
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
                            {variants.map((v, i) => (
                                <div key={i} className="cp-variant-row">
                                    <span className="cp-variant-row__num">{i + 1}</span>
                                    <div className="cp-variant-fields">
                                        <div className="cp-field">
                                            <label className="cp-label">Color</label>
                                            <input type="text" className="cp-input" placeholder="Rojo"
                                                value={v.color} onChange={e => updateVariant(i, 'color', e.target.value)} />
                                        </div>
                                        <div className="cp-field">
                                            <label className="cp-label">Talla</label>
                                            <input type="text" className="cp-input" placeholder="M"
                                                value={v.size} onChange={e => updateVariant(i, 'size', e.target.value)} />
                                        </div>
                                        <div className="cp-field">
                                            <label className="cp-label">Stock</label>
                                            <input type="number" className="cp-input" placeholder="0"
                                                value={v.stock} onChange={e => updateVariant(i, 'stock', e.target.value)} min="0" />
                                        </div>
                                        <div className="cp-field">
                                            <label className="cp-label">Precio especial (€)</label>
                                            <input type="number" className="cp-input" placeholder="—"
                                                value={v.priceOverride} onChange={e => updateVariant(i, 'priceOverride', e.target.value)}
                                                min="0" step="0.01" />
                                        </div>
                                    </div>
                                    <button type="button" className="cp-variant-row__remove"
                                        onClick={() => removeVariant(i)} disabled={variants.length === 1}>
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    <div className="cp-form-footer">
                        <a href="/admin/products" className="cp-btn cp-btn--ghost">Cancelar</a>
                        <button type="submit" disabled={loading} className="cp-btn cp-btn--primary">
                            {loading
                                ? <><Loader2 size={17} className="cp-spin" /> {loadingStep}</>
                                : <><Plus size={17} /> Crear producto</>
                            }
                        </button>
                    </div>
                </form>
            </main>

            <Footer />
        </div>
    );
}
