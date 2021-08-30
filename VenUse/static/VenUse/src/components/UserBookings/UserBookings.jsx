import Booking from '../Booking/Booking.jsx';

const UserBookings = ({ user }) => {
    const [userBookings, setUserBookings] = React.useState();
    const [bookingsLoaded, setBookingsLoaded] = React.useState(false);

    const getBookings = async () => {
        const data = await fetch(`/get_bookings/${user}`);
        const response = await data.json();
        setUserBookings([...response]);
        setBookingsLoaded(true);
    };

    React.useEffect(() => {
        // Initial load
        getBookings();
    }, []);

    return (
        <div>
            <header>
                <h1>Upcoming Bookings for {`${user[0].toUpperCase()}${user.slice(1)}`}</h1>
            </header>
            {bookingsLoaded && (
                <main>
                    <section>
                        {userBookings.length > 0 &&
                            userBookings.map(booking => (
                                <Booking
                                    key={`${booking.date}${booking.room.id}${booking.slots}`}
                                    booking={booking}
                                />
                            ))}
                        {userBookings.length === 0 && (
                            <section style={{textAlign:"center", marginTop:"50px"}}>No upcoming bookings</section>
                        )}
                    </section>
                </main>
            )}
        </div>
    );
};

export default UserBookings;
