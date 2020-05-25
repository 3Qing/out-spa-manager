<template>
    <main-wrapper class="role-manager">
        <div style="text-align: right">
            <el-button type="danger" size="mini" @click="delRole">删除角色</el-button>
            <el-button type="warning" size="mini" @click="copyRole">ロールコピー</el-button>
            <el-button type="primary" size="mini" @click="newHandler">{{isNew ? '取消新增' : '新增角色'}}</el-button>
        </div>
        <el-form size="mini" label-width="100px">
            <el-form-item label="ロール一覧">
                <el-radio-group class="role-list clearfix" v-model="form.id" @change="changeRole">
                    <el-radio :disabled="isNew" v-for="item in this.allRole" :key="item.id" :label="item.id">{{item.title}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="ロール名" v-if="isNew || form.id">
                <el-input style="width: 30%;" v-model="form.Title" :maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="管理部門" v-if="isNew || form.id">
                <el-checkbox-group v-model="form.TeamID">
                    <el-checkbox
                        v-for="item in teams"
                        :key="item.id"
                        :label="item.id">{{item.teamName}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="権限" v-if="isNew || form.id">
                <el-checkbox-group v-model="form.action">
                    <el-checkbox v-for="item in actions" :key="item.id" :label="item.id">{{item.title}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="メニュー" v-if="isNew || form.id">
                <el-button
                    v-if="IS_H5"
                    class="add-btn"
                    type="primary"
                    size="mini"
                    @click="addMenuHandler">新規追加</el-button>
                <div id="menuTree">
                    <role-menu-tree
                        v-for="(item, i) in menus"
                        :data="item"
                        :total="menus.length"
                        :key="item.key"
                        :index="i"
                        :deep="deep"
                        :opt="opt"
                        @delete="deleteMenu"></role-menu-tree>
                </div>
                <el-button
                    v-if="!IS_H5"
                    class="add-btn"
                    type="primary"
                    size="mini"
                    @click="addMenuHandler">新規追加</el-button>
            </el-form-item>
            <el-form-item v-if="isNew || form.id">
                <el-button type="primary" size="mini" @click="beforeSubmit">{{isNew ? '新規' : '保存'}}</el-button>
            </el-form-item>
            <!-- <el-dialog :visible="visible" title="ロールコピー" @close="close">
                <el-form label-suffix="：" label-width="80px">
                    <el-form-item label="角色">
                        <el-radio-group class="role-list clearfix" v-model="curRoleId">
                            <el-radio v-for="item in this.allRole" :key="item.id" :label="item.id">{{item.title}}</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <div slot="footer">
                    <el-button size="mini" @click="close">取消</el-button>
                    <el-button type="primary" size="mini" @click="copyRole">実行</el-button>
                </div>
            </el-dialog> -->
        </el-form>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import RoleMenuTree from '@components/role-manager/menu-tree';
import Sortable from 'sortablejs';
import { mapGetters } from 'vuex';

export default {
    components: {
        MainWrapper,
        RoleMenuTree
    },
    data() {
        return {
            isNew: false,
            allRole: [],
            curRole: '',
            cacheFormID: '',
            form: {
                id: '',
                Title: '',
                TeamID: [],
                action: []
            },
            menus: [],
            deep: 0,
            teams: [],
            actions: [],
            opt: {},
            visible: false,
            curRoleId: ''
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getRouteInfo();
            vm.getRoleList();
            vm.getAllTeams();
            vm.getAllActions();
        });
    },
    watch: {
        menus: {
            handler: function() {
                this.initSort();
            },
            deep: true
        }
    },
    computed: {
        ...mapGetters(['IS_H5', 'GET_LOADING'])
    },
    methods: {
        initSort() {
            this.$nextTick(() => {
                const treeItem = this.$el.querySelectorAll('.role-tree-item');
                if (treeItem) {
                    const tmp = [];
                    Sortable.create(this.$el.querySelector('#menuTree'), {
                        handle: '.el-icon-rank',
                        onEnd: ({ newIndex, oldIndex }) => {
                            const tmp = [...this.menus];
                            const curItem = tmp.splice(oldIndex, 1)[0];
                            tmp.splice(newIndex, 0, curItem);
                            this.menus = [...tmp];
                        }
                    });
                    treeItem.forEach(item => {
                        tmp.push(item);
                        Sortable.create(item, {
                            group: 'nested',
                            handle: '.el-icon-rank',
                            onEnd: ({ newIndex, oldIndex, to, from }) => {
                                const treeDom = document.querySelectorAll('.role-menu-tree');
                                let parentOldIndex = -1;
                                let parentNewIndex = -1;
                                const arr = JSON.parse(JSON.stringify(this.menus));
                                for (let i = 0; i < treeDom.length; i++) {
                                    if (treeDom[i].childNodes.length > 1 && treeDom[i].childNodes[1] === from) {
                                        parentOldIndex = i;
                                    }
                                    if (treeDom[i].childNodes.length > 1 && treeDom[i].childNodes[1] === to) {
                                        parentNewIndex = i;
                                    }
                                }
                                const curItem = arr[parentOldIndex].children.splice(oldIndex, 1)[0];
                                arr[parentNewIndex].children.splice(newIndex, 0, curItem);
                                this.menus = [...arr];
                            }
                        });
                    });
                }
            });
        },
        // 获取路由信息
        getRouteInfo() {
            this.$axios({
                url: '/api/Role/api_getroutelist'
            }).then(res => {
                if (res && res.code === 0) {
                    this.$set(this.opt, 'routeData', res.data || []);
                } else {
                    this.$message({
                        type: 'error',
                        message: res ? res.message : '接口开小差了，没有返回信息'
                    });
                }
            });
        },
        // 获取角色列表
        getRoleList() {
            const loading = this.$loading({ lock: true, text: this.GET_LOADING });
            this.$axios({
                url: '/api/Role/api_getrolelist',
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.allRole = res.data || [];
                } else {
                    this.$message({
                        type: 'error',
                        showClose: true,
                        message: res.message ? res.message : '接口开小差了，没有返回信息'
                    });
                }
            });
        },
        // 获取全部Team
        getAllTeams() {
            this.$axios({
                url: '/api/Team/api_teamsforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.teams = res.data || [];
                }
            });
        },
        // 获取全部权限
        getAllActions() {
            this.$axios({
                url: '/api/Role/api_actionsforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.actions = res.data || [];
                } else {
                    this.actions = [];
                }
            });
        },
        // 获取角色权限信息
        getRoleAllInfo() {
            const loading = this.$loading({ lock: true, text: 'ロール情報取得中...' });
            this.$axios({
                url: '/api/Role/api_getroleinfobyid',
                params: {
                    id: this.form.id
                },
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    const data = res.data || {};
                    this.menus = [];
                    this.cacheFormID = res.data.id;
                    this.form.Title = data.title;
                    this.form.TeamID = (data.roleTeams && data.roleTeams).map(item => item.teamID);
                    // this.form.action = (data.actions && data.actions).map(item => item.id);
                    let action = [];
                    for (let k in data) {
                        if (k.indexOf('act') > -1 && data[k]) {
                            action.push(k);
                        }
                    }
                    this.form.action = action;
                    this.menus = this.formatArrToJson(data.menus);
                } else {
                    this.form.Title = '';
                    this.form.TeamID = [];
                    this.form.action = [];
                    this.form.menus = [];
                }
            });
        },
        changeRole(roleID) {
            this.getRoleAllInfo(roleID);
        },
        newHandler() {
            this.isNew = !this.isNew;
            if (this.isNew) {
                this.form.id = '';
                this.form.Title = '';
                this.form.TeamID = [];
                this.form.action = [];
                this.menus = [{
                    Title: '',
                    Name: '',
                    FatherID: 0,
                    children: []
                }];
            } else {
                this.form.id = this.cacheFormID;
                this.getRoleAllInfo();
            }
        },
        formatArrToJson(arr) {
            arr = arr || [];
            let tmp = {};
            let obj = {};

            arr.forEach(item => {
                item.key = parseInt(Math.random() * 10000);
                if (item.level === 1) {
                    if (!item['children']) {
                        item.children = [];
                    }
                    tmp[item.group] = item;
                }
                obj[item.id] = item;
            });
            arr.forEach(item => {
                if (item.level === 2) {
                    if (tmp[item.group] && !tmp[item.group]['children']) {
                        tmp[item.group].children = [];
                    }
                    tmp[item.group] && (tmp[item.group].children[item.order - 1] = item);
                }
            });
            let data = [];
            for (let key in tmp) {
                data[tmp[key].order - 1] = tmp[key];
            }
            if (!data.length) {
                data.push({
                    Title: '',
                    Name: '',
                    key: parseInt(Math.random() * 10000),
                    children: []
                });
            }
            return data;
        },
        addMenuHandler() {
            this.$set(this.menus, this.menus.length, {
                Title: '',
                Name: '',
                key: Math.random() * 1000,
                children: []
            });
        },
        deleteMenu(index) {
            this.menus.splice(index, 1);
        },
        beforeSubmit() {
            if (!this.form.Title) {
                this.$message({
                    type: 'warning',
                    message: '请填写角色名称'
                });
                return;
            }
            const params = {
                Title: this.form.Title || '',
                RoleTeams: [],
                Menus: []
                // UpdateTime: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
                // CompanyID: 0
            };
            this.$root.$off('FORM_VALID');
            if (this.form.id) {
                params.ID = this.form.id;
            }
            params.RoleTeams = this.form.TeamID.map(item => ({TeamID: item}));
            let fieldValueEmpty = false;
            this.menus.forEach((item, i) => {
                params.Menus.push({
                    ID: item.id || 0,
                    Title: item.title,
                    Name: item.name || '',
                    Level: 1,
                    Group: i + 1,
                    Order: i + 1
                });
                if (item.children && item.children.length) {
                    item.children.forEach((cell, j) => {
                        if (!cell.name || !cell.title) {
                            fieldValueEmpty = true;
                        }
                        params.Menus.push({
                            ID: cell.id || 0,
                            Title: cell.title,
                            Name: cell.name || '',
                            Level: 2,
                            Group: i + 1,
                            Order: j + 1
                        });
                    });
                }
            });
            if (fieldValueEmpty) {
                this.$message({
                    type: 'warning',
                    message: '二级菜单的名称和Name不得为空'
                });
                return;
            }
            this.actions.forEach(item => {
                if (this.form.action.includes(item.id)) {
                    params[item.id] = true;
                } else {
                    params[item.id] = false;
                }
            });
            this.submit(params);
        },
        submit(params) {
            const loading = this.$loading({ lock: true, text: '正在提交角色权限信息' });
            this.$axios({
                method: 'POST',
                url: '/api/Role/api_updaterole',
                params,
                custom: {
                    loading,
                    vm: this
                },
                formData: true
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    if (params.id) {
                        this.getRoleAllInfo();
                    } else {
                        this.isNew = false;
                        this.getRoleList();
                    }
                } else {
                    this.$message({
                        type: 'error',
                        message: res.message
                    });
                }
            });
        },
        showDialog() {
            this.visible = true;
        },
        close() {
            this.visible = false;
            this.curRoleId = '';
        },
        copyRole() {
            this.$confirm('是否拷贝角色', '拷贝', {}).then(() => {
                const loading = this.$loading({ lock: true, text: '正在提交信息中' });
                this.$axios({
                    url: '/api/Role/api_copyrole',
                    params: {
                        roleid: this.form.id
                    }
                }).then(res => {
                    loading.close();
                    if (res && res.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '拷贝成功'
                        });
                        this.getRoleList();
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.message
                        });
                    }
                });
            }).catch(() => {});
        },
        delRole() {
            this.$confirm('是否删除角色', '删除', {}).then(() => {
                const loading = this.$loading({ lock: true, text: '正在提交信息中' });
                this.$axios({
                    url: '/api/Role/api_deleterole',
                    params: {
                        roleid: this.form.id
                    }
                }).then(res => {
                    loading.close();
                    if (res && res.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                        this.form = {
                            id: '',
                            Title: '',
                            TeamID: [],
                            action: []
                        };
                        this.getRoleList();
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.message
                        });
                    }
                });
            }).catch(() => {});
        }
    }
};
</script>

<style lang="less">
.role-manager {
    .el-form-item {
        margin-bottom: 10px;
    }
    #menuTree {
        max-width: 1000px;
        width: 80%;
        display: inline-block;
        vertical-align: top;
        margin-right: 20px;
    }
}
</style>
