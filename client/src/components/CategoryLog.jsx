import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const CategoryLog = () => {
  const { category } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatPrice = (price) => {
    if (price === null || price === undefined) return "-";
    try {
      const numPrice = Number(price);
      return isNaN(numPrice) ? "-" : `$${numPrice.toFixed(2)}`;
    } catch {
      return "-";
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    try {
      return new Date(date).toLocaleDateString();
    } catch {
      return "-";
    }
  };

  const columnConfig = {
    exhibition: [
      { key: "name", label: "Name" },
      { key: "description", label: "Description" },
      { key: "room_id", label: "Room" },
      {
        key: "start_date",
        label: "Start Date",
        format: formatDate,
      },
      {
        key: "end_date",
        label: "End Date",
        format: formatDate,
      },
      {
        key: "is_active",
        label: "Status",
        format: (_, item) =>
          getExhibitionStatus(item?.startDate, item?.endDate),
      },
    ],
    collection: [
      { key: "title", label: "Name" },
      { key: "description", label: "Description" },
      { key: "room_id", label: "Room" },
      {
        key: "is_active",
        label: "Status",
        format: (_, item) =>
          getExhibitionStatus(item?.startDate, item?.endDate),
      },
    ],
    product: [
      { key: "name", label: "Name" },
      {
        key: "price",
        label: "Price",
        format: formatPrice,
      },
      { key: "stock", label: "Stock" },
      { key: "category", label: "Category" },
    ],
    ticket: [
      { key: "type", label: "Type" },
      {
        key: "price",
        label: "Price",
        format: formatPrice,
      },
      { key: "availability", label: "Available" },
      { key: "validPeriod", label: "Valid Period" },
    ],
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:3000/${category}`);
        const processedData = (response.data || []).map((item, index) => ({
          ...item,
          _id: item.id || `temp-${index}`,
        }));
        setData(processedData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    if (category && columnConfig[category]) {
      fetchData();
    }
  }, [category]);

  if (!category || !columnConfig[category]) {
    return <div className="p-4">Invalid category</div>;
  }

  if (loading) return <div className="p-4">Loading {category} data...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  const columns = columnConfig[category];

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        {`${category.charAt(0).toUpperCase() + category.slice(1)}${
          category === "product" ? "s" : ""
        } Log`}
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow">
          <thead className="bg-grey-light">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-6 py-3 text-left text-sm font-semibold text-grey-dark"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-grey-light">
            {data.map((item) => (
              <tr key={item._id} className="hover:bg-grey-very-light">
                {columns.map((col) => (
                  <td
                    key={`${item._id}-${col.key}`}
                    className="px-6 py-4 text-sm text-grey-dark"
                  >
                    {col.format
                      ? col.format(item[col.key], item)
                      : item[col.key] || "-"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const getExhibitionStatus = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
        Unknown
      </span>
    );
  }

  try {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (now < start) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
          Upcoming
        </span>
      );
    } else if (now > end) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
          Ended
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
          Active
        </span>
      );
    }
  } catch {
    return (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
        Unknown
      </span>
    );
  }
};

export default CategoryLog;
