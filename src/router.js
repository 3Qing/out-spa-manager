import Vue from 'vue';
import Router from 'vue-router';

import Login from '@views/Login';
import Home from '@views/Home';
import EssList from '@views/ESS-list';
import EssEdit from '@views/ESS-edit';
import ContractSign from '@views/Contract-sign';
import EmployeeEdit from '@views/Employee-edit';
import EmployeeList from '@views/Employee-list';
import SalesActivity from '@views/Sales-activity';
import PreSales from '@views/Pre-sales';
import RoleManager from '@views/Role-manager';
import PreSalesList from '@views/Pre-sales-list';
import ContractList from '@views/Contract-list';
import CashflowList from '@views/Cashflow-list';
import InvoiceList from '@views/Invoice-list';
import SalaryCalculate from '@views/Salary-calculate';
import QAManager from '@views/QA-manager';
import UserManager from '@views/User-manager';
import SalaryDetail from '@views/Salary-detail';
import ResumeList from '@views/Resume-list';
import ResumeUpdate from '@views/Resume-update';


Vue.use(Router);

// 复写push方法 修复导航错误
const originalPush = Router.prototype.push;
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err);
};

const router = new Router({
    mode: 'hash',
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
    }, {
        path: '/employee/:id',
        name: 'EmployeeEdit',
        component: EmployeeEdit
    }, {
        path: '/employee/new',
        name: 'EmployeeNew',
        component: EmployeeEdit
    }, {
        path: '/employee',
        name: 'EmployeeList',
        component: EmployeeList
    }, {
        path: '/salesactivity',
        name: 'SalesActivity',
        component: SalesActivity
    }, {
        path: '/presales',
        name: 'PreSales',
        component: PreSales
    }, {
        path: '/presaleslist',
        name: 'PreSalesList',
        component: PreSalesList
    }, {
        path: '/contractlist',
        name: 'ContractList',
        component: ContractList
    }, {
        path: '/rolemanager',
        name: 'RoleManager',
        component: RoleManager
    }, {
        path: '/cashflowlist',
        name: 'CashflowList',
        component: CashflowList
    }, {
        path: '/invoicelist',
        name: 'InvoiceList',
        component: InvoiceList
    }, {
        path: '/salarycalculate',
        name: 'SalaryCalculate',
        component: SalaryCalculate
    }, {
        path: '/qamanager',
        name: 'QAManager',
        component: QAManager
    }, {
        path: '/usermanager',
        name: 'UserManager',
        component: UserManager
    }, {
        path: '/salarydetail',
        name: 'SalaryDetail',
        component: SalaryDetail
    }, {
        path: '/resumelist',
        name: 'ResumeList',
        component: ResumeList
    }, {
        path: '/resumeupdate/:epId/:id',
        name: 'ResumeUpdate',
        component: ResumeUpdate
    }
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
});

export default router;