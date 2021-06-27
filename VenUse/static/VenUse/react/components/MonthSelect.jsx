const MonthSelect = ({ month, year, onClick }) => {
    return <div style={{ display: "inline-block" }}>
            <button onClick={() => onClick("lower","month")} className="clicker">&lt;</button>
            <div className="month_name">{month}</div>
            <button onClick={() => onClick("higher","month")} className="clicker">&gt;</button>
            <div className="show_year">{year}</div>
        </div>
};

export default MonthSelect;
