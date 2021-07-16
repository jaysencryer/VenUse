import Modal from "./Modal";

const BookSlots = ({ avail, booked, bookings, closeBookingModal }) => {
    console.log(bookings[0].room);
    return (
        <div className="BOOKING_modal">
            <span className="BOOKING_close" onClick={closeBookingModal}>x</span>
            {/* TODO - figure out if a user is even logged in - session storage? */}
            <p>{`Morning ${avail & 4 ? '': 'unavailable' }`}</p>
            <p>{`Afternoon ${avail & 2 ? '' : 'unavailable'}`}</p>
            <p>{`Evening ${avail & 1 ? '' : 'unavailable'}`}</p>
        </div>
    );
};

export default BookSlots;
