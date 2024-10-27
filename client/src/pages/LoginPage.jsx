import React from 'react'
import {useEffect} from 'react'
import {useState} from 'react'
import { NavLink } from 'react-router-dom'
import axios from 'axios'

const LoginPage = () => {
    const [customer,addCustomer] = useState({
        first_name: "",
        middle_initial: "",
        last_name: "",
    });
}

export default LoginPage;