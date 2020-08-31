import React from 'react';
import { IconButton } from '@material-ui/core';
import { Loop } from '@material-ui/icons';
import { useYR } from '../api/yr';
import { useSMHI } from '../api/smhi';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useQueryCache } from 'react-query';

function ReloadDataButton(props) {
    const [manualLoading, setManualLoading] = useState(false);
    const locatingGPS = useSelector(state => state.locatingGPS);
    const { isLoading: isLoadingYR } = useYR()
    const { isLoading: isLoadingSMHI } = useSMHI()
    const isLoading = manualLoading || isLoadingYR || isLoadingSMHI;
    const cache = useQueryCache()
    const onClick = () => {
        setManualLoading(true);
        setTimeout(() => {
                cache.invalidateQueries((query) => {
                    if (query.queryKey instanceof Array) {
                        const yrIndex = query.queryKey.indexOf('YR');
                        const smhiIndex = query.queryKey.indexOf('SMHI');
                        return smhiIndex >= 0 || yrIndex >= 0;
                    }
                    return false;
                });
                setManualLoading(false);
        }, 1000);
    };

    let className = isLoading ? 'rotate' : '';
    return (
        <IconButton aria-label="Reload" disabled={locatingGPS} onClick={ onClick } style={props.style}><Loop id="reloadDataButtonLoopIcon" className={className} /></IconButton>
    );
}
export default ReloadDataButton;