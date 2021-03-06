<template>
    <main-wrapper class="sales-activity">
        <el-form class="main-header header-form" slot="header" size="mini" inline label-width="40px">
            <el-form-item>
                <el-select v-model="form.salespersonid" clearable placeholder="营业" @change="getData">
                    <el-option v-for="item in sales" :key="item.id" :label="item.name" :value="item.id"></el-option>
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
            <el-form-item>
                <el-button type="primary" icon="el-icon-d-arrow-left" size="mini" @click="getNextFireDayData(0)"></el-button>
                <el-button type="primary" icon="el-icon-d-arrow-right" size="mini" @click="getNextFireDayData(1)"></el-button>
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
// import { CHANGE_TAB_TITLE } from '@vuex/actions';

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
                salespersonid: '',
                name: '',
                fromdate: ''
            },
            teams: [],
            sales: [],
            columns: [],
            listData: [],
            opt: {},
            mobileListData: [],
            mobilieColumns: [],
            loading: false
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.form.fromdate = moment(new Date()).format('YYYY-MM-DD');
            vm.getData();
            vm.getTeams();
            vm.getEmployees();
            vm.getSalespersonforselect();
        });
    },
    computed: {
        ...mapGetters(['IS_H5'])
    },
    mounted() {
        this.$root.$off('UPDATE_EMPLOYEES');
        this.$root.$on('UPDATE_EMPLOYEES', (key) => {
            this.getEmployees(key);
        });
    },
    methods: {
        getData() {
            const loading = this.$loading({ lock: true, text: '正在获取活动清单中...' });
            this.$axios({
                url: '/api/SalesActivity/api_getsalesactivitylist',
                params: {
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
                if (res && res.code === 0) {
                    this.formatResult(res.data || []);
                } else {
                    this.$message({
                        type: 'error',
                        showClose: true,
                        message: res.message ? res.message : '接口开小差了，没有返回信息'
                    });
                }
            });
        },
        getNextFireDayData(type) {
            let date = new Date(this.form.fromdate).getTime();
            let express = type ? date + 3600 * 1000 * 24 * 5 : date - 3600 * 1000 * 24 * 5;
            date = new Date().setTime(express);
            this.form.fromdate = moment(date).format('YYYY-MM-DD');
            this.getData();
        },
        getTeams() {
            this.$axios({
                url: '/api/Team/api_teamsforselect'
            }).then(res => {
                this.teams = res || [];
            });
        },
        getEmployees(keyword = '') {
            this.$axios({
                url: '/api/Employee/api_employeesforselect',
                params: {
                    keyword
                }
            }).then(res => {
                this.$set(this.opt, 'employees', res.data || []);
            });
        },
        getSalespersonforselect() {
            this.$axios({
                url: '/api/Employee/api_salespersonforselect'
            }).then(res => {
                this.sales = res.data || [];
                this.$set(this.opt, 'sales', res.data || []);
            });
        },
        /**
         * Web-Table
         * [{
         *  label: '日期 星期一'，prop: date1
         * },{
         *  label: '日期 星期二'，prop: date2
         * }]
         * 
         * [{
         *  employeeName: '', date1: {}, date2: {}, date3: {} ...
         * }]
         * 
         * Mobile Table
         * 
         */
        formatResult(res) {
            const result = [...res];
            const columns = [];
            const allEmployee = {};
            let data = [];
            result.forEach((item, i) => {
                columns.push({
                    label: `${item.date} ${item.weekDay}`,
                    prop: `date${i + 1}`,
                    date: item.date
                });
                let sameName = '';
                let recomIndex = -1;
                let count = 0;
                item.activities.forEach((cell, j) => {
                    if (!sameName) {
                        sameName = cell.employeeName;
                        recomIndex = j;
                    }
                    if (sameName === cell.employeeName) {
                        count++;
                        item.activities[recomIndex].rowspan = count;
                    } else {
                        recomIndex = j;
                        item.activities[recomIndex].rowspan = count;
                        this.sameName = cell.employeeName;
                        count = 0;
                    }
                    if (!allEmployee[cell.employeeName]) {
                        allEmployee[cell.employeeName] = {
                            maxRows: 0
                        };
                    }
                    if (!allEmployee[cell.employeeName][`date${i + 1}`]) {
                        allEmployee[cell.employeeName][`date${i + 1}`] = [];
                    }
                    allEmployee[cell.employeeName][`date${i + 1}`].push(cell);
                    let length = allEmployee[cell.employeeName][`date${i + 1}`].length;
                    
                    if (allEmployee[cell.employeeName].maxRows < length) {
                        allEmployee[cell.employeeName].maxRows = length;
                    }
                });
            });
            for (let key in allEmployee) {
                const maxRows = allEmployee[key].maxRows;
                for (let i = 0; i < maxRows; i++) {
                    data.push({
                        employeeName: key,
                        rowspan: i == 0 ? maxRows : 0,
                        date1: (allEmployee[key].date1 && allEmployee[key].date1[i]) || null,
                        date2: (allEmployee[key].date2 && allEmployee[key].date2[i]) || null,
                        date3: (allEmployee[key].date3 && allEmployee[key].date3[i]) || null,
                        date4: (allEmployee[key].date4 && allEmployee[key].date4[i]) || null,
                        date5: (allEmployee[key].date5 && allEmployee[key].date5[i]) || null,
                    });
                }
            }
            this.columns = [...columns];
            this.listData = [...data];
            this.mobileListData = [...res];
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
                const date = moment(new date(item.AtyDate).getTime()).format('YYYY-MM-DD');
                if (!x[date]) {
                    x[date] = [];
                }
                if (!y[item.employeeName]) {
                    y[item.employeeName] = [];
                }
                if (!atyDates.includes(date)) {
                    atyDates.push(date);
                }
                if (!mobileY[date]) {
                    mobileY[date] = [];
                }
                x[date] = item;
                y[item.employeeName].push(item);
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
             * 表格数据: [{ employeeName: name, AtyDate0: { 返回值结构 }, AtyDate1: { 返回值结构 }, ... }]
             */
            Object.keys(y).forEach(name => {
                let row = {
                    employeeName: name
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
