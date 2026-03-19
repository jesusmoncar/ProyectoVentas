import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ArrowLeft, Loader2, CheckCircle } from 'lucide-react';
import api from '../../api/axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import '../admin/CreateProduct.css';

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
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [basePrice, setBasePrice] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isAdmin()) { window.location.href = '/'; return; }
        api.get(`/products/${id}`)
            .then(res => {
                setName(res.data.name ?? '');
                setDescription(res.data.description ?? '');
                setBasePrice(res.data.basePrice ?? '');
            })
            .catch(() => setError('No se pudo cargar el producto.'))
            .finally(() => setLoading(false));
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSaving(true);
        try {
            await api.put(`/products/${id}`, {
                name,
                description,
                basePrice: Number(basePrice),
            });
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message ?? 'Error al guardar los cambios.');
        } finally {
            setSaving(false);
        }
    };

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
                            <a href={`/admin/products/${id}/edit`} className="cp-btn cp-btn--secondary">
                                Seguir editando
                            </a>
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
                    </div>
                </div>

                {error && <div className="cp-error">{error}</div>}

                <form onSubmit={handleSubmit} className="cp-form">
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

                    <div className="cp-form-footer">
                        <a href="/admin/products" className="cp-btn cp-btn--ghost">Cancelar</a>
                        <button type="submit" disabled={saving} className="cp-btn cp-btn--primary">
                            {saving
                                ? <><Loader2 size={17} className="cp-spin" /> Guardando...</>
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
