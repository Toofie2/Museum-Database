import React from 'react'
import Navbar from "../components/Navbar.jsx";
import { Link } from 'react-router-dom'


const TicketPurchasedPage = () => {
    return(
        <div className="relative min-h-screen p-1">
            <Navbar/>
            <div className="h-screen flex flex-col items-center justify-center">
                <h1 className="text-4xl mb-12">
                    Thank you for your purchase.
                </h1>
                <div>
                    <Link to={'/home'}>
                        <button className=" text-2xl w-52 h-20 border-2 border-black rounded">
                            Home
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    )
};

export default TicketPurchasedPage