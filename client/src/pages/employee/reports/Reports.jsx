import React, { useState, useEffect } from 'react';

const Reports = () => {
  // Get today's date and a month ago for default date range
  const today = new Date();
  const monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  // Format dates for input fields (YYYY-MM-DD)
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // State management
  const [popularityReport, setPopularityReport] = useState([]);
  const [employeeReport, setEmployeeReport] = useState([]);
  const [revenueReport, setRevenueReport] = useState({
    tickets: [],
    products: []
  });
  const [activeReport, setActiveReport] = useState('popularity');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: formatDate(monthAgo),
    endDate: formatDate(today)
  });

  // API base URL
  const API_BASE_URL = 'http://localhost:3000';

  // Fetch helper function with error handling
  const fetchData = async (endpoint, params = {}) => {
    try {
      const queryParams = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}${endpoint}${queryParams ? `?${queryParams}` : ''}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Fetch error:', error);
      if (error.message.includes('Failed to fetch')) {
        throw new Error('Unable to connect to server. Please check if the server is running.');
      }
      throw error;
    }
  };

  // Fetch popularity report
  const fetchPopularityReport = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchData('/reports/popularity');
      setPopularityReport(data);
    } catch (err) {
      console.error('Popularity report error:', err);
      setError(err.message);
      setPopularityReport([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch employee report
  const fetchEmployeeReport = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchData('/reports/employees');
      setEmployeeReport(data || []);
    } catch (err) {
      console.error('Employee report error:', err);
      setError(err.message);
      setEmployeeReport([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch revenue report
  const fetchRevenueReport = async () => {
    setLoading(true);
    setError('');
    try {
      const [tickets, products] = await Promise.all([
        fetchData('/reports/ticket-revenue', {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        }),
        fetchData('/reports/product-revenue', {
          startDate: dateRange.startDate,
          endDate: dateRange.endDate
        })
      ]);
      
      setRevenueReport({ 
        tickets: tickets || [], 
        products: products || [] 
      });
    } catch (err) {
      console.error('Revenue report error:', err);
      setError(err.message);
      setRevenueReport({ tickets: [], products: [] });
    } finally {
      setLoading(false);
    }
  };

  // Handle date changes
  const handleDateChange = (field, value) => {
    const newDate = new Date(value);
    const todayDate = new Date();
    todayDate.setHours(23, 59, 59, 999);

    if (newDate > todayDate) {
      return; // Don't allow future dates
    }

    setDateRange(prev => {
      const newRange = { ...prev, [field]: value };

      // Ensure startDate isn't after endDate
      if (field === 'startDate' && new Date(value) > new Date(prev.endDate)) {
        newRange.endDate = value;
      }
      // Ensure endDate isn't before startDate
      if (field === 'endDate' && new Date(value) < new Date(prev.startDate)) {
        newRange.startDate = value;
      }

      return newRange;
    });
  };

  // Filter data based on search term
  const filterData = (data) => {
    if (!searchTerm || !data) return data;
    const term = searchTerm.toLowerCase();
    
    switch (activeReport) {
      case 'popularity':
        return data.filter(item => 
          item.exhibition_name?.toLowerCase().includes(term)
        );
        
      case 'employee':
        return data.filter(item =>
          item.name?.toLowerCase().includes(term) ||
          item.department?.toLowerCase().includes(term) ||
          item.email?.toLowerCase().includes(term)
        );
        
      case 'revenue':
        return {
          tickets: data.tickets?.filter(item =>
            item.exhibition_name?.toLowerCase().includes(term)
          ) || [],
          products: data.products?.filter(item =>
            item.product_name?.toLowerCase().includes(term)
          ) || []
        };
        
      default:
        return data;
    }
  };

  // Fetch data when report type or dates change
  useEffect(() => {
    const loadReport = async () => {
      switch (activeReport) {
        case 'popularity':
          await fetchPopularityReport();
          break;
        case 'employee':
          await fetchEmployeeReport();
          break;
        case 'revenue':
          await fetchRevenueReport();
          break;
      }
    };

    loadReport();
  }, [activeReport, dateRange.startDate, dateRange.endDate]);

  // Render popularity report
  const renderPopularityReport = (data) => {
    const filteredData = filterData(data) || [];
    
    return filteredData.length === 0 ? (
      <p className="text-gray-500 text-center py-4">No popularity data available</p>
    ) : (
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <table className="w-full border-collapse bg-white text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-gray-900 font-semibold text-lg">Exhibition Name</th>
              <th className="p-4 text-gray-900 font-semibold text-lg text-right">Total Visitors</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredData.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-4 text-gray-800">{item.exhibition_name || 'N/A'}</td>
                <td className="p-4 text-gray-800 text-right font-medium">
                  {(item.total_visitors || 0).toLocaleString()}
                </td>
              </tr>
            ))}
            <tr className="bg-gray-50 font-semibold">
              <td className="p-4 text-gray-900">Total</td>
              <td className="p-4 text-gray-900 text-right">
                {filteredData
                  .reduce((sum, item) => sum + (item.total_visitors || 0), 0)
                  .toLocaleString()}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  };

  // Render employee report
  const renderEmployeeReport = (data) => {
    const filteredData = filterData(data) || [];
    return filteredData.length === 0 ? (
      <p className="text-gray-500 text-center py-4">No employee data available</p>
    ) : (
      <table className="w-full border-collapse">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-4 border">Name</th>
            <th className="p-4 border">Department</th>
            <th className="p-4 border">Email</th>
            <th className="p-4 border">Tasks</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-4 border">{item.name || 'N/A'}</td>
              <td className="p-4 border">{item.department || 'N/A'}</td>
              <td className="p-4 border">{item.email || 'N/A'}</td>
              <td className="p-4 border">
                {item.tasks && item.tasks.length > 0 ? (
                  <ul className="list-disc pl-4">
                    {item.tasks.map((task, taskIndex) => (
                      <li key={taskIndex}>{task.description}</li>
                    ))}
                  </ul>
                ) : (
                  'No tasks assigned'
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  // Render revenue report
  const renderRevenueReport = (data) => {
    if (!data?.tickets || !data?.products) {
      return <p className="text-gray-500 text-center py-4">No revenue data available</p>;
    }

    const filteredData = filterData(data);
    
    return (
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-bold mb-4">Ticket Revenue</h3>
          {filteredData.tickets.length === 0 ? (
            <p className="text-gray-500">No ticket revenue data available</p>
          ) : (
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 border">Exhibition Name</th>
                  <th className="p-4 border">Date</th>
                  <th className="p-4 border text-right">Total Revenue</th>
                  <th className="p-4 border text-right">Tickets Sold</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.tickets.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-4 border">{item.exhibition_name || 'N/A'}</td>
                    <td className="p-4 border">{new Date(item.date_purchased).toLocaleDateString()}</td>
                    <td className="p-4 border text-right">${(item.total_revenue || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    <td className="p-4 border text-right">{(item.tickets_sold || 0).toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-semibold">
                  <td className="p-4 border" colSpan="2">Total</td>
                  <td className="p-4 border text-right">
                    ${filteredData.tickets
                      .reduce((sum, item) => sum + (item.total_revenue || 0), 0)
                      .toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </td>
                  <td className="p-4 border text-right">
                    {filteredData.tickets
                      .reduce((sum, item) => sum + (item.tickets_sold || 0), 0)
                      .toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>

        <div>
          <h3 className="text-xl font-bold mb-4">Product Revenue</h3>
          {filteredData.products.length === 0 ? (
            <p className="text-gray-500">No product revenue data available</p>
          ) : (
            <table className="w-full border-collapse">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-4 border">Product Name</th>
                  <th className="p-4 border">Date</th>
                  <th className="p-4 border text-right">Total Revenue</th>
                  <th className="p-4 border text-right">Units Sold</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.products.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="p-4 border">{item.product_name || 'N/A'}</td>
                    <td className="p-4 border">{new Date(item.date_purchased).toLocaleDateString()}</td>
                    <td className="p-4 border text-right">${(item.total_revenue || 0).toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</td>
                    <td className="p-4 border text-right">{(item.quantity || 0).toLocaleString()}</td>
                  </tr>
                ))}
                <tr className="bg-gray-50 font-semibold">
                  <td className="p-4 border" colSpan="2">Total</td>
                  <td className="p-4 border text-right">
                    ${filteredData.products
                      .reduce((sum, item) => sum + (item.total_revenue || 0), 0)
                      .toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                  </td>
                  <td className="p-4 border text-right">
                    {filteredData.products
                      .reduce((sum, item) => sum + (item.quantity || 0), 0)
                      .toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Museum Reports</h1>
      
      {/* Report Selection */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${activeReport === 'popularity' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveReport('popularity')}
        >
          Popularity Report
        </button>
        <button
          className={`px-4 py-2 rounded ${activeReport === 'employee' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveReport('employee')}
        >
          Employee Report
        </button>
        <button
          className={`px-4 py-2 rounded ${activeReport === 'revenue' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveReport('revenue')}
        >
          Revenue Report
        </button>
      </div>
      
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          placeholder="Search..."
          className="px-4 py-2 border rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="date"
          className="px-4 py-2 border rounded"
          value={dateRange.startDate}
          onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
        />
        <input
          type="date"
          className="px-4 py-2 border rounded"
          value={dateRange.endDate}
          onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
        />
      </div>

      {loading && (
        <div className="text-center py-4">
          <p className="text-gray-600">Loading report data...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded p-4 mb-6">
          <p className="text-red-600">{error}</p>
          <button 
            className="text-sm text-red-500 underline mt-2"
            onClick={() => {
              setError('');
              switch (activeReport) {
                case 'popularity':
                  fetchPopularityReport();
                  break;
                case 'employee':
                  fetchEmployeeReport();
                  break;
                case 'revenue':
                  fetchRevenueReport();
                  break;
              }
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="mt-6">
          {activeReport === 'popularity' && renderPopularityReport(popularityReport)}
          {activeReport === 'employee' && renderEmployeeReport(employeeReport)}
          {activeReport === 'revenue' && renderRevenueReport(revenueReport)}
        </div>
      )}
    </div>
  );
};

export default Reports;
