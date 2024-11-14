import {useState} from 'react'
import axios from 'axios'
import NavbarBlack from "../components/NavbarBlack";
import { useNavigate } from 'react-router-dom';
import halfImage from "../assets/membership_background.png";
import { useAuth } from "../components/authentication";

const MembershipregPage = () => {
    const navigate = useNavigate();
    const { userId } = useAuth();
    const [purchaseMessage, setPurchaseMessage] = useState('');

    const handleClick = async (e) => {
        e.preventDefault();

        try {
            // Check if the customer already has a membership
            const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/customer/${userId}`);

            if (res.data.is_member === 1) {
                // Customer already has a membership
                setPurchaseMessage("You already have a membership!"); // Set the message
                return setTimeout(() => {
                    navigate("/"); // Redirect to home after the message is shown
                }, 2000); // 2 seconds delay
            }

            // If not a member, proceed to purchase
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, "0");
            var mm = String(today.getMonth() + 1).padStart(2, "0");
            var yyyy = today.getFullYear();
            today = yyyy + "-" + mm + "-" + dd;

            const membershipData = {
                is_member: 1,
                membership_start_date: today,
            };

            await axios.put(`${import.meta.env.VITE_BACKEND_URL}/customer/${userId}`, membershipData);

            // If membership purchase is successful
            setPurchaseMessage("Membership Purchase Successful!"); // Set the success message
            console.log("Membership Purchase Successful");

            // Redirect after the success message
            setTimeout(() => {
                navigate("/"); // Redirect to home after the message is shown
            }, 1500); // 1.5 seconds delay

        } catch (err) {
            console.log("Membership purchase error:", err);
        }
    };

    return (
        <div className="w-full h-screen">
            {/* Navbar */}
            <div className="w-full">
                <NavbarBlack />
            </div>

            {/* Main Content Section with Flexbox Layout */}
            <div className="flex h-[calc(100%-75px)]">
                
                {/* Left Side - Membership Information Box */}
                <div className="w-1/2 flex justify-start items-center bg-gray-50 p-16">
                    <div className="max-w-3xl">
                        <h2 className="text-3xl font-semibold text-black mb-4">Become a Member</h2>
                        
                        <p className="text-lg text-gray-900 mb-6">
                            Discover something new on every visit and stay connected year-round!
                        </p>

                        <p className="text-lg text-gray-900 mb-6">
                            Enjoy unlimited free admission, exclusive discounts on Member perks, and invitations to Members-only events, and priority access to exhibitions.
                        </p>

                        <p className="text-lg text-gray-900 mb-6">
                            Join today and become part of our global community of supporters dedicated to helping The Fine Arts Museum educate and inspire millions each year through the power of art!
                        </p>

                        <div className="bg-stone-500 text-white p-8 rounded-lg mt-6">
                            <p className="text-lg font-bold mb-6">$110 per year</p>
                            <ul className="list-disc list-inside mb-6 space-y-2">
                                <li>Free admission for one Member and two paid guests</li>
                                <li>15% off Gift Shop Items, and 10% off parking and dining</li>
                                <li>Express entry with Member Entrance</li>
                                <li>Special promotions and rewards</li>
                                <li>Complimentary gifts</li>
                            </ul>

                            {/* Show membership purchase success or already a member message */}
                            {purchaseMessage && (
                                <p className="text-green-200 text-lg font-semibold mb-4">
                                    {purchaseMessage}
                                </p>
                            )}

                            <button
                                className="bg-stone-500 border border-white text-white px-6 py-3 rounded-md hover:bg-stone-400 transition duration-200"
                                onClick={handleClick}
                            >
                                Purchase Membership
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Side - Full Background Image */}
                <div
                    className="w-1/2 h-full bg-cover bg-center"
                    style={{
                        backgroundImage: `url(${halfImage})`,
                    }}
                ></div>
            </div>
        </div>
    );
};

export default MembershipregPage;