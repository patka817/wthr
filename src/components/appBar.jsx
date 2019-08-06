import React from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Search } from '@material-ui/icons';

import GPSButton from '../positionComponents/gpsButton';
import ReloadDataButton from '../weatherComponents/reloadDataButton';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  appName: {
    flexGrow: 1
  },
  title: {
    flexGrow: 1,
    flexShrink: 1,
    gridArea: 'title',
    margin: 'auto'
  },
}));

export default function ButtonAppBar() {
  const classes = useStyles();
  const city = useSelector(state => state.city);
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className='top-toolbar'>
        <div className='left-icons'>
            <Search color="inherit" />
          </div>
          <Typography variant="h6" className={classes.title} >
            {city !== null ? city : 'Choose location'}
          </Typography>
          <div className='right-icons'>
            <GPSButton color="inherit" />
            <ReloadDataButton color="inherit" />
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};