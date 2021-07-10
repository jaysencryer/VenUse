const ShowAvail = ({ avail, date, bookings }) => {
    // console.log(bookings);
    const testDate = date.toLocaleDateString().split("/").reverse();
    const booked = bookings.filter(booking => {
        const bookDate = booking.date.split("-");
        // console.log(parseInt(bookDate[0]) === parseInt(testDate[0]) &&
        // parseInt(bookDate[1]) === parseInt(testDate[2]) &&
        // parseInt(bookDate[2]) === parseInt(testDate[1]));
        return ( 
             parseInt(bookDate[0]) === parseInt(testDate[0]) &&
             parseInt(bookDate[1]) === parseInt(testDate[2]) &&
             parseInt(bookDate[2]) === parseInt(testDate[1])
        );
    });
    if (booked.length > 0) {
        console.log(booked);
    }
    return <div>{avail}{booked.length > 0 && booked[0].slot}</div>;
};

export default ShowAvail;
