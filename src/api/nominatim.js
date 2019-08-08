import { fetchAndExtractJSON } from './util';

const REVERSE_TEMPLATE = 'https://nominatim.openstreetmap.org/reverse?lat={LAT}&lon={LON}&format=json&email=pclillen@gmail.com';
const REVERSE_JSON_KEY_SEARCH_ORDER = ['city_district', 'city', 'town', 'county'];

const SEARCH_TEMPLATE = 'https://nominatim.openstreetmap.org/search?city={CITY}&format=json&email=pclillen@gmail.com';

export const getCityNameForLocation = (lat, lon) => {
    const url = REVERSE_TEMPLATE.replace('{LAT}', lat).replace('{LON}', lon);
    return fetchAndExtractJSON(url)
    .then(json => {
        let result = undefined;
        console.log(json);
        if (json.address) {
            // TODO: fix.. include town/village if we find suburban. Search for e.g. Sundsvall..
            for (let keyIndex in REVERSE_JSON_KEY_SEARCH_ORDER) {
                const key = REVERSE_JSON_KEY_SEARCH_ORDER[keyIndex];
                if (json.address[key]) {
                    result = json.address[key];
                    console.log('Found ' + key + ' == ' + result);
                    break;
                }
            }
        } 
        
        if (!result || result === undefined) {
            Promise.reject('Failed to get valid answer from nominatim');
        } else {
            return result;
        }
    });
};

export const searchCityNames = (searchTerm) => {
    const encodedSearch = encodeURIComponent(searchTerm);
    const url = SEARCH_TEMPLATE.replace('{CITY}', encodedSearch);
    return fetchAndExtractJSON(url)
    .then(json => {
        return json;
    })
    .catch(error => {
        console.error(error.message);
    });
};