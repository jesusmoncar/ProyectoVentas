import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Protege una ruta:
 * - Sin sesión → redirige a /login
 * - Con sesión pero sin el rol requerido → redirige a /
 *
 * Uso:
 *   <PrivateRoute>              → solo requiere estar logueado
 *   <PrivateRoute role="ADMIN"> → requiere rol ADMIN
 */
export default function PrivateRoute({ children, role }) {
    const { isLoggedIn, user } = useAuth();

    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    if (role && !user?.roles?.includes(`ROLE_${role}`)) {
        return <Navigate to="/" replace />;
    }

    return children;
}
