<template>
    <main-wrapper class="contract-list">
        <div slot="header" class="main-header">
            <el-date-picker
                v-model="form.periodfrom"
                type="month"
                size="mini"
                placeholder="开始时间"
                value-format="yyyyMM"
                value="yyyyMM"
                clearable
                @change="changeStartTime">
            </el-date-picker>
            <el-date-picker
                v-model="form.periodto"
                type="month"
                size="mini"
                placeholder="结束时间"
                value-format="yyyyMM"
                value="yyyyMM"
                clearable
                @change="changeEndTime">
            </el-date-picker>
            <el-select v-model="form.customerid" placeholder="取引先" @change="changeHandler" size="mini" clearable>
                <el-option v-for="item in customers" :key="item.id" :value="item.id" :label="item.title"></el-option>
            </el-select>
            <el-select
                v-model="form.empeeid"
                filterable
                remote
                reserve-keyword
                :remote-method="remoteMethod"
                :loading="loading"
                placeholder="作業担当者"
                @change="changeHandler"
                size="mini"
                clearable>
                <el-option v-for="item in employees" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
            <el-select v-model="form.salespersonid" placeholder="営業担当" @change="changeHandler" size="mini" clearable>
                <el-option v-for="item in sales" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
            <el-select v-model="form.paperreceived" placeholder="注文書原本" @change="changeHandler" size="mini" clearable>
                <el-option v-for="item in selectArrar" :key="item.id" :value="item.id" :label="item.name"></el-option>
            </el-select>
        </div>
        <el-table size="small" :data="tableData" border>
            <el-table-column label="注文番号" width="130px">
                <template slot-scope="scope">
                    <div>{{scope.row.contractNo || '-'}}</div>
                </template>
            </el-table-column>
            <el-table-column label="名称" prop="contractTitle" width="150px" show-overflow-tooltip></el-table-column>
            <el-table-column label="取引先" prop="customerTitle" width="160px" show-overflow-tooltip></el-table-column>
            <el-table-column label="開始日" prop="fromDate" width="95px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{formatTime(scope.row.fromDate)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="終了日" prop="toDate" width="95px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{formatTime(scope.row.toDate)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="契約単価・万円" prop="contractPrice"></el-table-column>
            <el-table-column label="支払条件" prop="paymentTerm" width="120px"></el-table-column>
            <el-table-column label="作業時間範囲" prop="hoursRange" show-overflow-tooltip></el-table-column>
            <el-table-column label="超過精算・円/時間">
                <template slot-scope="scope">
                    <span>{{priceToString(scope.row.overTimePrice)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="控除精算・円/時間">
                <template slot-scope="scope">
                    <span>{{priceToString(scope.row.underTimePrice)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="作業担当" prop="employeeName" show-overflow-tooltip></el-table-column>
            <el-table-column label="営業担当" prop="salesName" show-overflow-tooltip></el-table-column>
            <el-table-column label="注文書原本" width="140px">
                <template slot-scope="scope">
                    <el-tooltip v-if="scope.row.paperReceived" effect="dark" content="预览" placement="top-start">
                        <i style="font-size:18px;position:relative;top:1px;" class="iconfont icon-icon-test1 link" color="warning" @click="previewHandle(scope)"></i>
                    </el-tooltip>
                    <el-tooltip v-if="scope.row.paperReceived" effect="dark" content="下载" placement="top-start">
                        <i style="font-size:18px;position:relative;top:1px;" class="iconfont icon-icon-test link" color="primary" @click="downloadPDF(scope.row)"></i>
                    </el-tooltip>
                    <el-tooltip v-if="scope.row.paperReceived" effect="dark" content="再ｱｯﾌﾟﾛｰﾄﾞ" placement="top-start">
                        <upload
                            class="info-btn"
                            :opt="{ btnText: '', accept: 'application/pdf', scope: scope, show: false, showIcon: true }"
                            @upload="uploadFile"></upload>
                    </el-tooltip>
                    <el-tooltip v-if="!scope.row.paperReceived" effect="dark" content="再ｱｯﾌﾟﾛｰﾄﾞ" placement="top-start">
                        <upload
                            class="info-btn"
                            style="position:relative;left:-23px;"
                            :opt="{ btnText: '', accept: 'application/pdf', scope: scope, show: false, showIcon: true }"
                            @upload="uploadFile"></upload>
                    </el-tooltip>
                    <!-- <upload
                        class="danger-btn"
                        v-if="!scope.row.paperReceived"
                        :opt="{ btnText: 'PDFｱｯﾌﾟﾛｰﾄﾞ', accept: 'application/pdf', scope: scope, show: false, showIcon: true }"
                        @upload="uploadFile"></upload> -->
                </template>
            </el-table-column>
            <el-table-column label="操作" width="130px" fixed="right">
                <template slot-scope="scope">
                    <el-tooltip effect="dark" content="显示" placement="top-start">
                        <i class="el-icon-view oper-icon" color="success" @click="toEdit(scope.row, 'display')"></i>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="编辑" placement="top-start">
                        <i class="el-icon-edit-outline oper-icon" color="warning" @click="toEdit(scope.row)"></i>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="更新" placement="top-start">
                        <i class="el-icon-refresh-right oper-icon" color="primary" @click="showDialog(scope.row)"></i>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="删除" placement="top-start">
                        <i class="el-icon-delete oper-icon" color="danger" @click="deletes(scope.row)"></i>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            v-if='isGame'
            :current-page="form.page"
            :page-size="form.pageSize"
            @current-change="changePn"
            :layout="IS_H5 ? 'prev, pager, next' : 'total, prev, pager, next, jumper'"
            :total="total"></el-pagination>
        <el-dialog custom-class="update-dialog" :visible.sync="visible" @close="close">
            <div>新注文期間</div>
            <el-date-picker
                size="mini"
                v-model="datetime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                value="yyyy-MM-dd"></el-date-picker>
            <div>
                <el-button type="primary" size="mini" @click="confirmDialog">确认</el-button>
            </div>
        </el-dialog>
        <el-dialog :visible.sync="dialogPresonMonth">
            <el-table :data="personMonthArr" border size="small" v-loading="dialogLoading">
                <el-table-column label="期间" width="220">
                    <template slot-scope="scope">
                        {{formatTime(scope.row.fromdate)}}
                        ~
                        {{formatTime(scope.row.todate)}}
                    </template>
                </el-table-column>
                <el-table-column property="contractworkdays" label="合同工作日数" width="110"></el-table-column>
                <el-table-column property="calendarworkdays" label="日历工作日数" width="110"></el-table-column>
                <el-table-column label="人月">
                    <template slot-scope="scope">
                        <el-input size="mini" @blur="formatNingetsu(scope)" v-model="scope.row.ningetsu"></el-input>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer">
                <el-button size="small" type="primary" @click="confirmDialog" :disabled="dialogLoading">确定</el-button>
            </div>
        </el-dialog>
        <big-picture></big-picture>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import Upload from '@components/upload';
import BigPicture from '@components/big-picture';
import { mapGetters } from 'vuex';
import { formatTime, apiDownloadFile, imageFileToPreview, priceToString} from '@_public/utils';
export default {
    components: {
        MainWrapper,
        Upload,
        BigPicture
    },
    data() {
        return {
            form: {
                periodfrom: '',
                periodto: '',
                customerid: '',
                empeeid: '',
                salespersonid: '',
                paperreceived: '',
                page: 1,
                pagesize: 15
            },
            visible: false,
            total: 0,
            customers: [],
            employees: [],
            sales: [],
            tableData: [],
            value: '',
            datetime: null,
            dialogPresonMonth: false,
            dialogLoading: false,
            personMonthArr: [],
            curRow: {},
            loading: false,
            selectArrar: [{
                id: 0,
                name: '全部'
            },{
                id: 1,
                name: '原本受領'
            },{
                id: 2,
                name: '原本未受領'
            }],
            isGame: false
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (to.params.formid) {
                vm.form = to.params.formid;
                vm.form.page = to.params.formid.page;
            }
            vm.getData();
            vm.getCustomerList();
            vm.getEmployees();
            vm.getSalespersonforselect();
            vm.isGame = true;
        });
    },
    computed: {
        ...mapGetters(['IS_H5'])
    },
    methods: {
        priceToString: priceToString,
        formatTime: formatTime,
        changeHandler() {
            this.form.page = 1;
            this.getData();
        },
        getCustomerList() {
            this.$axios({
                url: '/api/Customer/api_customersforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.customers = res.data || [];
                }
            });
        },
        getEmployees(keyword = '') {
            this.loading = true;
            this.$axios({
                url: '/api/Employee/api_employeesforselect',
                params: {
                    keyword
                },
                custom: {
                    vm: this
                }
            }).then(res => {
                this.loading = false;
                if (res && res.code === 0) {
                    this.employees = res.data || [];
                }
            });
        },
        remoteMethod(keyword) {
            this.getEmployees(keyword);
        },
        getSalespersonforselect() {
            this.$axios({
                url: '/api/Employee/api_salespersonforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.sales = res.data || [];
                }
            });
        },
        changeStartTime(val) {
            if (!val) {
                if (this.form.periodto) {
                    this.$message({
                        type: 'warning',
                        message: '请先取消结束时间'
                    });
                } else {
                    this.page = 1;
                    this.getData();
                }
            } else {
                this.page = 1;
                this.getData();
            }
        },
        changeEndTime(val) {
            if (this.form.periodfrom) {
                const startTime = new Date(this.form.periodfrom).getTime();
                if (val) {
                    const endTime = new Date(val).getTime();
                    if (startTime > endTime) {
                        this.$message({
                            type: 'warning',
                            message: '开始时间不得小于结束时间'
                        });
                        this.form.periodto = '';
                    } else {
                        this.page = 1;
                        this.getData();
                    }
                } else {
                    this.page = 1;
                    this.getData();
                }
            } else {
                if (this.form.periodfrom) {
                    this.$message({
                        type: 'warning',
                        message: '请先选择开始时间'
                    });
                }
            }
        },
        getData() {
            const loading = this.$loading({ lock: true, text: '正在获取合同列表' });
            this.$axios({
                url: '/api/SOContract/api_getcontractlist',
                params: this.form,
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    const data = res.data || {};
                    this.tableData = data.data || [];
                    this.total = data.total;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.message
                    });
                }
            });
        },
        changePn(page) {
            this.form.page = page;
            this.getData();
        },
        downloadPDF(row) {
            apiDownloadFile({
                vm: this,
                url: `/api/SOContract/api_downloadcontractpdf?conid=${row.contractID}`,
                filename: `${Date.now()}.pdf`
            });
        },
        uploadFile({ file, opt }) {
            const loading = this.$loading({ lock: true, text: '正在上传文件' });
            const params = new FormData();
            params.append('file', file);
            params.append('conid', opt.scope.row.contractID);
            this.$axios({
                method: 'POST',
                url: '/api/SOContract/api_uploadcontractpdf',
                params,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.$message({
                        type: 'success',
                        message: res.message
                    });
                    this.getData();
                } else {
                    this.$message({
                        type: 'error',
                        message: res.message
                    });
                }
            });
        },
        close() {
            this.visible = false;
        },
        toEdit(row, type) {
            const params = {
                name: 'ContractEdit',
                params: {
                    id: row.contractID,
                    formsId: this.form
                }
            };
            if (type === 'display') {
                params.query = {
                    display: 1
                };
            }
            if (type === 'updates') {
                params.params.updates = true;
            }
            this.$router.push(params);
        },
        // 删除合同
        deletes(row) {
            this.$confirm('是否删除', '删除', {
                type: 'warning'
            }).then(() => {
                this.$axios({
                    url: '/api/SOContract/api_deletecontract',
                    params: {
                        contractid: row.contractID
                    }
                }).then(res => {
                    if (res && res.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                        this.getData();
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.message
                        });
                    }
                });
            }).catch(() => {});
        },
        formatNingetsu(scope) {
            const personMonthArr = [...this.personMonthArr];
            let value = Number(scope.row.ningetsu);
            if (value <= 1 && value > 0) {
                value = value.toFixed(2);
                personMonthArr[scope.$index].ningetsu = value;
            } else {
                personMonthArr[scope.$index].ningetsu = 0.01;
            }
            this.personMonthArr = personMonthArr;
        },
        getPersonMonth() {
            this.personMonthArr = [];
            this.dialogPresonMonth = true;
            this.dialogLoading = true;
            // const [ fromDate = '', toDate = '' ] = this.datetime;
            // this.$axios({
            //     url: '/api/Contract/api_calculateningetsu',
            //     params: {
            //         fromDate: fromDate,
            //         todate: toDate
            //     }
            // }).then(res => {
            //     if (res && res.code === 0) {
            //         this.dialogLoading = false;
            //         const result = [...res.data];
            //         result.forEach(item => {
            //             item.ningetsu = item.ningetsu / 100;
            //         });
            //         this.personMonthArr = result;
            //     }
            // });
        },
        confirmDialog() {
            // const ningetsu = [];
            // this.personMonthArr.forEach(item => {
            //     ningetsu.push(parseInt(item.ningetsu * 100));
            // });
            // const params = new FormData();
            // params.append('fromdate', this.datetime[0]);
            // params.append('todate', this.datetime[1]);
            // params.append('contractid', this.curRow.id);
            // if (ningetsu) {
            //     ningetsu.forEach((item, index) => {
            //         params.append(`ningetsu[${index}]`, item);
            //     });
            // } else {
            //     params.append('ningetsu', '');
            // }
            // const loading = this.$loading({ lock: true, text: '正在提交数据中' });
            // let url = '/api/SOContract/api_renewcontract';
            // this.$axios({
            //     method: 'GET',
            //     url,
            //     params: {
            //         contractid: this.curRow.contractID,
            //         fromdate: this.datetime[0],
            //         todate: this.datetime[1]
            //     },
            //     custom: {
            //         loading,
            //         vm: this
            //     }
            // }).then(res => {
            //     loading.close();
            //     if (res && res.code === 0) {
            //         this.$message.success('保存成功');
            //         this.close();
            //         this.getData();
            //     } else {
            //         this.$message.warning(res.message ? res.message : '接口开小差了，没有返回信息');
            //     }
            // });
            const params = {
                name: 'ContractEdit',
                params: {
                    id: this.curRow.contractID,
                    updates : true,
                    fromdate: this.datetime[0],
                    todate: this.datetime[1]
                }
            };
            this.$router.push(params);
            this.dialogLoading = false;
            this.dialogPresonMonth = false;
        },
        showDialog(row) {
            this.curRow = row;
            this.visible = true;
        },
        previewHandle(scope) {
            imageFileToPreview({
                vm: this,
                url: '/api/SOContract/api_previewcontract',
                params: {
                    conid: scope.row.contractID
                }
            });
        }
    }
};
</script>

<style lang="less">
.contract-list {
    .main-header {
        .el-date-editor, .el-select {
            & + .el-date-editor {
                margin-left: 2%;
            }
            width: 15%;
            max-width: 140px;
        }
        .el-select {
            margin-left: 2%;
        }
    }
    .danger-btn {
        margin-top: -3px;
        display: inline-block;
        vertical-align: top;
        margin-left: 10px;
        .upload {
            background-color: #DB414E;
            &:hover {
                background-color: rgba(219, 65, 78, 0.8);
            }
        }
    }
    .info-btn {
        margin-top: -1px;
        display: inline-block;
        vertical-align: top;
        margin-left: 10px;
        .upload {
            background-color: #909399;
            &:hover {
                background-color: rgba(144, 147, 153, 0.8);
            }
        }
    }
    .el-pagination {
        margin-top: 20px;
        text-align: center;
    }
    .iconfont {
        font-size: 16px;
        & + .iconfont {
            margin-left: 20px;
        }
    }
}
</style>
