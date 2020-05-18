<template>
    <main-wrapper class="estimation-wrapper">
        <div class="main-header" slot="header">
            <el-date-picker
                v-model="dates"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="daterange"
                range-separator="~"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                size="mini">
            </el-date-picker>
            <el-input v-model="fromhours" size="mini" style="width:100px"></el-input>
            <el-input v-model="tohours" size="mini" style="width:100px"></el-input>
            <el-select v-model="customerid" size="mini" clearable>
                <el-option
                    v-for="item in customers"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id"></el-option>
            </el-select>
            <el-select v-model="opportunityid" size="mini" clearable>
                <el-option
                    v-for="item in opports"
                    :key="item.id"
                    :label="item.text"
                    :value="item.id"></el-option>
            </el-select>
            <el-select
                v-model="employeeids"
                multiple
                size="mini"
                collapse-tags
                clearable>
                <el-option
                    v-for="item in employees"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
            </el-select>
            <el-button type="primary" size="mini" @click="getInitEstimation">初始化</el-button>
            <el-button size="mini" @click="$router.back()">返回</el-button>
        </div>
        <el-row v-if="show">
            <el-col :span="12">
                <el-form size="mini" label-width="100px" :model="data" ref="form" :rules="rules">
                    <el-form-item class="first-item" prop="customerTitle">
                        <el-input v-model="data.customerTitle"></el-input>
                        <span>御中</span>
                    </el-form-item>
                    <el-form-item label="简明" prop="title">
                        <el-input v-model="data.title"></el-input>
                    </el-form-item>
                    <el-form-item label="预见期金额" prop="amount">
                        <el-input v-model="data.amount" @input="handlePrice"></el-input>
                    </el-form-item>
                    <el-form-item label="纳期" prop="submitDate">
                        <el-date-picker
                            v-model="data.submitDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="纳入场所" prop="submitLocation">
                        <el-input v-model="data.submitLocation"></el-input>
                    </el-form-item>
                    <el-form-item label="纳品物品" prop="submitDocuments">
                        <el-input v-model="data.submitDocuments"></el-input>
                    </el-form-item>
                    <el-form-item label="支出" prop="paymentTermID">
                        <el-select v-model="data.paymentTermID">
                            <el-option
                                v-for="item in pays"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="有效期间" prop="validityPeriod">
                        <el-input v-model="data.validityPeriod"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="12"></el-col>
        </el-row>
        <el-table size="small" v-if="show" :data="tableData" :summary-method="getSummaries" show-summary>
            <el-table-column label="No" width="100px">
                <template slot-scope="scope">
                    <span>{{scope.$index + 1}}</span>
                </template>
            </el-table-column>
            <el-table-column label="员工" width="160px">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.employeeID" size="mini">
                        <el-option v-for="item in employees" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="工数" width="160px">
                <template slot-scope="scope">
                    <el-input-number v-model.number="scope.row.ningetsu" size="mini" :precision="2" :max="1"></el-input-number>
                </template>
            </el-table-column>
            <el-table-column label="基本单位" width="140px">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.unitPrice" size="mini" @input="handleInput(scope)"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="金额" width="100px">
                <template slot-scope="scope">
                    <span>{{priceToString(scope.row.amount || 0)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="通过">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.comment" size="mini"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="80px">
                <template slot-scope="scope">
                    <i class="el-icon-plus link" color="primary" @click="handleAdd(scope)"></i>
                    <i class="el-icon-delete link" color="danger" @click="handleDel(scope)"></i>
                </template>
            </el-table-column>
        </el-table>
        <div class="bottom" v-if="show">
            <span class="title">偏考</span>
            <el-input v-model="data.comment" type="textarea" :rows="7"></el-input>
        </div>
        <div class="text-center" v-if="show">
            <el-button type="primary" size="mini" @click="beforeSubmit">保存</el-button>
        </div>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import moment from 'moment';
import { formatTime, priceToString, priceToNumber } from '@_public/utils';
export default {
    components: {
        MainWrapper
    },
    data() {
        return {
            dates: [],
            fromhours: '140',
            tohours: '180',
            customerid: '',
            opportunityid: '',
            employeeids: [],
            customers: [],
            employees: [],
            opports: [],
            pays: [],
            data: {},
            show: false,
            tableData: [],
            rules: {
                customerTitle: [{
                    required: true, message: '请填写客户名称', trigger: 'blur'
                }],
                title: [{
                    required:  true, message: '请填写标题', trigger: 'blur'
                }],
                amount: [{
                    required: true, message: '请填写金额', trigger: 'blur'
                }],
                submitDate: [{
                    required: true, message: '请选择纳期', trigger: 'blur'
                }],
                submitLocation: [{
                    required: true, message: '请填写纳入场所', trigger: 'blur'
                }],
                submitDocuments: [{
                    required: true, message: '请填写纳品物品', trigger: 'blur'
                }],
                paymentTermID: [{
                    required: true, message: '请选择支出', trigger: 'blur'
                }],
                validityPeriod: [{
                    required: true, message: '请填写有效期间', trigger: 'blur'
                }]
            }
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (to.params.id === 'new') {
                const month = new Date().getMonth() + 1;
                const year = new Date().getFullYear();
                const monthStartDate = new Date(year,  month, 1);
                const monthEndDate = new Date(year, month + 1, 0);
                vm.dates = [ moment(monthStartDate).format('YYYY-MM-DD'), moment(monthEndDate).format('YYYY-MM-DD') ];
            } else {
                vm.getData();
            }
            vm.getCustomer();
            vm.getOpport();
            vm.getEmployee();
            vm.getPay();
        });
    },
    methods: {
        formatTime: formatTime,
        priceToString: priceToString,
        priceToNumber: priceToNumber,
        // 初始化报价单
        getInitEstimation() {
            if (this.dates.length !== 2
                || !this.fromhours
                || !this.tohours
                || (!this.customerid && !this.opportunityid)
                || !this.employeeids.length) {
                this.$message({
                    type: 'warning',
                    message: '请设置全部的条件'
                });
                return;
            }
            if (Number(this.fromhours) > Number(this.tohours)) {
                this.$message({
                    type: 'warning',
                    message: '开始工时不得大于结束工时'
                });
                return;
            }
            const loading = this.$loading({ lock: true, text: '正在获取数据中' });
            this.$axios({
                method: 'POST',
                url: '/api/Estimation/api_proposeestimation',
                params: {
                    fromdate: this.dates[0],
                    todate: this.dates[1],
                    fromhours: this.fromhours,
                    tohours: this.tohours,
                    customerid: this.customerid,
                    opportunityid: this.opportunityid,
                    employeeids: this.employeeids
                },
                formData: true
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    const data = res.data || {};
                    data.amount = priceToString(priceToNumber(data.amount));
                    data.submitDate = moment(data.submitDate).format('YYYY-MM-DD');
                    this.data = { ...data };
                    if (this.data.items && this.data.items.length) {
                        this.tableData = data.items.map(item => {
                            const tmp = { ...item };
                            tmp.unitPrice = priceToString(tmp.unitPrice);
                            tmp.ningetsu = Number((Number(tmp.ningetsu) / 100).toFixed(2));
                            return tmp;
                        });
                    } else {
                        this.tableData = [ {} ];
                    }
                    this.show = true;
                }
            });
        },
        getData() {
            const loading = this.$loading({ lock: true, text: '正在获取信息中' });
            this.$axios({
                url: '/api/Estimation/api_getestimationbyid',
                params: {
                    id: this.$route.params.id
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    const data = res.data || {};
                    data.amount = priceToString(priceToNumber(data.amount));
                    this.data = { ...data };
                    this.dates = [
                        moment(new Date(data.fromDate).getTime()).format('YYYY-MM-DD'),
                        moment(new Date(data.toDate).getTime()).format('YYYY-MM-DD')
                    ];
                    this.fromhours = data.fromHours;
                    this.tohours = data.toHours;
                    this.customerid = data.customerID;
                    this.opportunityid = data.opportunityID;
                    if (data.items && data.items.length) {
                        this.tableData = data.items.map(item => {
                            const tmp = { ...item };
                            tmp.unitPrice = priceToString(tmp.unitPrice);
                            tmp.ningetsu = Number((Number(tmp.ningetsu) / 100).toFixed(2));
                            return tmp;
                        });
                    } else {
                        this.tableData = [{}];
                    }
                    this.show = true;
                }
            });
        },
        getCustomer() {
            this.$axios({
                url: '/api/Customer/api_customersforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.customers = res.data || [];
                }
            });
        },
        getOpport() {
            this.$axios({
                url: '/api/Opportunity/api_opportunityforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.opports = res.data || [];
                }
            });
        },
        getEmployee() {
            this.$axios({
                url: '/api/Employee/api_employeesforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.employees = res.data || [];
                }
            });
        },
        getPay() {
            this.$axios({
                url: '/api/PaymentTerm/api_paymenttermsforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.pays = res.data || [];
                }
            });
        },
        // 合计
        getSummaries(p) {
            const { columns, data } = p;
            const sum = [];
            let total = 0;
            data.forEach(item => {
                total += (item.amount && Number(item.amount)) || 0;
            });
            columns.forEach((item, index) => {
                if (index === 3) {
                    sum[index] = '总计：';
                } else if (index === 4) {
                    sum[index] = priceToString(total);
                } else {
                    sum[index] = '';
                }
            });
            return sum;
        },
        handleAdd(scope) {
            const tmp = [ ...this.tableData ];
            tmp.splice(scope.$index + 1, 0, {});
            this.tableData = [ ...tmp ];
        },
        handleDel(scope) {
            const tmp = [ ...this.tableData ];
            tmp.splice(scope.$index, 1);
            this.tableData = [ ...tmp ];
        },
        handleInput(scope) {
            const tableData = this.tableData.map(item => ({ ...item }));
            tableData[scope.$index].unitPrice = priceToString(priceToNumber(scope.row.unitPrice));
            this.tableData = tableData;
        },
        handlePrice() {
            this.data.amount = priceToString(priceToNumber(this.data.amount));
        },
        beforeSubmit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    const params = {
                        Comment: this.data.comment,
                        CustomerID: this.customerid,
                        OpportunityID: this.opportunityid || 0,
                        PaymentTermID: this.data.paymentTermID || 0,
                        SubmitDate: this.data.submitDate,
                        SubmitDocuments: this.data.submitDocuments,
                        SubmitLocation: this.data.submitLocation,
                        Title: this.data.title,
                        ValidatyPeriod: this.data.validityPeriod || '',
                        FromDate: this.dates[0],
                        ToDate: this.dates[1],
                        FromHours: this.fromhours,
                        ToHours: this.tohours,
                        Amount: priceToNumber(this.data.amount),
                        Items: this.tableData.map(item => ({
                            ID: item.id,
                            EmployeeID: item.employeeID,
                            Amount: item.amount || 0,
                            Comment: item.comment || '',
                            Ningetsu: item.ningetsu || 0,
                            UnitPrice: priceToNumber(item.unitPrice)
                        }))
                    };
                    for (let item of this.tableData) {
                        if (!item.amount || !item.comment || !item.ningetsu || !item.unitPrice) {
                            this.$message({
                                type: 'warning',
                                message: '表格中存在未填写字段'
                            });
                            return;
                        }
                    }
                    if (!this.data.comment) {
                        this.$message({
                            type: 'warning',
                            message: '请填写偏考'
                        });
                        return;
                    }
                    if (Number(this.$route.params.id)) {
                        params.ID = this.$route.params.id;
                    }
                    this.submit(params);
                } else {
                    this.$message({
                        type: 'warning',
                        message: '存在字段未填写'
                    });
                }
            });
        },
        submit(params) {
            const loading = this.$loading({ lock: true, text: '正在提交信息中' });
            this.$axios({
                method: 'POST',
                url: '/api/Estimation/api_updateestimation',
                params,
                formData: true
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '提交成功'
                    });
                    if (Number(this.$route.params.id)) {
                        this.getData();
                    } else {
                        this.$router.replace({
                            name: 'Estimation',
                            params: {
                                id: res.data.id
                            }
                        });
                    }
                }
            });
        }
    }
};
</script>

<style lang="less">
.estimation-wrapper {
    .main-header {
        .el-input, .el-select {
            width: 160px;
            margin-right: 10px;
        }
        .el-date-editor {
            width: 360px;
            margin-right: 10px;
        }
    }
    .first-item {
        .el-form-item__content {
            display: flex;
            .el-input {
                flex: 1 0 0;
            }
        }
    }
    .el-form {
        .el-date-editor, .el-select {
            width: 100%;
        }
    }
    .link {
        font-size: 16px;
        & + .link {
            margin-left: 10px;
        }
    }
    .bottom {
        display: flex;
        margin: 40px 0 20px;
        .title {
            width: 100px;
            text-align: center;
            line-height: 160px;
        }
        .el-input {
            flex: 1 0 0;
        }
    }
}
</style>
