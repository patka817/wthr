import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import { Search, Close } from '@material-ui/icons';
import { List, ListItem, ListItemText, Dialog, InputAdornment, Input } from '@material-ui/core';
import { Slide, IconButton, Toolbar, AppBar } from '@material-ui/core';
import { updateToNewLocation } from './../state/actions';
import { searchCityNames } from './../api/nominatim';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useThunkDispatch = () => useDispatch();

export default function FullScreenSearch(props) {
  const classes = useStyles();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const dispatch = useThunkDispatch();

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const search = (event) => {
    event.preventDefault();
    if (query && query.length > 1) {
      searchCityNames(query).then(result => {
        setResults(result);
      })
    }
  };

  function handleClose() {
    setQuery('');
    setResults([]);
    props.onClose();
  }

  const onClick = (listitem) => {
    if (listitem.lat && listitem.lon) {
      dispatch(updateToNewLocation(listitem.lat, listitem.lon));
      handleClose();
    }
  };

  return (
      <Dialog fullScreen open={props.open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <Close />
            </IconButton>
            <SearchInput value={query} onChange={handleInputChange} onSubmit={search} />
          </Toolbar>
        </AppBar>

        <List style={{ paddingTop: '64px' }}>
          {results && results.map(el => <ListItem key={el.place_id} button onClick={() => { onClick(el); }}><ListItemText key={`${el.place_id}-text`} primary={el.display_name} secondary={el.type}/></ListItem>)}
        </List>
      </Dialog>
  );
}

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