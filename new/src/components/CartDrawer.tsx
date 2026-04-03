import { FiX, FiPlus, FiMinus, FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../api/api';
import { hexToColorName } from '../utils/colorUtils';

export default function CartDrawer() {
  const { items, isOpen, closeCart, totalItems, totalPrice, updateQuantity, removeFromCart } = useCart();

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'cart-overlay--visible' : ''}`} onClick={closeCart} />

      <div className={`cart-drawer ${isOpen ? 'cart-drawer--open' : ''}`}>
        <div className="cart-drawer__header">
          <div className="cart-drawer__title">
            <FiShoppingBag size={22} />
            <h3>Tu Carrito</h3>
            <span className="cart-drawer__count">{totalItems}</span>
          </div>
          <button className="cart-drawer__close" onClick={closeCart} aria-label="Cerrar carrito">
            <FiX size={24} />
          </button>
        </div>

        <div className="cart-drawer__body">
          {items.length === 0 ? (
            <div className="cart-drawer__empty">
              <div className="cart-drawer__empty-icon">
                <FiShoppingBag size={64} />
              </div>
              <h4>Tu carrito está vacío</h4>
              <p>¡Explora nuestra colección y encuentra algo que te encante!</p>
              <Link to="/catalogo" className="btn btn--primary" onClick={closeCart}>
                Explorar Catálogo
              </Link>
            </div>
          ) : (
            <ul className="cart-drawer__items">
              {items.map(item => {
                const imageUrl = getImageUrl(item.product.images?.[0], item.product.id);
                const basePrice = item.variant.priceOverride ?? item.product.basePrice;
                const discount = item.product.discountPercent ?? 0;
                const price = basePrice * (1 - discount / 100);

                return (
                  <li key={`${item.product.id}-${item.variant.id}`} className="cart-item">
                    <div className="cart-item__image">
                      {imageUrl ? (
                        <img src={imageUrl} alt={item.product.name} />
                      ) : (
                        <div className="cart-item__placeholder"><FiShoppingBag size={24} /></div>
                      )}
                    </div>
                    <div className="cart-item__details">
                      <h4 className="cart-item__name">{item.product.name}</h4>
                      <p className="cart-item__variant">
                        {item.variant.color && <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <span className="cart-item__color-dot" style={{ backgroundColor: item.variant.color }} />
                          {item.variant.colorName || hexToColorName(item.variant.color) || item.variant.color}{item.variant.size ? ` / ${item.variant.size}` : ''}
                        </span>}
                      </p>
                      <div className="cart-item__bottom">
                        <div className="cart-item__quantity">
                          <button onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity - 1)}>
                            <FiMinus size={14} />
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity + 1)}>
                            <FiPlus size={14} />
                          </button>
                        </div>
                        <span className="cart-item__price">€{(price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                    <button className="cart-item__remove" onClick={() => removeFromCart(item.product.id, item.variant.id)} aria-label="Eliminar">
                      <FiTrash2 size={16} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__total">
              <span>Total</span>
              <span className="cart-drawer__total-price">€{totalPrice.toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="btn btn--primary btn--full" onClick={closeCart}>
              Ir a Pagar <FiArrowRight size={18} />
            </Link>
            <button className="btn btn--ghost btn--full" onClick={closeCart}>
              Seguir Comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
}
