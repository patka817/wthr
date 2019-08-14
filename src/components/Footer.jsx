import React from 'react';
import { Typography } from '@material-ui/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import AppConfig from '../appConfig';

export default function Footer(props) {
    const year = (new Date()).getFullYear();

    return (
        <footer>
            <div>
                <Typography variant='caption'>
                    Version {AppConfig.version}
                </Typography>
            </div>

            <div>
                <Typography variant='caption'>
                    © {year} Patrik Karlsson
                    </Typography>
            </div>

            <div style={contactStyle}>
                <a style={{ paddingRight: '10px'}} href='mailto:patrik.karlsson817@gmail.com'><FontAwesomeIcon icon={faEnvelope} style={iconStyle} /></a>
                <a href='https://www.linkedin.com/in/patrik-karlsson-8843b663/'><FontAwesomeIcon icon={faLinkedin} style={iconStyle} /></a>
            </div>
        </footer>
    );
};

const contactStyle = {
    display: 'flex',
    justifyContent: 'center',
    justifyItems: 'center',
};

const iconStyle = { 
    width: '1em', 
    height: '1em', 
    fontSize: '1.5rem'
};