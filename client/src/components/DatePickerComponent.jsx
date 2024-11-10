import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useState } from "react";

const DatePickerComponent = () =>{

    function addMonths(date, months) {
        let temp = new Date(date)
        temp.setMonth(temp.getMonth() + months)
        if (temp.getDate() != date.getDate()) temp.setDate(0)
        return temp
      }

      

    const [selectedDate, setSelectedDate] = useState(new Date())
    const minDate = new Date();
    const maxDate = addMonths(minDate, 3);

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };


    return{
        selectedDate,
        render:(
        <div>
            <DatePicker 
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="MMMM dd, yyyy"
            minDate={minDate}
            maxDate={maxDate}
            onKeyDown={(e) => e.preventDefault()}
            />
        </div>
        )
    }
}

export default DatePickerComponent;