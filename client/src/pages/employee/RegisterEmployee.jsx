import { useEffect, useState } from "react";
import axios from "axios";
import { NavLink, useNavigate } from "react-router-dom";

const RegisterEmployee = () => {
  const navigate = useNavigate();
  const [confirmationMessage, setConfirmationMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // Error message for password mismatch

  const [employee, setEmployee] = useState({
    department_id: 0,
    first_name: "",
    middle_initial: "",
    last_name: "",
    date_of_birth: "",
    sex: "",
    address: "",
    role: "Staff",
    hire_date: "",
    start_date: "",
    salary: "",
    ssn: "",
  });

  const [credentials, setCredentials] = useState({
    employee_id: 0,
    email: "",
    password: "",
  });

  const [checkpassword, setCheckPassword] = useState({
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (Object.keys(employee).includes(name)) {
      setEmployee((prev) => ({ ...prev, [name]: value }));
    }
    if (["employee_id", "email", "password"].includes(name)) {
      setCredentials((prev) => ({ ...prev, [name]: value }));
    }
    if (name === "confirmPassword") {
      setCheckPassword((prev) => ({ ...prev, [name]: value }));
    }
  };

  const formatDate = (date) => {
    const d = new Date(date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleClick = async (e) => {
    e.preventDefault();
  
    // Trim values to avoid spaces causing issues
    const trimmedEmployee = {
      ...employee,
      first_name: employee.first_name.trim(),
      last_name: employee.last_name.trim(),
      ssn: employee.ssn.trim(),
      address: employee.address.trim(),
    };
    
    // Validation for required fields
    if (
      !trimmedEmployee.first_name ||
      !trimmedEmployee.last_name ||
      !trimmedEmployee.ssn ||
      !credentials.email.trim() ||
      !credentials.password.trim() ||
      !checkpassword.confirmPassword.trim() ||
      !trimmedEmployee.department_id || 
      trimmedEmployee.department_id === "0" // Checking if department_id is selected
    ) {
      alert("Please fill in all required fields.");
      return;
    }
  
    // Validation for password mismatch
    if (credentials.password !== checkpassword.confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    } else {
      setErrorMessage("");
    }
  
    try {
      // Convert hire_date and start_date to yyyy-mm-dd format
      const formattedHireDate = formatDate(employee.hire_date);
      const formattedStartDate = formatDate(employee.start_date);
  
      // Update employee state with the formatted dates
      const updatedEmployee = {
        ...employee,
        hire_date: formattedHireDate,
        start_date: formattedStartDate,
      };
  
      // Send employee details to backend
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/employee`, updatedEmployee);
      if (response.status === 201) {
        setConfirmationMessage("Registration successful!");
        const lastEmployee = response.data;
        
        // Send authentication details (email and password)
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/authentication`, {
          ...credentials,
          employee_id: lastEmployee.id, // Use the returned employee ID
        });
        
        setTimeout(() => {
          navigate("/employee");
        }, 1500);
      }
    } catch (err) {
      console.log("Error during registration:", err);
      if (err.response && err.response.data) {
        setErrorMessage(err.response.data.error || "An error occurred");
      } else {
        setErrorMessage("Registration failed.");
      }
    }
  };
  

  return (
    <div className="flex h-screen">
      <div className="flex flex-col justify-center items-center w-full bg-white shadow-md p-8">
        <h2 className="text-2xl font-semibold text-center mb-6">Employee Registration</h2>
        <p className="text-center text-gray-600 text-sm mt-4">Please enter employee details.</p>
        <form className="w-full max-w-lg mt-8 space-y-4">

          {/* Name Row */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-gray-700 text-sm mb-2" htmlFor="first_name">First Name</label>
              <input type="text" name="first_name" onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>

            <div className="w-20">
              <label className="block text-gray-700 text-sm mb-2" htmlFor="middle_initial">M (optional)</label>
              <input type="text" name="middle_initial" maxLength="1" onChange={handleChange} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>

            <div className="flex-1">
              <label className="block text-gray-700 text-sm mb-2" htmlFor="last_name">Last Name</label>
              <input type="text" name="last_name" onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
          </div>

          {/* Date of Birth and Sex Row */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-gray-700 text-sm mb-2" htmlFor="date_of_birth">Date of Birth</label>
              <input type="date" name="date_of_birth" onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>

            <div className="flex-1">
              <label className="block text-gray-700 text-sm mb-2" htmlFor="sex">Sex</label>
              <select name="sex" onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                <option value="">Select Sex</option>
                <option value="M">M</option>
                <option value="F">F</option>
              </select>
            </div>
          </div>

          {/* Address */}
          <label className="block text-gray-700 text-sm mb-2" htmlFor="address">Address</label>
          <input type="text" name="address" onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />

          {/* Hire Date and Start Date Row */}
          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-gray-700 text-sm mb-2" htmlFor="hire_date">Hire Date</label>
              <input type="date" name="hire_date" onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>

            <div className="flex-1">
              <label className="block text-gray-700 text-sm mb-2" htmlFor="start_date">Start Date</label>
              <input type="date" name="start_date" onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
            </div>
          </div>

          {/* Department ID, Salary, and SSN Row */}
    <div className="flex space-x-4">
    {/* Department ID Dropdown */}
    <div className="flex-1">
        <label className="block text-gray-700 text-sm mb-2" htmlFor="department_id">Department</label>
        <select
        name="department_id"
        onChange={handleChange}
        value={employee.department_id}
        required
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        >
        <option value="">Select Department</option>
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        </select>
    </div>

    {/* Salary */}
    <div className="flex-1">
        <label className="block text-gray-700 text-sm mb-2" htmlFor="salary">Salary</label>
        <input
        type="number"
        name="salary"
        onChange={handleChange}
        required
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
    </div>

    {/* SSN */}
    <div className="flex-1">
        <label className="block text-gray-700 text-sm mb-2" htmlFor="ssn">SSN</label>
        <input
        type="text"
        name="ssn"
        onChange={handleChange}
        required
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
    </div>
    </div>

    {/* Email */}
    <div className="flex-1">
        <label className="block text-gray-700 text-sm mb-2" htmlFor="email">Email</label>
        <input type="email" name="email" onChange={handleChange} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" />
    </div>

    {/* Password */}
    <div className="flex-1">
      <label className="block text-gray-700 text-sm mb-2" htmlFor="password">Password</label>
      <input
        type="password"
        name="password"
        onChange={handleChange}
        required
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>

    {/* Confirm Password */}
    <div className="flex-1">
      <label className="block text-gray-700 text-sm mb-2" htmlFor="confirmPassword">Confirm Password</label>
      <input
        type="password"
        name="confirmPassword"
        onChange={handleChange}
        required
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
    </div>

    {/* Error and Confirmation Messages */}
    {errorMessage && <div className="text-red-600 mt-2">{errorMessage}</div>}
    {confirmationMessage && <div className="text-green-600 mt-2">{confirmationMessage}</div>}

    {/* Submit Button */}
    <div className="flex justify-center mt-6">
      <button
        onClick={handleClick}
        className="bg-gray-900 hover:bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Register
      </button>
    </div>
  </form>
</div>
</div>
);
};

export default RegisterEmployee;
