import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [saveMessage, setSaveMessage] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [membershipFilter, setMembershipFilter] = useState("all");
  const navigate = useNavigate();

  // Helper function to format date to mm/dd/yyyy for display
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  // Fetch all customers
  const fetchCustomers = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/customer`);
      const activeCustomers = res.data.filter(customer => customer.is_active);
      const sortedCustomers = activeCustomers.sort((a, b) => a.last_name.localeCompare(b.last_name));

      // Filter based on membership status
      const filteredCustomers = sortedCustomers.filter((customer) => {
        if (membershipFilter === "all") return true;
        if (membershipFilter === "member") return customer.is_member;
        if (membershipFilter === "non-member") return !customer.is_member;
        return false;
      });

      setCustomers(filteredCustomers);
    } catch (err) {
      console.log("Error fetching customers:", err);
    }
  };

  // Run fetchCustomers when membershipFilter changes
  useEffect(() => {
    fetchCustomers();
  }, [membershipFilter]); // Depend on membershipFilter

  // Handle edit button click
  const handleEditClick = (customer) => {
    setEditingCustomer({
      ...customer,
      membership_start_date: formatDate(customer.membership_start_date)
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle input field change
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "is_member") {
      setEditingCustomer((prev) => ({
        ...prev,
        is_member: !prev.is_member,
        membership_start_date: !prev.is_member ? getCurrentDate() : null,
      }));
    } else {
      setEditingCustomer((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Handle save button click
  const handleSaveClick = async () => {
    const customerToSave = {
      ...editingCustomer,
      membership_start_date: editingCustomer.membership_start_date
        ? new Date(editingCustomer.membership_start_date).toISOString().split("T")[0]
        : null, // Convert to yyyy-mm-dd or set to null
    };

    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/customer/${editingCustomer.customer_id}`, customerToSave);
      setEditingCustomer(null);
      fetchCustomers();
      setSaveMessage("Customer details saved");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      console.log("Error updating customer data:", err);
    }
  };

  // Show delete confirmation popup
  const confirmDelete = () => {
    setShowDeleteConfirmation(true);
  };

  // Handle delete button click (after confirmation)
  const handleDeleteClick = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/authentication/customer${editingCustomer.customer_id}`
      );

      // First, delete the customer's authentication data
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/authentication/${response.data.email}`);
      
      // Then, delete the customer from the customer table
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/customer/${editingCustomer.customer_id}`);

      setEditingCustomer(null);
      fetchCustomers();
      setSaveMessage("Customer and authentication data successfully deleted");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      console.log("Error deleting customer or authentication data:", err);
      setSaveMessage("Error deleting customer. Please try again.");
      setTimeout(() => setSaveMessage(""), 3000);
    } finally {
      setShowDeleteConfirmation(false);
    }
  };

  // Handle cancel button click
  const handleCancelClick = () => {
    setEditingCustomer(null);
  };

  const handleMembershipFilterChange = (e) => {
    setMembershipFilter(e.target.value);
  };

  return (
    <>
      <div className="flex justify-between p-4">
        <h1 className="text-4xl md:text-3xl font-bold">Customers</h1>
      </div>

        {/* Membership Filter Dropdown */}
        <div className="flex space-x-4 p-4">
        <select
        value={membershipFilter}
        onChange={handleMembershipFilterChange}
        className="border border-gray-300 rounded px-4 py-2"
        >
        <option value="all">All Customers</option>
        <option value="member">Members</option>
        <option value="non-member">Non-Members</option>
        </select>
        <div className="text-2xl rounded px-2 py-2 text-gray-700">
            ({customers.length})
        </div>
        </div>
      {/* Success Message */}
      {saveMessage && (
        <div className="text-green-600 font-semibold text-center mb-6">
          {saveMessage}
        </div>
      )}

      {/* Confirmation Dialog for Deletion */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <p className="text-lg font-semibold mb-4">Are you sure you want to delete this customer?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteClick}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editing Customer Profile */}
      {editingCustomer && (
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 w-full md:w-3/4 lg:w-1/2 mx-auto mb-8">
          <h2 className="text-xl font-medium text-black mb-6">Edit Customer</h2>

          <label className="text-base text-gray-900">First Name</label>
          <input
            type="text"
            name="first_name"
            value={editingCustomer.first_name}
            onChange={handleInputChange}
            className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
          />

          <label className="text-base text-gray-900">M.I (optional)</label>
          <input
            type="text"
            name="middle_initial"
            maxLength="1"
            value={editingCustomer.middle_initial}
            onChange={handleInputChange}
            className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
          />

          <label className="text-base text-gray-900">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={editingCustomer.last_name}
            onChange={handleInputChange}
            className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
          />

          <div className="flex items-center space-x-4 mb-4">
            <div className="flex-1">
              <label className="text-base text-gray-900">Membership Start Date</label>
              <input
                type="text"
                name="membership_start_date"
                value={editingCustomer.membership_start_date}
                onChange={handleInputChange}
                className="border border-gray-300 rounded px-4 py-2 w-full"
              />
            </div>
            <div className="flex items-center space-x-2">
              <label className="text-base text-gray-900">Membership Status</label>
              <input
                type="checkbox"
                name="is_member"
                checked={editingCustomer.is_member}
                onChange={handleInputChange}
                className="border border-gray-300 rounded"
              />
            </div>
          </div>

          <div className="flex justify-between space-x-4 mt-6">
            <button
              onClick={handleSaveClick}
              className="bg-gray-900 text-white px-6 py-3 rounded-md w-full hover:bg-black transition duration-200"
            >
              Save
            </button>
            <button
              onClick={handleCancelClick}
              className="bg-gray-400 text-white px-6 py-3 rounded-md w-full hover:bg-gray-500 transition duration-200"
            >
              Cancel
            </button>
            <button
              onClick={confirmDelete}
              className="bg-red-600 text-white px-6 py-3 rounded-md w-1/4 hover:bg-red-700 transition duration-200"
            >
              Delete
            </button>
          </div>
        </div>
      )}

      {/* Customer List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {customers.map((customer) => (
          <div key={customer.customer_id} className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-xl transition duration-300 ease-in-out">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {customer.first_name} {customer.last_name}
            </h3>
            <p className="text-base text-gray-600 mb-2">Member: {customer.is_member ? "Yes" : "No"}</p>
            <p className="text-base text-gray-600 mb-4">Membership Start Date: {formatDate(customer.membership_start_date)}</p>
            <button
              onClick={() => handleEditClick(customer)}
              className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-black transition duration-200 w-1/4"
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default CustomerList;
