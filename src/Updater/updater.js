import { store } from '../state/store';
import { refreshData } from '../state/actions'

const THREE_HOURS = 1000 * 60 * 60 * 3;

const threeHoursHasPassedSince = (date) => {
    const now = new Date();
    if (now.getTime() - date.getTime() >= THREE_HOURS) {
        return true;
    }
    return false;
};

const updateData = () => {
    const state = store.getState();
    const hasLocation = !!state.lat && !!state.lon;
    const lastUpdate = state.lastUpdate;
    if (hasLocation) {
        if (!lastUpdate || threeHoursHasPassedSince(lastUpdate)) {
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