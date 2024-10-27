import React from 'react'
import {useEffect} from 'react'
import {useState} from 'react'
import { NavLink } from 'react-router-dom'
import axios from 'axios'

const ReviewPage = () => {
    const [reviews, setReviews] = useState([])

    useEffect(()=>{
        const fetchAllReviews = async ()=>{
            try{
                const res = await axios.get("http://localhost:3000/Review")
                setReviews(res.data);
                console.log(res);
            }
            catch(err){
                console.log(err);
            }
        };
        fetchAllReviews()
    },[]);

    return (
        <div>
        <h1>Museum Reviews</h1>
        <div className="Reviews">
            {reviews.map((rev) => (
                <div className="Reviews" key={rev.review_id}>
                    <h2>{rev.customer_id}</h2>
                    <p>{rev.title}</p>
                    <p>{rev.feedback}</p>
                    <p>{rev.rating}</p>
                    <span>{rev.date_posted}</span>
                </div>
            ))}
        </div>
        <button>
            <NavLink to="/add">Add New Review</NavLink>
        </button>
    </div>
    );
}

export default ReviewPage;