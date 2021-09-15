import ShowRooms from "../ShowRooms/ShowRooms.jsx";
import VenueTitle from "../VenueTitle/VenueTitle.jsx";
import VenueAddress from "../VenueAddress/VenueAddress.jsx";

function Venue({ venue }) {
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
