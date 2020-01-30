import { createSelector } from 'reselect';

const goals = state => state.calendars.goals;
const goalId = state => state.goalObj.goalId;
const month = state => state.goalObj.month;
const year = state => state.goalObj.year;
const goalsList = state => state.goalsList;

export const getSelectedDays = createSelector(
    goals,goalId, month, year,
  (items, goalId, month, year) => {
        if(items && items[goalId] && goalId && year && items[goalId][year] && items[goalId][year][month]){
            return items[goalId][year][month].days || [];
        }else{
          return [];
        }
  }
)

export const getSelectedGoal = createSelector(
  goalsList,goalId,
(items, goalId) => {
      if(items && items[goalId]){
          return items[goalId] || "No Goal";
      }else{
        return "No Goal";
      }
}
)