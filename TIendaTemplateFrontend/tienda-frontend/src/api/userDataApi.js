import api from './axios';

/** Obtiene el carrito y wishlist guardados en la BD para el usuario autenticado */
export async function fetchSavedData() {
    const res = await api.get('/user/saved-data');
    return {
        cart:     JSON.parse(res.data.cart     || '[]'),
        wishlist: JSON.parse(res.data.wishlist || '[]'),
    };
}

/** Guarda el carrito actual en la BD */
export async function persistCart(cartItems) {
    await api.put('/user/cart', { cart: JSON.stringify(cartItems) });
}

/** Guarda la wishlist actual en la BD */
export async function persistWishlist(wishlistIds) {
    await api.put('/user/wishlist', { wishlist: JSON.stringify(wishlistIds) });
}

/** Fusiona el carrito local con el de la BD (suma cantidades si mismo producto+variante) */
export function mergeCart(local, remote) {
    const merged = [...remote];
    for (const localItem of local) {
        const key = `${localItem.productId ?? localItem.id}_${localItem.variantLabel ?? ''}`;
        const existing = merged.find(
            r => `${r.productId ?? r.id}_${r.variantLabel ?? ''}` === key
        );
        if (existing) {
            existing.quantity += localItem.quantity;
        } else {
            merged.push(localItem);
        }
    }
    return merged;
}

/** Fusiona la wishlist local con la de la BD (unión sin duplicados) */
export function mergeWishlist(local, remote) {
    return [...new Set([...remote, ...local])];
}
