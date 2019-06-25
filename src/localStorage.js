import TimeSerie from "./timeSerie";

export const loadState = () => {
    try {
        const serializedState = localStorage.getItem('state');
        if (serializedState === null) {
            return undefined;
        }
        let state = JSON.parse(serializedState, (name, value) => {
            if (name === 'smhiData' || name === 'yrData') {
                return value.map(x => new TimeSerie(x));
            } else if (name === 'endTime' || name === 'startTime' || name === 'approvedTime') {
                return new Date(value);
            }
            return value;
        });
        
        return state;
    } catch (err) {
        console.log('Failed to load state: ' + err);
        return undefined;
    }
};

export const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        if (serializedState !== null) {
            localStorage.setItem('state', serializedState);
        }
    } catch (err) {
        console.log('Failed to save state: ' + err);
    }
};