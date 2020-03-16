export function getFullYears() {
    const thisYear = new Date().getFullYear();
    const limit = 2010;
    const duration = thisYear - limit;
    const allYear = [];
    for (let i = 0; i <= duration; i++) {
        allYear.push(thisYear - i);
    }
    return allYear;
}

/**
 * 
 * @param {String} api '/api/xxx'
 * @param {String} params '?key=value&key1=value1
 */
export function formatApiUrl(api, params) {
    let url = process.env.NODE_ENV === 'production' ? 'http://www.your-partner.co.jp' : '/proxy';
    window.open(`${url}${api}${params}`, '_blank');
}