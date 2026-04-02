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
      toast.error('Por favor, complete todos los campos');
      return;
    }
    setLoading(true);
    try {
      await login({ email, password });
      toast.success('Bienvenido de nuevo al Atelier.');
      navigate('/');
    } catch (err: any) {
      toast.error('Las credenciales proporcionadas no son válidas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-luxe">
      <div className="auth-luxe__visual">
        <div className="img-placeholder" />
        <div className="auth-luxe__overlay">
          <div className="auth-luxe__quote">
            <blockquote>"La simplicidad es la máxima sofisticación."</blockquote>
            <cite>Leonardo da Vinci</cite>
          </div>
        </div>
      </div>

      <div className="auth-luxe__content">
        <div className="auth-luxe__form-container fade-in">
          <Link to="/" className="auth-luxe__logo">Studio Luxe</Link>
          
          <header className="auth-luxe__header">
            <h1>Acceso al Atelier</h1>
            <p>Inicie sesión para gestionar sus pedidos y favoritos.</p>
          </header>

          <form className="auth-luxe__form" onSubmit={handleSubmit}>
            <div className="luxe-input">
              <label>Email</label>
              <div className="luxe-input__wrapper">
                <FiMail size={16} />
                <input
                  type="email"
                  placeholder="ejemplo@luxe.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="luxe-input">
              <label>Contraseña</label>
              <div className="luxe-input__wrapper">
                <FiLock size={16} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button type="button" className="luxe-input__toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <div className="auth-luxe__actions">
              <Link to="/forgot-password">¿Ha olvidado su contraseña?</Link>
            </div>

            <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
              {loading ? 'Accediendo...' : 'Entrar'} <FiArrowRight size={18} />
            </button>
          </form>

          <footer className="auth-luxe__footer">
            <p>¿Aún no tiene una cuenta? <Link to="/registro">Crear perfil</Link></p>
          </footer>
        </div>
      </div>
    </div>
  );
}
