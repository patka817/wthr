import React from 'react';
import { Typography } from '@material-ui/core';

export default function Issued(props) {
    if (props.approvedTime) {
        return (
            <Typography  variant='body2'>
                Forecast issued {props.approvedTime.toLocaleString(navigator.language, { hour12: false, hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'long' })}
            </Typography>
        );
    } else {
        return null;
    }
};