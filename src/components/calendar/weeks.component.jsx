import React  from 'react';

const WeekComponent = (props) => {
    return (
        <div className="days">
            {props.weekNames && props.weekNames.map((weekName, index) => {
                return (<div className="day-of-week" key={weekName+index}>
                    {weekName}
                </div>)
            })}
        </div>
    );
}

export default WeekComponent;