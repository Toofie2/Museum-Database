import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('popularity');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [popularityData, setPopularityData] = useState([]);
  const [ticketData, setTicketData] = useState([]);
  const [productData, setProductData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Date change handler with validation
  const handleDateChange = (e, type) => {
    const newDate = e.target.value;
    const today = new Date().toISOString().split('T')[0];
    
    if (type === 'startDate') {
      if (newDate > today) return;
      if (newDate > dateRange.endDate) return;
      setDateRange(prev => ({ ...prev, startDate: newDate }));
    } else {
      if (newDate > today) return;
      if (newDate < dateRange.startDate) return;
      setDateRange(prev => ({ ...prev, endDate: newDate }));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [popularityRes, ticketRes, productRes, employeeRes] = await Promise.all([
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/reports/popularity`, { params: dateRange }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/reports/ticket-revenue`, { params: dateRange }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/reports/product-revenue`, { params: dateRange }),
          axios.get(`${import.meta.env.VITE_BACKEND_URL}/reports/employees`)
        ]);

        const processedPopularityData = popularityRes.data.reduce((acc, item) => {
          const date = item.date_purchased.split('T')[0];
          if (!acc[date]) {
            acc[date] = {
              date,
              total_visitors: 0,
              exhibitions: []
            };
          }
          acc[date].exhibitions.push({
            name: item.exhibition_name,
            visitors: item.total_visitors
          });
          acc[date].total_visitors += item.total_visitors;
          return acc;
        }, {});

        setPopularityData(Object.values(processedPopularityData));
        setTicketData(ticketRes.data);
        setProductData(productRes.data);
        setEmployeeData(employeeRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch report data');
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  const renderPopularityTab = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Daily Visitors</h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={popularityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="date" 
                tickFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <YAxis />
              <Tooltip 
                labelFormatter={(date) => new Date(date).toLocaleDateString()}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="total_visitors" 
                stroke="#2563eb" 
                name="Total Visitors"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Exhibition Visits by Date</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Visitors</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exhibitions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {popularityData.map((day, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(day.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {day.total_visitors}
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      {day.exhibitions.map((exhibition, idx) => (
                        <div key={idx} className="flex justify-between text-sm">
                          <span className="text-gray-900">{exhibition.name}</span>
                          <span className="text-gray-500">{exhibition.visitors} visitors</span>
                        </div>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

    const renderEmployeeTab = () => {
      const departmentGroups = employeeData.reduce((acc, employee) => {
        if (!acc[employee.department]) {
          acc[employee.department] = [];
        }
        acc[employee.department].push(employee);
        return acc;
      }, {});
  
      return (
        <div className="space-y-8">
          {Object.entries(departmentGroups).map(([department, employees]) => (
            <div key={department} className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-4 text-gray-800">{department} Department</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Start Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Tasks</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {employees.map((employee, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {employee.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(employee.hire_date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {employee.tasks.length > 0 ? (
                            <ul className="list-none space-y-2">
                              {employee.tasks.map((task, taskIndex) => (
                                <li key={taskIndex} className="flex flex-col">
                                  <span className="font-medium text-gray-900">{task.name}</span>
                                  <span className="text-gray-500 text-xs">{task.description}</span>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <span className="text-gray-400 italic">No tasks assigned</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      );
    };

  const renderRevenueTab = () => {
    const dailyRevenue = ticketData.reduce((acc, item) => {
      const date = item.date_purchased.split('T')[0];
      if (!acc[date]) {
        acc[date] = {
          date,
          ticket_sales: 0,
          product_sales: 0,
          ticket_revenue: 0,
          product_revenue: 0
        };
      }
      acc[date].ticket_sales += item.tickets_sold;
      acc[date].ticket_revenue += item.total_revenue;
      return acc;
    }, {});

    productData.forEach(item => {
      const date = item.date_purchased.split('T')[0];
      if (!dailyRevenue[date]) {
        dailyRevenue[date] = {
          date,
          ticket_sales: 0,
          product_sales: 0,
          ticket_revenue: 0,
          product_revenue: 0
        };
      }
      dailyRevenue[date].product_sales += item.quantity;
      dailyRevenue[date].product_revenue += item.total_revenue;
    });

    const dailyRevenueData = Object.values(dailyRevenue);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h4 className="text-sm font-medium text-gray-500">Total Revenue</h4>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              ${dailyRevenueData.reduce((sum, day) => 
                sum + day.ticket_revenue + day.product_revenue, 0
              ).toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h4 className="text-sm font-medium text-gray-500">Ticket Revenue</h4>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              ${dailyRevenueData.reduce((sum, day) => 
                sum + day.ticket_revenue, 0
              ).toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h4 className="text-sm font-medium text-gray-500">Product Revenue</h4>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              ${dailyRevenueData.reduce((sum, day) => 
                sum + day.product_revenue, 0
              ).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Daily Revenue</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="date"
                  tickFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <Legend />
                <Bar dataKey="ticket_revenue" name="Ticket Revenue" fill="#2563eb" />
                <Bar dataKey="product_revenue" name="Product Revenue" fill="#10b981" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Table */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Daily Revenue Details</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tickets Sold</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ticket Revenue</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Products Sold</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Product Revenue</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {dailyRevenueData.map((day, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(day.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {day.ticket_sales}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      ${day.ticket_revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {day.product_sales}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      ${day.product_revenue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      ${(day.ticket_revenue + day.product_revenue).toLocaleString()}
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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Reports Dashboard</h1>
          <div className="flex items-center space-x-4">
            <input
              type="date"
              value={dateRange.startDate}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => handleDateChange(e, 'startDate')}
              className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <span className="text-gray-600">to</span>
            <input
              type="date"
              value={dateRange.endDate}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => handleDateChange(e, 'endDate')}
              className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-white rounded-lg shadow p-1">
          <button
            onClick={() => setActiveTab('popularity')}
            className={`flex-1 px-6 py-3 rounded-md transition-colors ${
              activeTab === 'popularity' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Popularity Report
          </button>
          <button
            onClick={() => setActiveTab('revenue')}
            className={`flex-1 px-6 py-3 rounded-md transition-colors ${
              activeTab === 'revenue' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Revenue Report
          </button>
          <button
            onClick={() => setActiveTab('employee')}
            className={`flex-1 px-6 py-3 rounded-md transition-colors ${
              activeTab === 'employee' 
                ? 'bg-blue-500 text-white' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            Employee Report
          </button>
        </div>
        {loading && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        )}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        {!loading && !error && (
          <div className="mt-6">
            {activeTab === 'popularity' && renderPopularityTab()}
            {activeTab === 'revenue' && renderRevenueTab()}
            {activeTab === 'employee' && renderEmployeeTab()}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;