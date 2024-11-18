import {useEffect, useState, useContext} from 'react'
import axios from 'axios'
import DatePickerComponent from "../components/DatePickerComponent"
import { useNavigate, Link } from 'react-router-dom'
import SubtractIcon from '../components/SubtractIcon.jsx'
import AddIcon from '../components/AddIcon.jsx'
import { useAuth } from "../components/authentication"
import NavbarBlack from "../components/NavbarBlack.jsx";
import TicketFormDataContext from "../contexts/TicketFormDataContext.jsx";
import Footer from "../components/Footer.jsx";

const TicketPage = (props) => {
  const { formData, setFormData } = useContext(TicketFormDataContext);

  const { userId } = useAuth();
  const navigate = useNavigate();
  let subtractFromSubtotal = 0;

  // Fetch tickets from database
  const fetchAllTickets = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/ticket`);
      return res.data;
    } catch (err) {
      console.log(err);
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

  // Update form data whenever input changes. Don't allow values out of range
  const handleChange = (e) => {
    let { name, value } = e.target;
    if (value > maxTickets) {
      value = maxTickets;
    } else if (value < 0) {
      value = 0;
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Decrease ticket count by 1
  const handleDecrease = (e) => {
    e.preventDefault();
    let { name, value } = e.currentTarget;
    value--;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value >= maxTickets ? maxTickets : value <= 0 ? 0 : value,
    }));
  };

  // Increase ticket count by 1
  const handleIncrease = (e) => {
    e.preventDefault();
    let { name, value } = e.currentTarget;
    value++;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value >= maxTickets ? maxTickets : value <= 0 ? 0 : value,
    }));
  };

  // Calculate subtotal
  const handleSubtotal = (formData) => {
    let ans = 0;
    tickets.map((ticket) => {
      ans += formData[ticket.type] * ticket.price;
    });
    setSubtotal(ans.toFixed(2));
  };

  // Post tickets to database under Customer_Ticket table
  const handleSubmit = async () => {
    try {
      let purchasedTicketsArr = [];
      const convertedDate = selectedDate.toISOString().split("T")[0];
      let freeTicketCounter = 0;
      tickets.map((ticket) => {
        for (let j = 0; j < formData[ticket.type]; j++) {
          if (customerInfo.is_member == true) {
            if (ticket.type == "adult" && formData[ticket.type] > 0) {
              if (freeTicketCounter < 1) {
                purchasedTicketsArr.push({
                  customer_id: userId,
                  ticket_id: ticket.ticket_id,
                  amount_spent: 0,
                  valid_day: convertedDate,
                });
                freeTicketCounter++;
              } else {
                purchasedTicketsArr.push({
                  customer_id: userId,
                  ticket_id: ticket.ticket_id,
                  amount_spent: ticket.price,
                  valid_day: convertedDate,
                });
              }
            } else {
              purchasedTicketsArr.push({
                customer_id: userId,
                ticket_id: ticket.ticket_id,
                amount_spent: ticket.price,
                valid_day: convertedDate,
              });
            }
          } else {
            purchasedTicketsArr.push({
              customer_id: userId,
              ticket_id: ticket.ticket_id,
              amount_spent: ticket.price,
              valid_day: convertedDate,
            });
          }
        }
      });
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/customer_ticket`,
        purchasedTicketsArr
      );
      navigate("./purchased");
    } catch (err) {
      console.log(err);
    }
  };

  // Capitalize the first letter of each word in a ticket type for neater formatting
  const capitalize = (sentence) => {
    if (!sentence.includes(" ")) {
      return sentence[0].toUpperCase() + sentence.substring(1);
    }
    const words = sentence.split(" ");

    words.map((word) => {
      return word[0].toUpperCase() + word.substring(1);
    });

    return words.join(" ");
  };

  // State variables for tickets, form data, and subtotal
  const [tickets, setTickets] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [formDataAsArr, setFormDataAsArr] = useState([]);
  const [customerInfo, setCustomerInfo] = useState({});
  let ticketTypePricePairs = {};

  useEffect(() => {
    setFormDataAsArr(Object.entries(formData));
  }, [formData]);

  // Date picker
  const { render, selectedDate } = DatePickerComponent();

  // Max number of tickets for each type
  const maxTickets = 10;

  // Fetch tickets from database and initialize form
  useEffect(() => {
    const initializeForm = async () => {
      const tickets = await fetchAllTickets();
      setTickets(tickets);
      const receivedCustomerInfo = await fetchCustomerInfo(userId);
      setCustomerInfo(receivedCustomerInfo);
      tickets.map((ticket) => {
        setFormData((prevState) => ({
          ...prevState,
          [ticket.type]: 0,
        }));
      });
    };
    initializeForm();
  }, []);

  // Calculate new subtotal and display it every time number of tickets changes
  useEffect(() => {
    handleSubtotal(formData);
  }, [formData]);

  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
    subtractFromSubtotal = 0;
  };

  if (modal) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  return (
    <div>
      <NavbarBlack />
      <div className="container mx-auto pb-12 p-1">
        <div className="mt-28 flex justify-between px-16 space-x-24">
          <div>
            <div>
              <h1 className="text-3xl font-medium">Admission Tickets</h1>
              <p className="leading-loose mt-3">
                $24 for adults; $20 for seniors; $15 for youth, $17 for
                students; <br></br>
                Free for Members, children under 12, and veterans. <br></br>
                Must verify student or veteran status at entry with a valid ID{" "}
                <br></br>
                All tickets give access to same-day entry to museum for the date
                on your ticket.
              </p>
              <div className="text-white box-border h-auto w-full px-5 py-4 border-4 border-gray-brown rounded bg-gray-brown mt-6">
                <h2 className="text-xl font-medium">Become a Member</h2>
                <p className="mt-1">
                  Enjoy{" "}
                  <span className="font-medium">
                    unlimited free adult admission
                  </span>{" "}
                  on every visit!
                </p>

                <Link to={"/membership"}>
                  <button className=" mt-5 text-white py-2 px-5 border-2 border-white rounded hover:bg-stone-400 transition duration-200">
                    Join now
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div>
            <div className="ticketForm">
              <h1 className="text-3xl font-medium">Purchase</h1>
              <p className="mt-3 leading-loose">
                Please select an available date for your visit and the amount of
                tickets you’ll be purchasing.
              </p>
              <div className="w-60 mt-5 py-2 pl-3 border-2 border-black rounded">
                {render}
              </div>

              {/* Ticket Purchase Form */}
              <form className="mt-6">
                <div className="grid grid-cols-1 divide-y-2">
                  <div></div>
                  {tickets.map((ticket) => {
                    ticketTypePricePairs[ticket.type] = ticket.price;
                    return (
                      //Entries for each ticket
                      <div
                        key={ticket.ticket_id}
                        className="flex justify-between pt-5 pb-5 items-center"
                      >
                        <label className="font-medium" htmlFor={ticket.type}>
                          {capitalize(ticket.type)} Admission (
                          {ticket.requirement})
                        </label>
                        <div className="flex flex-row">
                          <div className="mr-3 p-1">
                            ${ticket.price.toFixed(2)}
                          </div>

                          {/* Remove a ticket */}
                          <button
                            name={ticket.type}
                            value={formData[ticket.type]}
                            onClick={handleDecrease}
                          >
                            <SubtractIcon />
                          </button>

                          <input
                            type="number"
                            name={ticket.type}
                            id={ticket.type}
                            min="0"
                            max={maxTickets}
                            placeholder="0"
                            value={formData[ticket.type] || 0}
                            onChange={handleChange}
                            onKeyDown={(e) => {
                              if (e.key === ".") {
                                e.preventDefault();
                              } // Prevent decimal
                            }}
                            onInput={(e) => {
                              // Remove leading zeros
                              if (
                                e.target.value[0] == "0" &&
                                e.target.value.length > 1
                              ) {
                                e.target.value = e.target.value.replace(
                                  "0",
                                  ""
                                );
                              }
                              e.target.value = e.target.value.replace(
                                /[^0-9]*/g,
                                ""
                              ); // Do not allow "+" or "-"
                            }}
                            className="w-9 text-center"
                          />

                          {/* Add a ticket */}
                          <button
                            name={ticket.type}
                            value={formData[ticket.type]}
                            onClick={handleIncrease}
                          >
                            <AddIcon />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                  <div></div>
                </div>

                {/* Display subtotal */}
                <div className="mt-10 text-default-gray text-lg flex justify-between">
                  <span className="font-medium">Subtotal</span>${subtotal}
                </div>
                {/* On click, show confirmation pop up */}
                <Link
                  to="/tickets/exhibitions"
                  onClick={() => {
                    props.onNext(selectedDate);
                  }}
                >
                  <button
                    type="button"
                    className="w-full mt-4 bg-black text-white py-2 px-52 border-black rounded"
                  >
                    Next
                  </button>
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TicketPage;

//relative min-h-screen p-1
