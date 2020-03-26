<template>
    <el-container id="app" class="public-container">
        <el-header v-if="!showMenu" class="h5-header">
            <i class="el-icon-arrow-left" @click="goBack" v-if="showArrow"></i>
            <p>{{TAB_TITLE}}</p>
            <i class="el-icon-menu" @click="displayMenu"></i>
        </el-header>
        <el-aside :class="[!showMenu && 'h5-nav']" width="200px" v-if="showMenu || showH5Nav">
            <el-menu
                class="aside-menu"
                background-color="#0b253c"
                active-text-color="#fff"
                text-color="#fff"
                :default-active="activeRouter"
                @select="routerHandle">
                <el-menu-item v-if="showH5Nav && $route.name !== 'Login'" @click="logout">登出</el-menu-item>
                <el-menu-item-group v-for="(item, i) in MENUS" :key="i">
                    <template slot="title">{{item.Title}}</template>
                    <el-menu-item
                        v-for="(cell, j) in item.children"
                        :class="[cell.Name === activeRouter && 'is-active']"
                        @click="openLink(cell)"
                        :index="`${cell.Name || j}`"
                        :key="j">{{cell.Title}}</el-menu-item>
                </el-menu-item-group>
            </el-menu>
        </el-aside><el-container>
            <el-header class="clearfix web-header" height="48px" v-if="showMenu">
                <span class="fl">{{TAB_TITLE}}</span>
                <div class="head-right fr" v-if="activeRouter !== 'Login'">
                    <span class="link" @click="logout">登出</span>
                </div>
            </el-header>
            <el-main><router-view></router-view></el-main>
        </el-container>
    </el-container>
</template>

<script>
import { mapGetters } from 'vuex';
import {
    FETCH_MENUS,
    FETCH_TEAMS,
    FETCH_ACTIONS,
    CHANGE_ISH5,
    CHANGE_TAB_TITLE
} from '@vuex/actions';
import { LOGIN_MENUS } from '@_public/router.config';

export default {
    data() {
        return {
            activeRouter: 'Login',
            showH5Nav: false,
            showMenu: true,
            tabTitle: ''
        };
    },
    watch: {
        '$route'(route) {
            this.activeRouter = route.name;
            sessionStorage.setItem('routeHistory', JSON.stringify({
                name: route.name,
                params: route.params || {},
                query: route.query || {}
            }));
        }
    },
    computed: {
        ...mapGetters(['TAB_TITLE', 'MENUS']),
        showArrow() {
            return this.$route.name !== 'Login' && this.$route.name !== 'Home';
        }
    },
    beforeMount() {
        this.getSessionInfo();
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
            sessionStorage.removeItem('appInfo');
            this.$store.dispatch({
                type: FETCH_MENUS,
                res: LOGIN_MENUS
            });
            if (this.showH5Nav) {
                this.showH5Nav = false;
            }
            this.activeRouter = 'Login';
            this.$router.push({ name: 'Login' });
        },
        goBack() {
            this.$router.back();
        },
        getSessionInfo() {
            const routeHistory = sessionStorage.getItem('routeHistory');
            const appInfo = sessionStorage.getItem('appInfo');
            const tabTitle = sessionStorage.getItem('tabTitle');
            
            if (appInfo) {
                const menus = sessionStorage.getItem('menus') || [];
                let tmp = JSON.parse(appInfo);
                this.$store.dispatch({
                    type: FETCH_MENUS,
                    res: JSON.parse(menus) || []
                });
                this.$store.dispatch({
                    type: FETCH_TEAMS,
                    res: tmp.teams || []
                });
                this.$store.dispatch({
                    type: FETCH_ACTIONS,
                    res: tmp.actions || []
                });
                this.$store.dispatch({
                    type: CHANGE_TAB_TITLE,
                    title: tabTitle
                });
                if (routeHistory) {
                    this.activeRouter = JSON.parse(routeHistory).name;
                    this.$router.push(JSON.parse(routeHistory));
                } else {
                    this.$router.push({ name: 'ESSList' });
                    sessionStorage.setItem('routeHistory', JSON.stringify({ name: 'ESSList' }));
                }
            } else {
                this.$router.push({ name: 'Login' });
            }
        },
        routerHandle(name) {
            this.$nextTick(() => {
                this.activeRouter = name;
                this.$store.dispatch({
                    type: CHANGE_TAB_TITLE,
                    title: this.tabTitle
                });
                sessionStorage.setItem('tabTitle', this.tabTitle);
                this.$router.push({ name });
            });
        },
        openLink(menu) {
            if (menu.Href) {
                window.open(menu.Href, '_blank');
                this.activeRouter = '';
                this.$nextTick(() => {
                    this.activeRouter = 'Login';
                });
            } else {
                this.tabTitle = menu.Title;
            }
            if (!this.showMenu) {
                this.showH5Nav = false;
            }
        },
        displayMenu() {
            this.showH5Nav = !this.showH5Nav;
        }
    }
};
</script>

<style lang="less">
.public-container {
    width: 100%;
    height: 100%;
    .web-header {
        font-size: 20px;
        line-height: 48px;
        background-color: #fff;
        border-bottom: 1px solid #C1D4E5;
        .head-right {
            font-size: 14px;
            font-weight: normal;
            span + span {
                margin-left: 20px;
            }
        }
    }
    .h5-header {
        color: #1473b7;
        background-color: #fff;
        font-size: .32rem;
        height: .74rem !important;
        line-height: .74rem;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 9;
        border-bottom: 1px solid #C1D4E5;
        text-align: center;
        .el-icon-arrow-left, .el-icon-menu {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            font-size: .36rem;
        }
        .el-icon-arrow-left {
            left: 0.3rem;
        }
        .el-icon-menu {
            right: 0.3rem;
        }
    }
    .aside-menu {
        height: 100%;
        .el-menu-item {
            width: 100%;
            height: 48px;
            line-height: 48px;
            min-width: auto;
            & [class^=el-icon-] {
                color: #fff;
            }
            &.is-active {
                background-color: #1473b7 !important;
                &:hover {
                    background-color: #1473b7 !important;
                }
            }
            &:hover {
                background-color: #071826 !important;
            }
        }
        .el-menu-item-group__title {
            background-color: #0b253c;
        }
    }
    .h5-nav {
        position: absolute;
        top: 0.74rem;
        left: 0;
        bottom: 0;
        width: 100% !important;
        z-index: 99;
    }
    .el-main {
        overflow: auto;
        padding: 0;
        background-color: #e5edf4;
    }
    .el-footer {
        border-top: 1px solid #c1d4e5;
    }
}
</style>
