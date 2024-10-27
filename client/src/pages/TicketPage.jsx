import React, {useEffect, useState} from 'react'
import TicketInfo from "../components/TicketInfo.jsx"
import TicketForm from "../components/TicketForm.jsx"

const TicketPage = () => {
    return(
        <div>
            <TicketInfo />
            <TicketForm />
        </div>
    )
};



export default TicketPage;