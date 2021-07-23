import Modal from "./Modal.jsx";
import AvailabilityCalendar from "./AvailabilityCalendar.jsx";

function Room({ room, bookings, setBookings }) {
    const [loadBooking, setLoadBooking] = React.useState(false);

    // Determine if user is logged in
    // if a div with the id 'user_name' is present they are.
    const userLoggedIn = document.getElementById('user_name');

    const clickHandler = () => {
        setLoadBooking(true);
    };
    return (
        <div className="VENUE_display_room" key={room.id}>
            <p className="VENUE_room_head">{room.name}</p>
            <div className="VENUE_room_body">
                {room.description.split(".")[0]}...
            </div>
            <div className="VENUE_room_foot">
                {userLoggedIn &&
                <button
                className="ven-btn"
                style={{ float: "right" }}
                name={`book_${room.id}`}
                onClick={() => clickHandler()}
                >
                    Book This Room
                </button>
                }
                {!userLoggedIn && 
                <div>
                    Log in to book this room
                </div>
                }
            </div>
            {loadBooking && (
                <Modal title={room.name} onClose={() => setLoadBooking(false)}>
                    <AvailabilityCalendar availObj={room.availability} bookings={bookings} setBookings={setBookings} roomId={room.id}/>
                </Modal>
            )}
        </div>
    );
}

export default Room;
