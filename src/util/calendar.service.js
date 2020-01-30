import moment from 'moment';


const getDaysArray = function(year, month) {
    const monthWithYear = ''+ year+ '-'+ (month+1);
    const startOfCalendar = moment(monthWithYear + '-'+1, "YYYY MM DD").days();
    const daysInMonth = getDaysInMonth(year, month);
    const startingBlanks = addBlanks(startOfCalendar);
    const dates = addDates(daysInMonth);
    const endingBlanks = addRemainingDays(startOfCalendar,daysInMonth);
    return [...startingBlanks, ...dates, ...endingBlanks];
}

const getDaysInMonth = function(year, month) {
    if(year && month) {
        const format = 'YYYY-MM';
        const monthWithYear = ''+ year+ '-'+ (month+1);
        return moment(monthWithYear, format).daysInMonth();
    }
    return moment().daysInMonth();
}

function addBlanks(blanksToAdd) {
    const blankArray = [];
    for(let i = 0;i<blanksToAdd;i++){
        const obj = {};
        obj.className = 'blank';
        obj.value = '';
        blankArray.push(obj);
    }
    return blankArray;
}

function addDates(daysInMonth) {
    const dateArray = [];
    for(let i = 1;i<=daysInMonth;i++){
        const obj = {};
        obj.className = '';
        obj.value = i;
        dateArray.push(obj);
    }
    return dateArray;
}

function addRemainingDays(startOfCalendar,daysInMonth) {
    let remainingDays = 0;
    if(startOfCalendar===0){
        remainingDays = daysInMonth===28?0:35-daysInMonth;
    }else{
        remainingDays = 35-daysInMonth-startOfCalendar;
    }
    return addBlanks(remainingDays);
}

const generateYears = function(startYear, endYear){
    const arr = [];
    if(startYear<=endYear){
        for(let i = startYear;i<=endYear; i++){
            arr.push(i);
        }
    }
    return arr;
}

const setItemIntoStorage =  function(key, item) {
    const stringifiedItem = JSON.stringify(item);
    localStorage.setItem(key, stringifiedItem);
}

const getItemFromStorage = function(key) {
    const item = localStorage.getItem(key);
    if(item!=null) {
        return JSON.parse(item);
    }
    return null;
}


export default {
    getDaysArray: getDaysArray,
    getDaysInMonth: getDaysInMonth,
    generateYears: generateYears,
    getItemFromStorage: getItemFromStorage,
    setItemIntoStorage: setItemIntoStorage
};