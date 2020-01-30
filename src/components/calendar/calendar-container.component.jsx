import React from 'react';
import WeekComponent from './weeks.component';
import { shortDays, months} from '../../util/calendar.constants';
import calendarUtil from '../../util/calendar.service';
import moment  from 'moment';
import DaysComponent from './days.component';
import { connect } from 'react-redux';
import { getSelectedDays } from '../../redux/selectors';
import { toggleDateSelection, selectMonth, selectYear } from '../../redux/actions';
import CalendarFilterComponent from './calendar-filter.component';


class  CalendarContainerComponent extends React.Component {
    month = moment().month();
    year = moment().year();
    years = calendarUtil.generateYears(1990, 2100);
    constructor(props) {
        super(props);
        this.state = {
            daysArray: [],
            month: this.props.updatedMonth || moment().month(),
            year: this.props.updatedYear || moment().year(),
            monthsArray: []
        }
    }
    
    componentDidMount() {
        //this.setState({daysArray:calendarUtil.getDaysArray(this.state.year, this.state.month)});
    }

    addCross(day) {
        this.props.selectDate(this.props.updatedMonth, this.props.updatedYear, this.props.updatedGoal, day.value);
    }

    render() {
        const daysArray = calendarUtil.getDaysArray(this.props.updatedYear, this.props.updatedMonth);
        return (
            <div className="calendar-container">
                <div className="calendar-header">
                    <CalendarFilterComponent 
                        months={months} 
                        yearsList={this.years} 
                        updateMonth={(month) => this.props.selectMonth(month)} 
                        updateYear={(year) => this.props.selectYear(year)}
                        month={this.props.updatedMonth}
                        year={this.props.updatedYear}
                    />
                </div>
                <div className="calendar">
                    <WeekComponent weekNames = {shortDays}/>
                    <DaysComponent days = {daysArray} selectedDays={this.props.selectedDays} updateClass = {(day) => this.addCross(day)}/>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        selectedDays: getSelectedDays(state),
        updatedYear: state.goalObj.year,
        updatedMonth: state.goalObj.month,
        updatedGoal: state.goalObj.goalId
    }
};

const mapDispatchToProps = dispatch => {
    return {
        selectDate: (month, year, goal, date) => dispatch(toggleDateSelection(month, year, goal, date)),
        deselectDate: (month, year, goal, date) => dispatch(toggleDateSelection(month, year, goal, date)),
        selectMonth: (month) => dispatch(selectMonth(month)),
        selectYear: (year) => dispatch(selectYear(year))
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(CalendarContainerComponent);
