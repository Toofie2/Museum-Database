import React, {useEffect, useState} from 'react'
import TicketInfo from "../components/TicketInfo.jsx"
import TicketForm from "../components/TicketForm.jsx"
import Navbar from "../components/Navbar.jsx";


const TicketPage = () => {
    return(
        <div className="relative min-h-screen p-1">
            <Navbar/>
            <div className="mt-28 flex justify-between px-16 space-x-24">
                <div>
                    <TicketInfo />
                </div>
                <div>
                    <TicketForm />
                </div>
            </div>
        </div>
    )
};



export default TicketPage;