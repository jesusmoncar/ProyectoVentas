import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiMail, FiMapPin, FiPhone, FiX } from 'react-icons/fi';

export default function Footer() {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const closeModal = () => setActiveModal(null);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div className="footer__brand">
            <h3 className="footer__logo">Studio Luxe</h3>
            <p className="footer__text">
              Curated elegance for the modern individual. Quality, minimalism, and timeless style.
            </p>
            <div className="footer__social">
              <a href="#" aria-label="Instagram"><FiInstagram size={18} /></a>
              <a href="#" aria-label="Twitter"><FiTwitter size={18} /></a>
              <a href="#" aria-label="Facebook"><FiFacebook size={18} /></a>
            </div>
          </div>

          <div className="footer__group">
            <h4 className="footer__title">Colecciones</h4>
            <ul className="footer__links">
              <li><Link to="/catalogo">Novedades</Link></li>
              <li><Link to="/catalogo">Esenciales</Link></li>
              <li><Link to="/catalogo">Edición Limitada</Link></li>
              <li><Link to="/catalogo">Accesorios</Link></li>
            </ul>
          </div>

          <div className="footer__group">
            <h4 className="footer__title">Atención</h4>
            <ul className="footer__links">
              <li><button onClick={() => setActiveModal('tracking')}>Seguimiento</button></li>
              <li><button onClick={() => setActiveModal('shipping')}>Envíos</button></li>
              <li><button onClick={() => setActiveModal('faq')}>Preguntas</button></li>
              <li><Link to="/seguimiento">Localizador</Link></li>
            </ul>
          </div>

          <div className="footer__group">
            <h4 className="footer__title">Contacto</h4>
            <ul className="footer__links footer__contact">
              <li><FiMapPin size={14} /> <span>Vía Elegance 45, Madrid</span></li>
              <li><FiPhone size={14} /> <span>+34 900 123 456</span></li>
              <li><FiMail size={14} /> <span>atelier@studioluxe.com</span></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} STUDIO LUXE. All rights reserved.</p>
          <div className="footer__bottom-links">
            <a href="#">Privacidad</a>
            <a href="#">Términos</a>
            <a href="#">Cookies</a>
          </div>
        </div>
      </div>

      {/* Modern Minimalist Modals */}
      {activeModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content fade-in" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}><FiX size={20} /></button>
            
            {activeModal === 'tracking' && (
              <div className="modal-body">
                <h2>Seguimiento de Pedido</h2>
                <p>Tu pedido está en camino. Puedes usar tu ID de seguimiento en el portal de Correos para ver el estado en tiempo real.</p>
                <div className="modal-info-box">
                  <h4>¿Dónde encontrar mi ID?</h4>
                  <p>Lo enviamos a tu email una vez el pedido sale de nuestro atelier.</p>
                </div>
                <a href="https://www.correos.es" target="_blank" className="btn btn--primary btn--full">Ir al Localizador</a>
              </div>
            )}

            {activeModal === 'shipping' && (
              <div className="modal-body">
                <h2>Envíos y Entregas</h2>
                <div className="modal-shipping-grid">
                  <div className="shipping-item">
                    <h5>España Peninsular</h5>
                    <p>4.99€ | Gratis en pedidos +50€</p>
                  </div>
                  <div className="shipping-item">
                    <h5>Plazos</h5>
                    <p>2-4 días laborables</p>
                  </div>
                </div>
                <p className="modal-note">Cuidamos cada detalle del empaquetado para asegurar que recibas una experiencia de lujo en casa.</p>
              </div>
            )}

            {activeModal === 'faq' && (
              <div className="modal-body">
                <h2>Preguntas Frecuentes</h2>
                <div className="faq-list">
                  <details>
                    <summary>¿Qué métodos de pago aceptan?</summary>
                    <p>Aceptamos Visa, Mastercard y American Express de forma segura mediante Stripe.</p>
                  </details>
                  <details>
                    <summary>¿Cómo realizo una devolución?</summary>
                    <p>Tienes 14 días para solicitar una devolución desde tu perfil de usuario.</p>
                  </details>
                  <details>
                    <summary>¿Las tallas son estándar?</summary>
                    <p>Sí, seguimos el tallaje europeo. Recomendamos revisar los detalles en cada producto.</p>
                  </details>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </footer>
  );
}
