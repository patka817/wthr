import React from 'react';
import { Typography } from '@material-ui/core';

const WICON_TEMPLATE = 'https://api.met.no/weatherapi/weathericon/1.1/?symbol={WSYMB}&is_night={NIGHT}&content_type=image/png';

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
                {viewModel ? <img src={WICON_TEMPLATE.replace('{WSYMB}', viewModel.weatherSymbol).replace('{NIGHT}', isNight)} alt='weathericon' /> : '-'}
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