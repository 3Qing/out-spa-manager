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
    vm.$axios({
        url,
        headers: {
            'Content-Type': 'application/octet-stream'
        },
        responseType: 'blob'
    }).then(res => {
        if (res) {
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