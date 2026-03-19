import { useState } from 'react';
import api from '../api/axios';
import { ShoppingBag, User, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, AlertCircle, CheckCircle, Sparkles, Phone, MapPin } from 'lucide-react';
import './Register.css';

function getPasswordStrength(pwd) {
    if (!pwd) return { level: 0, label: '', key: '' };
    let score = 0;
    if (pwd.length >= 8)              score++;
    if (/[A-Z]/.test(pwd))            score++;
    if (/[0-9]/.test(pwd))            score++;
    if (/[^A-Za-z0-9]/.test(pwd))     score++;
    const map = [
        { level: 1, label: 'Muy débil', key: 'weak' },
        { level: 2, label: 'Regular',   key: 'fair' },
        { level: 3, label: 'Buena',     key: 'good' },
        { level: 4, label: 'Fuerte',    key: 'strong' },
    ];
    return map[score - 1] ?? { level: 0, label: '', key: '' };
}

export default function Register() {
    const [form, setForm] = useState({ nombre: '', apellido: '', email: '', telefono: '', direccion: '', password: '', confirmPassword: '' });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [terms, setTerms] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const strength = getPasswordStrength(form.password);

    const handleChange = (e) => {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password.length < 6)           return setError('La contraseña debe tener al menos 6 caracteres.');
        if (form.password !== form.confirmPassword) return setError('Las contraseñas no coinciden.');
        if (!terms)                              return setError('Debes aceptar los términos y condiciones.');

        setLoading(true);
        try {
            await api.post('/auth/register', {
                nombre:    form.nombre,
                apellido:  form.apellido,
                email:     form.email,
                password:  form.password,
                telefono:  form.telefono  || null,
                direccion: form.direccion || null,
            });
            setSuccess(true);
            setTimeout(() => { window.location.href = '/login'; }, 2000);
        } catch (err) {
            const status = err.response?.status;
            const msg    = err.response?.data?.message ?? err.response?.data;
            if (status === 400 && typeof msg === 'string') {
                setError(msg);
            } else if (status === 409 || (typeof msg === 'string' && msg.toLowerCase().includes('email'))) {
                setError('Ya existe una cuenta con ese correo electrónico.');
            } else {
                setError('Error al crear la cuenta. Inténtalo de nuevo.');
            }
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        'Crea tu cuenta en menos de 2 minutos',
        'Añade tus productos y categorías',
        'Empieza a recibir pedidos al instante',
    ];

    return (
        <div className="register-page">

            {/* ── Panel izquierdo (branding) ── */}
            <div className="register-brand-panel">
                <div className="register-brand-panel__bg">
                    <div className="register-brand-panel__orb register-brand-panel__orb--tl" />
                    <div className="register-brand-panel__orb register-brand-panel__orb--br" />
                    <div className="register-brand-panel__orb register-brand-panel__orb--mid" />
                    <div className="register-brand-panel__dots" />
                </div>

                <div className="register-brand-panel__logo">
                    <div className="register-brand-panel__logo-icon">
                        <ShoppingBag color="white" size={22} strokeWidth={1.8} />
                    </div>
                    <span className="register-brand-panel__logo-name">MiTienda</span>
                </div>

                <div className="register-brand-panel__content">
                    <div className="register-brand-panel__badge">
                        <Sparkles size={13} color="#6ee7b7" />
                        <span>Empieza gratis hoy</span>
                    </div>
                    <h2 className="register-brand-panel__headline">
                        Tu tienda online<br />
                        <span className="register-brand-panel__headline-gradient">en minutos</span>
                    </h2>
                    <p className="register-brand-panel__desc">
                        Únete a miles de comerciantes que ya gestionan su negocio con MiTienda.
                    </p>
                    <div className="register-steps">
                        {steps.map((text, i) => (
                            <div key={i} className="register-step">
                                <div className="register-step__num">{i + 1}</div>
                                <span className="register-step__text">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <p className="register-brand-panel__footer">© 2026 MiTienda. Todos los derechos reservados.</p>
            </div>

            {/* ── Panel derecho (formulario) ── */}
            <div className="register-form-panel">

                <div className="register-mobile-logo">
                    <div className="register-mobile-logo__icon">
                        <ShoppingBag color="white" size={22} strokeWidth={1.8} />
                    </div>
                    <span className="register-mobile-logo__name">MiTienda</span>
                </div>

                <div className="register-box">

                    <div className="register-heading">
                        <h1>Crear una cuenta</h1>
                        <p>Completa el formulario para comenzar</p>
                    </div>

                    {error && (
                        <div className="register-error">
                            <AlertCircle size={17} />
                            <span>{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="register-success">
                            <CheckCircle size={17} />
                            <span>¡Cuenta creada! Redirigiendo al login…</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="register-form">

                        {/* Nombre y apellido */}
                        <div className="register-form__row">
                            <div className="register-field">
                                <label className="register-label">
                                    <User size={15} />
                                    Nombre
                                </label>
                                <input
                                    type="text"
                                    name="nombre"
                                    placeholder="Juan"
                                    value={form.nombre}
                                    className="register-input"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="register-field">
                                <label className="register-label">
                                    <User size={15} />
                                    Apellido
                                </label>
                                <input
                                    type="text"
                                    name="apellido"
                                    placeholder="García"
                                    value={form.apellido}
                                    className="register-input"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="register-field">
                            <label className="register-label">
                                <Mail size={15} />
                                Correo electrónico
                            </label>
                            <input
                                type="email"
                                name="email"
                                placeholder="ejemplo@correo.com"
                                value={form.email}
                                className="register-input"
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Teléfono */}
                        <div className="register-field">
                            <label className="register-label">
                                <Phone size={15} />
                                Teléfono <span style={{ color: '#9ca3af', fontWeight: 400 }}>(opcional)</span>
                            </label>
                            <input
                                type="tel"
                                name="telefono"
                                placeholder="+34 600 000 000"
                                value={form.telefono}
                                className="register-input"
                                onChange={handleChange}
                            />
                        </div>

                        {/* Dirección */}
                        <div className="register-field">
                            <label className="register-label">
                                <MapPin size={15} />
                                Dirección <span style={{ color: '#9ca3af', fontWeight: 400 }}>(opcional)</span>
                            </label>
                            <input
                                type="text"
                                name="direccion"
                                placeholder="Calle Ejemplo 123, Ciudad"
                                value={form.direccion}
                                className="register-input"
                                onChange={handleChange}
                            />
                        </div>

                        {/* Contraseña */}
                        <div className="register-field">
                            <label className="register-label">
                                <Lock size={15} />
                                Contraseña
                            </label>
                            <div className="register-password-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Mínimo 6 caracteres"
                                    value={form.password}
                                    minLength={6}
                                    className="register-input register-input--password"
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="register-toggle-password"
                                    onClick={() => setShowPassword(v => !v)}
                                    tabIndex={-1}
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {form.password && (
                                <div className="register-strength">
                                    <div className="register-strength__bars">
                                        {[1, 2, 3, 4].map(n => (
                                            <div
                                                key={n}
                                                className={`register-strength__bar ${n <= strength.level ? `register-strength__bar--active-${strength.key}` : ''}`}
                                            />
                                        ))}
                                    </div>
                                    <span className={`register-strength__label register-strength__label--${strength.key}`}>
                                        {strength.label}
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Confirmar contraseña */}
                        <div className="register-field">
                            <label className="register-label">
                                <Lock size={15} />
                                Confirmar contraseña
                            </label>
                            <div className="register-password-wrapper">
                                <input
                                    type={showConfirm ? 'text' : 'password'}
                                    name="confirmPassword"
                                    placeholder="Repite tu contraseña"
                                    value={form.confirmPassword}
                                    className="register-input register-input--password"
                                    onChange={handleChange}
                                    required
                                />
                                <button
                                    type="button"
                                    className="register-toggle-password"
                                    onClick={() => setShowConfirm(v => !v)}
                                    tabIndex={-1}
                                >
                                    {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                        </div>

                        {/* Términos */}
                        <div className="register-terms">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={terms}
                                onChange={e => setTerms(e.target.checked)}
                            />
                            <label htmlFor="terms" className="register-terms__text">
                                Acepto los <a href="#">Términos de servicio</a> y la <a href="#">Política de privacidad</a>
                            </label>
                        </div>

                        <button type="submit" disabled={loading || success} className="register-submit-btn">
                            {loading
                                ? <Loader2 className="animate-spin" size={20} />
                                : <>Crear cuenta <ArrowRight size={18} /></>
                            }
                        </button>

                    </form>

                    <div className="register-divider">
                        <div className="register-divider__line" />
                        <span className="register-divider__text">o regístrate con</span>
                        <div className="register-divider__line" />
                    </div>

                    <button type="button" className="register-google-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Continuar con Google
                    </button>

                    <div className="register-footer-links">
                        <p>
                            ¿Ya tienes cuenta?{' '}
                            <a href="/login">Inicia sesión</a>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
