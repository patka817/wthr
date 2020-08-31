import React from 'react';
import { useSelector } from 'react-redux';
import { useDailyViewModels } from '../viewmodels/DailyViewModelHook';
import { DailyHeaderRow, DailyWeatherRow } from './DailyWeatherRow';
import { YR_FORECAST, SMHI_FORECAST } from '../state/reducers';
import Issued from './Issued';
import { HourlyWeatherModal } from './HourlyWeatherView';
import { useState } from 'react';
import { useYR } from '../api/yr';
import { useSMHI } from '../api/smhi';

function listifyData(activeForecast, smhiViewModels, yrViewModels, onShowHourView) {
    let viewModels = [];
    if (activeForecast === SMHI_FORECAST && smhiViewModels) {
        viewModels = smhiViewModels;
    } else if (activeForecast === YR_FORECAST && yrViewModels) {
        viewModels = yrViewModels;
    }
    let res = viewModels.map(el => <DailyWeatherRow key={el.date} viewModel={el} onClick={() => { onShowHourView(el.date) }} />);
    if (res.length > 0) {
        res.unshift([<DailyHeaderRow key='headerrow' />]);
    }

    return res;
}

function resolveForecast(activeForecast, smhiForecast, yrForecast) {
    let forecast = null;
    if (activeForecast === SMHI_FORECAST) {
        forecast = smhiForecast;
    } else if (activeForecast === YR_FORECAST) {
        forecast = yrForecast;
    }
    return forecast;
}

const showFullscreenDialog = () => {
    if (window.innerWidth < 500) {
        return true;
    } else if (window.innerHeight < 500) {
        return true;
    }
    return false;
};

function WeatherTable(props) {
    const [forecastDate, setForecastDate] = useState(null);
    const { forecast: yrForecast } = useYR();
    const { forecast: smhiForecast } = useSMHI();
    const activeForecast = useSelector(state => state.activeForecast);
    const { yrViewModels, smhiViewModels } = useDailyViewModels();

    const forecastInUse = resolveForecast(activeForecast, smhiForecast, yrForecast);

    const listitems = listifyData(activeForecast, smhiViewModels, yrViewModels, setForecastDate);
    const fullScreen = showFullscreenDialog();
    return (
        <>
            <section className='weathertable' >
                <Issued approvedTime={forecastInUse ? forecastInUse.approvedTime : null} />
                {listitems ? listitems : <p>Missing items</p>}
            </section>
            <HourlyWeatherModal onClose={() => { setForecastDate(null); }} forecastDate={forecastInUse && forecastDate} fullScreen={fullScreen} />
        </>
    );
}

export default WeatherTable;
