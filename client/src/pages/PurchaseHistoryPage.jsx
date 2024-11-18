import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../components/authentication";
import NavbarBlack from "../components/NavbarBlack";
import { useNavigate } from "react-router-dom";

const PurchaseHistoryPage = () => {
  const { userId } = useAuth();
  const [ticketHistory, setTicketHistory] = useState([]);
  const [exhibitionHistory, setExhibitionHistory] = useState([]);
  const [productHistory, setProductHistory] = useState([])

  const fetchCustomerTickets = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/customer_ticket/${userId}/history`
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching customer tickets:", error);
    }
  };

  const fetchCustomerExhibitions = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/customer_exhibition/${userId}/history`
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching customer exhibitions:", error);
    }
  };

  const fetchCustomerProducts = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/customer_product/${userId}/history`
      );
      return res.data;
    } catch (error) {
      console.error("Error fetching customer exhibitions:", error);
    }
  };

  useEffect(() => {
    const getCustomerHistory = async () => {
      const receivedTicketHistory = await fetchCustomerTickets();
      setTicketHistory(receivedTicketHistory);
      const receivedExhibitionHistory = await fetchCustomerExhibitions();
      setExhibitionHistory(receivedExhibitionHistory);
      const receivedProductHistory = await fetchCustomerProducts();
      setProductHistory(receivedProductHistory);
    }
    getCustomerHistory();
  }, [userId]);



  //const { refreshTrigger, setRefreshTrigger } = useOutletContext() || {};
  const { category } = "ticket";//useParams();
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
          `${import.meta.env.VITE_BACKEND_URL}/customer_${category}/${userId}/history`
          //`${import.meta.env.VITE_BACKEND_URL}/${category}`
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
    ticket: [
      { key: "type", label: "Type" },
      {
        key: "amount_spent",
        label: "Amount Spent",
        format: formatPrice,
      },
      { key: "date_purchased", label: "Date Purchased" , format: formatDate },
      { key: "valid_day", label: "Valid Day" , format: formatDate },
    ],
    exhibition: [
      { key: "name", label: "Name" },
      {
        key: "amount_spent",
        label: "Amount Spent",
        format: formatPrice,
      },
      { key: "date_purchased", label: "Date Purchased" , format: formatDate },
      { key: "valid_day", label: "Valid Day" , format: formatDate },
    ],
    product: [
      { key: "name", label: "Name" },
      {
        key: "amount_spent",
        label: "Amount Spent",
        format: formatPrice,
      },
      { key: "quantity", label: "Quantity" },
      {
        key: "price",
        label: "Price",
        format: formatPrice,
      },
      { key: "date_purchased", label: "Date Purchased" , format: formatDate },
    ],
    collection: [
      { key: "title", label: "Name" },
      { key: "description", label: "Description" },
      { key: "room_name", label: "Room" },
    ],
  };

  if (!category || !columnConfig[category]) {
    return <div className="p-4">Invalid category</div>;
  }

  if (loading) return <div className="p-4">Loading {category} data...</div>;
  if (error) return <div className="p-4 text-red-600">Error: {error}</div>;

  const columns = columnConfig[category];


  return (
    <div>
      <NavbarBlack/>


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
    </div>

      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      
      <div className="container mx-auto pb-12 p-1">
        <div className="mt-20">
          {JSON.stringify(ticketHistory)}
          {JSON.stringify(exhibitionHistory)}
          {JSON.stringify(productHistory)}
        </div>
      </div>


    </div>
  )


};

export default PurchaseHistoryPage;
