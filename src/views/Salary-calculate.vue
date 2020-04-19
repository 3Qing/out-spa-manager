<template>
    <main-wrapper class="salary-calculate">
        <div slot="header" class="main-header">
            <el-date-picker
                v-model="fromperiod"
                type="month"
                size="mini"
                value-format="yyyyMM"
                value="yyyyMM"
                :clearable="false"
                @change="changeDate"></el-date-picker>
        </div>
        <el-table size="mini" :data="tableData">
            <el-table-column label="就職タイプ" prop="EmployeeType"></el-table-column>
            <el-table-column label="社員番号" prop="EmployeeNo"></el-table-column>
            <el-table-column label="名前" prop="EmployeeName"></el-table-column>
            <el-table-column label="ﾀｲﾑｼｰﾄ承認" prop="TimesheetStatus">
                <template slot-scope="scope">
                    <span>{{transformTimesheet(scope.row.TimesheetStatus)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="出勤日数" prop="ActualWorkDays"></el-table-column>
            <el-table-column label="作業時間" prop="ActualHours"></el-table-column>
            <el-table-column label="待機日数" prop="BenchDays"></el-table-column>
            <el-table-column label="ﾌﾟﾛｼﾞｪｸﾄ賃金" prop="ProjectSalary" width="120px" show-overflow-tooltip></el-table-column>
            <el-table-column label="待機代" prop="BenchSalary" show-overflow-tooltip></el-table-column>
            <el-table-column label="社会保険" prop="Insurance" show-overflow-tooltip></el-table-column>
            <el-table-column label="交通代" prop="TravelFare" show-overflow-tooltip></el-table-column>
            <el-table-column label="その他費用" prop="" show-overflow-tooltip></el-table-column>
            <el-table-column label="所得税" prop="IncomeTax" show-overflow-tooltip></el-table-column>
            <el-table-column label="支払予定日" prop="DueDate" width="120px"></el-table-column>
            <el-table-column label="支給額" prop="PayAmount"></el-table-column>
            <el-table-column label="実際支払日" prop="PayedDate" width="120px" show-overflow-tooltip></el-table-column>
            <el-table-column label="アクション" min-width="240px">
                <template slot-scope="scope">
                    <el-button
                        v-for="item in scope.row.Actions"
                        :key="item.ID"
                        type="primary"
                        @click="actionHandler(item, scope.row)"
                        size="mini">{{item.Title}}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            :current-page="page"
            :page-size="pageSize"
            @current-change="changePn"
            :layout="IS_H5 ? 'prev, pager, next' : 'total, prev, pager, next, jumper'"
            :total="total"></el-pagination>
        <el-dialog :visible.sync="visible" title="修正" @close="close">
            <el-form size="mini" label-width="130px">
                <el-form-item label="プロジェクト賃金">
                    <el-input v-model.number="form.projectsalary"></el-input>
                </el-form-item>
                <el-form-item label="精算金額">
                    <el-input v-model.number="form.overtimesalary"></el-input>
                </el-form-item>
                <el-form-item label="待機代">
                    <el-input v-model.number="form.basesalary"></el-input>
                </el-form-item>
                <el-form-item label="交通代">
                    <el-input v-model.number="form.travelfare"></el-input>
                </el-form-item>
                <el-form-item label="支払予定日">
                    <el-date-picker
                        v-model="form.duedate"
                        type="date"
                        size="mini"
                        value-format="yyyy-MM-dd"
                        value="yyyy-MM-dd"
                        :clearable="false"></el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" size="mini" @click="save">保存</el-button>
            </div>
        </el-dialog>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import { mapGetters } from 'vuex';
export default {
    components: {
        MainWrapper
    },
    data() {
        return {
            fromperiod: '',
            // employeeid: '',
            page: 1,
            pageSize: 10,
            total: 0,
            // employees: [],
            tableData: [],
            visible: false,
            form: {
                empeeid: '',
                period: '',
                projectsalary: '',
                overtimesalary: '',
                basesalary: '',
                travelfare: '',
                duedate: ''
            }
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            const time = new Date();
            vm.fromperiod = `${time.getFullYear()}${String(time.getMonth()).padStart(2, '0')}`;
            // vm.getEmployees();
            vm.getData();
        });
    },
    computed: {
        ...mapGetters(['IS_H5'])
    },
    methods: {
        getData() {
            const loading = this.$loading({ lock: true, text: '正在获取数据中' });
            this.$axios({
                url: '/api/getsalarylist',
                params: {
                    fromperiod: this.fromperiod,
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
                    this.tableData = [];
                    this.total = 0;
                }
            });
        },
        changePn(page) {
            this.page = page;
            this.getData();
        },
        actionHandler(item, row) {
            if (item.ID === 'act_calculatesalary') {
                this.getCalculateSalery(row);
            } else if (item.ID === 'act_manualrevisesalary') {
                this.showDialog(row);
            }
        },
        showDialog(row) {
            console.log(row);
            this.form = {
                salaryid: row.ID,
                projectsalary: row.ProjectSalary,
                overtimesalary: row.OvertimeSalary,
                basesalary: row.BenchSalary,
                travelfare: row.TravelFare,
                duedate: row.DueDate
            };
            this.visible = true;
        },
        close() {
            this.visible = false;
        },
        getCalculateSalery(row) {
            const loading = this.$loading({ lock: true, text: '正在计算中...' });
            this.$axios({
                url: '/api/calculatesalary',
                params: {
                    empeeid: row.EmployeeID,
                    period: this.fromperiod
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
            if (!this.form.duedate) {
                this.$message({
                    type: 'warning',
                    message: '请选择时间'
                });
                return;
            }
            const params = {
                salaryid: this.form.salaryid,
                projectsalary: this.form.projectsalary || 0,
                overtimesalary: this.form.overtimesalary || 0,
                basesalary: this.form.basesalary || 0,
                travelfare: this.form.travelfare || 0,
                duedate: this.form.duedate
            };
            const loading = this.$loading({ lock: true, text: '正在提交数据中' });
            this.$axios({
                method: 'POST',
                url: '/api/revisesalarymanual',
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
}
</style>
