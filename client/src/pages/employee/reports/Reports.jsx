// src/pages/employee/reports/Reports.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { PopularityTab } from "../../../components/reports/PopularityTab";
import { RevenueTab } from "../../../components/reports/RevenueTab";
import { EmployeeTab } from "../../../components/reports/EmployeeTab";

const ReportsPage = () => {
  // =============== STATE MANAGEMENT ===============
  const [activeTab, setActiveTab] = useState("popularity");
  const [dateRange, setDateRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  });
  const [popularityData, setPopularityData] = useState([]);
  const [ticketData, setTicketData] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [revenueFilter, setRevenueFilter] = useState("all");
  const [sortBy, setSortBy] = useState("date");
  const [revenueRange, setRevenueRange] = useState({ min: 0, max: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDateChange = (e, type) => {
    const newDate = e.target.value;
    const today = new Date().toISOString().split("T")[0];

    if (type === "startDate") {
      if (newDate > today) return;
      if (newDate > dateRange.endDate) return;
      setDateRange((prev) => ({ ...prev, startDate: newDate }));
    } else {
      if (newDate > today) return;
      if (newDate < dateRange.startDate) return;
      setDateRange((prev) => ({ ...prev, endDate: newDate }));
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const popularityRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/reports/popularity`,
          { params: dateRange }
        );
        const ticketRevenueRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/reports/ticket-revenue`,
          { params: dateRange }
        );
        const productRevenueRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/reports/product-revenue`,
          { params: dateRange }
        );
        const employeeRes = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/reports/employees`
        );
        const processedPopularityData = popularityRes.data.reduce((acc, item) => {
          if (!item.date_purchased) return acc;
          
          const date = new Date(item.date_purchased).toISOString().split('T')[0];
          if (!acc[date]) {
            acc[date] = {
              date,
              total_visitors: 0,
              exhibitions: [],
            };
          }
          
          if (item.exhibition_name && item.total_visitors) {
            acc[date].exhibitions.push({
              name: item.exhibition_name,
              visitors: item.total_visitors,
              average_rating: item.average_rating,
              start_date: new Date(item.start_date).toISOString().split('T')[0],
              end_date: new Date(item.end_date).toISOString().split('T')[0],
            });
            acc[date].total_visitors += item.total_visitors;
          }
          
          return acc;
        }, {});

        const revenueData = ticketRevenueRes.data.map((ticketDay) => {
          const productDay = productRevenueRes.data.find(
            (p) => new Date(p.date).toISOString().split('T')[0] === new Date(ticketDay.date).toISOString().split('T')[0]
          ) || { quantity: 0, product_revenue: 0 };

          return {
            date: new Date(ticketDay.date).toISOString().split('T')[0],
            ticket_sales: ticketDay.tickets_sold || 0,
            ticket_revenue: ticketDay.ticket_revenue || 0,
            product_sales: productDay.quantity || 0,
            product_revenue: productDay.product_revenue || 0,
          };
        });

        const processedEmployeeData = employeeRes.data.map(emp => ({
          ...emp,
          tasks: emp.tasks || []
        }));

        const maxRevenue = Math.max(
          ...revenueData.map(
            (day) => (day.ticket_revenue || 0) + (day.product_revenue || 0)
          ),
          0
        );

        setPopularityData(Object.values(processedPopularityData));
        setTicketData(revenueData);
        setEmployeeData(processedEmployeeData);
        setRevenueRange((prev) => ({ min: 0, max: maxRevenue }));

        setLoading(false);
      } catch (err) {
        console.error('Error details:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status,
        });
        setError(
          err.response?.data?.error || 
          err.message || 
          "Failed to fetch report data"
        );
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  useEffect(() => {
    console.log('Active tab:', activeTab);
    console.log('Current data for tab:', {
      popularity: popularityData,
      revenue: ticketData,
      employee: employeeData
    });
  }, [activeTab, popularityData, ticketData, employeeData]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Reports Dashboard
          </h1>
        </div>
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-white rounded-lg shadow p-1">
          {[
            { id: "popularity", label: "Exhibition Popularity" },
            { id: "revenue", label: "Revenue" },
            { id: "employee", label: "Staff Performance" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 px-6 py-3 rounded-md transition-colors ${
                activeTab === tab.id
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        {/* Loading Display */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : (
          /* Main Content */
          <div className="mt-6">
            {activeTab === "popularity" && popularityData && (
              <PopularityTab
                popularityData={popularityData}
                dateRange={dateRange}
                handleDateChange={handleDateChange}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
            )}
            {activeTab === "revenue" && ticketData && (
              <RevenueTab
                ticketData={ticketData}
                dateRange={dateRange}
                handleDateChange={handleDateChange}
                revenueRange={revenueRange}
                setRevenueRange={setRevenueRange}
                revenueFilter={revenueFilter}
                setRevenueFilter={setRevenueFilter}
              />
            )}
            {activeTab === "employee" && employeeData && (
              <EmployeeTab
                employeeData={employeeData}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedDepartment={selectedDepartment}
                setSelectedDepartment={setSelectedDepartment}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsPage;