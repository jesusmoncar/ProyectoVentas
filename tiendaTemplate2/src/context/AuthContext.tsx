import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import api from '../api/api';
import type { AuthResponse, LoginRequest, AuthRequest } from '../types';

interface User {
  email: string;
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: AuthRequest) => Promise<void>;
  googleLogin: (accessToken: string) => Promise<void>;
  updateAddress: (address: any) => Promise<void>;
  updateProfile: (data: { nombre: string; apellido: string; telefono: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Decodifica el payload de un JWT (sin verificar firma)
 * para extraer el rol del usuario.
 */
function decodeJwtRole(token: string): string {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload));
    // Spring Boot suele usar "role", "roles", o "authorities"
    if (decoded.role) return decoded.role;
    if (decoded.roles) return Array.isArray(decoded.roles) ? decoded.roles[0] : decoded.roles;
    if (decoded.authorities) {
      const auths = Array.isArray(decoded.authorities) ? decoded.authorities : [decoded.authorities];
      return auths[0]?.authority || auths[0] || '';
    }
    return '';
  } catch {
    return '';
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const saveAuth = (response: AuthResponse) => {
    const role = decodeJwtRole(response.token);
    const userData: User = {
      email: response.email,
      nombre: response.nombre,
      apellido: response.apellido,
      telefono: response.telefono,
      direccion: response.direccion,
      role,
    };
    setToken(response.token);
    setUser(userData);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const login = async (data: LoginRequest) => {
    const res = await api.post<AuthResponse>('/auth/login', data);
    saveAuth(res.data);
  };

  const register = async (data: AuthRequest) => {
    await api.post('/auth/register', data);
  };

  const googleLogin = async (accessToken: string) => {
    const res = await api.post<AuthResponse>('/auth/google', { accessToken });
    saveAuth(res.data);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const updateAddress = async (address: any) => {
    const addressJson = JSON.stringify(address);
    await api.put('/user/address', { address: addressJson });
    if (user) {
      const updatedUser = { ...user, direccion: addressJson };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const updateProfile = async (data: { nombre: string; apellido: string; telefono: string }) => {
    await api.put('/user/profile', data);
    if (user) {
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const isAdmin = user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN';

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isAdmin, loading, login, register, googleLogin, logout, updateAddress, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
