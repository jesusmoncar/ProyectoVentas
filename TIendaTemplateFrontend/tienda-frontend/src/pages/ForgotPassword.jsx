import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import {
  Mail, ArrowLeft, ArrowRight, Loader2, ShoppingBag,
  CheckCircle2, AlertCircle
} from 'lucide-react';
import './ForgotPassword.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSuccess(true);
    } catch (err) {
      setError('Ha ocurrido un error. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fp-page">

      {/* ── Panel izquierdo (branding) ── */}
      <div className="fp-brand-panel">
        <div className="fp-brand-panel__bg">
          <div className="fp-brand-panel__orb fp-brand-panel__orb--top" />
          <div className="fp-brand-panel__orb fp-brand-panel__orb--bottom" />
          <div className="fp-brand-panel__orb fp-brand-panel__orb--center" />
          <div className="fp-brand-panel__dots" />
        </div>

        <div className="fp-brand-panel__logo">
          <div className="fp-brand-panel__logo-icon">
            <ShoppingBag color="white" size={22} strokeWidth={1.8} />
          </div>
          <span className="fp-brand-panel__logo-name">MiTienda</span>
        </div>

        <div className="fp-brand-panel__content">
          <div className="fp-icon-circle">
            <Mail size={40} color="#a78bfa" strokeWidth={1.5} />
          </div>
          <h2 className="fp-brand-panel__headline">
            Recupera el <br />
            <span className="fp-brand-panel__headline-gradient">acceso a tu cuenta</span>
          </h2>
          <p className="fp-brand-panel__desc">
            Te enviaremos un enlace seguro a tu correo electrónico para que puedas restablecer tu contraseña en segundos.
          </p>

          <div className="fp-steps">
            {[
              { n: '1', text: 'Introduce tu email registrado' },
              { n: '2', text: 'Abre el enlace que recibirás' },
              { n: '3', text: 'Crea tu nueva contraseña' },
            ].map(({ n, text }) => (
              <div key={n} className="fp-step">
                <span className="fp-step__num">{n}</span>
                <span className="fp-step__text">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="fp-brand-panel__footer">© 2026 MiTienda. Todos los derechos reservados.</p>
      </div>

      {/* ── Panel derecho (formulario) ── */}
      <div className="fp-form-panel">

        <div className="fp-mobile-logo">
          <div className="fp-mobile-logo__icon">
            <ShoppingBag color="white" size={22} strokeWidth={1.8} />
          </div>
          <span className="fp-mobile-logo__name">MiTienda</span>
        </div>

        <div className="fp-box">

          <Link to="/login" className="fp-back-link">
            <ArrowLeft size={16} />
            Volver al inicio de sesión
          </Link>

          {success ? (
            /* ── Estado: éxito ── */
            <div className="fp-success-state">
              <div className="fp-success-icon">
                <CheckCircle2 size={44} color="#22c55e" strokeWidth={1.5} />
              </div>
              <h1>¡Correo enviado!</h1>
              <p>
                Hemos enviado un enlace de recuperación a <strong>{email}</strong>.
                Revisa tu bandeja de entrada y la carpeta de spam.
              </p>
              <div className="fp-success-note">
                El enlace expirará en <strong>30 minutos</strong>.
              </div>
              <button className="fp-submit-btn" onClick={() => { setSuccess(false); setEmail(''); }}>
                Enviar de nuevo
              </button>
            </div>
          ) : (
            /* ── Estado: formulario ── */
            <>
              <div className="fp-heading">
                <h1>¿Olvidaste tu contraseña?</h1>
                <p>Introduce tu email y te enviaremos instrucciones para restablecerla.</p>
              </div>

              {error && (
                <div className="fp-error">
                  <AlertCircle size={17} />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="fp-form">
                <div className="fp-field">
                  <label className="fp-label">
                    <Mail size={15} />
                    Correo electrónico
                  </label>
                  <input
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={email}
                    required
                    className="fp-input"
                    onChange={e => { setEmail(e.target.value); setError(''); }}
                  />
                </div>

                <button type="submit" disabled={loading || !email} className="fp-submit-btn">
                  {loading
                    ? <Loader2 className="animate-spin" size={21} />
                    : <> Enviar enlace <ArrowRight size={19} /> </>
                  }
                </button>
              </form>

              <p className="fp-footer-hint">
                ¿Recordaste tu contraseña?{' '}
                <Link to="/login">Inicia sesión</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
