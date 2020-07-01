<template>
    <main-wrapper class="ess-edit">
        <el-card>
            <div class="summary">合計作業時間：<span>{{total}}</span></div>
            <el-table
                stripe
                size="small"
                :data="worktimes"
                class="table-wrapper"
                :row-class-name="rowClassName">
                <el-table-column label="日期" width="120">
                    <template slot-scope="scope">
                        <span>{{scope.row.date}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="曜日" prop="weekDay" width="80"></el-table-column>
                <el-table-column label="平日/休日" width="80">
                    <template slot-scope="scope">
                        <span>{{formatDateType(scope.row)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="午前作業時間" width="260">
                    <template slot-scope="scope">
                        <el-time-select
                            v-if="editable"
                            size="mini"
                            style="width: 100px"
                            placeholder="開始"
                            v-model="scope.row.amFromTime"
                            @change='elhandlechange(scope.row)'
                            :picker-options="{
                                start: '00:00',
                                step: '00:15',
                                end: '23:45'
                            }"></el-time-select>
                        <el-time-select
                            v-if="editable"
                            size="mini"
                            style="width: 100px"
                            placeholder="終了"
                            v-model="scope.row.amToTime"
                            @change='elhandlechange(scope.row)'
                            :picker-options="{
                                start: '00:00',
                                step: '00:15',
                                end: '23:45',
                                minTime: scope.row.amFromTime
                            }"></el-time-select>
                        <div v-else>
                            <span>{{scope.row.amFromTime}}</span>
                            ~
                            <span>{{scope.row.amToTime}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="午後作業時間" width="260">
                    <template slot-scope="scope">
                        <el-time-select
                            v-if="editable"
                            size="mini"
                            style="width: 100px"
                            placeholder="開始"
                            @change='elhandlechange'
                            v-model="scope.row.pmFromTime"
                            :picker-options="{
                                start: '00:00',
                                step: '00:15',
                                end: '23:45'
                            }"></el-time-select>
                        <el-time-select
                            v-if="editable"
                            size="mini"
                            style="width: 100px"
                            placeholder="終了"
                            @change='elhandlechange'
                            v-model="scope.row.pmToTime"
                            :picker-options="{
                                start: '00:00',
                                step: '00:15',
                                end: '23:45',
                                minTime: scope.row.pmFromTime
                            }"></el-time-select>
                        <div v-else>
                            <span>{{scope.row.pmFromTime}}</span>
                            ~
                            <span>{{scope.row.pmToTime}}</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="作業内容" width="300">
                    <template slot-scope="scope">
                        <el-input v-if="editable" size="mini" v-model="scope.row.content" :maxlength="100"></el-input>
                        <p v-else>{{scope.row.content || '-'}}</p>
                    </template>
                </el-table-column>
                <el-table-column label="ｱｸｼｮﾝ" width="100" v-if="!faad">
                    <template slot-scope="scope" v-if="editable && scope.$index === workDayIndex">
                        <el-button type="primary" size="mini" @click="copyOneToAll(scope)">コピー</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-button v-if="editable" class="btn-add" type="primary" size="mini" @click="addFare">新規追加</el-button>
            <el-table
                v-if="(fares.length !== 0 && !editable) || editable"
                stripe
                size="small"
                :data="fares"
                class="table-wrapper">
                <el-table-column label="費用項目" prop="fareID" width="120">
                    <template slot-scope="scope">
                        <el-select v-if="editable" size="mini" v-model="scope.row.fareID" @change="changeFareID(scope)">
                            <el-option :value="1" label="交通代"></el-option>
                            <el-option :value="99" label="その他"></el-option>
                        </el-select>
                        <span v-else>{{formatFareID(scope.row)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="費用金額" width="200">
                    <template slot-scope="scope">
                        <el-input v-if="editable" size="mini" type="number" v-model="scope.row.amount"></el-input>
                        <span v-else color="danger">{{scope.row.amount}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="コメント">
                    <template slot-scope="scope">
                        <el-input v-if="editable" v-model="scope.row.comment" size="mini" clearable></el-input>
                        <span v-else>{{scope.row.comment || '-'}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="領収書" min-width="300">
                    <template slot-scope="scope">
                        <el-row>
                            <el-col :span="7" v-if="scope.row.fileID">
                                <el-button @click="watchInvoice(scope)" type="primary" size="mini">領収書照会</el-button>
                            </el-col>
                            <el-col v-if="editable" :span="scope.row.fileID ? 17 : 24">
                                <upload :opt="{ btnText: '領収書写真ｱｯﾌﾟﾛｰﾄﾞ', scope: scope, show: true }" @upload="upload"></upload>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>
                <el-table-column label="アクション" width="200" v-if="editable">
                    <template slot-scope="scope">
                        <el-button type="danger" size="mini" @click="removeFare(scope)">削除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="footer" v-if="$route.name !== 'CashflowList'">
                <el-button v-if="editable" type="primary" size="small" @click="beforeSubmit">保存</el-button>
                <el-button size="small" @click="goBack">リターン</el-button>
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
import { imageFileToPreview } from '@_public/utils';

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
        },
        faad: {
            type: Boolean,
            default: false
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
            const loading = this.$loading({ lock: true, text: '作業報告書データ取得中...' });
            this.$axios({
                url: '/api/Timesheet/api_inittimesheet',
                params: { cfid },
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res.code === 0) {
                    const result = res.data || {};
                    const worktimes = result.workTimes || [];
                    worktimes.forEach((item, index) => {
                        if (item.dateType === 1 && this.workDayIndex === -1) {
                            this.workDayIndex = index;
                        }
                        item.date = this.formatDate(item.date);
                        item.amFromTime = this.formatTime(item, 'amFromTime');
                        item.amToTime = this.formatTime(item, 'amToTime');
                        item.pmFromTime = this.formatTime(item, 'pmFromTime');
                        item.pmToTime = this.formatTime(item, 'pmToTime');
                        item.content = item.content || '';
                    });
                    if (result.employeeFares && result.employeeFares.length) {
                        this.fares = [...result.employeeFares];
                    } else {
                        this.fares = [{ fareID: 1, title: '交通费', amount: '' }];
                    }
                    this.worktimes = [...worktimes];
                    this.essId = result.id;
                    this.files = {};
                    this.$root.$emit('UPLOAD', { type: 'clear' });
                    this.total = `${result.totalHours}時間${result.totalMinutes}分`;
                    if (this.$route.name === 'ESSEdit') {
                        this.editable = !result.approved || false;
                    } else {
                        this.editable = false;
                    }
                }
            });
        },
        timeDate(obj1, obj2) {
            const demo1 = '2020/06/01 '+obj1;
            const demo2 = '2020/06/01 '+obj2;
            let date1 = new Date(demo1);
            let date2 = new Date(demo2);
            let s1 = date1.getTime();
            let s2 = date2.getTime();
            let total = (s2 - s1)/1000/60;
            return total;
        },
        elhandlechange(row) {
            console.log(row);
            let totals = 0;
            this.worktimes.forEach((item) => {
                if (item.amFromTime === null) {
                    item.amFromTime = '00:00';
                } else if (item.amToTime === null){
                    item.amToTime = '00:00';
                } else if (item.pmFromTime === null){
                    item.pmFromTime = '00:00';
                } else if (item.pmToTime === null){
                    item.pmToTime = '00:00';
                }
                if (item.amFromTime === '00:00' && item.amToTime !== '00:00' || item.amFromTime === null) {
                    item.amFromTime = '00:00';
                    this.$message({
                        type: 'warning',
                        message: '请填写完整午前作業時間或清除'
                    });
                } else if (item.amFromTime !== '00:00' && item.amToTime === '00:00' || item.amToTime === null) {
                    item.amToTime = '00:00';
                    this.$message({
                        type: 'warning',
                        message: '请填写完整午前作業時間或清除'
                    });
                } else if (item.pmFromTime === '00:00' && item.pmToTime !== '00:00' || item.pmFromTime === null) {
                    item.pmFromTime = '00:00';
                    this.$message({
                        type: 'warning',
                        message: '请填写完整午后作業時間或清除'
                    });
                } else if (item.pmFromTime !== '00:00' && item.pmToTime === '00:00' || item.pmToTime === null) {
                    item.pmToTime = '00:00';
                    this.$message({
                        type: 'warning',
                        message: '请填写完整午后作業時間或清除'
                    });
                }
                totals += (Number(this.timeDate(item.amFromTime, item.amToTime)) + Number(this.timeDate(item.pmFromTime, item.pmToTime)));
            });
            let hours = parseInt(totals/60);
            let minhours = (totals/60 - parseInt(totals/60)) * 60;
            if (!isNaN(hours)) {
                this.total = `${hours}時間${minhours}分`;
            }
        },
        upload({ file, opt }) {
            if (file) {
                this.files[opt.scope.$index] = file;
            } else {
                delete this.files[opt.scope.$index];
            }
        },
        rowClassName({ row }) {
            if (row.dateType !== 1) {
                return 'warning';
            }
        },
        formatDateType(row) {
            switch (Number(row.dateType)) {
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
                // return moment(new Date(row[field])).format('HH:mm');
                return row[field].substring(11, 16);
            }
            return '';
        },
        formatFareID(row) {
            if (row.fareID === 1) {
                return '交通费';
            } else {
                return row.title || '';
            }
        },
        copyOneToAll(scope) {
            // const timePickers = {};
            const worktimes = this.worktimes.map((item, index) => {
                if (item.dateType !== 1 && this.workDayIndex !== index) {
                    return item;
                } else {
                    return {
                        date: item.date,
                        weekDay: item.weekDay,
                        dateType: item.dateType,
                        amFromTime: scope.row.amFromTime,
                        amToTime: scope.row.amToTime,
                        pmFromTime: scope.row.pmFromTime,
                        pmToTime: scope.row.pmToTime,
                        content: scope.row.content
                    };
                }
            });
            this.worktimes = [...worktimes];
        },
        changeFareID(scope) {
            if (scope.row.fareID === 1) {
                this.fares[scope.$index].title = '交通费';
            }
        },
        addFare() {
            this.fares.push({
                fareID: 1,
                title: '交通费',
                amount: ''
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
            formData.append('id', this.essId);
            this.worktimes.forEach((item, index) => {
                Object.keys(item).forEach(key => {
                    if ('amFromTime,amToTime,pmFromTime,pmToTime'.includes(key)) {
                        formData.append(`worktimes[${index}].${key}`, `${item.date} ${item[key] || '00:00'}`);
                    } else if ('Date,weekDay,dateType,content'.includes(key)) {
                        formData.append(`worktimes[${index}].${key}`, `${item[key] || ''}`);
                    }
                });
            });
            let noFile = false;
            let commentEmpty = false;
            this.fares.forEach((item, index) => {
                if (item.amount) {
                    if (this.files[index]) {
                        formData.append(`file${index}`, this.files[index]);
                    }
                    if (item.id) {
                        formData.append(`employeefares[${index}].id`, item.id);
                    }
                    if (item.fileID) {
                        formData.append(`employeefares[${index}].fileID`, item.fileID);
                    }
                    if (Number(item.amount) > 3000 && !item.fileID && !this.files[index]) {
                        noFile = true;
                    }
                    if (item.fareID >= 99 && !item.comment) {
                        commentEmpty = true;
                    }
                    formData.append(`employeefares[${index}].fareID`, item.fareID);
                    formData.append(`employeefares[${index}].title`, item.title || '');
                    formData.append(`employeefares[${index}].comment`, item.comment || '');
                    formData.append(`employeefares[${index}].amount`, item.amount || '');
                }
            });
            if (noFile) {
                this.$message({
                    type: 'warning',
                    message: '費用金額が3000円を超える場合、領収書写真をアップロードしてください！'
                });
                return;
            }
            if (commentEmpty) {
                this.$message({
                    type: 'warning',
                    message: '費用項目のコメントを入力してください！'
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
            const loading = this.$loading({ lock: true, text: '作業報告書保存中...' });
            this.$axios({
                method: 'POST',
                url: '/api/Timesheet/api_submittimesheet',
                params: formData,
                headers: {
                    'content-Type': 'multipart/form-data'
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
            imageFileToPreview({
                vm: this,
                url: '/api/Timesheet/api_getfareimage',
                params: {
                    id: scope.row.id
                }
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
            .el-date-editor + .el-date-editor {
                margin-left: 10px;
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
