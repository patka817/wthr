const HOURS_IN_A_DAY = 24;

export const createHourlyViewModels = (forecast, dayDate) => {
    const startHour = sameDayDates(new Date(), dayDate) ? ((new Date()).getHours() +1 ) : 0; // +1 to get next, e.g. if it's 7.30 -> 8. YR shows null-values otherwise
    let dayTimes = forecast.timeserieFilteredByDay(dayDate);
    const source = forecast.sourceName;
    let models = [];
    for (let hour = startHour; hour < HOURS_IN_A_DAY; hour++) {
        let viewModel = convertTimeSerieToHourlyViewModel(dayDate.getFullYear(), dayDate.getMonth(), dayDate.getDate(), hour, dayTimes);
        if (viewModel) {
            viewModel.source = source;
            models.push(viewModel);
        }
    }
    return models;
};

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

const convertTimeSerieToHourlyViewModel = (year, month, dayInMonth, hourInDay, timeSerie) => {
    if (!timeSerie) {
        return null;
    }
    // Instant for instant values, e.g. temp 
    // mean-values (precipitation) for the upcoming hour (e.g. the time must start this hour)
    const soughtDate = new Date(year, month, dayInMonth, hourInDay);
    const hourTimes = timeSerie.filter(x => validHourlyTime(soughtDate, x));
    if (hourTimes.length === 0) {
        return null;
    }
    const instant = firstInstantTime(hourTimes);
    const wSymbolHolder = hourTimes.find(x => x.weatherSymbol && x.weatherSymbol !== 0);
    const wSymbol = wSymbolHolder ? wSymbolHolder.weatherSymbol : 0;
    let precHolder = hourTimes.find(x => x.meanPrecipitation.value !== null);
    const prec = precHolder && precHolder.meanPrecipitation ? precHolder.meanPrecipitation.value : null;

    let viewModel = {
        time: soughtDate,
        weatherSymbol: wSymbol,
        precipitation: prec
    };

    const INST_KEYS = {
        'temp': 'temp',
        'windspeed': 'windSpeed',
        'windDirection': 'windDirection',
        'gust': 'gust',
    };
    for (let viewKey in INST_KEYS) {
        let modelKey = INST_KEYS[viewKey];
        viewModel[viewKey] = instant && instant[modelKey] ? instant[modelKey].value : null;
    }
    if (viewModel.temp != null) {
        viewModel.temp = Math.round(viewModel.temp);
    }
    return viewModel;
};

const ONE_DAY = 1000 * 60 * 60 * 24;
const validHourlyTime = (soughtDate, time) => {
    if (Math.abs(soughtDate.getTime() - time.startTime.getTime()) > 0) {
        return false;
    } else if (Math.abs(soughtDate.getTime() - time.endTime.getTime()) > ONE_DAY) {
        return false;
    }
    return true;
};

const firstInstantTime = (timeSerie) => {
    if (timeSerie === null || !timeSerie) {
        return null;
    }
    return timeSerie.find(x => x.isInstant());
};