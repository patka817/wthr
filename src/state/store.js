import { createStore, applyMiddleware } from 'redux';
import ReduxThunk from 'redux-thunk'
import { rootReducer } from './reducers';
import { loadState, saveState } from './../localStorage';

const configureStore = () => {
    const persistedState = loadState();
    console.log(persistedState);
    const store = createStore(
        rootReducer,
        persistedState,
        applyMiddleware(ReduxThunk)
    );

    store.subscribe(() => {
        console.log('saving state');
        const { lat, lon, city, smhiForecast, yrForecast } = store.getState();
        saveState({ lat, lon, city, smhiForecast, yrForecast });
    });

    return store;
};

export default configureStore;