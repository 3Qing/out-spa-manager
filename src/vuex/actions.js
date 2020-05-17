import * as mutations from './mutations';
export const CHANGE_ISH5 = 'CHANGE_ISH5';
export const CHANGE_TAB_TITLE = 'CHANGE_TAB_TITLE';
export const FETCH_MENUS = 'FETCH_MENUS';
export const FETCH_TEAMS = 'FETCH_TEAMS';
export const FETCH_ACTIONS = 'FETCH_ACTIONS';
export const CHANEG_USER_INFO = 'CHANEG_USER_INFO';

export const ACTIONS = {
    [CHANGE_ISH5]({ commit }, payload) {
        commit(mutations.SET_ISH5, payload.value);
    },
    [CHANGE_TAB_TITLE]({ commit }, payload) {
        commit(mutations.SET_TAB_TITLE, payload.title);
    },
    [FETCH_MENUS]({ commit }, payload) {
        commit(mutations.SET_MENUS, payload.res);
    },
    [FETCH_TEAMS]({ commit }, payload) {
        commit(mutations.SET_TEAMS, payload.res);
    },
    [FETCH_ACTIONS]({ commit }, payload) {
        commit(mutations.SET_ACTIONS, payload.res);
    },
    [CHANEG_USER_INFO]({ commit }, payload) {
        commit(mutations.SET_USER_INFO, payload.res);
    }
};
