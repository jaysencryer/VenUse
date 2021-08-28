import BookSlots from "../BookSlots/BookSlots.jsx";
import AvailIcon from "../AvailIcon/AvailIcon.jsx";


const ShowAvail = ({ avail, date, bookings, roomId, onBooked }) => {
    const [openBookingModal, setOpenBookingModal] = React.useState(false);
    // const [bookedSlot, setBookedSlot] = React.useState(0);

    // React.useState(() => {
    // convert current calendar date
    const testDate = date.toLocaleDateString().split("/").reverse();
    // check all bookings for a match to current calendar date
    const booked = bookings.filter(booking => {
        if ('date' in booking){
            const bookDate = booking.date.split("-");
            return (
                parseInt(bookDate[0]) === parseInt(testDate[0]) &&
                parseInt(bookDate[1]) === parseInt(testDate[2]) &&
                parseInt(bookDate[2]) === parseInt(testDate[1])
            );
        }
        return false;
    });


    if (booked.length === 0) {
        // no matches - create blank booked slot.
        booked.push({ slot: 0 });
    }
    // find total of booked slots
    const bookedValue = booked.reduce((a, b) => a + b.slot, 0);

    const dateIsInPast = () => {
        const today = new Date();
        if (date.getFullYear() >= today.getFullYear()) {
            if (
                date.getMonth() > today.getMonth() ||
                date.getFullYear() > today.getFullYear()
            ) {
                return false;
            } else if (date.getMonth() === today.getMonth()) {
                return date.getDate() < today.getDate() ? true : false;
            }
        }
        return true;
    };

    const handleAvailClick = () => {
        if (avail == 0 || dateIsInPast() || bookedValue == avail) {
            return;
        }
        setOpenBookingModal(true);
    };

    return (
        <div
            className={`AVAIL_icon ${
                // Only clickable if it's available, not booked and not in the past
                avail == 0 || bookedValue == avail || dateIsInPast()
                    ? ""
                    : "AVAIL_clickable"
            }`}
        >
            {!dateIsInPast() && (
                <AvailIcon
                    size={26}
                    avail={avail}
                    bookedSlots={bookedValue}
                    onClick={handleAvailClick}
                />
            )}
            {openBookingModal && (
                <BookSlots
                    avail={avail}
                    roomId={roomId}
                    bookedValue={bookedValue}
                    date={date}
                    closeBookingModal={value => {
                        setOpenBookingModal(false);
                        if (value > 0) {
                            onBooked();
                        }
                    }}
                />
            )}
        </div>
    );
};

export default ShowAvail;
