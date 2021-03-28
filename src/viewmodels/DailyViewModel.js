import { sameDayDates, addDays } from '../Util/date';

export const FORECAST_LIMIT = 7;
export const createDailyViewModels = (forecast) => {
    if (!forecast) {
        return null;
    }
    // datum
    // ikoner: night, morning, afternoon & evening
    // min/max temp
    // precip hela dagen, om inte idag
    // min/max vind

    // night: 00-06
    // morning: 06-12
    // afternoon: 12-18
    // evening: 18-00

    // time / day 
    //  instants
    //  1h, 2h, 3h, 4h
    let res = [];

    const today = Date();
    for (let i = 0; i < FORECAST_LIMIT; i++) {
        let date = addDays(today, i);
        const filteredTimes = forecast.timeserieFilteredByDay(date);
        const futureTimes = removePassedTime(filteredTimes);
        const instantKeys = ['temp', 'windSpeed'];
        const minmaxValues = findMinMaxInstantValues(instantKeys, futureTimes);
        const wsymbols = mapTimesToWeatherSymbolPerHour(date, filteredTimes);
        const daySymbols = reduceHourSymbolsToDaySymbols(wsymbols);

        const precip = calculatePrecipitation(date, futureTimes);

        res.push({
            date: date,
            precipitation: precip > 0 ? precip.toFixed(1) : '',
            minTemp: minmaxValues['temp'] ? Math.round(minmaxValues['temp'].min) : '-',
            maxTemp: minmaxValues['temp'] ? Math.round(minmaxValues['temp'].max) : '-',
            minWind: minmaxValues['windSpeed'] ? minmaxValues['windSpeed'].min.toFixed(1) : '-',
            maxWind: minmaxValues['windSpeed'] ? minmaxValues['windSpeed'].max.toFixed(1) : '-',
            ...daySymbols
        });
    }

    return res;
};

// Helpers

// TODO: into seperate file.
// Add it as function on array instead!
const findMaxOccuringElement = (array) => {
    let tracker = {};

    for (let index in array) {
        let arrEl = array[index];
        if (!(arrEl in tracker)) {
            tracker[arrEl] = 0;
        }
        tracker[arrEl] += 1;
    }

    let maxEl = undefined;
    let maxCount = 0;
    for (let el in tracker) {
        if (tracker[el] > maxCount) {
            maxEl = el;
            maxCount = tracker[el];
        }
    }
    return maxEl;
};

// Data processing

const reduceHourSymbolsToDaySymbols = (hourSymbols) => {
    // night: 00-06
    // morning: 06-12
    // afternoon: 12-18
    // evening: 18-00
    let result = {
        nightSymbol: 0,
        morningSymbol: 0,
        afternoonSymbol: 0,
        eveningSymbol: 0
    };
    let night = [];
    let morning = [];
    let afternoon = [];
    let evening = [];

    for (let hour in hourSymbols) {
        if (hour <= 6) {
            night.push(hourSymbols[hour]);
        } else if (hour <= 12) {
            morning.push(hourSymbols[hour]);
        } else if (hour <= 18) {
            afternoon.push(hourSymbols[hour]);
        } else if (hour <= 23) {
            evening.push(hourSymbols[hour]);
        }
    }

    // Showing "worst" weather for the given periods instead of the most occuring seems better to not miss rain etc
    // Then the users can expect that weather as the worst for the period.
    // Update: Now we'r showing most occuring due to strings instead of numbers..
    result.nightSymbol = night.length > 0 ? findMaxOccuringElement(night) : undefined; //Math.max(...night)
    result.morningSymbol = morning.length > 0 ? findMaxOccuringElement(morning) : undefined; //Math.max(...morning);
    result.afternoonSymbol = afternoon.length > 0 ? findMaxOccuringElement(afternoon) : undefined; //Math.max(...afternoon);
    result.eveningSymbol = evening.length > 0 ? findMaxOccuringElement(evening) : undefined; //Math.max(...evening);

    return result;
};

