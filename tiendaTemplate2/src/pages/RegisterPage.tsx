import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiPhone, FiMapPin, FiArrowRight, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import AddressForm from '../components/AddressForm';
import type { ShippingAddress } from '../types';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, user } = useAuth();
  const [form, setForm] = useState({
    nombre: '', apellido: '', email: '', password: '', telefono: '', direccion: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [address, setAddress] = useState<ShippingAddress>(() => {
    if (user?.direccion) {
      try {
        return JSON.parse(user.direccion);
      } catch (e) {
        return { street: user.direccion, houseNumber: '', postalCode: '', city: '', country: 'ES' };
      }
    }
    return { street: '', houseNumber: '', postalCode: '', city: '', country: 'ES' };
  });

  const [loading, setLoading] = useState(false);

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleAddressSave = () => {
    setShowAddressForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nombre || !form.apellido || !form.email || !form.password) {
      toast.error('Por favor, complete los campos obligatorios');
      return;
    }
    if (form.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setLoading(true);
    try {
      const registrationData = {
        ...form,
        direccion: JSON.stringify(address)
      };
      await register(registrationData);
      toast.success('Bienvenido al Atelier. Su cuenta ha sido creada.');
      navigate('/login');
    } catch (err: any) {
      toast.error('Error al crear la cuenta. Por favor, intente de nuevo.');
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
            <blockquote>"La moda pasa de moda, el estilo jamás."</blockquote>
            <cite>Coco Chanel</cite>
          </div>
        </div>
      </div>

      <div className="auth-luxe__content">
        <div className="auth-luxe__form-container fade-in">
          <Link to="/" className="auth-luxe__logo">Studio Luxe</Link>
          
          <header className="auth-luxe__header">
            <h1>Crear un Perfil</h1>
            <p>Únase a nuestra comunidad y acceda a piezas exclusivas.</p>
          </header>

          <form className="auth-luxe__form" onSubmit={handleSubmit}>
            <div className="auth-luxe__row">
              <div className="luxe-input">
                <label>Nombre</label>
                <div className="luxe-input__wrapper">
                  <FiUser size={16} />
                  <input type="text" placeholder="Su nombre" value={form.nombre} onChange={e => update('nombre', e.target.value)} />
                </div>
              </div>
              <div className="luxe-input">
                <label>Apellido</label>
                <div className="luxe-input__wrapper">
                  <FiUser size={16} />
                  <input type="text" placeholder="Su apellido" value={form.apellido} onChange={e => update('apellido', e.target.value)} />
                </div>
              </div>
            </div>

            <div className="luxe-input">
              <label>Email</label>
              <div className="luxe-input__wrapper">
                <FiMail size={16} />
                <input type="email" placeholder="ejemplo@luxe.com" value={form.email} onChange={e => update('email', e.target.value)} autoComplete="email" />
              </div>
            </div>

            <div className="luxe-input">
              <label>Contraseña</label>
              <div className="luxe-input__wrapper">
                <FiLock size={16} />
                <input type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={form.password} onChange={e => update('password', e.target.value)} autoComplete="new-password" />
                <button type="button" className="luxe-input__toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            <div className="auth-luxe__row">
              <div className="luxe-input">
                <label>Teléfono</label>
                <div className="luxe-input__wrapper">
                  <FiPhone size={16} />
                  <input type="tel" placeholder="+34 000 000 000" value={form.telefono} onChange={e => update('telefono', e.target.value)} />
                </div>
              </div>
              <div className="luxe-input">
                <label>Dirección</label>
                <div 
                  className={`luxe-input__wrapper luxe-input__wrapper--clickable ${showAddressForm ? 'open' : ''}`}
                  onClick={() => setShowAddressForm(!showAddressForm)}
                >
                  <FiMapPin size={16} />
                  <span className="luxe-input__display">
                    {address.street ? `${address.street}, ${address.city}` : 'Añadir dirección'}
                  </span>
                  {showAddressForm ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                </div>
              </div>
            </div>

            {showAddressForm && (
              <div className="luxe-address-box fade-in">
                <AddressForm 
                  address={address} 
                  onChange={setAddress} 
                  onSave={handleAddressSave}
                />
              </div>
            )}

            <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
              {loading ? 'Procesando...' : 'Registrarse'} <FiArrowRight size={18} />
            </button>
          </form>

          <footer className="auth-luxe__footer">
            <p>¿Ya es miembro? <Link to="/login">Iniciar Sesión</Link></p>
          </footer>
        </div>
      </div>
    </div>
  );
}
