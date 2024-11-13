import React, { useState } from 'react';

const Reports = () => {
  const [reportType, setReportType] = useState('revenue');
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    employeeId: '',
  });

  const handleReportChange = (event) => {
    setReportType(event.target.value);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const fetchReport = () => {
    // Handle the fetching of the selected report based on the filters
    console.log(`Fetching ${reportType} report with filters`, filters);
  };

  return (
    <div className="reports-page">
      <h1>Reports</h1>
      <div className="report-selector">
        <label htmlFor="report-type">Select Report:</label>
        <select id="report-type" value={reportType} onChange={handleReportChange}>
          <option value="revenue">Revenue Report</option>
          <option value="reviews">Reviews Report</option>
          <option value="employee">Employee Report</option>
        </select>
      </div>

      <div className="report-filters">
        {reportType === 'revenue' && (
          <>
            <label>
              Start Date:
              <input
                type="date"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </label>
            <label>
              End Date:
              <input
                type="date"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
              />
            </label>
          </>
        )}

        {reportType === 'reviews' && (
          <label>
            Employee ID:
            <input
              type="text"
              name="employeeId"
              value={filters.employeeId}
              onChange={handleFilterChange}
            />
          </label>
        )}

        {reportType === 'employee' && (
          <label>
            Employee ID:
            <input
              type="text"
              name="employeeId"
              value={filters.employeeId}
              onChange={handleFilterChange}
            />
          </label>
        )}
      </div>

      <button onClick={fetchReport}>Generate Report</button>
    </div>
  );
};

export default Reports;
