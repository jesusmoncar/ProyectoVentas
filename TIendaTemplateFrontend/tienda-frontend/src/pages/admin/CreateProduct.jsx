import { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, ArrowLeft, Loader2, CheckCircle, Package, ImagePlus, X } from 'lucide-react';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './CreateProduct.css';

const MAX_IMAGES = 5;
const emptyVariant = () => ({ color: '', colorName: '', size: '', stock: '', priceOverride: '' });

const COLOR_NAMES = [
  ['#000000','Negro'],['#FFFFFF','Blanco'],['#808080','Gris'],['#C0C0C0','Plata'],['#D3D3D3','Gris claro'],
  ['#A9A9A9','Gris oscuro'],['#FF0000','Rojo'],['#8B0000','Rojo oscuro'],['#FF4500','Rojo naranja'],
  ['#FF6347','Tomate'],['#FF7F50','Coral'],['#FFA07A','Salmón'],['#FFA500','Naranja'],['#FF8C00','Naranja oscuro'],
  ['#FFD700','Dorado'],['#FFFF00','Amarillo'],['#9ACD32','Verde amarillo'],['#008000','Verde'],
  ['#006400','Verde oscuro'],['#90EE90','Verde claro'],['#00FF7F','Verde primavera'],['#20B2AA','Verde mar'],
  ['#008080','Verde azulado'],['#00CED1','Turquesa'],['#00FFFF','Cian'],['#87CEEB','Azul cielo'],
  ['#4169E1','Azul real'],['#0000FF','Azul'],['#000080','Azul marino'],['#191970','Azul medianoche'],
  ['#8A2BE2','Azul violeta'],['#800080','Morado'],['#EE82EE','Violeta'],['#FF00FF','Magenta'],
  ['#FF69B4','Rosa fuerte'],['#FFB6C1','Rosa claro'],['#FFC0CB','Rosa'],['#FF1493','Rosa intenso'],
  ['#A52A2A','Marrón'],['#8B4513','Marrón silla'],['#D2691E','Chocolate'],['#DEB887','Beis madera'],
  ['#F5DEB3','Trigo'],['#F5F5DC','Beis'],['#FFFACD','Crema'],['#F0E68C','Caqui claro'],
  ['#BDB76B','Caqui'],['#556B2F','Verde oliva'],['#808000','Oliva'],['#2F4F4F','Pizarra verde'],
];

function hexToColorName(hex) {
  if (!hex || hex.length < 7) return '';
  const h = hex.replace('#','');
  const r = parseInt(h.slice(0,2),16), g = parseInt(h.slice(2,4),16), b = parseInt(h.slice(4,6),16);
  let minDist = Infinity, name = '';
  for (const [ch, n] of COLOR_NAMES) {
    const ch2 = ch.replace('#','');
    const cr = parseInt(ch2.slice(0,2),16), cg = parseInt(ch2.slice(2,4),16), cb = parseInt(ch2.slice(4,6),16);
    const d = Math.sqrt((r-cr)**2 + (g-cg)**2 + (b-cb)**2);
    if (d < minDist) { minDist = d; name = n; }
  }
  return name;
}

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

    const duplicateVariant = (index) => {
        const toDup = variants[index];
        setVariants(prev => {
            const newArray = [...prev];
            newArray.splice(index + 1, 0, { ...toDup, size: '', stock: '' });
            return newArray;
        });
    };

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
                colorName: v.colorName || null,
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
                                            <label className="cp-label">Color (Hex)</label>
                                            <div className="cp-color-picker">
                                                <input
                                                    type="color"
                                                    className="cp-color-input"
                                                    title="Elegir color"
                                                    value={v.color || '#000000'}
                                                    onChange={e => {
                                                        const hex = e.target.value;
                                                        setVariants(prev => prev.map((vv, vi) =>
                                                            vi === i ? { ...vv, color: hex, colorName: hexToColorName(hex) } : vv
                                                        ));
                                                    }}
                                                />
                                                <input
                                                    type="text"
                                                    className="cp-input cp-input--hex"
                                                    placeholder="#000000"
                                                    value={v.color}
                                                    onChange={e => updateVariant(i, 'color', e.target.value)}
                                                    maxLength={7}
                                                />
                                            </div>
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
