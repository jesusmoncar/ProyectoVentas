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
    if (!email) { toast.error('Ingrese su correo electrónico'); return; }
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
      toast.success('Solicitud enviada. Revise su bandeja de entrada.');
    } catch {
      toast.error('No se pudo procesar la solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-luxe">
      <div className="auth-luxe__visual">
        <div className="img-placeholder" style={{ 
          background: 'url(https://images.unsplash.com/photo-1549439602-43ebca2327af?auto=format&fit=crop&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }} />
        <div className="auth-luxe__overlay">
          <div className="auth-luxe__quote">
            <blockquote style={{ fontSize: '2rem' }}>"Recupera tus llaves."</blockquote>
            <cite>Studio Luxe</cite>
          </div>
        </div>
      </div>

      <div className="auth-luxe__content">
        <div className="auth-luxe__form-container fade-in">
          <Link to="/" className="auth-luxe__logo">Studio Luxe</Link>
          
          <header className="auth-luxe__header">
            <h1>Acceso Restringido</h1>
            <p>Introduce tu correo electrónico para restaurar tu acceso.</p>
          </header>

          {sent ? (
            <div className="fade-in" style={{ textAlign: 'center', marginTop: '40px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', borderRadius: '50%', border: '1px solid var(--border-light)', margin: '0 auto 24px', color: 'var(--text-primary)' }}>
                <FiCheck size={24} />
              </div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', marginBottom: '16px' }}>Enlace Enviado</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: 1.6, fontSize: '0.9rem' }}>
                Si la dirección <strong>{email}</strong> está registrada, recibirá instrucciones en breve.
              </p>
              <Link to="/login" className="btn btn--outline" style={{ display: 'inline-flex', padding: '12px 32px' }}>
                <FiArrowLeft size={16} style={{ marginRight: '8px' }} /> Volver al Acceso
              </Link>
            </div>
          ) : (
            <form className="auth-luxe__form" onSubmit={handleSubmit}>
              <div className="luxe-input">
                <label>Email</label>
                <div className="luxe-input__wrapper">
                  <FiMail size={16} />
                  <input
                    type="email"
                    placeholder="ejemplar@estudio.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="auth-luxe__actions">
                <button type="submit" className="btn btn--primary" disabled={loading} style={{ width: '100%' }}>
                  {loading ? 'Tramitando...' : 'Enviar Enlace de Restauración'}
                  {!loading && <FiArrowRight size={18} />}
                </button>
              </div>

              <div className="auth-luxe__footer">
                <p>¿Recordaste tus datos? <Link to="/login">Volver</Link></p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
