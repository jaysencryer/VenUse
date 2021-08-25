const Day = ({ day, date, children, active }) => {
    return (
        <div
            className={`${date === 0 ? "cal_day_no" : "cal_day"} ${active ? "cal_active_day" : ""}`}
        >
            <span className={ `${
                active ? "cal_active_date" : ""
            }`}>
                <span className="cal_mobile_day">{day}</span>
            {date ? date : "" }
            </span>
            {children}
        </div>
    );
};
export default Day;
