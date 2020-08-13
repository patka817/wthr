import fetchSMHIData from '../api/smhi';
import fetchYRData from '../api/yr';
import { getCityNameForLocation } from '../api/nominatim';

// actions sent from thunk
export const ERROR_LOADING_REFRESHING = 'error-loading-refreshing';
const errorLoadingOrRefreshingData = (msg) => {
    return {
        type: ERROR_LOADING_REFRESHING,
        message: msg
    }
};

export const LOADING = 'loading';
const loadingData = () => {
    return {
        type: LOADING
    }
};

export const REFRESH_DATA = 'refresh-data';
const refreshingData = () => {
    return {
        type: REFRESH_DATA
    }
}

export const FETCH_SUCCESS = 'fetch-success';
const fetchedData = (smhi, yr) => {
    return {
        type: FETCH_SUCCESS,
        smhi,
        yr
    }
};

export const LOADING_GPS_POS = 'loading-gps-pos';
const loadingGPSPosition = () => {
    return {
        type: LOADING_GPS_POS
    };
};

export const GOT_GPS_POS = 'got-gps-pos';
const fetchedGPSPos = (lat, lon) => {
    return {
        type: GOT_GPS_POS,
        lat,
        lon
    };
};

export const FAILED_GPS_POS = 'failed-gps-pos';
const failedGPSPos = (msg) => {
    return {
        type: FAILED_GPS_POS,
        message: msg
    };
};

export const UPDATE_LOCATION = 'update-location';
const updateLocation = (lat, lon) => {
    return {
        type: UPDATE_LOCATION,
        lat,
        lon
    }
}

export const NEW_CITY_NAME = 'new-city-name';
const newCityName = (name) => {
    return {
        type: NEW_CITY_NAME,
        city: name
    };
};

export const TOGGLE_FORECAST = 'toggle-forecast';
export const toggleForecast = () => {
    return { type: TOGGLE_FORECAST };
};

export const NEXT_HOURLY_FORECAST_DATE = 'NEXT_HOURLY_FORECAST_DATE';
export const nextHourlyForecast = () => {
    return {
        type: NEXT_HOURLY_FORECAST_DATE,
    };
};

export const PREV_HOURLY_FORECAST_DATE = 'PREV_HOURLY_FORECAST_DATE';
export const prevHourlyForecast = () => {
    return {
        type: PREV_HOURLY_FORECAST_DATE,
    };
};

export const SHOW_HOURLY_FORECAST_DATE = 'SHOW_HOURLY_FORECAST_DATE';
export const showHourlyForecast = (date) => {
    return {
        type: SHOW_HOURLY_FORECAST_DATE,
        date: date
    };
};

// thunk

// get gps pos 

export const getGPSPosition = () => {
    return (dispatch, getState) => {
        dispatch(loadingGPSPosition());

        if ("geolocation" in navigator) {
            // TODO?: We should probably use the watch and pass in some accuracy option etc and get the first result .. 

            navigator.geolocation.getCurrentPosition((pos) => {
                // One could check the distance between the new and old coords to determine if we really need to update..
                dispatch(fetchedGPSPos(pos.coords.latitude, pos.coords.longitude));
                loadData(dispatch, getState, pos.coords.latitude, pos.coords.longitude);
                getCityName(dispatch, pos.coords.latitude, pos.coords.longitude);
            }, (error) => {
                console.error('Failed getting location: ' + error.message);
                dispatch(failedGPSPos(error.message));
            });
        } else {
            dispatch(failedGPSPos('Geolocation is not supported by your device/browser'));
        }
    };
};

export const updateToNewLocation = (lat, lon) => {
    return (dispatch, getState) => {
        dispatch(updateLocation(lat, lon));
        loadData(dispatch, getState, lat, lon);
        getCityName(dispatch, lat, lon);
    };
};

export const refreshData = () => {
    return (dispatch, getState) => {
        const { lat, lon } = getState();
        dispatch(refreshingData());
        fetchData(dispatch, getState, lat, lon);
    };
}

const getCityName = (dispatch, lat, lon) => {
    return getCityNameForLocation(lat, lon)
        .then(name => {
            dispatch(newCityName(name));
        }).catch(err => {
            console.log(err);
            dispatch(newCityName('Unavailable'));
            dispatch(errorLoadingOrRefreshingData('Unable to get location name: ' + err.message));
        });
}

const loadData = (dispatch, getState, lat, lon) => {
    dispatch(loadingData());
    fetchData(dispatch, getState, lat, lon);
};

const fetchData = (dispatch, getState, lat, lon) => {
    if (!lat || !lon) {
        dispatch(errorLoadingOrRefreshingData('Unable to fetch weather, missing valid location.'));
        return;
    }

    // We use timeout only to get a nice animation if the user got fast internet ... And yes, it should probably be in the UI comp..
    setTimeout(() => {
        Promise.all([
            fetchSMHIData(lat, lon).catch(error => { return error }),
            fetchYRData(lat, lon).catch(error => { return error }),
        ]).then(values => {
            let [smhiForecast, yrForecast] = values;
            let errorMessage = undefined;
            const state = getState();

            if (smhiForecast instanceof Error) {
                console.error('Failed to get SMHI forecast');
                console.error(smhiForecast);
                errorMessage = 'Failed to download SMHI forecast: ' + smhiForecast.message;
                if (state.smhiForecast && state.smhiForecast.isValidForLocation(lat, lon)) {
                    smhiForecast = state.smhiForecast;
                } else {
                    smhiForecast = null;
                }
            }

            if (yrForecast instanceof Error) {
                console.error('Failed to get YR forecast');
                console.error(yrForecast);
                errorMessage = 'Failed to download YR forecast: ' + yrForecast.message;
                if (state.yrForecast && state.yrForecast.isValidForLocation(lat, lon)) {
                    yrForecast = state.yrForecast;
                } else {
                    yrForecast = null;
                }
            }

            // TODO: we should have some epsilon in the check..
            if (state.lon !== lon || state.lat !== lat) {
                console.error('invalid coordinates, failing data fetch');
                Promise.reject('Mismatching coordinates on fetched data and state');
            } else {
                dispatch(fetchedData(smhiForecast, yrForecast));
            }

            if (errorMessage) {
                dispatch(errorLoadingOrRefreshingData(errorMessage));
            }
        }).catch(error => {
            console.error('something failed,  ' + error);
            dispatch(errorLoadingOrRefreshingData(error.message));
        });
    }, 1000);
};