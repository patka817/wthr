import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';
import { addDays } from '../Util/date';
import { SMHI_FORECAST, YR_FORECAST } from '../state/reducers';
import { FORECAST_LIMIT } from './DailyViewModel';
import { useYR } from '../api/yr';
import { useSMHI } from '../api/smhi';
import { Forecast } from '../timeSerie';
import { createHourlyViewModels } from './HourlyViewModel';

const ONE_HOUR = 1000*60*60;

export const useActiveHourlyViewModels = () => {
    const { yrViewModels: yr, smhiViewModels: smhi } = useHourlyViewModels();
    const activeForecastId = useSelector(state => state.activeForecast);
    if (activeForecastId === SMHI_FORECAST) {
        return smhi;
    } else if (activeForecastId === YR_FORECAST) {
        return yr;
    }
    return null;
};

const useHourlyViewModels = () => {
    const { forecast: yrForecast } = useYR();
    const { forecast: smhiForecast } = useSMHI();
    
    let now = new Date();
    const timeStringID = `${now.getDay()}-${now.getHours()}`;
    console.log(`hourly time ID: ${timeStringID}`);
    
    // NOTE: We set cache and stale to one hour, our id will change anyway  when we enter the next hour -> refetch/recalc
    const { data: yrData } = useQuery(["HOURLY-YR" + timeStringID, JSON.stringify(yrForecast)], promiseCreateHourly, {
        refetchOnWindowFocus: false,
        enabled: yrForecast !== null,
        cacheTime: ONE_HOUR,
        staleTime: ONE_HOUR
    })

    const { data: smhiData } = useQuery(["HOURLY-SMHI" + timeStringID, JSON.stringify(smhiForecast)], promiseCreateHourly, {
        refetchOnWindowFocus: false,
        enabled: smhiForecast !== null,
        cacheTime: ONE_HOUR,
        staleTime: ONE_HOUR
    })
    
    return { yrViewModels: yrData, smhiViewModels: smhiData };
};

const promiseCreateHourly = (type, forecast) => {
    return new Promise( (fulfill) => {
        console.log("creating hourly viewmodels");
        const parsedForecast = Forecast.fromJSON(forecast);
        let [viewmodels, dates] = allValidHourlyViewModels(parsedForecast);
        fulfill({viewmodels, dates});
    });
};

function allValidHourlyViewModels(forecast) {
    if (!forecast) {
        return [[], []];
    }
    let res = [];
    let dates = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < FORECAST_LIMIT; i++) {
        let date = addDays(today, i);
        let viewModels = createHourlyViewModels(forecast, date);
        if (viewModels.length > 0) {
            res.push(viewModels);
            dates.push(date);
        }
    }
    return [res, dates];
}