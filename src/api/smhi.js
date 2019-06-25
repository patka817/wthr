import { truncate, fetchAndExtractJSON } from './util';
import TimeSerie from './../timeSerie';

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
    if ('timeSeries' in json) {
        let prevParsedTimeSerie = null;
        let res = [];
        for (let index in json.timeSeries) {
            let x = json.timeSeries[index];
            let timeSerie = new TimeSerie();
            timeSerie.approvedTime = approvedTime;
            mapObjects(timeSerie, x, 'endTime', 'validTime', (val) => new Date(val));

            // SMHI's time is indirect given by the previous time (from/start time) until 'validTime' (to/end date).
            // But, some parameters in the data is instantaniously (e.g. only holds for the exact validTime), thus we must create two time/termins..
            timeSerie.startTime = prevParsedTimeSerie ? prevParsedTimeSerie.endTime : timeSerie.endTime;
            let instantaniouslyTimeSerie = new TimeSerie();
            if (timeSerie.isInstant()) {
                instantaniouslyTimeSerie = timeSerie;
            } else {
                instantaniouslyTimeSerie.approvedTime = timeSerie.approvedTime;
                instantaniouslyTimeSerie.endTime = timeSerie.endTime;
                instantaniouslyTimeSerie.startTime = timeSerie.endTime;
                res.push(instantaniouslyTimeSerie);
            }

            for (let jsonParameterName in mappingInstantJSONParametersToTimeSerieProp) {
                let timeSerieProp = mappingInstantJSONParametersToTimeSerieProp[jsonParameterName];
                const jsonParam = x.parameters.find(val => val.name === jsonParameterName);
                mapObjects(instantaniouslyTimeSerie[timeSerieProp], jsonParam, 'value', 'values', (values) => values.length === 1 ? values[0] : values);
                mapObjects(instantaniouslyTimeSerie[timeSerieProp], jsonParam, 'unit');
            }
            instantaniouslyTimeSerie.weatherSymbol = x.parameters.find(val => val.name === 'Wsymb2').values[0];

            for (let jsonParameterName in mappingTimeParametersToTimeSerieProp) {
                let timeSerieProp = mappingTimeParametersToTimeSerieProp[jsonParameterName];
                const jsonParam = x.parameters.find(val => val.name === jsonParameterName);
                mapObjects(timeSerie[timeSerieProp], jsonParam, 'value', 'values', (values) => values.length === 1 ? values[0] : values);
                mapObjects(timeSerie[timeSerieProp], jsonParam, 'unit');
            }

            res.push(timeSerie);
            prevParsedTimeSerie = timeSerie;            
        }

        return res;
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