import React, {useEffect, useState} from 'react'
import axios from 'axios'

const TicketPage = () => {
    const[tickets, setTickets] = useState([])
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
    );
};





/*const TicketPage = () => {
    const[data, setData] = useState([])
    useEffect(() => {
        axios.get('http://localhost:3000/ticket')
        .then(res => setData(res.data))
        .catch(err => console.log(err));
    }, [])
    return (
        <div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>ticket_id</th>
                            <th>type</th>
                            <th>price</th>
                            <th>is_deleted</th>
                            <th>action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((ticket, index) => {
                            return <tr key = {index}>
                                <td>{ticket.ticket_id}</td>
                                <td>{ticket.type}</td> 
                                <td>{ticket.price}</td>
                                <td>{ticket.is_deleted}</td>
                                <td>
                                    <button>Edit</button>
                                    <button>Delete</button>
                                </td>     
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};*/

export default TicketPage;