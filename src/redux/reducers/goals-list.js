import {  ADD_GOAL, REMOVE_GOAL, EDIT_GOAL, LOAD_GOAL } from "../action-types";

const initialState = {
      1: 'Goal'
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOAD_GOAL: {
      const { goals } = action.payload;
      const data = goals ? goals : state;
      return {
        data
      };
    }
    case ADD_GOAL: {
      const { id, goalName} = action.payload;
      return {
        ...state,
        [id]:goalName
        
      };
    }
    case EDIT_GOAL: {
        const { id, name} = action.payload;
        return {
          ...state,
          [id]: name
        };
    }

    case REMOVE_GOAL: {
        const { id} = action.payload;
        const copiedGoals = { ...state.goals }
        delete copiedGoals[id];
        return {
          ...copiedGoals
        };
    }
    default:
      return state;
  }
}
