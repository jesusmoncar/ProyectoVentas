import { ShoppingBag } from 'lucide-react';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer__inner">
                <div className="footer__logo">
                    <div className="footer__logo-icon">
                        <ShoppingBag size={18} color="white" strokeWidth={1.8} />
                    </div>
                    <span className="footer__logo-name">MiTienda</span>
                </div>
                <p className="footer__copy">© 2026 MiTienda. Todos los derechos reservados.</p>
                <div className="footer__links">
                    <a href="#">Privacidad</a>
                    <a href="#">Términos</a>
                    <a href="#">Contacto</a>
                </div>
            </div>
        </footer>
    );
}
