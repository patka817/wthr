import { getCityNameForLocation } from '../api/nominatim';

// actions sent from thunk
export const ERROR_LOADING_REFRESHING = 'error-loading-refreshing';
const errorLoadingOrRefreshingData = (msg) => {
    return {
        type: ERROR_LOADING_REFRESHING,
        message: msg
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

export const UPDATED_APP = 'UPDATED_APP';
export const updatedApp = (newVersion) => {
    return {
        type: UPDATED_APP,
        newVersion: newVersion
    };
};

export const MARK_SEEN_VERSION_INFO = "SEEN_UPDATE_TEXT";
export const dismissVersionText = () => {
    return {
        type: MARK_SEEN_VERSION_INFO
    }
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
        getCityName(dispatch, lat, lon);
    };
};

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