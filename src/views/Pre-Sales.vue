<template>
    <main-wrapper class="pre-sales">
        <div slot="header" class="main-header">
            <el-select v-model="status" multiple collapse-tags @visible-change="visibelChange" size="mini">
                <el-option v-for="item in empStatus" :key="item.val" :value="item.val" :label="item.label"></el-option>
            </el-select>
        </div>
        <div class="left">
            <el-button size="mini" type="primary" @click="showEmpDialog">添加营业候选人</el-button>
            <el-table size="small" :data="tableData" @cell-click="cellClick">
                <el-table-column label="员工号" prop="EmployeeID" width="100px"></el-table-column>
                <el-table-column label="姓名" prop="EmployeeName" min-width="140px" show-overflow-tooltip></el-table-column>
                <el-table-column label="Avaiable Date" prop="AvaiableDate" min-width="140px"></el-table-column>
                <el-table-column label="营业状态" prop="Status" width="140px">
                    <template slot-scope="scope">
                        <div>{{getStatusText(scope.row.Status)}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="进行中Case数" prop="CaseCount" min-width="120px"></el-table-column>
                <el-table-column label="操作" width="80px">
                    <template slot-scope="scope">
                        <el-button type="warning" size="mini" @click="showIntroDialog(scope.row)">编辑</el-button>
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
// import { CHANGE_TAB_TITLE } from '@vuex/actions';
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
            caseLoading: false,
            status: [1, 2, 3],
            empStatus: [{
                label: '開始', val: 1
            }, {
                label: '提案のみ', val: 2
            }, {
                label: '並行面談中', val: 3
            }, {
                label: '取消', val: 7
            }, {
                label: '失敗終了', val: 8
            }, {
                label: '成功終了', val: 9
            }]
        };
    },
    provide() {
        return {
            status: this.empStatus
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            // vm.$store.dispatch({
            //     type: CHANGE_TAB_TITLE,
            //     title: '营业候选人'
            // });
            vm.getListData();
        });
    },
    methods: {
        getListData() {
            const loading = this.$loading({ lock: true, text: '正在获取列表数据...' });
            let url = '/api/getpresaleslist';
            let params = this.status.map((item, i) => `statuses[${i}]=${item}`);
            this.$axios({
                url: `${url}?${params.join('&')}`,
                custom: {
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
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
                if (res && res.code === 0) {
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
        },
        showIntroDialog(data) {
            this.$root.$emit('SHOW_INTRO_DIALOG', {
                data,
                showDate: true,
                callback: () => {
                    this.getListData();
                }
            });
        },
        cellClick(row, column) {
            if (column.label !== '操作') {
                this.curItemID = row.ID;
                this.getCaseListData();
            }
        },
        getStatusText(val) {
            for (let item of this.empStatus) {
                if (item.val === val) {
                    return item.label;
                }
            }
        },
        visibelChange(val) {
            if (!val) {
                this.getListData();
            }
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
