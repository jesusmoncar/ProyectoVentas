import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiMail, FiMapPin, FiPhone, FiHeart, FiX, FiPackage, FiTruck, FiHelpCircle } from 'react-icons/fi';

export default function Footer() {
  const [showTracking, setShowTracking] = useState(false);
  const [showShipping, setShowShipping] = useState(false);
  const [showSizes, setShowSizes] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);

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
              <li><a href="#" onClick={(e) => { e.preventDefault(); setShowTracking(true); }}>Seguir Pedido</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setShowShipping(true); }}>Envíos y Devoluciones</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setShowSizes(true); }}>Guía de Tallas</a></li>
              <li><a href="#" onClick={(e) => { e.preventDefault(); setShowFAQ(true); }}>Preguntas Frecuentes</a></li>
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

      {/* Modal: Seguir Pedido */}
      {showTracking && (
        <div className="admin__modal-overlay" onClick={() => setShowTracking(false)}>
          <div className="admin__modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '550px' }}>
            <div className="admin__modal-header">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiPackage size={24} style={{ color: 'var(--pastel-pink-dark)' }} /> Seguir tu Pedido
              </h2>
              <button className="admin__modal-close" onClick={() => setShowTracking(false)}><FiX size={24} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ background: 'var(--pastel-pink-light)', padding: '20px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <span style={{ fontSize: '2.5rem' }}>📦</span>
                <h3 style={{ fontFamily: 'var(--font-display)', marginTop: '8px', fontSize: '1.2rem' }}>¿Dónde está mi pedido?</h3>
              </div>

              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                Puedes consultar el estado de tu envío directamente desde la <strong>web de Correos</strong> utilizando tu <strong>ID de seguimiento</strong>.
              </p>

              <div style={{ background: 'var(--gray-50)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)' }}>
                <h4 style={{ fontSize: '0.9rem', marginBottom: '10px', color: 'var(--text-primary)' }}>📋 ¿Cómo encontrar tu ID de seguimiento?</h4>
                <ol style={{ paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '0.9rem' }}>
                  <li>Inicia sesión en tu cuenta de BLOOM</li>
                  <li>Ve a <strong>"Mis Pedidos"</strong> en tu perfil</li>
                  <li>Haz clic en el pedido que quieras consultar</li>
                  <li>Encontrarás el <strong>ID de seguimiento</strong> en los detalles del envío</li>
                </ol>
              </div>

              <a 
                href="https://www.correos.es/es/es/herramientas/localizador/envios" 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn--primary btn--full"
                style={{ textAlign: 'center' }}
              >
                🔍 Ir a Correos — Seguir Envío
              </a>

              <p style={{ fontSize: '0.8rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                Si tienes cualquier duda contacta con nosotros en <strong>hola@bloom.com</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Envíos y Devoluciones */}
      {showShipping && (
        <div className="admin__modal-overlay" onClick={() => setShowShipping(false)}>
          <div className="admin__modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="admin__modal-header">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiTruck size={24} style={{ color: 'var(--pastel-pink-dark)' }} /> Envíos y Devoluciones
              </h2>
              <button className="admin__modal-close" onClick={() => setShowShipping(false)}><FiX size={24} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

              {/* Sección Envíos */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '12px', color: 'var(--text-primary)' }}>📦 Envíos</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ background: 'var(--pastel-blue-light)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--pastel-blue)' }}>
                    <p style={{ fontWeight: '600', color: 'var(--pastel-blue-dark)', marginBottom: '4px' }}>🇪🇸 Envíos dentro de España</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      Coste fijo de <strong style={{ color: 'var(--text-primary)' }}>4,99€</strong> por pedido.
                    </p>
                  </div>

                  <div style={{ background: 'var(--pastel-mint-light)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--pastel-mint)' }}>
                    <p style={{ fontWeight: '600', color: '#3D8B63', marginBottom: '4px' }}>🎉 ¡Envío GRATIS!</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      En pedidos superiores a <strong style={{ color: 'var(--text-primary)' }}>50,00€</strong> el envío es completamente gratuito.
                    </p>
                  </div>

                  <div style={{ background: 'var(--gray-50)', padding: '16px', borderRadius: 'var(--radius-md)' }}>
                    <p style={{ fontWeight: '600', color: 'var(--text-primary)', marginBottom: '4px' }}>⏱️ Plazos de entrega</p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                      Los pedidos se preparan en <strong>24-48h laborables</strong> y el tiempo de entrega es de <strong>2-5 días laborables</strong> dentro de España peninsular.
                    </p>
                  </div>
                </div>
              </div>

              {/* Separador */}
              <hr style={{ border: 'none', borderTop: '2px dashed var(--gray-200)', margin: '0' }} />

              {/* Sección Devoluciones */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', marginBottom: '12px', color: 'var(--text-primary)' }}>🔄 Devoluciones</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ background: 'var(--pastel-peach-light)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--pastel-peach)' }}>
                    <p style={{ fontWeight: '600', color: '#E65100', marginBottom: '8px' }}>📝 Proceso de Devolución</p>
                    <ol style={{ paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '0.9rem' }}>
                      <li>Accede a <strong>"Mis Pedidos"</strong> en tu perfil</li>
                      <li>Selecciona el pedido y pulsa <strong>"Solicitar Devolución"</strong></li>
                      <li>Indica el <strong>motivo</strong> de la devolución</li>
                      <li>Nuestro equipo revisará tu solicitud en un plazo de <strong>24-48h</strong></li>
                      <li>Si se aprueba, recibirás instrucciones para el envío de vuelta</li>
                    </ol>
                  </div>

                  <div style={{ background: 'var(--pastel-lavender-light)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--pastel-lavender)' }}>
                    <p style={{ fontWeight: '600', color: 'var(--pastel-lavender-dark)', marginBottom: '4px' }}>ℹ️ Condiciones</p>
                    <ul style={{ paddingLeft: '20px', color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '0.9rem' }}>
                      <li>Tienes <strong>14 días naturales</strong> desde la recepción para solicitar una devolución</li>
                      <li>El artículo debe estar <strong>sin usar</strong> y con todas sus <strong>etiquetas originales</strong></li>
                      <li>Las devoluciones deben ser <strong>aprobadas por la tienda</strong> antes de enviar el producto de vuelta</li>
                      <li>Una vez aprobada, el reembolso se realiza en un plazo de <strong>5-10 días laborables</strong></li>
                    </ul>
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.8rem', textAlign: 'center', color: 'var(--text-muted)', marginTop: '4px' }}>
                ¿Tienes dudas? Escríbenos a <strong>hola@bloom.com</strong> o llámanos al <strong>+34 612 345 678</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Guía de Tallas */}
      {showSizes && (
        <div className="admin__modal-overlay" onClick={() => setShowSizes(false)}>
          <div className="admin__modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '650px' }}>
            <div className="admin__modal-header">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                📏 Guía de Tallas
              </h2>
              <button className="admin__modal-close" onClick={() => setShowSizes(false)}><FiX size={24} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ background: 'var(--pastel-lavender-light)', padding: '16px', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
                <p style={{ fontWeight: '600', color: 'var(--pastel-lavender-dark)' }}>Nuestras tallas siguen el <strong>estándar europeo (EU)</strong></p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '4px' }}>Te recomendamos medir tus prendas actuales y compararlas con la tabla</p>
              </div>

              {/* Tops */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: '10px' }}>👕 Camisetas, Jerseys y Blusas</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--pastel-pink-light)' }}>
                        <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: '700', color: 'var(--pastel-pink-dark)' }}>Talla EU</th>
                        <th style={{ padding: '10px 14px', textAlign: 'center' }}>XS</th>
                        <th style={{ padding: '10px 14px', textAlign: 'center' }}>S</th>
                        <th style={{ padding: '10px 14px', textAlign: 'center' }}>M</th>
                        <th style={{ padding: '10px 14px', textAlign: 'center' }}>L</th>
                        <th style={{ padding: '10px 14px', textAlign: 'center' }}>XL</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid var(--gray-200)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: '600' }}>Pecho (cm)</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>82-86</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>86-90</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>90-94</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>94-98</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>98-102</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--gray-200)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: '600' }}>Cintura (cm)</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>62-66</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>66-70</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>70-74</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>74-78</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>78-82</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pantalones */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: '10px' }}>👖 Pantalones y Faldas</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--pastel-blue-light)' }}>
                        <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: '700', color: 'var(--pastel-blue-dark)' }}>Talla EU</th>
                        <th style={{ padding: '10px 14px', textAlign: 'center' }}>34</th>
                        <th style={{ padding: '10px 14px', textAlign: 'center' }}>36</th>
                        <th style={{ padding: '10px 14px', textAlign: 'center' }}>38</th>
                        <th style={{ padding: '10px 14px', textAlign: 'center' }}>40</th>
                        <th style={{ padding: '10px 14px', textAlign: 'center' }}>42</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid var(--gray-200)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: '600' }}>Cintura (cm)</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>62-64</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>66-68</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>70-72</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>74-76</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>78-80</td>
                      </tr>
                      <tr style={{ borderBottom: '1px solid var(--gray-200)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: '600' }}>Cadera (cm)</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>88-90</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>92-94</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>96-98</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>100-102</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>104-106</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Calzado */}
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: '10px' }}>👠 Calzado</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead>
                      <tr style={{ background: 'var(--pastel-peach-light)' }}>
                        <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: '700', color: '#E65100' }}>EU</th>
                        <th style={{ padding: '10px 14px', textAlign: 'center' }}>36</th>
                        <th style={{ padding: '10px 14px', textAlign: 'center' }}>37</th>
                        <th style={{ padding: '10px 14px', textAlign: 'center' }}>38</th>
                        <th style={{ padding: '10px 14px', textAlign: 'center' }}>39</th>
                        <th style={{ padding: '10px 14px', textAlign: 'center' }}>40</th>
                        <th style={{ padding: '10px 14px', textAlign: 'center' }}>41</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderBottom: '1px solid var(--gray-200)' }}>
                        <td style={{ padding: '10px 14px', fontWeight: '600' }}>Pie (cm)</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>22.5</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>23.5</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>24</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>24.5</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>25.5</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>26</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '10px 14px', fontWeight: '600' }}>UK</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>3</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>4</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>5</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>5.5</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>6.5</td>
                        <td style={{ padding: '10px 14px', textAlign: 'center' }}>7</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div style={{ background: 'var(--pastel-mint-light)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--pastel-mint)' }}>
                <p style={{ fontSize: '0.85rem', color: '#3D8B63', textAlign: 'center' }}>
                  💡 <strong>Consejo:</strong> Si dudas entre dos tallas, te recomendamos elegir la más grande para mayor comodidad.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Preguntas Frecuentes */}
      {showFAQ && (
        <div className="admin__modal-overlay" onClick={() => setShowFAQ(false)}>
          <div className="admin__modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div className="admin__modal-header">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FiHelpCircle size={24} style={{ color: 'var(--pastel-pink-dark)' }} /> Preguntas Frecuentes
              </h2>
              <button className="admin__modal-close" onClick={() => setShowFAQ(false)}><FiX size={24} /></button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {[
                {
                  q: '¿Qué métodos de pago aceptáis?',
                  a: 'Aceptamos tarjetas de crédito y débito (Visa, Mastercard, American Express) a través de nuestra pasarela segura Stripe. Todos los pagos están encriptados y protegidos.',
                  icon: '💳'
                },
                {
                  q: '¿Cuánto tarda en llegar mi pedido?',
                  a: 'Los pedidos se preparan en 24-48h laborables. El envío a España peninsular tarda entre 2-5 días laborables. Te enviaremos un email con tu número de seguimiento cuando se envíe.',
                  icon: '🚚'
                },
                {
                  q: '¿Puedo cambiar o cancelar mi pedido?',
                  a: 'Puedes contactarnos por email (hola@bloom.com) para solicitar cambios o cancelaciones siempre que el pedido no haya sido enviado aún. Una vez enviado, deberás solicitar una devolución.',
                  icon: '🔄'
                },
                {
                  q: '¿Las tallas son fieles?',
                  a: 'Nuestras prendas siguen el tallaje estándar europeo (EU). Consulta nuestra Guía de Tallas para encontrar tu talla perfecta. Si dudas entre dos tallas, recomendamos la mayor.',
                  icon: '📏'
                },
                {
                  q: '¿Cómo solicito una devolución?',
                  a: 'Entra en "Mis Pedidos" desde tu perfil, selecciona el pedido y pulsa "Solicitar Devolución". Nuestro equipo revisará la solicitud en 24-48h y te indicará los pasos a seguir si es aprobada.',
                  icon: '📦'
                },
                {
                  q: '¿Es seguro comprar en BLOOM?',
                  a: 'Totalmente. Utilizamos certificado SSL, pasarela de pago Stripe (PCI DSS nivel 1) y nunca almacenamos datos de tarjetas. Tu información está siempre protegida.',
                  icon: '🔒'
                },
                {
                  q: '¿Tenéis tienda física?',
                  a: 'Sí, puedes visitarnos y recoger tus pedidos en nuestra tienda. Al hacer el pedido, selecciona la opción "Recoger en Tienda" para no pagar gastos de envío.',
                  icon: '🏬'
                },
                {
                  q: '¿Hacéis envíos fuera de España?',
                  a: 'Actualmente solo realizamos envíos dentro de España peninsular. Estamos trabajando para ampliar nuestras zonas de envío próximamente.',
                  icon: '🌍'
                }
              ].map((faq, idx) => (
                <details key={idx} style={{ background: 'var(--gray-50)', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-200)', overflow: 'hidden' }}>
                  <summary style={{ 
                    padding: '14px 16px', cursor: 'pointer', fontWeight: '600', fontSize: '0.9rem',
                    display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--text-primary)',
                    listStyle: 'none'
                  }}>
                    <span>{faq.icon}</span> {faq.q}
                  </summary>
                  <div style={{ padding: '0 16px 14px', color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.7' }}>
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      )}
    </footer>
  );
}
