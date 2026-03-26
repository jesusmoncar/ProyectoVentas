import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductDetailPage from './pages/ProductDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import AdminProductsPage from './pages/AdminProductsPage';
import AdminOrdersPage from './pages/AdminOrdersPage';
import './App.css';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="main-content">{children}</main>
      <Footer />
      <CartDrawer />
    </>
  );
}

function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main className="main-content main-content--auth">{children}</main>
      <CartDrawer />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '12px',
            background: '#fff',
            color: '#2D2D2D',
            fontFamily: "'Poppins', sans-serif",
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          },
          success: { iconTheme: { primary: '#90D8B8', secondary: '#fff' } },
          error: { iconTheme: { primary: '#E8A0B8', secondary: '#fff' } },
        }}
      />
      <Routes>
        {/* Auth pages — no navbar/footer */}
        <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
        <Route path="/registro" element={<AuthLayout><RegisterPage /></AuthLayout>} />
        <Route path="/forgot-password" element={<AuthLayout><ForgotPasswordPage /></AuthLayout>} />
        <Route path="/reset-password" element={<AuthLayout><ResetPasswordPage /></AuthLayout>} />

        {/* Main pages — with navbar/footer */}
        <Route path="/" element={<Layout><HomePage /></Layout>} />
        <Route path="/catalogo" element={<Layout><CatalogPage /></Layout>} />
        <Route path="/producto/:id" element={<Layout><ProductDetailPage /></Layout>} />
        <Route path="/seguimiento" element={<Layout><OrderTrackingPage /></Layout>} />
        <Route path="/mis-pedidos" element={<Layout><ProtectedRoute><MyOrdersPage /></ProtectedRoute></Layout>} />
        <Route path="/pedidos/:numeroPedido" element={<Layout><ProtectedRoute><OrderDetailPage /></ProtectedRoute></Layout>} />
        <Route path="/checkout" element={
          <Layout>
            <ProtectedRoute><CheckoutPage /></ProtectedRoute>
          </Layout>
        } />
  
        {/* Admin pages — protected by AdminRoute */}
        <Route path="/admin/productos" element={
          <Layout>
            <AdminRoute><AdminProductsPage /></AdminRoute>
          </Layout>
        } />
        <Route path="/admin/pedidos" element={
          <Layout>
            <AdminRoute><AdminOrdersPage /></AdminRoute>
          </Layout>
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
