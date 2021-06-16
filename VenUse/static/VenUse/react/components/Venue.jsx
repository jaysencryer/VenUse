
// const ShowRooms = require('./ShowRooms.jsx');
import ShowRooms from './ShowRooms.jsx';
import VenueTitle from './VenueTitle.jsx';

function Venue({venue}){
    const [rooms, setRooms] = React.useState([]);

    return (
        <div>
            <VenueTitle name={venue.name} link={venue.url}/>
            <div className="VENUE_description">{venue.description}</div>
            <ShowRooms venId={venue.id} />
        </div>
    );
}

export default Venue;
