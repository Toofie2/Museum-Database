import React from 'react'
import {useEffect} from 'react'
import {useState} from 'react'
import { NavLink } from 'react-router-dom'
import axios from 'axios'
import Navbar from "../components/Navbar";

const ReviewPage = () => {
    const [reviews, setReviews] = useState([])

    useEffect(() => {
        const fetchAllReviews = async () => {
            try {
                const res = await axios.get("http://localhost:3000/Review");
                // Format the date to show only date for each review item
                const formattedReviews = res.data.map(review => ({
                    ...review,
                    date_posted: new Date(review.date_posted).toLocaleDateString()
                }));
                setReviews(formattedReviews);
                console.log(res);
            } catch (err) {
                console.log(err);
            }
        };
        fetchAllReviews();
    }, []);

    return (
        <div className="container mx-auto pb-12 px-4">
            <Navbar />
            {/* Banner Section */}
            <div className="relative flex items-center h-[75px] w-full mb-8">
                <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center pl-4">
                    {/* Optionally, you can add content to the banner if needed */}
                </div>
            </div>
            {/* Button to Add New Review */}
            <div className="flex justify-center mt-8">
                <NavLink to="/postreview">
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition duration-200">
                        Add New Review
                    </button>
                </NavLink>
            </div>
    
            {/* Reviews Title */}
            <h1 className="text-5xl md:text-5xl font-bold text-gray-800 mb-4">Reviews</h1>
    
            {/* Reviews List */}
            <div className="space-y-6">
                {reviews.map((rev) => (
                    <div key={rev.review_id} className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
                        <h2 className="text-xl font-medium text-gray-800">Title: {rev.title}</h2>
                        <p className="text-base text-gray-700">Feedback: {rev.feedback}</p>
                        <p className="text-lg text-gray-600">Rating: {rev.rating}</p>
                        <p className="text-sm text-gray-500">Date Posted: {rev.date_posted}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ReviewPage;