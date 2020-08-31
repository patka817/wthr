import React, { useState } from 'react';
import { Provider, useSelector } from 'react-redux';
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
import { NewVersionDialog } from './components/NewVersionDialog';
import { ReactQueryDevtools } from 'react-query-devtools';
import { useYR } from './api/yr';
import { useSMHI } from './api/smhi';

const AppContainer = (props) => {
  const [lastError, setLastError] = useState(null);
  const [showError, setShowError] = useState(false);
  const stateError = useSelector(state => state.error);
  const lat = useSelector(state => state.lat);
  const lon = useSelector(state => state.lon);
  const { forecast: yrForecast, isLoading, yrError } = useYR();
  const { forecast: smhiForecast, isLoadingSMHI, SMHIError } = useSMHI();

  const hasLocation = lat && lon;

  const error = stateError || yrError || SMHIError;
  const differentErrorMessages = lastError && error && lastError.message !== error.message;
  const firstError = lastError === null && error !== null && error !== undefined;
  if (firstError || differentErrorMessages) {
    setLastError(error);
    setShowError(true);
  }

  const hasForecast = smhiForecast || yrForecast;
  const loading = isLoading || isLoadingSMHI;

  let body = null;
  if (hasForecast) {
    body = [<ForecastToggle key='toggle' />, <WeatherTable key='weathertable' />];
  } else if (hasLocation && !loading) {
    body = <NoResultPage title='No forecasts found' bodyText='Check that you have internet connection or try reloading manually. If thats not working try later.' renderIcon={props => <SentimentVeryDissatisfied {...props} />} />;
  } else if (!hasLocation) {
    body = <NoResultPage title='Missing location' bodyText='Choose location by searching or using your GPS-position.' renderIcon={props => <NotListedLocation {...props} />} />;
  }

  const onClose = () => {
    setShowError(false);
  };

  return (
    <div className='App'>
      <InstallBanner />
      <AppBar />
      {body}
      <Footer />
      <Snackbar message={lastError ? lastError.message : null} onClose={onClose} autoHideDuration={3000} open={showError} />
      <NewVersionDialog />
    </div>
  );
};

const App = () => {
  return (
    <Provider store={configureStore()}>
      <AppContainer />
      <ReactQueryDevtools initialIsOpen />
    </Provider>
  );
}
export default App;
