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
    if (!password || !confirmPassword) { toast.error('Completa todos los campos'); return; }
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
    <div className="auth-page auth-page--centered">
      <div className="auth-page__form-side auth-page__form-side--full">
        <div className="auth-page__form-wrapper">
          <Link to="/" className="auth-page__logo">BLOOM<span>.</span></Link>

          {success ? (
            <div className="auth-page__success">
              <div className="auth-page__success-icon"><FiCheck size={40} /></div>
              <h1>¡Listo!</h1>
              <p>Tu contraseña se ha restablecido correctamente. Redirigiendo al login...</p>
            </div>
          ) : (
            <>
              <div className="auth-page__header">
                <h1>Nueva Contraseña</h1>
                <p>Ingresa tu nueva contraseña</p>
              </div>
              <form className="auth-form" onSubmit={handleSubmit}>
                <div className="auth-form__field">
                  <label htmlFor="new-password">Nueva Contraseña</label>
                  <div className="auth-form__input-wrapper">
                    <FiLock size={18} />
                    <input id="new-password" type={showPassword ? 'text' : 'password'} placeholder="Mínimo 8 caracteres" value={password} onChange={e => setPassword(e.target.value)} />
                    <button type="button" className="auth-form__toggle" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                    </button>
                  </div>
                </div>
                <div className="auth-form__field">
                  <label htmlFor="confirm-password">Confirmar Contraseña</label>
                  <div className="auth-form__input-wrapper">
                    <FiLock size={18} />
                    <input id="confirm-password" type={showPassword ? 'text' : 'password'} placeholder="Repite tu contraseña" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                  </div>
                </div>
                <button type="submit" className="btn btn--primary btn--full btn--lg" disabled={loading}>
                  {loading ? 'Guardando...' : 'Restablecer Contraseña'} {!loading && <FiArrowRight size={18} />}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
