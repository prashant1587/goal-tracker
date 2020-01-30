import { combineReducers } from "redux";
import calendars from "./calendars";
import goalObj from './goal-state';
import goalsList from './goals-list';

export default combineReducers({ calendars, goalsList, goalObj });
