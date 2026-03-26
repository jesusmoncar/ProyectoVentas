import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Completa todos los campos');
      return;
    }
    setLoading(true);
    try {
      await login({ email, password });
      toast.success('¡Bienvenido/a de vuelta! 🌸');
      navigate('/');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Credenciales incorrectas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__visual">
        <div className="auth-page__visual-content">
          <h2>Bienvenido/a<br />de vuelta</h2>
          <p>Nos alegra verte de nuevo por aquí. ¡Tu estilo te espera!</p>
          <div className="auth-page__shapes">
            <div className="auth-page__shape auth-page__shape--1" />
            <div className="auth-page__shape auth-page__shape--2" />
            <div className="auth-page__shape auth-page__shape--3" />
          </div>
        </div>
      </div>

      <div className="auth-page__form-side">
        <div className="auth-page__form-wrapper">
          <Link to="/" className="auth-page__logo">BLOOM<span>.</span></Link>

          <div className="auth-page__header">
            <h1>Iniciar Sesión</h1>
            <p>Ingresa tus datos para continuar</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form__field">
              <label htmlFor="login-email">Email</label>
              <div className="auth-form__input-wrapper">
                <FiMail size={18} />
                <input
                  id="login-email"
                  type="email"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="auth-form__field">
              <label htmlFor="login-password">Contraseña</label>
              <div className="auth-form__input-wrapper">
                <FiLock size={18} />
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button type="button" className="auth-form__toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <Link to="/forgot-password" className="auth-form__forgot">¿Olvidaste tu contraseña?</Link>

            <button type="submit" className="btn btn--primary btn--full btn--lg" disabled={loading}>
              {loading ? 'Entrando...' : 'Iniciar Sesión'} {!loading && <FiArrowRight size={18} />}
            </button>
          </form>

          <p className="auth-page__switch">
            ¿No tienes cuenta? <Link to="/registro">Crear cuenta</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
