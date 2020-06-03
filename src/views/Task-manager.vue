<template>
    <main-wrapper class="task-manager">
        <div class="main-header" slot="header">
            <el-button size="mini" type="primary" @click="newHandle">新增</el-button>
            <el-switch v-model="owntask" inactive-text="所有人" active-text="仅自己" @change="getData" style="margin-left: 20px;"></el-switch>
        </div>
        <div class="clearfix">
            <div class="left fl">
                <Calendar
                    @choseDay="clickDay"></Calendar>
            </div>
            <div class="right fr" >
                <el-table :data="tableData" height="100%" border>
                    <el-table-column v-for="(item, i) in columns" :key="item.name" :min-width="i===0?'70px':'170px'">
                        <template slot="header">
                            <div v-if="i === 0"></div>
                            <div v-else>{{item.name}}</div>
                        </template>
                        <template slot-scope="scope">
                            <span v-if="scope.column.id === 'el-table_1_column_1'">{{scope.row.label}}</span>
                            <div v-if="scope.column.id !== 'el-table_1_column_1' && scope.row[item.prop]" class="task-cell-wrapper">
                                <span
                                    v-for="(cell, j) in scope.row[item.prop]"
                                    :key="j"
                                    class="cell-success task-cell link"
                                    :style="getStyle(cell,scope.row[item.prop])"
                                    @click="cellClick(cell)"
                                    >{{cell.atyPurpose}}</span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <task-dialog></task-dialog>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import Calendar from 'vue-calendar-component';
import moment from 'moment';
import TaskDialog from '@components/task-manager/dialog';
import { mapGetters } from 'vuex';
export default {
    components: {
        MainWrapper,
        Calendar,
        TaskDialog
    },
    data() {
        return {
            owntask: true,
            columns: [],
            tableData: [],
            curTime: '',
            isTrue: true
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.initTable();
        });
    },
    computed: {
        ...mapGetters([ 'GET_LOADING' ])
    },
    mounted() {
        // if(this.tableData > 0) {
        //     location.reload();
        // }
        // console.log('111');
    },
    methods: {
        initTable(val) {
            let curTime;
            if (val) {
                curTime = new Date(val);
            } else {
                curTime = new Date();
            }
            this.curTime = moment(new Date(curTime).getTime()).format('YYYY-MM-DD');
            const length = 7;
            const columns = [];
            for (let i = -1; i < length; i++) {
                if (i === -1) {
                    columns.push({
                        name: '时间\\日期',
                        prop: 'label'
                    });
                } else {
                    const fmt = moment(curTime).add(i, 'days').format('MM-DD|E');
                    const date = fmt.split('|')[0];
                    columns.push({
                        name: `${date} ${this.formatWeek(fmt.split('|')[1])}`,
                        prop: `${date}`
                    });
                }
            }
            this.$nextTick(() => {
                this.columns = columns;
                this.getData();
            });
        },
        formatData(data) {
            const length = 25;
            const tmp = {};
            data.forEach(item => {
                const time = moment(new Date(item.atyDate).getTime()).format('MM-DD|HH:mm');
                const [ date, startTime ] = time.split('|');
                const HH = startTime.split(':')[0].toString().padStart(2, '0');
                const mm = startTime.split(':')[1];
                const top = parseInt((Number(mm) / 40) * 100);
                const height = parseInt(((Number(mm) + item.atyMinutes) / 60) * 100);
                if (!tmp[HH]) {
                    tmp[HH] = {};
                }
                if (!tmp[HH][date]) {
                    tmp[HH][date] = [];
                }
                item.top = top;
                item.height = height;
                tmp[HH][date].push(item);
            });
            const tableData = [];
            for (let i = -1; i < length; i++) {
                const HH = String(i).padStart(2, '0');
                // console.log(HH);
                // const o = {
                //     label: `${HH}:00`
                // };
                const o = {
                    label: ''
                };
                if(i===-1){
                    o.label = '';
                }
                if (i >=0 && i<12) {
                    o.label = '午前' + i + '时';
                } else {
                    o.label = '午后' + i + '时';
                }
                if (tmp[HH]) {
                    for (let key in tmp[HH]) {
                        o[key] = tmp[HH][key];
                    }
                }
                tableData.push(o);
            }
            tableData[0].label = '';
            this.tableData = tableData;
            console.log(this.tableData);
            this.$nextTick(() => {
                document.querySelector('.el-table__body-wrapper').scrollTop = 9 * 60;
            });
        },
        formatWeek(val) {
            switch (Number(val)) {
                case 1:
                    return '星期一';
                case 2:
                    return '星期二';
                case 3:
                    return '星期三';
                case 4:
                    return '星期四';
                case 5:
                    return '星期五';
                case 6:
                    return '星期六';
                case 7:
                    return '星期日';
            }
        },
        getData() {
            const loading = this.$loading({ lock: true, text: this.GET_LOADING });
            this.$axios({
                url: '/api/SalesActivity/api_getactivitylist',
                params: {
                    owntask: this.owntask,
                    fromdate: this.curTime
                }
            }).then(res => {
                loading.close();
                let data = [];
                if (res && res.code === 0) {
                    data = res.data || [];
                }
                this.formatData(data);
            });
        },
        clickDay(data) {
            this.initTable(data);
        },
        newHandle() {
            this.$root.$emit('SHOW_TASK_DIALOG', {
                news: true,
                callback: () => {
                    this.getData();
                }
            });
        },
        cellClick(data) {
            console.log(data);
            this.$root.$emit('SHOW_TASK_DIALOG', {
                data,
                edit: false,
                callback: () => {
                    this.getData();
                }
            });
        },
        getStyle(item) {
            const itop = item.top - 25 + '%';
            return {
                height: `(${item.height}%)`,
                top: itop
            };
        }
    }
};
</script>

