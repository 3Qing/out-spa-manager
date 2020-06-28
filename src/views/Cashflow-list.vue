<template>
    <main-wrapper class="cashflow-list">
        <main-header-date slot="header" :form="form" :clearable="false" @update="changeHandle">
            <el-select placeholder="チーム" v-model="form.teamid" size="mini" clearable @change="changeHandle">
                <el-option v-for="item in teams" :key="item.id" :label="item.teamName" :value="item.id"></el-option>
            </el-select>
            <el-select
                v-model="form.employeeid"
                size="mini"
                clearable
                filterable
                remote
                reserve-keyword
                placeholder="社員"
                :remote-method="remoteMethod"
                :loading="loading"
                @change="changeHandle">
                <el-option v-for="item in employees" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <el-input
                class="input-wrapper"
                placeholder="注文書番号"
                v-model="form.contractno"
                size="mini"
                clearable
                @blur="changeHandle"></el-input>
        </main-header-date>
        <el-table size="small" :data="tableData">
            <el-table-column label="注文書番号" prop="contractNo" show-overflow-tooltip></el-table-column>
            <el-table-column label="注文書タイトル" prop="contractTitle" width="120px" show-overflow-tooltip></el-table-column>
            <el-table-column label="得意先" prop="customerName" show-overflow-tooltip></el-table-column>
            <el-table-column label="社員番号" prop="employeeNo" width="100px" show-overflow-tooltip></el-table-column>
            <el-table-column label="社員氏名" prop="employeeName" width="100px" show-overflow-tooltip></el-table-column>
            <el-table-column label="開始日付" prop="fromDate" width="100px">
                <template slot-scope="scope">
                    <span>{{formatTime(scope.row.fromDate)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="終了日付" prop="toDate" width="100px">
                <template slot-scope="scope">
                    <span>{{formatTime(scope.row.toDate)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="作業時間">
                <el-table-column label="契約時間" prop="contractHours" show-overflow-tooltip></el-table-column>
                <el-table-column label="実績時間" prop="actualHours" show-overflow-tooltip></el-table-column>
            </el-table-column>
            <el-table-column label="注文単価・万円（税抜）" prop="contractSales" show-overflow-tooltip></el-table-column>
            <el-table-column label="見込売掛金・円（税込）">
                <el-table-column label="金額" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{thousandFormat(scope.row.planCollectSales)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="予定入金日" prop="planCollectDate" width="100px">
                    <template slot-scope="scope">
                        <span>{{formatTime(scope.row.planCollectDate)}}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="実際売掛金・円">
                <el-table-column label="金額" prop="actualCollectSales" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{thousandFormat(scope.row.actualCollectSales)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="実際入金日" prop="actualCollectDate" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{formatTime(scope.row.actualCollectDate)}}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="コスト・円">
                <el-table-column label="人件費" prop="projectSalary" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{thousandFormat(scope.row.projectSalary)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="交通代" prop="travelFare" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{thousandFormat(scope.row.travelFare)}}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="粗利・円" prop="profit" show-overflow-tooltip>
                <template slot-scope="scope">
                        <span>{{thousandFormat(scope.row.profit)}}</span>
                    </template>
            </el-table-column>
            <el-table-column label="請求書番号" width="120px" prop="invoiceNo" show-overflow-tooltip></el-table-column>
            <el-table-column label="アクション" width="100px" fixed="right">
                <template slot-scope="scope">
                    <el-tooltip effect="dark" placement="top-start" v-for="item in scope.row.actions"
                        :key="item.id" :content="item.title">
                        <i v-if="item.id==='act_collectsales'" class="el-icon-edit-outline iconfont oper-icon" color="warning" @click="actionHandler(item, scope.row)"></i>
                        <i v-if="item.id==='act_displaytimesheet'" class="icon-approve iconfont oper-icon" color="warning" @click="actionHandler(item, scope.row)"></i>
                        <i v-if="item.id==='act_createinvoice'" class="icon-Invoice iconfont oper-icon" color="warning" @click="actionHandler(item, scope.row)"></i>
                        <i v-if="item.id==='act_canceltimesheet'" class="icon-cancel iconfont oper-icon" color="warning" @click="actionHandler(item, scope.row)"></i>
                    </el-tooltip>
                    <!-- <el-tooltip effect="dark" content="删除" placement="top-start">
                        <i class="el-icon-delete oper-icon" color="danger" @click="handleDel(scope)"></i>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="拷贝" placement="top-start">
                        <i class="el-icon-document-copy oper-icon" color="info" @click="handleCopy(scope)"></i>
                    </el-tooltip> -->
                </template>
                <!-- <template slot-scope="scope">
                    <el-button
                        type="primary"
                        v-for="item in scope.row.actions"
                        size="mini"
                        @click="actionHandler(item, scope.row)"
                        :key="item.id">{{item.title}}</el-button>
                </template> -->
            </el-table-column>
        </el-table>
        <el-pagination
            :current-page="page"
            :page-size="pageSize"
            @current-change="changePn"
            :layout="IS_H5 ? 'prev, pager, next' : 'total, prev, pager, next, jumper'"
            :total="total"></el-pagination>
        <ess-dialog :visible="visible"></ess-dialog>
        <el-dialog :visible.sync="show" custom-class="ess-edit-dialog">
            <div style="max-height: 500px;overflow-y: auto;">
                <ess-edit :id="curRow.cfid" v-if="show"></ess-edit>
            </div>
            <div slot="footer">
                <el-button type="primary" size="mini" @click="show = false">確定</el-button>
            </div>
        </el-dialog>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import MainHeaderDate from '@components/main-wrapper/header-date';
import EssDialog from '@components/cashflow-list/dialog';
import EssEdit from '@views/ESS-edit';
import { mapGetters } from 'vuex';
import { formatTime } from '@_public/utils';
export default {
    components: {
        MainWrapper,
        MainHeaderDate,
        EssDialog,
        EssEdit
    },
    data() {
        return {
            form: {
                periodfrom: '',
                periodto: '',
                teamid: '',
                employeeid: '',
                contractno: ''
            },
            teams: [],
            employees: [],
            tableData: [],
            page: 1,
            pageSize: 15,
            total: 0,
            visible: false,
            show: false,
            curRow: {},
            loading: false
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
        formatTime: formatTime,
        // チーム
        getTeams() {
            this.$axios({
                url: '/api/Team/api_teamsforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.teams = res.data || [];
                }
            });
        },
        // 千分位字符格式化
        thousandFormat(num) {
            var reg = /\d{1,3}(?=(\d{3})+$)/g;
            return (num + '').replace(reg, '$&,');
        },
        // 従業員
        getEmployees(keyword = '') {
            this.loading = true;
            this.$axios({
                url: '/api/Employee/api_employeesforselect',
                params: {
                    keyword
                }
            }).then(res => {
                this.loading = false;
                if (res && res.code === 0) {
                    this.employees = res.data || [];
                } else {
                    this.employees = [];
                }
            });
        },
        remoteMethod(keyword) {
            this.getEmployees(keyword);
        },
        getList() {
            const loading = this.$loading({ lock: true, text: 'キャッシュフロー取得中...' });
            this.$axios({
                url: '/api/Cashflow/api_getcashflowlist',
                params: {
                    fromperiod: this.form.periodfrom,
                    toperiod: this.form.periodto,
                    // teamid: this.form.teamid,
                    // employeeid: this.form.employeeid,
                    // contractno: this.form.contractno,
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
                    const data = res.data || {};
                    this.tableData = data.data || [];
                    this.total = data.total;
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
            if (item.id === 'act_createinvoice') {
                this.createInvoice(row);
            } else if (item.id === 'act_confirmtimesheet') {
                this.$root.$emit('SHOW_ESSEDIT_DAILOG', {
                    id: row.cfid,
                    type: 'confirm',
                    callback: () => {
                        this.getList();
                    }
                });
            } else if (item.id === 'act_canceltimesheet') {
                this.$root.$emit('SHOW_ESSEDIT_DAILOG', {
                    id: row.cfid,
                    type: 'cancel',
                    callback: () => {
                        this.getList();
                    }
                });
            } else if (item.id === 'act_displaytimesheet') {
                this.curRow = { ...row };
                this.show = true;
            }
        },
        createInvoice(row) {
            const loading = this.$loading({ lock: true, text: '請求書作成中...' });
            this.$axios({
                method: 'POST',
                url: `/api/Invoice/api_createinvoice`,
                params: {
                    cfids: [row.cfid]
                },
                formData: true,
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '创建成功'
                    });
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
.ess-edit-dialog {
    .el-dialog__body {
        padding: 20px 0;
    }
}
</style>
