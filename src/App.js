import React from 'react';
import { Provider, connect } from 'react-redux';
import './App.css';
import configureStore from './state/store';
import InstallBanner from './components/InstallBanner';
import WeatherTable from './weatherComponents/weatherTable';
import AppBar from './components/appBar';
import ForecastToggle from './weatherComponents/ForecastToggle';
import { Snackbar } from '@material-ui/core';
import { NotListedLocation, SentimentVeryDissatisfied } from '@material-ui/icons';
import Footer from './components/Footer';
import NoResultPage from './components/NoResult';

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

  componentWillReceiveProps(newProps) {
    if (this.props.error !== newProps.error && newProps.error) {
      this.setState({ showError: true })
    }
  }

  render() {
    let body = null;
    if (this.props.hasForecast) {
      body = [<ForecastToggle key='toggle' />, <WeatherTable key='weathertable' />];
    } else if (this.props.hasLocation && !this.props.loading) {
      body = <NoResultPage title='No forecasts found' bodyText='Check that you have internet connection or try reloading manually. If thats not working try later.' renderIcon={props => <SentimentVeryDissatisfied {...props} />} />;
    } else if (!this.props.hasLocation) {
      body = <NoResultPage title='Missing location' bodyText='Choose location by searching or using your GPS-position.' renderIcon={props => <NotListedLocation {...props} />} />;
    }
    
    return (
      <div className='App'>
        <InstallBanner />
        <AppBar />
        {body}
        <Footer />
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
    hasLocation: state.lat && state.lon,
    loading: (state.loading || state.refreshing)
  };
};

const AppContainer = connect(mapStateToProps, null)(AppPresentational);

const App = () => {
  return (
    <Provider store={configureStore()}>
      <AppContainer />
    </Provider>
  );
}
export default App;
