import React, {useEffect, useState} from 'react'
import axios from 'axios'

const TicketPage = () => {
    const[tickets, setTickets] = useState([])
    const[Subtotal, setSubtotal] = useState(0)
    useEffect(() => {
        const fetchAllTickets = async()=>{
            try{
                const res = await axios.get('http://localhost:3000/ticket')
                setTickets(res.data);
            }catch(err){
                console.log(err)
            }
        }
        fetchAllTickets()
    }, [])
    return (
        <div>
            <h1>Purchase</h1>
            <p>Please select an available date for your visit and the amount of tickets you’ll be purchasing.</p>
            <div className="tickets">
                {tickets.map(ticket=>(
                    <div className="ticket" key={ticket.ticket_id}>
                        <p class="capitalize">{ticket.type} admission <span> ${ticket.price}</span><span><button>-</button><button>+</button></span></p>
                    </div>
                ))}
            </div>
            <div>
                <h2>Subtotal</h2>
                <button>Checkout</button>
            </div>
        </div>
        /*
        <div>
            <h1>Purchase</h1>
            <p>Please select an available date for your visit and the amount of tickets you’ll be purchasing.</p>
            <div className="tickets">
                {tickets.map(ticket=>(
                    <div className="ticket" key={ticket.ticket_id}>
                        <p class="capitalize">{ticket.type} admission <span> ${ticket.price}</span><span><button>-</button><button>+</button></span></p>
                    </div>
                ))}
            </div>
            <div>
                <h2>Subtotal</h2>
                <button>Checkout</button>
            </div>
        </div>*/    
    );
};



export default TicketPage;