const mapTimesToWeatherSymbolPerHour = (soughtDayDate, arrayOfTimes) => {
    let res = {};
    for (let timeIndex in arrayOfTimes) {
        const time = arrayOfTimes[timeIndex];
        if (time.weatherSymbol === 0 ||
            (sameDayDates(soughtDayDate, time.startTime) === false && sameDayDates(soughtDayDate, time.endTime) === false)) {
            continue;
        }

        if (time.isInstant() === true) {
            const hour = time.startTime.getHours();
            res[hour] = {
                symbol: time.weatherSymbol,
                timeInterval: 0
            };
        } else {
            // Smear the symbol out onto each hour that the time is spanning
            let cTime = new Date(time.startTime);
            const timeLength = time.timeLength();
            while (true) {
                if ((time.endTime.getTime() - cTime.getTime()) <= 0 ||
                    cTime.getDate() !== soughtDayDate.getDate()) {
                    break;
                }

                const hour = cTime.getHours();
                if (!(hour in res) || res[hour].timeInterval >= timeLength) {
                    res[hour] = {
                        symbol: time.weatherSymbol,
                        timeInterval: timeLength
                    };
                }
                cTime = new Date(cTime.getTime() + ONE_HOUR);
            }
        }
    }

    for (let hour in res) {
        res[hour] = res[hour].symbol;
    }
    return res;
};

// This isn't really correct, it depends on the data; we don't handle time's that surpass midnight correctly.
// It is an NP-problem to solve this and if the data has large timespans it isn't correct to interpolate precipitation by hour (it can rain in the last hour for a time that spans multiple hours, for example)
const calculatePrecipitation = (soughtDayDate, arrayOfTimes) => {
    let timeCover = {};
    for (let timeIndex in arrayOfTimes) {
        const time = arrayOfTimes[timeIndex];
        const timeLength = time.timeLength();

        if (timeLength === 0 ||
            (sameDayDates(soughtDayDate, time.startTime) === false && sameDayDates(soughtDayDate, time.endTime) === false)) {
            continue;
        }

        const now = new Date();
        let cTime = new Date(time.startTime);

        // const isInThePastOrSameDate = (date, comparedToDate) => {
        //     return date.getTime() - comparedToDate.getTime() <= 0;
        // };

        const isSameDay = (date, otherDate) => {
            return date.getDate() === otherDate.getDate();
        };

        while (true) {
            if ((time.endTime.getTime() - cTime.getTime()) <= 0 ||
                !isSameDay(cTime, soughtDayDate)) {
                break;
            }

            const hour = cTime.getHours();
            if (cTime.getTime() - now.getTime() < 0) {
                cTime = new Date(cTime.getTime() + ONE_HOUR);
                continue;
            }

            if ((hour in timeCover) && timeCover[hour].timeLength >= timeLength) {
                timeCover[hour] = {
                    coveredTime: time,
                    timeLength: timeLength
                };
            } else if (!(hour in timeCover)) {
                timeCover[hour] = {
                    coveredTime: time,
                    timeLength: timeLength
                };
            }


            cTime = new Date(cTime.getTime() + ONE_HOUR);
        }
    }

    let times = [];
    for (let key in timeCover) {
        let time = timeCover[key].coveredTime;
        if (times.indexOf(time) === -1) {
            times.push(time);
        }
    }

    const result = times.reduce((accVal, el) => {
        return el.meanPrecipitation && el.meanPrecipitation.value && el.timeLength() ? parseFloat(el.meanPrecipitation.value) * parseFloat(el.timeLength()) + accVal : accVal;
    }, 0);
    return result;
};

const findMinMaxInstantValues = (instantKeys, arrayOfTimes) => {
    let res = {};
    for (let timeIndex in arrayOfTimes) {
        const time = arrayOfTimes[timeIndex];
        if (time.isInstant() === false) {
            continue;
        }

        for (let instantKeyIndex in instantKeys) {
            const instantKey = instantKeys[instantKeyIndex];
            if (!(instantKey in time)) {
                console.log('Missing key ' + instantKey + ' in time');
                continue;
            }

            const timeValue = parseFloat(time[instantKey].value);
            if (isNaN(timeValue) || isFinite(timeValue) === false) {
                console.log('failed to parse float-value for instantKey ' + instantKey);
                continue;
            }

            if (!(instantKey in res)) {
                res[instantKey] = {
                    min: timeValue,
                    max: timeValue
                };
            } else {
                res[instantKey].min = timeValue < res[instantKey].min ? timeValue : res[instantKey].min;
                res[instantKey].max = timeValue > res[instantKey].max ? timeValue : res[instantKey].max;
            }
        }
    }

    return res;
};

const ONE_HOUR = 1000 * 60 * 60;
const removePassedTime = (arrayOfTimes) => {
    const nowTime = new Date().getTime();

    return arrayOfTimes.filter(el => {
        if (el.isInstant() && Math.abs(el.startTime.getTime() - nowTime) < ONE_HOUR) {
            return true;
        }
        const elTime = el.endTime.getTime();
        return (nowTime - elTime) < 0;
    });
};