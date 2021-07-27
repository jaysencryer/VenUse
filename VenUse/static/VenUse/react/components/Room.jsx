import Modal from "./Modal.jsx";
import AvailabilityCalendar from "./AvailabilityCalendar.jsx";

function Room({ room }) {
    const [loadBooking, setLoadBooking] = React.useState(false);
    const [bookings, setBookings] = React.useState([]);

    // Determine if user is logged in
    // if a div with the id 'user_name' is present they are.
    const userLoggedIn = document.getElementById('user_name');

    const clickHandler = () => {
        setLoadBooking(true);
    };

    const getBookings = async () => {
        const data = await fetch(`/get_bookings/${room.id}`);
        const response = await data.json();
        // console.log(response);
        setBookings([...response]);
    }

    React.useEffect(()=> {
        getBookings();
    },[]);
    
    const handleBookedSlot = () => {
        // Get new bookings
        getBookings();
        setLoadBooking(false);
    }

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
                    <AvailabilityCalendar availObj={room.availability} roomId={room.id} bookings={bookings} onBooked={handleBookedSlot}/>
                </Modal>
            )}
        </div>
    );
}

export default Room;
