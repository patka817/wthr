const AppConfig = {
    version: '1.5.1',
    versionTexts: {
        '1.4.1': ['Added animations when showing modal views', 'It is now possible to swipe between daily forecast breakdowns (when you have tapped in on a single day)', 'Added this view! :)'],
        '1.5.0': ['Updated YR API to use their new endpoint', 'Updated icons from YR, they should now work offline I hope..', 'Using ReactQuery instead of Redux for handling API queries and as a cache when generating foreasts.'],
        '1.5.1': ['Corrected a bug which made weather icons for the current day appear on the wrong part of the day (left aligned instead of right aligned).', 'Hope you have a great day! :)']
    }
};

export default AppConfig;