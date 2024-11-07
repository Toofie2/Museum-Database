import {useEffect, useState} from 'react'
import axios from 'axios'
import DatePickerComponent from "./DatePickerComponent"
import { Link } from 'react-router-dom'
import SubtractIcon from './SubtractIcon.jsx'
import AddIcon from './AddIcon.jsx'

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
    e.preventDefault()
    let { name, value } = e.currentTarget;
    value--;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value >= 20 ? 20 : value <= 0 ? 0 : value
    }));

  };

  const handleIncrease = (e) => {
    e.preventDefault()
    let { name, value } = e.currentTarget;
    value++;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value >= 20 ? 20 : value <= 0 ? 0 : value
    }));

  };

  const handleSubtotal = (formData) => {
    let ans =
      formData.adult * ticketPrices.at(0) +
      formData.senior * ticketPrices.at(1) +
      formData.youth * ticketPrices.at(2) +
      formData.child * ticketPrices.at(3) +
      formData.student * ticketPrices.at(4);
    setSubtotal(ans?.toFixed(2));
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
      <div className="w-60 mt-5 py-2 pl-3 border-2 border-black rounded">
        {render}
      </div>
      <form className="mt-6">
        <div className="grid grid-cols-1 divide-y-2">
          <div></div>
          <div className="flex justify-between pt-5 pb-5 items-center">
            <label className="font-medium" htmlFor="adult">
              Adult Admission (19+)
            </label>
            <div className="flex flex-row">
              <div className="mr-3 p-1">
                ${ticketPrices.at(0)?.toFixed(2)}
              </div>
              <button name="adult" value={formData.adult} onClick={handleDecrease}>
                <SubtractIcon/>
              </button>
              <input
                type="number"
                name="adult"
                id="adult"
                min="0"
                max="20"
                placeholder="0"
                value={formData.adult}
                onChange={handleChange}
                className="w-9 text-right"
              />
              <button name="adult" value={formData.adult} onClick={handleIncrease}>
                <AddIcon/>
              </button>
            </div>
          </div>
          <div className="flex justify-between pt-5 pb-5 items-center">
            <label className="font-medium" htmlFor="senior">
              Senior Admission (65+)
            </label>
            <div className="flex flex-row">
              <div className="mr-3 p-1">
                ${ticketPrices.at(1)?.toFixed(2)}
              </div>
              <button name="senior" value={formData.senior} onClick={handleDecrease}>
                <SubtractIcon/>
              </button>
              <input
                type="number"
                name="senior"
                id="senior"
                min="0"
                max="20"
                placeholder="0"
                value={formData.senior}
                onChange={handleChange}
                className="w-9 text-right"
              />
              <button name="senior" value={formData.senior} onClick={handleIncrease}>
                <AddIcon/>
              </button>
            </div>
          </div>
          <div className="flex justify-between pt-5 pb-5 items-center">
            <label className="font-medium" htmlFor="youth">
              Youth Admission (13-18)
            </label>
            <div className="flex flex-row">
              <div className="mr-3 p-1">
                ${ticketPrices.at(2)?.toFixed(2)}
              </div>
              <button name="youth" value={formData.youth} onClick={handleDecrease}>
                <SubtractIcon/>
              </button>
              <input
                type="number"
                name="youth"
                id="youth"
                min="0"
                max="20"
                placeholder="0"
                value={formData.youth}
                onChange={handleChange}
                className="w-9 text-right"
              />
              <button name="youth" value={formData.youth} onClick={handleIncrease}>
                <AddIcon/>
              </button>
            </div>
          </div>
          <div className="flex justify-between pt-5 pb-5 items-center">
            <label className="font-medium" htmlFor="child">
              Child Admission (12 & Under)
            </label>
            <div className="flex flex-row">
              <div className="mr-3 p-1">
                ${ticketPrices.at(3)?.toFixed(2)}
              </div>
              <button name="child" value={formData.child} onClick={handleDecrease}>
                <SubtractIcon/>
              </button>
              <input
                type="number"
                name="child"
                id="child"
                min="0"
                max="20"
                placeholder="0"
                value={formData.child}
                onChange={handleChange}
                className="w-9 text-right"
              />
              <button name="child" value={formData.child} onClick={handleIncrease}>
                <AddIcon/>
              </button>
            </div>
          </div>
          <div className="flex justify-between pt-5 pb-5 items-center">
            <label className="font-medium" htmlFor="student">
              Student Admission (with valid ID)
            </label>
            <div className="flex flex-row">
              <div className="mr-3 p-1">
                ${ticketPrices.at(4)?.toFixed(2)}
              </div>
              <button name="student" value={formData.student} onClick={handleDecrease}>
                <SubtractIcon/>
              </button>
              <input
                type="number"
                name="student"
                id="student"
                min="0"
                max="20"
                placeholder="0"
                value={formData.student}
                onChange={handleChange}
                className="w-9 text-right"
              />
              <button name="student" value={formData.student} onClick={handleIncrease}>
                <AddIcon/>
              </button>
            </div>
          </div>
          <div className="flex justify-between pt-5 pb-5 items-center">
            <label className="font-medium" htmlFor="veteran">
              Veteran Admission (with valid ID)
            </label>
            <div className="flex flex-row">
              <div className="mr-3 p-1">
                ${ticketPrices.at(5)?.toFixed(2)}
              </div>
              <button name="veteran" value={formData.veteran} onClick={handleDecrease}>
                <SubtractIcon/>
              </button>
              <input
                type="number"
                name="veteran"
                id="veteran"
                min="0"
                max="20"
                placeholder="0"
                value={formData.veteran}
                onChange={handleChange}
                className="w-9 text-right"
              />
              <button name="veteran" value={formData.veteran} onClick={handleIncrease}>
                <AddIcon/>
              </button>
            </div>
          </div>
          <div></div>
        </div>
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
