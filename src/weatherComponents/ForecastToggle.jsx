import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { toggleForecast } from '../state/actions';
import { SMHI_FORECAST, YR_FORECAST } from '../state/reducers';
import { useYR } from '../api/yr';
import { useSMHI } from '../api/smhi';

const ForecastToggle = (props) => {
    const currentForecast = useSelector(state => state.activeForecast);
    const { forecast: yrForecast } = useYR();
    const { forecast: smhiForecast } = useSMHI();
    const dispatch = useDispatch();
    const changeForecast = useCallback(
        () => dispatch(toggleForecast()),
        [dispatch]
    );
    const smhiIsActive = currentForecast === SMHI_FORECAST || currentForecast === undefined;
    const yrActive = currentForecast === YR_FORECAST;

    return (
        <ButtonGroup id='toggle-forecast-group'>
            {smhiForecast ? <Button aria-label="Toggle SMHI" onClick={changeForecast} disabled={ smhiIsActive } >SMHI</Button> : null }
            {yrForecast ? <Button aria-label="Toggle YR" onClick={changeForecast} disabled={ yrActive }>YR</Button> : null }
        </ButtonGroup>
    );
};

export default ForecastToggle;