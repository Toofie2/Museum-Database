import React, {useEffect, useState} from 'react'
import axios from 'axios'

const TicketPage = () => {
    const[tickets, setTickets] = useState([]);
    const[subtotal, setSubtotal] = useState(0);
    const[formData, setFormData] = useState({
        adult: 0,
        senior: 0,
        youth: 0,
        child: 0,
        student: 0
    }); 
    const purchasedTicket = {
        customer_id: 1,
        ticket_id: 0,
        amount_spent: 0,
        valid_start: "2024-12-01 01:00:00",
        valid_end: "2024-12-01 08:00:00"
    };


    
    const handleChange = (e)=>{
        const {name, value} = e.target;
        setFormData(prevState=>({
            ...prevState,
            [name]: value,
        }))
    }

    const handleSubtotal = (formData)=>{
        let ans = formData.adult * ticketPrices.at(0) + formData.senior * ticketPrices.at(1) + formData.youth * ticketPrices.at(2) + formData.child * ticketPrices.at(3) + formData.student * ticketPrices.at(4);
        setSubtotal(ans);
    }

    const handleSubmit = async e=>{
        //e.preventDefault()
        try{
            let promises = [];
            purchasedTicket.ticket_id = ticketIDs.at(0);
            purchasedTicket.amount_spent = ticketPrices.at(0);
            for(let j = 0; j < formData.adult; j++){
                promises.push(axios.post("http://localhost:3000/customer_ticket", purchasedTicket));
            }
            purchasedTicket.ticket_id = ticketIDs.at(1);
            purchasedTicket.amount_spent = ticketPrices.at(1);
            for(let j = 0; j < formData.senior; j++){
                promises.push(axios.post("http://localhost:3000/customer_ticket", purchasedTicket));
            }
            purchasedTicket.ticket_id = ticketIDs.at(2);
            purchasedTicket.amount_spent = ticketPrices.at(2);
            for(let j = 0; j < formData.youth; j++){
                promises.push(axios.post("http://localhost:3000/customer_ticket", purchasedTicket));
            }
            purchasedTicket.ticket_id = ticketIDs.at(3);
            purchasedTicket.amount_spent = ticketPrices.at(3);
            for(let j = 0; j < formData.child; j++){
                promises.push(axios.post("http://localhost:3000/customer_ticket", purchasedTicket));
            }
            purchasedTicket.ticket_id = ticketIDs.at(4);
            purchasedTicket.amount_spent = ticketPrices.at(4);
            for(let j = 0; j < formData.student; j++){
                promises.push(axios.post("http://localhost:3000/customer_ticket", purchasedTicket));
            }
            let allPromises = Promise.all(promises).then(() => console.log('all done'));
        }catch(err){
            console.log(err)
        }
    } 

    useEffect(()=>{
        handleSubtotal(formData);
    })

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
    const ticketPrices = tickets?.map(ticket=>{
        return ticket.price
    })
    const ticketIDs = tickets?.map(ticket=>{
        return ticket.ticket_id
    })
    return (
        <div className="ticketForm">
            <form>
                <label>
                    Adult Admission (19+) ${ticketPrices.at(0)} &emsp;&emsp;
                    <input 
                        type="number"
                        name="adult"
                        value={formData.adult}
                        onChange={handleChange} 
                    />
                </label>
                <br></br>
                <label>
                    Senior Admission (65+) ${ticketPrices.at(1)} &emsp;&emsp;
                    <input 
                        type="number"
                        name="senior"
                        value={formData.senior}
                        onChange={handleChange} 
                    />
                </label>
                <br></br>
                <label>
                Youth Admission (13-18) ${ticketPrices.at(2)} &emsp;&emsp;
                    <input 
                        type="number"
                        name="youth"
                        value={formData.youth}
                        onChange={handleChange} 
                    />
                </label>
                <br></br>
                <label>
                Child Admission (12 & Under) ${ticketPrices.at(3)} &emsp;&emsp;
                    <input 
                        type="number"
                        name="child"
                        value={formData.child}
                        onChange={handleChange} 
                    />
                </label>
                <br></br>
                <label>
                Student Admission (with valid ID) ${ticketPrices.at(4)} &emsp;&emsp;
                    <input 
                        type="number"
                        name="student"
                        value={formData.student}
                        onChange={handleChange} 
                    />
                </label>
                <div>
                    <span>Subtotal</span>
                    <span>${subtotal}</span>
                </div>
                <button onClick={handleSubmit}>Checkout</button>   
            </form>
        </div>
    );
};



export default TicketPage;