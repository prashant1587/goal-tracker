import { ADD_GOAL, REMOVE_GOAL, ADD_REMOVE_DATE, SELECT_GOAL,
  EDIT_GOAL, SELECT_YEAR, SELECT_MONTH, DESELECT_YEAR, DESELECT_MONTH, LOAD_GOAL, LOAD_DATE_SELECTION, LOAD_SELECTION } from './action-types';

  export const loadAllGoals = (goals) => ({
    type: LOAD_GOAL,
    payload: {
      goals
    }
  });

  export const loadSelection = (selection) => ({
    type: LOAD_SELECTION,
    payload: {
      selection
    }
  });

  export const loadDateSelections = (dateSelections) => ({
    type: LOAD_DATE_SELECTION,
    payload: {
      dateSelections
    }
  });

  export const addGoal = (id, goalName) => ({
  type: ADD_GOAL,
  payload: {
    id, goalName
  }
});

export const selectGoal = (id) => ({
  type: SELECT_GOAL,
  payload: {
    id
  }
});

export const editGoal = (id, name) => ({
  type: EDIT_GOAL,
  payload: {
    id, name
  }
});

export const removeGoal = (id) => ({
  type: REMOVE_GOAL,
  payload: {
    id
  }
});

export const selectYear = (year) => ({
  type: SELECT_YEAR,
  payload: {
    year
  }
});

export const deselectYear = (year) => ({
  type: DESELECT_YEAR,
  payload: {
    year
  }
});

export const selectMonth = (month) => ({
  type: SELECT_MONTH,
  payload: {
    month
  }
});

export const deselectMonth = (month) => ({
  type: DESELECT_MONTH,
  payload: {
    month
  }
});

export const toggleDateSelection = ( month, year, goal, date ) => ({
  type: ADD_REMOVE_DATE,
  payload: {  month, year, goal, date  }
});
