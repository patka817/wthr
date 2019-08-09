import { fetchAndExtractJSON } from './util';

const REVERSE_TEMPLATE = 'https://nominatim.openstreetmap.org/reverse?lat={LAT}&lon={LON}&format=json&email=pclillen@gmail.com';

// city district is an administrative term, so we always look for the suburb first.
const REVERSE_JSON_KEY_SEARCH_ORDER_SUBURB = ['suburb', 'city_district'];

const REVERSE_JSON_KEY_SEARCH_ORDER_TOWN = ['city', 'town', 'county'];

const SEARCH_TEMPLATE = 'https://nominatim.openstreetmap.org/search?city={CITY}&format=json&email=pclillen@gmail.com';

const extractSuburbDistrict = (address) => {
    let result = undefined;
    for (let keyIndex in REVERSE_JSON_KEY_SEARCH_ORDER_SUBURB) {
        const key = REVERSE_JSON_KEY_SEARCH_ORDER_SUBURB[keyIndex];
        if (address[key]) {
            result = address[key];
            console.log('Found ' + key + ' == ' + result);
            break;
        }
    }
    return result;
};

const extractTownOrUpName = (address) => {
    let name = undefined;
    let isCity = false;
    for (let keyIndex in REVERSE_JSON_KEY_SEARCH_ORDER_TOWN) {
        const key = REVERSE_JSON_KEY_SEARCH_ORDER_TOWN[keyIndex];
        if (address[key]) {
            name = address[key];
            isCity = key === 'city';
            console.log('Found ' + key + ' == ' + name);
            break;
        }
    }
    return { name, isCity };
};

export const getCityNameForLocation = (lat, lon) => {
    const url = REVERSE_TEMPLATE.replace('{LAT}', lat).replace('{LON}', lon);
    return fetchAndExtractJSON(url)
    .then(json => {
        let result = undefined;
        console.log(json);
        if (json && json.address) {
            const { name: townOrCity, isCity } = extractTownOrUpName(json.address);
            let suburbDistrict = undefined;
            if (isCity) {
                suburbDistrict = extractSuburbDistrict(json.address);
                result = suburbDistrict ? `${suburbDistrict}, ${townOrCity}`: townOrCity;
            } else {
                result = townOrCity;
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