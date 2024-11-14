import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EmployeeListPage = () => {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [saveMessage, setSaveMessage] = useState(""); // State for success message
  const navigate = useNavigate();

  // Fetch all employees and sort by last name
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/employee`);
      // Sort the employees by last name
      const sortedEmployees = res.data.sort((a, b) => a.last_name.localeCompare(b.last_name));
      setEmployees(sortedEmployees);
    } catch (err) {
      console.log("Error fetching employees:", err);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Handle edit button click
  const handleEditClick = (employee) => {
    setEditingEmployee({ ...employee });
  };

  // Handle input field change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingEmployee((prev) => ({ ...prev, [name]: value }));
  };

  // Handle save button click
  const handleSaveClick = async () => {
    try {

      console.log("Employee ID:",editingEmployee.employee_id); //TEST
      // Send PUT request to update employee details
      const res = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/employee/${editingEmployee.employee_id}`, editingEmployee);

      // Update the state with the updated employee information
      setEditingEmployee(null);
      fetchEmployees();

      // Set success message and hide it after 3 seconds
      setSaveMessage("Profile Updates Saved");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      console.log("Error updating employee data:", err);
    }
  };

  // Handle cancel button click
  const handleCancelClick = () => {
    setEditingEmployee(null);
  };

  return (
    <>
      <h1 className="text-4xl md:text-3xl font-bold text-black mb-8 text-center">Employee List</h1>

      {/* Success Message */}
      {saveMessage && (
        <div className="text-green-600 font-semibold text-center mb-6">
          {saveMessage}
        </div>
      )}

      {/* Editing Employee Profile - Moved to the top */}
      {editingEmployee && (
        <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200 w-full md:w-3/4 lg:w-1/2 mx-auto mb-8">
          <h2 className="text-xl font-medium text-black mb-6">Edit Profile</h2>

          <label className="text-base text-gray-900">First Name</label>
          <input
            type="text"
            name="first_name"
            value={editingEmployee.first_name}
            onChange={handleInputChange}
            className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
          />

          <label className="text-base text-gray-900">M.I (optional)</label>
          <input
            type="text"
            name="middle_initial"
            maxLength="1"
            value={editingEmployee.middle_initial}
            onChange={handleInputChange}
            className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
          />

          <label className="text-base text-gray-900">Last Name</label>
          <input
            type="text"
            name="last_name"
            value={editingEmployee.last_name}
            onChange={handleInputChange}
            className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
          />

          <label className="text-base text-gray-900">Department ID</label>
          <input
            type="number"
            name="department_id"
            value={editingEmployee.department_id}
            onChange={handleInputChange}
            className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
          />

          <label className="text-base text-gray-900">Salary</label>
          <input
            type="number"
            name="salary"
            value={editingEmployee.salary}
            onChange={handleInputChange}
            className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
          />

          <label className="text-base text-gray-900">SSN</label>
          <input
            type="text"
            name="ssn"
            value={editingEmployee.ssn}
            onChange={handleInputChange}
            className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
          />

          <div className="flex justify-between mt-4">
            <button
              onClick={handleSaveClick}
              className="bg-gray-900 text-white px-6 py-3 rounded-md w-1/2 hover:bg-black transition duration-200"
            >
              Save
            </button>
            <button
              onClick={handleCancelClick}
              className="bg-gray-400 text-white px-6 py-3 rounded-md w-1/2 hover:bg-gray-500 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Employee List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {employees.map((employee) => (
          <div key={employee.id} className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-xl transition duration-300 ease-in-out">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {employee.first_name} {employee.last_name}
            </h3>
            <p className="text-base text-gray-600 mb-2">Department ID: {employee.department_id}</p>
            <p className="text-base text-gray-600 mb-2">Salary: ${employee.salary}</p>
            <p className="text-base text-gray-600 mb-4">SSN: {employee.ssn}</p>
            <button
              onClick={() => handleEditClick(employee)}
              className="bg-gray-900 text-white px-6 py-2 rounded-md hover:bg-black transition duration-200 w-full"
            >
              Edit
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default EmployeeListPage;
