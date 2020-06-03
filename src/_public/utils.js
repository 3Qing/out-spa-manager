import moment from "moment";

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
export function formatApiUrl(api, params, open = true) {
    let url = process.env.NODE_ENV === 'production' ? 'http://erp.your-partner.co.jp' : '/proxy';

    if (open) {
        window.open(`${url}${api}${params}`, '_blank');
    } else {
        return `${url}${api}${params}`;
    }
}

export function formatTime(time) {
    if (!time) return '';
    return moment(time).format('YYYY-MM-DD');
}

// 下载文件
export function apiDownloadFile({ vm, url, filename }) {
    const loading = vm.$loading({ lock: true, text: '正在获取数据中...' });
    vm.$axios({
        url,
        headers: {
            'Content-Type': 'application/octet-stream'
        },
        responseType: 'blob'
    }).then(res => {
        if (res) {
            loading.close();
            const fileReader = new FileReader();
            fileReader.readAsDataURL(res);
            fileReader.onload = event => {
                let link = document.createElement('a');
                link.href = event.target.result;
                link.setAttribute('download', filename);
                document.body.appendChild(link);
                link.click();
            };
        }
    });
}

export function imageFileToPreview({ vm, url, params }) {
    vm.$axios({
        url,
        params,
        headers: {
            'Content-Type': 'application/octet-stream'
        },
        responseType: 'blob'
    }).then(res => {
        if (res) {
            const csvData = new Blob([res]);
            const url = window.URL.createObjectURL(csvData);
            vm.$root.$emit('SHOW_PICTURE_DIALOG', {
                url: url
            });
        }
    });
}

export function priceToString(val) {
    if (!val) return '';
    return Number(val).toLocaleString();
}

export function priceToNumber(val) {
    if (!val) return 0;
    let value = String(val).replace(/,/g, '');
    return Number(value);
}

export function fileToBase64(file) {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = (e) => {
            resolve(e.target.result);
        };
        reader.readAsDataURL(file);
    });
}