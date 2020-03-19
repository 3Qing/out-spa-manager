<template>
    <main-wrapper class="ess-list">
        <el-form class="main-header" slot="header" size="small" label-width="60px" label-position="left">
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
                    <el-table-column label="作业时间" prop="ActualHours" width="100px"></el-table-column>
                    <el-table-column label="精算时间" prop="OverTimeHours">
                        <template slot-scope="scope">
                            <span>{{scope.row.OverTimeHours || '-'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="项目工资" prop="ProjectSalary" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{formatPrice(scope.row.ProjectSalary)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="精算工资" prop="OverTimeSalary" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{formatPrice(scope.row.OverTimeSalary)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="作業日数" prop="WorkDays"></el-table-column>
                    <el-table-column label="交通费" prop="TravelFare" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{formatPrice(scope.row.TravelFare)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="其他费用" prop="OtherFee" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{formatPrice(scope.row.OtherFee)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="承認ステータス" width="120px">
                        <template slot-scope="scope">
                            <span :class="[scope.row.TimeSheetID && (scope.row.Approved ? 'audit' : 'unaudit')]">{{formatApproved(scope.row)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="360">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="toEdit(scope)">{{formatOperBtn(scope.row)}}</el-button>
                            <el-button v-if="scope.row.TimeSheetID" type="primary" size="mini" @click="download(scope.row)">タイムシートダウンロード</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
    </main-wrapper>
</template>

<script>
import { getFullYears } from '@_public/utils';
import MainWrapper from '@components/main-wrapper';
import { formatApiUrl } from '@_public/utils';

export default {
    components: {
        MainWrapper
    },
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
            // vm.$store.dispatch({
            //     type: CHANGE_TAB_TITLE,
            //     title: '作业报告/工资清单'
            // });
            vm.allYears = getFullYears();
            vm.getData();
        });
    },
    methods: {
        getData() {
            const loading = this.$loading({ lock: true, text: '正在获取作业报告数据...' });
            this.$axios({
                url: '/api/getesscashflowlist',
                params: {
                    year: this.fullYear
                },
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    const result = res.data || [];
                    this.allData = result;
                } else {
                    this.allData = [];
                }
            });
        },
        changeYear(year) {
            this.fullYear = year;
            this.getData();
        },
        formatPrice(value) {
            return Number(value).toFixed(2).toLocaleString();
        },
        formatApproved(row) {
            if (row.TimeSheetID) {
                if (row.Approved) {
                    return '已审核';
                } else {
                    return '未审核';
                }
            } else {
                return '未入力';
            }
        },
        formatOperBtn(row) {
            if (row.TimeSheetID) {
                if (row.Approved) {
                    return 'タイムシート照会';
                } else {
                    return 'タイムシート編集';
                }
            } else {
                return 'タイムシート入力';
            }
        },
        toEdit(scope) {
            if (scope.row.CFID) {
                this.$router.push({
                    name: 'ESSEdit',
                    params: { id: scope.row.CFID }
                });
            }
        },
        download(row) {
            const href = formatApiUrl('/api/downloadtimesheet', `?cfid=${row.CFID}`);
            window.open(href, '_blank');
        }
    }
};
</script>

<style lang="less">
.ess-list {
    .el-card {
        & + .el-card {
            margin-top: 20px;
        }
        .card-header {
            line-height: 24px;
            background-color: #f7f9fc;
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
    .audit {
        color: #1473B7;
    }
    .unaudit {
        color: #E6A23C;
    }
}
</style>
