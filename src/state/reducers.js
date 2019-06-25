import * as Actions from './actions';

export const initialState = {
    lat: null,
    lon: null,
    city: null,
    fetchingPosition: false,
    smhiForecast: null,
    yrForecast: null,
    loading: false,
    errorMessage: null
};

export const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case Actions.LOADING:
            return {
                ...state,
                loading: true
            }

        case Actions.ERROR_LOADING:
            return {
                ...state,
                loading: false,
                errorMessage: action.message
            }

        case Actions.FETCH_SUCCESS:
            return {
                ...state,
                smhiForecast: action.smhi,
                yrForecast: action.yr,
                loading: false,
                errorMessage: null,
            }

        case Actions.LOADING_GPS_POS:
            return {
                ...state,
                fetchingPosition: true,
                errorMessage: null
            }

        case Actions.GOT_GPS_POS:
            return {
                ...state,
                fetchingPosition: false,
                errorMessage: null,
                lat: action.lat,
                lon: action.lon,
                city: 'Current Position',
                loading: true
            }

        case Actions.FAILED_GPS_POS:
            return {
                ...state,
                fetchingPosition: false,
                errorMessage: action.message
            }

        default:
            return state;
    }
};