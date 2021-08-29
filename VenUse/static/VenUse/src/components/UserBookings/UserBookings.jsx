
const UserBookings = ({user}) => {
    const [userBookings, setUserBookings] = React.useState();

    const getBookings = async () => {
        const data = await fetch(`/get_bookings/${user}`);
        const response = await data.json();
        console.log(response);
        setUserBookings([...response]);
    }

    React.useEffect(() => {
        // Initial load
        getBookings();
    },[]);

    return (
        <div>
            This is where the bookings for a user will be shown!
        </div>
    );
};

export default UserBookings;