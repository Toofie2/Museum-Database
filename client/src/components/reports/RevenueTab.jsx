// src/components/Reports/RevenueTab.jsx
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export const RevenueTab = ({
  ticketData,
  dateRange,
  handleDateChange,
  revenueRange,
  setRevenueRange,
  revenueFilter,
  setRevenueFilter
}) => {
  // Filter data based on date range and revenue range
  const filteredData = ticketData.filter((day) => {
    const totalRevenue = day.ticket_revenue + day.product_revenue;
    const isInRange =
      totalRevenue >= revenueRange.min && totalRevenue <= revenueRange.max;
    const isInDateRange =
      (!dateRange.startDate ||
        new Date(day.date) >= new Date(dateRange.startDate)) &&
      (!dateRange.endDate || new Date(day.date) <= new Date(dateRange.endDate));
    return isInRange && isInDateRange;
  });

  // Sort data for table (newest to oldest)
  const tableSortedData = [...filteredData].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  // Get data for bar chart (oldest to newest)
  const getFilteredBarData = () => {
    let data = [...filteredData].sort(
      (a, b) => new Date(a.date) - new Date(b.date)
    );

    if (revenueFilter === "tickets") {
      return data.map((day) => ({
        ...day,
        product_revenue: 0,
        product_sales: 0,
      }));
    }
    if (revenueFilter === "products") {
      return data.map((day) => ({
        ...day,
        ticket_revenue: 0,
        ticket_sales: 0,
      }));
    }
    return data;
  };

  // Calculate total revenues for summary cards
  const getTotalRevenue = () => {
    return filteredData
      .reduce(
        (sum, day) => sum + day.ticket_revenue + day.product_revenue,
        0
      )
      .toLocaleString();
  };

  const getTicketRevenue = () => {
    return filteredData
      .reduce((sum, day) => sum + day.ticket_revenue, 0)
      .toLocaleString();
  };

  const getProductRevenue = () => {
    return filteredData
      .reduce((sum, day) => sum + day.product_revenue, 0)
      .toLocaleString();
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
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
            <label className="whitespace-nowrap text-sm text-gray-600">
              Min $
            </label>
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
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <label className="whitespace-nowrap text-sm text-gray-600">
              Max $
            </label>
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
              className="w-full rounded-md border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <button
              onClick={() =>
                setRevenueRange({ 
                  min: 0, 
                  max: Math.max(...filteredData.map(day => day.ticket_revenue + day.product_revenue)) 
                })
              }
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
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) => handleDateChange(e, "startDate")}
            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <span className="text-gray-600">to</span>
          <input
            type="date"
            value={dateRange.endDate}
            max={new Date().toISOString().split("T")[0]}
            onChange={(e) => handleDateChange(e, "endDate")}
            className="border border-gray-300 rounded-md px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h4 className="text-sm font-medium text-gray-500">Total Revenue</h4>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            ${getTotalRevenue()}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h4 className="text-sm font-medium text-gray-500">Ticket Revenue</h4>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            ${getTicketRevenue()}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h4 className="text-sm font-medium text-gray-500">Product Revenue</h4>
          <p className="mt-2 text-3xl font-bold text-gray-900">
            ${getProductRevenue()}
          </p>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Daily Revenue
        </h3>
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={getFilteredBarData()}
              margin={{ left: 20, right: 50, top: 20, bottom: 20 }}
            >
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
                formatter={(value) => [`$${value.toLocaleString()}`, ""]}
              />
              <Legend />
              {(revenueFilter === "all" || revenueFilter === "tickets") && (
                <Bar
                  dataKey="ticket_revenue"
                  name="Ticket Revenue"
                  fill="#2563eb"
                />
              )}
              {(revenueFilter === "all" || revenueFilter === "products") && (
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

      {/* Table */}
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
            <tbody className="divide-y divide-gray-200">
              {tableSortedData.map((day, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(day.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 text-right">
                    {day.ticket_sales}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 text-right">
                    ${day.ticket_revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 text-right">
                    {day.product_sales}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 text-right">
                    ${day.product_revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 text-right">
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