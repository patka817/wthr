const ONE_HOUR = 1000 * 60 * 60;

// The same mapping as SMHI
export const WeatherSymbolMap = {
    1: `Clear sky`,
    2: `Nearly clear sky`,
    3: `Variable cloudiness`,
    4: `Halfclear sky`,
    5: `Cloudy sky`,
    6: `Overcast`,
    7: `Fog`,
    8: `Light rain showers`,
    9: `Moderate rain showers`,
    10: `Heavy rain showers`,
    11: `Thunderstorm`,
    12: `Light sleet showers`,
    13: `Moderate sleet showers`,
    14: `Heavy sleet showers`,
    15: `Light snow showers`,
    16: `Moderate snow showers`,
    17: `Heavy snow showers`,
    18: `Light rain`,
    19: `Moderate rain`,
    20: `Heavy rain`,
    21: `Thunder`,
    22: `Light sleet`,
    23: `Moderate sleet`,
    24: `Heavy sleet`,
    25: `Light snowfall`,
    26: `Moderate snowfall`,
    27: `Heavy snowfall`,
};

export class Parameter {
    constructor(value = null, unit = null) {
        this.value = value;
        this.unit = unit;
    }
};

export class Time {
    endTime;
    startTime;
    weatherSymbol;
    windDirection;
    windSpeed;
    temp;
    gust;
    meanPrecipitation;
    minTemp;
    maxTemp;

    constructor(data) {
        // Instantanious
        this.temp = new Parameter();
        this.windDirection = new Parameter();
        this.windSpeed = new Parameter();
        this.gust = new Parameter();

        this.weatherSymbol = 0;
        this.meanPrecipitation = new Parameter();

        this.isInstant = this.isInstant.bind(this);
        this.timeLength = this.timeLength.bind(this);

        if (typeof (data) === 'object') {
            Object.assign(this, data);
        }
    }

    isInstant() {
        return this.startTime && this.endTime && ((this.endTime.getTime() - this.startTime.getTime()) === 0);
    }


    timeLength() {
        if (!this.startTime || !this.endTime) {
            return undefined;
        }
        return Math.round((this.endTime - this.startTime) / (ONE_HOUR));
    }
};

export class Forecast {
    sourceName;
    approvedTime;
    timeSerie;

    constructor(data) {
        this.approvedTime = null;
        this.timeSerie = [];
        this.sourceName = 'unknown';

        if (data) {
            Object.assign(this, data);
        }
    }

    timeserieFilteredByDay(soughtDayDate) {
        let res = [];
        for (let timeIndex in this.timeSerie) {
            const time = this.timeSerie[timeIndex];
            if (sameDayDates(soughtDayDate, time.startTime) ||
                sameDayDates(soughtDayDate, time.endTime)) {
                res.push(time);
            }
        }
        return res;
    }

}

const sameDayDates = (date1, date2) => {
    if (date1.getDate() !== date2.getDate()) {
        return false;
    } else if (date1.getMonth() !== date2.getMonth()) {
        return false;
    } else if (date1.getFullYear() !== date2.getFullYear()) {
        return false;
    }
    return true;
};