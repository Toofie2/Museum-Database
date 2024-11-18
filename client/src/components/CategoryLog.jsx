import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useOutletContext } from "react-router-dom";
import EditItemModal from "./EditItemModal";

const CategoryLog = () => {
  const { refreshTrigger, setRefreshTrigger } = useOutletContext() || {};
  const { category } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/${category}`
        );
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
  }, [category, refreshTrigger]);

  const handleEdit = (item) => {
    setIsEditModalOpen(false);
    setEditingItem(null);

    setTimeout(() => {
      setEditingItem(item);
      setIsEditModalOpen(true);
    }, 0);
  };

  const handleDelete = async (e, item) => {
    e.stopPropagation();

    if (!window.confirm(`Are you sure you want to delete this ${category}?`)) {
      return;
    }

    try {
      let itemId;
      switch (category) {
        case "exhibition":
          itemId = item.exhibit_id;
          break;
        case "collection":
          itemId = item.collection_id;
          break;
        case "art":
          itemId = item.art_id;
          break;
        case "artist":
          itemId = item.artist_id;
          break;
        case "product":
          itemId = item.product_id;
          break;
        case "ticket":
          itemId = item.ticket_id;
          break;
        default:
          itemId = item.id;
      }

      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/${category}/${itemId}`
      );

      // Refresh data after successful deletion
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/${category}`
      );
      const processedData = (response.data || []).map((item, index) => ({
        ...item,
        _id: item.id || `temp-${index}`,
      }));
      setData(processedData);

      if (setRefreshTrigger) {
        setRefreshTrigger((prev) => prev + 1);
      }
    } catch (err) {
      setError(`Failed to delete ${category}: ${err.message}`);
      setTimeout(() => {
        setError(null);
      }, 5000); // Clear error after 5 seconds
    }
  };

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

  const getStatus = (isActive, startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;

    if (!isActive) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
          Inactive
        </span>
      );
    }

    if (now < start) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
          Upcoming
        </span>
      );
    }

    if (end && now > end) {
      return (
        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
          Ended
        </span>
      );
    }

    return (
      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
        Active
      </span>
    );
  };

  const columnConfig = {
    exhibition: [
      { key: "name", label: "Name" },
      { key: "description", label: "Description" },
      { key: "room_name", label: "Room" },
      {
        key: "admission_price",
        label: "Admission",
        format: formatPrice,
      },
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
        format: (isActive, item) =>
          getStatus(isActive, item.start_date, item.end_date),
      },
    ],
    collection: [
      { key: "title", label: "Name" },
      { key: "description", label: "Description" },
      { key: "room_name", label: "Room" },
    ],
    art: [
      { key: "art_title", label: "Title" },
      { key: "art_desc", label: "Description" },
      { key: "artist_name", label: "Artist" },
      { key: "art_medium", label: "Medium" },
      {
        key: "location",
        label: "Location",
        format: (_, item) => {
          if (item.collection_name) {
            return `Collection: ${item.collection_name}`;
          } else if (item.exhibition_name) {
            return `Exhibition: ${item.exhibition_name}`;
          }
          return "-";
        },
      },
      { key: "date_created", label: "Date Created", format: formatDate },
      { key: "date_received", label: "Date Received", format: formatDate },
    ],
    artist: [
      { key: "first_name", label: "First Name" },
      { key: "middle_initial", label: "Middle Initial" },
      { key: "last_name", label: "Last Name" },
    ],
    product: [
      { key: "name", label: "Name" },
      { key: "description", label: "Description" },
      { key: "quantity", label: "Quantity" },
      {
        key: "price",
        label: "Price",
        format: formatPrice,
      },
      { key: "date_added", label: "Date Added", format: formatDate },
      { key: "category_name", label: "Category" },
    ],
    ticket: [
      { key: "type", label: "Type" },
      {
        key: "price",
        label: "Price",
        format: formatPrice,
      },
      { key: "requirement", label: "Requirement" },
    ],
  };

  if (!category || !columnConfig[category]) {
    return <div className="p-4">Invalid category</div>;
  }

  if (loading) return <div className="p-4">Loading {category} data...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  const columns = columnConfig[category];

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">
        {`${category.charAt(0).toUpperCase() + category.slice(1)}${
          category === "product" ? "s" : ""
        } Log`}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>
      )}

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
              <th className="px-6 py-3 text-left text-sm font-semibold text-grey-dark">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-grey-light">
            {data.map((item) => (
              <tr
                key={item._id}
                className="hover:bg-grey-very-light cursor-pointer"
                onClick={() => handleEdit(item)}
              >
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
                <td className="px-6 py-4 text-sm text-grey-dark flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(item);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <span className="material-symbols-outlined">edit</span>
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, item)}
                    className="text-red-600 hover:text-red-800"
                    title="Delete"
                  >
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingItem && (
        <EditItemModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingItem(null);
          }}
          category={category}
          item={editingItem}
          onSuccess={() => {
            const fetchData = async () => {
              try {
                const response = await axios.get(
                  `${import.meta.env.VITE_BACKEND_URL}/${category}`
                );
                const processedData = (response.data || []).map(
                  (item, index) => ({
                    ...item,
                    _id: item.id || `temp-${index}`,
                  })
                );
                setData(processedData);
              } catch (err) {
                setError(err.message);
              }
            };

            fetchData();
            if (setRefreshTrigger) {
              setRefreshTrigger((prev) => prev + 1);
            }
            setIsEditModalOpen(false);
            setEditingItem(null);
          }}
        />
      )}
    </div>
  );
};

export default CategoryLog;
