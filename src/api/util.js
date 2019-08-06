export const fetchAndExtractJSON = (url, options = { method: 'GET' }) => {
    return fetch(url, options)
        .then(res => {
            return res.json().then(json => res.ok ? json : Promise.reject(json));
        });
};

export const fetchAndExtractText = (url, options = { method: 'GET' }) => {
    return fetch(url, options)
        .then(res => {
            return res.text().then(txt => res.ok ? txt : Promise.reject(txt));
        });
};