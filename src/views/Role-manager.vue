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
                        :value="item.TeamID"
                        :label="item.TeamName"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="角色权限" v-if="isNew || form.ID">
                <el-checkbox-group v-model="form.action">
                    <el-checkbox v-for="item in actions" :key="item.value" :label="item.label" :value="item.value"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="角色菜单" v-if="isNew || form.ID"></el-form-item>
            <el-form-item>
                <el-button type="primary" size="mini">保存</el-button>
            </el-form-item>
        </el-form>
    </main-wrapper>
</template>

<script>
import { CHANGE_TAB_TITLE } from '@vuex/actions';
import MainWrapper from '@components/main-wrapper';
// import RoleList from '@components/role-manager/role-list';

export default {
    components: {
        MainWrapper
    },
    data() {
        return {
            isNew: false,
            allRole: [],
            curRole: '',
            form: {
                ID: '',
                Title: '',
                TeamID: [],
                action: []
            },
            teams: [],
            actions: [{
                label: '查看员工清单',
                value: 'act_disempeelist'
            }, {
                label: '入职员工',
                value: 'act_empeeonboard'
            }, {
                label: '编辑员工信息',
                value: 'act_editempee'
            }, {
                label: '员工异动',
                value: 'act_transempee'
            }, {
                label: '员工调薪',
                value: 'act_revisesalary'
            }, {
                label: '员工离职',
                value: 'act_leaveempee'
            }, {
                label: '查看合同清单',
                value: 'act_discontractlist'
            }, {
                label: '入力实际作业时间',
                value: 'act_inputactualhours'
            }, {
                label: '更新简历',
                value: 'act_updateresume'
            }, {
                label: '生成（取消）请求书',
                value: 'act_createinvoice'
            }, {
                label: '查看请求书清单',
                value: 'act_disinvoicelist'
            }, {
                label: '资金回收',
                value: 'act_collectsales'
            }, {
                label: '查看现金流清单',
                value: 'act_discashflowlist'
            }, {
                label: '查看现金流图形报表',
                value: 'act_discfchart'
            }, {
                label: 'ESS查看现金流清单',
                value: 'act_disesscashflow'
            }],
            routeName: [{
                label: '', name: ''
            }]
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.$store.dispatch({
                type: CHANGE_TAB_TITLE,
                title: '角色管理'
            });
            vm.getRoleList();
            vm.getTeams();
        });
    },
    methods: {
        getTeams() {
            this.$axios({
                url: '/api/teamsforselect'
            }).then(res => {
                this.teams = res || [];
            });
        },
        getRoleList() {
            this.$axios({
                url: '/api/getrolelist',
            }).then(res => {
                if (res.code === 0) {
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
        getRoleAllInfo() {
            this.$axios({
                url: '/api/getroleinfobyid',
                params: {
                    ID: this.form.ID
                }
            }).then(res => {
                if (res.code === 0) {
                    this.form.Title = res.data.Title;
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
            }
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
