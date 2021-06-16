import Room from './Room.jsx';

function ShowRooms({venId}){
    const [rooms, setRooms] = React.useState([]);
    const [roomsLoaded, setRoomsLoaded] = React.useState(false);

    React.useEffect(() => {
        const getRoomsData = async () => {
            const data = await fetch(`/get_venue/${venId}`);
            const response = await data.json();
            setRooms(response[1]);
        }
        if (rooms.length === 0 && !roomsLoaded) {
            // There are no room
            // if we haven't already checked let's import them.
            getRoomsData();
            setRoomsLoaded(true);
        }
    }, [rooms,roomsLoaded]);

    return (
        <div className="VENUE_rooms_container">
            {rooms && rooms.map(room => <Room key={room.id} room={room} />)}
        </div>
    );
}

export default ShowRooms;