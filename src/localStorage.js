import { Forecast, Time } from "./timeSerie";

const DATE_KEYS = ['endTime', 'startTime', 'approvedTime', 'lastUpdate'];
const FORECAST_KEYS = ['yrForecast', 'smhiForecast'];
const TIMESERIES_KEYS = ['timeSerie'];

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) {
            return undefined;
        }
        let state = JSON.parse(serializedState, (name, value) => {
            if (FORECAST_KEYS.indexOf(name) !== -1 && value) {
                return new Forecast(value);
            } else if (TIMESERIES_KEYS.indexOf(name) !== -1) {
                return value.map(x => new Time(x));
            } else if (DATE_KEYS.indexOf(name) !== -1) {
                return new Date(value);
            }
            return value;
        });
        
        return state;
    } catch (err) {
        console.error('Failed to load state: ' + err);
        return undefined;
    }
};

export const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        if (serializedState !== null) {
            localStorage.setItem('state', serializedState);
        }
    } catch (err) {
        console.error('Failed to save state: ' + err);
    }
};