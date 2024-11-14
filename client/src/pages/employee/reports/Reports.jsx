import React, { useState, useEffect } from 'react';

const Reports = () => {
  const [activeTab, setActiveTab] = useState('revenue'); // Default active tab is 'revenue'
  const [revenueData, setRevenueData] = useState(null);
  const [employeeRevenueData, setEmployeeRevenueData] = useState(null);
  const [reviewsData, setReviewsData] = useState(null);
  const [exhibitionData, setExhibitionData] = useState(null); // Added for exhibition report
  const [error, setError] = useState(null);

  // Fetch Revenue Data
  useEffect(() => {
    const fetchRevenueReport = async () => {
      try {
        console.log('Fetching revenue data...');
        const response = await fetch('http://localhost:3000/api/reports/revenue');
        if (!response.ok) {
          throw new Error('Failed to fetch revenue report');
        }
        const data = await response.json();
        console.log('Revenue data:', data);
        setRevenueData(data);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
        setError(error.message);
      }
    };
    if (activeTab === 'revenue') {
      fetchRevenueReport();
    }
  }, [activeTab]);

  // Fetch Employee Revenue Data
  useEffect(() => {
    const fetchEmployeeRevenueReport = async () => {
      try {
        console.log('Fetching employee revenue data...');
        const response = await fetch('http://localhost:3000/api/reports/employee-revenue'); // Placeholder endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch employee revenue report');
        }
        const data = await response.json();
        console.log('Employee revenue data:', data);
        setEmployeeRevenueData(data);
      } catch (error) {
        console.error('Error fetching employee revenue data:', error);
        setError(error.message);
      }
    };
    if (activeTab === 'employee-revenue') {
      fetchEmployeeRevenueReport();
    }
  }, [activeTab]);

  // Fetch Reviews Data
  useEffect(() => {
    const fetchReviewsReport = async () => {
      try {
        console.log('Fetching reviews data...');
        const response = await fetch('http://localhost:3000/api/reports/reviews'); // Placeholder endpoint
        if (!response.ok) {
          throw new Error('Failed to fetch reviews report');
        }
        const data = await response.json();
        console.log('Reviews data:', data);
        setReviewsData(data);
      } catch (error) {
        console.error('Error fetching reviews data:', error);
        setError(error.message);
      }
    };
    if (activeTab === 'reviews') {
      fetchReviewsReport();
    }
  }, [activeTab]);

  // Fetch Exhibition Report Data
  useEffect(() => {
    const fetchExhibitionReport = async () => {
      try {
        console.log('Fetching exhibition data...');
        const response = await fetch('http://localhost:3000/api/reports/exhibition-report'); // Added new endpoint for exhibition report
        if (!response.ok) {
          throw new Error(`Failed to fetch exhibition report: ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Exhibition data:', data);
        setExhibitionData(data);
      } catch (error) {
        console.error('Error fetching exhibition data:', error);
        setError(error.message);
      }
    };
    if (activeTab === 'exhibitions') {
      fetchExhibitionReport();
    }
  }, [activeTab]);

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const renderTable = (data, title) => (
    <div className="overflow-hidden shadow-lg rounded-lg bg-white">
      <h2 className="text-xl font-semibold p-4 bg-gray-100">{title}</h2>
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-50">
            <th className="border-b px-6 py-3 text-left text-sm text-gray-600">Exhibition Name</th>
            <th className="border-b px-6 py-3 text-left text-sm text-gray-600">Number of Visits</th>
            <th className="border-b px-6 py-3 text-left text-sm text-gray-600">Total Revenue</th>
            <th className="border-b px-6 py-3 text-left text-sm text-gray-600">Customer Ticket IDs</th>
          </tr>
        </thead>
        <tbody>
          {data ? (
            data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="border-b px-6 py-4">{row.exhibition_name}</td>
                <td className="border-b px-6 py-4">{row.num_visits}</td>
                <td className="border-b px-6 py-4">{`$${row.total_revenue.toFixed(2)}`}</td>
                <td className="border-b px-6 py-4">{row.customer_ticket_ids}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="px-6 py-4 text-center text-gray-500">Loading...</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Reports</h1>

      <div className="mb-6 flex space-x-4">
        <button
          className={`px-4 py-2 rounded-md ${activeTab === 'revenue' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          onClick={() => setActiveTab('revenue')}
        >
          Revenue
        </button>
        <button
          className={`px-4 py-2 rounded-md ${activeTab === 'employee-revenue' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          onClick={() => setActiveTab('employee-revenue')}
        >
          Employee Revenue
        </button>
        <button
          className={`px-4 py-2 rounded-md ${activeTab === 'reviews' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          onClick={() => setActiveTab('reviews')}
        >
          Reviews
        </button>
        <button
          className={`px-4 py-2 rounded-md ${activeTab === 'exhibitions' ? 'bg-blue-500 text-white' : 'bg-gray-100'}`}
          onClick={() => setActiveTab('exhibitions')}
        >
          Exhibitions
        </button>
      </div>

      {activeTab === 'revenue' && revenueData && renderTable(revenueData, 'Revenue Report')}
      {activeTab === 'employee-revenue' && employeeRevenueData && renderTable(employeeRevenueData, 'Employee Revenue Report')}
      {activeTab === 'reviews' && reviewsData && renderTable(reviewsData, 'Reviews Report')}
      {activeTab === 'exhibitions' && exhibitionData && renderTable(exhibitionData, 'Exhibition Report')}
    </div>
  );
};

export default Reports;
