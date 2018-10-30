/* eslint-disable */
export const findTimeInterval = (date, mode) => {
    if(!(date instanceof Date)) {
        console.log('not a Date');
        return;
    }

    Date.prototype.daysInMonth = function() {
		return 32 - new Date(this.getFullYear(), this.getMonth(), 32).getDate();
    };

    return findWeekInterval(date);
}

// ------------- Week ----------------
function findWeekInterval(date){
    let dayNum = date.getDay();

    let start, end;

    !dayNum 
        ? (start = new Date(date.getFullYear(), date.getMonth(), date.getDate() - 6),
            end = date)
        : (start = new Date(date.getFullYear(), date.getMonth(), date.getDate() - dayNum + 1),
            end = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7 - dayNum));

    return {
        start,
        end,
    }
}
