import React from 'react';
import GoalComponent from './goal.component';
import { getSelectedGoal } from '../../redux/selectors';
import { addGoal, editGoal, removeGoal, selectGoal} from '../../redux/actions';
import { connect } from 'react-redux';

class  GoalsComponent extends React.Component {

    updateGoal(goalName) {
        this.props.editGoal(this.props.goalId, goalName);
    }

    addGoal() {
        const keys = this.props.goalsList ? Object.keys(this.props.goalsList).sort((a,b) => a-b) : [];
        const key = keys.length>0 ? parseInt(keys[keys.length-1]) + 1 : 1;  
        this.props.addGoal(key,'Default Goal');  
    }

    render() {
        return (
            <div className="goals-list">
                <div>
                   {this.props.goalsList && 
                   Object.keys(this.props.goalsList).map((goalId, i) => 
                        {return (
                            <GoalComponent
                                goal={this.props.goalsList[goalId]}
                                id={goalId}
                                key={'goal_'+goalId}
                                selectGoal={(goal)=> this.props.selectGoal(goal)}
                                editGoal={(goal)=> this.updateGoal(goal)}
                            />
                        )}
                   )}
                   <div className="each-goal-container add-button ripple" onClick={() => this.addGoal()}>Add</div>
                </div>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        selectedGoal: getSelectedGoal(state),
        goalId: state.goalObj.goalId,
        goalsList: state.goalsList
    }
};

const mapDispatchToProps = dispatch => {
    return {
        addGoal: (goalId, name) => dispatch(addGoal(goalId, name)),
        editGoal: (goalId, name) => dispatch(editGoal(goalId, name)),
        removeGoal: (goalId) => dispatch(removeGoal(goalId)),
        selectGoal: (goalId) => dispatch(selectGoal(goalId))
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(GoalsComponent);
