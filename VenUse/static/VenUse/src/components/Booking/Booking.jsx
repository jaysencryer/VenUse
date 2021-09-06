const Booking = ({ booking }) => {
    const { venue, room, slots, date } = booking;

    const loadVenue = () => {
        window.location.href = `/Venue/${venue.url}`;
    };

    const showBookedSlots = () => {
        // converts the numeric value for the slots to the text, Morning, Afternoon, Evening.
        // converts the numeric value for the slots to the text, Morning, Afternoon, Evening.
        let slotCount = slots;
        let bookingText = "";
        if (slots & 4) {
            bookingText += "Morning";
            slotCount -= slots & 4;
            bookingText += slotCount > 0 ? ", " : "";
        }
        if (slots & 2) {
            bookingText += "Afternoon";
            slotCount -= slots & 2;
            bookingText += slotCount > 0 ? ", " : "";
        }
        if (slots & 1) {
            bookingText += slots & 1 ? "Evening" : "";
        }
        bookingText += ".";

        return bookingText;
    };

    return (
        <section className="BOOKING_container">
            <div className="BOOKING_info">
                <span>{date}</span>
                <section className="BOOKING_venue" onClick={loadVenue}>
                    {venue.name}
                </section>
                <section className="BOOKING_room">{room.name}</section>
            </div>
            <div className="BOOKING_slots">
                <span>{showBookedSlots()}</span>
            </div>
        </section>
    );
};

export default Booking;
