import React from 'react';
import { connect } from 'react-redux';
import { fetchData } from './../state/actions';
import { IconButton } from '@material-ui/core';
import { Loop } from '@material-ui/icons';

class ReloadDataButtonPresentational extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick() {
        if (this.props.loading || this.props.locatingGPS) {
            return;
        }
        this.props.onClick();
    }

    render() {

        let className = this.props.loading ? 'rotate' : '';
        return (
            <IconButton disabled={this.props.locatingGPS} onClick={this.onClick} color={this.props.color}><Loop className={className} /></IconButton>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        locatingGPS: state.fetchingPosition
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onClick: () => { dispatch(fetchData()); }
    };
};

const ReloadDataButton = connect(mapStateToProps, mapDispatchToProps)(ReloadDataButtonPresentational);

export default ReloadDataButton;