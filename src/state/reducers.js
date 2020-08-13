import * as Actions from './actions';
import { addDays } from '../Util/date';
import { FORECAST_LIMIT } from '../weatherComponents/DailyWeatherRow'; 
export const SMHI_FORECAST = 'smhi';
export const YR_FORECAST = 'yr';

export const initialState = {
    lat: null,
    lon: null,
    city: null,
    fetchingPosition: false,
    smhiForecast: null,
    yrForecast: null,
    lastUpdate: null,
    activeForecast: SMHI_FORECAST,
    loading: false, // when loading for new location
    refreshing: false, // when e.g. updating data
    error: null,
    activeHourlyForecastDate: null
};

export const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case Actions.LOADING:
            return {
                ...state,
                loading: true,
                yrForecast: null,
                smhiForecast: null,
                lastUpdate: null,
                error: null,
                activeHourlyForecastDate: null
            }

        case Actions.REFRESH_DATA:
            return {
                ...state,
                refreshing: true,
                error: null
            }

        case Actions.ERROR_LOADING_REFRESHING:
            return {
                ...state,
                loading: false,
                refreshing: false,
                error: {
                    message: action.message,
                    timestamp: (new Date()).getTime()
                }
            }

        case Actions.FETCH_SUCCESS:
            return {
                ...state,
                smhiForecast: action.smhi,
                yrForecast: action.yr,
                lastUpdate: new Date(),
                loading: false,
                refreshing: false,
                error: null,
                activeForecast: resolveActiveForecast(state.activeForecast, action.smhi, action.yr)
            }

        case Actions.LOADING_GPS_POS:
            return {
                ...state,
                fetchingPosition: true,
                error: null
            }

        case Actions.GOT_GPS_POS:
            return {
                ...state,
                fetchingPosition: false,
                error: null,
                lat: action.lat,
                lon: action.lon
            }

        case Actions.FAILED_GPS_POS:
            return {
                ...state,
                fetchingPosition: false,
                error: {
                    message: action.message,
                    timestamp: (new Date()).getTime()
                }
            }

        case Actions.UPDATE_LOCATION:
            return {
                ...state,
                lat: action.lat,
                lon: action.lon
            }

        case Actions.NEW_CITY_NAME:
            return {
                ...state,
                city: action.city
            }

        case Actions.TOGGLE_FORECAST:
            return {
                ...state,
                activeForecast: state.activeForecast === YR_FORECAST ? SMHI_FORECAST : YR_FORECAST
            }

        case Actions.SHOW_HOURLY_FORECAST_DATE:
            return {
                ...state,
                activeHourlyForecastDate: action.date
            }
        
        case Actions.NEXT_HOURLY_FORECAST_DATE:
            if (!state.activeHourlyForecastDate) {
                return state;
            }
            let nextDate = addDays(state.activeHourlyForecastDate, 1);
            let limitDate = addDays((new Date()).setHours(0,0,0,0), FORECAST_LIMIT);
            if (nextDate >= limitDate) {
                return state;
            }
            let data = activeForecastData(state);
            if (!data || !data.hasDataForDayDate(nextDate)) {
                return state;
            }
            return {
                ...state,
                activeHourlyForecastDate: nextDate
            }

        case Actions.PREV_HOURLY_FORECAST_DATE:
            if (!state.activeHourlyForecastDate) {
                return state;
            }
            let prevDate = addDays(state.activeHourlyForecastDate, -1);
            if (prevDate < (new Date()).setHours(0,0,0,0)) {
                return state;
            }
            return {
                ...state,
                activeHourlyForecastDate: prevDate
            }

        default:
            return state;
    }
};

const activeForecastData = (state) => {
    if (state.activeForecast === SMHI_FORECAST) {
        return state.smhiForecast;
    } else if (state.activeForecast === YR_FORECAST) {
        return state.yrForecast;
    }
    return null;
};

const resolveActiveForecast = (active, smhi, yr) => {
    const hasSMHI = !!smhi;
    const hasYR = !!yr;
    if (active === SMHI_FORECAST && !hasSMHI) {
        return YR_FORECAST;
    } else if (active === YR_FORECAST && !hasYR) {
        return SMHI_FORECAST;
    }
    return active;
};