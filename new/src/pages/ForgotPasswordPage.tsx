import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowRight, FiArrowLeft, FiCheck } from 'react-icons/fi';
import api from '../api/api';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { toast.error('Ingresa tu email'); return; }
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Revisa tu bandeja de entrada');
    } catch {
      toast.error('Error al enviar el email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-page--centered">
      <div className="auth-page__form-side auth-page__form-side--full">
        <div className="auth-page__form-wrapper">
          <Link to="/" className="auth-page__logo">BLOOM<span>.</span></Link>

          {sent ? (
            <div className="auth-page__success">
              <div className="auth-page__success-icon"><FiCheck size={40} /></div>
              <h1>¡Email Enviado!</h1>
              <p>Si el correo existe en nuestro sistema, recibirás un enlace de recuperación en tu bandeja de entrada.</p>
              <Link to="/login" className="btn btn--primary btn--lg">
                <FiArrowLeft size={18} /> Volver al Login
              </Link>
            </div>
          ) : (
            <>
              <div className="auth-page__header">
                <h1>¿Olvidaste tu contraseña?</h1>
                <p>No te preocupes, te enviaremos un enlace para restablecerla.</p>
              </div>
              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="auth-form__field">
                  <label htmlFor="forgot-email">Email</label>
                  <div className="auth-form__input-wrapper">
                    <FiMail size={18} />
                    <input id="forgot-email" type="email" placeholder="tu@email.com" value={email} onChange={e => setEmail(e.target.value)} />
                  </div>
                </div>
                <button type="submit" className="btn btn--primary btn--full btn--lg" disabled={loading}>
                  {loading ? 'Enviando...' : 'Enviar Enlace'} {!loading && <FiArrowRight size={18} />}
                </button>
              </form>
              <p className="auth-page__switch">
                <Link to="/login"><FiArrowLeft size={14} /> Volver al Login</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
