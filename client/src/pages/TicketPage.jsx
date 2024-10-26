import React, {useEffect, useState} from 'react'
import axios from 'axios'

const TicketPage = () => {
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
};

export default TicketPage;