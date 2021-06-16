import Modal from "./Modal.jsx";
import AvailabilityCalendar from "./AvailabilityCalendar.jsx";

function Room({ room }) {
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
                {loadBooking && <Modal onClose={() => setLoadBooking(false)}>
                    {room.name}
                    <AvailabilityCalendar />
                </Modal>}
            </div>
    );
}

export default Room;
