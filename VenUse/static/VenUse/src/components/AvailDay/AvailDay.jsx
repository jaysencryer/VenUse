import ShowAvail from '../ShowAvail/ShowAvail.jsx';

const dayOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const AvailDay = ({ date, availObj, bookings, roomId, onBooked}) => {

    const day = dayOfWeek[date !== 0 ? date.getDay() : 0];
    return (
        <div>
            {date ? <ShowAvail avail={availObj[day]} date={date} roomId={roomId} bookings={bookings} onBooked={onBooked}/> : ""}
        </div>
    );
};
export default AvailDay;
