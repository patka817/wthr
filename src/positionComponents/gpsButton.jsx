import React from 'react';
import { connect } from 'react-redux';
import { getGPSPosition } from '../state/actions'

class GPSButtonPresentational extends React.Component {
    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    componentWillReceiveProps(newProps, oldProps) {
        if (this.props.fetchingPos === true && newProps.fetchingPos === false && newProps.errorMessage) {
            alert(newProps.errorMessage);
        }
    }

    onClick() {
        if (this.props.fetchingPos === true) {
            return;
        }
        this.props.getGPSPosition();
    }

    render() {
        return (
            <div>
                <button className='gps-button' onClick={this.onClick}>{ this.props.fetchingPos ? 'Locating...' : 'Get weather based on current position' }</button>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        fetchingPos: state.fetchingPosition,
        errorMessage: state.errorMessage
    };
};

const mapDispatchToProps = { getGPSPosition };

const GPSButton = connect(mapStateToProps, mapDispatchToProps)(GPSButtonPresentational);
export default GPSButton;