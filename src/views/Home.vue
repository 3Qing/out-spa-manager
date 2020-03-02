<template>
    <div class="home">
        <el-form size="small" label-width="60px" label-position="left">
            <el-form-item label="年度">
                <el-select v-model="fullYear" @change="changeYear">
                    <el-option
                        v-for="year in allYears"
                        :key="year"
                        :label="year"
                        :value="year"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <el-card :body-style="{ padding: 0 }" v-for="(item, index) in allData" :key="index">
            <ul class="clearfix card-header">
                <li class="fl">
                    <span>合同标题:</span><span color="primary">{{item.ContractTitle}}</span>
                </li>
                <li class="fl"><span>合同周期:</span><span>{{item.ContractDuration}}</span></li>
                <li class="fl"><span>营业担当:</span><span>{{item.SalesPerson}}</span></li>
                <li class="fl"><span>合同工时:</span><span>{{item.ContractHours}}</span></li>
            </ul>
            <div class="table-wrapper">
                <el-table size="small" :data="item.CashFlows">
                    <el-table-column label="日期" prop="Month" width="60">
                        <template slot-scope="scope">
                            <span>{{scope.row.Month}}月</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="作业时间" prop="ActualHours"></el-table-column>
                    <el-table-column label="精算时间" prop="OverTimeHours">
                        <template slot-scope="scope">
                            <span>{{scope.row.OverTimeHours || '-'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="项目工资" prop="ProjectSalary"></el-table-column>
                    <el-table-column label="精算工资" prop="OverTimeSalary"></el-table-column>
                    <el-table-column label="待机天数" prop="BenchDays"></el-table-column>
                    <el-table-column label="待机费" prop="BaseSalary"></el-table-column>
                    <el-table-column label="交通费" prop="TravelFare"></el-table-column>
                    <el-table-column label="其他费用" prop="OtherFee"></el-table-column>
                    <el-table-column label="实发工资" prop="PayedAmount">
                        <template slot-scope="scope">
                            <span color="danger">{{scope.row.PayedAmount}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="发放日期" prop="SalaryPayDate" width="120"></el-table-column>
                    <el-table-column label="操作">
                        <template>
                            <el-button type="primary" size="mini">填写作业报告</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
    </div>
</template>

<script>
import { getFullYears } from '@_public/utils';

export default {
    data() {
        return {
            fullYear: new Date().getFullYear(),
            allData: [{
                ContractTitle: '',
                ContractDuration: '',
                ContractHours: '',
                SalesPerson: '',
                CashFlows: []
            }],
            allYears: []
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.allYears = getFullYears();
            // vm.getData();
        });
    },
    mounted() {
        this.allData = JSON.parse("[{\"ContractTitle\":\"SAPｸﾞﾛｰﾊﾞﾙﾛｰﾙｱｳﾄ展開コンサル支援\",\"ContractDuration\":\"2020/03/01∼2020/03/31\",\"ContractHours\":\"140∼180時間\",\"SalesPerson\":\"劉峰\",\"CashFlows\":[]},{\"ContractTitle\":\"SAPｸﾞﾛｰﾊﾞﾙﾛｰﾙｱｳﾄ展開コンサル支援\",\"ContractDuration\":\"2020/02/01∼2020/02/29\",\"ContractHours\":\"140∼180時間\",\"SalesPerson\":\"劉峰\",\"CashFlows\":[{\"Year\":\"2020\",\"Month\":\"02\",\"ActualHours\":\"0時間0分\",\"OverTimeHours\":\"140時間\",\"ProjectSalary\":605000,\"OverTimeSalary\":0,\"BaseSalary\":0,\"BenchDays\":\"0天\",\"TravelFare\":0,\"RecomdFee\":0,\"OtherFee\":0,\"PayedAmount\":0,\"SalaryPayDate\":\"2020/03/25\"}]},{\"ContractTitle\":\"SAPｸﾞﾛｰﾊﾞﾙﾛｰﾙｱｳﾄの展開コンサル支援\",\"ContractDuration\":\"2020/01/01∼2020/01/31\",\"ContractHours\":\"140∼180時間\",\"SalesPerson\":\"劉峰\",\"CashFlows\":[{\"Year\":\"2020\",\"Month\":\"01\",\"ActualHours\":\"175時間0分\",\"OverTimeHours\":\"\",\"ProjectSalary\":605000,\"OverTimeSalary\":0,\"BaseSalary\":0,\"BenchDays\":\"0天\",\"TravelFare\":0,\"RecomdFee\":0,\"OtherFee\":0,\"PayedAmount\":0,\"SalaryPayDate\":\"2020/02/25\"}]}]");
    },
    methods: {
        getData() {
            const loading = this.$loading({ lock: true, text: '正在获取数据中...' });
            this.$axios({
                url: '/api/esscashflow',
                params: {
                    year: this.fullYear
                }
            }).then(res => {
                loading.close();
                const result = JSON.parse(res || []);
                if (result.length) {
                    this.allData = [...result];
                } else {
                    this.allData = [{
                        ContractTitle: '',
                        ContractDuration: '',
                        ContractHours: '',
                        SalesPerson: '',
                        CashFlows: []
                    }];
                }
            });
        },
        changeYear(year) {
            this.fullYear = year;
            this.getData();
        }
    }
};
</script>

<style lang="less">
.home {
    .el-card {
        & + .el-card {
            margin-top: 20px;
        }
        .card-header {
            line-height: 24px;
            background-color: #ebeef5;
            padding: 10px 20px;
            li {
                width: 50%;
                span:first-child {
                    display: inline-block;
                    width: 70px;
                }
            }
        }
    }
}
</style>
