const AvailDay = ({ date, avail, bookings }) => {
    let booked = 0;
    if (bookings.length) {
        bookings.forEach(booking => {
            if (parseInt(booking["date"].split("-")[2]) === date) {
                booked = booking.slot;
            }
        });
    }
    return (
        <div className={date === 0 ? "AVAIL_day_no" : "AVAIL_day"}>
            {date ? date : ""}
            {/* <BookAvail avail={avail} booked={booked} /> */}
            <div>{booked > 0 ? booked : ""}</div>
        </div>
    );
};
export default AvailDay;
