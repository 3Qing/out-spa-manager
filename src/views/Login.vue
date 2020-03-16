<template>
    <main-wrapper class="login">
        <el-form size="small" class="login-wrapper">
            <el-form-item>
                <p class="item-title">员工ID</p>
                <el-input v-model="form.empeeid" placeholder="YP001"></el-input>
            </el-form-item>
            <el-form-item>
                <p class="item-title">员工姓名</p>
                <el-input v-model="form.username" placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item>
                <p class="item-title">密码</p>
                <el-input v-model="form.userpwd" show-password placeholder="密码"></el-input>
            </el-form-item>
            <el-form-item>
                <p class="item-title">验证码</p>
                <el-input class="code-input" v-model="form.validatecode" style="width: 140px;"></el-input>
                <img class="valid-cover" @click="reloadValidCover" :src="validUrl" alt="验证码">
            </el-form-item>
            <el-button type="primary" size="small" @click="beforeSubmit">登入</el-button>
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
                title: '登入'
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
                message = '请输入员工ID';
            } else if (!this.form.username) {
                message = '请输入员工姓名';
            } else if (!this.form.userpwd) {
                message = '请输入密码';
            } else if (!this.form.validatecode) {
                message = '请输入验证码';
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
            const loading = this.$loading({ lock: true, text: '登入中...' });
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
