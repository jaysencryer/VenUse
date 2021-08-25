import AvailDay from "../AvailDay/AvailDay.jsx";
import Calendar from "../Calendar/Calendar.jsx";

const today = new Date();

function AvailabilityCalendar({ availObj, roomId, bookings, onBooked }) {
    return (
        <div>
            <Calendar activeDate={today}>
                <AvailDay availObj={availObj} roomId={roomId} bookings={bookings} onBooked={onBooked}/>
                
            </Calendar>
        </div>
    );
}

export default AvailabilityCalendar;
