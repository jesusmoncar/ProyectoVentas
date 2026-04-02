import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiMail, FiPhone, FiMapPin, FiLogOut, FiPackage, FiHeart, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
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
    <div className="profile-luxe fade-in">
      <div className="container">
        <header className="profile-luxe__header">
          <span className="section-header__tag">Cuenta Personal</span>
          <h1 className="section-header__title">Mi Atelier</h1>
          <p className="section-header__desc">Gestione sus preferencias y detalles de envío de forma privada.</p>
        </header>

        <div className="profile-luxe__grid">
          {/* Navigation Sidebar */}
          <aside className="profile-luxe__nav">
            <div className="profile-nav-card">
              <button className="nav-item active">
                <FiUser /> <span>Datos del Perfil</span>
              </button>
              <Link to="/mis-pedidos" className="nav-item">
                <FiPackage /> <span>Mis Pedidos</span>
              </Link>
              <Link to="/favoritos" className="nav-item">
                <FiHeart /> <span>Favoritos</span>
              </Link>
              <hr />
              <button className="nav-item nav-item--logout" onClick={logout}>
                <FiLogOut /> <span>Cerrar Sesión</span>
              </button>
            </div>
          </aside>

          {/* Content Area */}
          <main className="profile-luxe__content">
            {/* Personal Data Section */}
            <section className="profile-luxe__section">
              <h2 className="profile-section-title">01. Datos Personales</h2>
              <form onSubmit={handleProfileSubmit} className="profile-form">
                <div className="profile-form__row">
                  <div className="luxe-input">
                    <label>Nombre</label>
                    <div className="luxe-input__wrapper">
                      <FiUser size={16} />
                      <input 
                        type="text" 
                        value={formData.nombre} 
                        onChange={e => setFormData({...formData, nombre: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                  <div className="luxe-input">
                    <label>Apellido</label>
                    <div className="luxe-input__wrapper">
                      <FiUser size={16} />
                      <input 
                        type="text" 
                        value={formData.apellido} 
                        onChange={e => setFormData({...formData, apellido: e.target.value})}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="luxe-input">
                  <label>Email (No editable)</label>
                  <div className="luxe-input__wrapper luxe-input__wrapper--disabled">
                    <FiMail size={16} />
                    <input type="email" value={user?.email} disabled />
                  </div>
                </div>

                <div className="luxe-input">
                  <label>Teléfono de contacto</label>
                  <div className="luxe-input__wrapper">
                    <FiPhone size={16} />
                    <input 
                      type="text" 
                      value={formData.telefono} 
                      onChange={e => setFormData({...formData, telefono: e.target.value})}
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn--primary" disabled={savingProfile}>
                  {savingProfile ? 'Guardando...' : 'Actualizar Perfil'} <FiArrowRight />
                </button>
              </form>
            </section>

            {/* Address Section */}
            <section className="profile-luxe__section">
              <h2 className="profile-section-title">02. Dirección Predeterminada</h2>
              <p className="profile-section-note">
                Esta dirección se utilizará para optimizar su experiencia de compra.
              </p>
              <div className="profile-address-box">
                <AddressForm 
                  address={address} 
                  onChange={setAddress} 
                  onSave={handleAddressSave}
                />
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}
