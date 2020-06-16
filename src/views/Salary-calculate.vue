<template>
    <main-wrapper class="salary-calculate">
        <div slot="header" class="main-header">
            <el-date-picker
                v-model="period"
                type="month"
                size="mini"
                value-format="yyyyMM"
                value="yyyyMM"
                :clearable="false"
                @change="changeDate"></el-date-picker>
            <el-select
                v-model="empeeid"
                size="mini"
                clearable
                @change="changeDate"
                placeholder="员工清单">
                <el-option
                    v-for="item in customers"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>
            <el-button style="margin-left:40px;" type="primary" size="mini" @click="batchCalculation">批量计算工资</el-button>
        </div>
        <el-table size="mini" :data="tableData" border @row-dblclick='getSalery'>
            <el-table-column label="就職タイプ" prop="employeeType" show-overflow-tooltip width='110px' fixed="left"></el-table-column>
            <el-table-column label="社員番号" prop="employeeNo" fixed="left"></el-table-column>
            <el-table-column label="名前" prop="employeeName" width='90px' fixed="left"></el-table-column>
            <el-table-column label="ﾀｲﾑｼｰﾄ承認" prop="timesheetStatus">
                <template slot-scope="scope">
                    <span>{{transformTimesheet(scope.row.timesheetStatus)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="出勤日数" prop="actualWorkDays"></el-table-column>
            <el-table-column label="作業時間" prop="actualHours"></el-table-column>
            <el-table-column label="待機日数" prop="benchDays"></el-table-column>
            <el-table-column label="ﾌﾟﾛｼﾞｪｸﾄ賃金" width="120px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{priceToString(scope.row.projectSalary)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="待機代" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{priceToString(scope.row.benchSalary)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="社会保険" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{priceToString(scope.row.insurance)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="交通代" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{priceToString(scope.row.travelFare)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="その他費用" prop="" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{priceToString(scope.row.expense)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="所得税" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{priceToString(scope.row.incomeTax)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="健康保険" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{priceToString(scope.row.healthInsurance)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="厚生年金" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{priceToString(scope.row.endowInsurance)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="支払予定日" prop="dueDate" width="100px"></el-table-column>
            <el-table-column label="支給額" prop="payAmount"></el-table-column>
            <el-table-column label="実際支払日" prop="payedDate" width="100px" show-overflow-tooltip></el-table-column>
            <el-table-column label="アクション" min-width="100px" fixed="right">
                <template slot-scope="scope">
                    <el-tooltip effect="dark" content="查看" placement="top-start">
                        <i class="el-icon-view oper-icon" color="primary" @click="actionHandler(scope.row)"></i>
                    </el-tooltip>
                    <el-tooltip
                        v-for="(item, i) in scope.row.actions"
                        :key="i"
                        effect="dark"
                        :content="item.title"
                        placement="top-start">
                        <i :class="[getClass(item), 'oper-icon']"
                            :color="getColor(item)"
                            @click="actionHandler(item, scope.row)"></i>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            :current-page="page"
            :page-size="pageSize"
            @current-change="changePn"
            :layout="IS_H5 ? 'prev, pager, next' : 'total, prev, pager, next, jumper'"
            :total="total"></el-pagination>
        <el-dialog :visible.sync="visible" title="修正" @close="close" custom-class="salary-dialog">
            <el-form size="mini" label-width="130px">
                <el-form-item label="プロジェクト賃金">
                    <el-input v-model.number="form.projectSalary"></el-input>
                </el-form-item>
                <el-form-item label="精算金額">
                    <el-input v-model.number="form.overtimeSalary"></el-input>
                </el-form-item>
                <el-form-item label="待機代">
                    <el-input v-model.number="form.benchSalary"></el-input>
                </el-form-item>
                <el-form-item label="交通代">
                    <el-input v-model.number="form.travelFare"></el-input>
                </el-form-item>
                <el-form-item label="支払予定日">
                    <el-date-picker
                        v-model="form.dueDate"
                        type="date"
                        size="mini"
                        value-format="yyyy-MM-dd"
                        value="yyyy-MM-dd"
                        :clearable="false"></el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="mini" @click="close">取消</el-button>
                <el-button type="primary" size="mini" @click="save">保存</el-button>
            </div>
        </el-dialog>
        <!-- // 查看明细 -->
        <el-dialog :visible.sync="visibles" title="明细" @close="closedetail" >
            <div class="salary-wrapper">
                <el-row>
                    <el-col :span="6">{{formDetail.Periperiodod || period}}給料明細書</el-col>
                    <el-col :span="3" class="label">部門-所属</el-col>
                    <el-col :span="3">{{formDetail.teamName || '-'}}</el-col>
                    <el-col :span="3" class="label">社員</el-col>
                    <el-col :span="3">{{formDetail.employeeNo || '-'}}</el-col>
                    <el-col :span="3" class="label">氏名</el-col>
                    <el-col :span="3">{{formDetail.name || '-'}}</el-col>
                </el-row>
                <div class="row-wrapper multiple-row">
                    <el-row>
                        <el-col :span="2" class="row-label label">支給</el-col>
                        <el-col :span="4" :offset="2" class="label">基本給</el-col>
                        <el-col :span="4" class="label">待機代</el-col>
                        <el-col :span="4" class="label">時間外手当</el-col>
                        <el-col :span="4" class="label">通勤手当</el-col>
                        <el-col :span="6" class="label">総支給額</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4" :offset="2">{{formatPrice(formDetail.projectSalary)}}</el-col>
                        <el-col :span="4">{{formatPrice(formDetail.benchSalary)}}</el-col>
                        <el-col :span="4">{{formatPrice(formDetail.overtimeSalary)}}</el-col>
                        <el-col :span="4">{{formatPrice(form.travelFare)}}</el-col>
                        <el-col :span="6">{{formatPrice(allowance)}}</el-col>
                    </el-row>
                </div>
                <div class="row-wrapper multiple-row">
                    <el-row>
                        <el-col :span="2" class="row-label label">控除</el-col>
                        <el-col :span="4" :offset="2" class="label">雇用保険</el-col>
                        <el-col :span="4" class="label">健康保険</el-col>
                        <el-col :span="4" class="label">厚生年金</el-col>
                        <el-col :span="4" class="label">所得税</el-col>
                        <el-col :span="6" class="label">控除計</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="4" :offset="2">{{formatPrice(formDetail.hireInsurance)}}</el-col>
                        <el-col :span="4">{{formatPrice(formDetail.healthInsurance)}}</el-col>
                        <el-col :span="4">{{formatPrice(formDetail.endowInsurance)}}</el-col>
                        <el-col :span="4">{{formatPrice(formDetail.incomeTax)}}</el-col>
                        <el-col :span="6">{{formatPrice(meter)}}</el-col>
                    </el-row>
                </div>
                <div class="row-wrapper total-row">
                    <el-row>
                        <el-col :span="6" :offset="18" class="label">現金</el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="6" :offset="18">{{formatPrice(allowance - meter)}}</el-col>
                    </el-row>
                </div>
                <div class="row-wrapper">
                    <el-row>
                        <el-col :span="2" class="label">出勤日数</el-col>
                        <el-col :span="2">{{formDetail.workDays || 0}}天</el-col>
                    </el-row>
                </div>
            </div>
        </el-dialog>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import { mapGetters } from 'vuex';
import { formatTime, priceToString, priceToNumber } from '@_public/utils';
export default {
    components: {
        MainWrapper
    },
    data() {
        return {
            period: '',
            empeeid: '',
            // employeeid: '',
            page: 1,
            pageSize: 15,
            total: 0,
            // employees: [],
            tableData: [],
            customers: [],
            visible: false,
            visibles: false,
            form: {
                empeeid: '',
                period: '',
                projectSalary: '',
                overtimeSalary: '',
                benchSalary: '',
                travelFare: '',
                dueDate: ''
            },
            formDetail: {
                Period: '',
                Team: '',
                EmpeeNo: '',
                Name: '',
                projectSalary: 0,
                benchSalary: 0,
                overtimeSalary: 0,
                travelFare: 0,
                hireInsurance: 0,
                incomeTax: 0,
                workDays: 0,
                healthInsurance: 0,
                endowInsurance: 0
            }
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            const time = new Date();
            vm.period = `${time.getFullYear()}${String(time.getMonth()).padStart(2, '0')}`;
            vm.getData();
            vm.getCustomer();
        });
    },
    computed: {
        ...mapGetters(['IS_H5']),
        allowance() {
            const {
                projectSalary = 0,
                benchSalary = 0,
                overtimeSalary = 0,
                travelFare = 0
            } = this.formDetail;
            return Number(projectSalary) + Number(benchSalary) + Number(overtimeSalary) + Number(travelFare);
        },
        meter() {
            const {
                hireInsurance = 0,
                incomeTax = 0
            } = this.formDetail;
            return Number(hireInsurance) + Number(incomeTax);
        }
    },
    methods: {
        priceToString: priceToString,
        priceToNumber: priceToNumber,
        formatTime: formatTime,
        getData() {
            const loading = this.$loading({ lock: true, text: '正在获取数据中' });
            this.$axios({
                url: '/api/Salary/api_getsalarylist',
                params: {
                    period: this.period,
                    empeeid: this.empeeid,
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
                    console.log(data.data);
                    this.total = data.total;
                } else {
                    this.tableData = [];
                    this.total = 0;
                }
            });
        },
        // 批量计算工资按钮
        batchCalculation() {
            const loading = this.$loading({ lock: true, text: '正在计算中...' });
            this.$axios({
                url: '/api/Salary/api_calculatesalarybybatch',
                params: {
                    period: this.period
                },
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.getData();
                } else {
                    this.$message({
                        type: 'error',
                        message: res ? res.message : '接口开小差了，没有返回'
                    });
                }
            });
        },
        // 员工清单
        getCustomer() {
            this.$axios({
                url: '/api/Employee/api_employeesforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.customers = res.data || [];
                }
            });
        },
        changePn(page) {
            this.page = page;
            this.getData();
        },
        actionHandler(item, row) {
            if (item.id === 'act_calculatesalary') {
                this.getCalculateSalery(row);
            } else if (item.id === 'act_manualrevisesalary') {
                this.showDialog(row);
            } else {
                this.getSalery(item);
            }
        },
        showDialog(row) {
            this.form = {
                salaryid: row.id,
                projectSalary: row.projectSalary,
                overtimeSalary: row.overtimeSalary,
                benchSalary: row.benchSalary,
                travelFare: row.travelFare,
                dueDate: row.dueDate
            };
            this.visible = true;
        },
        close() {
            this.visible = false;
        },
        closedetail() {
            this.visibles = false;
        },
        // 获取工资详细
        getSalery(row) {
            const loading = this.$loading({ lock: true, text: '正在计算中...' });
            this.$axios({
                url: '/api/Salary/api_getsalaryinfo',
                params: {
                    empeeid: row.employeeID,
                    period: this.period
                },
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.formDetail = res.data;
                    this.visibles = true;
                } else {
                    this.$message({
                        type: 'error',
                        message: res ? res.message : '接口开小差了，没有返回'
                    });
                }
            });
        },
        getCalculateSalery(row) {
            const loading = this.$loading({ lock: true, text: '正在计算中...' });
            this.$axios({
                url: '/api/Salary/api_calculatesalary',
                params: {
                    empeeid: row.employeeID,
                    period: this.period
                },
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.getData();
                } else {
                    this.$message({
                        type: 'error',
                        message: res ? res.message : '接口开小差了，没有返回'
                    });
                }
            });
        },
        changeDate() {
            this.page = 1;
            this.getData();
        },
        transformTimesheet(value) {
            switch (Number(value)) {
                case 0:
                    return '未入力';
                case 1:
                    return '未承認';
                case 2:
                    return '承認済';
                default:
                    return '-';
            }
        },
        save() {
            if (!this.form.dueDate) {
                this.$message({
                    type: 'warning',
                    message: '请选择时间'
                });
                return;
            }
            const params = {
                salaryid: this.form.salaryid,
                projectsalary: this.form.projectSalary || 0,
                overtimesalary: this.form.overtimeSalary || 0,
                basesalary: this.form.benchSalary || 0,
                travelfare: this.form.travelFare || 0,
                duedate: this.form.dueDate
            };
            const loading = this.$loading({ lock: true, text: '正在提交数据中' });
            this.$axios({
                url: '/api/Salary/api_revisesalarymanual',
                params,
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.close();
                    this.getData();
                } else {
                    this.$message({
                        type: 'error',
                        message: res ? res.message : '接口开小差了，没有返回信息'
                    });
                }
            });
        },
        getClass(item) {
            if (item.id === 'act_calculatesalary') {
                return 'el-icon-money';
            } else if (item.id === 'act_manualrevisesalary') {
                return 'el-icon-edit-outline';
            }
        },
        getColor(item) {
            if (item.id === 'act_calculatesalary') {
                return 'danger';
            } else if (item.id === 'act_manualrevisesalary') {
                return 'warning';
            }
        },
        formatPrice(value) {
            if (!value) return 0;
            return Number(value).toLocaleString();
        }
    }
};
</script>

