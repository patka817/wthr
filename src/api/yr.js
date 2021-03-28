import { fetchAndExtractText } from './util';
import { Time, Forecast } from '../timeSerie';
import { round } from 'lodash';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

const PLACEHOLDER_LAT = '{latitude}';
const PLACEHOLDER_LON = '{longitude}';
const YR_VERSION = "2.0";
const YR_API = `https://api.met.no/weatherapi/locationforecast/${YR_VERSION}/classic?lat={latitude}&lon={longitude}`;

export const YR_OLD_TO_NEW = {
    1: "clearsky",
    2: "fair",
    3: "partlycloudy",
    4: "cloudy",
    5: "rainshowers",
    6: "rainshowersandthunder",
    7: "sleetshowers",
    8: "snowshowers",
    9: "rain",
    10: "heavyrain",
    11: "heavyrainandthunder",
    12: "sleet",
    13: "snow",
    14: "snowandthunder",
    15: "fog",
    20: "sleetshowersandthunder",
    21: "snowshowersandthunder",
    22: "rainandthunder",
    23: "sleetandthunder",
    24: "lightrainshowersandthunder",
    25: "heavyrainshowersandthunder",
    26: "lightssleetshowersandthunder",
    27: "heavysleetshowersandthunder",
    28: "lightssnowshowersandthunder",
    29: "heavysnowshowersandthunder",
    30: "lightrainandthunder",
    31: "lightsleetandthunder",
    32: "heavysleetandthunder",
    33: "lightsnowandthunder",
    34: "heavysnowandthunder",
    40: "lightrainshowers",
    41: "heavyrainshowers",
    42: "lightsleetshowers",
    43: "heavysleetshowers",
    44: "lightsnowshowers",
    45: "heavysnowshowers",
    46: "lightrain",
    47: "lightsleet",
    48: "heavysleet",
    49: "lightsnow",
    50: "heavysnow",
}

// SMHI is missing a lot of these .. Mostly the different thunder-types.. 
const YR_TO_SMHI_SYMB_MAPPING = {
    1: 1,
    2: 2,
    3: 3,
    4: 5,
    5: 8,
    6: 8,
    7: 12,
    8: 15,
    9: 18,
    10: 19,
    11: 11,
    12: 23,
    13: 26,
    14: 11, // NOT SURE..
    15: 7,
    20: 21,
    21: 21,
    22: 21,
    23: 21,
    24: 21,
    25: 21,
    26: 21,
    27: 21,
    28: 21,
    29: 21,
    30: 21,
    31: 21,
    32: 21,
    33: 21,
    34: 21,
    40: 8,
    41: 9,
    42: 13,
    43: 14,
    44: 15,
    45: 17,
    46: 18,
    47: 22,
    48: 24,
    49: 25,
    50: 27
}

