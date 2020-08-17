import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import ForecastToggle from './ForecastToggle';
import { dailyDateTitle, addDays, sameDayDates } from '../Util/date';
import * as Hourly from './HourlyWeatherRow';
import { SMHI_FORECAST } from '../state/reducers';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogContent, DialogActions, Button, DialogTitle, Slide } from '@material-ui/core';
import { showHourlyForecast } from '../state/actions';
import { FORECAST_LIMIT } from './DailyWeatherRow';

const LeftTransition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const UpTransition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function allValidHourlyViewModels(forecast) {
    console.log('generating new viewmodels');
    if (!forecast) {
        return [[], []];
    }
    let res = [];
    let dates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < FORECAST_LIMIT; i++) {
        let date = addDays(today, i);
        let viewModels = Hourly.createHourlyViewModels(forecast, date);
        if (viewModels.length > 0) {
            res.push(viewModels);
            dates.push(date);
        }
    }
    return [res, dates];
}

export function HourlyWeatherModal(props) {
    const activeHourlyForecastDate = useSelector(state => state.activeHourlyForecastDate);
    const activeForecastId = useSelector(state => state.activeForecast);
    const smhiForecast = useSelector(state => state.smhiForecast);
    const yrForecast = useSelector(state => state.yrForecast);
    const dispatch = useDispatch();
    const close = () => dispatch(showHourlyForecast(null));

    const show = activeHourlyForecastDate != null;
    let title = activeHourlyForecastDate ? dailyDateTitle(activeHourlyForecastDate) : '';

    const activeForecast = activeForecastId === SMHI_FORECAST ? smhiForecast : yrForecast;
    let allViewModels = [];
    let dates = null;
    if (activeForecast && activeHourlyForecastDate) {
        [allViewModels, dates] = allValidHourlyViewModels(activeForecast);
    }
    let currentIndex = dates && activeHourlyForecastDate && dates.findIndex(date => sameDayDates(date, activeHourlyForecastDate));
    const onChangeIndex = (index) => {
        let newActiveDate = dates && dates.length > index ? dates[index] : null;
        title = newActiveDate ? dailyDateTitle(newActiveDate) : "";
        document.getElementById('dialogTitleTextSection').textContent = title;
        window.scrollTo({ top: 0 });
    };

    return (
        <Dialog fullScreen={props.fullScreen} open={show ? true : false} onClose={close} TransitionComponent={props.fullScreen ? LeftTransition : UpTransition}>
            <DialogTitle style={{ backgroundColor: '#3f51b5', color: 'white' }}>
                <section id="dialogTitleTextSection">
                    {title}
                </section>
            </DialogTitle>
            <section style={{ display: 'flex', alignContent: 'center', justifyContent: 'center', backgroundColor: 'transparent', position: 'sticky', top: '-0.75rem' }}>
                <ForecastToggle />
            </section>
            <DialogContent>
                <SwipeableViews enableMouseEvents={true} index={currentIndex >= 0 ? currentIndex : 0} onChangeIndex={onChangeIndex}>
                    {allViewModels && allViewModels.map((viewModels, idx) => (
                        <HourlyWeatherTable key={idx} hourViewModels={viewModels} />
                    ))}
                </SwipeableViews>
            </DialogContent>
            <DialogActions>
                <Button fullWidth variant='contained' onClick={close}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

function HourlyWeatherTable(props) {
    return (
        <>
            {props.hourViewModels && props.hourViewModels.map(viewModel => <Hourly.HourlyForecastRow viewModel={viewModel} key={viewModel.time} />)}
        </>
    );
}