import {useState} from 'react'
import axios from 'axios'
import NavbarBlack from "../components/NavbarBlack";
import { useNavigate } from 'react-router-dom';


const MembershipregPage = () => {
    const navigate = useNavigate();
    const [purchaseSuccess, setPurchaseSuccess] = useState(false);

    const handleClick = async (e) => {
        e.preventDefault();

        // Simulate membership purchase success
        setPurchaseSuccess(true);
        console.log("Membership Purchase Successful");

        // Redirect after a short delay
        setTimeout(() => {
            navigate("/");
        }, 2000); // Redirects after 2 seconds
    };

    return (
        <div className="container mx-auto pb-12 px-4">
            <NavbarBlack />
            {/* Banner Section */}
            <div className="relative flex items-center h-[75px] w-full mb-8">
                <div className="absolute inset-0 bg-white bg-opacity-40 flex flex-col justify-center pl-4"></div>
            </div>
    
            {/* Membership Information Box */}
            <div className="bg-gray-50 shadow-lg rounded-lg p-8 text-center">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4">Become a Member</h2>
                
                <p className="text-lg text-gray-600 mb-6">
                    Enjoy exclusive benefits with our annual membership. Members get access to:
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-6">
                    <li>Discounts on products and services</li>
                    <li>Exclusive member-only events and content</li>
                    <li>Priority support and updates</li>
                    <li>Special promotions and rewards</li>
                </ul>
    
                <p className="text-lg font-bold text-gray-800 mb-6">Only $110 per year</p>
    
                {purchaseSuccess && (
                    <p className="text-green-600 text-lg font-semibold mb-4">
                        Membership purchase was successful!
                    </p>
                )}
    
                <div className="flex justify-center">
                    <button
                        className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200"
                        onClick={handleClick}
                    >
                        Purchase Membership
                    </button>
                </div>
            </div>
        </div>
    );
}

export default MembershipregPage;