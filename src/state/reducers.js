import * as Actions from './actions';
export const SMHI_FORECAST = 'smhi';
export const YR_FORECAST = 'yr';

export const initialState = {
    lat: null,
    lon: null,
    city: null,
    fetchingPosition: false,
    lastUpdate: null,
    activeForecast: SMHI_FORECAST,
    loading: false, // when loading for new location
    error: null,
    seenVersion: null
};

export const rootReducer = (state = initialState, action) => {
    switch (action.type) {
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

        case Actions.UPDATED_APP:
            return {
                ...state,
                newVersion: action.newVersion
            }

        case Actions.MARK_SEEN_VERSION_INFO:
            return {
                ...state,
                newVersion: null,
                seenVersion: state.newVersion
            }

        default:
            return state;
    }
};