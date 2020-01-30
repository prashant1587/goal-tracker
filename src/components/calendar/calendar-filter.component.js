import React  from 'react';

class CalendarFilterComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openMonth: false,
            openYear: false,
        }
    }

    toggleMonth() {
        this.setState((previousState) => {
            return {openMonth: !previousState.openMonth}
        })
    }

    toggleYear() {
        this.setState((previousState) => {
            return  {openYear: !previousState.openYear}
        })
    }

    selectMonth(eachMonth){
        this.props.updateMonth(eachMonth);
    }

    selectYear(year){
        this.props.updateYear(year);
    }

    render() {
        return (
            <div className="header-container">
                <div className="calendar-btn month-btn" onClick={() => this.toggleMonth()}>
                    <span id="curMonth">{this.props.months[this.props.month]}</span>
                    {this.state.openMonth && <div id="months" className="months dropdown">
                        {this.props.months && this.props.months.map((eachMonth, key) => <div className="dropdown-item" key={eachMonth} onClick={() => this.selectMonth(key)}>{eachMonth}</div>) }
                    </div>}
                </div>
                <div className="calendar-btn year-btn" onClick={() => this.toggleYear()}>
                    <span id="curYear" >{this.props.year}</span>
                    {this.state.openYear && <div id="years" className="years dropdown">
                    {this.props.yearsList && this.props.yearsList.map((eachYear) => <div className="dropdown-item" key={eachYear} onClick={() => this.selectYear(eachYear)}>{eachYear}</div>) }
                    </div>}
                </div>
            </div>
        );
    }
}

export default CalendarFilterComponent;