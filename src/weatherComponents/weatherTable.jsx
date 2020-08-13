import React from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import * as Daily from './DailyWeatherRow';
import * as Hourly from './HourlyWeatherRow';
import { YR_FORECAST, SMHI_FORECAST } from '../state/reducers';
import { Dialog, DialogContent, DialogActions, Button, DialogTitle } from '@material-ui/core';
import Issued from './Issued';
import ForecastToggle from './ForecastToggle';
import { dailyDateTitle } from '../Util/date';
import { showHourlyForecast, refreshData, nextHourlyForecast, prevHourlyForecast } from '../state/actions';
import { useSwipeable } from 'react-swipeable';

class WeatherTablePresentational extends React.Component {
    constructor(props) {
        super(props);
        this.activeForecast = this.activeForecast.bind(this);
        this.listifyData = this.listifyData.bind(this);
        this.showHourView = this.showHourView.bind(this);
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
            this.smhiViewModels = Daily.createDailyViewModels(nextProps.smhiForecast);
        }
        if (nextProps.yrForecast !== this.props.yrForecast) {
            this.yrViewModels = Daily.createDailyViewModels(nextProps.yrForecast);
        }
    }

    listifyData() {
        let viewModels = [];
        if (this.props.activeForecast === SMHI_FORECAST && this.smhiViewModels) {
            viewModels = this.smhiViewModels;
        } else if (this.props.activeForecast === YR_FORECAST && this.yrViewModels) {
            viewModels = this.yrViewModels;
        }
        let res = viewModels.map(el => <Daily.DailyWeatherRow key={el.date} viewModel={el} onClick={() => { this.showHourView(el.date) }} />);
        if (res.length > 0) {
            res.unshift([<Daily.DailyHeaderRow key='headerrow' />]);
        }

        return res;
    }

    showHourView(date) {
        this.props.showHourlyForecast(date);
    }

    // TODO: make a hook that gets active forecast
    activeForecast() {
        let forecast = null;
        if (this.props.activeForecast === SMHI_FORECAST) {
            forecast = this.props.smhiForecast;
        } else if (this.props.activeForecast === YR_FORECAST) {
            forecast = this.props.yrForecast;
        }
        return forecast;
    }

    onSwipedDown = (data) => {
        if (this.props.loading || this.props.refreshing || this.props.locatingGPS) {
            return;
        }
        console.log(data);
        this.props.refreshForecast();
    }

    render() {
        const listitems = this.listifyData();
        const fullScreen = showFullscreenDialog();
        const swipeDelta = window.screen.availHeight / 4;
        const preventTouchMovement = document.body.scrollTop === 0;

        return (
            <>
                <section className='weathertable' >
                    <Issued approvedTime={this.activeForecast() ? this.activeForecast().approvedTime : null} />
                    {listitems ? listitems : <p>Missing items</p>}
                </section>
                <HourlyWeatherModal fullScreen={fullScreen} />
            </>
        );
    }
}

function HourlyWeatherModal(props) {
    const activeHourlyForecastDate = useSelector(state => state.activeHourlyForecastDate);
    const activeForecastId = useSelector(state => state.activeForecast);
    const smhiForecast = useSelector(state => state.smhiForecast);
    const yrForecast = useSelector(state => state.yrForecast);
    const dispatch = useDispatch();
    // todo: add next/prev hourly actions and put logic inside reducer.
    const handlers = useSwipeable({
        onSwipedLeft: () => dispatch(nextHourlyForecast()),
        onSwipedRight: () => dispatch(prevHourlyForecast()),
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    });
    const close = () => dispatch(showHourlyForecast(null));

    const show = activeHourlyForecastDate != null;
    const title = activeHourlyForecastDate ? dailyDateTitle(activeHourlyForecastDate) : '';

    const activeForecast = activeForecastId === SMHI_FORECAST ? smhiForecast : yrForecast;
    let hourViewModels = null;
    if (activeForecast && activeHourlyForecastDate) {
        hourViewModels = Hourly.createHourlyViewModels(activeForecast, activeHourlyForecastDate);
    }

    return (
        <Dialog fullScreen={props.fullScreen} open={show ? true : false} onClose={close}>
            <DialogTitle style={{ backgroundColor: '#3f51b5', color: 'white' }}>
                {title}
            </DialogTitle>
            <DialogContent {...handlers}>
                <section style={{ display: 'flex', alignContent: 'center', justifyContent: 'center', backgroundColor: 'transparent', position: 'sticky', top: '-0.75rem' }}>
                    <ForecastToggle />
                </section>
                {hourViewModels && hourViewModels.map(viewModel => <Hourly.HourlyForecastRow viewModel={viewModel} key={viewModel.time} />)}
            </DialogContent>
            <DialogActions>
                <Button fullWidth variant='contained' onClick={close}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

const showFullscreenDialog = () => {
    if (window.innerWidth < 500) {
        return true;
    } else if (window.innerHeight < 500) {
        return true;
    }
    return false;
};

const mapDispatchToProps = dispatch => {
    return {
        showHourlyForecast: (date) => dispatch(showHourlyForecast(date)),
        refreshForecast: () => { dispatch(refreshData()); }
    };
};

const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        yrForecast: state.yrForecast,
        smhiForecast: state.smhiForecast,
        activeForecast: state.activeForecast,
        activeHourlyForecastDate: state.activeHourlyForecastDate,
        locatingGPS: state.locatingGPS,
        refreshing: state.refreshing
    };
};

const WeatherTable = connect(mapStateToProps, mapDispatchToProps)(WeatherTablePresentational);
export default WeatherTable;
