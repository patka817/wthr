import React from 'react';
import { connect } from 'react-redux';
import * as Daily from './DailyWeatherRow';
import { YR_FORECAST, SMHI_FORECAST } from '../state/reducers';

class WeatherTablePresentational extends React.Component {
    constructor(props) {
        super(props);

        this.aggregateData = this.aggregateData.bind(this);
        this.listifyData = this.listifyData.bind(this);
        this.makeViewModels = this.makeViewModels.bind(this);
    }

    componentWillMount() {
        if (this.props.smhiForecast) {
            this.smhiViewModels = Daily.createDailyViewModels(this.props.smhiForecast);
        }
        if (this.props.yrForecast) {
            this.yrViewModels = Daily.createDailyViewModels(this.props.yrForecast);
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.smhiForecast !== this.props.smhiForecast) {
            console.log('changed smhi');
            this.smhiViewModels = Daily.createDailyViewModels(nextProps.smhiForecast);
        }
        if (nextProps.yrForecast !== this.props.yrForecast) {
            console.log('changed yr');
            this.yrViewModels = Daily.createDailyViewModels(nextProps.yrForecast);
        }
    }

    aggregateData() {
        let data = null;
        if (this.props.smhiForecast) {
            data = {};
            this.props.smhiForecast.timeSerie.forEach(val => {
                if (!data[val.startTime]) {
                    data[val.startTime] = {
                        time: val.startTime,
                        smhi: [val]
                    };
                } else {
                    data[val.startTime].smhi.push(val);
                }
            });
        }
        if (this.props.yrForecast) {
            data = data ? data : {};
            this.props.yrForecast.timeSerie.forEach(val => {
                let entry = data[val.startTime];
                if (!entry) {
                    entry = {
                        time: val.startTime,
                        yr: [val]
                    }
                    data[val.startTime] = entry;
                } else {
                    if (!entry.yr) {
                        entry.yr = [];
                    }
                    entry.yr.push(val);
                }
            });
        }
        return data;
    }

    makeViewModels(data) {
        if (!data) {
            return null;
        }
        let res = {};
        for (let time in data) {
            let entry = data[time];
            const dateTime = new Date(time);
            const smhi = convertTimeSerieToHourlyViewModel(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate(), dateTime.getHours(), entry.smhi);
            const yr = convertTimeSerieToHourlyViewModel(dateTime.getFullYear(), dateTime.getMonth(), dateTime.getDate(), dateTime.getHours(), entry.yr);
            res[time] = { smhi, yr };
        }
        return res;
    }

    listifyData() {
        // const data = this.makeViewModels(this.aggregateData());
        // if (!data) {
        //     return null;
        // }
        let viewModels = [];
        if (this.props.activeForecast === SMHI_FORECAST && this.smhiViewModels) {
            viewModels = this.smhiViewModels;
        } else if (this.props.activeForecast === YR_FORECAST && this.yrViewModels) {
            viewModels = this.yrViewModels;
        }
        let res = viewModels.map(el => <Daily.DailyWeatherRow key={el.date} viewModel={el} />);
        if (res.length > 0) {
            res.unshift([<Daily.DailyHeaderRow key='headerrow' />]);
        }
        
        // let res = [];
        // for (let time in data) {
            // let entry = data[time];
            //res.push(<HourlyWeatherCard key={time} smhi={entry.smhi} yr={entry.yr} time={time} />);
        // }
        return res;
    }

    render() {
        const listitems = this.listifyData();
        return (
            <div className='weathertable'>
                {listitems ? listitems : <p>Missing items</p>}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        yrForecast: state.yrForecast,
        smhiForecast: state.smhiForecast,
        activeForecast: state.activeForecast
    };
};

const WeatherTable = connect(mapStateToProps, null)(WeatherTablePresentational);
export default WeatherTable;

// TODO: refactor to seperate files

// HOURLY

const ONE_DAY = 1000 * 60 * 60 * 24;
const validHourlyTime = (soughtDate, time) => {
    if (Math.abs(soughtDate.getTime() - time.startTime.getTime()) > 0) {
        return false;
    } else if (Math.abs(soughtDate.getTime() - time.endTime.getTime()) > ONE_DAY) {
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
    return viewModel;
};

const firstInstantTime = (timeSerie) => {
    if (timeSerie === null || !timeSerie) {
        return null;
    }
    return timeSerie.find(x => x.isInstant());
};

// {`${startTime.toLocaleString('en-us', { weekday: 'long'})} , ${startTime.toLocaleString('en-us', { month: 'long', day: 'numeric' })}`}