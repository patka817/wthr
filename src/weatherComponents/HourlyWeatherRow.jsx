import React from 'react';
import { Typography } from '@material-ui/core';
import getIcon from '../icons/WeatherIcons';

export const HourlyForecastRow = (props) => {
    const viewModel = props.viewModel;
    const isNight = viewModel.time.getHours() > 21 || viewModel.time.getHours() < 6 ? 1 : 0;
    let startTime = viewModel.time;
    if (typeof (startTime) === 'string') {
        startTime = new Date(startTime);
    }

    const variant = 'body1';
    return (
        <section className='hourlyForecastRow'>
            <Typography className='hour-container' variant={variant}>
                {startTime.toLocaleString(navigator.language, { hour: '2-digit', hour12: false })}
            </Typography>
            <Typography className='forecastrow-temp-container red-color' variant={variant}>
                {viewModel ? `${viewModel.temp}°` : '-'}
            </Typography>
            <Typography className='forecastrow-symbol-container' variant={variant}>
                {viewModel ? getIcon(viewModel.weatherSymbol, isNight ? false : true) : '-'}
            </Typography>
            <Typography className='forecastrow-wind-container' variant={variant}>
                {viewModel ? `${viewModel.windspeed} (${viewModel.gust !== null ? viewModel.gust : '-'}) m/s` : '-'}
            </Typography>
            <Typography className='forecastrow-precipitation-container' variant={variant}>
                {viewModel ? <span><span className='blue-color'>{`${viewModel.precipitation}`}</span> mm/h</span> : '-'}
            </Typography>
        </section>
    );
};