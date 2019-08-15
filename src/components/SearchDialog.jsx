import React, { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Search, Close } from '@material-ui/icons';
import { List, ListItem, ListItemText, Dialog, InputAdornment, Input, Divider, DialogTitle, DialogContentText, DialogActions, DialogContent } from '@material-ui/core';
import { Slide, IconButton, Toolbar, AppBar, Button } from '@material-ui/core';
import LinearProgress from '@material-ui/core/LinearProgress';
import { updateToNewLocation } from './../state/actions';
import { searchCityNames } from './../api/nominatim';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useThunkDispatch = () => useDispatch();

export default function FullScreenSearch(props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const thunkDispatch = useThunkDispatch();

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const search = (event) => {
    event.preventDefault();
    if (query && query.length > 1) {
      setSearching(true);
      searchCityNames(query)
        .then(result => {
          setResults(result);
        })
        .catch(error => {
          setResults(null);
          alert(error.message); // TODO: Make autodismissive snackbar comp?
        })
        .finally(() => {
          setSearching(false);
        });
    }
  };

  function handleClose() {
    setQuery('');
    setResults(null);
    props.onClose();
  }

  const onClick = (listitem) => {
    if (listitem.lat && listitem.lon) {
      thunkDispatch(updateToNewLocation(listitem.lat, listitem.lon));
      handleClose();
    }
  };

  let body = null;
  if (searching) {
    body = <LinearProgress variant='query' />;
  } else if (results && results.length > 0) {
    body = results.map(el => <SearchListItem searchResult={el} key={el.place_id} onClick={onClick} />);
  }

  return (
    <Dialog fullScreen open={props.open} onClose={handleClose} TransitionComponent={Transition}>
      <AppBar>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <Close />
          </IconButton>
          <SearchInput value={query} onChange={handleInputChange} onSubmit={search} />
        </Toolbar>
      </AppBar>
      <List style={{ paddingTop: '64px' }}>
        {body}
      </List>
      { /* <NotificationDialog open={results ? results.length === 0 : false} text={"Your search didn't match any location... :("} /> */}
    </Dialog>
  );
}

// Does not work..
const NotificationDialog = (props) => {
  const [rerender, setRerender] = useState(false);
  let hasBeenClosed = useRef(false);
  useEffect(() => {
    if (props.open) {
      hasBeenClosed.current = false;
    }
  });
  const handleClose = () => {
    hasBeenClosed.current = true;
    setRerender(!rerender);
  };

  return (
    <Dialog open={props.open && !hasBeenClosed.current} onClose={handleClose} >
      <DialogTitle>Whoops!</DialogTitle>
      <DialogContent>
      <DialogContentText>
        {props.text}
      </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

const SearchListItem = (props) => {
  let el = props.searchResult;
  return (
    <>
      <ListItem key={el.place_id} button onClick={() => { props.onClick(el); }}>
        <ListItemText key={`${el.place_id}-text`} primary={el.display_name} secondary={el.type} />
      </ListItem>
      <Divider />
    </>
  );
};

const useStyles = makeStyles(theme => ({
  root: {
    color: 'white',
    marginLeft: '25px'
  },
  underline: {
    color: theme.palette.common.white,
    borderBottom: theme.palette.common.white,
    '&:after': {
      borderBottom: `2px solid ${theme.palette.common.white}`,
    },
    '&:focused::after': {
      borderBottom: `2px solid ${theme.palette.common.white}`,
    },
    '&:hover:after': {
      borderBottom: `2px solid ${theme.palette.common.white}`,
    },
    '&:before': {
      borderBottom: `1px solid ${theme.palette.common.white}`,
    },
    '&:disabled:before': {
      borderBottom: `1px dotted ${theme.palette.common.white}`,
    },
    '&:hover:before': {
      borderBottom: '2px solid rgb(255, 255, 255) !important',
    },
  },
}));
const SearchInput = (props) => {
  const classes = useStyles();
  return (
    <form onSubmit={props.onSubmit}>
      <Input
        id="input-with-icon-adornment"
        placeholder='Search location'
        autoComplete='address-level2'
        type='search'
        value={props.value}
        onChange={props.onChange}
        style={props.style}
        autoFocus
        classes={{ root: classes.root, underline: classes.underline }}
        endAdornment={
          <InputAdornment color='inherit' position="end">
            <IconButton color='inherit' type='submit' style={{ padding: '0' }}>
              <Search />
            </IconButton>
          </InputAdornment>
        }
      />
    </form>
  );
};