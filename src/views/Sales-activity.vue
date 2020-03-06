<template>
    <main-wrapper class="sales-activity">
        <el-form class="main-header header-form" slot="header" size="mini" inline label-width="40px">
            <el-form-item>
                <el-select v-model="form.teamid" placeholder="部门" @change="getData">
                    <el-option v-for="item in teams" :key="item.TeamID" :label="item.TeamName" :value="item.TeamID"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="form.salespersonid" placeholder="营业" @change="getData">
                    <el-option v-for="item in sales" :key="item.ID" :label="item.Name" :value="item.ID"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input v-model="form.name" placeholder="姓名" @blur="getData"></el-input>
            </el-form-item>
            <el-form-item>
                <el-date-picker
                    type="date"
                    @change="getData"
                    v-model="form.fromdate"
                    value-format="yyyy-MM-dd"
                    :clearable="false"
                    :editable="false"
                    format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
        </el-form>
        <web-table v-if="!IS_H5" :data="listData" :cols="columns" :opt="opt" @update="getData"></web-table>
        <mobile-table v-else :data="mobileListData" :opt="opt"  @update="getData"></mobile-table>
        <form-dialog></form-dialog>
    </main-wrapper>
</template>

<script>
import { mapGetters } from 'vuex';
import MainWrapper from '@components/main-wrapper';
import WebTable from '@components/sales-activity/web-table';
import MobileTable from '@components/sales-activity/mobile-table';
import FormDialog from '@components/sales-activity/dialog';
import moment from 'moment';
import { CHANGE_TAB_TITLE } from '@vuex/actions';

export default {
    components: {
        MainWrapper,
        WebTable,
        MobileTable,
        FormDialog
    },
    data() {
        return {
            form: {
                teamid: '',
                salespersonid: '',
                name: '',
                fromdate: new Date()
            },
            teams: [],
            employeeTypes: [],
            sales: [],
            columns: [],
            listData: [],
            opt: {},
            mobileListData: [],
            mobilieColumns: []
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.$store.dispatch({
                type: CHANGE_TAB_TITLE,
                title: '活动清单'
            });
            vm.getData();
            vm.getTeams();
            vm.getEmployeeTypes();
            vm.getSalespersonforselect();
        });
    },
    computed: {
        ...mapGetters(['IS_H5'])
    },
    methods: {
        getData() {
            const loading = this.$loading({ lock: true, text: '正在获取活动清单中...' });
            this.$axios({
                url: '/api/getsalesactivitylist',
                params: {
                    teamid: this.form.teamid || 0,
                    salespersonid: this.form.salespersonid || 0,
                    name: this.form.name,
                    fromdate: this.form.fromdate
                },
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res.code === 0) {
                    this.resultHandler(res.data);
                } else {
                    this.$message({
                        type: 'error',
                        showClose: true,
                        message: res.message ? res.message : '接口开小差了，没有返回信息'
                    });
                }
            });
        },
        getTeams() {
            this.$axios({
                url: '/api/teamsforselect'
            }).then(res => {
                this.teams = res || [];
            });
        },
        getEmployeeTypes() {
            this.$axios({
                url: '/api/employeetypesforselect'
            }).then(res => {
                this.employeeTypes = res || [];
                this.$set(this.opt, 'employeeTypes', this.employeeTypes);
            });
        },
        getSalespersonforselect() {
            this.$axios({
                url: '/api/salespersonforselect'
            }).then(res => {
                this.sales = res.data || [];
                this.$set(this.opt, 'sales', this.sales);
            });
        },
        resultHandler(res) {
            const result = res || [];
            const x = {};
            const y = {};
            const data = [];
            const mobileY = {};
            const mobileData = [];
            let atyDates = [];
            /**
             * 集合 同时间的数据
             * 集合 同姓名的数据
             */
            result.length && result.forEach(item => {
                const date = moment(new Date(item.AtyDate).getTime()).format('YYYY-MM-DD');
                if (!x[date]) {
                    x[date] = [];
                }
                if (!y[item.EmployeeName]) {
                    y[item.EmployeeName] = [];
                }
                if (!atyDates.includes(date)) {
                    atyDates.push(date);
                }
                if (!mobileY[date]) {
                    mobileY[date] = [];
                }
                x[date] = item;
                y[item.EmployeeName].push(item);
                mobileY[date].push(item);
            });
            /**
             * 处理时间集合，从小到大排序
             */
            atyDates = atyDates.sort((a, b) => {
                return new Date(a).getTime() - new Date(b).getTime();
            });
            /**
             * 根据时间，整理出移动端页面 表格数据结构
             * [{
             *  column: { label: '', prop: 'data' } 表头
             *  data: [{ 返回值结构 }] 表数据
             * }]
             */
            atyDates.forEach(item => {
                const date = moment(new Date(item).getTime()).format('YYYY-MM-DD');
                let column = {
                    label: date,
                    prop: 'date'
                };
                mobileData.push({
                    column,
                    data: mobileY[date]
                });
            });
            /**
             * 根据姓名，整理同姓名的不同日期的表格数据
             * 表头: [{ label: date, prop: AtyDate0 }, { label: date, prop: AtyDate1 }, ...]
             * 表格数据: [{ EmployeeName: name, AtyDate0: { 返回值结构 }, AtyDate1: { 返回值结构 }, ... }]
             */
            Object.keys(y).forEach(name => {
                let row = {
                    EmployeeName: name
                };
                y[name].forEach(item => {
                    const date = moment(new Date(item.AtyDate).getTime()).format('YYYY-MM-DD');
                    const index = atyDates.indexOf(date);
                    if (index > -1) {
                        row[`AtyDate${index}`] = item;
                    }
                });
                data.push(row);
            });
            this.columns = atyDates.map((date, i) => {
                return {
                    prop: `AtyDate${i}`,
                    label: `${date} ${x[date].AtyWeekDay}`
                };
            });
            this.listData = data;
            this.mobileListData = mobileData.length ? mobileData : [{
                column: { label: moment(this.form.fromdate).format('YYYY-MM-DD'), prop: 'date' },
                data: []
            }];
        }
    }
};
</script>
