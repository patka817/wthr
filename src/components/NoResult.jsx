import React from 'react';
import { IconButton, Typography } from '@material-ui/core';

const NoResultPage = (props) => {
    return (
      <section style={noResultStyle}>
        <div style={{ ...noResultDivStyle }}>
          <IconButton style={{ fontSize: '80px' }} disabled={true}>
              { props.renderIcon({fontSize: 'inherit'}) }
          </IconButton>
        </div>
        <div style={{ ...noResultDivStyle }}>
          <Typography variant='h6'>
            {props.title}
      </Typography>
        </div>
        <div style={{ ...noResultDivStyle }}>
          <Typography variant='body1' style={{ color: 'grey' }}>
            {props.bodyText}
      </Typography>
        </div>
      </section>
    );
  };

  export default NoResultPage;
  
  const noResultStyle = {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  };
  
  const noResultDivStyle = {
    paddingBottom: '10px'
  }