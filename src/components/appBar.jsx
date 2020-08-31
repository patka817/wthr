import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import { Search } from '@material-ui/icons';
import SearchDialog from './SearchDialog';

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
  const [openSearch, setOpenSearch] = useState(false);
  const city = useSelector(state => state.city);
  const fetchingPosition = useSelector(state => state.fetchingPosition);

  const showSearch = () => {
    setOpenSearch(true);
  };
  const hideSearch = () => {
    setOpenSearch(false);
  };

  const buttonStyles = {
    color: 'lightblue'
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar className='top-toolbar'>
          <div className='left-icons'>
            <IconButton style={buttonStyles} onClick={showSearch} disabled={fetchingPosition}><Search /></IconButton>
          </div>
          <Typography variant="h6" className={classes.title} >
            {city !== null ? city : 'Choose location'}
          </Typography>
          <div className='right-icons'>
            <GPSButton style={buttonStyles} />
            <ReloadDataButton style={buttonStyles} />
          </div>
        </Toolbar>
      </AppBar>

      <SearchDialog color="inherit" open={openSearch} onClose={hideSearch} />
    </div>
  );
};