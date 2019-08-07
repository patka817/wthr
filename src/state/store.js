import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk'
import { rootReducer } from './reducers';
import { loadState, saveState } from './../localStorage';

const STATE_PROPS_TO_STORE = ['lat', 'lon', 'city', 'smhiForecast', 'yrForecast', 'activeForecast', 'lastUpdate'];

const configureStore = () => {
    const persistedState = loadState();
    console.log(persistedState);
    const store = createStore(
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
        //console.log('Saving state:');
        //console.log(storable);
        saveState(storable);
    });

    return store;
};

export default configureStore;