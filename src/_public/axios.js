import axios from 'axios';
import qs from 'qs';

axios.defaults.withCredentials = true;
// axios.interceptors.request.use(async (config) => {
// //只针对get方式进行序列化
//     if (config.method === 'get') {
//     config.paramsSerializer = function(params) {
//         return qs.stringify(params, { arrayFormat: 'repeat' })
//         }
//     }
// }

export default (params = {}) => {
    const url = process.env.NODE_ENV === 'production' ? 'http://erp.your-partner.co.jp' : '/proxy';
    let options = {
        method: 'GET'
    };
    options = Object.assign(options, params);
    options.url = `${url}${options.url}`;
    if (options.method.toLocaleUpperCase() === 'POST') {
        options.data = params.params;
        options.withCredentials = true;
        delete options.params;
    }
    if (options.method.toLocaleUpperCase() === 'GET') {
        options.paramsSerializer = function(params) {
            return qs.stringify(params, { arrayFormat: 'repeat' });
        };
    }
    if (options.formData === true) {
        const formData = new FormData();
        for (let key in params.params) {
            if (params.params[key] instanceof Array) {
                params.params[key].forEach((item, i) => {
                    if (typeof item === 'object') {
                        for (let k in item) {
                            if (item[k] instanceof Array) {
                                for (let l in item[k]) {
                                    for (let y in item[k][l]) {
                                        formData.append(`${key}[${i}].${k}[${l}][${y}]`, item[k][l][y]);
                                    }
                                }
                            } else {
                                formData.append(`${key}[${i}].${k}`, item[k]);
                            }
                        }
                    } else {
                        formData.append(`${key}[${i}]`, item);
                    }
                });
            } else {
                formData.append(key, params.params[key]);
            }
        }
        options.data = formData;
        if (!options.headers) {
            options.headers = {};
        }
    }
    const token = sessionStorage.getItem('token');
    if (token) {
        if (!options.headers) {
            options.headers = {};
        }
        options.headers.Authorization = token;
    }
    const custom = options.custom;
    delete options.custom;
    return axios(options)
        .then(res => {
            if (res.status === 200 && res.data) {
                if (res.data.code === 99) {
                    custom.vm && custom.vm.$message({
                        type: 'warning',
                        message: res.data.message
                    });
                    sessionStorage.removeItem('token');
                    sessionStorage.removeItem('appInfo');
                    sessionStorage.removeItem('tabTitle');
                    sessionStorage.removeItem('menus');
                    sessionStorage.removeItem('routeHistory');
                    custom.vm && custom.vm.$router.push({ name: 'Login' });
                }
                return res.data;
            } else {
                return {
                    code: -1,
                    data: null,
                    message: '接口开小差了，没有返回信息'
                };
            }
        })
        .catch(() => {
            custom && custom.loading && custom.loading.close();
            custom && custom.vm && custom.vm.$message({
                type: 'error',
                message: '服务器错误，请联系相关人员',
                showClose: true
            });
        });
};