import ShowAvail from './ShowAvail';

const dayOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const AvailDay = ({ date, availObj, bookings }) => {

    const day = dayOfWeek[date !== 0 ? date.getDay() : 0];
    return (
        // <div className={date === 0 ? "AVAIL_day_no" : "AVAIL_day"}>
        <div className={`${availObj[day] == 0 ? "AVAIL_day_no" : ""}`}>
            {date && <ShowAvail avail={availObj[day]} date={date} bookings={bookings}/>}
        </div>
    );
};
export default AvailDay;
