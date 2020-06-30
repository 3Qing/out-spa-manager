<template>
    <main-wrapper class="task-manager">
        <!-- <div class="main-header" slot="header">
            <el-button size="mini" type="primary" @click="newHandle">新增</el-button>
            <el-switch v-model="owntask" inactive-text="所有人" active-text="仅自己" @change="getData" style="margin-left: 20px;"></el-switch>
        </div> -->
        <div class="clearfix">
            <div class="left fl">
                <Calendar @choseDay="clickDay"></Calendar>
                <ul class="ul1" v-if='dataPerson.length>0'>
                    <li @click='getData(0)'>自己</li>
                    <li @click='getData(-1)'>全员</li>
                    <li style="opacity:0;">-</li>
                    <li v-for='(item, index) in dataPerson' :key='index' @click='getData(item.userID)'>{{item.employeeNo}} {{item.name}}</li>
                </ul>
            </div>
            <div class="right fr" >
                <el-table :data="tableData" height="100%" border :summary-method="getSummaries" :show-summary=showSu @cell-click='handleClick'>
                    <el-table-column v-for="(item, index) in columns" :key="item.name" :min-width="index===0?'70px':'170px'">
                        <template slot="header">
                            <div v-if="index === 0"></div>
                            <div v-else>{{item.name}}</div>
                        </template>
                        <template slot-scope="scope">
                            <span v-if="scope.column.id === 'el-table_1_column_1'">{{scope.row.label}}</span>
                            <div v-if="scope.column.id !== 'el-table_1_column_1' && scope.row[item.prop]" class="task-cell-wrapper">
                                <span
                                    v-for="(cell, j) in scope.row[item.prop]"
                                    :key="j"
                                    :class="[cell.atyType===0?'cell-success':'cell-warning','task-cell','link']"
                                    :style="getStyle(cell,j,scope.row[item.prop])"
                                    @click="cellClick(cell)"
                                    :title='getTitle(cell.atyPurpose,cell.content)'
                                    >{{cell.atyPurpose}}</span>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <div v-show='isDialog' class="divDialog"></div> -->
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
        TaskDialog,
    },
    data() {
        return {
            showSu: true,
            owntask: true,
            columns: [],
            tableData: [],
            curTime: '',
            isTrue: true,
            timeData: '',
            dataLength: [],
            dataPerson: []
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.initTable();
            vm.timeData = moment(new Date()).format('YYYY-MM-DD');
            vm.getpersonData();
        });
    },
    computed: {
        ...mapGetters([ 'GET_LOADING' ])
    },
    mounted() {
        // this.$router.go(0);
        // if(this.tableData > 0) {
        // location.reload();
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
                    const date = fmt.substring(0,5);
                    columns.push({
                        name: `${date} ${this.formatWeek(fmt.substring(6,7))}`,
                        prop: `${date}`
                    });
                }
            }
            this.$nextTick(() => {
                this.columns = columns;
                this.getData(-1);
                this.getpersonData();
            });
        },
        timeDate(obj1, obj2) {
            let date1 = new Date(obj1);
            let date2 = new Date(obj2);
            let s1 = date1.getTime();
            let s2 = date2.getTime();
            let total = (s2 - s1)/1000/60;
            return total;
        },
        formatData(data) {
            const length = 25;
            const tmp = {};
            // console.log(data);
            data.forEach(item => {
                const time = moment(new Date(item.atyFromTime).getTime()).format('MM-DD|HH:mm');
                // console.log(time);
                // const [ date, startTime ] = time.split('|');
                const date = time.substring(0,5);
                const startTime = time.substring(6,11);
                const HH = startTime.split(':')[0].toString().padStart(2, '0');
                const mm = startTime.split(':')[1];
                // console.log(HH+':'+mm, this.timeDate(item.atyFromTime, item.atyToTime));
                const top = parseInt((Number(mm) / 60) * 100);
                const height = parseInt(this.timeDate(item.atyFromTime, item.atyToTime));
                // console.log(height);
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
        getData(ids) {
            const loading = this.$loading({ lock: true, text: this.GET_LOADING });
            this.$axios({
                url: '/api/SalesActivity/api_getactivitylist',
                params: {
                    userid: ids,
                    fromdate: this.curTime
                }
            }).then(res => {
                loading.close();
                let data = [];
                console.log(res.data);
                if (res && res.code === 0) {
                    data = res.data || [];
                    this.dataLength = data;
                }
                this.formatData(data);
            });
        },
        // 获得人员
        getpersonData() {
            this.$axios({
                url: '/api/SalesActivity/api_gettaskownerlist',
            }).then(res => {
                // let data = [];
                if (res && res.code === 0) {
                    this.dataPerson = res.data || [];
                }
            });
        },
        // 时间点击
        clickDay(data) {
            this.timeData = data;
            this.initTable(data);
        },
        getSummaries(param) {
            const { columns } = param;
            columns.forEach((column, index) => {
                if (index === 0) {
                    column.id = 'el-table_1_column_1';
                } else if (index === 1) {
                    column.id = 'el-table_1_column_2';
                } else if (index === 2) {
                    column.id = 'el-table_1_column_3';
                } else if (index === 3) {
                    column.id = 'el-table_1_column_4';
                } else if (index === 4) {
                    column.id = 'el-table_1_column_5';
                } else if (index === 5) {
                    column.id = 'el-table_1_column_6';
                } else if (index === 6) {
                    column.id = 'el-table_1_column_7';
                } else if (index === 7) {
                    column.id = 'el-table_1_column_8';
                }
            });
            return columns;
        },
        // 添加日程
        handleClick(row, col) {
            console.log(col, this.columns);
            if (col.id !== 'el-table_1_column_1') {
                let mins = '';
                if (col.id === 'el-table_1_column_2') {
                    mins = this.columns[1].prop;
                } else if (col.id === 'el-table_1_column_3') {
                    mins = this.columns[2].prop;
                } else if (col.id === 'el-table_1_column_4') {
                    mins = this.columns[3].prop;
                } else if (col.id === 'el-table_1_column_5') {
                    mins = this.columns[4].prop;
                } else if (col.id === 'el-table_1_column_6') {
                    mins = this.columns[5].prop;
                } else if (col.id === 'el-table_1_column_7') {
                    mins = this.columns[6].prop;
                } else if (col.id === 'el-table_1_column_8') {
                    mins = this.columns[7].prop;
                }
                let dater1 = Number(row.label.replace(/[^0-9]/ig, ""));
                let dater2 = Number(row.label.replace(/[^0-9]/ig, "")) + 1;
                if (dater1<10) {
                    dater1 = '0' + dater1;
                }
                if (dater2<10) {
                    dater2 = '0' + dater2;
                }
                let objs = {
                    dateFrom: moment(this.timeData).format(`YYYY-${mins} ${dater1}:00`),
                    dateTo: moment(this.timeData).format(`YYYY-${mins} ${dater2}:00`),
                    content: '',
                    atyType: [],
                    candidateID: '',
                    opportunityID: '',
                    atyLocation: '',
                    atyPurpose: ''
                };
                this.$root.$emit('SHOW_TASK_DIALOG', {
                    news: true,
                    objs,
                    callback: () => {
                        this.getData(-1);
                    }
                });
            }
            
        },
        cellClick(data) {
            this.$root.$emit('SHOW_TASK_DIALOG', {
                news: false,
                data,
                edit: false,
                callback: () => {
                    this.getData(-1);
                }
            });
            this.cancelBubble();
        },
        // 阻止事件触发
        cancelBubble(e) {
            let evt = e ? e : window.event;
            if(evt.stopPropagation) {
                evt.stopPropagation();
            } else {
                evt.cancelBubble = true;
            }
        },
        getStyle(item, j, arrLength) {
            const ileft = j * (100 / arrLength.length) + '%';
            const itop = item.top + '%';
            const iwidth = (100 / arrLength.length) + '%';
            const zIndex = 99 + j;
            return {
                width: iwidth,
                height: `${item.height}px`,
                top: itop,
                left: ileft,
                'z-index': zIndex
            };
        },
        getTitle(id, type) {
            let obj = '标题：' + id + '。' + '内容：' + type;
            return obj;
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
        height: 250px;
        .wh_container {
            height: 250px;
            box-shadow: 0 0 5px 5px #f8f8f8;
            .wh_content_all {
                height: 250px;
                background-color: transparent;
                .wh_jiantou1, .wh_jiantou2 {
                    border-color: #999;
                }
                li {
                    color: #333;
                }
                .wh_content_item{
                    height: 28px;
                }
                .wh_item_date {
                    color: #333;
                    border-radius: 50%;
                    height: 25px;
                    width: 25px;
                    line-height: 25px;
                    font-size: 14px;
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
        .ul1{
            margin-top: 10px;
            li{
                cursor: pointer;
            }
        }
    }
    .right {
        // margin-left: 30px;
        position: relative;
        width: calc(100% - 260px);
        height: calc(100% - 40px);
        .cell-info {
            // padding-right: 15px;
            background-color: rgb(233, 233, 235) !important;
        }
        .cell-success {
            color: white;
            // padding-right: 15px;
            background-color: rgba(69, 190, 135, 0.8) !important;
            box-sizing: border-box;
            padding: 3px;
            border: 1px solid white;
            line-height: 18px;
        }
        .cell-warning {
            color: white;
            background-color: rgb(20, 115, 183, 0.8) !important;
            box-sizing: border-box;
            padding: 3px;
            border: 1px solid white;
            line-height: 18px;
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
                position: relative;
                height: 100%;
            }
            .task-cell {
                display: inline-block;
                vertical-align: bottom;
                // padding: 8px 4px;
                position: absolute;
                border-radius: 5px;
                text-align: center;
                width: 100%;
                min-width: 60px;
                text-align: left;
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
