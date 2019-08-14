import { store } from '../state/store';
import { refreshData } from '../state/actions'

const THREE_HOURS = 1000 * 60 * 60 * 3;

const updateData = () => {
    const state = store.getState();
    const hasLocation = state.lat && state.lon;
    const lastUpdate = state.lastUpdate;
    if (hasLocation) {
        const now = new Date();
        if (!lastUpdate || now.getTime() - lastUpdate.getTime() > THREE_HOURS) {
            store.dispatch(refreshData());
        }
    }
};

export default function initializeUpdater() {
    updateData();
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            updateData();
        }
    });
};