<style scoped lang="less">
.salary-calculate {
    .main-header {
        .el-date-editor {
            width: 200px;
        }
        .el-select {
            width: 200px;
            margin-left: 40px;
        }
    }
    .salary-wrapper {
        .row-wrapper {
            &:last-child {
                .el-row {
                    border-bottom: 1px solid rgb(108, 146, 190);
                    border-right: 1px solid rgb(108, 146, 190);
                }
            }
        }
        .el-row {
            border: 1px solid rgb(108, 146, 190);
            border-bottom: none;
            border-right: none;
        }
        .el-col {
            padding-left: 5px;
            height: 36px;
            line-height: 36px;
            border-right: 1px solid rgb(108, 146, 190);
        }
        .multiple-row {
            position: relative;
            .row-label {
                position: absolute;
                left: 0;
                top: 0;
                height: 72px;
                line-height: 72px;
                z-index: 1;
            }
        }
        .total-row {
            .el-row:last-child {
                border-top: none;
                .el-col {
                    border-top: 1px solid rgb(108, 146, 190);
                }
            }
            .el-col {
                border-left: 1px solid rgb(108, 146, 190);
                // position: relative;
                // left: -1px;
            }
        }
        .label {
            color: #1473B7;
            overflow: hidden;
            white-space: nowrap;
            background-color: rgb(236, 254, 253);
        }
    }
}
.salary-dialog {
    .el-input, .el-date-editor {
        width: 240px;
    }
}
</style>
