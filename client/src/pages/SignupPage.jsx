import React from 'react'
import {useEffect} from 'react'
import {useState} from 'react'
import axios from 'axios'

const SignupPage = () => {
    const [customer,setCustomer] = useState({
        first_name: "",
        middle_initial: "",
        last_name: "",
    });

    const [credentials,setCredentials] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setCustomer((prev)=>({...prev, [e.target.name]: e.target.value }))
        setCredentials((prev)=>({...prev, [e.target.name]: e.target.value }))
    };
    
    const handleClick = async e => {
        e.preventDefault()
        try{
            await axios.post("http://localhost:3000/Customer",customer)
            navigate("/")
        }
        catch(err){
            console.log(err)
        }
        try{
            await axios.post("http://localhost:3000/Authentication",credentials)
            navigate("/")
        }
        catch(err){
            console.log(err)
        }
    }

    console.log(customer)
    console.log(credentials)

    return (
        <div className="form">
            <h1>Register</h1>
            <input type="text" placeholder="first_name" onChange={handleChange}name="first_name"/>
            <input type="text" placeholder="middle_initial" onChange={handleChange}name="middle_initial"/>
            <input type="text" placeholder="last_name" onChange={handleChange}name="last_name"/>
            <input type="text" placeholder="email" onChange={handleChange}name="email"/>
            <input type="text" placeholder="password" onChange={handleChange}name="password"/>
            <button className="formButton" onClick={handleClick}>Add</button>
        </div>
    )
}


export default SignupPage;