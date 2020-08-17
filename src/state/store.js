import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk'
import { rootReducer } from './reducers';
import { loadState, saveState } from './../localStorage';

const STATE_PROPS_TO_STORE = ['seenVersion', 'lat', 'lon', 'city', 'smhiForecast', 'yrForecast', 'activeForecast', 'lastUpdate'];

export let store = undefined;
const configureStore = () => {
    if (store !== undefined) {
        console.error('Trying to configure the store which is already configured!');
        return store;
    }
    const persistedState = loadState();
    store = createStore(
        rootReducer,
        persistedState,
        applyMiddleware(ReduxThunk)
    );

    store.subscribe(() => {
        const state = store.getState();
        let storable = {};
        for (let idx in STATE_PROPS_TO_STORE) {
            let propKey = STATE_PROPS_TO_STORE[idx];
            storable[propKey] = state[propKey];
        }
        saveState(storable);
    });
    
    return store;
};

export default configureStore;