import React from 'react';
import { Provider } from 'react-redux';
import './App.css';
import configureStore from './state/store';

import GPSButton from './positionComponents/gpsButton';
import WeatherTable from './weatherComponents/weatherTable';
import ReloadDataButton from './weatherComponents/reloadDataButton';

class App extends React.Component {
  render() {
    return (
      <Provider store={configureStore()}>
        <div className="App">
          <GPSButton />
          <ReloadDataButton />
          <WeatherTable />
        </div>
      </Provider>
    );
  }
}

export default App;
