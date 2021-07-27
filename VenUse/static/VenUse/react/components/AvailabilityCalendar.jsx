import AvailDay from "./AvailDay.jsx";
import MonthSelect from "./MonthSelect.jsx";
import Calendar from "./Calendar/Calendar.jsx";

const today = new Date();

function AvailabilityCalendar({ availObj, bookings, setBookings, roomId, onBooked }) {
    return (
        <div>
            <Calendar activeDate={today}>
                <AvailDay availObj={availObj} bookings={bookings} setBookings={setBookings} roomId={roomId} onBooked={onBooked}/>
                
            </Calendar>
        </div>
    );
}

export default AvailabilityCalendar;
