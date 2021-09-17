import Room from '../Room/Room.jsx';

function ShowRooms({venId}){
    const [rooms, setRooms] = React.useState([]);
    const [venueUrl, setVenueUrl] = React.useState('');

    React.useEffect(() => {
        const getRoomsData = async () => {
            const data = await fetch(`/get_venue/${venId}`);
            const response = await data.json();
            setVenueUrl(response[0].url);
            setRooms(response[1]);
        }
        getRoomsData();
    }, []);

    return (
        <div className="VENUE_rooms_container">
            {rooms && rooms.map(room => <Room key={room.id} room={room} venueUrl={venueUrl}/>)}
        </div>
    );
}

export default ShowRooms;