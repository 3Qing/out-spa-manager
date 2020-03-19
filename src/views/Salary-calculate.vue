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
            <el-table-column label="ﾀｲﾑｼｰﾄ承認" prop="TimesheetApproved"></el-table-column>
            <el-table-column label="出勤日数" prop="ActualWorkDays"></el-table-column>
            <el-table-column label="作業時間" prop="ActualHours"></el-table-column>
            <el-table-column label="待機日数" prop="BenchDays"></el-table-column>
            <el-table-column label="ﾌﾟﾛｼﾞｪｸﾄ賃金" prop="ProjectSalary"></el-table-column>
            <el-table-column label="待機代" prop="BenchSalary"></el-table-column>
            <el-table-column label="社会保険" prop="Insurance"></el-table-column>
            <el-table-column label="交通代" prop="TravelFare"></el-table-column>
            <el-table-column label="その他費用" prop=""></el-table-column>
            <el-table-column label="所得税" prop="IncomeTax"></el-table-column>
            <el-table-column label="支払予定日" prop="DueDate" width="120px"></el-table-column>
            <el-table-column label="支給額" prop="PayAmount"></el-table-column>
            <el-table-column label="実際支払日" prop="PayedDate"></el-table-column>
            <el-table-column label="アクション" min-width="140px">
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
            tableData: []
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
                    // employeeid: this.employeeid,
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
            }
        },
        getCalculateSalery(row) {
            this.$axios({
                url: '/api/calculatesalary',
                params: {
                    empeeid: row.EmployeeID,
                    period: this.fromperiod
                }
            }).then(res => {
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
