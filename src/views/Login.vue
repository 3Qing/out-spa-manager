<template>
    <main-wrapper class="login">
        <el-form size="small" class="login-wrapper">
            <el-form-item>
                <p class="item-title">社員番号（YP始まり）</p>
                <el-input v-model="form.empeeid" placeholder="YP001"></el-input>
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
import {
    FETCH_MENUS,
    FETCH_TEAMS,
    FETCH_ACTIONS,
    CHANGE_TAB_TITLE
} from '@vuex/actions';

export default {
    components: {
        MainWrapper
    },
    data() {
        return {
            form: {
                empeeid: process.env.NODE_ENV === 'production' ? '' : 'YP009',
                username: process.env.NODE_ENV === 'production' ? '' : '陳 峰',
                userpwd: process.env.NODE_ENV === 'production' ? '' : 'chenfeng',
                validatecode: ''
            },
            validUrl: `${process.env.NODE_ENV === 'production' ? 'http://www.your-partner.co.jp' : '/proxy'}/api/getvalidatebmp`
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
    methods: {
        reloadValidCover() {
            this.validUrl = `${this.validUrl}?t=${new Date().getSeconds()}`;
        },
        beforeSubmit() {
            let message = '';
            if (!this.form.empeeid) {
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
                url: '/api/login',
                params,
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    let result = res.data || {};
                    let arr = [];
                    let tmp = {};
                    result.menus.forEach(item => {
                        if (item.Level === 1) {
                            arr[Number(item.Order - 1)] = item;
                            tmp[item.Group] = item;
                        }
                        if (item.Level === 2) {
                            if (tmp[item.Group] && !tmp[item.Group]['children']) {
                                tmp[item.Group]['children'] = [];
                                tmp[item.Group]['children'][Number(item.Order) - 1] = item;
                            } else if (tmp[item.Group] && tmp[item.Group]['children']) {
                                tmp[item.Group]['children'][Number(item.Order) - 1] = item;
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
                    delete result.menus;
                    sessionStorage.setItem('menus', JSON.stringify(menus));
                    sessionStorage.setItem('appInfo', JSON.stringify(result));
                    this.$store.dispatch({
                        type: FETCH_MENUS,
                        res: menus || []
                    });
                    this.$store.dispatch({
                        type: FETCH_TEAMS,
                        res: result.teams || []
                    });
                    this.$store.dispatch({
                        type: FETCH_ACTIONS,
                        res: result.actions || []
                    });
                    let tabTitle = '';
                    let routeName = '';
                    for (let i = 0; i < menus.length; i++) {
                        if (!routeName && menus[i].children && menus[i].children.length) {
                            tabTitle = menus[i].children[0].Title;
                            routeName = menus[i].children[0].Name;
                            break;
                        }
                    }
                    if (!routeName) {
                        routeName = '/';
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
    .el-form {
        width: 220px;
        .el-form-item {
            margin-bottom: 12px;
        }
        .item-title {
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
