import React from 'react';
import { Paper, Typography } from '@material-ui/core';
import { ChevronRight } from '@material-ui/icons';
import { dailyDateTitle } from '../Util/date';
import getIcon from '../icons/WeatherIcons.jsx';
 
export const DailyHeaderRow = (props) => {
    return (
        <section className="day-weather-row day-weather-row-header">
            <div className='day-weather-row-night-icon day-weather-header'>Night</div>
            <div className='day-weather-row-morning-icon day-weather-header'>Morning</div>
            <div className='day-weather-row-afternoon-icon day-weather-header'>Afternoon</div>
            <div className='day-weather-row-evening-icon day-weather-header'>Evening</div>
            <div className='day-weather-row-low day-weather-header'>L</div>
            <div className='day-weather-row-high day-weather-header'>H</div>
            <div className='day-weather-row-prec day-weather-header'>Precip.</div>
            <div className='day-weather-row-wind day-weather-header'>Wind (m/s)</div>
        </section>
    );
};

export const DailyWeatherRow = (props) => {
    let date = props.viewModel.date;
    const dateString = dailyDateTitle(date);    
    return (
        <button className='transparent-button' onClick={props.onClick}>
            <Paper className="day-weather-row">
                <div className='day-weather-row-date daily-font'>{dateString}</div>
                {props.viewModel.nightSymbol !== undefined && props.viewModel.nightSymbol !== 0 ? <WeatherIcon isDay={false} symbol={props.viewModel.nightSymbol} className="w-icon day-weather-row-night-icon" alt='icon' /> : null}
                {props.viewModel.morningSymbol !== undefined && props.viewModel.morningSymbol !== 0 ? <WeatherIcon isDay={true} symbol={props.viewModel.morningSymbol} className="w-icon day-weather-row-morning-icon" alt='icon of current weather in the morning' /> : null}
                {props.viewModel.afternoonSymbol !== undefined && props.viewModel.afternoonSymbol !== 0 ? <WeatherIcon isDay={true} symbol={props.viewModel.afternoonSymbol} className="w-icon day-weather-row-afternoon-icon" alt='icon of current weather in the afternoon' /> : null}
                {props.viewModel.eveningSymbol !== undefined && props.viewModel.eveningSymbol !== 0 ? <WeatherIcon isDay={true} symbol={props.viewModel.eveningSymbol} className="w-icon day-weather-row-evening-icon" alt='icon of current weather in the evening' /> : null}
                <Typography className='day-weather-row-low' variant='body1'>{`${props.viewModel.minTemp}°`}</Typography>
                <Typography className='day-weather-row-high' variant='body1'>{`${props.viewModel.maxTemp}°`}</Typography>
                <Typography className='day-weather-row-prec' variant='body1'>{props.viewModel.precipitation !== undefined ? props.viewModel.precipitation : '-'}</Typography>
                <Typography className='day-weather-row-wind' variant='body1'>{`${props.viewModel.maxWind}`}</Typography>
                <ChevronRight className='day-weather-row-chevron' />
            </Paper>
        </button>
    );
};

const WeatherIcon = (props) => {
    return (
        getIcon(props.symbol, props.isDay)
    );
}