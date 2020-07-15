<template>
    <el-container id="app" class="public-container">
        <el-header v-if="!showMenu" class="h5-header">
            <i class="el-icon-arrow-left" @click="goBack" v-if="showArrow"></i>
            <p>{{TAB_TITLE}}</p>
            <i class="el-icon-menu" @click="displayMenu"></i>
        </el-header>
        <el-aside :class="[!showMenu && 'h5-nav']" width="200px" v-if="showMenu || showH5Nav">
            <div class="logo"><img src="./assets/logo.png" alt="Logo"></div><el-menu
                class="aside-menu"
                background-color="#075096"
                active-text-color="#fff"
                text-color="#fff"
                :default-active="activeRouter"
                @select="routerHandle">
                <el-menu-item v-if="showH5Nav && $route.name !== 'Login'" @click="logout">登出</el-menu-item>
                <el-menu-item-group v-for="(item, i) in MENUS" :key="i">
                    <template slot="title">{{item.title}}</template>
                    <el-menu-item
                        v-for="(cell, j) in item.children"
                        :class="[cell.name === activeRouter && 'is-active']"
                        @click="openLink(cell)"
                        :index="`${cell.name || j}`"
                        :key="j">{{cell.title}}</el-menu-item>
                </el-menu-item-group>
            </el-menu>
        </el-aside><el-container>
            <el-header class="clearfix web-header" height="48px" v-if="showMenu">
                <span class="fl">{{TAB_TITLE}}</span>
                <div class="head-right fr" v-if="activeRouter !== 'Login'">
                    <span>{{USER_INFO.employeeNo}}</span>&nbsp;<span color="gray">|</span>&nbsp;<span>{{USER_INFO.name}}</span>
                    <span class="link" color="danger" @click="logout">登出</span>
                </div>
            </el-header>
            <el-main>
                <div class="overscool">
                    <div class="page-tag" v-if="routes.length">
                        <!-- <span class="positions">按钮1</span> -->
                        <el-tag
                            class="link"
                            v-for="(item, i) in routes"
                            :key="i"
                            @click.native="toView(item)"
                            :closable="routes.length !== 1"
                            effect="plain"
                            :type="item.name === activeRouter ? '' : 'info'"
                            @close="closeRoute(item, i)">{{item.title}}</el-tag>
                        <!-- <span class="positions">按钮2</span> -->
                    </div>
                </div>
                <router-view></router-view>
            </el-main>
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
    CHANGE_TAB_TITLE,
    CHANEG_USER_INFO
} from '@vuex/actions';
import { LOGIN_MENUS } from '@_public/router.config';

export default {
    data() {
        return {
            activeRouter: 'Login',
            showH5Nav: false,
            showMenu: true,
            tabTitle: '',
            routes: []
        };
    },
    watch: {
        '$route'(route) {
            this.activeRouter = route.name;
            if (!this.routes.length && this.USER_INFO && route.name !== 'Login') {
                this.routes.push({
                    name: route.name,
                    title: this.TAB_TITLE
                });
            }
            sessionStorage.setItem('routeHistory', JSON.stringify({
                name: route.name,
                params: route.params || {},
                query: route.query || {}
            }));
        }
    },
    computed: {
        ...mapGetters(['TAB_TITLE', 'MENUS', 'USER_INFO']),
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
            localStorage.removeItem('names');
            sessionStorage.removeItem('appInfo');
            sessionStorage.removeItem('names');
            sessionStorage.removeItem('pageTag');
            this.$store.dispatch({
                type: FETCH_MENUS,
                res: LOGIN_MENUS
            });
            if (this.showH5Nav) {
                this.showH5Nav = false;
            }
            this.routes = [];
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
            const pageTag = sessionStorage.getItem('pageTag');
            
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
                    res: tmp.role || []
                });
                this.$store.dispatch({
                    type: CHANGE_TAB_TITLE,
                    title: tabTitle
                });
                this.$store.dispatch({
                    type: CHANEG_USER_INFO,
                    res: {
                        name: tmp.name,
                        employeeNo: tmp.employeeNo
                    }
                });
                if (routeHistory) {
                    this.activeRouter = JSON.parse(routeHistory).name;
                    this.$router.push(JSON.parse(routeHistory));
                } else {
                    this.$router.push({ name: 'ESSList' });
                    sessionStorage.setItem('routeHistory', JSON.stringify({ name: 'ESSList' }));
                }
                if (pageTag) {
                    this.routes = JSON.parse(pageTag);
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
                this.tabTitle = menu.title;
                const filter = this.routes.filter(item => item.name === menu.name);
                if (!filter.length) {
                    this.routes.push(menu);
                    sessionStorage.setItem('pageTag', JSON.stringify(this.routes));
                }
            }
            if (!this.showMenu) {
                this.showH5Nav = false;
            }
        },
        displayMenu() {
            this.showH5Nav = !this.showH5Nav;
        },
        toView(item) {
            this.$router.push(item);
        },
        closeRoute(data, i) {
            this.routes.splice(i, 1);
            if (data.name === this.activeRouter) {
                if (i === 0) {
                    this.$router.push(this.routes[i]);
                } else {
                    this.$router.push(this.routes[i - 1]);
                }
            }
            sessionStorage.setItem('PAGE_TAG', JSON.stringify(this.routes));
        }
    }
};
</script>

<style lang="less">
@height: 48px;
.public-container {
    width: 100%;
    height: 100%;
    .web-header {
        font-size: 20px;
        line-height: @height;
        background-color: #fff;
        border-bottom: 1px solid #C1D4E5;
        .head-right {
            font-size: 14px;
            font-weight: normal;
            span:nth-child(4) {
                margin-left: 20px;
            }
        }
    }
    .logo {
        width: 100%;
        font-size: 0;
        line-height: 1;
        img {
            width: 100%;
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
                background-color: #0b253c !important;
                // background-color: #1473b7 !important;
                &:hover {
                    background-color: #0b253c !important;
                    // background-color: #1473b7 !important;
                }
            }
            &:hover {
                background-color: #0b253c !important;
                // background-color: #071826 !important;
            }
        }
        .el-menu-item-group__title {
            color: #000;
            background-color: #075096;
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
        .overscool{
            position: relative;
        }
        .page-tag {
            height: @height;
            line-height: @height;
            background-color: #fff;
            border-bottom: 1px solid #C1D4E5;
            .positions{
                position: fixed;
                right: 0;
            }
            .el-tag {
                height: @height;
                line-height: @height;
                border-top: none;
                border-radius: 0;
                // border-bottom: 0;
                &.el-tag--plain {
                    border-color: #d3d4d6;
                }
                & + .el-tag {
                    border-left: none;
                }
            }
        }
    }
    .el-footer {
        border-top: 1px solid #c1d4e5;
    }
}
</style>
