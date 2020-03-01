import Vue from 'vue';
import Router from 'vue-router';

import Login from '@views/Login';
import Home from '@views/Home';
// import Public from '@components/public';
import EssList from '@views/ESS-list';
import EssEdit from '@views/ESS-edit';
import ContractSign from '@views/Contract-sign';

Vue.use(Router);

// 复写push方法 修复导航错误
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
};

const router = new Router({
    routes: [{
        path: '/login',
        name: 'Login',
        meta: {
            title: '登入'
        },
        component: Login
    }, {
        path: '/',
        name: 'Home',
        meta: {
            title: '首页'
        },
        component: Home
    }, {
        path: '/esslist',
        name: 'ESSList',
        meta: {
            title: '作业报告/工资详细清单'
        },
        component: EssList
    }, {
        path: '/essedit/:id',
        name: 'ESSEdit',
        meta: {
            title: '提交作业报告'
        },
        component: EssEdit
    }, {
        path: '/contract/:id',
        name: 'ContractEdit',
        meta: {
            title: '合同签订'
        },
        component: ContractSign
    }, {
        path: '/contract/new',
        name: 'ContractNew',
        meta: {
            title: '合同签订'
        },
        component: ContractSign
    }
    // {
    //     path: '',
    //     component: Public,
    //     children: []
    // }
    ]
});

router.beforeEach((to, from, next) => {
    const appInfo = sessionStorage.getItem('appInfo');
    if (appInfo) {
        if (to.path === '/login') {
            next('/');
        } else {
            next();
        }
    } else {
        if (to.path === '/login') {
            next();
        } else {
            next('/login');
        }
    }
})

export default router;