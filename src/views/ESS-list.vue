<template>
    <main-wrapper class="ess-list" :class="[!allData.length && 'no-content']">
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
                    <span>合同标题:</span><span color="primary">{{item.contractTitle}}</span>
                </li>
                <li class="fl"><span>契約期間:</span><span>{{item.contractDuration}}</span></li>
                <li class="fl"><span>営業担当:</span><span>{{item.salesPerson}}</span></li>
                <li class="fl"><span>契約作業時間:</span><span>{{item.contractHours}}</span></li>
            </ul>
            <div class="table-wrapper">
                <el-table size="small" :data="item.cashFlows">
                    <el-table-column label="年月" prop="month" width="60">
                        <template slot-scope="scope">
                            <span>{{scope.row.month}}月</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="作業時間" prop="actualHours" width="100px"></el-table-column>
                    <el-table-column label="精算時間" prop="overTimeHours">
                        <template slot-scope="scope">
                            <span>{{scope.row.overTimeHours || '-'}}</span>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label="賃金" prop="projectSalary" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{formatPrice(scope.row.projectSalary)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="精算額" prop="overTimeSalary" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{formatPrice(scope.row.overTimeSalary)}}</span>
                        </template>
                    </el-table-column> -->
                    <el-table-column label="作業日数" prop="workDays"></el-table-column>
                    <el-table-column label="交通代" prop="travelFare" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{formatPrice(scope.row.travelFare)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="その他費用" prop="otherFee" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{formatPrice(scope.row.otherFee)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="承認ステータス" width="120px">
                        <template slot-scope="scope">
                            <span :class="[scope.row.timeSheetID && (scope.row.approved ? 'audit' : 'unaudit')]">{{formatApproved(scope.row)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="アクション" width="360">
                        <template slot-scope="scope">
                            <el-button type="primary" size="mini" @click="toEdit(scope)">{{formatOperBtn(scope.row)}}</el-button>
                            <el-button v-if="scope.row.timeSheetID" type="primary" size="mini" @click="download(scope.row)">作業報告書ﾀﾞｳﾝﾛｰﾄﾞ</el-button>
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
import { apiDownloadFile } from '@_public/utils';

export default {
    components: {
        MainWrapper
    },
    data() {
        return {
            fullYear: new Date().getFullYear(),
            allData: [{
                contractTitle: '',
                contractDuration: '',
                contractHours: '',
                salesPerson: '',
                cashFlows: []
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
            const loading = this.$loading({ lock: true, text: '作業報告書データ取得中...' });
            this.$axios({
                url: '/api/Cashflow/api_getcfsbyempid',
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
            if (!value) return 0;
            return parseInt(value).toLocaleString();
        },
        formatApproved(row) {
            if (row.timeSheetID) {
                if (row.approved) {
                    return '承認済';
                } else {
                    return '未承認';
                }
            } else {
                return '未入力';
            }
        },
        formatOperBtn(row) {
            if (row.timeSheetID) {
                if (row.approved) {
                    return 'タイムシート照会';
                } else {
                    return 'タイムシート編集';
                }
            } else {
                return 'タイムシート入力';
            }
        },
        toEdit(scope) {
            if (scope.row.cfid) {
                this.$router.push({
                    name: 'ESSEdit',
                    params: { id: scope.row.cfid }
                });
            }
        },
        download(row) {
            apiDownloadFile({
                vm: this,
                url: `/api/Timesheet/api_downloadtimesheet?cfid=${row.cfid}`,
                filename: `${Date.now()}.xlsx`
            });
        }
    }
};
</script>

<style lang="less">
.ess-list {
    &.no-content {
        .content-wrapper {
            & > div {
                display: none;
            }
        }
    }
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
                    width: 95px;
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
