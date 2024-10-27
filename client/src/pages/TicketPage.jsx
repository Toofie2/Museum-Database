import React, {useEffect, useState} from 'react'
import TicketInfo from "../components/TicketInfo.jsx"
import TicketForm from "../components/TicketForm.jsx"

const TicketPage = () => {
    return(
        <div className="flex justify-between px-16 space-x-20">
            <div>
                <TicketInfo />
            </div>
            <div>
                <TicketForm />
            </div>
        </div>
    )
};



export default TicketPage;