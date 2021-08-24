// const ShowRooms = require('./ShowRooms.jsx');
import ShowRooms from "./ShowRooms.jsx";
import VenueTitle from "./VenueTitle.jsx";
import VenueAddress from "./VenueAddress.jsx";

function Venue({ venue }) {
    const [rooms, setRooms] = React.useState([]);
    return (
        <div>
        <div className="VENUE_container">
            <VenueTitle name={venue.name} link={venue.url} />
            <section className="VENUE_description">{venue.description}</section>
            <hr />
            {venue.address && (
                <div>
                    <VenueAddress className="VENUE_address" address={venue.address} />
                    <hr />
                </div>
            )}
            <h3>Rooms available for booking</h3>
        </div>
        <ShowRooms venId={venue.id} />
        </div>
    );
}

export default Venue;
