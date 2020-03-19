<template>
    <main-wrapper class="ess-edit">
        <el-card>
            <div class="summary">合计作业时间:<span>{{total}}</span></div>
            <el-table
                stripe
                size="small"
                :data="worktimes"
                class="table-wrapper"
                :row-class-name="rowClassName">
                <el-table-column label="日期" width="120">
                    <template slot-scope="scope">
                        <span>{{scope.row.Date}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="星期" prop="WeekDay" width="80"></el-table-column>
                <el-table-column label="平日/休日" width="80">
                    <template slot-scope="scope">
                        <span>{{formatDateType(scope.row)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="午前作业时间" width="260">
                    <template slot-scope="scope">
                        <el-time-picker
                            v-if="editable"
                            is-range
                            size="mini"
                            v-model="timePickers[`${scope.$index}_AM`]"
                            format="HH:mm"
                            value-format="HH:mm"
                            range-separator="~"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            placeholder="选择时间范围"
                            @change="timePickerChange(scope, 'AM')">
                        </el-time-picker>
                        <div v-else>
                            <span>{{scope.row.AMFromTime}}</span>
                            ~
                            <span>{{scope.row.AMToTime}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="午后作业时间" width="260">
                    <template slot-scope="scope">
                        <el-time-picker
                            v-if="editable"
                            is-range
                            size="mini"
                            v-model="timePickers[`${scope.$index}_PM`]"
                            format="HH:mm"
                            value-format="HH:mm"
                            range-separator="~"
                            start-placeholder="开始时间"
                            end-placeholder="结束时间"
                            placeholder="选择时间范围"
                            @change="timePickerChange(scope, 'PM')">
                        </el-time-picker>
                        <div v-else>
                            <span>{{scope.row.PMFromTime}}</span>
                            ~
                            <span>{{scope.row.PMToTime}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="作业内容">
                    <template slot-scope="scope">
                        <el-input v-if="editable" size="mini" v-model="scope.row.Content" :maxlength="100"></el-input>
                        <p v-else>{{scope.row.Content || '-'}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                    <template slot-scope="scope" v-if="editable && scope.$index === workDayIndex">
                        <el-button type="primary" size="mini" @click="copyOneToAll(scope)">拷贝</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-button v-if="editable" class="btn-add" type="primary" size="mini" @click="addFare">新增</el-button>
            <el-table
                v-if="(fares.length !== 0 && !editable) || editable"
                stripe
                size="small"
                :data="fares"
                class="table-wrapper">
                <el-table-column label="费用项" prop="FareID" width="120">
                    <template slot-scope="scope">
                        <el-select v-if="editable" size="mini" v-model="scope.row.FareID" @change="changeFareID(scope)">
                            <el-option :value="1" label="交通费"></el-option>
                            <el-option :value="99" label="其他"></el-option>
                        </el-select>
                        <span v-else>{{formatFareID(scope.row)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="费用金额" width="200">
                    <template slot-scope="scope">
                        <el-input v-if="editable" size="mini" type="number" v-model="scope.row.Amount"></el-input>
                        <span v-else color="danger">{{scope.row.Amount}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="备注">
                    <template slot-scope="scope">
                        <el-input v-if="editable" v-model="scope.row.Comment" size="mini" clearable></el-input>
                        <span v-else>{{scope.row.Comment || '-'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="发票" min-width="300">
                    <template slot-scope="scope">
                        <el-row>
                            <el-col :span="7" v-if="scope.row.FileID">
                                <el-button @click="watchInvoice(scope)" type="primary" size="mini">查看发票</el-button>
                            </el-col>
                            <el-col v-if="editable" :span="scope.row.FileID ? 17 : 24">
                                <upload :opt="{ btnText: '上传发票', scope: scope, show: true }" @upload="upload"></upload>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200" v-if="editable">
                    <template slot-scope="scope">
                        <el-button type="danger" size="mini" @click="removeFare(scope)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="footer" v-if="$route.name !== 'CashflowList'">
                <el-button v-if="editable" type="primary" size="small" @click="beforeSubmit">提交</el-button>
                <el-button size="small" @click="goBack">返回</el-button>
            </div>
        </el-card>
        <big-picture></big-picture>
    </main-wrapper>
</template>

<script>
// import { CHANGE_TAB_TITLE } from '@vuex/actions';
import MainWrapper from '@components/main-wrapper';
import Upload from '@components/upload';
import BigPicture from '@components/big-picture';
import moment from 'moment';

export default {
    components: {
        MainWrapper,
        BigPicture,
        Upload
    },
    props: {
        id: {
            type: Number,
            default: 0
        }
    },
    data() {
        return {
            files: {},
            essId: '',
            worktimes: [],
            fares: [],
            timePickers: {
                '0_PM': null,
                '0_AM': null,
                '1_AM': null,
                '1_PM': null,
                '2_AM': null,
                '2_PM': null,
                '3_AM': null,
                '3_PM': null,
                '4_AM': null,
                '4_PM': null,
                '5_AM': null,
                '5_PM': null,
                '6_AM': null,
                '6_PM': null,
                '7_AM': null,
                '7_PM': null,
                '8_AM': null,
                '8_PM': null,
                '9_AM': null,
                '9_PM': null,
                '10_AM': null,
                '10_PM': null,
                '11_AM': null,
                '11_PM': null,
                '12_AM': null,
                '12_PM': null,
                '13_AM': null,
                '13_PM': null,
                '14_AM': null,
                '14_PM': null,
                '15_AM': null,
                '15_PM': null,
                '16_AM': null,
                '16_PM': null,
                '17_AM': null,
                '17_PM': null,
                '18_AM': null,
                '18_PM': null,
                '19_AM': null,
                '19_PM': null,
                '20_AM': null,
                '20_PM': null,
                '21_AM': null,
                '21_PM': null,
                '22_AM': null,
                '22_PM': null,
                '23_AM': null,
                '23_PM': null,
                '24_AM': null,
                '24_PM': null,
                '25_AM': null,
                '25_PM': null,
                '26_AM': null,
                '26_PM': null,
                '27_AM': null,
                '27_PM': null,
                '28_AM': null,
                '28_PM': null,
                '29_AM': null,
                '29_PM': null,
                '30_AM': null,
                '30_PM': null,
                '31_AM': null,
                '31_PM': null
            },
            workDayIndex: -1,
            total: '',
            editable: false
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            // vm.$store.dispatch({
            //     type: CHANGE_TAB_TITLE,
            //     title: '编辑作业报告'
            // });
            if (to.params.id) {
                vm.getData(to.params.id);
            }
        });
    },
    mounted() {
        if (this.id) {
            this.getData(this.id);
        }
    },
    methods: {
        getData(cfid) {
            const loading = this.$loading({ lock: true, text: '正在获取作业报告数据...' });
            this.$axios({
                url: '/api/inittimesheet',
                params: { cfid },
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (typeof res === 'object') {
                    const result = res || {};
                    const worktimes = result.WorkTimes || [];
                    worktimes.forEach((item, index) => {
                        if (item.DateType === 1 && this.workDayIndex === -1) {
                            this.workDayIndex = index;
                        }
                        this.timePickers[`${index}_AM`] = [
                            this.formatTime(item, 'AMFromTime') || '',
                            this.formatTime(item, 'AMToTime') || ''
                        ];
                        this.timePickers[`${index}_PM`] = [
                            this.formatTime(item, 'PMFromTime') || '',
                            this.formatTime(item, 'PMToTime') || ''
                        ];
                        item.Date = this.formatDate(item.Date);
                        item.AMFromTime = this.formatTime(item, 'AMFromTime');
                        item.AMToTime = this.formatTime(item, 'AMToTime');
                        item.PMFromTime = this.formatTime(item, 'PMFromTime');
                        item.PMToTime = this.formatTime(item, 'PMToTime');
                    });
                    if (result.Fares && result.Fares.length) {
                        this.fares = [...result.Fares];
                    } else {
                        this.fares = [{ FareID: 1, Title: '交通费', Amount: '' }];
                    }
                    this.worktimes = [...worktimes];
                    this.essId = result.ID;
                    this.files = {};
                    this.$root.$emit('UPLOAD', { type: 'clear' });
                    this.total = `${result.TotalHours}小时${result.TotalMinutes}分钟`;
                    if (this.$route.name === 'ESSEdit') {
                        this.editable = !result.Approved || false;
                    } else {
                        this.editable = false;
                    }
                }
            });
        },
        upload({ file, opt }) {
            if (file) {
                this.files[opt.scope.$index] = file;
            } else {
                delete this.files[opt.scope.$index];
            }
        },
        rowClassName({ row }) {
            if (row.DateType !== 1) {
                return 'warning';
            }
        },
        formatDateType(row) {
            switch (Number(row.DateType)) {
                case 1:
                    return '平日';
                case 2:
                    return '休日';
                case 3:
                    return '祝日';
                default:
                    return '-';
            }
        },
        formatDate(value) {
            if (value) {
                return moment(new Date(value)).format('YYYY-MM-DD');
            }
            return '';
        },
        formatTime(row, field) {
            if (row[field]) {
                return moment(new Date(row[field])).format('HH:mm');
            }
            return '';
        },
        formatFareID(row) {
            if (row.FareID === 1) {
                return '交通费';
            } else {
                return row.Title || '';
            }
        },
        timePickerChange(scope, type) {
            this.updateTotal().then(secondTimeStamp => {
                this.total = `${parseInt(secondTimeStamp / 3600).toString().padStart(2, '0')}小时${parseInt((secondTimeStamp % 3600) / 60).toString().padStart(2, '0')}分钟`;
            });
            this.worktimes[scope.$index][`${type}FromTime`] = this.timePickers[`${scope.$index}_${type}`][0] || '';
            this.worktimes[scope.$index][`${type}ToTime`] = this.timePickers[`${scope.$index}_${type}`][1] || '';
        },
        updateTotal() {
            return new Promise(resolve => {
                let sumDuration = 0;
                Object.keys(this.timePickers).forEach(item => {
                    if (this.timePickers[item]) {
                        const [ fromTime, toTime ] = this.timePickers[item];
                        let [ fromTimeHH, fromTimeMM ] = fromTime.split(':');
                        let [ toTimeHH, toTimeMM ] = toTime.split(':');
                        sumDuration += (
                            (Number(toTimeHH) * 3600 + Number(toTimeMM) * 60) -
                            (Number(fromTimeHH) * 3600 + Number(fromTimeMM) * 60)
                        );
                    }
                });
                resolve(sumDuration);
            });
        },
        copyOneToAll(scope) {
            const timePickers = {};
            const worktimes = this.worktimes.map((item, index) => {
                if (item.DateType !== 1 && this.workDayIndex !== index) {
                    return item;
                } else {
                    timePickers[`${index}_AM`] = [scope.row.AMFromTime, scope.row.AMToTime];
                    timePickers[`${index}_PM`] = [scope.row.PMFromTime, scope.row.PMToTime];
                    return {
                        Date: item.Date,
                        WeekDay: item.WeekDay,
                        DateType: item.DateType,
                        AMFromTime: scope.row.AMFromTime,
                        AMToTime: scope.row.AMToTime,
                        PMFromTime: scope.row.PMFromTime,
                        PMToTime: scope.row.PMToTime,
                        Content: scope.row.Content
                    };
                }
            });
            this.worktimes = [...worktimes];
            this.timePickers = timePickers;
        },
        changeFareID(scope) {
            if (scope.row.FareID === 1) {
                this.fares[scope.$index].Title = '交通费';
            }
        },
        addFare() {
            this.fares.push({
                FareID: 1,
                Title: '交通费',
                Amount: ''
            });
        },
        removeFare(scope) {
            this.fares.splice(scope.$index, 1);
        },
        goBack() {
            this.$router.push({ name: 'ESSList' });
        },
        beforeSubmit() {
            const formData = new FormData();
            let message = '';
            formData.append('CashflowID', this.$route.params.id);
            formData.append('ID', this.essId);
            this.worktimes.forEach((item, index) => {
                Object.keys(item).forEach(key => {
                    if ('AMFromTime,AMToTime,PMFromTime,PMToTime'.includes(key)) {
                        formData.append(`worktimes[${index}].${key}`, `${item.Date} ${item[key]}`);
                    } else if ('Date,WeekDay,DateType,Content'.includes(key)) {
                        formData.append(`worktimes[${index}].${key}`, `${item[key] || ''}`);
                    }
                });
            });
            let noFile = false;
            let commentEmpty = false;
            this.fares.forEach((item, index) => {
                if (item.Amount) {
                    if (this.files[index]) {
                        formData.append(`file${index}`, this.files[index]);
                    }
                    if (item.ID) {
                        formData.append(`fares[${index}].ID`, item.ID);
                    }
                    if (item.FileID) {
                        formData.append(`fares[${index}].FileID`, item.FileID);
                    }
                    if (Number(item.Amount) > 3000 && !item.FileID && !this.files[index]) {
                        noFile = true;
                    }
                    if (item.FareID >= 99 && !item.Comment) {
                        commentEmpty = true;
                    }
                    formData.append(`fares[${index}].FareID`, item.FareID);
                    formData.append(`fares[${index}].Title`, item.Title);
                    formData.append(`fares[${index}].Comment`, item.Comment);
                    formData.append(`fares[${index}].Amount`, item.Amount);
                }
            });
            if (noFile) {
                this.$message({
                    type: 'warning',
                    message: '费用金额超过3000请上传发票'
                });
                return;
            }
            if (commentEmpty) {
                this.$message({
                    type: 'warning',
                    message: '请填写费用项备注'
                });
                return;
            }

            if (message) {
                this.$message({
                    type: 'warning',
                    message,
                    showClose: true
                });
            } else {
                this.save(formData);
            }
        },
        save(formData) {
            const loading = this.$loading({ lock: true, text: '正在提交作业报告中...' });
            this.$axios({
                method: 'POST',
                url: '/api/submittimesheet',
                params: formData,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                custom: {
                    loading,
                    vm: this
                }
            }).then(() => {
                loading.close();
                this.getData(this.$route.params.id);
            });
        },
        watchInvoice(scope) {
            this.$root.$emit('SHOW_PICTURE_DIALOG', {
                url: `http://www.your-partner.co.jp/api/getfareimage?fareid=${scope.row.ID}`
            });
        }
    }
};
</script>

<style lang="less">
.ess-edit {
    .el-card {
        width: 100%;
        background-color: #f2f6fc;
        .summary {
            height: 30px;
            line-height: 30px;
            color: #409EFF;
            text-align: right;
            span {
                margin-left: 10px;
            }
        }
        .table-wrapper {
            & + .table-wrapper {
                margin-top: 20px;
            }
            .el-date-editor--timerange.el-input__inner {
                width: 100%;
            }
            .warning td {
                background-color: rgba(260, 162, 60, 0.31) !important;
            }
        }
        .btn-add {
            margin: 20px 0 10px;
        }
        .footer {
            height: auto;
            padding: 20px 0 10px;
            border-top: none;
        }
    }
}
</style>
