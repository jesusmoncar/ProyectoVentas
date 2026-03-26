// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthRequest {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  telefono?: string;
  direccion?: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  nombre: string;
  apellido: string;
  telefono: string;
  direccion: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}

export interface GoogleAuthRequest {
  accessToken: string;
}

// Product Types
export type ProductImage = string | { id?: number; url: string; filename?: string };

export interface ProductVariant {
  id: number;
  sku: string;
  color: string;
  size: string;
  stock: number;
  priceOverride: number | null;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  variants: ProductVariant[];
  images: ProductImage[];
}

// Cart Types
export interface CartItem {
  product: Product;
  variant: ProductVariant;
  quantity: number;
}

// Order Types
export interface OrderItemRequest {
  productId: number;
  quantity: number;
  variantLabel: string;
}

export interface OrderRequest {
  shippingAddress: string;
  items: OrderItemRequest[];
  paymentIntentId?: string;
  deliveryMode?: string;
}

export interface Order {
  id: number;
  numeroPedido: string;
  status: string;
  shippingAddress: string;
  totalAmount: number;
  orderDate: string;
  createdAt?: string;
  motivoDevolucion?: string;
  motivoRechazo?: string;
  deliveryMode?: string;
  trackingNumber?: string;
  labelUrl?: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: number;
  product: Product;
  productName?: string;
  variantLabel: string | null;
  quantity: number;
  price: number;
  unitPrice?: number;
}
