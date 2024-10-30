import {useState} from 'react'
import Navbar from "../components/Navbar";
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const navigate = useNavigate();

    const [login,setLogin] = useState({
        email: "",
        password: "",
    });

    const [confirmationMessage, setConfirmationMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        // Update login fields if the input name matches login properties
        if (['email', 'password'].includes(name)) {
            setLogin((prev) => ({ ...prev, [name]: value }));
        }
    };
    
    const handleClick = async e => {
        e.preventDefault()
        try{
            const response = await axios.get(`http://localhost:3000/authentication/email?email=${login.email}`)
            if(response.data.password === login.password) {
                setConfirmationMessage("Login successful!");
            }
            else {
                setConfirmationMessage("Login failed. Please try again.");
            }
            //navigate("/")
        }
        catch(err){
            setConfirmationMessage("Login failed. Please try again.");
            console.log("Authentication credentials retrieval error:",err)
        }
    }

    console.log(login)

    return (
        <div className="container mx-auto pb-12">
            <Navbar />
            {/* Banner Section */}
            <div className="relative flex items-center h-[75px] w-[1600px]">
                <div className="absolute inset-0 bg-black bg-opacity-60 flex flex-col justify-center pl-4 space-y-2">
                </div>
            </div>
            
            {/* Form Section */}
            <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-8 mt-6">
                <h2 className="text-2xl font-semibold text-center mb-6">Login</h2>
                {/* Welcome Message */}
                <p className="text-center text-gray-600 text-sm mt-4">Welcome back! Please login to your account.</p>
                <form>
                    <input
                        type="text"
                        placeholder="Email"
                        onChange={handleChange}
                        name="email"
                        className="w-full p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        onChange={handleChange}
                        name="password"
                        className="w-full p-3 mb-6 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    />
                    <button className="w-full bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-200" onClick={handleClick}>
                        Login
                    </button>
                    <button className="w-full mt-4 bg-gray-300 text-gray-800 p-3 rounded-md hover:bg-gray-400 transition duration-200">
                        Reset Password
                    </button>
                </form>
            </div>
            
            {/* Conditional rendering for confirmation message */}
            {confirmationMessage && (
                <div className="mt-4 text-green-600 text-lg text-center">
                    {confirmationMessage}
                </div>
            )}
    
            {/* Sign-up Message and Button */}
            <div className="mt-8 text-center">
                <p className="text-gray-600 text-lg">Not a member? Sign up now!</p>
                <NavLink to="/signup">
                    <button className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200">
                        Sign Up
                    </button>
                </NavLink>
            </div>
        </div>
    );
}

export default LoginPage;