import Modal from "./Modal.jsx";
import AvailabilityCalendar from "./AvailabilityCalendar.jsx";

function Room({ room, bookings }) {
    const [loadBooking, setLoadBooking] = React.useState(false);

    const clickHandler = () => {
        setLoadBooking(true);
    }
    return (
            <div className="VENUE_display_room" key={room.id}>
                <p className="VENUE_room_head">{room.name}</p>
                <div className="VENUE_room_body">
                    {room.description.split(".")[0]}...
                </div>
                <div className="VENUE_room_foot">
                    <button
                        className="ven-btn"
                        style={{ float: "right" }}
                        name={`book_${room.id}`}
                        onClick={() => clickHandler()}
                    >
                        Book This Room
                    </button>
                </div>
                {loadBooking && <Modal title={room.name} onClose={() => setLoadBooking(false)}>
                    <AvailabilityCalendar availObj={room.availability} bookings={bookings}/>
                </Modal>}
            </div>
    );
}

export default Room;
