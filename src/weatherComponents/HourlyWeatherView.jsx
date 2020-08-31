import React from 'react';
import SwipeableViews from 'react-swipeable-views';
import ForecastToggle from './ForecastToggle';
import { dailyDateTitle, sameDayDates } from '../Util/date';
import * as Hourly from './HourlyWeatherRow';
import { useActiveHourlyViewModels } from '../viewmodels/HourlyViewModelHook';
import { Dialog, DialogContent, DialogActions, Button, DialogTitle, Slide } from '@material-ui/core';


const LeftTransition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const UpTransition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export function HourlyWeatherModal(props) {
    const close = props.onClose;
    const activeHourlyForecastDate = props.forecastDate;
    const show = activeHourlyForecastDate != null;
    let title = activeHourlyForecastDate ? dailyDateTitle(activeHourlyForecastDate) : '';

    let allViewModels = [];
    let dates = null;
    const active = useActiveHourlyViewModels();
    if (activeHourlyForecastDate && active) {
        allViewModels = active.viewmodels;
        dates = active.dates;
    }

    let currentIndex = dates && activeHourlyForecastDate && dates.findIndex(date => sameDayDates(date, activeHourlyForecastDate));
    const onChangeIndex = (index, prevIndex, meta) => {
        let newActiveDate = dates && dates.length > index ? dates[index] : null;
        title = newActiveDate ? dailyDateTitle(newActiveDate) : "";
        document.getElementById('dialogTitleTextSection').textContent = title;
        document.getElementById('hourlyweather_dialog').scrollTo({ top: 0 });
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
            <DialogContent id="hourlyweather_dialog">
                <SwipeableViews enableMouseEvents={true} index={currentIndex >= 0 ? currentIndex : 0} onChangeIndex={onChangeIndex}>
                    {allViewModels && allViewModels.map((viewModels, idx) => (
                        <HourlyWeatherTable id={`hourlyweather_dialog_${idx}`} key={idx} hourViewModels={viewModels} />
                    ))}
                </SwipeableViews>
            </DialogContent>
            <DialogActions>
                <Button fullWidth color="primary" variant='contained' onClick={close}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

function HourlyWeatherTable(props) {
    return (
        <section id={props.id}>
            {props.hourViewModels && props.hourViewModels.map(viewModel => <Hourly.HourlyForecastRow viewModel={viewModel} key={viewModel.time} />)}
        </section>
    );
}