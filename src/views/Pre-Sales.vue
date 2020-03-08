<template>
    <main-wrapper class="pre-sales">
        <div class="left">
            <el-button size="mini" type="primary" @click="showEmpDialog">添加营业候选人</el-button>
            <el-table size="small" :data="tableData">
                <el-table-column label="员工号" prop="EmployeeID" width="100px"></el-table-column>
                <el-table-column label="姓名" prop="EmployeeName" show-overflow-tooltip></el-table-column>
                <el-table-column label="Avaiable Date" prop="AvaiableDate" width="140px"></el-table-column>
                <el-table-column label="营业状态" prop="Status"></el-table-column>
                <el-table-column label="进行中Case数" prop="CaseCount" width="120px"></el-table-column>
                <el-table-column label="操作" width="80px">
                    <template>
                        <el-button type="warning" size="mini">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="right">
            <case-list
                :loading="caseLoading"
                :data="caseListData"
                :itemID="curItemID"
                @update="getCaseListData"></case-list>
        </div>
        <intro-dialog></intro-dialog>
        <employee-dialog></employee-dialog>
    </main-wrapper>
</template>

<script>
import { CHANGE_TAB_TITLE } from '@vuex/actions';
import MainWrapper from '@components/main-wrapper';
import CaseList from '@components/pre-sales/case-list';
import EmployeeDialog from '@components/pre-sales/employee-dialog';
import IntroDialog from '@components/pre-sales/intro-dialog';

export default {
    components: {
        MainWrapper,
        CaseList,
        EmployeeDialog,
        IntroDialog
    },
    data() {
        return {
            tableData: [],
            caseListData: [],
            curItemID: -1,
            caseLoading: false
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.$store.dispatch({
                type: CHANGE_TAB_TITLE,
                title: '营业候选人'
            });
            vm.getListData();
        });
    },
    methods: {
        getListData() {
            this.$axios({
                url: '/api/getpresaleslist',
                params: {
                    statuses: 1
                }
            }).then(res => {
                if (res.code === 0) {
                    const result = res.data || [];
                    this.tableData = result;
                    if (result.length) {
                        this.curItemID = result[0].ID;
                        this.getCaseListData();
                    }
                } else {
                    this.$message({
                        type: 'error',
                        showClose: true,
                        message: res.message ? res.message : '接口开小差了，没有返回信息'
                    });
                }
            });
        },
        getCaseListData() {
            this.caseLoading = true;
            this.$axios({
                url: '/api/getpresalesinfobyid',
                params: {
                    ID: this.curItemID
                }
            }).then(res => {
                this.caseLoading = false;
                if (res.code === 0) {
                    this.caseListData = res.data || [];
                } else {
                    this.$message({
                        type: 'error',
                        showClose: true,
                        message: res.message ? res.message : '接口开小差了，没有返回信息'
                    });
                }
            }).catch(() => {
                this.caseLoading = false;
            });
        },
        showEmpDialog() {
            this.$root.$emit('SHOW_EMPLOYEE_DAILOG', {
                callback: () => {
                    this.getListData();
                }
            });
        }
    }
};
</script>

<style lang="less">
.pre-sales {
    .content-wrapper {
        &:after {
            content: '';
            display: block;
            width: 100%;
            height: 0;
            clear: both;
        }
    }
    .left {
        float: left;
        width: 60%;
    }
    .right {
        width: 40%;
        float: left;
        padding-left: 20px;
        box-sizing: border-box;
    }
}
</style>
