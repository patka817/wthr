import React from 'react';
import { connect } from 'react-redux';
import * as Daily from './DailyWeatherRow';
import { YR_FORECAST, SMHI_FORECAST } from '../state/reducers';
import Issued from './Issued';
import { refreshData } from '../state/actions';
import { HourlyWeatherModal } from './HourlyWeatherView';

class WeatherTablePresentational extends React.Component {
    constructor(props) {
        super(props);
        this.activeForecast = this.activeForecast.bind(this);
        this.listifyData = this.listifyData.bind(this);
        this.showHourView = this.showHourView.bind(this);
        this.state = {
            forecastDate: null
        };
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
        this.setState({
            ...this.state,
            forecastDate: date
        });
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

    render() {
        const listitems = this.listifyData();
        const fullScreen = showFullscreenDialog();
        return (
            <>
                <section className='weathertable' >
                    <Issued approvedTime={this.activeForecast() ? this.activeForecast().approvedTime : null} />
                    {listitems ? listitems : <p>Missing items</p>}
                </section>
                <HourlyWeatherModal onClose={ () => { this.showHourView(null); } } forecastDate={this.activeForecast() && this.state.forecastDate} fullScreen={fullScreen} />
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

const mapDispatchToProps = dispatch => {
    return {
        refreshForecast: () => { dispatch(refreshData()); }
    };
};

const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        yrForecast: state.yrForecast,
        smhiForecast: state.smhiForecast,
        activeForecast: state.activeForecast,
        locatingGPS: state.locatingGPS,
        refreshing: state.refreshing
    };
};

const WeatherTable = connect(mapStateToProps, mapDispatchToProps)(WeatherTablePresentational);
export default WeatherTable;
