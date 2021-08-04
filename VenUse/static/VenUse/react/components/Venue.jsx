// const ShowRooms = require('./ShowRooms.jsx');
import ShowRooms from "./ShowRooms.jsx";
import VenueTitle from "./VenueTitle.jsx";

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
                    <section className="VENUE_address">{venue.address}</section>
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
