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

export const truncate = (decimal, n = 2) => {
    let x = decimal + ''; // string 
    return x.lastIndexOf('.') >= 0 ? parseFloat(x.substr(0, x.lastIndexOf('.') + (n + 1))) : decimal; // You can use indexOf() instead of lastIndexOf()
};