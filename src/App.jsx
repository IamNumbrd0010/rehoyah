/**
 * ROOT APPLICATION & ROUTE CONFIGURATION
 * --------------------------------------------------------------------------
 * Connects all Public, Auth, Customer, Staff, and Admin routes inside
 * BrowserRouter, wrapped with AppProvider, CartDrawer, and Toast feedback.
 *
 * HOW TO ADD A NEW PAGE:
 * 1. Create the page component under `src/pages/<area>/`.
 * 2. Import it below and add a <Route path="..." element={<YourPage />} />.
 * 3. If it belongs in a navigation bar, add it to SiteHeader, customerNav.js,
 *    staffNav.js, or adminNav.js.
 */

import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import Toast from './components/common/Toast.jsx';
import CartDrawer from './components/shop/CartDrawer.jsx';
import { AppProvider } from './context/AppContext.jsx';

// Public Pages
import AboutPage from './pages/public/AboutPage.jsx';
import ArticleDetailPage from './pages/public/ArticleDetailPage.jsx';
import BookingPage from './pages/public/BookingPage.jsx';
import ContactPage from './pages/public/ContactPage.jsx';
import HomePage from './pages/public/HomePage.jsx';
import InspirationPage from './pages/public/InspirationPage.jsx';
import LegalPlaceholderPage from './pages/public/LegalPlaceholderPage.jsx';
import NotFoundPage from './pages/public/NotFoundPage.jsx';
import ProductDetailPage from './pages/public/ProductDetailPage.jsx';
import ProjectDetailPage from './pages/public/ProjectDetailPage.jsx';
import ProjectsPage from './pages/public/ProjectsPage.jsx';
import QuoteRequestPage from './pages/public/QuoteRequestPage.jsx';
import ServiceDetailPage from './pages/public/ServiceDetailPage.jsx';
import ServicesPage from './pages/public/ServicesPage.jsx';
import ShopPage from './pages/public/ShopPage.jsx';

// Auth Pages
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage.jsx';
import LoginPage from './pages/auth/LoginPage.jsx';
import RegisterPage from './pages/auth/RegisterPage.jsx';

// Customer Portal Pages
import CustomerDashboard from './pages/customer/CustomerDashboard.jsx';
import CustomerOrderDetailPage from './pages/customer/CustomerOrderDetailPage.jsx';
import CustomerOrdersPage from './pages/customer/CustomerOrdersPage.jsx';
import CustomerProfilePage from './pages/customer/CustomerProfilePage.jsx';
import CustomerProjectsPage from './pages/customer/CustomerProjectsPage.jsx';
import CustomerQuotesPage from './pages/customer/CustomerQuotesPage.jsx';
import CustomerWishlistPage from './pages/customer/CustomerWishlistPage.jsx';

// Staff Workspace Pages
import StaffContentPage from './pages/staff/StaffContentPage.jsx';
import StaffDashboard from './pages/staff/StaffDashboard.jsx';
import StaffEnquiriesPage from './pages/staff/StaffEnquiriesPage.jsx';
import StaffProductsPage from './pages/staff/StaffProductsPage.jsx';
import StaffProfilePage from './pages/staff/StaffProfilePage.jsx';
import StaffProjectsPage from './pages/staff/StaffProjectsPage.jsx';
import StaffTasksPage from './pages/staff/StaffTasksPage.jsx';

// Admin Control Center Pages
import AdminActivityPage from './pages/admin/AdminActivityPage.jsx';
import AdminAppointmentsPage from './pages/admin/AdminAppointmentsPage.jsx';
import AdminArticlesPage from './pages/admin/AdminArticlesPage.jsx';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage.jsx';
import AdminCustomersPage from './pages/admin/AdminCustomersPage.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminOrdersPage from './pages/admin/AdminOrdersPage.jsx';
import AdminPortfolioPage from './pages/admin/AdminPortfolioPage.jsx';
import AdminProductsPage from './pages/admin/AdminProductsPage.jsx';
import AdminProjectsPage from './pages/admin/AdminProjectsPage.jsx';
import AdminQuotesPage from './pages/admin/AdminQuotesPage.jsx';
import AdminReportsPage from './pages/admin/AdminReportsPage.jsx';
import AdminReviewsPage from './pages/admin/AdminReviewsPage.jsx';
import AdminServicesPage from './pages/admin/AdminServicesPage.jsx';
import AdminSettingsPage from './pages/admin/AdminSettingsPage.jsx';
import AdminStaffPage from './pages/admin/AdminStaffPage.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/shop/:productSlug" element={<ProductDetailPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:projectSlug" element={<ProjectDetailPage />} />
          <Route path="/inspiration" element={<InspirationPage />} />
          <Route path="/inspiration/:articleSlug" element={<ArticleDetailPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/request-quote" element={<QuoteRequestPage />} />
          <Route path="/book-consultation" element={<BookingPage />} />
          <Route path="/privacy" element={<LegalPlaceholderPage type="privacy" />} />
          <Route path="/terms" element={<LegalPlaceholderPage type="terms" />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Customer Portal Routes */}
          <Route path="/account" element={<CustomerDashboard />} />
          <Route path="/account/orders" element={<CustomerOrdersPage />} />
          <Route path="/account/orders/:id" element={<CustomerOrderDetailPage />} />
          <Route path="/account/wishlist" element={<CustomerWishlistPage />} />
          <Route path="/account/quotes" element={<CustomerQuotesPage />} />
          <Route path="/account/projects" element={<CustomerProjectsPage />} />
          <Route path="/account/profile" element={<CustomerProfilePage />} />

          {/* Staff Workspace Routes */}
          <Route path="/staff" element={<StaffDashboard />} />
          <Route path="/staff/tasks" element={<StaffTasksPage />} />
          <Route path="/staff/enquiries" element={<StaffEnquiriesPage />} />
          <Route path="/staff/products" element={<StaffProductsPage />} />
          <Route path="/staff/projects" element={<StaffProjectsPage />} />
          <Route path="/staff/content" element={<StaffContentPage />} />
          <Route path="/staff/profile" element={<StaffProfilePage />} />

          {/* Admin Control Center Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/staff" element={<AdminStaffPage />} />
          <Route path="/admin/products" element={<AdminProductsPage />} />
          <Route path="/admin/categories" element={<AdminCategoriesPage />} />
          <Route path="/admin/orders" element={<AdminOrdersPage />} />
          <Route path="/admin/quotes" element={<AdminQuotesPage />} />
          <Route path="/admin/projects" element={<AdminProjectsPage />} />
          <Route path="/admin/services" element={<AdminServicesPage />} />
          <Route path="/admin/portfolio" element={<AdminPortfolioPage />} />
          <Route path="/admin/articles" element={<AdminArticlesPage />} />
          <Route path="/admin/reviews" element={<AdminReviewsPage />} />
          <Route path="/admin/customers" element={<AdminCustomersPage />} />
          <Route path="/admin/appointments" element={<AdminAppointmentsPage />} />
          <Route path="/admin/reports" element={<AdminReportsPage />} />
          <Route path="/admin/settings" element={<AdminSettingsPage />} />
          <Route path="/admin/activity" element={<AdminActivityPage />} />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>

        <CartDrawer />
        <Toast />
      </BrowserRouter>
    </AppProvider>
  );
}
