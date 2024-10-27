import React from 'react'
import {useEffect} from 'react'
import {useState} from 'react'
import { NavLink } from 'react-router-dom'
import axios from 'axios'

const CustomerPage = () => {
    const [customers, setCustomers] = useState([])

    useEffect(()=>{
        const fetchAllCustomers = async ()=>{
            try{
                const res = await axios.get("http://localhost:3000/Customer")
                setCustomers(res.data);
                console.log(res);
            }
            catch(err){
                console.log(err);
            }
        };
        fetchAllCustomers()
    },[]);

    return (
        <div>
        <h1>Museum Customer List</h1>
        <div className="Customer">
            {customers.map((cust) => (
                <div className="Customer" key={cust.customer_id}>
                    <h2>{cust.first_name}</h2>
                    <p>{cust.middle_initial}</p>
                    <p>{cust.last_name}</p>
                    <p>{cust.is_member}</p>
                    <span>{cust.membership_start_date}</span>
                    <button className="delete" onClick={()=>handleDelete(cust.customer_id)}>Delete</button>
                    <button className="update"><NavLink to={`/update/${cust.customer_id}`}>Update</NavLink></button>
                </div>
            ))}
        </div>
        <button>
            <NavLink to="/add">Add new Customer</NavLink>
        </button>
    </div>
    );
}


/*previous attempt lol

const CustomerPage = () => {
    return (
        <div>CustomerPage</div>
    );
};*/

/*async function fetchCustomers() {
    try {
        const response = await fetch('http://localhost:3000/customers');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const customers = await response.json();
        return customers;
    } catch (error) {
        console.error("Error fetching customers:", error);
        return [];
    }
}

function CustomerList() {
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        // Fetch customers on component mount
        fetchCustomers().then(data => setCustomers(data));
    }, []);

    return (
        <div>
            <h2>Customer List</h2>
            <ul>
                {customers.map(customer => (
                    <li key={customer.customer_id}>{customer.first_name}{customer.last_name}{customer.is_member}{customer.membership_start_date}</li> // Replace with actual fields
                ))}
            </ul>
        </div>
    );
}*/

export default CustomerPage;