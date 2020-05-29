<template>
    <main-wrapper class="profit-chart">
        <el-form slot="header" class="main-header" size="mini" inline>
            <el-form-item>
                <el-select v-model="teamid" placeholder="チーム" @change="getData" clearable>
                    <el-option v-for="item in teams" :key="item.id" :label="item.teamName" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-date-picker
                    v-model="period"
                    type="month"
                    placeholder="年月"
                    value-format="yyyyMM"
                    format="yyyyMM"
                    :clearable="false"
                    @change="changePeriod"></el-date-picker>
            </el-form-item>
            <div class="icon-list">
                <div>
                    <span bcolor="primary"></span>
                    <span>売上</span>
                </div>
                <div>
                    <span bcolor="success"></span>
                    <span>利益（確定）</span>
                </div>
                <div>
                    <span bcolor="warning"></span>
                    <span>利益（予測）</span>
                </div>
                <div>
                    <span bcolor="danger"></span>
                    <span>待機代</span>
                </div>
            </div>
        </el-form>
        <div>
            <el-table :data="tableData" size="mini" :height="height" v-if="height">
                <el-table-column label="社員番号" prop="empeeNo" width="120px"></el-table-column>
                <el-table-column label="氏名" prop="empeeName" width="140px"></el-table-column>
                <el-table-column
                    v-for="(item, i) in columns"
                    :key="i"
                    :label="item">
                    <template slot-scope="scope">
                        <div class="bar-box">
                            <span
                                :class="[
                                    'small',
                                    scope.row.profits[i].status === 10 && 'bg-yellow',
                                    Number(scope.row.profits[i].margin) < 0 && 'bg-danger'
                                ]"
                                :style="handleStyle(scope.row.profits[i], 1)"
                                v-if="scope.row.profits[i].margin">{{scope.row.profits[i].margin}}</span>
                            <span class="margin-bar" v-if="scope.row.profits[i].sales" :style="handleStyle(scope.row.profits[i], 2)">{{scope.row.profits[i].sales}}</span>
                        </div>
                    </template>    
                </el-table-column>
            </el-table>
            <div class="chart-wrapper" :style="{height: `${height}px`}">
                <div ref="line"></div>
            </div>
            <el-table class="mt20" :data="format(totalprofit)"  size="mini" :height="height" v-if="height">
                <el-table-column v-for="(item, index) in totalprofit[0]" :key="index" :label="item">
                    <template scope="scope">
                        <span>{{scope.row[index]}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import moment from 'moment';
import echarts from 'echarts';
import { mapGetters } from 'vuex';
export default {
    components: {
        MainWrapper
    },
    data() {
        return {
            teams: [],
            period: '',
            teamid: '',
            curMonth: '',
            columns: [],
            xAxis: [],
            yAxis: [],
            tableData: [],
            maxSales: 0,
            maxMargin: 0,
            height: 0,
            totallabel: [],
            totalprofit: []
        };
    },
    computed: {
        ...mapGetters([ 'GET_LOADING' ])
    },
    mounted() {
        const wHeight = document.documentElement.clientHeight;
        const hHeight = document.querySelector('.el-header').clientHeight;
        const fHeight = document.querySelector('.main-header').clientHeight;
        this.period = moment(new Date()).format('YYYYMM');
        this.changePeriod();
        this.getTeam();
        this.height = (wHeight - hHeight - fHeight - 70) / 3;
    },
    methods: {
        format(data) {
            return data.slice(1, data.length);
        },
        getTeam() {
            this.$axios({
                url: '/api/Team/api_teamsforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.teams = res.data || [];
                }
            });
        },
        getData() {
            const loading = this.$loading({ lock: true, text: this.GET_LOADING });
            this.$axios({
                url: '/api/Cashflow/api_profitchart',
                params: {
                    period: this.period,
                    teamid: this.teamid || 0
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    const data = res.data || {};
                    this.tableData = data.profitsbyemp || [];
                    const totalpro = data.totalprofits || [];
                    let arr1 = ['稼働人月'];
                    let arr2 = ['待機人月'];
                    let arr3 = ['平均利益/人'];
                    let arr4 = ['平均利益率'];
                    let arr5 = ['名称'];
                    let arr6 = [];
                    totalpro.forEach((item) => {
                        arr1.push(item.onPJPersons / 100);
                        arr2.push(item.benchPersons / 100);
                        arr3.push(((item.sales - item.humanCost) / item.onPJPersons * 100).toFixed(2));
                        arr4.push(((item.sales - item.humanCost) / item.sales).toFixed(2));
                        arr5.push(item.fromDate.substring(0, 7).replace('-', '年')+'月');
                    });
                    arr6 = [arr5, arr1, arr2, arr3, arr4];
                    console.log(arr6.slice(1, arr6.length));
                    this.totalprofit = arr6;
                    const totalprofits = data.totalprofits || [];
                    let sales = [];
                    let margin = [];
                    let humanCost = [];
                    let benchCost = [];
                    this.tableData.forEach(item => {
                        if (item.profits) {
                            item.profits.forEach(cell => {
                                if (this.maxSales < cell.sales) {
                                    this.maxSales = cell.sales;
                                }
                                if (this.maxMargin < cell.margin) {
                                    this.maxMargin = cell.margin;
                                }
                            });
                        }
                    });
                    totalprofits.forEach(item => {
                        sales.push(item.sales);
                        margin.push(item.margin);
                        humanCost.push(item.humanCost);
                        benchCost.push(item.benchCost);
                    });
                    this.yAxis = [ {
                        label: '利益額',
                        data: margin
                    }, {
                        label: '売上額',
                        data: sales
                    }, {
                        label: '人件费',
                        data: humanCost
                    }, {
                        label: '待機代',
                        data: benchCost
                    } ];
                    this.$nextTick(() => {
                        this.initLine();
                    });
                }
            });
        },
        initLine() {
            const chart = echarts.init(this.$refs.line);
            chart.clear();
            const series = [];
            this.yAxis.forEach((item, i) => {
                let colors = '';
                let numLine = 1;
                switch (i) {
                    case 0:
                        colors = '#45BE87';
                        numLine = 3;
                        break;
                    case 1:
                        colors = '#E6A23C';
                        numLine = 3;
                        break;
                    case 2:
                        colors = '#1473B7';
                        numLine = 1;
                        break;
                    case 3:
                        colors = '#DB414E';
                        numLine = 1;
                        break;
                }
                series.push({
                    name: item.label,
                    type: 'line',
                    data: item.data,
                    itemStyle: {
                        color: colors
                    },
                    lineStyle: {
                        color: colors,
                        width: numLine
                    }
                });
            });
            const options = {
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    top: '20px',
                    left: '0',
                    right: '3%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.xAxis
                },
                yAxis: {
                    type: 'value'
                },
                series
            };
            chart.setOption(options);
            window.onresize = () => {
                chart.resize();
            };
        },
        changePeriod() {
            const curDate = moment(this.period, 'YYYYMM').unix() * 1000;
            this.curMonth = new Date(curDate).getMonth();
            this.columns = [];
            this.xAxis = [];
            for (let i = 0; i < 7; i++) {
                let duration = 3 - i;
                const label = `${moment(new Date(curDate).setMonth(this.curMonth - duration)).format('YYYY-MM').replace('-', '年')}月`;
                this.xAxis.push(label);
                this.columns.push(label);
            }
            this.getData();
        },
        handleStyle(data, type) {
            if (type === 1) {
                const width = (Math.abs(Number(data.margin) / this.maxSales)) * 100;
                return {
                    width: `${width < 20 ? 20 : width}%`
                };
            } else {
                let left = Math.ceil((Math.abs(Number(data.margin) / this.maxSales)) * 100);
                let ratio = (Math.abs(Number(data.sales) / this.maxSales));
                let dvalue = 0;
                if (left && ratio === 1) {
                    dvalue = left < 20 ? 15 : left - 5;
                }
                return {
                    width: `${Math.ceil(ratio * 100) - dvalue}%`,
                    // 'left': left ? `${left < 20 ? 15 : left - 5}%` : 0,
                    // 'text-align': 'right',
                    'border-color': Number(data.sales) ? '#1473B7' : 'transparent',
                    'background-color': Number(data.sales) ? '#1473B7' : 'transparent',
                };
            }
        }
    }
};
</script>

