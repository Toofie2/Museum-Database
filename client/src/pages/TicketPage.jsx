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
    return (
        <div>
            <form>
                <label>
                    Adult Admission (19+) ${ticketPrices.at(0)}
                    <input 
                        type="number"
                        name="adult"
                        value={formData.adult}
                        onChange={handleChange} 
                    />
                </label>
                <br></br>
                <label>
                    Senior Admission (65+) ${ticketPrices.at(1)}
                    <input 
                        type="number"
                        name="senior"
                        value={formData.senior}
                        onChange={handleChange} 
                    />
                </label>
                <br></br>
                <label>
                Youth Admission (13-18) ${ticketPrices.at(2)}
                    <input 
                        type="number"
                        name="youth"
                        value={formData.youth}
                        onChange={handleChange} 
                    />
                </label>
                <br></br>
                <label>
                Child Admission (12 & Under) ${ticketPrices.at(3)}
                    <input 
                        type="number"
                        name="child"
                        value={formData.child}
                        onChange={handleChange} 
                    />
                </label>
                <br></br>
                <label>
                Student Admission (with valid ID) ${ticketPrices.at(4)}
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
            </form>
        </div>
    );
};



export default TicketPage;