<style lang="less">
.task-manager {
    .content-wrapper {
        height: 100%;
        & > div {
            height: 100%;
        }
    }
    .clearfix {
        height: 100%;
    }
    .left {
        width: 250px;
        height: 300px;
        .wh_container {
            height: 300px;
            box-shadow: 0 0 5px 5px #f8f8f8;
            .wh_content_all {
                height: 300px;
                background-color: transparent;
                .wh_jiantou1, .wh_jiantou2 {
                    border-color: #999;
                }
                li {
                    color: #333;
                }
                .wh_item_date {
                    color: #333;
                    border-radius: 50%;
                    height: 30px;
                    width: 30px;
                    line-height: 30px;
                    &.wh_other_dayhide {
                        color: #ccc;
                    }
                    &:hover {
                        color: #fff;
                        background-color: #1473B7;
                    }
                    &.wh_chose_day {
                        color: #fff;
                        background-color: #45BE87;
                    }
                    &.wh_isToday {
                        color: #fff;
                        background-color: #E6A23C;
                    }
                }
            }
        }
    }
    .right {
        // margin-left: 30px;
        width: calc(100% - 260px);
        height: calc(100% - 40px);
        .cell-info {
            // padding-right: 15px;
            background-color: rgb(233, 233, 235) !important;
        }
        .cell-success {
            color: #606266;
            // padding-right: 15px;
            background-color: rgba(69, 190, 135, 0.4) !important;
        }
        .cell-warning {
            color: #606266;
            background-color: rgb(250, 236, 216) !important;
        }
        .el-table {
            tbody {
                .cell {
                    height: 100%;
                    overflow: visible;
                }
                td {
                    padding: 0;
                    height: 60px;
                }
                .el-table_1_column_1 {
                    .cell {
                        line-height: 60px;
                    }
                }
            }
            .task-cell-wrapper {
                height: 100%;
            }
            .task-cell {
                display: inline-block;
                vertical-align: bottom;
                // padding: 8px 4px;
                position: relative;
                border-radius: 4px;
                text-align: center;
                min-width: 60px;
                & + .task-cell {
                    // margin-left: 10px;
                }
            }
        }
        .el-table thead th:first-of-type:before {
            content: '日期';
            position: absolute;
            height: 20px;
            top: 10px;
            right: 12px;
        }
        
        .el-table thead th:first-of-type:after {
            content: '时间';
            position: absolute;
            height: 20px;
            bottom: 10px;
            left: 12px;
        }
        
        .el-table thead th:first-of-type .cell {
            position: absolute;
            top: 0;
            left: 0;
            width: 110px;
            height: 2px;
            background-color: #EBEEF5;
            display: block;
            text-align: center;
            transform: rotate(42deg);
            transform-origin: top left;
            -ms-transform: rotate(42deg);
            -ms-transform-origin: top left;
            -webkit-transform: rotate(42deg);
            -webkit-transform-origin: top left;
        }
    }
}
</style>
