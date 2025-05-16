import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../components/dashboard/Dashboard';
import UserManagement from '../pages/UserManagement';
import ProductManagement from '../pages/ProductManagement';
import OrderManagement from '../pages/OrderManagement';
import PaymentManagement from '../pages/PaymentManagement';
import ShippingManagement from '../pages/ShippingManagement';
import CategoryManagement from '../pages/CategoryManagement';
import CouponManagement from '../pages/CouponManagement';
import ReviewManagement from '../pages/ReviewManagement';
import CMSManagement from '../pages/CMSManagement';
import AnalyticsManagement from '../pages/AnalyticsManagement';
import VendorManagement from '../pages/VendorManagement';
import ReturnsManagement from '../pages/ReturnsManagement';
import SettingsPage from '../pages/SettingsPage';
import ProfilePage from '../pages/ProfilePage';
import BillingPage from '../pages/BillingPage';
import NotFound from '../pages/NotFound';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/users" element={<UserManagement />} />
      <Route path="/products" element={<ProductManagement />} />
      <Route path="/orders" element={<OrderManagement />} />
      <Route path="/payments" element={<PaymentManagement />} />
      <Route path="/shipping" element={<ShippingManagement />} />
      <Route path="/categories" element={<CategoryManagement />} />
      <Route path="/coupons" element={<CouponManagement />} />
      <Route path="/reviews" element={<ReviewManagement />} />
      <Route path="/cms" element={<CMSManagement />} />
      <Route path="/analytics" element={<AnalyticsManagement />} />
      <Route path="/vendors" element={<VendorManagement />} />
      <Route path="/returns" element={<ReturnsManagement />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/billing" element={<BillingPage />} />
      
      {/* Fallback route */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;