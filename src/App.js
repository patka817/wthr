import React from 'react';
import { Provider, connect } from 'react-redux';
import './App.css';
import configureStore from './state/store';
import { refreshData } from './state/actions'

import WeatherTable from './weatherComponents/weatherTable';
import AppBar from './components/appBar';
import ForecastToggle from './weatherComponents/ForecastToggle';
import { Snackbar } from '@material-ui/core';

const THREE_HOURS = 1000 * 60 * 60 * 3;

class AppPresentational extends React.Component {
  constructor(props) {
    super(props);
    this.closeSnackbar = this.closeSnackbar.bind(this);
    this.state = {
      showError: false
    };
  }

  closeSnackbar(event, reason) {
    this.setState({ showError: false })
  }

  componentDidMount() {
    if (this.props.hasLocation) {
      const now = new Date();
      if (!this.props.lastUpdate || now.getTime() - this.props.lastUpdate.getTime() > THREE_HOURS) {
        console.log('found stale data');
        this.props.refreshData();
      }
    }
  }

  componentWillReceiveProps(newProps) {
    if (this.props.error !== newProps.error && newProps.error) {
      this.setState({ showError: true })
    }
  }

  render() {
    // TODO: show some info when we haven't got any forecast
    const forecastComps = this.props.hasForecast ? [<ForecastToggle key='toggle' />
      , <WeatherTable key='weathertable' />] : null;
    return (
      <div className='App'>
        <AppBar />
        {forecastComps}
        <Snackbar message={this.props.error ? this.props.error.message : null} onClose={this.closeSnackbar} autoHideDuration={3000} open={this.state.showError} />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    hasForecast: (state.yrForecast || state.smhiForecast),
    yrApprovedTime: state.yrForecast ? state.yrForecast.approvedTime : null,
    smhiApprovedTime: state.smhiForecast ? state.smhiForecast.approvedTime : null,
    error: state.error,
    lastUpdate: state.lastUpdate,
    hasLocation: state.lat && state.lon
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    refreshData: () => { dispatch(refreshData()); }
  };
};

const AppContainer = connect(mapStateToProps, mapDispatchToProps)(AppPresentational);

const App = () => {
  return (
    <Provider store={configureStore()}>
      <AppContainer />
    </Provider>
  );
}
export default App;
