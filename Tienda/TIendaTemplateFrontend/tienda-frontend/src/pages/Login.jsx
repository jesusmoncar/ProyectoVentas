import { useState } from 'react';
import api from '../api/axios';
import { ShoppingBag, Mail, Lock, Loader2, Eye, EyeOff, ArrowRight, AlertCircle, Sparkles, TrendingUp, Package } from 'lucide-react';
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            window.location.href = '/';
        } catch (err) {
            setError('Credenciales incorrectas. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        { icon: TrendingUp, label: 'Ventas', value: '+24%' },
        { icon: Package, label: 'Productos', value: '1.2K' },
        { icon: ShoppingBag, label: 'Pedidos hoy', value: '38' },
    ];

    return (
        <div className="login-page">

            {/* ── Panel izquierdo (branding) ── */}
            <div className="login-brand-panel">
                <div className="login-brand-panel__bg">
                    <div className="login-brand-panel__orb login-brand-panel__orb--top" />
                    <div className="login-brand-panel__orb login-brand-panel__orb--bottom" />
                    <div className="login-brand-panel__orb login-brand-panel__orb--center" />
                    <div className="login-brand-panel__dots" />
                </div>

                <div className="login-brand-panel__logo">
                    <div className="login-brand-panel__logo-icon">
                        <ShoppingBag color="white" size={22} strokeWidth={1.8} />
                    </div>
                    <span className="login-brand-panel__logo-name">MiTienda</span>
                </div>

                <div className="login-brand-panel__content">
                    <div className="login-brand-panel__badge">
                        <Sparkles size={13} color="#a5b4fc" />
                        <span>Panel de Control</span>
                    </div>
                    <h2 className="login-brand-panel__headline">
                        Gestiona tu<br />
                        <span className="login-brand-panel__headline-gradient">negocio online</span>
                    </h2>
                    <p className="login-brand-panel__desc">
                        Todo lo que necesitas para administrar tu tienda, pedidos y productos en un solo lugar.
                    </p>
                    <div className="login-brand-panel__stats">
                        {stats.map(({ icon: Icon, label, value }) => (
                            <div key={label} className="login-stat-card">
                                <Icon size={16} color="#818cf8" />
                                <p className="login-stat-card__value">{value}</p>
                                <p className="login-stat-card__label">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="login-brand-panel__footer">© 2026 MiTienda. Todos los derechos reservados.</p>
            </div>

            {/* ── Panel derecho (formulario) ── */}
            <div className="login-form-panel">

                <div className="login-mobile-logo">
                    <div className="login-mobile-logo__icon">
                        <ShoppingBag color="white" size={22} strokeWidth={1.8} />
                    </div>
                    <span className="login-mobile-logo__name">MiTienda</span>
                </div>

                <div className="login-box">

                    <div className="login-heading">
                        <h1>Bienvenido de nuevo</h1>
                        <p>Inicia sesión en tu cuenta</p>
                    </div>

                    {error && (
                        <div className="login-error">
                            <AlertCircle size={17} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="login-form">

                        <div className="login-field">
                            <label className="login-label">
                                <Mail size={15} />
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                placeholder="ejemplo@correo.com"
                                value={email}
                                className="login-input"
                                onChange={e => { setEmail(e.target.value); setError(''); }}
                            />
                        </div>

                        <div className="login-field">
                            <label className="login-label">
                                <Lock size={15} />
                                Contraseña
                            </label>
                            <div className="login-password-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Mínimo 8 caracteres"
                                    value={password}
                                    className="login-input login-input--password"
                                    onChange={e => { setPassword(e.target.value); setError(''); }}
                                />
                                <button
                                    type="button"
                                    className="login-toggle-password"
                                    onClick={() => setShowPassword(v => !v)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" disabled={loading} className="login-submit-btn">
                            {loading
                                ? <Loader2 className="animate-spin" size={21} />
                                : <>Iniciar sesión <ArrowRight size={19} /></>
                            }
                        </button>

                    </form>

                    <div className="login-divider">
                        <div className="login-divider__line" />
                        <span className="login-divider__text">o continúa con</span>
                        <div className="login-divider__line" />
                    </div>

                    <button type="button" className="login-google-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continuar con Google
                    </button>

                    <div className="login-footer-links">
                        <p>
                            ¿No tienes cuenta?{' '}
                            <a href="/register">Regístrate gratis</a>
                        </p>
                        <p>
                            <a href="/forgot-password">¿Olvidaste tu contraseña?</a>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
