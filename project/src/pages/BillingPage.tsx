import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { 
  CreditCard, ArrowUpRight, Download, CheckCircle,
  Plus
} from 'lucide-react';

const BillingPage: React.FC = () => {
  const { theme } = useTheme();
  
  // Mock invoice data
  const invoices = [
    {
      id: 'INV-2025-001',
      date: 'Jan 15, 2025',
      amount: 49.99,
      status: 'Paid'
    },
    {
      id: 'INV-2024-012',
      date: 'Dec 15, 2024',
      amount: 49.99,
      status: 'Paid'
    },
    {
      id: 'INV-2024-011',
      date: 'Nov 15, 2024',
      amount: 49.99,
      status: 'Paid'
    }
  ];
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
          Billing & Subscription
        </h1>
        <p className={`mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Manage your subscription and billing information
        </p>
      </div>
      
      {/* Current Plan */}
      <div className={`
        rounded-xl p-6 shadow-sm border
        ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}
      `}>
        <div className="flex items-start justify-between">
          <div>
            <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              Current Plan
            </h2>
            <p className={`mt-1 text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              You are currently on the Pro plan
            </p>
          </div>
          
          <button className={`
            px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2
            bg-indigo-600 hover:bg-indigo-700 text-white
          `}>
            <ArrowUpRight size={16} />
            <span>Upgrade Plan</span>
          </button>
        </div>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`
            p-4 rounded-lg
            ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}
          `}>
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Monthly Price
            </p>
            <p className={`mt-2 text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              $49.99
            </p>
            <p className={`mt-1 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Next billing date: Feb 15, 2025
            </p>
          </div>
          
          <div className={`
            p-4 rounded-lg
            ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}
          `}>
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Active Users
            </p>
            <p className={`mt-2 text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              25/50
            </p>
            <p className={`mt-1 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Users included in your plan
            </p>
          </div>
          
          <div className={`
            p-4 rounded-lg
            ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}
          `}>
            <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Storage Used
            </p>
            <p className={`mt-2 text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              45.5 GB
            </p>
            <p className={`mt-1 text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              of 100 GB included storage
            </p>
          </div>
        </div>
      </div>
      
      {/* Payment Method */}
      <div className={`
        rounded-xl p-6 shadow-sm border
        ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}
      `}>
        <div className="flex items-center justify-between mb-6">
          <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Payment Method
          </h2>
          
          <button className={`
            px-4 py-2 rounded-lg text-sm inline-flex items-center gap-2
            ${theme === 'dark' 
              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}
          `}>
            <Plus size={16} />
            <span>Add Method</span>
          </button>
        </div>
        
        <div className={`
          p-4 rounded-lg
          ${theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50'}
        `}>
          <div className="flex items-center gap-4">
            <div className={`
              p-3 rounded-lg
              ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}
            `}>
              <CreditCard size={24} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
            </div>
            
            <div>
              <p className={`font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                •••• •••• •••• 4242
              </p>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Expires 12/25
              </p>
            </div>
            
            <div className={`
              ml-auto px-2.5 py-1 rounded-full text-xs font-medium
              ${theme === 'dark' ? 'bg-emerald-900/30 text-emerald-400' : 'bg-emerald-100 text-emerald-700'}
            `}>
              Default
            </div>
          </div>
        </div>
      </div>
      
      {/* Billing History */}
      <div className={`
        rounded-xl overflow-hidden shadow-sm border
        ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-gray-200'}
      `}>
        <div className="p-6 pb-0">
          <h2 className={`text-lg font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Billing History
          </h2>
        </div>
        
        <div className="mt-6">
          <table className="min-w-full">
            <thead className={theme === 'dark' ? 'bg-gray-700/30' : 'bg-gray-50'}>
              <tr>
                <th className={`
                  px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  Invoice
                </th>
                <th className={`
                  px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  Date
                </th>
                <th className={`
                  px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  Amount
                </th>
                <th className={`
                  px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  Status
                </th>
                <th className={`
                  px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider
                  ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}
                `}>
                  Download
                </th>
              </tr>
            </thead>
            <tbody className={`
              ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'} divide-y
            `}>
              {invoices.map((invoice) => (
                <tr 
                  key={invoice.id}
                  className={`
                    transition-colors
                    ${theme === 'dark' ? 'hover:bg-gray-700/30' : 'hover:bg-gray-50'}
                  `}
                >
                  <td className={`
                    px-6 py-4 whitespace-nowrap text-sm font-medium
                    ${theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600'}
                  `}>
                    {invoice.id}
                  </td>
                  <td className={`
                    px-6 py-4 whitespace-nowrap text-sm
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}>
                    {invoice.date}
                  </td>
                  <td className={`
                    px-6 py-4 whitespace-nowrap text-sm
                    ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}
                  `}>
                    ${invoice.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <CheckCircle size={16} className="text-emerald-500 mr-1.5" />
                      <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {invoice.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button className={`
                      p-1.5 rounded-lg transition-colors inline-flex items-center justify-center
                      ${theme === 'dark' 
                        ? 'text-gray-400 hover:text-gray-300 hover:bg-gray-700' 
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}
                    `}>
                      <Download size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default BillingPage;