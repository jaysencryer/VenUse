import Room from './Room.jsx';

function ShowRooms({venId}){
    const [rooms, setRooms] = React.useState([]);

    React.useEffect(() => {
        const getRoomsData = async () => {
            const data = await fetch(`/get_venue/${venId}`);
            const response = await data.json();
            // console.log(response);
            setRooms(response[1]);
        }
        getRoomsData();
    }, []);

    return (
        <div className="VENUE_rooms_container">
            {rooms && rooms.map(room => <Room key={room.id} room={room} />)}
        </div>
    );
}

export default ShowRooms;