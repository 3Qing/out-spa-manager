<template>
    <main-wrapper class="cashflow-list">
        <main-header-date slot="header" :form="form" :clearable="false" @update="changeHandle">
            <el-select placeholder="チーム" v-model="form.teamid" size="mini" clearable @change="changeHandle">
                <el-option v-for="item in teams" :key="item.TeamID" :label="item.TeamName" :value="item.TeamID"></el-option>
            </el-select>
            <el-select placeholder="従業員" v-model="form.employeeid" size="mini" clearable @change="changeHandle">
                <el-option v-for="item in employees" :key="item.ID" :label="item.Name" :value="item.ID"></el-option>
            </el-select>
            <el-input
                class="input-wrapper"
                placeholder="注文書番号"
                v-model="form.contractid"
                size="mini"
                clearable
                @blur="changeHandle"></el-input>
        </main-header-date>
        <el-table size="small" :data="tableData">
            <el-table-column label="注文書" prop="ContractID" show-overflow-tooltip></el-table-column>
            <el-table-column label="注文書タイトル" prop="ContractTitle" width="120px" show-overflow-tooltip></el-table-column>
            <el-table-column label="取引先" prop="CustomerName" show-overflow-tooltip></el-table-column>
            <el-table-column label="従業員番号" prop="EmployeeID" width="100px" show-overflow-tooltip></el-table-column>
            <el-table-column label="従業員名前" prop="EmployeeName" width="100px" show-overflow-tooltip></el-table-column>
            <el-table-column label="開始期間" prop="FromDate" width="100px"></el-table-column>
            <el-table-column label="終了期間" prop="ToDate" width="100px"></el-table-column>
            <el-table-column label="作業時間・承認状態">
                <el-table-column label="契約時間・円" prop="ContractHours" show-overflow-tooltip></el-table-column>
                <el-table-column label="実際時間" prop="ActualHours" show-overflow-tooltip></el-table-column>
            </el-table-column>
            <el-table-column label="注文単価・円（税抜）" prop="ContractSales" show-overflow-tooltip></el-table-column>
            <el-table-column label="見込売掛金">
                <el-table-column label="売掛金額・円（税込）" prop="PlanCollectSales" show-overflow-tooltip></el-table-column>
                <el-table-column label="予定回収日" prop="PlanCollectDate" width="100px"></el-table-column>
            </el-table-column>
            <el-table-column label="実際売掛金">
                <el-table-column label="実際回収額・円" prop="ActualCollectSales" show-overflow-tooltip></el-table-column>
                <el-table-column label="実際回収日" prop="ActualCollectDate" show-overflow-tooltip></el-table-column>
            </el-table-column>
            <el-table-column label="コスト">
                <el-table-column label="人件費・円" prop="ProjectSalary" show-overflow-tooltip></el-table-column>
                <el-table-column label="交通代・円" prop="TravelFare" show-overflow-tooltip></el-table-column>
            </el-table-column>
            <el-table-column label="粗利・円" prop="Profit" show-overflow-tooltip></el-table-column>
            <el-table-column label="請求書番号" prop="InvoiceNo" show-overflow-tooltip></el-table-column>
            <el-table-column label="アクション" width="350px">
                <template slot-scope="scope">
                    <el-button
                        type="primary"
                        v-for="item in scope.row.Actions"
                        size="mini"
                        @click="actionHandler(item, scope.row)"
                        :key="item.ID">{{item.Title}}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            :current-page="page"
            :page-size="pageSize"
            @current-change="changePn"
            :layout="IS_H5 ? 'prev, pager, next' : 'total, prev, pager, next, jumper'"
            :total="total"></el-pagination>
        <ess-dialog :visible="visible"></ess-dialog>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import MainHeaderDate from '@components/main-wrapper/header-date';
import EssDialog from '@components/cashflow-list/dialog';
import { mapGetters } from 'vuex';
export default {
    components: {
        MainWrapper,
        MainHeaderDate,
        EssDialog
    },
    data() {
        return {
            form: {
                periodfrom: '',
                periodto: '',
                teamid: '',
                employeeid: '',
                contractid: ''
            },
            teams: [],
            employees: [],
            tableData: [],
            page: 1,
            pageSize: 10,
            total: 0,
            visible: false
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            const time = new Date();
            vm.form.periodfrom = `${time.getFullYear()}${String(time.getMonth() + 1).padStart(2, '0')}`;
            vm.getTeams();
            vm.getEmployees();
            vm.getList();
        });
    },
    computed: {
        ...mapGetters(['IS_H5'])
    },
    methods: {
        // チーム
        getTeams() {
            this.$axios({
                url: '/api/teamsforselect'
            }).then(res => {
                this.teams = res || [];
            });
        },
        // 従業員
        getEmployees() {
            this.$axios({
                url: '/api/employeesforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.employees = res.data || [];
                } else {
                    this.employees = [];
                }
            });
        },
        getList() {
            const loading = this.$loading({ lock: true, text: '正在获取现金流数据' });
            this.$axios({
                url: '/api/getcashflowlist',
                params: {
                    fromperiod: this.form.periodfrom,
                    toperiod: this.form.periodto,
                    teamid: this.form.teamid,
                    employeeid: this.form.employeeid,
                    contractid: this.form.contractid,
                    page: this.page,
                    pagesize: this.pageSize
                },
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.tableData = res.data || [];
                    this.total = res.total;
                } else {
                    this.total = 0;
                    this.tableData = [];
                }
            });
        },
        changePn(page) {
            this.page = page;
            this.getList();
        },
        actionHandler(item, row) {
            if (item.ID === 'act_createinvoice') {
                this.createInvoice(row);
            } else if (item.ID === 'act_confirmtimesheet') {
                this.$root.$emit('SHOW_ESSEDIT_DAILOG', {
                    id: row.CFID,
                    type: 'confirm',
                    callback: () => {
                        this.getList();
                    }
                });
            } else if (item.ID === 'act_canceltimesheet') {
                this.$root.$emit('SHOW_ESSEDIT_DAILOG', {
                    id: row.CFID,
                    type: 'cancel',
                    callback: () => {
                        this.getList();
                    }
                });
            }
        },
        createInvoice(row) {
            this.$axios({
                method: 'POST',
                url: `/api/createinvoice`,
                params: {
                    cfids: [row.CFID]
                }
            }).then(res => {
                if (res && res.code === 0) {
                    this.getList();
                } else {
                    this.$message({
                        type: 'warning',
                        message: (res && res.message) || '接口开小差了，没有返回信息'
                    });
                }
            });
        },
        changeHandle() {
            this.page = 1;
            this.getList();
        }
    }
};
</script>

<style lang="less">
.cashflow-list {
    .main-header {
        .el-date-editor, .el-select {
            & + .el-date-editor {
                margin-left: 2%;
            }
            width: 15%;
            max-width: 140px;
        }
        .el-select {
            margin-left: 2%;
        }
        .input-wrapper {
            width: 15%;
            max-width: 140px;
            margin-left: 2%;
        }
    }
    .el-pagination {
        margin-top: 20px;
        text-align: center;
    }
}
</style>
