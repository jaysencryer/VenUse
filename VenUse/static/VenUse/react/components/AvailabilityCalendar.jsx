import AvailDay from "./AvailDay.jsx";
import MonthSelect from "./MonthSelect.jsx";
import YearSelect from "./YearSelect.jsx";

const fullMonth = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];
const dayOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const memoMonth = {};

const buildMonth = (month, year) => {
    const monthObj = [];

    const lastDateofMonth = new Date(year, month + 1, 0).getDate();
    const firstDayofMonth = new Date(year, month, 1).getDay();

    if (memoMonth[`${fullMonth[month]}${year}`]) {
        return memoMonth[`${fullMonth[month]}${year}`];
    }
    console.log(
        `Month = ${month} First Day = ${dayOfWeek[firstDayofMonth]} Last Day = ${lastDateofMonth}`
    );

    for (let i = 1; i <= lastDateofMonth; ) {
        const week = {};
        dayOfWeek.forEach((day, index) => {
            if (i === 1) {
                // still looking for first day of the month
                index === firstDayofMonth ? (week[day] = i++) : (week[day] = 0);
            } else if (i > lastDateofMonth) {
                // in final week and no more dates
                week[day] = 0;
            } else {
                week[day] = i++;
            }
        });
        monthObj.push(week);
    }
    memoMonth[`${fullMonth[month]}${year}`] = monthObj;
    return monthObj;
};

const today = new Date();

function AvailabilityCalendar({ availObj, bookings }) {
    const [monthViewing, setMonthViewing] = React.useState(
        () => fullMonth[today.getMonth()]
    );
    const [yearViewing, setYearViewing] = React.useState(() =>
        today.getFullYear()
    );
    const [monthObj, setMonthObj] = React.useState(() =>
        buildMonth(today.getMonth(), today.getFullYear())
    );
    const [monthBookings, setMonthBookings] = React.useState({});

    React.useEffect(() => {
        const getBookings = bookings.filter(
            booking =>
                parseInt(booking.date.split("-")[1]) ===
                fullMonth.indexOf(monthViewing) + 1
        );
        setMonthBookings(getBookings);
        console.log(getBookings);
    }, [monthViewing]);

    const clickHandler = (mode, type) => {
        console.log(`click handler for ${type} and ${mode}`);
        if (type === "month") {
            let month = fullMonth.indexOf(monthViewing);
            let year = yearViewing;
            month = mode === "lower" ? month - 1 : month + 1;
            if (month < 0) {
                month = 11;
                year--;
            } else if (month > 11) {
                month = 0;
                year++;
            }
            setMonthObj(() => buildMonth(month, year));
            if (year !== yearViewing) {
                setYearViewing(year);
            }
            setMonthViewing(fullMonth[month]);
        } else if (type === "year") {
            let newYear = yearViewing;
            newYear = mode === "lower" ? newYear - 1 : newYear + 1;
            setYearViewing(newYear);
        }
    };

    // get todays date (do this in day)
    // show the current month (starting from Monday)
    return (
        <div className="AVAIL_calendar_container">
            <div className="AVAIL_header">
                <MonthSelect
                    month={monthViewing}
                    year={yearViewing}
                    onClick={clickHandler}
                />
            </div>
            <div className="AVAIL_calendar">
                {dayOfWeek.map((day, id) => (
                    <div key={id} className="AVAIL_day_head">
                        {day.slice(0, 3)}
                    </div>
                ))}
                {monthObj.map((week, id) => (
                    <div key={`week-${id}`}>
                        {dayOfWeek.map(day => (
                            <AvailDay
                                key={`${day}${id}`}
                                date={week[day]}
                                avail={availObj[day]}
                                bookings={monthBookings}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AvailabilityCalendar;
