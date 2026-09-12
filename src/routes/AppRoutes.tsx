import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { FarmerLayout } from '../layouts/FarmerLayout';
import { BuyerLayout } from '../layouts/BuyerLayout';
import { AdminLayout } from '../layouts/AdminLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { RoleRoute } from './RoleRoute';

// Public Pages
import { HomePage } from '../pages/public/HomePage';
import { AboutPage } from '../pages/public/AboutPage';
import { MarketplacePage } from '../pages/public/MarketplacePage';
import { ProductDetailsPage } from '../pages/public/ProductDetailsPage';
import { LoginPage } from '../pages/public/LoginPage';
import { RegisterPage } from '../pages/public/RegisterPage';

// Common User Pages
import { ShoppingCartPage } from '../pages/buyer/ShoppingCartPage';
import { CheckoutPage } from '../pages/buyer/CheckoutPage';
import { NotificationsPage } from '../pages/common/NotificationsPage';
import { ProfilePage } from '../pages/common/ProfilePage';
import { ChangePasswordPage } from '../pages/common/ChangePasswordPage';

// Farmer Pages
import { FarmerDashboardPage } from '../pages/farmer/FarmerDashboardPage';
import { MyFarmsPage } from '../pages/farmer/MyFarmsPage';
import { AddFarmPage } from '../pages/farmer/AddFarmPage';
import { FarmDetailsPage } from '../pages/farmer/FarmDetailsPage';
import { EditFarmPage } from '../pages/farmer/EditFarmPage';
import { MyCropsPage } from '../pages/farmer/MyCropsPage';
import { AddCropPage } from '../pages/farmer/AddCropPage';
import { MyProductsPage } from '../pages/farmer/MyProductsPage';
import { AddProductPage } from '../pages/farmer/AddProductPage';
import { EditProductPage } from '../pages/farmer/EditProductPage';
import { FarmerOrdersPage } from '../pages/farmer/FarmerOrdersPage';
import { FarmerOrderDetailsPage } from '../pages/farmer/FarmerOrderDetailsPage';

// Buyer Pages
import { BuyerDashboardPage } from '../pages/buyer/BuyerDashboardPage';
import { BuyerOrdersPage } from '../pages/buyer/BuyerOrdersPage';
import { BuyerOrderDetailsPage } from '../pages/buyer/BuyerOrderDetailsPage';

// Admin Pages
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { UserManagementPage } from '../pages/admin/UserManagementPage';
import { ProductManagementPage } from '../pages/admin/ProductManagementPage';
import { CategoryManagementPage } from '../pages/admin/CategoryManagementPage';
import { AdminOrderManagementPage } from '../pages/admin/AdminOrderManagementPage';

// Error Pages
import { NotFoundPage } from '../pages/error/NotFoundPage';
import { ForbiddenPage } from '../pages/error/ForbiddenPage';
import { ServerErrorPage } from '../pages/error/ServerErrorPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages inside MainLayout */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/marketplace" element={<ProtectedRoute allowedRoles={['BUYER']}><MarketplacePage /></ProtectedRoute>} />
        <Route path="/marketplace/:id" element={<ProtectedRoute allowedRoles={['BUYER']}><ProductDetailsPage /></ProtectedRoute>} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cart" element={<ShoppingCartPage />} />

        {/* Common Protected User Pages */}
        <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/profile/change-password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />

        {/* Error Pages */}
        <Route path="/403" element={<ForbiddenPage />} />
        <Route path="/500" element={<ServerErrorPage />} />
      </Route>

      {/* FARMER Portal Layout */}
      <Route
        element={
          <RoleRoute allowedRoles={['FARMER']}>
            <FarmerLayout />
          </RoleRoute>
        }
      >
        <Route path="/farmer/dashboard" element={<FarmerDashboardPage />} />
        <Route path="/farmer/farms" element={<MyFarmsPage />} />
        <Route path="/farmer/farms/new" element={<AddFarmPage />} />
        <Route path="/farmer/farms/:id" element={<FarmDetailsPage />} />
        <Route path="/farmer/farms/:id/edit" element={<EditFarmPage />} />
        <Route path="/farmer/crops" element={<MyCropsPage />} />
        <Route path="/farmer/crops/new" element={<AddCropPage />} />
        <Route path="/farmer/products" element={<MyProductsPage />} />
        <Route path="/farmer/products/new" element={<AddProductPage />} />
        <Route path="/farmer/products/:id/edit" element={<EditProductPage />} />
        <Route path="/farmer/orders" element={<FarmerOrdersPage />} />
        <Route path="/farmer/orders/:id" element={<FarmerOrderDetailsPage />} />
      </Route>

      {/* BUYER Portal Layout */}
      <Route
        element={
          <RoleRoute allowedRoles={['BUYER']}>
            <BuyerLayout />
          </RoleRoute>
        }
      >
        <Route path="/buyer/dashboard" element={<BuyerDashboardPage />} />
        <Route path="/buyer/orders" element={<BuyerOrdersPage />} />
        <Route path="/buyer/orders/:id" element={<BuyerOrderDetailsPage />} />
      </Route>

      {/* ADMIN Portal Layout */}
      <Route
        element={
          <RoleRoute allowedRoles={['ADMIN']}>
            <AdminLayout />
          </RoleRoute>
        }
      >
        <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
        <Route path="/admin/users" element={<UserManagementPage />} />
        <Route path="/admin/products" element={<ProductManagementPage />} />
        <Route path="/admin/categories" element={<CategoryManagementPage />} />
        <Route path="/admin/orders" element={<AdminOrderManagementPage />} />
      </Route>

      {/* Catch-all 404 Route */}
      <Route path="*" element={<MainLayout />}>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};
