<template>
    <main-wrapper class="role-manager">
        <div style="text-align: right">
            <el-button type="primary" size="mini" @click="newHandler">{{isNew ? '取消新增' : '新增角色'}}</el-button>
        </div>
        <el-form size="mini" label-width="100px">
            <el-form-item label="角色清单">
                <el-radio-group class="role-list clearfix" v-model="form.ID" @change="changeRole">
                    <el-radio :disabled="isNew" v-for="item in this.allRole" :key="item.ID" :label="item.ID">{{item.Title}}</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="角色名称" v-if="isNew || form.ID">
                <el-input style="width: 30%;" v-model="form.Title" :maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="可管理Team" v-if="isNew || form.ID">
                <el-checkbox-group v-model="form.TeamID">
                    <el-checkbox
                        v-for="item in teams"
                        :key="item.TeamID"
                        :label="item.TeamID">{{item.TeamName}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="角色权限" v-if="isNew || form.ID">
                <el-checkbox-group v-model="form.action">
                    <el-checkbox v-for="item in actions" :key="item.Action" :label="item.Action">{{item.Title}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="角色菜单" v-if="isNew || form.ID">
                <div id="menuTree">
                    <role-menu-tree
                        v-for="(item, i) in menus"
                        :data="item"
                        :total="menus.length"
                        :key="item.key"
                        :index="i"
                        :deep="deep"
                        @addMenu="addMenuHandler"
                        @delete="deleteMenu"></role-menu-tree>
                </div>
            </el-form-item>
            <el-form-item v-if="isNew || form.ID">
                <el-button type="primary" size="mini" @click="beforeSubmit">{{isNew ? '新增' : '保存'}}</el-button>
            </el-form-item>
        </el-form>
    </main-wrapper>
</template>

<script>
// import { CHANGE_TAB_TITLE } from '@vuex/actions';
import MainWrapper from '@components/main-wrapper';
import RoleMenuTree from '@components/role-manager/menu-tree';
import Sortable from 'sortablejs';

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
                ID: '',
                Title: '',
                TeamID: [],
                action: []
            },
            menus: [],
            deep: 0,
            teams: [],
            actions: [],
            routeName: [{
                label: '作业报告/工资详细清单', name: 'ESSList'
            }, {
                label: '提交作业报告', name: 'ESSEdit'
            }, {
                label: '合同签订', name: 'ContractEdit'
            }, {
                label: '员工编辑', name: 'EmployeeEdit'
            }, {
                label: '员工列表', name: 'EmployeeList'
            }, {
                label: '活动清单', name: 'SalesActivity'
            }, {
                label: '营业候选人', name: 'PreSales'
            }, {
                label: '员工清单', name: 'PreSalesList'
            }, {
                label: '合同列表', name: 'ContractList'
            }, {
                label: '角色权限', name: 'RoleManager'
            }, {
                label: '现金流', name: 'CashflowList'
            }, {
                label: '发票列表', name: 'InvoiceList'
            }, {
                label: '薪资核算', name: 'SalaryCalculate'
            }]
        };
    },
    provide() {
        return {
            routeName: this.routeName
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            // vm.$store.dispatch({
            //     type: CHANGE_TAB_TITLE,
            //     title: '角色管理'
            // });
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
        // 获取角色列表
        getRoleList() {
            this.$axios({
                url: '/api/getrolelist',
            }).then(res => {
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
                url: '/api/teamsforselect'
            }).then(res => {
                if (res) {
                    this.teams = res || [];
                }
            });
        },
        // 获取全部权限
        getAllActions() {
            this.$axios({
                url: '/api/actionsforselect'
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
            const loading = this.$loading({ lock: true, text: '正在获取角色权限信息' });
            this.$axios({
                url: '/api/getroleinfobyid',
                params: {
                    ID: this.form.ID
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
                    this.cacheFormID = res.data.ID;
                    this.form.Title = data.Title;
                    this.form.TeamID = (data.Teams && data.Teams).map(item => item.TeamID);
                    this.form.action = (data.Actions && data.Actions).map(item => item.action);
                    this.menus = this.formatArrToJson(data.Menus);
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
                this.form.ID = '';
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
                this.form.ID = this.cacheFormID;
                this.getRoleAllInfo();
            }
        },
        formatArrToJson(arr) {
            arr = arr || [];
            let tmp = {};
            let obj = {};

            arr.forEach(item => {
                item.key = parseInt(Math.random() * 10000);
                if (item.Level === 1) {
                    if (!item['children']) {
                        item.children = [];
                    }
                    tmp[item.Group] = item;
                }
                obj[item.ID] = item;
            });
            arr.forEach(item => {
                if (item.Level === 2) {
                    if (tmp[item.Group] && !tmp[item.Group]['children']) {
                        tmp[item.Group].children = [];
                    }
                    tmp[item.Group] && (tmp[item.Group].children[item.Order - 1] = item);
                }
            });
            let data = [];
            for (let key in tmp) {
                data[tmp[key].Order - 1] = tmp[key];
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
                teams: [],
                menus: []
            };
            this.$root.$off('FORM_VALID');
            if (this.form.ID) {
                params.ID = this.form.ID;
            }
            params.teams = this.form.TeamID.map(item => ({TeamID: item}));
            let fieldValueEmpty = false;
            this.menus.forEach((item, i) => {
                params.menus.push({
                    ID: item.ID || '',
                    Title: item.Title,
                    Name: item.Name,
                    Level: 1,
                    Group: i + 1,
                    Order: i + 1
                });
                if (item.children && item.children.length) {
                    item.children.forEach((cell, j) => {
                        if (!cell.Name || !cell.Title) {
                            fieldValueEmpty = true;
                        }
                        params.menus.push({
                            ID: cell.ID || '',
                            Title: cell.Title,
                            Name: cell.Name,
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
                if (this.form.action.includes(item.Action)) {
                    params[item.Action] = true;
                } else {
                    params[item.Action] = false;
                }
            });
            this.submit(params);
        },
        submit(params) {
            const loading = this.$loading({ lock: true, text: '正在提交角色权限信息' });
            this.$axios({
                method: 'POST',
                url: '/api/updaterole',
                params,
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    if (params.ID) {
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
        }
    }
};
</script>

<style lang="less">
.role-manager {
    .el-form-item {
        margin-bottom: 10px;
    }
}
</style>
