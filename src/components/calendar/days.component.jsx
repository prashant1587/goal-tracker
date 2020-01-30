import React  from 'react';

const DaysComponent = (props) => {

    function getClassName(days,day){
        return day.value?  days.indexOf(day.value)>-1?'close': '':'';
    }

    return (
        <div className="days">
            {props.days.map((day, index) => {
                return (<div className="date" key={day.value+'day'+index} onClick={() => props.updateClass(day)}>
                    <div className={getClassName(props.selectedDays,day) }></div>
                    <span>{day.value}</span>
                </div>)
            })}
        </div>
    );
}
export default DaysComponent;