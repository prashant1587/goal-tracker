import { ADD_REMOVE_DATE, LOAD_DATE_SELECTION } from "../action-types";
import * as _ from 'lodash'; 

const initialState = {
  goals: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOAD_DATE_SELECTION: {
      const { dateSelections } = action.payload;
      const data = dateSelections ? dateSelections : state;
      return {
        data
      };
    }
    case ADD_REMOVE_DATE: {
      const { month, year, goal, date } = action.payload;
      const updatedGoals = addRemoveDates(state, month, year, goal, date);
      return {
        ...state,
        goals: {
          ...updatedGoals
        }
      };
    }
    default:
      return state;
  }
}

function addRemoveDates(state, month, year, goalId, date) {
  let goals = _.cloneDeep(state.goals);
  let goal = {...goals};
  goal[goalId] = goals[goalId] || {};
  goal[goalId][year] = goal[goalId][year]||{};
  goal[goalId][year].count = goal[goalId][year].count || 0;
  goal[goalId][year][month] = goal[goalId][year][month] || {count: 0, days:[]};
    if(goal[goalId][year][month].days.indexOf(date)>-1){
      goal[goalId][year][month].days.splice( goal[goalId][year][month].days.indexOf(date), 1);
      goal[goalId][year][month].count--;
      goal[goalId][year].count--;
  }else {
      goal[goalId][year][month].days.push(date);
      goal[goalId][year][month].count++;
      goal[goalId][year].count++;
  }
  goals = {...goal };
  return goals;
}
