import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const EmployeeListPage = () => {
  const [employees, setEmployees] = useState([]);
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [saveMessage, setSaveMessage] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const navigate = useNavigate();

  // Fetch all employees
  const fetchEmployees = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/employee`
      );
      const activeEmployees = res.data.filter((employee) => employee.is_active);
      const sortedEmployees = activeEmployees.sort((a, b) =>
        a.last_name.localeCompare(b.last_name)
      );
      setEmployees(sortedEmployees);
      setFilteredEmployees(sortedEmployees);
    } catch (err) {
      console.log("Error fetching employees:", err);
    }
  };

  // Fetch all departments
  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/department`);
      setDepartments(res.data);
    } catch (err) {
      console.log("Error fetching departments:", err);
    }
  };
  
  useEffect(() => {
    fetchEmployees();
    fetchDepartments();
  }, []);

  const getDepartmentName = (departmentId) => {
    const department = departments.find((dep) => dep.department_id === departmentId);
    return department ? department.name : "Unknown Department";
  };

  const [filters, setFilters] = useState({
    salary: "",
    department: "",
  });

  const handleFilterChange = (filterType, value) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, [filterType]: value };
  
      // Apply combined filters
      let filtered = employees;
  
      // Apply salary filter
      if (updatedFilters.salary === "below") {
        filtered = filtered.filter((emp) => emp.salary < 60000);
      } else if (updatedFilters.salary === "belowToAbove") {
        filtered = filtered.filter((emp) => emp.salary >= 60000 && emp.salary <= 100000);
      } else if (updatedFilters.salary === "above") {
        filtered = filtered.filter((emp) => emp.salary > 100000);
      }
  
      // Apply department filter using department name
      if (updatedFilters.department) {
        filtered = filtered.filter((emp) => {
          const empDepartment = departments.find(
            (dep) => dep.department_id === emp.department_id
          );
          return empDepartment?.name === updatedFilters.department;
        });
      }
  
      setFilteredEmployees(filtered);
      return updatedFilters;
    });
  };

  const handleEditClick = (employee) => {
    setEditingEmployee({ ...employee });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "department") {
      // When editing department, convert department name to ID
      const selectedDepartment = departments.find(dep => dep.name === value);
      setEditingEmployee(prev => ({
        ...prev,
        department_id: selectedDepartment ? selectedDepartment.department_id : prev.department_id
      }));
    } else {
      setEditingEmployee(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveClick = async () => {
    try {
      await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/employee/${editingEmployee.employee_id}`,
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

  const handleDeleteClick = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/authentication/employee/${editingEmployee.employee_id}`
      );

      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/authentication/${response.data.email}`
      );

      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/employee/${editingEmployee.employee_id}`
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

  const handleCancelClick = () => {
    setEditingEmployee(null);
  };

  return (
    <>
      <div className="flex justify-between p-4">
        <h1 className="text-4xl md:text-3xl font-bold">Employees</h1>
        <button
          onClick={() => navigate("/employee/register")}
          className="flex bg-white text-gray-dark px-3 py-2 rounded-md transition duration-200 border-gray-medium border justify-between gap-1"
        >
          <span className="material-symbols-outlined">add</span>
          Add Employee
        </button>
      </div>
  
      <div className="flex space-x-4 p-4">
        <select
          value={filters.salary}
          onChange={(e) => handleFilterChange("salary", e.target.value)}
          className="bg-white border border-gray-300 text-black px-4 py-2 rounded-md"
        >
          <option value="">Select Salary Range</option>
          <option value="below">Salary &lt; $60,000</option>
          <option value="belowToAbove">Salary $60,000 - $100,000</option>
          <option value="above">Salary ≥ $100,000</option>
        </select>
  
        {/* Fixed department filter */}
        <select
          value={filters.department}
          onChange={(e) => handleFilterChange("department", e.target.value)}
          className="bg-white border border-gray-300 text-black px-4 py-2 rounded-md"
        >
          <option value="">Select Department</option>
          {departments.sort((a, b) => a.name.localeCompare(b.name)).map((dep) => (
            <option key={dep.department_id} value={dep.name}>
              {dep.name}
            </option>
          ))}
        </select>
  
        <button
          onClick={() => {
            setFilters({ salary: "", department: "" });
            setFilteredEmployees(employees);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md"
        >
          Show All
        </button>
      </div>
  
      {saveMessage && (
        <div className="text-green-600 font-semibold text-center mb-6">
          {saveMessage}
        </div>
      )}
  
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
  
          <label className="text-base text-gray-900">Department</label>
          <select
            name="department"
            value={getDepartmentName(editingEmployee.department_id)}
            onChange={handleInputChange}
            className="border border-gray-300 rounded px-4 py-2 mb-4 w-full"
          >
            {departments.map((dep) => (
              <option key={dep.department_id} value={dep.name}>
                {dep.name}
              </option>
            ))}
          </select>
  
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
  
          <div className="flex justify-between space-x-4">
            <button
              onClick={handleCancelClick}
              className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveClick}
              className="bg-blue-600 text-white px-6 py-2 rounded-md"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}
  
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEmployees.map((employee) => (
          <div
            key={employee.employee_id}
            className="bg-white shadow-md rounded-lg p-6 border border-gray-200 hover:shadow-xl transition duration-300 ease-in-out"
          >
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              {employee.first_name} {employee.last_name}
            </h3>
            <p className="text-base text-gray-600 mb-2">
              Department: {getDepartmentName(employee.department_id)}
            </p>
            <p className="text-base text-gray-600 mb-2">
              Salary: ${employee.salary}
            </p>
            <button
              onClick={() => handleEditClick(employee)}
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

export default EmployeeListPage;