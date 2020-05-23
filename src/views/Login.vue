<template>
    <main-wrapper class="login">
        <el-form size="small" class="login-wrapper">
            <el-form-item>
                <p class="item-title">社員番号（YP始まり）</p>
                <el-input v-model="form.empeeno" placeholder="YP001"></el-input>
            </el-form-item>
            <el-form-item>
                <p class="item-title">氏名</p>
                <el-input v-model="form.username" placeholder="氏名"></el-input>
            </el-form-item>
            <el-form-item>
                <p class="item-title">パスワード</p>
                <el-input v-model="form.userpwd" show-password placeholder="パスワード"></el-input>
            </el-form-item>
            <el-form-item>
                <p class="item-title">認証コード</p>
                <el-input class="code-input" v-model="form.validatecode" style="width: 140px;"></el-input>
                <img class="valid-cover" @click="reloadValidCover" :src="validUrl" alt="認証コード">
            </el-form-item>
            <el-button type="primary" size="small" @click="beforeSubmit">ログイン</el-button>
        </el-form>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import { formatApiUrl } from '@_public/utils';
import {
    FETCH_MENUS,
    FETCH_TEAMS,
    FETCH_ACTIONS,
    CHANGE_TAB_TITLE,
    CHANEG_USER_INFO
} from '@vuex/actions';

export default {
    components: {
        MainWrapper
    },
    data() {
        return {
            form: {
                // YP006  喬国霞  qqmm@yp
                // YP032  劉 峰  yz5m49d
                empeeno: process.env.NODE_ENV === 'production' ? '' : 'YP032',
                username: process.env.NODE_ENV === 'production' ? '' : '劉 峰',
                userpwd: process.env.NODE_ENV === 'production' ? '' : 'yz5m49d',
                // empeeno: process.env.NODE_ENV === 'production' ? '' : 'YP006',
                // username: process.env.NODE_ENV === 'production' ? '' : '喬国霞',
                // userpwd: process.env.NODE_ENV === 'production' ? '' : 'qqmm@yp',
                validatecode: ''
            },
            validUrl: formatApiUrl('/api/User/GetValidateBmp', `?t=${new Date().getSeconds()}`, false)
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.$store.dispatch({
                type: CHANGE_TAB_TITLE,
                title: 'ログイン'
            });
        });
    },
    // beforeMount() {
    //     if (process.env.NODE_ENV === 'production') {
    //         window.location.href = 'http://www.your-partner.co.jp/admin/#/login';
    //     }
    // },
    methods: {
        reloadValidCover() {
            this.validUrl = formatApiUrl('/api/User/GetValidateBmp', `?t=${new Date().getSeconds()}`, false);
        },
        beforeSubmit() {
            let message = '';
            if (!this.form.empeeno) {
                message = '社員番号を入力してください';
            } else if (!this.form.username) {
                message = '氏名を入力してください';
            } else if (!this.form.userpwd) {
                message = 'パスワードを入力してください';
            } else if (!this.form.validatecode) {
                message = '認定コードを入力してください';
            }
            if (message) {
                this.$message({
                    type: 'warning',
                    showClose: true,
                    message
                });
            } else {
                this.submit();
            }
        },
        submit() {
            const loading = this.$loading({ lock: true, text: 'ログイン中...' });
            const params = Object.assign({}, this.form);
            this.$axios({
                url: '/api/User/api_login',
                params,
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    let result = res.data || {};
                    const data = result.data || {};
                    const resMenus = data.menus || [];
                    let arr = [];
                    let tmp = {};
                    resMenus.forEach(item => {
                        if (item.level === 1) {
                            if (tmp[item.group]) {
                                tmp[item.group] = Object.assign(tmp[item.group], item);
                            } else {
                                tmp[item.group] = item;
                            }
                            arr[Number(item.order - 1)] = tmp[item.group];
                        }
                        if (item.level === 2) {
                            if (tmp[item.group] && !tmp[item.group]['children']) {
                                tmp[item.group]['children'] = [];
                                tmp[item.group]['children'][Number(item.order) - 1] = item;
                            } else if (tmp[item.group] && tmp[item.group]['children']) {
                                tmp[item.group]['children'][Number(item.order) - 1] = item;
                            } else if (!tmp[item.group]) {
                                tmp[item.group] = {
                                    children: []
                                };
                                tmp[item.group]['children'][Number(item.order) - 1] = item;
                            }
                        }
                    });
                    const menus = arr.filter(item => {
                        if (item.children) {
                            const tmp = item.children.filter(cell => !!cell);
                            item.children = tmp;
                        }
                        return !!item;
                    });
                    delete data.menus;
                    sessionStorage.setItem('menus', JSON.stringify(menus));
                    sessionStorage.setItem('appInfo', JSON.stringify(data));
                    this.$store.dispatch({
                        type: FETCH_MENUS,
                        res: menus || []
                    });
                    this.$store.dispatch({
                        type: FETCH_TEAMS,
                        res: data.teams || []
                    });
                    this.$store.dispatch({
                        type: FETCH_ACTIONS,
                        res: data.role || {}
                    });
                    this.$store.dispatch({
                        type: CHANEG_USER_INFO,
                        res: {
                            name: data.name,
                            employeeNo: data.employeeNo
                        }
                    });
                    let tabTitle = '';
                    let routeName = '';
                    for (let i = 0; i < menus.length; i++) {
                        if (!routeName && menus[i].children && menus[i].children.length) {
                            tabTitle = menus[i].children[0].title;
                            routeName = menus[i].children[0].name;
                            break;
                        }
                    }
                    if (!routeName) {
                        routeName = '/';
                    }
                    if (result.key) {
                        sessionStorage.setItem('token', result.key);
                    }
                    sessionStorage.setItem('tabTitle', tabTitle);
                    this.$store.dispatch({
                        type: CHANGE_TAB_TITLE,
                        title: tabTitle
                    });
                    this.$router.push({ name: routeName });
                } else {
                    this.reloadValidCover();
                    this.$message({
                        type: 'error',
                        message: res.message
                    });
                }
            });
        }
    }
};
</script>

<style lang="less">
.login {
    .content-wrapper {
        & > div {
            box-shadow: none;
        }
    }
    .el-form {
        width: 220px;
        .el-form-item {
            margin-bottom: 12px;
        }
        .item-title {
            color: #075096;
            font-weight: bold;
        }
        .valid-cover {
            position: absolute;
            right: 0;
            bottom: 0;
            height: 32px;
            cursor: pointer;
        }
    }
}
</style>
