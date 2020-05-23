import Vue from 'vue';
import App from './App';
import ElemenetUi from 'element-ui';
import Croppa from 'vue-croppa';
import axios from '@_public/axios';
import router from './router';
import store from './vuex/store';
// import JA from 'element-ui/lib/locale/lang/ja';
// import locale from 'element-ui/lib/locale';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/style/theme/index.css';
import './less/style.less';
import './less/media.less';
import './less/media-reset.less';

Vue.config.productionTip = false;

// 设置语言
// locale.use(JA);

Vue.use(ElemenetUi);
Vue.use(Croppa, { componentName: 'croppa' });

Vue.prototype.$axios = axios;

new Vue({
    store,
    router,
    render: h => h(App),
}).$mount('#app');
