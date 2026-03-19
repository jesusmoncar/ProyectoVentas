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

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/products/new" element={<CreateProduct />} />
        <Route path="/admin/products/:id/edit" element={<EditProduct />} />
        <Route path="/waitlist" element={<Waitlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation/:numeroPedido" element={<OrderConfirmation />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;