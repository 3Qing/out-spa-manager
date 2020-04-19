<template>
    <main-wrapper class="profit-chart">
        <el-form slot="header" class="main-header" size="mini" inline>
            <el-form-item>
                <el-select v-model="teamid" placeholder="チーム" @change="getData" clearable>
                    <el-option v-for="item in teams" :key="item.TeamID" :label="item.TeamName" :value="item.TeamID"></el-option>
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
                <el-table-column label="社員番号" prop="EmpeeNo" width="120px"></el-table-column>
                <el-table-column label="氏名" prop="EmpeeName" width="140px"></el-table-column>
                <el-table-column
                    v-for="(item, i) in columns"
                    :key="i"
                    :label="item">
                    <template slot-scope="scope">
                        <div class="bar-box" >
                            <span
                                :class="[
                                    'small',
                                    scope.row.Profits[i].Status === 10 && 'bg-yellow',
                                    Number(scope.row.Profits[i].Margin) < 0 && 'bg-danger'
                                ]"
                                :style="handleStyle(scope.row.Profits[i], 1)"
                                v-if="scope.row.Profits[i].Margin">{{scope.row.Profits[i].Margin}}</span>
                            <span class="margin-bar" v-if="scope.row.Profits[i].Sales" :style="handleStyle(scope.row.Profits[i], 2)">{{scope.row.Profits[i].Sales}}</span>
                        </div>
                    </template>    
                </el-table-column>
            </el-table>
            <div class="chart-wrapper" :style="{height: `${height}px`}">
                <div ref="line"></div>
            </div>
        </div>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import moment from 'moment';
import echarts from 'echarts';
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
            height: 0
        };
    },
    mounted() {
        const wHeight = document.documentElement.clientHeight;
        const hHeight = document.querySelector('.el-header').clientHeight;
        const fHeight = document.querySelector('.main-header').clientHeight;
        this.period = moment(new Date()).format('YYYYMM');
        this.changePeriod();
        this.getTeam();
        this.height = (wHeight - hHeight - fHeight - 70) / 2;
    },
    methods: {
        getTeam() {
            this.$axios({
                url: '/api/teamsforselect'
            }).then(res => {
                this.teams = res;
            });
        },
        getData() {
            this.$axios({
                url: '/api/profitchart',
                params: {
                    period: this.period,
                    teamid: this.teamid || 0
                }
            }).then(res => {
                if (res && res.code === 0) {
                    this.tableData = res.profitbyemp || [];
                    const profitsummary = res.profitsummary || [];
                    let sales = [];
                    let margin = [];
                    this.tableData.forEach(item => {
                        if (item.Profits) {
                            item.Profits.forEach(cell => {
                                if (this.maxSales < cell.Sales) {
                                    this.maxSales = cell.Sales;
                                }
                                if (this.maxMargin < cell.Margin) {
                                    this.maxMargin = cell.Margin;
                                }
                            });
                        }
                    });
                    profitsummary.forEach(item => {
                        sales.push(item.Sales);
                        margin.push(item.Margin);
                    });
                    this.yAxis = [ {
                        label: '利润金额',
                        data: margin
                    }, {
                        label: '销售额',
                        data: sales
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
                series.push({
                    name: item.label,
                    type: 'line',
                    data: item.data,
                    itemStyle: {
                        color: i === 0 ? '#45BE87' : '#E6A23C'
                    },
                    lineStyle: {
                        color: i === 0 ? '#45BE87' : '#E6A23C'
                    }
                });
            });
            const options = {
                tooltip: {
                    trigger: 'axis'
                },
                grid: {
                    top: '20px',
                    left: '3%',
                    right: '4%',
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
                const width = (Math.abs(Number(data.Margin) / this.maxSales)) * 100;
                return {
                    width: `${width < 20 ? 20 : width}%`
                };
            } else {
                let left = Math.ceil((Math.abs(Number(data.Margin) / this.maxSales)) * 100);
                let ratio = (Math.abs(Number(data.Sales) / this.maxSales));
                let dvalue = 0;
                if (left && ratio === 1) {
                    dvalue = left < 20 ? 15 : left - 5;
                }
                return {
                    width: `${Math.ceil(ratio * 100) - dvalue}%`,
                    'left': left ? `${left < 20 ? 15 : left - 5}%` : 0,
                    'border-color': Number(data.Sales) ? '#1473B7' : 'transparent',
                    'background-color': Number(data.Sales) ? '#1473B7' : 'transparent',
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
        }
    }
}
</style>