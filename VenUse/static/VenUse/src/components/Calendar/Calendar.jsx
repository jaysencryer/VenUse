import Day from "../Day/Day.jsx";
import MonthSelect from "../MonthSelect/MonthSelect.jsx";

import "./Calendar.css";

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

const makeDate = (year, month, date) => {
    if (date === 0) {
        return 0;
    }
    const retDate = new Date(year, month, date);
    return retDate;
}

function Calendar({ activeDate, children }) {
    const [monthViewing, setMonthViewing] = React.useState(
        () => fullMonth[activeDate.getMonth()]
    );
    const [yearViewing, setYearViewing] = React.useState(() =>
        activeDate.getFullYear()
    );
    const [monthObj, setMonthObj] = React.useState(() =>
        buildMonth(activeDate.getMonth(), activeDate.getFullYear())
    );

    const childElements = React.Children.toArray(children);

    const clickHandler = (mode, type) => {
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

    const isItToday = (dateToCheck) => {
        if ( dateToCheck && dateToCheck.getDate() === activeDate.getDate() && dateToCheck.getMonth() === activeDate.getMonth() && yearViewing === activeDate.getFullYear()){
            return true;
        }
        return false;
    }

    // show the current month (starting from Monday)
    return (
        <div className="cal_container">
            <div className="cal_header">
                <MonthSelect
                    month={monthViewing}
                    year={yearViewing}
                    onClick={clickHandler}
                />
            </div>
            <div className="cal_calendar">
                {dayOfWeek.map((day, id) => (
                    <div key={id} className="cal_day_head">
                        {day.slice(0, 3)}
                    </div>
                ))}
                {monthObj.map((week, id) => (
                    <div key={`week-${id}`}>
                        {dayOfWeek.map(day => (
                            <Day key={`${day}${id}`} day={`${day.slice(0,3)}`} date={week[day]} active={isItToday(makeDate(
                                yearViewing,
                                fullMonth.indexOf(monthViewing),
                                week[day]
                            ))}>
                                {childElements.map(child =>
                                    React.cloneElement(child, {
                                        date: makeDate(
                                            yearViewing,
                                            fullMonth.indexOf(monthViewing),
                                            week[day]
                                        ),
                                    })
                                )}
                            </Day>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Calendar;
