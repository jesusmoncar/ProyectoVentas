import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiMail, FiMapPin, FiPhone, FiHeart } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__wave">
        <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
          <path d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,80 1440,60 L1440,120 L0,120 Z" fill="currentColor" />
        </svg>
      </div>

      <div className="footer__content">
        <div className="footer__container">
          <div className="footer__brand">
            <h3 className="footer__logo">BLOOM<span>.</span></h3>
            <p className="footer__description">
              Tu destino para la moda moderna. Descubre piezas únicas que reflejan tu estilo personal con la calidad que mereces.
            </p>
            <div className="footer__social">
              <a href="#" className="footer__social-link" aria-label="Instagram"><FiInstagram size={20} /></a>
              <a href="#" className="footer__social-link" aria-label="Twitter"><FiTwitter size={20} /></a>
              <a href="#" className="footer__social-link" aria-label="Facebook"><FiFacebook size={20} /></a>
            </div>
          </div>

          <div className="footer__links-group">
            <h4 className="footer__title">Tienda</h4>
            <ul className="footer__list">
              <li><Link to="/catalogo">Catálogo</Link></li>
              <li><Link to="/catalogo">Novedades</Link></li>
              <li><Link to="/catalogo">Ofertas</Link></li>
              <li><Link to="/catalogo">Colecciones</Link></li>
            </ul>
          </div>

          <div className="footer__links-group">
            <h4 className="footer__title">Ayuda</h4>
            <ul className="footer__list">
              <li><Link to="/seguimiento">Seguir Pedido</Link></li>
              <li><a href="#">Envíos y Devoluciones</a></li>
              <li><a href="#">Guía de Tallas</a></li>
              <li><a href="#">Preguntas Frecuentes</a></li>
            </ul>
          </div>

          <div className="footer__links-group">
            <h4 className="footer__title">Contacto</h4>
            <ul className="footer__list footer__contact">
              <li><FiMapPin size={16} /> <span>Calle Moda 123, Ciudad</span></li>
              <li><FiPhone size={16} /> <span>+34 612 345 678</span></li>
              <li><FiMail size={16} /> <span>hola@bloom.com</span></li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p>© 2026 BLOOM. Todos los derechos reservados.</p>
          <p className="footer__made-with">Hecho con <FiHeart size={14} className="footer__heart" /> para ti</p>
        </div>
      </div>
    </footer>
  );
}
