import TicketFormDataContext from "../contexts/TicketFormDataContext.jsx";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom'
import SubtractIcon from '../components/SubtractIcon.jsx'
import AddIcon from '../components/AddIcon.jsx'
import { useAuth } from "../components/authentication"
import axios from "axios"
import NavBarBlack from "../components/NavbarBlack.jsx"

const ExhibitionsPurchasePage = (props) => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const {formData, setFormData} = useContext(TicketFormDataContext);
  const [exhibitionFormData, setExhibitionFormData] = useState({})
  const [customerInfo, setCustomerInfo] = useState({});
  const [exhibitions, setExhibitions] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [maxTickets, setMaxTickets] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [subtotal, setSubtotal] = useState(0);
  const [subtractFromSubtotal, setSubtractFromSubtotal] = useState(0);
  const [sumExhibitFormData, setSumExhibitFormData] = useState(0);
  let selectedDate = props.selDate;
  let ticketTypePricePairs = {};

  const fetchExhibitions = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/exhibition`
      );
      const filteredExhibitions = response.data
        .filter((exhibition) => exhibition.is_active !== 0)
        .sort((a, b) => new Date(a.end_date) - new Date(b.end_date));
      return filteredExhibitions;
    } catch (error) {
      console.error("Error fetching exhibitions:", error);
    }
  };

  const fetchCustomerInfo = async (userId) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/customer/${userId}`
      );
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAllTickets = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/ticket`
      );
      setTickets(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  const sumFormData = (formData) => {
    let ans = 0;
    tickets.map((ticket) => {
      ans += formData[ticket.type];
    })
    return ans;
  };

  const getSumExhibitFormData = (exhibitionFormData) => {
    let ans = 0;
    exhibitions.map((exhibition) => {
      ans += exhibitionFormData[exhibition.name];
    })
    setSumExhibitFormData(ans);
  };

  // Update form data whenever input changes. Don't allow values out of range 
  const handleChange = (e) => {
    let { name, value } = e.target;
    if(value > maxTickets){
      value = maxTickets;
    }
    else if(value < 0){
      value = 0;
    }
    
    setExhibitionFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Decrease ticket count by 1
  const handleDecrease = (e) => {
    e.preventDefault()
    let { name, value } = e.currentTarget;
    value--;
    setExhibitionFormData((prevState) => ({
      ...prevState,
      [name]: value >= maxTickets ? maxTickets : value <= 0 ? 0 : value
    }));

  };

  // Increase ticket count by 1
  const handleIncrease = (e) => {
    e.preventDefault()
    let { name, value } = e.currentTarget;
    value++;
    setExhibitionFormData((prevState) => ({
      ...prevState,
      [name]: value >= maxTickets ? maxTickets : value <= 0 ? 0 : value
    }));

  };

  // Capitalize the first letter of each word in a ticket type for neater formatting
  const capitalize = (sentence) => {
    if(!(sentence.includes(" "))){
      return sentence[0].toUpperCase() + sentence.substring(1);
    }
    const words = sentence.split(" ");

    words.map((word) => { 
      return word[0].toUpperCase() + word.substring(1); 
    })

    return(words.join(" "));
  }

  const handleSubmit = async () => {
    try {
      let permCollectTicketsArr = [];
      let exhibitionTicketsArr = [];
      const convertedDate = selectedDate.toISOString().split("T")[0];
      tickets.map((ticket) => {
        let counter = 0;
        for (let j = 0; j < formData[ticket.type]; j++) {
          permCollectTicketsArr.push({
            customer_id: userId,
            ticket_id: ticket.ticket_id,
            amount_spent: (customerInfo.is_member && (ticket.type == "Adult")) ? (counter < 1 ? 0 : ticket.price) : (ticket.price),
            valid_day: convertedDate,
          });
          counter = 1;
        }
      })
      exhibitions.map((exhibition) => {
        let counter = 0;
        for (let j = 0; j < exhibitionFormData[exhibition.name]; j++) {
          exhibitionTicketsArr.push({
            customer_id: userId,
            exhibition_id: exhibition.exhibit_id,
            amount_spent: customerInfo.is_member ? (counter < 1 ? 0 : exhibition.admission_price) : (exhibition.admission_price),
            valid_day: convertedDate
          });
          counter = 1;
        }
      })
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/customer_ticket`,
        permCollectTicketsArr
      );
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/customer_exhibition`,
        exhibitionTicketsArr
      );
      navigate('../tickets/purchased');
    } catch (err) {
      console.log(err);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false); // Close the popup
  };

// Calculate subtotal
const handleSubtotal = (formData, exhibitionFormData) => {
  let ans = 0;
  tickets.map((ticket) => {
    ans += formData[ticket.type] * ticket.price;
  })
  exhibitions.map((exhibition) => {
    ans += exhibitionFormData[exhibition.name] * exhibition.admission_price;
  })
  setSubtotal(ans.toFixed(2));
};
  

  useEffect(() => {
    const initializeForm = async () => {
      fetchAllTickets();
      const receivedExhibitions = await fetchExhibitions();
      setExhibitions(receivedExhibitions);
      const receivedCustomerInfo = await fetchCustomerInfo(userId);
      setCustomerInfo(receivedCustomerInfo);
    }
    initializeForm();
  }, []);


  useEffect(() => {
    exhibitions.map((exhibition) => {
      setExhibitionFormData((prevState) => ({
        ...prevState,
        [exhibition.name]: 0,
      }));
    })
  }, [exhibitions]);

  useEffect(() => {
    setMaxTickets(sumFormData(formData));
  }, [tickets]);
  
  useEffect(() => {
    handleSubtotal(formData, exhibitionFormData);
    getSumExhibitFormData(exhibitionFormData);
  }, [exhibitionFormData]);

  useEffect(() => {
    let ans = 0;
    if(formData["Adult"] > 0){
      ans += ticketTypePricePairs["Adult"]
    }
    {exhibitions.map((exhibition) => {
      if(exhibitionFormData[exhibition.name] > 0){
        ans += exhibition.admission_price
      }
    })}

    setSubtractFromSubtotal(ans);
  }, [showPopup])
  
  



  return (
    <div> 
      <NavBarBlack/>
      <div className="container mx-auto pb-12 p-1">
        <div className="mt-28 flex justify-between px-16 space-x-24">
          <div className="relative text-lg font-medium leading-loose w-1/4">
            Your Tickets:<hr/>
            {tickets.map((ticket) => {
              ticketTypePricePairs[ticket.type] = ticket.price;
              return(
                formData[ticket.type] > 0 &&
                <div 
                  key={ticket.ticket_id}
                  className="flex flex-row justify-between"
                >
                  <p>{capitalize(ticket.type)} Admission ({formData[ticket.type]}x)</p>
                  <p>${(ticket.price).toFixed(2)}</p>
                </div>
              )
            })}
            {exhibitions.map((exhibition) => {
              return(
                exhibitionFormData[exhibition.name] > 0 &&
                <div 
                  key={exhibition.exhibition_id}
                  className="flex flex-row justify-between"
                >
                  <p>{capitalize(exhibition.name)} Admission ({exhibitionFormData[exhibition.name]}x)</p>
                  <p>${Number(exhibition.admission_price).toFixed(2)}</p>
                </div>
              )
            })}
            <div className="mt-10 text-default-gray text-lg flex justify-between absolute bottom-10">
              <span className="font-medium">Subtotal:</span> &nbsp; ${subtotal}
            </div>
          </div>
          <div className="w-1/2">
            <h1 className="text-2xl font-medium"> Select the special exhibitions you want to attend (optional) </h1>
            <form className="mt-6">
              <div className="grid grid-cols-1 divide-y-2">
                <div></div>
                {exhibitions.map((exhibition) => {
                  return(
                    //Entries for each ticket
                    <div 
                    key={exhibition.exhibit_id}
                    className="flex justify-between pt-5 pb-5 items-center"
                    >
                      <label className="font-medium" htmlFor={exhibition.name}>
                        {capitalize(exhibition.name)} Admission
                      </label>
                      <div className="flex flex-row">
                        <div className="mr-3 p-1">
                          ${Number(exhibition.admission_price).toFixed(2)}
                        </div>

                        {/* Remove a ticket */}
                        <button name={exhibition.name} value={exhibitionFormData[exhibition.name]} onClick={handleDecrease}>
                          <SubtractIcon/>
                        </button>

                        <input
                          type="number"
                          name={exhibition.name}
                          id={exhibition.name}
                          min="0"
                          max={maxTickets}
                          placeholder="0"
                          value={exhibitionFormData[exhibition.name] || 0}
                          onChange={handleChange}
                          onKeyDown={(e) => {
                            if(e.key==='.'){e.preventDefault()} // Prevent decimal
                          }}
                          onInput={(e) => { // Remove leading zeros
                            if(e.target.value[0] == "0" && (e.target.value).length > 1){
                              e.target.value = e.target.value.replace("0", "");
                            }
                            e.target.value = e.target.value.replace(/[^0-9]*/g,''); // Do not allow "+" or "-"
                          }} 
                          className="w-9 text-center"
                        />

                        {/* Add a ticket */}
                        <button name={exhibition.name} value={exhibitionFormData[exhibition.name]} onClick={handleIncrease}>
                          <AddIcon/>
                        </button>
                      </div>
                    </div>

                  )
                })}
                <div></div>
              </div>
              <button
                type="button"
                className="w-full mt-4 bg-black text-white py-2 px-52 border-black rounded"
                onClick={() => {setShowPopup(true)}}
              >
                Purchase
              </button>
            </form>
          </div>
        </div>
      </div>
      {showPopup && (
          <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-500 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-1/2 h-5/6 overflow-y-scroll">
              <h3 className="text-2xl">You are about to purchase:</h3>
              <div className="text-lg leading-loose mt-5">
                {tickets.map((ticket) => {
                  return(
                    formData[ticket.type] > 0 &&
                    <div 
                      key={ticket.ticket_id}
                      className="flex flex-row justify-between"
                    >
                      <p>{capitalize(ticket.type)} Admission ({formData[ticket.type]}x)</p>
                      <p>${(ticket.price).toFixed(2)}</p>
                    </div>
                  )
                })}
                {exhibitions.map((exhibition) => {
                  return(
                    exhibitionFormData[exhibition.name] > 0 &&
                    <div 
                      key={exhibition.exhibition_id}
                      className="flex flex-row justify-between"
                    >
                      <p>{capitalize(exhibition.name)} Admission ({exhibitionFormData[exhibition.name]}x)</p>
                      <p>${Number(exhibition.admission_price).toFixed(2)}</p>
                    </div>
                  )
                })}
                <hr/>
                <div className="flex flex-row justify-between text-default-gray">
                  <p>Subtotal:</p>
                  <p>${Number(subtotal).toFixed(2)}</p>
                </div>
                {(Boolean(customerInfo.is_member) && formData["Adult"] > 0) && (
                  <div className="text-default-gray">
                    <hr/>
                    <div className="flex flex-row justify-between mt-1">
                      <p>Discount (Member, Free Adult Admission): </p>
                      <p className="text-red-600">-${(ticketTypePricePairs["Adult"]).toFixed(2)}</p>
                    </div>
                  </div>
                )}
                {(Boolean(customerInfo.is_member) && sumExhibitFormData > 0) && (
                  <div className="mt-1 text-default-gray">
                    <div>Discount (Member, Free Exhibit Admission): </div>
                    {exhibitions.map((exhibition) => {
                      return(
                        exhibitionFormData[exhibition.name] > 0 &&
                        <div 
                          key={exhibition.exhibition_id}
                          className="flex flex-row justify-between"
                        >
                          <p>{capitalize(exhibition.name)} Admission (1x)</p>
                          <p className="text-red-600">-${Number(exhibition.admission_price).toFixed(2)}</p>
                        </div>
                      )
                    })}
                  </div>
                )}
                <hr/>
                <span className="font-bold mt-30">Total: ${customerInfo.is_member ? ((Number(subtotal) - Number(subtractFromSubtotal)).toFixed(2)) : (Number(subtotal).toFixed(2))}</span>
              </div>
              <div className="flex flex-row justify-between">
                <button
                  onClick={handleClosePopup} // Close popup and trigger redirect
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit} // Close popup and trigger redirect
                  className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
      )}  
    </div>
    )
}

export default ExhibitionsPurchasePage