const parseResponseXML = (txt) => {
    let xmlDoc = null;
    if (window.DOMParser) {
        const parser = new DOMParser();
        xmlDoc = parser.parseFromString(txt, "text/xml");
    }
    else {
        throw Error('Unsupported browser, cannot parse YR data');
    }

    let approvedTime = null;
    let models = xmlDoc.getElementsByTagName('model');
    if (models && models.length > 0) {
        let model = xmlDoc.getElementsByTagName('model')[0];
        if (model.getAttribute('runended')) {
            const runEnded = model.getAttribute('runended');
            approvedTime = new Date(runEnded);
        }
    }

    let xmlTimeSeries = xmlDoc.getElementsByTagName('time');
    if (!xmlTimeSeries || xmlTimeSeries.length === 0) {
        console.error('Missing timeseries in YR data');
        return null;
    }

    let forecast = new Forecast();
    forecast.approvedTime = approvedTime;

    // YR's data comes in different timeseries: 
    // 1. instantaneously (from=T, to=T)
    // 2. from T-1 to T, for precipitation, symbol
    // 3. from T-2 to T, for precipitation, symbol
    // 4. from T-3 to T, for precipitation, symbol
    // 5. from T-6 to T, for precipitation, min/max temp, symbol
    for (let index = 0; index < xmlTimeSeries.length; index++) {
        const xmlTimeSerie = xmlTimeSeries[index];
        if (!xmlTimeSerie) {
            console.error('Missing timeserie!');
            continue;
        }

        const toDateString = xmlTimeSerie.getAttribute('to');
        const fromDateString = xmlTimeSerie.getAttribute('from');
        if (!toDateString || !fromDateString) {
            console.error('Missing valid to/from date');
            continue;
        }

        const toDate = new Date(toDateString);
        const fromDate = new Date(fromDateString);
        let timeSerie = new Time();
        timeSerie.endTime = toDate;
        timeSerie.startTime = fromDate;

        if ((toDate - fromDate) === 0) {
            // TODO: configurable... 
            /// Get all instantaneously values
            const temp = xmlTimeSerie.getElementsByTagName('temperature')[0];
            if (temp) {
                timeSerie.temp.value = temp.getAttribute('value');
                timeSerie.temp.unit = temp.getAttribute('unit');
            }

            const ws = xmlTimeSerie.getElementsByTagName('windSpeed')[0];
            if (ws) {
                timeSerie.windSpeed.value = ws.getAttribute('mps');
                timeSerie.windSpeed.unit = 'm/s';
            }

            const wd = xmlTimeSerie.getElementsByTagName('windDirection')[0];
            if (wd) {
                timeSerie.windDirection.value = wd.getAttribute('deg');
                timeSerie.windDirection.unit = 'deg';
            }

            const gust = xmlTimeSerie.getElementsByTagName('windGust')[0];
            if (gust) {
                timeSerie.gust.value = gust.getAttribute('mps');
                timeSerie.gust.unit = 'm/s';
            }

        } else {
            // Get precipitation
            const prec = xmlTimeSerie.getElementsByTagName('precipitation')[0];
            if (prec) {
                const totPrec = prec.getAttribute('value');
                const timeLength = timeSerie.timeLength();
                const meanPrecipitation = totPrec > 0 ? round(totPrec/timeLength, 1) : 0;
                timeSerie.meanPrecipitation.value = meanPrecipitation;
                timeSerie.meanPrecipitation.unit = 'mm/h';
            }

            const minTemp = xmlTimeSerie.getElementsByTagName('minTemperature');
            if (minTemp && minTemp.length > 0) {
                timeSerie.minTemp = minTemp[0].getAttribute('value');
            }

            const maxTemp = xmlTimeSerie.getElementsByTagName('maxTemperature');
            if (maxTemp && maxTemp.length > 0) {
                timeSerie.maxTemp = maxTemp[0].getAttribute('value');
            }

            const symbol = xmlTimeSerie.getElementsByTagName('symbol') ? xmlTimeSerie.getElementsByTagName('symbol')[0] : null;
            if (symbol && symbol.getAttribute('number')) {
                const yrNumber = parseInt(symbol.getAttribute('number'));
                timeSerie.weatherSymbol =  YR_OLD_TO_NEW[yrNumber];

                if (timeSerie.weatherSymbol === 0) {
                    console.error('Missing mapping for YR-symbol: ' + yrNumber);
                }
            }
            

        }
        forecast.timeSerie.push(timeSerie);
    }
    forecast.sourceName = 'YR';
    return forecast;
};

const fetchYRData = (lat, lon) => {
    console.log(`FETCHING YR ${lat}:${lon}`);
    return fetchAndExtractText(YR_API.replace(PLACEHOLDER_LAT, lat).replace(PLACEHOLDER_LON, lon))
    .then(txt => { 
        let forecast = parseResponseXML(txt);
        if (forecast instanceof Forecast) {
            forecast.lon = lon;
            forecast.lat = lat;
        }
        return forecast;
    });
};

export const useYR = () => {
    const lat = useSelector(state => state.lat);
    const lon = useSelector(state => state.lon);
    const { data, isLoading, error } = useQuery(['YR',lat, lon],
     (key, lat, lon ) => fetchYRData(lat, lon),
     { 
         staleTime: 1000*60*60,
         cacheTime: 1000*60*60*72,
         enabled: lat && lon,
        });
    return {
        forecast: data,
        isLoading,
        error
    }
};

