import TicketFormDataContext from "../contexts/TicketFormDataContext.jsx";
import { useEffect, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom'
import SubtractIcon from '../components/SubtractIcon.jsx'
import AddIcon from '../components/AddIcon.jsx'
import { useAuth } from "../components/authentication"
import axios from "axios"
import NavBarBlack from "../components/NavbarBlack.jsx"

const ExhibitionsPurchasePage = () => {
  const { userId } = useAuth();
  const navigate = useNavigate();
  const {formData, setFormData} = useContext(TicketFormDataContext);
  const [exhibitionFormData, setExhibitionFormData] = useState({})
  const [customerInfo, setCustomerInfo] = useState({});
  const [exhibitions, setExhibitions] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [maxTickets, setMaxTickets] = useState(0);

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
      const convertedDate = new Date();//selectedDate.toISOString().split("T")[0];
      tickets.map((ticket) => {
        for (let j = 0; j < formData[ticket.type]; j++) {
          permCollectTicketsArr.push({
            customer_id: userId,
            ticket_id: ticket.ticket_id,
            amount_spent: ticket.price,
            valid_day: convertedDate,
          });
        }
      })
      exhibitions.map((exhibition) => {
        for (let j = 0; j < exhibitionFormData[exhibition.name]; j++) {
          exhibitionTicketsArr.push({
            customer_id: userId,
            exhibition_id: exhibition.exhibit_id,
            amount_spent: 1,
            valid_day: convertedDate
          });
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
    console.log(maxTickets);
  }, [tickets]);

  



  return (
    <div> 
      <NavBarBlack/>
      <div className="container mx-auto pb-12 p-1">
        <div className="mt-28 flex justify-between px-16 space-x-24">
          <div className="text-lg font-medium leading-loose w-1/4">
            Your Tickets:<hr/>
            {tickets.map((ticket) => {
              return(
                formData[ticket.type] > 0 &&
                <div 
                  key={ticket.ticket_id}
                >
                  {capitalize(ticket.type)} Admission ({formData[ticket.type]}x)
                </div>
              )
            })}
            {exhibitions.map((exhibition) => {
              return(
                exhibitionFormData[exhibition.name] > 0 &&
                <div 
                  key={exhibition.exhibition_id}
                >
                  {capitalize(exhibition.name)} Admission ({exhibitionFormData[exhibition.name]}x)
                </div>
              )
            })}
          </div>
          <div className="w-1/2">
            <h1 className="text-2xl font-medium"> Select the special exhibitions you want to attend </h1>
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
                          $1.00
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
                onClick={handleSubmit}
              >
                Purchase
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    )
}

export default ExhibitionsPurchasePage