//OLD
// For TESTING ONLY

import { useEffect } from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import axios from "axios";

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchAllCustomers = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BACKEND_URL}/customer`
        );
        setCustomers(res.data);
        console.log(res);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllCustomers();
  }, []);

  return (
    <div className="container mx-auto pb-12 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">
        Museum Customer List
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((cust) => (
          <div
            className="bg-white shadow-md rounded-lg p-6"
            key={cust.customer_id}
          >
            <h2 className="text-2xl font-semibold">
              {cust.first_name} {cust.last_name}
            </h2>
            <p className="text-lg text-gray-600">
              Middle Initial: {cust.middle_initial}
            </p>
            <p className="text-lg text-gray-600">
              Member: {cust.is_member ? "Yes" : "No"}
            </p>
            <p className="text-lg text-gray-600">
              Membership Start Date:{" "}
              {cust.membership_start_date
                ? new Date(cust.membership_start_date).toLocaleDateString()
                : "N/A"}
            </p>
            <div className="mt-4 flex justify-between">
              <button
                className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
                onClick={() => handleDelete(cust.customer_id)}
              >
                Delete
              </button>
              <NavLink
                to={`/updatecustomer/${cust.customer_id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
              >
                Update
              </NavLink>
            </div>
          </div>
        ))}
      </div>
      <div className="text-center mt-8">
        <NavLink
          to="/addcustomer"
          className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700 transition"
        >
          Add New Customer
        </NavLink>
      </div>
    </div>
  );
};

/*previous attempt lol

const CustomerPage = () => {
    return (
        <div>CustomerPage</div>
    );
};*/

/*async function fetchCustomers() {
    try {
        const response = await fetch('http://localhost:3000/customers');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const customers = await response.json();
        return customers;
    } catch (error) {
        console.error("Error fetching customers:", error);
        return [];
    }
}

function CustomerList() {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        // Fetch customers on component mount
        fetchCustomers().then(data => setCustomers(data));
    }, []);

    return (
        <div>
            <h2>Customer List</h2>
            <ul>
                {customers.map(customer => (
                    <li key={customer.customer_id}>{customer.first_name}{customer.last_name}{customer.is_member}{customer.membership_start_date}</li> // Replace with actual fields
                ))}
            </ul>
        </div>
    );
}*/

export default CustomerPage;
