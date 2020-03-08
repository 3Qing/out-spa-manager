<template>
    <main-wrapper class="role-manager">
        <el-form size="small" label-width="100px">
            <el-form-item label="角色名称">
                <el-input></el-input>
            </el-form-item>
            <el-form-item label="可管理Team">
                <el-checkbox-group v-model="form.team">
                    <el-checkbox
                        v-for="item in teams"
                        :key="item.TeamID"
                        :value="item.TeamID"
                        :label="item.TeamName"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="角色权限">
                <el-checkbox-group v-model="form.action">
                    <el-checkbox v-for="item in actions" :key="item.value" :label="item.label" :value="item.value"></el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="角色菜单"></el-form-item>
        </el-form>
    </main-wrapper>
</template>

<script>
import { CHANGE_TAB_TITLE } from '@vuex/actions';
import MainWrapper from '@components/main-wrapper';

export default {
    components: {
        MainWrapper
    },
    data() {
        return {
            form: {
                team: [],
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
            vm.getTeams();
        });
    },
    methods: {
        getTeams() {
            this.$axios({
                url: '/api/teamsforselect'
            }).then(res => {
                console.log(res);
                this.teams = res || [];
            });
        }
    }
};
</script>

<style scoped>

</style>
