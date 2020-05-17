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
            <el-select v-model="form.vendorid" placeholder="取引先" @change="changeHandler" size="mini" clearable>
                <el-option v-for="item in vendors" :key="item.id" :value="item.id" :label="item.title"></el-option>
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
        </div>
        <el-table size="small" :data="tableData">
            <el-table-column label="注文番号" width="120px">
                <template slot-scope="scope">
                    <div>{{scope.row.contractNo || '-'}}</div>
                </template>
            </el-table-column>
            <el-table-column label="名称" prop="contractTitle" show-overflow-tooltip></el-table-column>
            <el-table-column label="取引先" prop="customerTitle" show-overflow-tooltip></el-table-column>
            <el-table-column label="開始日" prop="fromDate" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{formatTime(scope.row.fromDate)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="終了日" prop="toDate" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{formatTime(scope.row.toDate)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="契約単価・万円" prop="contractPrice"></el-table-column>
            <el-table-column label="支払条件" prop="paymentTerm" width="120px"></el-table-column>
            <el-table-column label="作業時間範囲" prop="hoursRange" show-overflow-tooltip></el-table-column>
            <el-table-column label="超過精算・円/時間" prop="overTimePrice"></el-table-column>
            <el-table-column label="控除精算・円/時間" prop="underTimePrice"></el-table-column>
            <el-table-column label="作業担当" prop="employeeName" show-overflow-tooltip></el-table-column>
            <el-table-column label="営業担当" prop="salesName" show-overflow-tooltip></el-table-column>
            <el-table-column label="注文書原本" width="180px">
                <template slot-scope="scope">
                    <el-button
                        v-if="scope.row.paperReceived"
                        size="mini"
                        type="primary"
                        @click="downloadPDF(scope.row)">照会</el-button>
                    <upload
                        class="info-btn"
                        v-if="scope.row.paperReceived"
                        :opt="{ btnText: '再ｱｯﾌﾟﾛｰﾄﾞ', accept: 'application/pdf', scope: scope, show: false }"
                        @upload="uploadFile"></upload>
                    <upload
                        class="danger-btn"
                        v-if="!scope.row.paperReceived"
                        :opt="{ btnText: 'PDFｱｯﾌﾟﾛｰﾄﾞ', accept: 'application/pdf', scope: scope, show: false }"
                        @upload="uploadFile"></upload>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="160px">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.editable" type="primary" size="mini" @click="toEdit(scope.row)">編集</el-button>
                    <el-button v-if="scope.row.extendable" size="mini" @click="showDialog(scope.row)">更新</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
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
                <el-button type="primary" size="mini" @click="getPersonMonth">确认</el-button>
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
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import Upload from '@components/upload';
import { mapGetters } from 'vuex';
import { formatTime, apiDownloadFile } from '@_public/utils';
export default {
    components: {
        MainWrapper,
        Upload
    },
    data() {
        return {
            form: {
                periodfrom: '',
                periodto: '',
                vendorid: '',
                empeeid: '',
                salespersonid: '',
                papersended: ''
            },
            page: 1,
            pageSize: 10,
            total: 0,
            employees: [],
            vendors: [],
            sales: [],
            loading: false,
            tableData: []
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getData();
            vm.getVendors();
            vm.getEmployees();
            vm.getSalespersonforselect();
        });
    },
    computed: {
        ...mapGetters(['IS_H5'])
    },
    methods: {
        formatTime: formatTime,
        changeHandler() {
            this.form.page = 1;
            this.getData();
        },
        getData() {
            const loading = this.$loading({ lock: true, text: '正在获取数据中' });
            const params = Object.assign({
                page: this.page,
                pagesize: this.pageSize
            }, this.form);
            this.$axios({
                url: '/api/PurchaseOrder/api_getpocontractlist',
                params
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    const data = res.data || {};
                    this.tableData = data.data;
                    this.total = data.total;
                }
            });
        },
        getVendors() {
            this.$axios({
                url: '/api/Customer/api_vendorsforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.vendors = res.data || [];
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
        remoteMethod(keyword) {
            this.getEmployees(keyword);
        },
        changePn(page) {
            this.form.page = page;
            this.getData();
        },
        downloadPDF(row) {
            apiDownloadFile({
                vm: this,
                url: `/api/PurchaseOrder/api_downloadpoexcel?id=${row.id}`,
                filename: `${Date.now()}.cls`
            });
        },
        uploadFile({ file, opt }) {
            const loading = this.$loading({ lock: true, text: '正在上传文件' });
            const params = new FormData();
            params.append('file', file);
            params.append('conid', opt.scope.row.id);
            this.$axios({
                method: 'POST',
                url: '/api/uploadcontractpdf',
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
        toEdit(row) {
            this.$router.push({
                name: 'PurchaseEdit',
                params: {
                    id: row.id
                }
            });
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
            const [ fromDate = '', toDate = '' ] = this.datetime;
            this.$axios({
                url: '/api/Contract/api_calculateningetsu',
                params: {
                    fromDate: fromDate,
                    todate: toDate
                }
            }).then(res => {
                if (res && res.code === 0) {
                    this.dialogLoading = false;
                    const result = [...res.data];
                    result.forEach(item => {
                        item.ningetsu = item.ningetsu / 100;
                    });
                    this.personMonthArr = result;
                }
            });
        },
        confirmDialog() {
            const ningetsu = [];
            this.personMonthArr.forEach(item => {
                ningetsu.push(parseInt(item.ningetsu * 100));
            });
            const params = new FormData();
            params.append('fromdate', this.datetime[0]);
            params.append('todate', this.datetime[1]);
            params.append('contractid', this.curRow.id);
            if (ningetsu) {
                ningetsu.forEach((item, index) => {
                    params.append(`ningetsu[${index}]`, item);
                });
            } else {
                params.append('ningetsu', '');
            }
            const loading = this.$loading({ lock: true, text: '正在提交数据中' });
            this.$axios({
                method: 'POST',
                url: '/api/Contract/api_renewcontract',
                params,
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.$message.success('保存成功');
                    this.close();
                    this.getData();
                } else {
                    this.$message.warning(res.message ? res.message : '接口开小差了，没有返回信息');
                }
            });
            this.dialogLoading = false;
            this.dialogPresonMonth = false;
        },
        showDialog(row) {
            this.curRow = row;
            this.visible = true;
        }
    }
};
</script>

<style scoped>

</style>
