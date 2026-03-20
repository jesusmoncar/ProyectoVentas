import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home.jsx';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminProducts from './pages/admin/AdminProducts';
import CreateProduct from './pages/admin/CreateProduct';
import EditProduct from './pages/admin/EditProduct';
import Waitlist from './pages/Waitlist';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import AdminOrders from './pages/admin/AdminOrders';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Rutas públicas ── */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/waitlist" element={<Waitlist />} />
        <Route path="/cart" element={<Cart />} />

        {/* ── Rutas protegidas (requieren sesión) ── */}
        <Route path="/checkout" element={
          <PrivateRoute><Checkout /></PrivateRoute>
        } />
        <Route path="/order-confirmation/:numeroPedido" element={
          <PrivateRoute><OrderConfirmation /></PrivateRoute>
        } />

        {/* ── Rutas de Admin (requieren ROLE_ADMIN) ── */}
        <Route path="/admin/products" element={
          <PrivateRoute role="ADMIN"><AdminProducts /></PrivateRoute>
        } />
        <Route path="/admin/products/new" element={
          <PrivateRoute role="ADMIN"><CreateProduct /></PrivateRoute>
        } />
        <Route path="/admin/products/:id/edit" element={
          <PrivateRoute role="ADMIN"><EditProduct /></PrivateRoute>
        } />
        <Route path="/admin/orders" element={
          <PrivateRoute role="ADMIN"><AdminOrders /></PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;