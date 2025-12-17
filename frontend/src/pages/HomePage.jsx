import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import { productService, orderService, paymentService, customerService, invoiceService } from '../services/api';
import { FaUsers, FaBoxOpen, FaShoppingCart, FaFileInvoiceDollar, FaMoneyCheckAlt, FaPlus, FaChartBar } from 'react-icons/fa';


const HomePage = () => {
    const role = localStorage.getItem('crm_role');
  const [stats, setStats] = useState({
    customers: 0,
    products: 0,
    orders: 0,
    invoices: 0,
    payments: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      try {
        // Fetch all stats in parallel
        const [customersRes, productsRes, ordersRes, invoicesRes, paymentsRes] = await Promise.all([
          customerService.getAll(),
          productService.getAll(),
          orderService.getAll ? orderService.getAll() : Promise.resolve({ data: [] }),
          invoiceService.getAll(),
          paymentService.getAll(),
        ]);
        setStats({
          customers: Array.isArray(customersRes.data.results) ? customersRes.data.results.length : (Array.isArray(customersRes.data) ? customersRes.data.length : 0),
          products: Array.isArray(productsRes.data.results) ? productsRes.data.results.length : (Array.isArray(productsRes.data) ? productsRes.data.length : 0),
          orders: Array.isArray(ordersRes.data.results) ? ordersRes.data.results.length : (Array.isArray(ordersRes.data) ? ordersRes.data.length : 0),
          invoices: Array.isArray(invoicesRes.data.results) ? invoicesRes.data.results.length : (Array.isArray(invoicesRes.data) ? invoicesRes.data.length : 0),
          payments: Array.isArray(paymentsRes.data.results) ? paymentsRes.data.results.length : (Array.isArray(paymentsRes.data) ? paymentsRes.data.length : 0),
        });
      } catch (e) {
        setStats({ customers: 0, products: 0, orders: 0, invoices: 0, payments: 0 });
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  return (

    <div className="min-h-screen w-screen overflow-x-hidden overflow-y-auto flex">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Topbar />
        <main className="ml-64 pt-20 px-8 min-h-screen">
          <h1 className="text-4xl font-extrabold mb-8 text-gray-900 drop-shadow">Welcome to FC/CRM Dashboard</h1>
          <div className="flex flex-row gap-8 mb-12">
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center min-w-[220px]">
              <FaUsers size={36} className="text-gray-700 mb-2" />
              <span className="text-lg font-semibold text-gray-700">Customers</span>
              <span className="text-3xl font-bold mt-2 text-gray-900">{loading ? '--' : stats.customers}</span>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center min-w-[220px]">
              <FaBoxOpen size={36} className="text-gray-700 mb-2" />
              <span className="text-lg font-semibold text-gray-700">Products</span>
              <span className="text-3xl font-bold mt-2 text-gray-900">{loading ? '--' : stats.products}</span>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center min-w-[220px]">
              <FaShoppingCart size={36} className="text-gray-700 mb-2" />
              <span className="text-lg font-semibold text-gray-700">Orders</span>
              <span className="text-3xl font-bold mt-2 text-gray-900">{loading ? '--' : stats.orders}</span>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center min-w-[220px]">
              <FaFileInvoiceDollar size={36} className="text-gray-700 mb-2" />
              <span className="text-lg font-semibold text-gray-700">Invoices</span>
              <span className="text-3xl font-bold mt-2 text-gray-900">{loading ? '--' : stats.invoices}</span>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center min-w-[220px]">
              <FaMoneyCheckAlt size={36} className="text-gray-700 mb-2" />
              <span className="text-lg font-semibold text-gray-700">Payments</span>
              <span className="text-3xl font-bold mt-2 text-gray-900">{loading ? '--' : stats.payments}</span>
            </div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-start min-h-[280px]">
              <div className="flex items-center gap-2 mb-4 text-gray-700"><FaChartBar size={24} /> <span className="font-semibold text-gray-700">Sales Overview</span></div>
              <div className="flex-1 w-full flex items-center justify-center text-gray-400">[Chart Placeholder]</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-start min-h-[280px]">
              <div className="flex items-center gap-2 mb-4 text-gray-700"><FaChartBar size={24} /> <span className="font-semibold text-gray-700">Revenue Overview</span></div>
              <div className="flex-1 w-full flex items-center justify-center text-gray-400">[Chart Placeholder]</div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Recent Activity</h2>
            <div className="text-gray-400">[Recent activity, logs, or tables will appear here]</div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default HomePage;
