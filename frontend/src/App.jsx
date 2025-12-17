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
  const [isAuthenticated, setIsAuthenticated] = React.useState(!!localStorage.getItem('crm_jwt'));

  React.useEffect(() => {
    const handleStorage = () => {
      setIsAuthenticated(!!localStorage.getItem('crm_jwt'));
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="/" element={isAuthenticated ? <HomePage /> : <LoginPage onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/shop" element={<ProductPage />} />
        <Route path="/website" element={<LandingPage />} />
        <Route path="/customers" element={isAuthenticated ? <CustomersPage /> : <LoginPage onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="/peoples" element={isAuthenticated ? <PeoplesPage /> : <LoginPage onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="/companies" element={isAuthenticated ? <CompaniesPage /> : <LoginPage onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="/invoices" element={isAuthenticated ? <InvoicesPage /> : <LoginPage onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="/payments" element={isAuthenticated ? <PaymentsPage /> : <LoginPage onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="/quotes" element={isAuthenticated ? <QuotesPage /> : <LoginPage onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="/leads" element={isAuthenticated ? <LeadsPage /> : <LoginPage onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="/offers-for-leads" element={isAuthenticated ? <OffersForLeadsPage /> : <LoginPage onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="/expenses" element={isAuthenticated ? <ExpensesPage /> : <LoginPage onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="/expense-category" element={isAuthenticated ? <ExpenseCategoryPage /> : <LoginPage onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="/products" element={isAuthenticated ? <ProductsPage /> : <LoginPage onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="/products-category" element={isAuthenticated ? <ProductsCategoryPage /> : <LoginPage onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="/report" element={isAuthenticated ? <ReportPage /> : <LoginPage onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="/orders" element={isAuthenticated ? <OrderPage /> : <LoginPage onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="/settings" element={isAuthenticated ? <SettingsPage /> : <LoginPage onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="/user-management" element={isAuthenticated ? <RequireManagerOrAdmin><UserManagementPage /></RequireManagerOrAdmin> : <LoginPage onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="/admin/website-controller" element={isAuthenticated ? <WebsiteController /> : <LoginPage onLogin={() => setIsAuthenticated(true)} />} />
        <Route path="/api-debug" element={<APIDebugPage />} />
        <Route path="/website" element={<WebsitePage />} />
      </Routes>
    </Router>
  );
}

export default App;