<style lang="less">
.profit-chart {
    .main-header {
        .el-form-item {
            margin-right: 30px;
            width: 140px;
            .el-date-editor {
                width: 140px;
            }
        }
        .icon-list {
            display: inline-block;
            width: 50%;
            div {
                display: inline-block;
                height: 100%;
                margin-right: 15px;
            }
            span:first-child {
                display: inline-block;
                vertical-align: top;
                position: relative;
                top: 14px;
                width: 30px;
                height: 20px;
                margin-right: 5px;
                border-radius: 4px;
            }
            span {
                display: inline-block;
            }
        }
    }
    .chart-wrapper {
        width: 100%;
        margin-top: 20px;
        & > div {
            width: 100%;
            height: 100%;
        }
    }
    .el-table .cell {
        padding: 0;
    }
    .bar-box {
        padding: 0;
        width: 100%;
        border-radius: 4px;
        height: 29px;
        line-height: 29px;
        color: #fff;
        text-align: center;
        position: relative;
        .small {
            width: 20px;
            height: 100%;
            border-radius: 4px;
            position: absolute;
            left: 0;
            top: 0;
            background-color: #45BE87;
            z-index: 2;
            &.bg-yellow {
                background-color: #E6A23C;
            }
            &.bg-danger {
                background-color: #DB414E !important;
            }
        }
        .margin-bar {
            width: 20px;
            height: 100%;
            border-radius: 4px;
            position: absolute;
            left: 0;
            top: 0;
            text-indent: 50%;
        }
    }
    .mt20{
        margin-top: 20px;
    }
}
</style>
