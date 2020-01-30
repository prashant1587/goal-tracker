import {  SELECT_GOAL, SELECT_YEAR, SELECT_MONTH, LOAD_SELECTION } from "../action-types";

const initialState = {
      year: 2020,
      month: 0,
      goalId: 1
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOAD_SELECTION: {
      const { selection } = action.payload;
      const data = selection ? selection : state;
      return {
        data
      };
    }
    case SELECT_GOAL: {
      const { id} = action.payload;
      return {
        ...state,
        goalId: id
        
      };
    }
    case SELECT_YEAR: {
        const { year} = action.payload;
        return {
          ...state,
          year: year
        };
    }

    case SELECT_MONTH: {
        const { month} = action.payload;
        return {
          ...state,
          month: month
        };
    }
    default:
      return state;
  }
}
