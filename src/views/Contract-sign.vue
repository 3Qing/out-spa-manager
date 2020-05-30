<template>
    <main-wrapper class="contract-sign">
        <div slot="header" class="main-header">
            <el-button v-if="!isDisplay" type="primary" @click="submitForm('form')" size="small">{{$route.params.id ? '修改' : '提交'}}</el-button>
            <el-button v-if="!isDisplay" @click="resetForm('form')" size="small" type="danger">重置</el-button>
            <el-button v-if="$route.params.id" size="small" @click="$router.back()">返回</el-button>
        </div>
        <div class="content">
            <el-row v-if="!isDisplay">
                <el-col :span="12">
                    <el-form ref="form" :model="form" label-width="110px" :rules="isDisplay ? {} : rules" label-suffix=":">
                        <el-form-item label="注文名称" prop="title">
                            <!-- <p v-if="isDisplay">{{form.title || '-'}}</p> -->
                            <el-input v-model="form.title" size="small"></el-input>
                        </el-form-item>
                        <el-form-item label="注文内容" prop="content">
                            <!-- <p v-if="isDisplay">{{form.content || '-'}}</p> -->
                            <el-input v-model="form.content" type="textarea" :rows="3" size="small"></el-input>
                        </el-form-item>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="契約期間" prop="fromDate">
                                    <!-- <p v-if="isDisplay">{{form.fromDate}}</p> -->
                                    <el-date-picker placeholder="开始时间" v-model="form.fromDate" type="date" size="small" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="" prop="toDate">
                                    <!-- <p v-if="isDisplay">{{form.toDate}}</p> -->
                                    <el-date-picker placeholder="结束时间" v-model="form.toDate" type="date" size="small" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="作業時間範囲">
                                    <!-- <p v-if="isDisplay">{{form.hoursFrom}}~{{form.hoursTo}}</p> -->
                                    <el-input placeholder="开始时间" v-model="form.hoursFrom" size="small" @change="hoursChange" @blur="hoursChange" :class="{'errborder': erroeMsg}"></el-input>
                                    <div class="err">{{erroeMsg}}</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="!isDisplay">
                                <el-form-item label="">
                                    <el-input placeholder="结束时间" v-model="form.hoursTo" size="small" @change="hoursChange" @blur="hoursChange" :class="{'errborder': erroeMsg}"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="得意先" prop="customerId">
                                    <p v-if='$route.params.id'>{{getContent(form['customerId'], customerList, 'id', 'title')}}</p>
                                    <el-select v-else v-model="form['customerId']" size="small" @change="changeCustomer">
                                        <el-option v-for="item in customerList" :key="item.id" :value="item.id" :label="item.title"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="支払サイト" prop="paymenttermId">
                                    <!-- <p v-if="isDisplay">{{form['paymenttermId']}}</p> -->
                                    <el-select v-model="form['paymenttermId']" size="small">
                                        <el-option v-for="item in paymenttermsforselect" :key="item.id" :value="item.id" :label="item.title"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="単価" prop="unitPrice">
                                    <!-- <p v-if="isDisplay">{{form.unitPrice}}</p> -->
                                    <el-input v-model="form.unitPrice" size="small" @input="handlePrice" @blur="calculateOverTimePrice"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="精算単位" prop="calculateUnit">
                                    <!-- <p v-if="isDisplay">{{getContent(form.calculateUnit, unit, 'value', 'label')}}</p> -->
                                    <el-select v-model="form.calculateUnit" size="small">
                                        <el-option v-for="item in unit" :key="item.value" :value="item.value" :label="item.label"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="超過精算単価" prop="overTimePrice">
                                    <!-- <p v-if="isDisplay">{{form.overTimePrice}}</p> -->
                                    <el-input v-model="form.overTimePrice" size="small"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="控除精算単価" prop="underTimePrice">
                                    <!-- <p v-if="isDisplay">{{form.underTimePrice}}</p> -->
                                    <el-input v-model="form.underTimePrice" size="small"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="作業担当" prop="employeeId">
                                    <p v-if='$route.params.id'>{{getContent(form['employeeId'], workList, 'id', 'name')}}</p>
                                    <el-select
                                        v-else
                                        v-model="form['employeeId']"
                                        filterable
                                        remote
                                        reserve-keyword
                                        :remote-method="remoteMethod"
                                        :loading="loading"
                                        size="small">
                                        <el-option v-for="item in workList" :key="item.id" :value="item.id" :label="item.name"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="営業担当" prop="salespersonId">
                                    <!-- <p v-if="isDisplay">{{form['salespersonId']}}</p> -->
                                    <el-select v-model="form['salespersonId']" size="small">
                                        <el-option v-for="item in salespersonforselect" :key="item.id" :value="item.id" :label="item.name"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="商流備考" prop="businessFlow">
                            <!-- <p v-if="isDisplay">{{form.businessFlow}}</p> -->
                            <el-input v-model="form.businessFlow" size="small" type="textarea"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="12" v-if="isDisplay">
                    <div class="top"></div>
                </el-col>
            </el-row>
            <div class="bottom" v-if="isDisplay">
                <ul>
                    <li>
                        <span>注文名称</span>
                        <span :title='form.title'>{{form.title}}</span>
                    </li>
                    <li>
                        <span>注文内容</span>
                        <span :title='form.content'>{{form.content}}</span>
                    </li>
                    <li>
                        <span>契約期間</span>
                        <span>{{formatTime(form.fromDate)}}~{{formatTime(form.toDate)}}</span>
                    </li>
                    <li>
                        <span>作業時間範囲</span>
                        <span>{{form.hoursFrom}}~{{form.hoursTo}}</span>
                    </li>
                    <li>
                        <span>得意先</span>
                        <span :title="getContent(form.customerId, customerList, 'id', 'title')">{{getContent(form.customerId, customerList, 'id', 'title')}}</span>
                    </li>
                    <li>
                        <span>支払サイト</span>
                        <span>{{form.paymenttermId}}</span>
                    </li>
                    <li>
                        <span>単価</span>
                        <span>{{form.unitPrice}}</span>
                    </li>
                    <li>
                        <span>精算単位</span>
                        <span>{{getContent(form.calculateUnit, unit, 'value', 'label')}}</span>
                    </li>
                    <li>
                        <span>超過精算単価</span>
                        <span>{{form.overTimePrice}}</span>
                    </li>
                    <li>
                        <span>控除精算単価</span>
                        <span>{{form.underTimePrice}}</span>
                    </li>
                    <li>
                        <span>作業担当</span>
                        <span>{{getContent(form.employeeId, workList, 'id', 'name')}}</span>
                    </li>
                    <li class="lis">
                        <span>営業担当</span>
                        <span>{{form.salespersonId}}</span>
                    </li>
                    <li>
                        <span>商流備考</span>
                        <span>{{form.businessFlow}}</span>
                    </li>
                </ul>
                <!-- <el-table size="small" :data="forms" border>
                    <el-table-column label="注文名称" prop="title" width="100px"></el-table-column>
                    <el-table-column label="注文内容" prop="content" width="100px"></el-table-column>
                    <el-table-column label="契約期間">
                         <template slot-scope="scope">
                            <span>{{formatTime(scope.row.fromDate)}}</span>~
                            <span>{{formatTime(scope.row.toDate)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="作業時間範囲">
                        <template slot-scope="scope">
                            <span>{{scope.row.hoursFrom}}</span>~
                            <span>{{scope.row.hoursTo}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="得意先">
                        <template slot-scope="scope">
                            <span>{{getContent(scope.row.customerId, customerList, 'id', 'title')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="支払サイト">
                        <template slot-scope="scope">
                            <span>{{scope.row.paymenttermId}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="単価" prop="unitPrice"></el-table-column>
                    <el-table-column label="精算単位">
                        <template slot-scope="scope">
                            <span>{{getContent(scope.row.calculateUnit, unit, 'value', 'label')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="超過精算単価" prop="overTimePrice"></el-table-column>
                    <el-table-column label="控除精算単価" prop="underTimePrice"></el-table-column>
                    <el-table-column label="作業担当">
                        <template slot-scope="scope">
                            <span>{{getContent(scope.row.employeeId, workList, 'id', 'name')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="営業担当" prop="salespersonId"></el-table-column>
                    <el-table-column label="商流備考" prop="businessFlow"></el-table-column>
                </el-table> -->
            </div>
            <div class="bottom" v-if="isDisplay">
                <el-table size="small" :data="cashflows" border>
                    <el-table-column label="fromDate" prop="fromDate" width="100px">
                        <template slot-scope="scope">
                            <span>{{formatTime(scope.row.fromDate)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="toDate" prop="toDate" width="100px">
                        <template slot-scope="scope">
                            <span>{{formatTime(scope.row.toDate)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="ningetsu" prop="ningetsu"></el-table-column>
                    <el-table-column label="actualHours" prop="actualHours"></el-table-column>
                    <el-table-column label="actualMinutes" prop="actualMinutes"></el-table-column>
                    <el-table-column label="planCollectSales" prop="planCollectSales">
                        <template slot-scope="scope">
                            <span>{{priceToString(scope.row.planCollectSales)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="planCollectAddSales" prop="planCollectAddSales">
                        <template slot-scope="scope">
                            <span>{{priceToString(scope.row.planCollectAddSales)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="planCollectTax" prop="planCollectTax">
                        <template slot-scope="scope">
                            <span>{{priceToString(scope.row.planCollectTax)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="invoiceNo" prop="invoiceNo"></el-table-column>
                </el-table>
            </div>
        </div>
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
            <el-form class="preview-form" size="mini" label-width="110px" label-suffix=":" v-if="$route.params.id">
                <el-form-item label="注文名称">
                    <span>{{form.title}}</span>
                </el-form-item>
                <el-form-item label="内容">
                    <span>{{form.content}}</span>
                </el-form-item>
                <el-form-item label="作業担当">
                    <span>{{getContent(form['employeeId'], workList, 'id', 'name')}}</span>
                </el-form-item>
                <el-form-item label="開始期間">
                    <span>{{form.fromDate}}</span>
                </el-form-item>
                <el-form-item label="終了期間">
                    <span>{{form.toDate}}</span>
                </el-form-item>
                <el-form-item label="支払サイト">
                    <span>{{formatLabel(form['paymenttermId'], 'payment')}}</span>
                </el-form-item>
                <el-form-item label="単価">
                    <span>{{form.unitPrice}}</span>
                </el-form-item>
                <el-form-item label="作業時間">
                    <span>{{form.hoursFrom}}</span>
                    <span>-</span>
                    <span>{{form.hoursTo}}</span>
                </el-form-item>
                <el-form-item label="超過精算単価">
                    <span>{{form.overTimePrice}}</span>
                </el-form-item>
                <el-form-item label="控除精算単価">
                    <span>{{form.underTimePrice}}</span>
                </el-form-item>
                <el-form-item label="精算単位">
                    <span>{{getContent(form.calculateUnit, unit, 'value', 'label')}}</span>
                </el-form-item>
                <el-form-item label="営業担当">
                    <span>{{formatLabel(form['salespersonId'], 'sales')}}</span>
                </el-form-item>
                <el-form-item label="顧客">
                    <span>{{getContent(form['customerId'], customerList, 'id', 'title')}}</span>
                </el-form-item>
                <el-form-item label="商流備考">
                    <span>{{form.businessFlow}}</span>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="small" type="primary" @click="confirmDialog" :disabled="dialogLoading">确定</el-button>
            </div>
        </el-dialog>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import { formatTime, priceToString, priceToNumber } from '@_public/utils';

export default {
    components: {
        MainWrapper
    },
    data() {
        return {
            loading: false,
            form: {
                title: '',
                content: '',
                'employeeId': '',
                fromDate: this.nextMonthFirstDay(),
                toDate: this.nextMonthLastDay(),
                'paymenttermId': '',
                unitPrice: '',
                hoursFrom: 140,
                hoursTo: 180,
                overTimePrice: '',
                underTimePrice: '',
                calculateUnit: '',
                'salespersonId': '',
                'customerId': '',
                businessFlow: '',
                ningetsu: ''
            },
            unit: [
                {
                    value: 1,
                    label: '60分'
                },
                {
                    value: 2,
                    label: '30分'
                },
                {
                    value: 3,
                    label: '15分'
                }
            ],
            rules: {
                title: [
                    { required: true, message: '请输入注文名称', trigger: 'blur' }
                ],
                content: [
                    { required: true, message: '请输入内容', trigger: 'blur' }
                ],
                fromDate: [
                    { required: true, validator: this.validFromDate, trigger: 'blur' }
                ],
                toDate: [
                    { required: true, validator: this.validToDate, trigger: 'blur' }
                ],
                unitPrice: [
                    { required: true, message: '请输入単価', trigger: 'blur' }
                ],
                overTimePrice: [
                    { required: true, message: '请输入超過精算単価', trigger: 'blur' }
                ],
                underTimePrice: [
                    { required: true, message: '请输入控除精算単価', trigger: 'blur' }
                ],
                calculateUnit: [
                    { required: true, message: '请选择精算単位', trigger: 'blur' }
                ],
                employeeId: [
                    { required: true, message: '请选择作業担当', trigger: 'blur' }
                ],
                salespersonId: [
                    { required: true, message: '请选择営業担当', trigger: 'blur' }
                ],
                customerId: [
                    { required: true, message: '请选择得意先', trigger: 'blur' }
                ],
                paymenttermId: [
                    { required: true, message: '请选择支払サイト', trigger: 'blur' }
                ],
            },
            workList: [],
            customerList: [],
            paymenttermsforselect: [],
            salespersonforselect: [],
            erroeMsg: '',
            dialogPresonMonth: false,
            personMonthArr: [],
            dialogLoading: false,
            isDisplay: false,
            cashflows: [],
            nextMonth1: '',
            nextMonth2: ''
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (to.query.display) {
                vm.isDisplay = true;
            }
            if (to.params.id) {
                vm.getData(vm.isDisplay);
            }
            // /api/Contract/api_getcontractfordisplay
            vm.getWorkList(); // 员工列表
            vm.getCustomerList(); // 客户列表
            vm.getPaymenttermsforselect(); // 支付条件清单
            vm.getSalespersonforselect(); // 销售人员
        });
    },
    methods: {
        formatTime: formatTime,
        priceToString: priceToString,
        validFromDate(rule, value, callback) {
            const toDate = new Date(this.form.toDate).getTime() || -1;
            if (value) {
                if (toDate > 0) {
                    if (new Date(value).getTime() > toDate) {
                        callback(new Error('开始时间不得大于结束时间'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            } else {
                callback(new Error('请选择开始时间'));
            }
        },
        validToDate(rule, value, callback) {
            const fromDate = new Date(this.form.fromDate).getTime() || -1;
            if (value) {
                if (fromDate > 0) {
                    if (new Date(value).getTime() < fromDate) {
                        callback(new Error('结束时间不得小于开始时间'));
                    } else {
                        callback();
                    }
                } else {
                    callback();
                }
            } else {
                callback(new Error('请选择结束时间'));
            }
        },
        // 下个月的第一天
        nextMonthFirstDay() {
            var time = new Date();
            var year = time.getFullYear();
            var month = time.getMonth() + 2;
            if (month > 12) {
                month = month - 12;
                year = year + 1;
            }
            var day = 1;
            return year + '-' + month + '-' + day;
        },
        // 下个月的最后一天
        nextMonthLastDay() {
            var time = new Date();
            var year = time.getFullYear();
            var month = time.getMonth() + 2;
            if (month > 12) {
                month = month - 12;
                year = year + 1;
            }
            var day = this.nextMonthDay(year, month);
            return year + '-' + month + '-' + day;
        },
        nextMonthDay(year, month) {//判断每月多少天
            var day31 = [1, 3, 5, 7, 8, 10, 12];
            var day30 = [4, 6, 9, 11];
            if (day31.indexOf(month) > -1) {
                return 31;
            } else if (day30.indexOf(month) > -1) {
                return 30;
            } else {
                if (this.isLeapYear(year)) {
                    return 29;
                } else {
                    return 28;
                }
            }
        },
        isLeapYear(year) {//判断是否为闰年
            return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);
        },
        // 作业时间校验
        hoursChange(val, old) {
            const reg = /^\d+$|^\d+[.]?\d+$/;
            if (val !== old) {
                if (!this.form.hoursFrom || !this.form.hoursTo) {
                    this.erroeMsg = '请输入完整作業時間';
                } else if (!reg.test(this.form.hoursFrom) || !reg.test(this.form.hoursTo)) {
                    this.erroeMsg = '请输入数字';
                } else if (parseInt(this.form.hoursFrom) > parseInt(this.form.hoursTo)) {
                    this.erroeMsg = '结束作業時間需大于开始作業時間';
                } else {
                    this.erroeMsg = '';
                    this.calculateOverTimePrice();
                }
            }
        },
        getData(type) {
            const loading = this.$loading({ lock: true, text: '正在获取合同资料中...' });
            let url = '/api/Contract/api_getcontractforupdate';
            if (type) {
                url = '/api/Contract/api_getcontractfordisplay';
            }
            this.$axios({
                url,
                params: {
                    id: this.$route.params.id
                },
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    const data = res.data || {};
                    const form = {
                        title: data.title || '',
                        content: data.content || '',
                        'employeeId': (data.employee && data.employee.id) || '',
                        fromDate: formatTime(data.fromDate || ''),
                        toDate: formatTime(data.toDate || ''),
                        'paymenttermId': (data.paymentterm && data.paymentterm.id) || '',
                        unitPrice: priceToString(data.unitPrice || ''),
                        hoursFrom: data.hoursFrom || '',
                        hoursTo: data.hoursTo || '',
                        overTimePrice: data.overTimePrice || '',
                        underTimePrice: data.underTimePrice || '',
                        calculateUnit: data.calculateUnit || '',
                        'salespersonId': (data.salesperson && data.salesperson.id) || '',
                        'customerId': (data.customer && data.customer.id) || '',
                        businessFlow: data.businessFlow || ''
                    };
                    if (type) {
                        form['employeeId'] = data.employeeID;
                        form['paymenttermId'] = data.paymentTerm;
                        form['salespersonId'] = data.salesPerson;
                        form['customerId'] = data.customerID;
                    }
                    if (data.cashflows) {
                        if(data.cashflows.length > 0) {
                            let nuing = (data.cashflows[0].ningetsu / 100).toFixed(2);
                            data.cashflows[0].ningetsu = nuing;
                            this.cashflows = data.cashflows;
                        } else {
                            this.cashflows = [];
                        }
                    }
                    this.form = form;
                } else {
                    this.$message({
                        type: 'error',
                        showClose: true,
                        message: res.message ? res.message : '接口开小差了，没有返回'
                    });
                }
            });
        },
        getWorkList(keyword = '') {
            this.loading = true;
            this.$axios({
                url: '/api/Employee/api_employeesforselect',
                params: {
                    keyword
                }
            }).then(res => {
                this.loading = false;
                if (res) {
                    this.workList = res.data || [];
                }
            });
        },
        remoteMethod(keyword) {
            this.getWorkList(keyword);
        },
        getCustomerList() {
            this.$axios({
                url: '/api/Customer/api_customersforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.customerList = res.data || [];
                }
            });
        },
        getPaymenttermsforselect() {
            this.$axios({
                url: '/api/PaymentTerm/api_paymenttermsforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.paymenttermsforselect = res.data || [];
                }
            });
        },
        getSalespersonforselect() {
            this.$axios({
                url: '/api/Employee/api_salespersonforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.salespersonforselect = res.data || [];
                }
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid && !this.erroeMsg) {
                    if (this.$route.params.id) {
                        this.getPersonMonth();
                    } else {
                        if (this.completeMonth()) {
                            this.getPersonMonth();
                        } else {
                            this.submit();
                        }
                    }
                } else {
                    this.$message.warning('请正确输入表单数据');
                    return false;
                }
            });
        },
        completeMonth() {
            const [ ,, fromD = '' ] = this.form.fromDate.split('-');
            const [ toY = '', toM = '', toD = '' ] = this.form.toDate.split('-');
            if (Number(fromD) === 1 && (new Date(toY, toM, '0').getDate() === Number(toD))) {
                return false;
            } else {
                return true;
            }    
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        toFormData(val) {
            let formData = new FormData();
            for (let i in val) {
                isArray(val[i], i);
            }
            function isArray(array, key) {
                if (array == undefined || typeof array == "function") {
                    return false;
                }
                if (typeof array != "object") {
                    formData.append(key, array);
                } else if (array instanceof Array) {
                    if (array.length == 0) {
                        formData.append(`${key}`, "");
                    } else {
                        for (let i in array) {
                            for (let j in array[i]) {
                                isArray(array[i][j], `${key}[${i}].${j}`);
                            }
                        }
                    }
                } else {
                    let arr = Object.keys(array);
                    if (arr.indexOf("uid") == -1) {
                        for (let j in array) {
                            isArray(array[j], `${key}.${j}`);
                        }
                    } else {
                        formData.append(`${key}`, array);
                    }
                }
            }
            return formData;
        },
        submit() {
            const params = {
                ID: 0,
                Title: this.form.title || '',
                Content: this.form.content || '',
                FromDate: this.form.fromDate,
                ToDate: this.form.toDate,
                PaymentTermID: this.form['paymenttermId'],
                UnitPrice: priceToNumber(this.form.unitPrice),
                HoursFrom: Number(this.form.hoursFrom),
                HoursTo: Number(this.form.hoursTo),
                CalculateUnit: this.form.calculateUnit,
                OverTimePrice: priceToNumber(this.form.overTimePrice),
                UnderTimePrice: priceToNumber(this.form.underTimePrice),
                CustomerID: this.form['customerId'],
                EmployeeID: this.form['employeeId'],
                SalesPersonID: this.form['salespersonId'],
                BusinessFlow: this.form.businessFlow
                // Ningetsu: this.form.ningetsu
            };
            let url = '/api/contract/api_createcontract';
            if (this.$route.params.id) {
                params.ID = this.$route.params.id;
                url = '/api/contract/api_updatecontract';
            }
            const formData = new FormData();
            for (let key in params) {
                formData.append(key, params[key]);
            }
            if (this.form.ningetsu) {
                // this.form.ningetsu.forEach((item, i) => {
                //     formData.append(`Ningetsu[${i}]`, item);
                // });
                formData.append('Ningetsu', JSON.stringify(this.form.ningetsu || []));
            } else {
                formData.append('Ningetsu', '');
            }
            console.log('params', params, formData);
            const loading = this.$loading({ lock: true, text: '正在提交合同资料中...' });
            this.$axios({
                method: 'POST',
                url,
                params: formData,
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    if (!this.$route.params.id) {
                        this.$router.replace({ name: 'ContractEdit', params: { id: res.data }});
                    } else {
                        this.getData();
                    }
                    this.$message.success('保存成功');
                } else {
                    this.$message.warning(res.message ? res.message : '接口开小差了，没有返回信息');
                }
            });
        },
        getPersonMonth() {
            this.personMonthArr = [];
            this.dialogPresonMonth = true;
            this.dialogLoading = true;
            this.$axios({
                url: '/api/Contract/api_calculateningetsu',
                params: {
                    fromDate: this.form.fromDate,
                    toDate: this.form.toDate
                }
            }).then(res => {
                if (res) {
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
            this.form['ningetsu'] = ningetsu;
            this.submit();
            this.dialogLoading = false;
            this.dialogPresonMonth = false;
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
        formatLabel(val, type) {
            if (type === 'employee') {
                for (let item of this.workList) {
                    if (item.id === val) {
                        return item.Name;
                    }
                }
            } else if (type === 'payment') {
                for (let item of this.paymenttermsforselect) {
                    if (item.id === val) {
                        return item.title;
                    }
                }
            } else if (type === 'unit') {
                for (let item of this.unit) {
                    if (item.value === val) {
                        return item.label;
                    }
                }
            } else if (type === 'sales') {
                for (let item of this.salespersonforselect) {
                    if (item.id === val) {
                        return item.name;
                    }
                }
            } else if (type === 'custom') {
                for (let item of this.customerList) {
                    if (item.id === val) {
                        return item.title;
                    }
                }
            }
        },
        handlePrice() {
            this.form.unitPrice = priceToString(priceToNumber(this.form.unitPrice)); 
        },
        getContent(val, arr, key, field) {
            for (let item of arr) {
                if (item[key] === val) {
                    return item[field];
                }
            }
            return '-';
        },
        calculateOverTimePrice() {
            if (this.form.unitPrice) {
                if (this.form.hoursFrom) {
                    if (!this.erroeMsg) {
                        this.form.overTimePrice = priceToString(parseInt(priceToNumber(this.form.unitPrice) / Number(this.form.hoursFrom)));
                    }
                }
                if (this.form.hoursTo) {
                    if (!this.erroeMsg) {
                        this.form.underTimePrice = priceToString(parseInt(priceToNumber(this.form.unitPrice) / Number(this.form.hoursTo)));
                    }
                }
            }
        },
        changeCustomer() {
            for (let item of this.customerList) {
                if (item.id === this.form['customerId']) {
                    this.form['paymenttermId'] = item.paymentTermID;
                }
            }
        }
    }
};
</script>

<style lang="less">
.contract-sign {
    .el-form-item {
        margin-bottom: 15px;
    }
    .text-center{
        text-align: center;
    }
    .content {
        padding: 0 20px;
        .el-select, .el-input, .el-date-editor {
            width: 220px;
        }
        .is-required {
            .el-form-item__label {
                color: #606266;
            }
        }
    }
    .errborder{
        .el-input__inner{
            border-color: #DB414E;
        }
    }
    .err{
        color: #DB414E;
        font-size: 12px;
        line-height: 1;
        padding-top: 4px;
        position: absolute;
        top: 100%;
        left: 0;
    }
    .bottom {
        margin-top: 20px;
        ul{
            width: 900px;
            overflow: hidden;
            // height: 280px;
            border: 1px solid #EBEEF5;
            border-top: none;
            li{
                width: 50%;
                float: left;
                height: 50px;
                line-height: 50px;
                border-top: 1px solid #EBEEF5;
                span{
                    color: #606266;
                    float: left;
                    padding: 0 10px;
                    box-sizing: border-box;
                }
                span:first-child{
                    width: 145px;
                    background-color: #F5F7FA;
                }
                span:last-child{
                    width: 300px;
                    overflow:hidden;  /*超过部分不显示*/
                    text-overflow:ellipsis;  /*超过部分用点点表示*/
                    white-space:nowrap; /*不换行*/
                }
            }
            .lis{
                border-bottom: 1px solid #EBEEF5;
            }
        }
    }
}
.preview-form {
    .el-form-item {
        &.el-form-item--mini {
            margin-top: 5px;
            margin-bottom: 0;
        }
    }
}
</style>
