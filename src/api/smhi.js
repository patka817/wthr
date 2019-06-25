import { truncate, fetchAndExtractJSON } from './util';
import { Forecast, Time } from './../timeSerie';

const PLACEHOLDER_LAT = '{latitude}';
const PLACEHOLDER_LON = '{longitude}';
const SMHI_VERSION = 2;
const SMHI_API = `https://opendata-download-metfcst.smhi.se/api/category/pmp3g/version/${SMHI_VERSION}/geotype/point/lon/{longitude}/lat/{latitude}/data.json`;

const mapObjects = (intoObj, fromObj, key, fromObjectKey = undefined, valueTransformer = (val) => val) => {
    if (!fromObj) {
        throw Error('Missing object to map from');
    }
    if (!intoObj) {
        throw Error('Missing object to map into');
    }

    if (!fromObjectKey) {
        fromObjectKey = key;
    }
    let value = null;
    if (fromObjectKey in fromObj) {
        value = fromObj[fromObjectKey];
    }

    intoObj[key] = valueTransformer(value);
};

const mappingInstantJSONParametersToTimeSerieProp = {
    't': 'temp',
    'ws': 'windSpeed',
    'wd': 'windDirection',
    'gust': 'gust'
};
const mappingTimeParametersToTimeSerieProp = {
    'pmean': 'meanPrecipitation',
};
const parseResponseJSON = (json) => {
    const approvedTime = json['approvedTime'] ? new Date(json['approvedTime']) : null;
    let forecast = new Forecast();
    forecast.approvedTime = approvedTime;

    if ('timeSeries' in json) {
        let prevParsedTimeSerie = null;
        for (let index in json.timeSeries) {
            let x = json.timeSeries[index];
            let time = new Time();
            
            mapObjects(time, x, 'endTime', 'validTime', (val) => new Date(val));

            // SMHI's time is indirect given by the previous time (from/start time) until 'validTime' (to/end date).
            // But, some parameters in the data is instantaniously (e.g. only holds for the exact validTime), thus we must create two time/termins..
            time.startTime = prevParsedTimeSerie ? prevParsedTimeSerie.endTime : time.endTime;
            let instantaniouslyTime = new Time();
            if (time.isInstant()) {
                instantaniouslyTime = time;
            } else {
                instantaniouslyTime.approvedTime = time.approvedTime;
                instantaniouslyTime.endTime = time.endTime;
                instantaniouslyTime.startTime = time.endTime;
                forecast.timeSerie.push(instantaniouslyTime);
            }

            for (let jsonParameterName in mappingInstantJSONParametersToTimeSerieProp) {
                let timeSerieProp = mappingInstantJSONParametersToTimeSerieProp[jsonParameterName];
                const jsonParam = x.parameters.find(val => val.name === jsonParameterName);
                mapObjects(instantaniouslyTime[timeSerieProp], jsonParam, 'value', 'values', (values) => values.length === 1 ? values[0] : values);
                mapObjects(instantaniouslyTime[timeSerieProp], jsonParam, 'unit');
            }
            instantaniouslyTime.weatherSymbol = x.parameters.find(val => val.name === 'Wsymb2').values[0];

            for (let jsonParameterName in mappingTimeParametersToTimeSerieProp) {
                let timeSerieProp = mappingTimeParametersToTimeSerieProp[jsonParameterName];
                const jsonParam = x.parameters.find(val => val.name === jsonParameterName);
                mapObjects(time[timeSerieProp], jsonParam, 'value', 'values', (values) => values.length === 1 ? values[0] : values);
                mapObjects(time[timeSerieProp], jsonParam, 'unit');
            }

            forecast.timeSerie.push(time);
            prevParsedTimeSerie = time;
        }

        return forecast;
    } else {
        throw Error('Missing data in SMHI JSON');
    }
};

const fetchSMHIData = (lat, lon) => {
    // truncate, SMHI don't like more than 6 decimals..
    lat = truncate(lat, 6);
    lon = truncate(lon, 6);

    return fetchAndExtractJSON(SMHI_API.replace(PLACEHOLDER_LAT, lat).replace(PLACEHOLDER_LON, lon)).then(json => parseResponseJSON(json));
};

export default fetchSMHIData;