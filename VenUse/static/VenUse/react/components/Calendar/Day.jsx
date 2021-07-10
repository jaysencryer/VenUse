const Day = ({ date, children, active }) => {
    return (
        <div
            className={`${date === 0 ? "cal_day_no" : "cal_day"} ${active ? "cal_active_day" : ""}`}
        >
            <span className={ `${
                active ? "cal_active_date" : ""
            }`}>
            {date ? date : ""}
            </span>
            {children}
        </div>
    );
};
export default Day;
