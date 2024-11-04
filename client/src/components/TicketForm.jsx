import {useEffect, useState} from 'react'
import axios from 'axios'
import DatePickerComponent from "./DatePickerComponent"
import { Link } from 'react-router-dom'

const TicketForm = () => {
  const [tickets, setTickets] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [formData, setFormData] = useState({
    adult: 0,
    senior: 0,
    youth: 0,
    child: 0,
    student: 0,
    veteran: 0,
  });

  //This needs to be changed to the customer ID of the account making the purchase
  const customerID = 1;

  const { render, selectedDate } = DatePickerComponent();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDecrease = (e) => {
    e.preventDefault();
    let { name, value } = e.target;
    value--;
    {value >= 0 && 
      setFormData((prevState) => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleIncrease = (e) => {
    e.preventDefault();
    let { name, value } = e.target;
    value++;
    {value <= 20 && 
      setFormData((prevState) => ({
        ...prevState,
        [name]: value
      }));
    }
  };

  const handleSubtotal = (formData) => {
    let ans =
      formData.adult * ticketPrices.at(0) +
      formData.senior * ticketPrices.at(1) +
      formData.youth * ticketPrices.at(2) +
      formData.child * ticketPrices.at(3) +
      formData.student * ticketPrices.at(4);
    setSubtotal(ans);
  };

  const handleSubmit = async (e) => {
    try {
      let purchasedTicketsArr = [];
      const convertedDate = selectedDate.toISOString().split("T")[0];

      for (let j = 0; j < formData.adult; j++) {
        purchasedTicketsArr.push({
          customer_id: customerID,
          ticket_id: ticketIDs.at(0),
          amount_spent: ticketPrices.at(0),
          valid_day: convertedDate,
        });
      }
      for (let j = 0; j < formData.senior; j++) {
        purchasedTicketsArr.push({
          customer_id: customerID,
          ticket_id: ticketIDs.at(1),
          amount_spent: ticketPrices.at(1),
          valid_day: convertedDate,
        });
      }
      for (let j = 0; j < formData.youth; j++) {
        purchasedTicketsArr.push({
          customer_id: customerID,
          ticket_id: ticketIDs.at(2),
          amount_spent: ticketPrices.at(2),
          valid_day: convertedDate,
        });
      }
      for (let j = 0; j < formData.child; j++) {
        purchasedTicketsArr.push({
          customer_id: customerID,
          ticket_id: ticketIDs.at(3),
          amount_spent: ticketPrices.at(3),
          valid_day: convertedDate,
        });
      }
      for (let j = 0; j < formData.student; j++) {
        purchasedTicketsArr.push({
          customer_id: customerID,
          ticket_id: ticketIDs.at(4),
          amount_spent: ticketPrices.at(4),
          valid_day: convertedDate,
        });
      }
      for (let j = 0; j < formData.veteran; j++) {
        purchasedTicketsArr.push({
          customer_id: customerID,
          ticket_id: ticketIDs.at(5),
          amount_spent: ticketPrices.at(5),
          valid_day: convertedDate,
        });
      }

      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/customer_ticket`,
        purchasedTicketsArr
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleSubtotal(formData);
  });

  useEffect(() => {
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
    fetchAllTickets();
  }, []);

  const ticketPrices = tickets?.map((ticket) => {
    return ticket.price;
  });
  const ticketIDs = tickets?.map((ticket) => {
    return ticket.ticket_id;
  });

  return (
    <div className="ticketForm">
      <h1 className="text-3xl font-medium">Purchase</h1>
      <p className="mt-3 leading-loose">
        Please select an available date for your visit and the amount of tickets
        you’ll be purchasing.
      </p>
      <div className="w-64 mt-5 py-2 px-5 border-2 border-black rounded">
        {render}
      </div>
      <form className="mt-6 grid grid-cols-1 divide-y-2">
        <div className="flex justify-between">
          <label htmlFor="adult">
            <span className="font-medium">Adult Admission (19+)</span> ${ticketPrices.at(0)}
          </label>
          <div>
            <button name="adult" value={formData.adult} onClick={handleDecrease}>-</button>
            <input
              type="number"
              name="adult"
              id="adult"
              min="0"
              max="20"
              placeholder="0"
              value={formData.adult}
              onChange={handleChange}
              className="w-12 text-center"
            />
            <button name="adult" value={formData.adult} onClick={handleIncrease}>+</button>
          </div>
        </div>
        <label className="flex justify-between">
          <div>
            <span className="font-medium">Senior Admission (65+)</span> $
            {ticketPrices.at(1)}
          </div>
          <input
            type="number"
            name="senior"
            min="0"
            max="50"
            placeholder="0"
            value={formData.senior}
            onChange={handleChange}
            className="w-12"
          />
        </label>
        <br></br>
        <label className="flex justify-between">
          <div>
            <span className="font-medium">Youth Admission (13-18)</span> $
            {ticketPrices.at(2)}
          </div>
          <input
            type="number"
            name="youth"
            min="0"
            max="50"
            placeholder="0"
            value={formData.youth}
            onChange={handleChange}
            className="w-12"
          />
        </label>
        <br></br>
        <label className="flex justify-between">
          <div>
            <span className="font-medium">Child Admission (12 & Under)</span>{" "}
            ${ticketPrices.at(3)}
          </div>
          <input
            type="number"
            name="child"
            min="0"
            max="50"
            placeholder="0"
            value={formData.child}
            onChange={handleChange}
            className="w-12"
          />
        </label>
        <br></br>
        <label className="flex justify-between">
          <div>
            <span className="font-medium">
              Student Admission (with valid ID)
            </span>{" "}
            ${ticketPrices.at(4)}
          </div>
          <input
            type="number"
            name="student"
            min="0"
            max="50"
            placeholder="0"
            value={formData.student}
            onChange={handleChange}
            className="w-12"
          />
        </label>
        <br></br>
        <label className="flex justify-between">
          <div>
            <span className="font-medium">
              Veteran Admission (with valid ID)
            </span>{" "}
            ${ticketPrices.at(5)}
          </div>
          <input
            type="number"
            name="veteran"
            min="0"
            max="50"
            placeholder="0"
            value={formData.veteran}
            onChange={handleChange}
            className="w-12"
          />
        </label>
        <div className="mt-10 text-default-gray text-lg flex justify-between">
          <span className="font-medium">Subtotal</span>${subtotal}
        </div>
        <Link to={"/tickets/purchased"}>
          <button
            className="w-full mt-4 bg-black text-white py-2 px-52 border-black rounded"
            onClick={handleSubmit}
          >
            Purchase
          </button>
        </Link>
      </form>
    </div>
  );
};

export default TicketForm;
