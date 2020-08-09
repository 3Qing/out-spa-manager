<template>
    <main-wrapper class="timesheet-list">
        <el-form class="main-header header-form" slot="header" size="mini" inline>
            <el-form-item>
                <el-date-picker
                    v-model="form.period"
                    type="month"
                    size="mini"
                    placeholder="期間"
                    value-format="yyyyMM"
                    format="yyyyMM"
                    clearable
                    @change="changeHandle">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-select v-model="form.employeetype" placeholder="社員" @change="changeHandle" clearable>
                    <el-option v-for="item in employeeTypes" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="table-wrapper">
            <el-table size="small" :data="tableData" border :cell-class-name="cellClassName">
                <el-table-column fixed label="社員番号" prop="employeeNo" width="100px"></el-table-column>
                <el-table-column fixed label="氏名" prop="name" show-overflow-tooltip></el-table-column>
                <el-table-column label="就職タイプ" prop="title" show-overflow-tooltip></el-table-column>
                <el-table-column label="開始日">
                    <template slot-scope="scope">
                        <span v-if='scope.row.cashflows.length>0'>{{formatTime(scope.row.cashflows[0].fromDate)}}</span>
                    </template>    
                </el-table-column>
                <el-table-column label="終了日">
                    <template slot-scope="scope">
                        <span v-if='scope.row.cashflows.length>0'>{{formatTime(scope.row.cashflows[0].toDate)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="カレンダー日数">
                    <template slot-scope="scope">
                        <span v-if='scope.row.cashflows.length>0'>{{scope.row.cashflows[0].calendarWorkDays}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="実際出勤日数">
                    <template slot-scope="scope">
                        <span v-if='scope.row.cashflows.length>0&&scope.row.cashflows[0].timesheetID!==0'>{{scope.row.cashflows[0].totalWorkDays}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="実際作業時間" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if='scope.row.cashflows.length>0&&scope.row.cashflows[0].totalMinutes>0&&scope.row.cashflows[0].timesheetID!==0'>{{scope.row.cashflows[0].totalHours}}時間{{scope.row.cashflows[0].totalMinutes}}分</span>
                        <span v-if='scope.row.cashflows.length>0&&scope.row.cashflows[0].totalMinutes<=0&&scope.row.cashflows[0].timesheetID!==0'>{{scope.row.cashflows[0].totalHours}}時間</span>
                    </template>
                </el-table-column>
                <el-table-column label="ﾀｲﾑｼｰﾄ提出日" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span v-if='scope.row.cashflows.length>0&&scope.row.cashflows[0].timesheetID!==0'>{{formatTime(scope.row.cashflows[0].updateTime)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="ﾀｲﾑｼｰﾄ承認">
                    <template slot-scope="scope">
                        <span v-if='scope.row.cashflows.length>0&&scope.row.cashflows[0].approved&&scope.row.cashflows[0].timesheetID!==0'>承認済</span>
                        <span v-if='scope.row.cashflows.length>0&&!scope.row.cashflows[0].approved&&scope.row.cashflows[0].timesheetID!==0'>未承認</span>
                    </template>
                </el-table-column>
                <el-table-column label="アクション" width="130px" fixed="right">
                    <template slot-scope="scope" v-if='scope.row.cashflows.length>0'>
                        <el-tooltip effect="dark" placement="top-start" v-for="(item, index) in scope.row.cashflows[0].actions"
                            :key="index" :content="item.text">
                            <i v-if="item.action==='act_displaytimesheet'" class="icon-approve iconfont oper-icon" color="warning" @click="actionHandler(item, scope.row)"></i>
                            <i v-if="item.action==='act_canceltimesheet'" class="icon-cancel iconfont oper-icon" color="warning" @click="actionHandler(item, scope.row)"></i>
                            <i v-if="item.action==='act_confirmtimesheet'" class="el-icon-edit-outline iconfont oper-icon" color="warning" @click="actionHandler(item, scope.row)"></i>
                        </el-tooltip>
                        <!-- <el-tooltip effect="dark" content="显示" placement="top-start">
                            <i class="el-icon-view oper-icon" color="success" @click="toDetail(scope.row)"></i>
                        </el-tooltip> -->
                        <!-- <el-tooltip
                            v-for="(item, i) in (scope.row.cashflows.actions || [])"
                            :key="i"
                            effect="dark"
                            :content="item.text"
                            placement="top-start">
                            <i :class="[getClass(item), 'oper-icon']"
                                :color="getColor(item)"
                                @click="clickHandle(scope, item)"></i>
                        </el-tooltip> -->
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-pagination
            :current-page="page"
            :page-size="pageSize"
            @current-change="changePn"
            :layout="IS_H5 ? 'prev, pager, next' : 'total, prev, pager, next, jumper'"
            :total="total"></el-pagination>
        <ess-dialog :visible="visible"></ess-dialog>
        <el-dialog :visible.sync="show" custom-class="ess-edit-dialog">
            <div style="max-height: 500px;overflow-y: auto;">
                <ess-edit :id="curRow.id" v-if="show"></ess-edit>
            </div>
            <div slot="footer">
                <el-button type="primary" size="mini" @click="show = false">確定</el-button>
            </div>
        </el-dialog>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import { mapGetters } from 'vuex';
import EssDialog from '@components/timeSheet/dialog';
import EssEdit from '@views/TimeSheet-edit';
import moment from 'moment';
import { formatTime } from '@_public/utils';

export default {
    components: {
        MainWrapper,
        EssDialog,
        EssEdit
    },
    data() {
        return {
            form: {
                period: '',
                employeetype: ''
            },
            teams: [],
            employeeTypes: [],
            page: 1,
            pageSize: 15,
            total: 0,
            tableData: [],
            visible: false,
            show: false,
            curRow: {}
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.form.period = moment(new Date()).format('YYYYMM');
            vm.getEmployeeTypes();
            vm.getData();
        });
    },
    computed: {
        ...mapGetters(['IS_H5', 'TEAMS'])
    },
    methods: {
        // 千分位字符格式化
        thousandFormat(num) {
            var reg = /\d{1,3}(?=(\d{3})+$)/g;
            return (num + '').replace(reg, '$&,');
        },
        // 列表颜色
        cellClassName({ row, columnIndex }) {
            // console.log(row);
            if (columnIndex === 9) {
                if (row.cashflows.length > 0) {
                    if (row.cashflows[0].timesheetID!==0) {
                        if (row.cashflows[0].approved) {
                            return 'bg-success';
                        } else {
                            return 'bg-warning';
                        }
                    }
                }
            }
        },
        formatTime: formatTime,
        getData() {
            const loading = this.$loading({ lock: true, text: '社員一覧データ取得中...' });
            let url = '/api/Timesheet/api_gettimesheetlist';
            if (this.form.employeetype === '') {
                this.form.employeetype = 0;
            }
            this.$axios({
                method: 'GET',
                url,
                params: {
                    period: this.form.period,
                    empeeid: this.form.employeetype,
                    page: this.page,
                    pagesize: this.pageSize
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    let actionLen = 0;
                    const data = res.data || {};
                    (data.data || []).forEach(item => {
                        if (item.actions) {
                            if (item.actions.length > actionLen) {
                                actionLen = item.actions.length;
                            }
                        }
                    });
                    this.operWidth = actionLen * 80 + 80;
                    this.tableData = data.data || [];
                    this.total = data.total;
                    if (this.form.employeetype === 0) {
                        this.form.employeetype = '';
                    }
                } else {
                    this.$message({
                        type: 'error',
                        showClose: true,
                        message: res ? res.message : 'インタフェース異常、データ取得できません！'
                    });
                }
            });
        },
        getTeams() {
            this.$axios({
                url: '/api/Team/api_teamsforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.teams = res.data || [];
                }
            });
        },
        getEmployeeTypes() {
            this.$axios({
                url: '/api/Employee/api_employeesforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.employeeTypes = res.data || [];
                }
            });
        },
        changePn(page) {
            this.page = page;
            this.getData();
        },
        changeHandle() {
            this.page = 1;
            this.getData();
        },

        actionHandler(item, row) {
            console.log(item, row);
            if (item.action === 'act_confirmtimesheet') {
                this.$root.$emit('SHOW_ESSEDIT_DAILOG', {
                    id: row.id,
                    type: 'confirm',
                    callback: () => {
                        this.getData();
                    }
                });
            } else if (item.action === 'act_canceltimesheet') {
                this.$root.$emit('SHOW_ESSEDIT_DAILOG', {
                    id: row.id,
                    type: 'cancel',
                    callback: () => {
                        this.getData();
                    }
                });
            } else if (item.action === 'act_displaytimesheet') {
                this.curRow = { ...row };
                console.log(this.curRow);
                this.show = true;
            }
        },
        clickHandle(scope, item) {
            if (item.action === 'act_employeeupdate') {
                this.$router.push({ name: 'EmployeeEdit', params: { id: scope.row.id } });
            } else if (item.action === 'act_employeeleave') {
                this.vislble = true;
                this.curData = scope.row;
            } else if (item.action === 'act_revisesalary') {
                this.salary = {
                    empeeid: scope.row.id,
                    FromDate: '',
                    PJSalary: this.thousandFormat(Number(scope.row.projectSalary)) || 0,
                    BaseSalary: Number(scope.row.baseSalary) || 0,
                    Comment: ''
                };
                this.visilble2 = true;
            } else {
                this.jobObj = scope.row;
                this.teamFromdate = moment(new Date()).format('YYYY-MM-01');
                this.teamFromid = '';
                this.teamFromReason = '';
                this.teamTodate = moment(new Date()).format('YYYY-MM-01');
                this.teamToReason = '';
                this.visilbleBoole = true;
            }
        }
    }
};
</script>

<style lang="less">
.timesheet-list {
    .table-wrapper {
        padding: 0 20px;
    }
    .el-pagination {
        margin-top: 20px;
        text-align: center;
    }
    .oper-icon {
        font-size: 18px !important;
    }
    td.bg-danger {
        color: #fff;
        background-color: rgba(219, 65, 78, 0.78) !important;
    }
    td.bg-success {
        color: #fff;
        background-color: rgba(69, 190, 135, 0.78) !important;
    }
    td.bg-warning {
        color: #fff;
        background-color: rgba(230, 162, 60, 0.78) !important;
    }
    td.bg-info {
        color: #fff;
        background-color: #438fc5 !important;
    }
}
</style>
