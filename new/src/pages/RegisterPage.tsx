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
      toast.error('Completa los campos obligatorios');
      return;
    }
    if (form.password.length < 6) {
      toast.error('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    setLoading(true);
    try {
      // Stringify structured address before sending
      const registrationData = {
        ...form,
        direccion: JSON.stringify(address)
      };
      await register(registrationData);
      toast.success('¡Cuenta creada exitosamente! 🎉');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.response?.data || 'Error al crear la cuenta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-page__visual auth-page__visual--register">
        <div className="auth-page__visual-content">
          <h2>Únete a<br />BLOOM</h2>
          <p>Crea tu cuenta y descubre un mundo de moda pensado para ti.</p>
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
            <h1>Crear Cuenta</h1>
            <p>Completa tus datos para comenzar</p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-form__row">
              <div className="auth-form__field">
                <label htmlFor="reg-nombre">Nombre *</label>
                <div className="auth-form__input-wrapper">
                  <FiUser size={18} />
                  <input id="reg-nombre" type="text" placeholder="Tu nombre" value={form.nombre} onChange={e => update('nombre', e.target.value)} />
                </div>
              </div>
              <div className="auth-form__field">
                <label htmlFor="reg-apellido">Apellido *</label>
                <div className="auth-form__input-wrapper">
                  <FiUser size={18} />
                  <input id="reg-apellido" type="text" placeholder="Tu apellido" value={form.apellido} onChange={e => update('apellido', e.target.value)} />
                </div>
              </div>
            </div>

            <div className="auth-form__field">
              <label htmlFor="reg-email">Email *</label>
              <div className="auth-form__input-wrapper">
                <FiMail size={18} />
                <input id="reg-email" type="email" placeholder="tu@email.com" value={form.email} onChange={e => update('email', e.target.value)} autoComplete="email" />
              </div>
            </div>

            <div className="auth-form__field">
              <label htmlFor="reg-password">Contraseña *</label>
              <div className="auth-form__input-wrapper">
                <FiLock size={18} />
                <input id="reg-password" type={showPassword ? 'text' : 'password'} placeholder="Mínimo 6 caracteres" value={form.password} onChange={e => update('password', e.target.value)} autoComplete="new-password" />
                <button type="button" className="auth-form__toggle" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
              </div>
            </div>

            <div className="auth-form__row">
              <div className="auth-form__field">
                <label htmlFor="reg-telefono">Teléfono</label>
                <div className="auth-form__input-wrapper">
                  <FiPhone size={18} />
                  <input id="reg-telefono" type="tel" placeholder="+34 612 345 678" value={form.telefono} onChange={e => update('telefono', e.target.value)} />
                </div>
              </div>
              <div className="auth-form__field">
                <label htmlFor="reg-direccion">Dirección de Envío</label>
                <div 
                  className={`auth-form__input-wrapper ${showAddressForm ? 'auth-form__input-wrapper--active' : ''}`}
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  style={{ cursor: 'pointer' }}
                >
                  <FiMapPin size={18} />
                  <div style={{ flex: 1, color: address.street ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {address.street ? `${address.street} ${address.houseNumber}, ${address.city}` : 'Pulsa para añadir dirección'}
                  </div>
                  {showAddressForm ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
                </div>
              </div>
            </div>

            {showAddressForm && (
              <div className="auth-form__expandable-section" style={{ marginTop: '0', marginBottom: '1.5rem', background: 'var(--gray-50)', padding: '1.5rem', borderRadius: 'var(--radius-lg)' }}>
                <AddressForm 
                  address={address} 
                  onChange={setAddress} 
                  onSave={handleAddressSave}
                />
              </div>
            )}

            <button type="submit" className="btn btn--primary btn--full btn--lg" disabled={loading}>
              {loading ? 'Creando cuenta...' : 'Crear Mi Cuenta'} {!loading && <FiArrowRight size={18} />}
            </button>
          </form>

          <p className="auth-page__switch">
            ¿Ya tienes cuenta? <Link to="/login">Iniciar Sesión</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
