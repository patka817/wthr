import { useQuery } from 'react-query';
import { createDailyViewModels } from './DailyViewModel';
import { Forecast } from '../timeSerie';
import { useYR } from '../api/yr';
import { useSMHI } from '../api/smhi';

export const useDailyViewModels = () => {
    const { forecast: yrForecast } = useYR();
    const { data: yrData } = useQuery(["DAILY-YR", JSON.stringify(yrForecast)], promiseCreateDaily, {
        refetchOnWindowFocus: false,
        enabled: yrForecast !== null
    })

    const { forecast: smhiForecast } = useSMHI();
    const { data: smhiData } = useQuery(["DAILY-SMHI", JSON.stringify(smhiForecast)], promiseCreateDaily, {
        refetchOnWindowFocus: false,
        enabled: smhiForecast !== null
    })
    
    return { yrViewModels: yrData, smhiViewModels: smhiData };
};

const promiseCreateDaily = (type, forecast) => {
    return new Promise( (fulfill) => {
        console.log("creating daily viewmodels");
        const parsedForecast = Forecast.fromJSON(forecast);
        let viewmodels = createDailyViewModels(parsedForecast);
        fulfill(viewmodels);
    });
};