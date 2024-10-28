import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";

const DatePickerComponent = () =>{

    const [selectedDate, setSelectedDate] = useState(new Date())

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    return(
        <div>
            <DatePicker 
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="MMMM dd, YYYY"
            />
        </div>

    )
}

export default DatePickerComponent;