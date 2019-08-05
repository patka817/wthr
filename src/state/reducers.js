import * as Actions from './actions';

export const SMHI_FORECAST = 'smhi';
export const YR_FORECAST = 'yr';

export const initialState = {
    lat: null,
    lon: null,
    city: null,
    fetchingPosition: false,
    smhiForecast: null,
    yrForecast: null,
    activeForecast: SMHI_FORECAST,
    loading: false,
    error: null
};

export const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case Actions.LOADING:
            return {
                ...state,
                loading: true,
                error: null,
            }

        case Actions.ERROR_LOADING:
            return {
                ...state,
                loading: false,
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
                loading: false,
                error: null,
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

        case Actions.NEW_GPS_CITY_NAME:
            return {
                ...state,
                city: action.city
            }

        case Actions.TOGGLE_FORECAST:
            return {
                ...state,
                activeForecast: state.activeForecast === YR_FORECAST ? SMHI_FORECAST : YR_FORECAST
            }

        default:
            return state;
    }
};