import React from 'react';
import { connect } from 'react-redux';
import { IconButton } from '@material-ui/core';
import { MyLocation } from '@material-ui/icons';
import { getGPSPosition } from '../state/actions'

class GPSButtonPresentational extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        if (this.props.fetchingPos === true) {
            return;
        }
        this.props.getGPSPosition();
    }

    render() {
        // {this.props.fetchingPos ? 'Locating...' : 'Get weather based on current position'}
        return (
            <IconButton onClick={this.onClick}><MyLocation /></IconButton>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        fetchingPos: state.fetchingPosition
    };
};

const mapDispatchToProps = { getGPSPosition };

const GPSButton = connect(mapStateToProps, mapDispatchToProps)(GPSButtonPresentational);
export default GPSButton;