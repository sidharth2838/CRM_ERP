import UserManagementPage from './pages/UserManagementPage';
import WebsiteController from './pages/FrontPageEditor';
import ProductPage from './pages/ProductPage';
import CatalogPage from './pages/CatalogPage';
import LandingPage from './pages/LandingPage';
import APIDebugPage from './pages/APIDebugPage';

function RequireManagerOrAdmin({ children }) {
  const role = localStorage.getItem('crm_role');
  if (role === 'admin' || role === 'manager') {
    return children;
  }
  window.location.replace('/');
  return null;
}
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import CozyFrontPage from './pages/CozyFrontPage';
import WebsitePage from './pages/WebsitePage';
import LoginPage from './pages/LoginPage';
import CustomersPage from './pages/CustomersPage';
import PeoplesPage from './pages/PeoplesPage';
import CompaniesPage from './pages/CompaniesPage';
import InvoicesPage from './pages/InvoicesPage';
import PaymentsPage from './pages/PaymentsPage';
import QuotesPage from './pages/QuotesPage';
import LeadsPage from './pages/LeadsPage';
import OffersForLeadsPage from './pages/OffersForLeadsPage';
import ExpensesPage from './pages/ExpensesPage';
import ExpenseCategoryPage from './pages/ExpenseCategoryPage';
import ProductsPage from './pages/ProductsPage';
import ProductsCategoryPage from './pages/ProductsCategoryPage';
import ReportPage from './pages/ReportPage';
import OrderPage from './pages/OrderPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={() => {}} />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/shop" element={<ProductPage />} />
        <Route path="/website" element={<LandingPage />} />
        <Route path="/customers" element={<CustomersPage />} />
        <Route path="/peoples" element={<PeoplesPage />} />
        <Route path="/companies" element={<CompaniesPage />} />
        <Route path="/invoices" element={<InvoicesPage />} />
        <Route path="/payments" element={<PaymentsPage />} />
        <Route path="/quotes" element={<QuotesPage />} />
        <Route path="/leads" element={<LeadsPage />} />
        <Route path="/offers-for-leads" element={<OffersForLeadsPage />} />
        <Route path="/expenses" element={<ExpensesPage />} />
        <Route path="/expense-category" element={<ExpenseCategoryPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route path="/products-category" element={<ProductsCategoryPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/orders" element={<OrderPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/user-management" element={<RequireManagerOrAdmin><UserManagementPage /></RequireManagerOrAdmin>} />
        <Route path="/admin/website-controller" element={<WebsiteController />} />
        <Route path="/api-debug" element={<APIDebugPage />} />
        <Route path="/website" element={<WebsitePage />} />
      </Routes>
    </Router>
  );
}

export default App;
