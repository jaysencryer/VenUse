const today = new Date;

const fullMonth = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "Novemeber", "December"];
const dayOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function AvailabilityCalendar({availObj}){
    const [monthViewing, setMonthViewing] = React.useState(() => fullMonth[today.getMonth()]);
    const [yearViewing, setYearViewing] = React.useState(() => today.getFullYear());


    // get todays date (do this in day)
    // show the current month (starting from Monday)
    return (
        <div className="AVAIL_calendar_container">
            <div className="AVAIL_header">
                {monthViewing} - {yearViewing}
                <div className="AVAIL_calendar">
                    {dayOfWeek.map(day => <div style={{display:"inline-block"}}>{day.slice(0,3)}</div>)}
                    
                </div>
            </div>
        </div>
    )
}

export default AvailabilityCalendar;