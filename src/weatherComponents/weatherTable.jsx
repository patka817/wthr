import React from 'react';
import { connect } from 'react-redux';

class WeatherTablePresentational extends React.Component {
    constructor(props) {
        super(props);

        this.aggregateData = this.aggregateData.bind(this);
        this.listifyData = this.listifyData.bind(this);
    }

    aggregateData() {
        let data = null;
        if (this.props.smhiForecast) {
            data = {};
            this.props.smhiForecast.timeSerie.forEach(val => {
                if (!val.isInstant()) {
                    return;
                }
                data[val.endTime] = {
                    time: val.endTime,
                    smhi: val
                };
            });
        }
        if (this.props.yrForecast) {
            data = data ? data : {};
            this.props.yrForecast.timeSerie.forEach(val => {
                if (!val.isInstant()) {
                    return;
                }
                let entry = data[val.endTime];
                if (!entry) {
                    entry = {
                        time: val.endTime,
                        yr: val
                    }
                    data[val.endTime] = entry;
                } else {
                    entry.yr = val;
                }
            });
        }
        return data;
    }

    listifyData() {
        const data = this.aggregateData();
        if (!data) {
            return null;
        }
        let res = [];
        for (let key in data) {
            let entry = data[key];
            res.push(<li key={entry.time}>{`${entry.time}: ${entry.smhi ? entry.smhi.temp.value : 'null'} | ${entry.yr ? entry.yr.temp.value : 'null'}`}</li>);
        }
        return res;
    }

    render() {
        const listitems = this.listifyData();
        return (
            <ul className='weathertable'>
                {this.props.loading ? <p>Fetching data...</p> : null}
                {listitems ? listitems : <p>Missing items</p>}
            </ul>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        loading: state.loading,
        yrForecast: state.yrForecast,
        smhiForecast: state.smhiForecast
    };
};

const WeatherTable = connect(mapStateToProps, null)(WeatherTablePresentational);
export default WeatherTable;