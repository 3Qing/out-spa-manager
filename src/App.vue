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
                <el-menu-item-group v-for="(item, i) in MENUS" :key="i">
                    <template slot="title">{{item.menu.Title}}</template>
                    <el-menu-item
                        v-for="(submenu, j) in item.submenu"
                        :class="[submenu.Name === activeRouter && 'is-active']"
                        @click="openLink(submenu)"
                        :index="`${submenu.Name || j}`"
                        :key="j">{{submenu.Title}}</el-menu-item>
                </el-menu-item-group>
            </el-menu>
        </el-aside><el-container>
            <el-header class="clearfix web-header" height="48px" v-if="showMenu">
                <span class="fl">{{$route.meta.title}}</span>
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
    CHANGE_ISH5
} from '@vuex/actions';
import { LOGIN_MENUS } from '@_public/router.config';

export default {
    data() {
        return {
            activeRouter: 'Login',
            showH5Nav: false,
            showMenu: true
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
            this.activeRouter = 'Login';
            this.$router.push({ name: 'Login' });
        },
        goBack() {
            this.$router.back();
        },
        getSessionInfo() {
            const routeHistory = sessionStorage.getItem('routeHistory');
            const appInfo = sessionStorage.getItem('appInfo');
            
            if (appInfo) {
                let tmp = JSON.parse(appInfo);
                this.$store.dispatch({
                    type: FETCH_MENUS,
                    res: tmp.menus || []
                });
                this.$store.dispatch({
                    type: FETCH_TEAMS,
                    res: tmp.teams || []
                });
                this.$store.dispatch({
                    type: FETCH_ACTIONS,
                    res: tmp.actions || []
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
        routerHandle(index) {
            this.activeRouter = index;
            this.$router.push({ name: index });
        },
        openLink(menu) {
            if (menu.Href) {
                window.open(menu.Href, '_blank');
            }
        },
        displayMenu() {
            this.showH5Nav = !this.showH5Nav;
        }
    }
};
</script>

<style lang="less">
// #app {
//     width: 100%;
//     height: 100%;
// }
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
