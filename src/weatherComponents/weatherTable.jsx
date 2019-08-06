import React from 'react';
import { connect } from 'react-redux';
import * as Daily from './DailyWeatherRow';
import * as Hourly from './HourlyWeatherRow';
import { YR_FORECAST, SMHI_FORECAST } from '../state/reducers';
import { Dialog, DialogContent, DialogActions, Button, DialogTitle, Typography } from '@material-ui/core';

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
            console.log('changed smhi');
            this.smhiViewModels = Daily.createDailyViewModels(nextProps.smhiForecast);
        }
        if (nextProps.yrForecast !== this.props.yrForecast) {
            console.log('changed yr');
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
        console.log('show ' + date);
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
            console.log('Failed to show hourly forecast');
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

        return (
            <>
                <div className='weathertable'>
                    <Footer approvedTime={this.activeForecast() ? this.activeForecast().approvedTime : null} />
                    {listitems ? listitems : <p>Missing items</p>}
                </div>
                <Dialog fullScreen={window.innerWidth < 500 ? true : false} open={this.state.showHourViewDate ? true : false} onClose={this.closeHourView}>
                    <DialogTitle>
                        {this.state.showHourViewDate ? Daily.dailyDateTitle(this.state.showHourViewDate) : ''}
                    </DialogTitle>
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

const Footer = (props) => {
    if (props.approvedTime) {
        return (
            <Typography  variant='body2'>
                Forecast issued {props.approvedTime.toLocaleString(navigator.language, { hour12: false, hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'long' })}
            </Typography>
        );
    } else {
        return null;
    }
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

// {`${startTime.toLocaleString('en-us', { weekday: 'long'})} , ${startTime.toLocaleString('en-us', { month: 'long', day: 'numeric' })}`}