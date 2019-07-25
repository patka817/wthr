import React from 'react';
import { Provider, connect } from 'react-redux';
import './App.css';
import configureStore from './state/store';
import { fetchData } from './state/actions'

import WeatherTable from './weatherComponents/weatherTable';
import AppBar from './components/appBar';
import ForecastToggle from './weatherComponents/ForecastToggle';

const THREE_HOURS = 1000 * 60 * 60 * 24 * 3;

class AppPresentational extends React.Component {

  componentDidMount() {
    const now = new Date();
    const timesToCheck = [this.props.yrApprovedTime, this.props.smhiApprovedTime];
    console.log('times to check:');
    console.log(timesToCheck);
    const found = timesToCheck.find(x => {
      if (x !== null && (now.getTime() - x.getTime()) > THREE_HOURS) {
        return true;
      }
      return false;
    });
    
    if (found !== undefined) {
      console.log('found stale data');
      console.log(found);
      this.props.fetchData();
    }
  }

  render() {
    return (
        <div className='App'>
          <AppBar />
          <ForecastToggle />
          {/* What if we get an error or don't have data? error -> show has 'toast', no data -> no weather table.. */}
          <WeatherTable />
          {/* Show as a modal or toast or whatever */}
          { this.props.errorMessage && <p>{this.props.errorMessage}</p>}
        </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    yrApprovedTime: state.yrForecast ? state.yrForecast.approvedTime : null,
    smhiApprovedTime: state.smhiForecast ? state.smhiForecast.approvedTime : null,
    errorMessage: state.errorMessage
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    fetchData: () => { dispatch(fetchData()); }
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
