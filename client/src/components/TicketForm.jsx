import React, {useEffect, useState} from 'react'
import axios from 'axios'

const TicketForm = () => {
    const[tickets, setTickets] = useState([]);
    const[subtotal, setSubtotal] = useState(0);
    const[formData, setFormData] = useState({
        adult: 0,
        senior: 0,
        youth: 0,
        child: 0,
        student: 0,
        veteran: 0
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
            <h1 class="text-3xl font-medium">Purchase</h1>
            <p class="mt-3 leading-loose">Please select an available date for your visit and the amount of tickets you’ll be purchasing.</p>
            <form>
                <label>
                    <span class="font-medium">Adult Admission (19+)</span> ${ticketPrices.at(0)} &emsp;&emsp;
                    <input 
                        type="number"
                        name="adult"
                        value={formData.adult}
                        onChange={handleChange} 
                    />
                </label>
                <br></br>
                <label>
                    <span class="font-medium">Senior Admission (65+)</span>  ${ticketPrices.at(1)} &emsp;&emsp;
                    <input 
                        type="number"
                        name="senior"
                        value={formData.senior}
                        onChange={handleChange} 
                    />
                </label>
                <br></br>
                <label>
                <span class="font-medium">Youth Admission (13-18)</span>  ${ticketPrices.at(2)} &emsp;&emsp;
                    <input 
                        type="number"
                        name="youth"
                        value={formData.youth}
                        onChange={handleChange} 
                    />
                </label>
                <br></br>
                <label>
                <span class="font-medium">Child Admission (12 & Under)</span>  ${ticketPrices.at(3)} &emsp;&emsp;
                    <input 
                        type="number"
                        name="child"
                        value={formData.child}
                        onChange={handleChange} 
                    />
                </label>
                <br></br>
                <label>
                <span class="font-medium">Student Admission (with valid ID)</span>  ${ticketPrices.at(4)} &emsp;&emsp;
                    <input 
                        type="number"
                        name="student"
                        value={formData.student}
                        onChange={handleChange} 
                    />
                </label>
                <br></br>
                <label>
                <span class="font-medium">Veteran Admission (with valid ID)</span>  ${ticketPrices.at(5)} &emsp;&emsp;
                    <input 
                        type="number"
                        name="veteran"
                        value={formData.veteran}
                        onChange={handleChange} 
                    />
                </label>
                <div>
                    <span class="text-default-gray">Subtotal${subtotal}</span>
                </div>
                <button class="bg-black text-white py-2 px-52 border-black rounded" onClick={handleSubmit}>
                    Checkout
                </button>   
            </form>
        </div>
    );
};



export default TicketForm;