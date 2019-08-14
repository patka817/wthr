import React from 'react';
import { connect } from 'react-redux';
import * as Daily from './DailyWeatherRow';
import * as Hourly from './HourlyWeatherRow';
import { YR_FORECAST, SMHI_FORECAST } from '../state/reducers';
import { Dialog, DialogContent, DialogActions, Button, DialogTitle } from '@material-ui/core';
import Issued from './Issued';
import ForecastToggle from './ForecastToggle';
import { dailyDateTitle } from '../Util/date';

class WeatherTablePresentational extends React.Component {
    constructor(props) {
        super(props);
        this.activeForecast = this.activeForecast.bind(this);
        this.listifyData = this.listifyData.bind(this);
        this.showHourView = this.showHourView.bind(this);
        this.closeHourView = this.closeHourView.bind(this);
        this.state = {
            showHourViewDate: null
        }
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
        this.setState({ showHourViewDate: date });
    }

    closeHourView() {
        this.setState({ showHourViewDate: null });
    }

    hourlyViewModels() {
        if (!this.state.showHourViewDate) {
            return null;
        }
        const forecast = this.activeForecast();
        if (forecast) {
            return Hourly.createHourlyViewModels(forecast, this.state.showHourViewDate);
        } else {
            // TODO: dispatch error?!
            console.error('Failed to show hourly forecast');
        }

        return null;
    }

    activeForecast() {
        let forecast = null;
        if (this.props.activeForecast === SMHI_FORECAST) {
            forecast = this.props.smhiForecast;
        } else if (this.props.activeForecast === YR_FORECAST) {
            forecast = this.props.yrForecast;
        }
        return forecast;
    }

    render() {
        const listitems = this.listifyData();
        let hourViewModels = this.hourlyViewModels();
        const fullScreen = showFullscreenDialog();

        return (
            <>
                <section className='weathertable'>
                    <Issued approvedTime={this.activeForecast() ? this.activeForecast().approvedTime : null} />
                    {listitems ? listitems : <p>Missing items</p>}
                </section>
                <Dialog fullScreen={fullScreen} open={this.state.showHourViewDate ? true : false} onClose={this.closeHourView}>
                    <DialogTitle style={{ backgroundColor: '#3f51b5', color: 'white' }}>
                        {this.state.showHourViewDate ? dailyDateTitle(this.state.showHourViewDate) : ''}
                    </DialogTitle>
                    <section style={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
                        <ForecastToggle />
                    </section>
                    <DialogContent>
                        {hourViewModels && hourViewModels.map(viewModel => <Hourly.HourlyForecastRow viewModel={viewModel} key={viewModel.time} />)}
                    </DialogContent>
                    <DialogActions>
                        <Button fullWidth variant='contained' onClick={this.closeHourView}>Close</Button>
                    </DialogActions>
                </Dialog>
            </>
        );
    }
}

const showFullscreenDialog = () => {
    if (window.innerWidth < 500) {
        return true;
    } else if (window.innerHeight < 500) {
        return true;
    }
    return false;
};

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
