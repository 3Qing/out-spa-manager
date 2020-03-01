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
