import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const ReportsPage = () => {
  const [activeTab, setActiveTab] = useState('popularity');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
  });
  const [popularityData, setPopularityData] = useState([]);
  const [ticketData, setTicketData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [revenueFilter, setRevenueFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [revenueRange, setRevenueRange] = useState({ min: 0, max: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const filterDataByDateRange = (data, dateRange) => {
    return data
      .filter(item => {
        const itemDate = item.date;
        return itemDate >= dateRange.startDate && itemDate <= dateRange.endDate;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

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
        const [popularityRes, ticketRevenueRes, productRevenueRes, employeeRes] = await Promise.all([
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

        const processedTicketData = ticketRevenueRes.data.reduce((acc, item) => {
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

        const processedProductData = productRevenueRes.data.reduce((acc, item) => {
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
          acc[date].product_sales += item.quantity;
          acc[date].product_revenue += item.total_revenue;
          return acc;
        }, {});

        const combinedTicketData = Object.values(processedTicketData).map(item => ({
          ...item,
          ...processedProductData[item.date] || { product_sales: 0, product_revenue: 0 }
        }));

        setPopularityData(Object.values(processedPopularityData));
        setTicketData(combinedTicketData);
        setEmployeeData(employeeRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch report data');
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  const renderPopularityTab = () => {
    const filteredData = filterDataByDateRange(popularityData, dateRange);
    
    const exhibitionTotals = filteredData.reduce((acc, day) => {
      day.exhibitions.forEach(exhibition => {
        if (!acc[exhibition.name]) {
          acc[exhibition.name] = {
            name: exhibition.name,
            totalVisitors: 0,
            daysWithVisitors: 0
          };
        }
        acc[exhibition.name].totalVisitors += exhibition.visitors;
        acc[exhibition.name].daysWithVisitors += 1;
      });
      return acc;
    }, {});
  
    const tableSortedData = [...filteredData].sort((a, b) => 
      new Date(b.date) - new Date(a.date)
    );
  
    const getTotalVisitors = () => {
      return filteredData.reduce((total, day) => total + day.total_visitors, 0);
    };
  
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full sm:w-64">
                <label htmlFor="sortBy" className="block text-sm font-medium text-gray-700 mb-1">
                  View By
                </label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="date">Daily Breakdown</option>
                  <option value="exhibition">Exhibition Summary</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date Range
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={dateRange.startDate}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleDateChange(e, 'startDate')}
                    className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <span className="text-gray-600">to</span>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    max={new Date().toISOString().split('T')[0]}
                    onChange={(e) => handleDateChange(e, 'endDate')}
                    className="flex-1 rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-end">
              <p className="text-sm text-gray-500">Total Visitors</p>
              <p className="text-2xl font-bold text-gray-900">{getTotalVisitors().toLocaleString()}</p>
            </div>
          </div>
        </div>

        {sortBy === 'date' ? (
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
                  {tableSortedData.map((day, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(day.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {day.total_visitors.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          {day.exhibitions.map((exhibition, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-gray-900">{exhibition.name}</span>
                              <span className="text-gray-500">{exhibition.visitors.toLocaleString()} visitors</span>
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
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-800">Exhibition Summary</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exhibition Name</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total Visitors</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Days with Visitors</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Average Daily Visitors</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.values(exhibitionTotals)
                    .sort((a, b) => b.totalVisitors - a.totalVisitors)
                    .map((exhibition, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {exhibition.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {exhibition.totalVisitors.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {exhibition.daysWithVisitors}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                          {Math.round(exhibition.totalVisitors / exhibition.daysWithVisitors).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderRevenueTab = () => {
    const filteredData = ticketData.filter((day) => {
      const totalRevenue = day.ticket_revenue + day.product_revenue;
      return totalRevenue >= revenueRange.min && totalRevenue <= revenueRange.max;
    });
  
    const tableSortedData = [...filteredData].sort((a, b) =>
      new Date(b.date) - new Date(a.date)
    );
  
    const maxRevenue = Math.max(
      ...filteredData.map((day) => day.ticket_revenue + day.product_revenue)
    );
  
    const getFilteredBarData = () => {
      if (revenueFilter === 'tickets') {
        return filteredData.map((day) => ({
          ...day,
          product_revenue: 0,
          product_sales: 0,
        }));
      }
      if (revenueFilter === 'products') {
        return filteredData.map((day) => ({
          ...day,
          ticket_revenue: 0,
          ticket_sales: 0,
        }));
      }
      return filteredData;
    };
  
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-center gap-2">
              <label className="whitespace-nowrap text-sm text-gray-600">
                Revenue Type
              </label>
              <select
                value={revenueFilter}
                onChange={(e) => setRevenueFilter(e.target.value)}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Revenue</option>
                <option value="tickets">Ticket Revenue Only</option>
                <option value="products">Product Revenue Only</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="whitespace-nowrap text-sm text-gray-600">Min $</label>
              <input
                type="number"
                value={revenueRange.min}
                onChange={(e) =>
                  setRevenueRange((prev) => ({
                    ...prev,
                    min: Math.max(0, Number(e.target.value)),
                  }))
                }
                min="0"
                max={revenueRange.max || maxRevenue}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <label className="whitespace-nowrap text-sm text-gray-600">Max $</label>
              <input
                type="number"
                value={revenueRange.max}
                onChange={(e) =>
                  setRevenueRange((prev) => ({
                    ...prev,
                    max: Math.max(prev.min, Number(e.target.value)),
                  }))
                }
                min={revenueRange.min || 0}
                max={maxRevenue}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={() => setRevenueRange({ min: 0, max: maxRevenue })}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md transition-colors"
              >
                Reset Range
              </button>
            </div>
          </div>
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
  
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h4 className="text-sm font-medium text-gray-500">Total Revenue</h4>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              $
              {filteredData.reduce(
                (sum, day) => sum + day.ticket_revenue + day.product_revenue,
                0
              ).toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h4 className="text-sm font-medium text-gray-500">Ticket Revenue</h4>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              $
              {filteredData.reduce((sum, day) => sum + day.ticket_revenue, 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h4 className="text-sm font-medium text-gray-500">Product Revenue</h4>
            <p className="mt-2 text-3xl font-bold text-gray-900">
              $
              {filteredData.reduce((sum, day) => sum + day.product_revenue, 0).toLocaleString()}
            </p>
          </div>
        </div>
  
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Daily Revenue</h3>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={getFilteredBarData()} margin={{ left: 20, right: 50, top: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(date) => new Date(date).toLocaleDateString()}
                />
                <YAxis
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                  width={80}
                />
                <Tooltip
                  labelFormatter={(date) => new Date(date).toLocaleDateString()}
                  formatter={(value) => [`$${value.toLocaleString()}`, '']}
                />
                <Legend />
                {(revenueFilter === 'all' || revenueFilter === 'tickets') && (
                  <Bar
                    dataKey="ticket_revenue"
                    name="Ticket Revenue"
                    fill="#2563eb"
                  />
                )}
                {(revenueFilter === 'all' || revenueFilter === 'products') && (
                  <Bar
                    dataKey="product_revenue"
                    name="Product Revenue"
                    fill="#10b981"
                  />
                )}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
  
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Daily Revenue Details
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tickets Sold
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ticket Revenue
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Products Sold
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Revenue
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {tableSortedData.map((day, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(day.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {revenueFilter === 'products' ? '-' : day.ticket_sales || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {revenueFilter === 'products' ? '-' : `$${day.ticket_revenue.toLocaleString()}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {revenueFilter === 'tickets' ? '-' : day.product_sales || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                      {revenueFilter === 'tickets' ? '-' : `$${day.product_revenue.toLocaleString()}`}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                      $
                      {(
                        (revenueFilter !== 'products' ? day.ticket_revenue : 0) +
                        (revenueFilter !== 'tickets' ? day.product_revenue : 0)
                      ).toLocaleString()}
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
  
  const renderEmployeeTab = () => {
    const departmentGroups = employeeData.reduce((acc, employee) => {
      if (!acc[employee.department]) {
        acc[employee.department] = [];
      }
      acc[employee.department].push(employee);
      return acc;
    }, {});
  
    const departments = ['All', ...Object.keys(departmentGroups)];
  
    const filteredDepartmentGroups = Object.entries(departmentGroups).reduce((acc, [department, employees]) => {
      const filteredEmployees = employees.filter(employee =>
        employee.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      if (filteredEmployees.length > 0 && 
         (selectedDepartment === 'All' || selectedDepartment === department)) {
        acc[department] = filteredEmployees;
      }
      return acc;
    }, {});
  
    const getTotalEmployees = () => {
      return Object.values(filteredDepartmentGroups).reduce((total, employees) => 
        total + employees.length, 0
      );
    };
  
    return (
      <div className="space-y-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="flex-1">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                  Search by Name
                </label>
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search employees..."
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex-1">
                <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
                  Filter by Department
                </label>
                <select
                  id="department"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-col justify-end">
              <p className="text-sm text-gray-500">Total Employees</p>
              <p className="text-2xl font-bold text-gray-900">{getTotalEmployees()}</p>
            </div>
          </div>
        </div>
  
        {Object.entries(filteredDepartmentGroups).map(([department, employees]) => (
          <div key={department} className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-800">{department} Department</h3>
              <span className="text-sm text-gray-500">
                {employees.length} {employees.length === 1 ? 'Employee' : 'Employees'}
              </span>
            </div>
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
  
        {Object.keys(filteredDepartmentGroups).length === 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="text-center text-gray-500">
              <p className="text-xl font-medium">No Results Found</p>
              <p className="mt-2">No employees match your search criteria. Try adjusting your filters.</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedDepartment('All');
                }}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Reports Dashboard</h1>
        </div>

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