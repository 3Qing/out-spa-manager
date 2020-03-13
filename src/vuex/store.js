import Vue from 'vue';
import Vuex from 'vuex';

import * as actions from './actions';
import * as mutations from './mutations';

import { LOGIN_MENUS } from '@_public/router.config';

Vue.use(Vuex);

const generatorGetters = state => {
    let getters = {};
    if (typeof state !== 'object' || state instanceof Array) return {};
    for (let key in state) {
        if (key in state) {
            const name = key.replace(/([A-Z])/g, '_$1').toUpperCase();
            getters[name] = state => state[key];
        }
    }
    return getters;
};

const state = {
    isH5: false,
    tabTitle: '首页',
    menus: LOGIN_MENUS,
    actions: [],
    teams: []
};

export default new Vuex.Store({
    state,
    getters: generatorGetters(state),
    actions: actions.ACTIONS,
    mutations: mutations.MUTATIONS
});
