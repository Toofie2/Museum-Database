import React, { useState } from "react";

const Reports = () => {
  const [activeTab, setActiveTab] = useState("revenue"); // Default active tab is 'revenue'

  // Hardcoded Data
  const revenueData = [
    { month: "January", totalRevenue: 5421.07 },
    { month: "February", totalRevenue: 4105.63 },
    { month: "March", totalRevenue: 4521.44 },
  ];

  const reviewsData = [
    { customerName: "John Doe", rating: 5, review: "Excellent experience!" },
    {
      customerName: "Jane Smith",
      rating: 4,
      review: "Very good, but could be better.",
    },
    {
      customerName: "Sam Wilson",
      rating: 3,
      review: "It was okay, but I expected more.",
    },
  ];

  const exhibitionData = [
    {
      exhibitionName: "Impressionist Art",
      numVisits: 120,
      totalRevenue: 3334.21,
      customerTicketIds: "1, 2, 3, 4, 5",
    },
    {
      exhibitionName: "Vincent Van Gogh",
      numVisits: 134,
      totalRevenue: 2765.34,
      customerTicketIds: "1, 2, 3, 4, 5",
    },
    {
      exhibitionName: "Women in Art",
      numVisits: 116,
      totalRevenue: 3482.41,
      customerTicketIds: "1, 2, 3, 4, 5",
    },
    {
      exhibitionName: "Modern Art",
      numVisits: 200,
      totalRevenue: 5721.02,
      customerTicketIds: "6, 7, 8, 9, 10",
    },
    {
      exhibitionName: "Ancient Artifacts",
      numVisits: 80,
      totalRevenue: 1345.55,
      customerTicketIds: "11, 12, 13, 14, 15",
    },
  ];

  const renderTable = (data, title) => (
    <div className="overflow-hidden shadow-lg rounded-lg bg-white">
      <h2 className="text-xl font-semibold p-4 bg-gray-100">{title}</h2>
      <table className="min-w-full table-auto">
        <thead>
          <tr className="bg-gray-50">
            <th className="border-b px-6 py-3 text-left text-sm text-gray-600">
              Exhibition Name
            </th>
            <th className="border-b px-6 py-3 text-left text-sm text-gray-600">
              Number of Visits
            </th>
            <th className="border-b px-6 py-3 text-left text-sm text-gray-600">
              Total Revenue
            </th>
            <th className="border-b px-6 py-3 text-left text-sm text-gray-600">
              Customer Ticket IDs
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="border-b px-6 py-4">{row.exhibitionName}</td>
              <td className="border-b px-6 py-4">{row.numVisits}</td>
              <td className="border-b px-6 py-4">
                ${row.totalRevenue.toFixed(2)}
              </td>
              <td className="border-b px-6 py-4">{row.customerTicketIds}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Reports</h1>

      <div className="mb-6 flex space-x-4">
        <button
          className={`px-4 py-2 rounded-md ${
            activeTab === "revenue" ? "bg-blue-500 text-white" : "bg-gray-100"
          }`}
          onClick={() => setActiveTab("revenue")}
        >
          Revenue
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            activeTab === "reviews" ? "bg-blue-500 text-white" : "bg-gray-100"
          }`}
          onClick={() => setActiveTab("reviews")}
        >
          Reviews
        </button>
        <button
          className={`px-4 py-2 rounded-md ${
            activeTab === "exhibitions"
              ? "bg-blue-500 text-white"
              : "bg-gray-100"
          }`}
          onClick={() => setActiveTab("exhibitions")}
        >
          Exhibitions
        </button>
      </div>

      {activeTab === "revenue" && (
        <div className="overflow-hidden shadow-lg rounded-lg bg-white">
          <h2 className="text-xl font-semibold p-4 bg-gray-100">
            Revenue Report
          </h2>
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="border-b px-6 py-3 text-left text-sm text-gray-600">
                  Month
                </th>
                <th className="border-b px-6 py-3 text-left text-sm text-gray-600">
                  Total Revenue
                </th>
              </tr>
            </thead>
            <tbody>
              {revenueData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border-b px-6 py-4">{row.month}</td>
                  <td className="border-b px-6 py-4">
                    ${row.totalRevenue.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="overflow-hidden shadow-lg rounded-lg bg-white">
          <h2 className="text-xl font-semibold p-4 bg-gray-100">
            Reviews Report
          </h2>
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-50">
                <th className="border-b px-6 py-3 text-left text-sm text-gray-600">
                  Customer Name
                </th>
                <th className="border-b px-6 py-3 text-left text-sm text-gray-600">
                  Rating
                </th>
                <th className="border-b px-6 py-3 text-left text-sm text-gray-600">
                  Review
                </th>
              </tr>
            </thead>
            <tbody>
              {reviewsData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="border-b px-6 py-4">{row.customerName}</td>
                  <td className="border-b px-6 py-4">{row.rating}</td>
                  <td className="border-b px-6 py-4">{row.review}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "exhibitions" &&
        renderTable(exhibitionData, "Exhibition Report")}
    </div>
  );
};

export default Reports;

/*
 






// Revenue by date range (e.g., monthly)

    SELECT
        DATE_FORMAT(ct.date_purchased, '%Y-%m') AS month,
        SUM(ct.amount_spent) AS total_ticket_revenue,
        SUM(cp.amount_spent) AS total_product_revenue,
        SUM(ct.amount_spent) + SUM(cp.amount_spent) AS total_revenue
    FROM
        Customer_Ticket ct
    JOIN
        Customer_Product cp ON cp.customer_ticket_id = ct.customer_ticket_id
    WHERE
        ct.date_purchased BETWEEN '2024-01-01' AND '2024-11-14' AND ct.is_deleted = 0 AND cp.is_deleted = 0
    GROUP BY
        month
    ORDER BY
        month;









  // Exhibition visits by date range

    SELECT
        e.name AS exhibition_name,
        COUNT(DISTINCT ce.customer_ticket_id) AS num_visits
    FROM
        Exhibition e
    JOIN
        Customer_Exhibition ce ON ce.exhibition_id = e.exhibit_id
    JOIN
        Customer_Ticket ct ON ce.customer_ticket_id = ct.customer_ticket_id
    WHERE
        ct.date_visited BETWEEN '2024-01-01' AND '2024-11-14' AND ct.is_deleted = 0
    GROUP BY
        e.name
    ORDER BY
        num_visits DESC;






// Number of reviews by product

    SELECT
        p.name AS product_name,
        COUNT(r.review_id) AS num_reviews
    FROM
        Product p
    JOIN
        Review r ON r.product_id = p.product_id
    WHERE
        r.is_deleted = 0
    GROUP BY
        p.name
    ORDER BY
        num_reviews DESC; 

















*/
