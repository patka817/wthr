import React from 'react';
import { Paper, Typography } from '@material-ui/core';
import { ChevronRight } from '@material-ui/icons';
 
// TODO: Change Typo to div's with class: daily-font
export const DailyHeaderRow = (props) => {
    return (
        <div className="day-weather-row day-weather-row-header">
            <div className='day-weather-row-night-icon day-weather-header'>Night</div>
            <div className='day-weather-row-morning-icon day-weather-header'>Morning</div>
            <div className='day-weather-row-afternoon-icon day-weather-header'>Afternoon</div>
            <div className='day-weather-row-evening-icon day-weather-header'>Evening</div>
            <div className='day-weather-row-low day-weather-header'>L</div>
            <div className='day-weather-row-high day-weather-header'>H</div>
            <div className='day-weather-row-prec day-weather-header'>Precip.</div>
            <div className='day-weather-row-wind day-weather-header'>Wind (m/s)</div>
        </div>
    );
}

export const dailyDateTitle = (date) => {
    const now = new Date();
    const tomorrow = addDays(now, 1);
    let prefix = null;
    if (sameDayDates(date, now)) {
        prefix = 'Today';
    } else if (sameDayDates(tomorrow, date)) {
        prefix = 'Tomorrow';
    } else {
        prefix = `${date.toLocaleString(navigator.language, { weekday: 'long' })}`;
    }
    const dateString = `${prefix}, ${date.toLocaleString(navigator.language, { month: 'long', day: 'numeric' })}`;
    return dateString;
};

export const DailyWeatherRow = (props) => {
    let date = props.viewModel.date;
    const dateString = dailyDateTitle(date);
    // TODO: extract template
    const WICON_TEMPLATE = 'https://api.met.no/weatherapi/weathericon/1.1/?symbol={WSYMB}&is_night={NIGHT}&content_type=image/png';

    return (
        <button className='transparent-button' onClick={props.onClick}>
            <Paper className="day-weather-row">
                <div className='day-weather-row-date daily-font'>{dateString}</div>
                {props.viewModel.nightSymbol !== undefined && props.viewModel.nightSymbol !== 0 ? <img className="w-icon day-weather-row-night-icon" src={WICON_TEMPLATE.replace('{WSYMB}', props.viewModel.nightSymbol).replace('{NIGHT}', 1)} alt='icon of current weather in the night' /> : null}
                {props.viewModel.morningSymbol !== undefined && props.viewModel.morningSymbol !== 0 ? <img className="w-icon day-weather-row-morning-icon" src={WICON_TEMPLATE.replace('{WSYMB}', props.viewModel.morningSymbol).replace('{NIGHT}', 0)} alt='icon of current weather in the morning' /> : null}
                {props.viewModel.afternoonSymbol !== undefined && props.viewModel.afternoonSymbol !== 0 ? <img className="w-icon day-weather-row-afternoon-icon" src={WICON_TEMPLATE.replace('{WSYMB}', props.viewModel.afternoonSymbol).replace('{NIGHT}', 0)} alt='icon of current weather in the afternoon' /> : null}
                {props.viewModel.eveningSymbol !== undefined && props.viewModel.eveningSymbol !== 0 ? <img className="w-icon day-weather-row-evening-icon" src={WICON_TEMPLATE.replace('{WSYMB}', props.viewModel.eveningSymbol).replace('{NIGHT}', 0)} alt='icon of current weather in the evening' /> : null}
                <Typography className='day-weather-row-low' variant='body1'>{`${props.viewModel.minTemp}°`}</Typography>
                <Typography className='day-weather-row-high' variant='body1'>{`${props.viewModel.maxTemp}°`}</Typography>
                <Typography className='day-weather-row-prec' variant='body1'>{props.viewModel.precipitation !== undefined ? props.viewModel.precipitation : '-'}</Typography>
                <Typography className='day-weather-row-wind' variant='body1'>{`${props.viewModel.maxWind}`}</Typography>
                <ChevronRight className='day-weather-row-chevron' />
            </Paper>
        </button>
    );
};

// TODO: Refactor 
const FORECAST_LIMIT = 7;
export const createDailyViewModels = (forecast) => {
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
        let filtered = forecast.timeserieFilteredByDay(date);
        filtered = removePassedTime(filtered);
        const instantKeys = ['temp', 'windSpeed'];
        const minmaxValues = findMinMaxInstantValues(instantKeys, filtered);
        const wsymbols = mapTimesToWeatherSymbolPerHour(date, filtered);
        const daySymbols = reduceHourSymbolsToDaySymbols(wsymbols);

        const precip = calculatePrecipitation(date, filtered);

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

const addDays = (date, days) => {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

const sameDayDates = (date1, date2) => {
    if (date1.getDate() !== date2.getDate()) {
        return false;
    } else if (date1.getMonth() !== date2.getMonth()) {
        return false;
    } else if (date1.getFullYear() !== date2.getFullYear()) {
        return false;
    }
    return true;
};

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

    result.nightSymbol = findMaxOccuringElement(night);
    result.morningSymbol = findMaxOccuringElement(morning);
    result.afternoonSymbol = findMaxOccuringElement(afternoon);
    result.eveningSymbol = findMaxOccuringElement(evening);

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
        while (true) {
            if ((time.endTime.getTime() - cTime.getTime()) <= 0 ||
                cTime.getDate() !== soughtDayDate.getDate()) {
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