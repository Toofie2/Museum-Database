import React from 'react'

const TicketInfo = () => {
    return(
       <div>
            <h1 class="text-3xl font-medium">
                Admission Tickets
            </h1>
            <p class="leading-loose mt-3">
                $24 for adults; $20 for seniors; $15 for youth, $17 for students; <br></br>
                Free for Members, children under 12, and veterans. <br></br> 
                Must verify student or veteran status at entry with a valid ID <br></br>
                All tickets give access to same-day entry to museum for the date on your ticket.
            </p>
            <div class="text-white box-border h-auto w-fit px-5 py-4 border-4 border-gray-brown rounded bg-gray-brown mt-6">
                <h2 class="text-xl font-medium">
                    Become a Member
                </h2>
                <p class="mt-1">
                    Enjoy <span class="font-medium">unlimited free admission</span> for you and your guest(s) on every visit!
                </p>
                <button class=" mt-5 text-white py-2 px-5 border-2 border-white rounded">
                    Join now
                </button>
            </div>
       </div> 
    )
}




export default TicketInfo