import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EmployeeListPage = () => {
  const [employees, setEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [saveMessage, setSaveMessage] = useState(""); // State for success message
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false); // Confirmation popup
  const navigate = useNavigate();

  // Fetch all active employees and sort by last name
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/employee`
      );
      // Filter out employees who are inactive
      const activeEmployees = res.data.filter((employee) => employee.is_active);
      const sortedEmployees = activeEmployees.sort((a, b) =>
        a.last_name.localeCompare(b.last_name)
      );
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle input field change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditingEmployee((prev) => ({ ...prev, [name]: value }));
  };

  // Handle save button click
  const handleSaveClick = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/employee/${
          editingEmployee.employee_id
        }`,
        editingEmployee
      );
      setEditingEmployee(null);
      fetchEmployees();
      setSaveMessage("Profile Updates Saved");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      console.log("Error updating employee data:", err);
    }
  };

  // Show delete confirmation popup
  const confirmDelete = () => {
    setShowDeleteConfirmation(true);
  };

  // Handle delete button click (after confirmation)
  const handleDeleteClick = async () => {
    try {
      // Fetch employee's authentication data (e.g., using email or ID)
      console.log("edditing employee id:", editingEmployee.employee_id);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/authentication/employee/${
          editingEmployee.employee_id
        }`
      );

      // Delete the authentication record for the employee
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/authentication/${
          response.data.email
        }`
      );

      // Then, delete the employee record
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/employee/${
          editingEmployee.employee_id
        }`
      );

      setEditingEmployee(null);
      fetchEmployees();
      setSaveMessage("Employee and authentication data successfully deleted");
      setTimeout(() => setSaveMessage(""), 3000);
    } catch (err) {
      console.log("Error deleting employee or authentication data:", err);
      setSaveMessage("Error deleting employee. Please try again.");
      setTimeout(() => setSaveMessage(""), 3000);
    } finally {
      setShowDeleteConfirmation(false);
    }
  };

  // Handle cancel button click
  const handleCancelClick = () => {
    setEditingEmployee(null);
  };

  return (
    <>
      <div className="flex justify-between p-8">
        <h1 className="text-2xl">Employees</h1>
        <button
          onClick={() => navigate("/employee/register")}
          className="flex bg-white text-gray-dark px-3 py-2 rounded-md transition duration-200 border-gray-medium border justify-between gap-1"
        >
          <span className="material-symbols-outlined">add</span>
          Add Employee
        </button>
      </div>

      {/* Success Message */}
      {saveMessage && (
        <div className="text-green-600 font-semibold text-center mb-6">
          {saveMessage}
        </div>
      )}

      {/* Editing Employee Profile */}
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
            {editingEmployee.role !== "Admin" && (
              <button
                onClick={confirmDelete}
                className="bg-red-600 text-white px-6 py-3 rounded-md w-1/4 hover:bg-red-700 transition duration-200"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold mb-4">
              Are you sure you want to delete this employee?
            </h3>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDeleteClick}
                className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition duration-200"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="bg-gray-400 text-white px-6 py-2 rounded-md hover:bg-gray-500 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Employee List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {employees.map((employee) => (
          <div
            key={employee.employee_id}
            className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-xl transition duration-300 ease-in-out"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {employee.first_name} {employee.last_name}
            </h3>
            <p className="text-base text-gray-600 mb-2">
              Department ID: {employee.department_id}
            </p>
            <p className="text-base text-gray-600 mb-2">
              Salary: ${employee.salary}
            </p>
            <p className="text-base text-gray-600 mb-2">SSN: {employee.ssn}</p>

            <button
              onClick={() => handleEditClick(employee)}
              className="bg-gray-900 text-white px-6 py-3 rounded-md mt-4 hover:bg-black transition duration-200"
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
