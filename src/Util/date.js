export const dailyDateTitle = (date) => {
    const now = new Date();
    const tomorrow = addDays(now, 1);
    let prefix = null;
    if (sameDayDates(date, now)) {
        prefix = 'Today';
    } else if (sameDayDates(tomorrow, date)) {
        prefix = 'Tomorrow';
    } else {
        prefix = `${date.toLocaleString('en-US', { weekday: 'long' })}`;
    }
    const dateString = `${prefix}, ${date.toLocaleString(navigator.language, { month: 'long', day: 'numeric' })}`;
    return dateString;
};

export const addDays = (date, days) => {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

export const sameDayDates = (date1, date2) => {
    if (date1.getDate() !== date2.getDate()) {
        return false;
    } else if (date1.getMonth() !== date2.getMonth()) {
        return false;
    } else if (date1.getFullYear() !== date2.getFullYear()) {
        return false;
    }
    return true;
};