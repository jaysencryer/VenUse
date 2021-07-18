import AvailDay from "./AvailDay.jsx";
import MonthSelect from "./MonthSelect.jsx";
import Calendar from "./Calendar/Calendar.jsx";

const today = new Date();

function AvailabilityCalendar({ availObj, bookings, roomId }) {
    return (
        <div>
            <Calendar activeDate={today}>
                <AvailDay availObj={availObj} bookings={bookings} roomId={roomId}/>
                
            </Calendar>
        </div>
    );
}

export default AvailabilityCalendar;
