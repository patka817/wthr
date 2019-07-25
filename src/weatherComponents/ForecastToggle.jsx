import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { toggleForecast } from '../state/actions';
import { SMHI_FORECAST, YR_FORECAST } from '../state/reducers';

const ForecastToggle = (props) => {
    const currentForecast = useSelector(state => state.activeForecast);
    const dispatch = useDispatch();
    const changeForecast = useCallback(
        () => dispatch(toggleForecast()),
        [dispatch]
    );
    const smhiIsActive = currentForecast === SMHI_FORECAST || currentForecast === undefined;
    const yrActive = currentForecast === YR_FORECAST;

    return (
        <ButtonGroup id='toggle-forecast-group'>
            <Button onClick={changeForecast} disabled={ smhiIsActive } >SMHI</Button>
            <Button onClick={changeForecast} disabled={ yrActive }>YR</Button>
        </ButtonGroup>
    );
};

export default ForecastToggle;