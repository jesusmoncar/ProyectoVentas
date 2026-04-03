import { FiX, FiPlus, FiMinus, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { getImageUrl } from '../api/api';

export default function CartDrawer() {
  const { items, isOpen, closeCart, totalItems, totalPrice, updateQuantity, removeFromCart } = useCart();

  return (
    <>
      <div className={`cart-overlay ${isOpen ? 'cart-overlay--visible' : ''}`} onClick={closeCart} />

      <div className={`cart-drawer ${isOpen ? 'cart-drawer--open' : ''}`}>
        <div className="cart-drawer__header">
          <div className="cart-drawer__title">
            <h3>Bolsa de Compra</h3>
            <span className="cart-drawer__count">{totalItems} piezas</span>
          </div>
          <button className="cart-drawer__close" onClick={closeCart} aria-label="Cerrar bolsa">
            <FiX size={20} />
          </button>
        </div>

        <div className="cart-drawer__body">
          {items.length === 0 ? (
            <div className="cart-drawer__empty">
              <FiShoppingBag size={48} strokeWidth={1} />
              <h4>Su bolsa está vacía</h4>
              <p>Descubra nuestras últimas piezas y comience su selección.</p>
              <Link to="/catalogo" className="btn btn--outline" onClick={closeCart}>
                Ver Catálogo
              </Link>
            </div>
          ) : (
            <div className="cart-drawer__items">
              {items.map(item => {
                const imageUrl = getImageUrl(item.product.images?.[0], item.product.id);
                const price = item.variant.priceOverride ?? item.product.basePrice;

                return (
                  <div key={`${item.product.id}-${item.variant.id}`} className="cart-item-luxe">
                    <div className="cart-item-luxe__media">
                      {imageUrl ? (
                        <img src={imageUrl} alt={item.product.name} />
                      ) : (
                        <div className="cart-item-luxe__placeholder" />
                      )}
                    </div>
                    <div className="cart-item-luxe__info">
                      <div className="cart-item-luxe__header">
                        <h4>{item.product.name}</h4>
                        <button className="cart-item-luxe__remove" onClick={() => removeFromCart(item.product.id, item.variant.id)}>
                          <FiX size={14} />
                        </button>
                      </div>
                      <p className="cart-item-luxe__variant">
                        <span className="color-dot" style={{ backgroundColor: item.variant.color }}></span> {item.variant.size}
                      </p>
                      <div className="cart-item-luxe__footer">
                        <div className="cart-item-luxe__qty">
                          <button onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity - 1)}>
                            <FiMinus size={12} />
                          </button>
                          <span>{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity + 1)}>
                            <FiPlus size={12} />
                          </button>
                        </div>
                        <span className="cart-item-luxe__price">€{(price * item.quantity).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__summary">
              <div className="cart-drawer__row">
                <span>Subtotal</span>
                <span>€{totalPrice.toFixed(2)}</span>
              </div>
              <div className="cart-drawer__row cart-drawer__row--total">
                <span>Total estimado</span>
                <span>€{totalPrice.toFixed(2)}</span>
              </div>
            </div>
            <Link to="/checkout" className="btn btn--primary btn--full" onClick={closeCart}>
              Finalizar Pedido <FiArrowRight size={16} />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
