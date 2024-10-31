import {useEffect} from 'react'
import {useState} from 'react'
import axios from 'axios'
import Navbar from "../components/Navbar";
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {

    const navigate = useNavigate();
    const [confirmationMessage, setConfirmationMessage] = useState("");

    const [customer,setCustomer] = useState({
        first_name: "",
        middle_initial: "",
        last_name: "",
        is_member: "0",
    });

    const [credentials,setCredentials] = useState({
        customer_id: 0,
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        // Update customer fields if the input name matches customer properties
        if (['first_name', 'middle_initial', 'last_name'].includes(name)) {
            setCustomer((prev) => ({ ...prev, [name]: value }));
        }
        
        // Update credentials fields if the input name matches credentials properties
        if (['customer_id', 'email', 'password'].includes(name)) {
            setCredentials((prev) => ({ ...prev, [name]: value }));
        }
    };
    
    const handleClick = async e => {
        e.preventDefault();
        try {
            // Post customer data
            await axios.post("http://localhost:3000/Customer", customer);
            
            // Retrieve the last customer to get the new customer ID
            const response = await axios.get("http://localhost:3000/Customer/last");
            const lastCustomer = response.data;
            
            // Post to Authentication using the updated customer ID directly
            await axios.post("http://localhost:3000/Authentication", {
                ...credentials,
                customer_id: lastCustomer.customer_id
            });
            setConfirmationMessage("Registration successful!");
            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (err) {
            console.log("Authentication error:", err);
            setConfirmationMessage("Registration failed.");
        }
    };

    console.log(customer)
    console.log(credentials)

    return (
        <div className="container mx-auto pb-12 px-4">
            <Navbar />
            {/* Banner Section */}
            <div className="relative flex items-center h-[75px] w-full mb-8">
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center pl-4">
                    <h1 className="text-3xl font-bold text-white"></h1>
                </div>
            </div>

            {/* Sign Up Title */}
            <h1 className="text-4xl font-bold text-center mb-8">Customer Registration</h1>

            <form className="bg-white shadow-lg rounded-lg p-8">
                <div className="mb-4">
                    <label className="block text-gray-700 text-lg mb-2" htmlFor="first_name">First Name</label>
                    <input
                        type="text"
                        name="first_name"
                        placeholder="Enter your first name"
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-lg mb-2" htmlFor="middle_initial">Middle Initial</label>
                    <input
                        type="text"
                        name="middle_initial"
                        placeholder="Enter your middle initial"
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-lg mb-2" htmlFor="last_name">Last Name</label>
                    <input
                        type="text"
                        name="last_name"
                        placeholder="Enter your last name"
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-lg mb-2" htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-lg mb-2" htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Enter your password"
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="flex justify-center">
                    <button
                        className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200"
                        onClick={handleClick}
                    >
                        Register
                    </button>
                </div>
            </form>
            {/* Conditional rendering for confirmation message */}
            {confirmationMessage && (
                <div className="mt-4 text-green-600 text-lg text-center">
                    {confirmationMessage}
                </div>
        )}
        </div>
    );
}

export default SignupPage;