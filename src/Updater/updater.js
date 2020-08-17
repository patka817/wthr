import { store } from '../state/store';
import { refreshData, updatedApp } from '../state/actions'
import AppConfig from '../appConfig';

const THREE_HOURS = 1000 * 60 * 60 * 3;

const threeHoursHasPassedSince = (date) => {
    const now = new Date();
    if (now.getTime() - date.getTime() >= THREE_HOURS) {
        return true;
    }
    return false;
};

function isPwa() {
    return ["fullscreen", "standalone", "minimal-ui"].some(
        (displayMode) => window.matchMedia('(display-mode: ' + displayMode + ')').matches
    );
}

const updateData = () => {
    const state = store.getState();

    if (isPwa()) {
        let lastSeenVersion = state.seenVersion;
        let isUpatedSinceIntroducedVersionText = (!lastSeenVersion && AppConfig.version === '1.4.1');
        if (isUpatedSinceIntroducedVersionText || lastSeenVersion !== AppConfig.version) {
            store.dispatch(updatedApp(AppConfig.version));
        }
    }

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