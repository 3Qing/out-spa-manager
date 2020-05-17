export const SET_ISH5 = 'SET_ISH5';
export const SET_TAB_TITLE = 'SET_TAB_TITLE';
export const SET_MENUS = 'SET_MENUS';
export const SET_TEAMS = 'SET_TEAMS';
export const SET_ACTIONS = 'SET_ACTIONS';
export const SET_USER_INFO = 'SET_USER_INFO';

export const MUTATIONS = {
    [SET_ISH5](state, res) {
        state.isH5 = res;
    },
    [SET_TAB_TITLE](state, res) {
        state.tabTitle = res;
    },
    [SET_MENUS](state, menus) {
        state.menus = menus;
    },
    [SET_TEAMS](state, teams) {
        state.teams = teams;
    },
    [SET_ACTIONS](state, actions) {
        const auth = [];
        for (let key in actions) {
            if (key.indexOf('act') > -1 && actions[key]) {
                auth.push(key);
            }
        }
        state.actions = auth;
    },
    [SET_USER_INFO](state, data) {
        state.userInfo = data;
    }
};
