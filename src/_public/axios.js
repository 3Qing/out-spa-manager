import axios from 'axios';

axios.defaults.withCredentials = true;

export default (params = {}) => {
    const url = process.env.NODE_ENV === 'production' ? 'http://www.your-partner.co.jp' : '/proxy';
    // const url = '//www.your-partner.co.jp';
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
    const custom = options.custom;
    delete options.custom;
    return axios(options)
        .then(res => res.data)
        .catch(() => {
            custom && custom.loading && custom.loading.close();
            custom && custom.vm && custom.vm.$message({
                type: 'error',
                message: '服务器错误，请联系相关人员',
                showClose: true
            });
        });
};
