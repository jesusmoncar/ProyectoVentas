import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiPhone, FiMapPin, FiSave, FiLogOut, FiPackage, FiHeart } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import '../styles/profile.css';
import AddressForm from '../components/AddressForm';
import type { ShippingAddress } from '../types';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { user, updateProfile, updateAddress, logout } = useAuth();
  
  const [formData, setFormData] = useState({
    nombre: user?.nombre || '',
    apellido: user?.apellido || '',
    telefono: user?.telefono || ''
  });

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

  const [savingProfile, setSavingProfile] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre || '',
        apellido: user.apellido || '',
        telefono: user.telefono || ''
      });
      if (user.direccion) {
        try {
          setAddress(JSON.parse(user.direccion));
        } catch (e) {
          setAddress({ street: user.direccion, houseNumber: '', postalCode: '', city: '', country: 'ES' });
        }
      }
    }
  }, [user]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await updateProfile(formData);
      toast.success('Perfil actualizado correctamente');
    } catch (err) {
      toast.error('Error al actualizar el perfil');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleAddressSave = async (addr: ShippingAddress) => {
    try {
      await updateAddress(addr);
      toast.success('Dirección guardada correctamente');
    } catch (err) {
      toast.error('Error al guardar la dirección');
    }
  };

  return (
    <div className="profile-page container section-padding">
      <div className="profile-header">
        <h1>Hola, {user?.nombre} 👋</h1>
        <p>Gestiona tu información personal y tus direcciones de envío.</p>
      </div>

      <div className="profile-grid">
        <aside className="profile-sidebar">
          <div className="profile-nav-card">
            <button className="profile-nav-item profile-nav-item--active">
              <FiUser size={18} /> Mi Perfil
            </button>
            <Link to="/mis-pedidos" className="profile-nav-item">
              <FiPackage size={18} /> Mis Pedidos
            </Link>
            <Link to="/favoritos" className="profile-nav-item">
              <FiHeart size={18} /> Mis Favoritos
            </Link>
            <hr className="navbar__divider" />
            <button className="profile-nav-item" style={{ color: '#FF5252' }} onClick={logout}>
              <FiLogOut size={18} /> Cerrar Sesión
            </button>
          </div>
        </aside>

        <main className="profile-content">
          <section className="profile-section">
            <h3><FiUser /> Datos Personales</h3>
            <form onSubmit={handleProfileSubmit}>
              <div className="profile-form-row">
                <div className="auth-form__field">
                  <label>Nombre</label>
                  <div className="auth-form__input-wrapper">
                    <FiUser size={18} />
                    <input 
                      type="text" 
                      value={formData.nombre} 
                      onChange={e => setFormData({...formData, nombre: e.target.value})}
                      required
                    />
                  </div>
                </div>
                <div className="auth-form__field">
                  <label>Apellido</label>
                  <div className="auth-form__input-wrapper">
                    <FiUser size={18} />
                    <input 
                      type="text" 
                      value={formData.apellido} 
                      onChange={e => setFormData({...formData, apellido: e.target.value})}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="profile-form-row">
                <div className="auth-form__field">
                  <label>Correo Electrónico</label>
                  <div className="auth-form__input-wrapper" style={{ background: 'var(--gray-50)', cursor: 'not-allowed' }}>
                    <FiMail size={18} />
                    <input type="email" value={user?.email} disabled style={{ cursor: 'not-allowed' }} />
                  </div>
                  <small style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '4px' }}>El email no se puede cambiar.</small>
                </div>
                <div className="auth-form__field">
                  <label>Teléfono</label>
                  <div className="auth-form__input-wrapper">
                    <FiPhone size={18} />
                    <input 
                      type="text" 
                      value={formData.telefono} 
                      onChange={e => setFormData({...formData, telefono: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn--primary" disabled={savingProfile}>
                {savingProfile ? 'Guardando...' : <><FiSave style={{marginRight: '8px'}} /> Guardar Cambios</>}
              </button>
            </form>
          </section>

          <section className="profile-section">
            <h3><FiMapPin /> Mi Dirección de Envío</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Esta será tu dirección predeterminada en el checkout para que compres más rápido.
            </p>
            <AddressForm 
              address={address} 
              onChange={setAddress} 
              onSave={handleAddressSave}
            />
          </section>
        </main>
      </div>
    </div>
  );
}
