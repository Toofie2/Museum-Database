import { Link } from 'react-router-dom'

const TicketInfo = () => {
    return(
       <div>
            <h1 className="text-3xl font-medium">
                Admission Tickets
            </h1>
            <p className="leading-loose mt-3">
                $24 for adults; $20 for seniors; $15 for youth, $17 for students; <br></br>
                Free for Members, children under 12, and veterans. <br></br> 
                Must verify student or veteran status at entry with a valid ID <br></br>
                All tickets give access to same-day entry to museum for the date on your ticket.
            </p>
            <div className="text-white box-border h-auto w-full px-5 py-4 border-4 border-gray-brown rounded bg-gray-brown mt-6">
                <h2 className="text-xl font-medium">
                    Become a Member
                </h2>
                <p className="mt-1">
                    Enjoy <span className="font-medium">unlimited free adult admission</span> on every visit!
                </p>
                
                <Link to={'/membership'}>
                    <button className=" mt-5 text-white py-2 px-5 border-2 border-white rounded hover:bg-stone-400 transition duration-200">
                        Join now
                    </button>
                </Link>
            </div>
       </div> 
    )
}

export default TicketInfo