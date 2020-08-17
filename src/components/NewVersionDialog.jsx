import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogContent, DialogTitle, DialogActions, Button, Slide, List, ListItem, ListItemText, ListItemIcon } from '@material-ui/core';
import { Typography } from '@material-ui/core';
import StarIcon from '@material-ui/icons/Star';
import { dismissVersionText } from '../state/actions';
import AppConfig from '../appConfig';
import { versionCompare } from '../api/util';

const UpTransition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export function NewVersionDialog(props) {
    const newVersion = useSelector(state => state.newVersion);
    const lastSeenVersion = useSelector(state => state.seenVersion);
    const show = newVersion != null;
    const dispatch = useDispatch();

    const close = () => {
        dispatch(dismissVersionText());
    };

    return (
        <Dialog fullWidth={true} open={show ? true : false} onClose={close} TransitionComponent={UpTransition}>
            <DialogTitle style={{ backgroundColor: '#3f51b5', color: 'white' }}>
                <section>
                    New Version
          </section>
            </DialogTitle>
            <DialogContent>
                {Object.keys(AppConfig.versionTexts).filter(version => lastSeenVersion ? versionCompare(version, lastSeenVersion) : true).map(version => (<NewVersionEntry key={version} version={version} />))}
            </DialogContent>
            <DialogActions>
                <Button color="primary" variant='contained' onClick={close}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

function NewVersionEntry(props) {
    if (!AppConfig.versionTexts.hasOwnProperty(props.version)) {
        return null;
    }
    let versionArray = AppConfig.versionTexts[props.version];
    return (
        <>
            <Typography variant='h5' align='center'>
                {props.version}
            </Typography>
            <List>
                {versionArray.map((entry, index) => (
                    <ListItem key={index}>
                        <ListItemIcon>
                            <StarIcon />
                        </ListItemIcon>
                        <ListItemText>
                            {entry}
                        </ListItemText>
                    </ListItem>
                )
                )}
            </List>
        </>
    )
}