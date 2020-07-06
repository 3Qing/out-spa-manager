<template>
    <main-wrapper class="contract-sign">
        <div slot="header" class="main-header">
            <el-button type="primary" @click="submitForm('form')" size="small">{{$route.params.id ? '修改' : '提交'}}</el-button>
            <el-button @click="resetForm('form')" size="small">重置</el-button>
            <el-button v-if="$route.params.id" size="small" @click="$router.back()">返回</el-button>
        </div>
        <div class="content">
            <el-row>
                <el-col :span="12">
                    <!-- <el-form ref="form" :model="form" label-width="110px" :rules="rules">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="作業担当" prop="empeeid">
                                    <el-select
                                        v-model="form['employee.id']"
                                        filterable
                                        remote
                                        reserve-keyword
                                        :remote-method="remoteMethod"
                                        :loading="loading"
                                        size="small">
                                        <el-option v-for="item in workList" :key="item.id" :value="item.id" :label="item.name"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item label="開始期間" prop="fromDate">
                                    <el-date-picker v-model="form.fromDate" type="date" size="small" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">    
                                <el-form-item label="終了期間" prop="toDate">
                                    <el-date-picker v-model="form.toDate" type="date" size="small" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
                                </el-form-item>
                                <el-form-item label="支払サイト" prop="paymentterm">
                                    <el-select v-model="form['paymentterm.id']" size="small">
                                        <el-option v-for="item in paymenttermsforselect" :key="item.id" :value="item.id" :label="item.title"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="単価" prop="unitPrice">
                            <el-input v-model="form.unitPrice" size="small" @input="handlePrice"></el-input>
                        </el-form-item>
                        <el-form-item label="作業時間">
                            <el-col :span="11">
                                <el-form-item prop="hoursFrom">
                                    <el-input v-model="form.hoursFrom" size="small" @change="hoursChange" @blur="hoursChange" :class="{'errborder': erroeMsg}"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col class="text-center" :span="2">-</el-col>
                            <el-col :span="11">
                                <el-form-item prop="hoursTo">
                                    <el-input v-model="form.hoursTo" size="small" @change="hoursChange" @blur="hoursChange" :class="{'errborder': erroeMsg}"></el-input>
                                </el-form-item>
                            </el-col>
                            <div class="err">{{erroeMsg}}</div>
                        </el-form-item>
                        <el-form-item label="超過精算単価" prop="overTimePrice">
                            <el-input v-model="form.overTimePrice" size="small"></el-input>
                        </el-form-item>
                        <el-form-item label="控除精算単価" prop="underTimePrice">
                            <el-input v-model="form.underTimePrice" size="small"></el-input>
                        </el-form-item>
                        <el-form-item label="精算単位" prop="calculateUnit">
                            <el-select v-model="form.calculateUnit" size="small">
                                <el-option v-for="item in unit" :key="item.value" :value="item.value" :label="item.label"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="営業担当" prop="salesperson">
                            <el-select v-model="form['salesperson.id']" size="small">
                                <el-option v-for="item in salespersonforselect" :key="item.id" :value="item.id" :label="item.name"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="供应商">
                            <el-select v-model="vendorid">
                                <el-option
                                    v-for="item in vendors"
                                    :label="item.title"
                                    :value="item.id"
                                    :key="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="商流備考" prop="businessFlow">
                            <el-input v-model="form.businessFlow" size="small" type="textarea"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('form')" size="small">{{$route.params.id ? '修改' : '提交'}}</el-button>
                            <el-button @click="resetForm('form')" size="small">重置</el-button>
                            <el-button v-if="$route.params.id" size="small" @click="$router.back()">返回</el-button>
                        </el-form-item>
                    </el-form> -->
                    <el-form ref="form" :model="form" label-width="110px" :rules="rules">
                        <el-form-item label="注文名称" prop="title">
                            <el-input v-model="form.title" size="small"></el-input>
                        </el-form-item>
                        <el-form-item label="注文内容" prop="content">
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
                                <el-form-item class="is-required" label="作業時間範囲">
                                    <!-- <p v-if="isDisplay">{{form.hoursFrom}}~{{form.hoursTo}}</p> -->
                                    <el-input placeholder="开始时间" v-model="form.hoursFrom" size="small" @change="hoursChange" @blur="hoursChange" :class="{'errborder': erroeMsg}"></el-input>
                                    <div class="err">{{erroeMsg}}</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="">
                                    <el-input placeholder="结束时间" v-model="form.hoursTo" size="small" @change="hoursChange" @blur="hoursChange" :class="{'errborder': erroeMsg}"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item class="is-required" label="供应商">
                                    <el-select v-model="form.vendorid" @change="changeCustomer">
                                        <el-option
                                            v-for="item in vendors"
                                            :label="item.title"
                                            :value="item.id"
                                            :key="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item class="is-required" label="支払サイト">
                                    <el-select v-model="form['paymentterm.id']" size="small">
                                        <el-option v-for="item in paymenttermsforselect" :key="item.id" :value="item.id" :label="item.title"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="単価" prop="unitPrice">
                                    <!-- <p v-if="isDisplay">{{form.unitPrice}}</p> -->
                                    <el-input v-model="form.unitPrice" size="small" @input="handlePrice"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="精算単位" prop="calculateUnit">
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
                                <el-form-item class="is-required" label="作業担当">
                                    <el-select
                                        v-model="form['employee.id']"
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
                                <el-form-item class="is-required" label="営業担当" prop="salesperson">
                                    <el-select v-model="form['salesperson.id']" size="small">
                                        <el-option v-for="item in salespersonforselect" :key="item.id" :value="item.id" :label="item.name"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="商流備考" prop="businessFlow">
                            <el-input v-model="form.businessFlow" size="small" type="textarea"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col> 
                <el-col :span="12"></el-col> 
            </el-row>
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
                    <span>{{formatLabel(form['employee.id'], 'employee')}}</span>
                </el-form-item>
                <el-form-item label="開始期間">
                    <span>{{form.fromDate}}</span>
                </el-form-item>
                <el-form-item label="終了期間">
                    <span>{{form.toDate}}</span>
                </el-form-item>
                <el-form-item label="支払サイト">
                    <span>{{formatLabel(form['paymentterm.id'], 'payment')}}</span>
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
                    <span>{{formatLabel(form.calculateUnit, 'unit')}}</span>
                </el-form-item>
                <el-form-item label="営業担当">
                    <span>{{formatLabel(form['salesperson.id'], 'sales')}}</span>
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
// const querystring = require('querystring');
import MainWrapper from '@components/main-wrapper';
import { priceToString, priceToNumber, formatTime } from '@_public/utils';

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
                'employee.id': '',
                fromDate: this.nextMonthFirstDay(),
                toDate: this.nextMonthLastDay(),
                'paymentterm.id': '',
                unitPrice: null,
                hoursFrom: 140,
                hoursTo: 180,
                overTimePrice: null,
                underTimePrice: null,
                calculateUnit: '',
                'salesperson.id': '',
                businessFlow: '',
                ningetsu: '',
                vendorid: ''
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
                calculateUnit: [
                    { required: true, message: '请输入精算单位', trigger: 'blur' }
                ],
                paymentterm: [
                    { required: true, message: '请选择支払サイト' }
                ],
                vendorid: [
                    { required: true, message: '请选择供应商'}
                ],
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
            },
            workList: [],
            vendors: [],
            paymenttermsforselect: [],
            salespersonforselect: [],
            erroeMsg: '',
            dialogPresonMonth: false,
            personMonthArr: [],
            dialogLoading: false

        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (to.params.id && to.params.id !== 'new') {
                vm.getData();
            }
            vm.getWorkList(); // 员工列表
            vm.getVendors(); // 客户列表
            vm.getPaymenttermsforselect(); // 支付条件清单
            vm.getSalespersonforselect(); // 销售人员
        });
    },
    methods: {
        formatTime: formatTime,
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
                }
            }
        },
        getData() {
            const loading = this.$loading({ lock: true, text: '正在获取资料中...' });
            this.$axios({
                url: '/api/PurchaseOrder/api_getpoforupdate',
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
                        'employee.id': (data.employee && data.employee.id) || '',
                        fromDate: data.fromDate || '',
                        toDate: data.toDate || '',
                        'paymentterm.id': (data.paymentterm && data.paymentterm.id) || '',
                        unitPrice: priceToString(data.unitPrice || ''),
                        hoursFrom: data.hoursFrom || '',
                        hoursTo: data.hoursTo || '',
                        overTimePrice: data.overTimePrice || '',
                        underTimePrice: data.underTimePrice || '',
                        calculateUnit: data.calculateUnit || '',
                        'salesperson.id': (data.salesperson && data.salesperson.id) || '',
                        businessFlow: data.businessFlow || ''
                    };
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
        getVendors() {
            this.$axios({
                url: '/api/Customer/api_vendorsforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.vendors = res.data || [];
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
                    if (this.form.vendorid === ''){
                        this.$message.warning('请选择供应商');
                    } else if (this.form['salesperson.id'] === ''){
                        this.$message.warning('请选择営業担当');
                    } else if (this.form['employee.id'] === '') {
                        this.$message.warning('请选择作業担当');
                    } else {
                        if (this.$route.params.id) {
                            this.getPersonMonth();
                        } else {
                            if (this.completeMonth()) {
                                this.getPersonMonth();
                            } else {
                                this.submit();
                            }
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
        submit() {
            const loading = this.$loading({ lock: true, text: '正在提交合同资料中...' });
            const params = {};
            for (let key in this.form) {
                if (key === 'employee.id') {
                    params.employeeID = this.form[key];
                } else if (key === 'paymentterm.id') {
                    params.paymentTermID = this.form[key];
                } else if (key === 'salesperson.id') {
                    params.salesPersonID = this.form[key];
                } else if (key === 'customer.id') {
                    params.customerID = this.form[key];
                } else if (key === 'unitPrice') {
                    params.unitPrice = Number(priceToNumber(this.form[key]));
                } else if (key === 'hoursFrom') {
                    params.hoursFrom = Number(this.form[key]);
                } else if (key === 'hoursTo') {
                    params.hoursTo = Number(this.form[key]);
                } else if (key === 'overTimePrice') {
                    params.overTimePrice = Number(this.form[key]);
                } else if (key === 'underTimePrice') {
                    params.underTimePrice = Number(this.form[key]);
                } else {
                    params[key] = this.form[key];
                }
            }
            params.ningetsu = JSON.stringify(params.ningetsu || []);
            // if (params.ningetsu) {
            //     params.ningetsu.forEach((item, index) => {
                    
            //     });
            // } else {
            //     params.append('ningetsu', '');
            // }
            let url = '/api/PurchaseOrder/api_createpocontract';
            if (this.$route.params.id !== 'new') {
                params.id = this.$route.params.id;
                url = '/api/PurchaseOrder/api_updatepocontract';
            } else {
                params.id = 0;
            }
            console.log(params);
            this.$axios({
                method: 'POST',
                url,
                params,
                custom: {
                    loading,
                    vm: this
                },
                formData: true
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    if (this.$route.params.id === 'new') {
                        // this.$router.replace({ name: 'ContractEdit', params: { id: res.data }});
                        this.$router.back();
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
            this.form.ningetsu = ningetsu;
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
                        return item.Name;
                    }
                }
            } else if (type === 'vendor') {
                for (let item of this.vendors) {
                    if (item.id === val) {
                        return item.title;
                    }
                }
            }
        },
        handlePrice() {
            this.form.unitPrice = priceToString(priceToNumber(this.form.unitPrice)); 
        },
        // 供应商判断
        changeCustomer() {
            for (let item of this.vendors) {
                if (item.id === this.form.vendorid) {
                    this.form['paymentterm.id'] = item.paymentTermID;
                }
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
        }
    }
};
</script>

<style lang="less">
.contract-sign {
    .text-center{
        text-align: center;
    }
    .content {
        padding: 0 20px;
        .el-select {
            width: 100%;
        }
        .el-input {
            width: 100%;
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
