import React from 'react'

const TicketInfo = () => {
    return(
       <div>
            <h1 class="text-2xl font-medium">
                Admission Tickets
            </h1>
            <p>
                $30 for adults; $22 for seniors; $17 for students; <br></br>
                Free for Members, children under 12, veterans, and a caregiver accompanying a visitor with a disability. <br></br> 
                Must verify student or veteran status at entry with a valid ID <br></br>
                All tickets give access to all exhibitions and same-day entry to museum for the date on your ticket.
            </p>
            <div class="text-white box-border h-full w-96 p-4 border-4 border-gray-brown rounded bg-gray-brown">
                <h2 class="text-xl font-medium">
                    Become a Member
                </h2>
                <p>
                    Enjoy <span class="font-medium">unlimited free admission</span> for you and your guest(s) on every visit!
                </p>
            </div>
       </div> 
    )
}




export default TicketInfo