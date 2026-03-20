import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../api/axios';
import {
  Lock, Eye, EyeOff, ArrowRight, Loader2, ShoppingBag,
  CheckCircle2, AlertCircle, ShieldCheck
} from 'lucide-react';
import './ResetPassword.css';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  // Validaciones en tiempo real
  const minLength = newPassword.length >= 8;
  const passwordsMatch = newPassword === confirmPassword && confirmPassword.length > 0;
  const isFormValid = minLength && passwordsMatch && token;

  useEffect(() => {
    if (!token) {
      setError('El enlace de recuperación es inválido o ha expirado. Solicita uno nuevo.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid) return;
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, newPassword });
      setSuccess(true);
    } catch (err) {
      const msg = err.response?.data || '';
      if (msg.includes('expirado') || msg.includes('expired')) {
        setError('El enlace ha expirado. Por favor, solicita uno nuevo.');
      } else if (msg.includes('inválido') || msg.includes('invalid')) {
        setError('El enlace no es válido. Por favor, solicita uno nuevo.');
      } else {
        setError('Ha ocurrido un error. Por favor, inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rp-page">

      {/* ── Panel izquierdo (branding) ── */}
      <div className="rp-brand-panel">
        <div className="rp-brand-panel__bg">
          <div className="rp-brand-panel__orb rp-brand-panel__orb--top" />
          <div className="rp-brand-panel__orb rp-brand-panel__orb--bottom" />
          <div className="rp-brand-panel__orb rp-brand-panel__orb--center" />
          <div className="rp-brand-panel__dots" />
        </div>

        <div className="rp-brand-panel__logo">
          <div className="rp-brand-panel__logo-icon">
            <ShoppingBag color="white" size={22} strokeWidth={1.8} />
          </div>
          <span className="rp-brand-panel__logo-name">MiTienda</span>
        </div>

        <div className="rp-brand-panel__content">
          <div className="rp-icon-circle">
            <ShieldCheck size={40} color="#a78bfa" strokeWidth={1.5} />
          </div>
          <h2 className="rp-brand-panel__headline">
            Crea una nueva <br />
            <span className="rp-brand-panel__headline-gradient">contraseña segura</span>
          </h2>
          <p className="rp-brand-panel__desc">
            Elige una contraseña robusta para proteger tu cuenta. Usa al menos 8 caracteres combinando letras, números y símbolos.
          </p>

          <div className="rp-tips">
            <p className="rp-tips__title">Consejos para una buena contraseña:</p>
            {[
              '8 caracteres o más',
              'Mezcla mayúsculas y minúsculas',
              'Incluye números y símbolos',
              'Evita datos personales',
            ].map(tip => (
              <div key={tip} className="rp-tip">
                <span className="rp-tip__dot" />
                <span>{tip}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="rp-brand-panel__footer">© 2026 MiTienda. Todos los derechos reservados.</p>
      </div>

      {/* ── Panel derecho (formulario) ── */}
      <div className="rp-form-panel">

        <div className="rp-mobile-logo">
          <div className="rp-mobile-logo__icon">
            <ShoppingBag color="white" size={22} strokeWidth={1.8} />
          </div>
          <span className="rp-mobile-logo__name">MiTienda</span>
        </div>

        <div className="rp-box">

          {success ? (
            /* ── Estado: éxito ── */
            <div className="rp-success-state">
              <div className="rp-success-icon">
                <CheckCircle2 size={48} color="#22c55e" strokeWidth={1.5} />
              </div>
              <h1>¡Contraseña actualizada!</h1>
              <p>Tu contraseña se ha restablecido correctamente. Ya puedes iniciar sesión con tu nueva contraseña.</p>
              <Link to="/login" className="rp-submit-btn rp-submit-btn--link">
                Ir al inicio de sesión
                <ArrowRight size={19} />
              </Link>
            </div>
          ) : (
            /* ── Estado: formulario ── */
            <>
              <div className="rp-heading">
                <h1>Nueva contraseña</h1>
                <p>Introduce y confirma tu nueva contraseña para restablecer el acceso.</p>
              </div>

              {error && (
                <div className="rp-error">
                  <AlertCircle size={17} />
                  <span>{error}</span>
                  {!token && (
                    <Link to="/forgot-password" className="rp-error__link">
                      Solicitar nuevo enlace →
                    </Link>
                  )}
                </div>
              )}

              <form onSubmit={handleSubmit} className="rp-form">

                {/* Nueva contraseña */}
                <div className="rp-field">
                  <label className="rp-label">
                    <Lock size={15} />
                    Nueva contraseña
                  </label>
                  <div className="rp-password-wrapper">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Mínimo 8 caracteres"
                      value={newPassword}
                      required
                      disabled={!token}
                      className={`rp-input rp-input--password ${newPassword && (minLength ? 'rp-input--valid' : 'rp-input--invalid')}`}
                      onChange={e => { setNewPassword(e.target.value); setError(''); }}
                    />
                    <button
                      type="button"
                      className="rp-toggle-password"
                      onClick={() => setShowPassword(v => !v)}
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {/* Barra de fuerza */}
                  {newPassword && (
                    <div className="rp-strength-bar">
                      <div className={`rp-strength-bar__fill rp-strength-bar__fill--${
                        newPassword.length < 8 ? 'weak' :
                        newPassword.length < 12 ? 'medium' : 'strong'
                      }`} />
                      <span className="rp-strength-bar__label">
                        {newPassword.length < 8 ? 'Débil' : newPassword.length < 12 ? 'Media' : 'Fuerte'}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirmar contraseña */}
                <div className="rp-field">
                  <label className="rp-label">
                    <Lock size={15} />
                    Confirmar contraseña
                  </label>
                  <div className="rp-password-wrapper">
                    <input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Repite la nueva contraseña"
                      value={confirmPassword}
                      required
                      disabled={!token}
                      className={`rp-input rp-input--password ${confirmPassword && (passwordsMatch ? 'rp-input--valid' : 'rp-input--invalid')}`}
                      onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                    />
                    <button
                      type="button"
                      className="rp-toggle-password"
                      onClick={() => setShowConfirm(v => !v)}
                      tabIndex={-1}
                    >
                      {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                  {confirmPassword && !passwordsMatch && (
                    <p className="rp-field-hint rp-field-hint--error">Las contraseñas no coinciden</p>
                  )}
                  {confirmPassword && passwordsMatch && (
                    <p className="rp-field-hint rp-field-hint--ok">✓ Las contraseñas coinciden</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading || !isFormValid}
                  className="rp-submit-btn"
                >
                  {loading
                    ? <Loader2 className="animate-spin" size={21} />
                    : <> Restablecer contraseña <ArrowRight size={19} /> </>
                  }
                </button>
              </form>

              <p className="rp-footer-hint">
                <Link to="/forgot-password">← Solicitar un nuevo enlace</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
