<template>
    <el-container class="public-container">
        <el-header class="clearfix web-header" height="48px" v-if="showMenu">
            <span class="fl">后台管理系统</span>
            <div class="head-right fr">
                <span class="link">张三</span>
                <span class="link" @click="logout">退出</span>
            </div>
        </el-header>
        <el-header v-else class="h5-header">
            <i class="el-icon-arrow-left" @click="goBack" v-if="$route.path !== 'index'"></i>
            <p>{{TAB_TITLE}}</p>
        </el-header>
        <el-container>
            <el-aside width="200px" v-if="showMenu">
                <el-menu
                    class="aside-menu"
                    background-color="#495060"
                    text-color="#fff"
                    default-active="esslist">
                    <el-menu-item index="/"><i class="el-icon-s-home"></i>首页</el-menu-item>
                    <el-menu-item index="esslist"><i class="el-icon-menu"></i>ESS</el-menu-item>
                    <el-submenu index="1">
                        <template slot="title">
                            <i class="el-icon-s-tools"></i>
                            <span>设置</span>
                        </template>
                        <el-menu-item index="/menu"><i class="el-icon-tickets"></i>导航</el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <el-main><router-view></router-view></el-main>
        </el-container>
    </el-container>
</template>

<script>
import { mapGetters } from 'vuex';
import { CHANGE_ISH5 } from '@vuex/actions';

export default {
    data() {
        return {
            showMenu: true
        };
    },
    computed: {
        ...mapGetters(['TAB_TITLE'])
    },
    mounted() {
        this.showMenu = !window.isH5;
        this.$store.dispatch({
            type: CHANGE_ISH5,
            value: window.isH5
        });
        window.onresize = () => {
            this.showMenu = window.innerWidth > 750;
            this.$store.dispatch({
                type: CHANGE_ISH5,
                value: !this.showMenu
            });
        };
    },
    methods: {
        logout() {
            this.$router.push({ name: 'Login' });
        },
        goBack() {
            this.$router.back();
        }
    }
};
</script>

<style lang="less">
.public-container {
    width: 100%;
    height: 100%;
    .web-header {
        color: #fff;
        background-color: #101010;
        font-size: 20px;
        font-weight: bold;
        line-height: 48px;
        .head-right {
            font-size: 14px;
            font-weight: normal;
            span + span {
                margin-left: 20px;
            }
        }
    }
    .h5-header {
        color: #fff;
        background-color: #101010;
        font-size: .32rem;
        height: .74rem !important;
        line-height: .74rem;
        position: relative;
        text-align: center;
        .el-icon-arrow-left {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            font-size: .36rem;
            left: 0.3rem;
        }
    }
    .aside-menu {
        height: 100%;
        .el-submenu {
            .el-menu-item {
                width: 100%;
                min-width: auto;
            }
        }
    }
    .el-main {
        overflow: auto;
    }
}
</style>
