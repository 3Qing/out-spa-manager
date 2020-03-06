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
import { CHANGE_TAB_TITLE } from '@vuex/actions';
import {
    FETCH_MENUS,
    FETCH_TEAMS,
    FETCH_ACTIONS
} from '@vuex/actions';

export default {
    components: {
        MainWrapper
    },
    data() {
        return {
            form: {
                empeeid: 'YP009',
                username: '陳 峰',
                userpwd: 'chenfeng',
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
                if (res.code === 0) {
                    const result = res.data || {};
                    sessionStorage.setItem('appInfo', JSON.stringify(result));
                    this.$store.dispatch({
                        type: FETCH_MENUS,
                        res: result.menus || []
                    });
                    this.$store.dispatch({
                        type: FETCH_TEAMS,
                        res: result.teams || []
                    });
                    this.$store.dispatch({
                        type: FETCH_ACTIONS,
                        res: result.actions || []
                    });
                    this.$router.push({ name: 'ESSList' });
                } else {
                    this.$message({
                        type: 'error',
                        showClose: true,
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
