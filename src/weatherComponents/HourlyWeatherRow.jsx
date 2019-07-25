import React from 'react';
import { Paper, Typography } from '@material-ui/core';

export const HourlyForecastRow = (props) => {
    const forecast = props.forecast; // it is the viewModel, NOT the Forecast class....
    return (
        <div className='hourlyForecastRow'>
            <Typography className='forecastrow-sourcename-container' variant='h5'>
                {props.source ? `${props.source}` : '-'}
            </Typography>
            <Typography className='forecastrow-temp-container' variant='h5'>
                {forecast ? `${forecast.temp}°` : '-'}
            </Typography>
            <Typography className='forecastrow-symbol-container' variant='h5'>
                {forecast ? forecast.weatherSymbol : '-'}
            </Typography>
            <Typography className='forecastrow-wind-container' variant='h5'>
                {forecast ? `${forecast.windspeed} (${forecast.gust}) m/s` : '-'}
            </Typography>
            <Typography className='forecastrow-precipitation-container' variant='h5'>
                {forecast ? `${forecast.precipitation} mm/h` : '-'}
            </Typography>
        </div>
    );
};

export const HourlyWeatherCard = (props) => {
    const smhi = props.smhi;
    const yr = props.yr;
    let startTime = props.time;
    if (typeof (startTime) === 'string') {
        startTime = new Date(startTime);
    }

    return (
        <Paper className='hourlyWeatherCard'>
            <Typography className='hour-container' variant='h5'>
                kl. {startTime.toLocaleString('sv-se', { hour: '2-digit' })}
            </Typography>
            <div className='forecast-row-container'>
                <HourlyForecastRow forecast={smhi} source='SMHI' />
                <HourlyForecastRow forecast={yr} source='YR' />
            </div>
        </Paper>
    );
};