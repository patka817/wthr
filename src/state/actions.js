import fetchSMHIData from '../api/smhi';
import fetchYRData from '../api/yr';
import { getCityNameForLocation } from '../api/nominatim';

// actions sent from thunk
export const ERROR_LOADING = 'error-loading';
const errorLoadingData = (msg) => {
    return {
        type: ERROR_LOADING,
        message: msg
    }
};

export const LOADING = 'loading';
const loadingData = () => {
    return {
        type: LOADING
    }
};

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

export const NEW_GPS_CITY_NAME = 'new-gps-city-name';
const newGPSCityName = (name) => {
    return {
        type: NEW_GPS_CITY_NAME,
        city: name
    };
};

export const TOGGLE_FORECAST = 'toggle-forecast';
export const toggleForecast = () => {
    return { type: TOGGLE_FORECAST };
};

// thunk

// get gps pos 

export const getGPSPosition = () => {
    return (dispatch, getState) => {
        dispatch(loadingGPSPosition());

        if ("geolocation" in navigator) {
            // TODO?: We should probably use the watch and pass in some accuracy option etc and get the first result .. 

            navigator.geolocation.getCurrentPosition((pos) => {
                console.log('Got location, lat: ' + pos.coords.latitude + ', lon: ' + pos.coords.longitude);
                // One could check the distance between the new and old coords to determine if we really need to update..
                dispatch(fetchedGPSPos(pos.coords.latitude, pos.coords.longitude));
                fetchDataExecutor(dispatch, getState, pos.coords.latitude, pos.coords.longitude);
                getCityName(dispatch, pos.coords.latitude, pos.coords.longitude);
            }, (error) => {
                console.log('Failed getting location: ' + error.message);
                dispatch(failedGPSPos(error.message));
            });
        } else {
            dispatch(failedGPSPos('Geolocation is not supported by your device/browser'));
        }
    };
};

// TOOO: GET searchresult... from search-text through

const getCityName = (dispatch, lat, lon) => {
    getCityNameForLocation(lat, lon)
    .then(name => {
        dispatch(newGPSCityName(name));
    }).catch(err => {
        console.log(err);
        dispatch(newGPSCityName('Current location'));
    });
}

// GET weather data
const fetchDataExecutor = (dispatch, getState, lat, lon) => {
    dispatch(loadingData());
    if (!lat || !lon) {
        dispatch(errorLoadingData('Unable to fetch weather, missing valid location.'));
        return;
    }

    setTimeout(() => {
        Promise.all([
            fetchSMHIData(lat, lon),
            fetchYRData(lat, lon),
        ]).then(values => {
            const state = getState();
            // TODO: we should have some epsilon in the check..
            if (state.lon !== lon || state.lat !== lat) {
                console.log('invalid coordinates, failing data fetch');
                Promise.reject('Mismatching coordinates on fetched data and state');
            } else {
                dispatch(fetchedData(values[0], values[1]));
            }
        }).catch(error => {
            console.log('something failed,  ' + error);
            dispatch(errorLoadingData(error));
        });
    }, 1000);
};

export const fetchData = () => {
    return (dispatch, getState) => {
        const { lat, lon } = getState();
        fetchDataExecutor(dispatch, getState, lat, lon);
    };
};