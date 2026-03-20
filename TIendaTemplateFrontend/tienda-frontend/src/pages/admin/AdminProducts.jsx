import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Package, Loader2, AlertCircle } from 'lucide-react';
import api, { BACKEND_URL } from '../../api/axios';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import './AdminProducts.css';

function isAdmin() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return false;
        const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(atob(base64));
        return payload?.roles?.includes('ROLE_ADMIN') ?? false;
    } catch { return false; }
}

const GRADIENTS = [
    'linear-gradient(135deg,#6366f1,#8b5cf6)',
    'linear-gradient(135deg,#3b82f6,#06b6d4)',
    'linear-gradient(135deg,#f59e0b,#ef4444)',
    'linear-gradient(135deg,#10b981,#3b82f6)',
    'linear-gradient(135deg,#ec4899,#f43f5e)',
    'linear-gradient(135deg,#8b5cf6,#ec4899)',
];

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState(null);
    const [error, setError] = useState('');
    const [confirmId, setConfirmId] = useState(null);

    useEffect(() => {
        if (!isAdmin()) window.location.href = '/';
    }, []);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = () => {
        setLoading(true);
        api.get('/products')
            .then(res => setProducts(res.data))
            .catch(() => setError('No se pudieron cargar los productos.'))
            .finally(() => setLoading(false));
    };

    const handleDelete = async (id) => {
        setDeletingId(id);
        try {
            await api.delete(`/products/${id}`);
            setProducts(prev => prev.filter(p => p.id !== id));
        } catch {
            setError('Error al eliminar el producto.');
        } finally {
            setDeletingId(null);
            setConfirmId(null);
        }
    };

    return (
        <div className="ap-layout">
            <Navbar />
            <main className="ap-main">
                <div className="ap-header">
                    <div>
                        <h1 className="ap-title">Gestión de productos</h1>
                        <p className="ap-subtitle">{products.length} producto{products.length !== 1 ? 's' : ''} en total</p>
                    </div>
                    <a href="/admin/products/new" className="ap-btn ap-btn--primary">
                        <Plus size={17} /> Nuevo producto
                    </a>
                </div>

                {error && (
                    <div className="ap-error">
                        <AlertCircle size={16} /> {error}
                    </div>
                )}

                {loading ? (
                    <div className="ap-state">
                        <Loader2 size={32} className="ap-spin" />
                        <p>Cargando productos...</p>
                    </div>
                ) : products.length === 0 ? (
                    <div className="ap-state">
                        <Package size={40} color="#d1d5db" />
                        <p>No hay productos todavía.</p>
                        <a href="/admin/products/new" className="ap-btn ap-btn--primary">
                            <Plus size={15} /> Crear el primero
                        </a>
                    </div>
                ) : (
                    <div className="ap-table-wrapper">
                        <table className="ap-table">
                            <thead>
                                <tr>
                                    <th>Producto</th>
                                    <th>Precio base</th>
                                    <th>Variantes</th>
                                    <th>Stock total</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((p, i) => (
                                    <tr key={p.id}>
                                        <td>
                                            <div className="ap-product-cell">
                                                <div className="ap-product-thumb"
                                                    style={!p.images?.length ? { background: GRADIENTS[i % GRADIENTS.length] } : {}}>
                                                    {p.images?.length > 0
                                                        ? <img src={p.images[0].startsWith('http') ? p.images[0] : `${BACKEND_URL}${p.images[0]}`} alt={p.name} />
                                                        : <Package size={18} color="rgba(255,255,255,0.7)" />
                                                    }
                                                </div>
                                                <div>
                                                    <p className="ap-product-name">{p.name}</p>
                                                    {p.description && (
                                                        <p className="ap-product-desc">{p.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="ap-price">{p.basePrice?.toFixed(2)} €</td>
                                        <td className="ap-center">
                                            <span className="ap-badge">{p.variants?.length ?? 0}</span>
                                        </td>
                                        <td className="ap-center">
                                            <span className="ap-badge ap-badge--stock">
                                                {p.variants?.reduce((sum, v) => sum + (v.stock ?? 0), 0) ?? 0}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="ap-actions">
                                                <a href={`/admin/products/${p.id}/edit`} className="ap-action-btn ap-action-btn--edit" title="Editar">
                                                    <Pencil size={15} />
                                                </a>
                                                {confirmId === p.id ? (
                                                    <div className="ap-confirm">
                                                        <span>¿Eliminar?</span>
                                                        <button
                                                            className="ap-action-btn ap-action-btn--danger"
                                                            onClick={() => handleDelete(p.id)}
                                                            disabled={deletingId === p.id}
                                                        >
                                                            {deletingId === p.id ? <Loader2 size={14} className="ap-spin" /> : 'Sí'}
                                                        </button>
                                                        <button className="ap-action-btn ap-action-btn--cancel" onClick={() => setConfirmId(null)}>
                                                            No
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button className="ap-action-btn ap-action-btn--delete" title="Eliminar" onClick={() => setConfirmId(p.id)}>
                                                        <Trash2 size={15} />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </main>
            <Footer />
        </div>
    );
}
