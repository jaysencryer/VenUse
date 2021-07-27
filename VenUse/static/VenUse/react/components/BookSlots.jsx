/*
@param booked object - contains (id = booking id, date = date of booking, room = room id, user = bookings user name)
@param avail int - contains 0-7 (excluding 5)
@param closeBookingModal - function
*/

const BookSlots = ({ avail, roomId, booked, bookedValue, closeBookingModal, date }) => {
    const [bookingDisabled, setBookingDisabled] = React.useState(true);
    const [message, setMessage] = React.useState('');

    const getSlotScore = () => {
        const checkedSlots = document.querySelectorAll(
            "input[type='checkbox']"
        );

        let slotScore = 0;
        if ( checkedSlots.length > 0 ){
            slotScore += checkedSlots[0].checked ? 4 : 0;
            slotScore += checkedSlots[1].checked ? 2 : 0;
            slotScore += checkedSlots[2].checked ? 1 : 0;
        
            return slotScore;
        }
    }

    const canSlotBeBooked = slot => {
        /* slots can only be booked contiguously - 
        e.g. Morning, Afternoon, Evening,
            Morning, Afteroon
            Afternoon, Evening
            NOT - Morning, Evening
        */

        if( slot === -1 ) {
            // this is the book this room check
            return getSlotScore() === 5 || getSlotScore() === 0 ? false : true;
        }

        return (avail & slot) && (bookedValue & slot) !== slot ? true : false;
    };


    const makeBooking = async () => {
        if (!canSlotBeBooked(-1)) {
            // Slot could not be booked - this code should not be reachable
            return;
        }
        const sendDate = date.toLocaleDateString().split('/').reverse();
        const data = await fetch('/make_booking', {
            method: 'post',
            body: JSON.stringify({
                "slot": getSlotScore(),
                "date": `${sendDate[0]}-${sendDate[2]}-${sendDate[1]}`,
                "room_id" : roomId,
            }),
        })
        const response = await data.json();
        // console.log(response);
        if (response.error) {
            setMessage(response.error);
            return;
        }
        closeBookingModal(bookedValue + getSlotScore());
    }

    return (
        <div className="BOOKING_modal">
            <span className="BOOKING_close" onClick={closeBookingModal}>
                x
            </span>
                <div className="BOOKING_modal_content">
                    <h3>{date.toLocaleDateString()}</h3>
                    <h4>Select the slot(s) you would like.</h4>
                    <table width="100%">
                        <tbody>
                            <tr className="BOOKING_modal_slot">
                                <td>Morning</td>
                                <td>8am - 12pm</td>
                                <td style={{ textAlign: "left" }}>
                                    <input
                                        type="checkbox"
                                        id="bookMorning"
                                        onClick={() => setBookingDisabled(!canSlotBeBooked(-1))}
                                        disabled={!canSlotBeBooked(4)}
                                        />
                                </td>
                            </tr>
                            <tr className="BOOKING_modal_slot">
                                <td>Afternoon</td>
                                <td>1pm - 5pm</td>
                                <td style={{ textAlign: "left" }}>
                                    <input
                                        type="checkbox"
                                        id="bookAfternoon"
                                        onClick={() => setBookingDisabled(!canSlotBeBooked(-1))}
                                        disabled={!canSlotBeBooked(2)}
                                        />
                                </td>
                            </tr>
                            <tr className="BOOKING_modal_slot">
                                <td>Evening</td>
                                <td>6pm - 10pm</td>
                                <td style={{ textAlign: "left" }}>
                                    <input
                                        type="checkbox"
                                        id="bookEvening"
                                        onClick={() => setBookingDisabled(!canSlotBeBooked(-1))}
                                        disabled={!canSlotBeBooked(1)}
                                        />
                                </td>
                            </tr>
                            <tr>
                                <td colSpan={3} style={{ textAlign: "center" }}>
                                    {message && <span className="BOOKING_err_message">{message}</span>}
                                    <button
                                        type="button"
                                        className="ven-btn-sm"
                                        disabled={bookingDisabled}
                                        onClick={() => makeBooking()}
                                    >
                                        Make Booking
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
        </div>
    );
};

export default BookSlots;
