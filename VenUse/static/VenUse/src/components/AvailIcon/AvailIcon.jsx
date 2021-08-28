const AvailIcon = ({ avail, bookedSlots, size, onClick }) => {
    // If devOnly is in the url, we will show the more complex availability icon
    // which shows which slots are booked without clicking on the icon
    // in prod they will see an empty circle for avaialable, solid for not avaialable
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const strokeWidth = 3;
    
    // This is for dev evening availability & prod availability in general
    let borderColor = "rgb(255,0,0)";
    // This is for prod availability
    let fillColor = "rgb(0,0,0)";
    // this is for dev morning availability
    let topColor = "rgb(100,100,100)";
    // this is for dev afternoon availability
    let bottomColor = "rgb(100,100,100)";



    if (urlParams.get("devOnly")) {
        // avail can be 0 - 7 (but not 5)
        if (avail & 1) {
            // evening is available is it booked, or not
            borderColor =
                bookedSlots & (1 == 1) ? "rgb(0,0,255)" : "rgb(255,0,255)";
        }
        if (avail & 2) {
            // afternoon is available, is it booked or not
            bottomColor =
                bookedSlots & (2 == 2) ? "rgb(255,200,0)" : "rgb(0,255,0)";
        }
        if (avail & 4) {
            // morning is available, is it booked or not
            topColor =
                bookedSlots & (4 == 4) ? "rgb(255,200,0)" : "rgb(0,255,0)";
        }
        return (
            <div onClick={onClick}>
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
                        style={{
                            stroke: borderColor,
                            strokeWidth: strokeWidth,
                        }}
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
    }

    // production code
    
    borderColor = "rgb(0,0,0)";
    if (avail !== 0 && avail - bookedSlots !== 0) {
        fillColor = "rgba(0,0,0,0)";
    }

    return (
        <div onClick={onClick}>
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
                        fill: fillColor,
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

export default AvailIcon;
