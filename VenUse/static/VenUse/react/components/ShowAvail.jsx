import BookSlots from "./BookSlots";
import Modal from "./Modal";

const AvailIcon = ({ avail, bookedSlots, size }) => {
    const strokeWidth = 3;
    // This is for evening availability
    let borderColor = "rgb(255,0,0)";
    // this is for morning availability
    let topColor = "rgb(100,100,100)";
    // this is for afternoon availability
    let bottomColor = "rgb(100,100,100)";

    // avail can be 0 - 7 (but not 5)
    if (avail & 1) {
        // evening is available is it booked, or not
        borderColor = bookedSlots & 1 ? "rgb(0,0,255)" : "rgb(255,0,255)";
    }
    if (avail & 2) {
        // morning is available, is it booked or not
        topColor = bookedSlots & 2 ? "rgb(255,200,0)" : "rgb(0,255,0)";
    }
    if (avail & 4) {
        // afternoon is available, is it booked or not
        bottomColor = bookedSlots & 4 ? "rgb(255,200,0)" : "rgb(0,255,0)";
    }

    return (
        <div>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                height={size + strokeWidth}
                width={size + strokeWidth}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height={size + strokeWidth}
                    width={size + strokeWidth}
                >
                    <circle
                        cx={(size + strokeWidth) / 2}
                        cy={(size + strokeWidth) / 2}
                        r={size / 2}
                        style={{
                            fill: bottomColor,
                            stroke: "none",
                            strokeWidth: 1,
                        }}
                    />
                </svg>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height={(size + strokeWidth) / 2}
                    width={size + strokeWidth}
                >
                    <circle
                        cx={(size + strokeWidth) / 2}
                        cy={(size + strokeWidth) / 2}
                        r={size / 2}
                        style={{
                            fill: topColor,
                            stroke: "none",
                            strokeWidth: 1,
                        }}
                    />
                </svg>
                <line
                    x1={strokeWidth / 2}
                    y1={(size + strokeWidth) / 2}
                    x2={strokeWidth / 2 + size + 1}
                    y2={(size + strokeWidth) / 2}
                    style={{ stroke: borderColor, strokeWidth: strokeWidth }}
                />
                <circle
                    cx={(size + strokeWidth) / 2}
                    cy={(size + strokeWidth) / 2}
                    r={size / 2}
                    style={{
                        fill: "none",
                        stroke: borderColor,
                        strokeWidth: strokeWidth,
                    }}
                />
                {/* TODO render something more useful here */}
                Sorry, your browser does not support inline SVG
            </svg>
        </div>
    );
};

const ShowAvail = ({ avail, date, bookings }) => {
    const [openBookingModal, setOpenBookingModal] = React.useState(false);

    // convert current calendar date
    const testDate = date.toLocaleDateString().split("/").reverse();

    // check all bookings for a match to current calendar date
    const booked = bookings
        ? bookings.filter(booking => {
              const bookDate = booking.date.split("-");
              return (
                  parseInt(bookDate[0]) === parseInt(testDate[0]) &&
                  parseInt(bookDate[1]) === parseInt(testDate[2]) &&
                  parseInt(bookDate[2]) === parseInt(testDate[1])
              );
          })
        : [];

    if (booked.length === 0) {
        // no matches - create blank booked slot.
        booked.push({ slot: 0 });
    }

    // find total of booked slots
    const bookedValue = booked.reduce((a, b) => a + b.slot);

    const handleAvailClick = () => {
        if (avail == 0) {
            return;
        }
        setOpenBookingModal(true);
    };

    console.log(Modal);

    return (
        <div
            className={`AVAIL_icon ${avail ? "AVAIL_clickable" : ""}`}
            onClick={() => handleAvailClick()}
        >
            <AvailIcon size={26} avail={avail} booked={bookedValue} />
            {openBookingModal && (
                <Modal
                    title="Book Room"
                    onClose={() => setOpenBookingModal(false)}
                >
                    <BookSlots
                        avail={avail}
                        booked={booked}
                        bookings={bookings}
                    />
                </Modal>
            )}
        </div>
    );
};

export default ShowAvail;
