import { useState } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheck } from 'react-icons/fi';
import api from '../api/api';
import toast from 'react-hot-toast';

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) { toast.error('Complete todos los campos'); return; }
    if (password !== confirmPassword) { toast.error('Las contraseñas no coinciden'); return; }
    if (password.length < 8) { toast.error('La contraseña debe tener al menos 8 caracteres'); return; }
    if (!token) { toast.error('Token de recuperación no válido'); return; }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, newPassword: password });
      setSuccess(true);
      toast.success('¡Contraseña restablecida!');
      setTimeout(() => navigate('/login'), 3000);
    } catch {
      toast.error('Error al restablecer la contraseña. El enlace puede haber expirado.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-luxe fade-in">
      <div className="auth-luxe__image">
        <div className="auth-luxe__image-overlay">
          <div className="auth-luxe__image-content">
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '3.5rem', marginBottom: '24px' }}>Seguridad de Cuenta</h2>
            <p style={{ fontSize: '1.1rem', opacity: 0.9, lineHeight: 1.8 }}>Restablezca su acceso de forma segura para volver a su espacio personal.</p>
          </div>
        </div>
      </div>

      <div className="auth-luxe__form-side">
        <div className="auth-luxe__form-container">
          <header className="auth-luxe__header">
            <Link to="/" className="auth-luxe__logo">STUDIO LUXE<span>.</span></Link>
            <h1 className="auth-luxe__title">Nueva Contraseña</h1>
            <p className="auth-luxe__subtitle">Establezca sus nuevas credenciales de acceso privadas.</p>
          </header>

          {success ? (
            <div className="auth-luxe__success-view fade-in">
              <div className="success-icon" style={{ marginBottom: '32px' }}><FiCheck size={32} /></div>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', marginBottom: '16px' }}>Actualización Exitosa</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: 1.6 }}>Sus nuevas credenciales han sido registradas. Redirigiendo al inicio de sesión...</p>
            </div>
          ) : (
            <form className="auth-luxe__form" onSubmit={handleSubmit}>
              <div className="luxe-input">
                <label className="luxe-input__label">Nueva Contraseña</label>
                <div className="luxe-input__wrapper">
                  <FiLock className="luxe-input__icon" />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Mínimo 8 caracteres" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required 
                  />
                  <button type="button" className="luxe-input__toggle" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              <div className="luxe-input" style={{ marginTop: '24px' }}>
                <label className="luxe-input__label">Confirmar Contraseña</label>
                <div className="luxe-input__wrapper">
                  <FiLock className="luxe-input__icon" />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Repita su contraseña" 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                    required 
                  />
                </div>
              </div>

              <button type="submit" className="btn btn--primary btn--full" disabled={loading} style={{ marginTop: '40px' }}>
                {loading ? 'Guardando...' : 'Restablecer Acceso'} {!loading && <FiArrowRight size={18} />}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
