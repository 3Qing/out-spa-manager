<template>
    <main-wrapper class="estimation-wrapper">
        <div class="main-header" slot="header">
            <el-date-picker
                :disabled="isSave"
                v-model="dates"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                type="daterange"
                range-separator="~"
                start-placeholder="開始日"
                end-placeholder="終了日"
                size="mini">
            </el-date-picker>
            <el-input :disabled="isSave" v-model="fromhours" size="mini" style="width:100px"></el-input>
            <el-input :disabled="isSave" v-model="tohours" size="mini" style="width:100px"></el-input>
            <el-select v-model="customerid" size="mini" clearable :disabled="isSave">
                <el-option
                    v-for="item in customers"
                    :key="item.id"
                    :label="item.title"
                    :value="item.id"></el-option>
            </el-select>
            <el-select v-model="opportunityid" size="mini" clearable :disabled="isSave">
                <el-option
                    v-for="item in opports"
                    :key="item.id"
                    :label="item.text"
                    :value="item.id"></el-option>
            </el-select>
            <el-select
                :disabled="isSave"
                v-model="employeeids"
                multiple
                size="mini"
                clearable>
                <el-option
                    v-for="item in employees"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"></el-option>
            </el-select>
            <el-button type="primary" size="mini" @click="clickSave">{{texts}}</el-button>
            <el-button size="mini" @click="$router.back()">リターン</el-button>
        </div>
        <el-row v-if="show">
            <el-col :span="14">
                <el-form size="mini" label-width="120px" :model="data" ref="form" :rules="rules" class="blackColor">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="タイトル" prop="title">
                                <el-input v-model="data.title"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="見積合計金額" prop="amount">
                                <el-input :disabled=disab v-model="totals" @input="handlePrice"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="得意先" class="first-item" prop="customerID">
                                <!-- <el-input v-model="data.customerTitle"></el-input> -->
                                <el-select v-model="data.customerID" size="mini" clearable>
                                    <el-option
                                        v-for="item in customers"
                                        :key="item.id"
                                        :label="item.title"
                                        :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="支払サイト" prop="paymentTermID">
                                <el-select v-model="data.paymentTermID">
                                    <el-option
                                        v-for="item in pays"
                                        :key="item.id"
                                        :label="item.title"
                                        :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="契约期间" prop="dates">
                                <el-date-picker
                                    v-model="dates"
                                    type="daterange"
                                    value-format="yyyy-MM-dd"
                                    format="yyyy-MM-dd"
                                    range-separator="~"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="作业时间" prop="fromhours">
                                <el-input v-model="fromhours" size="mini" style="width:60px"></el-input>-
                                <el-input v-model="tohours" size="mini" style="width:60px"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="納期" prop="submitDate">
                                <el-date-picker
                                    v-model="data.submitDate"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    format="yyyy-MM-dd"
                                    placeholder="日付">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="納入場所" prop="submitLocation">
                                <el-input v-model="data.submitLocation"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="納品物" prop="submitDocuments">
                                <el-input v-model="data.submitDocuments"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="有効期間" prop="validityPeriod">
                                <el-input v-model="data.validityPeriod"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
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
            <el-table-column label="社員" width="160px">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.employeeID" size="mini">
                        <el-option v-for="item in employees" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="人月" width="160px">
                <template slot-scope="scope">
                    <el-input-number v-model.number="scope.row.ningetsu" size="mini" :precision="2" :max="10" :min="0" @change="handleChange(scope)"></el-input-number>
                </template>
            </el-table-column>
            <el-table-column label="単価" width="140px">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.unitPrice" size="mini" @input="handleInput(scope)"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="金額" width="100px">
                <template slot-scope="scope">
                    <span>{{priceToString(priceToNumber(scope.row.amount))}}</span>
                </template>
            </el-table-column>
            <el-table-column label="備考">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.comment" size="mini"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="アクション" width="80px">
                <template slot-scope="scope">
                    <i class="el-icon-plus link" color="primary" @click="handleAdd(scope)"></i>
                    <i class="el-icon-delete link" color="danger" @click="handleDel(scope)"></i>
                </template>
            </el-table-column>
        </el-table>
        <div class="bottom" v-if="show">
            <span class="title">備考</span>
            <el-input v-model="data.comment" type="textarea" :rows="7"></el-input>
        </div>
        <!-- <div class="text-center" v-if="show">
            <el-button type="primary" size="mini" @click="beforeSubmit">見積書作成</el-button>
        </div> -->
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
            disab: true,
            totals: 0,
            isSave: false,
            texts: '見積書初期化',
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
                customerID: [{
                    required: true, message: '得意先を指定してください！', trigger: 'blur'
                }],
                title: [{
                    required:  true, message: 'タイトルを入力してください！', trigger: 'blur'
                }],
                amount: [{
                    required: true, message: '金額を入力してください！', trigger: 'blur'
                }],
                submitDate: [{
                    required: true, message: '納期を入力してください！', trigger: 'blur'
                }],
                submitLocation: [{
                    required: true, message: '納品場所を入力してください！', trigger: 'blur'
                }],
                submitDocuments: [{
                    required: true, message: '納品物を入力してください！', trigger: 'blur'
                }],
                paymentTermID: [{
                    required: true, message: '支払サイトを指定してください！', trigger: 'blur'
                }],
                validityPeriod: [{
                    required: true, message: '有効期間を入力してください！', trigger: 'blur'
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
                vm.isSave = true;
                vm.texts = '見積書保存';
                if (to.params.arritem) {
                    console.log(111111);
                    const data = to.params.arritem || {};
                    data.amount = priceToString(priceToNumber(data.amount));
                    vm.totals = priceToString(priceToNumber(data.amount));
                    vm.data = { ...data };
                    vm.dates = [
                        moment(new Date(data.fromDate).getTime()).format('YYYY-MM-DD'),
                        moment(new Date(data.toDate).getTime()).format('YYYY-MM-DD')
                    ];
                    vm.fromhours = data.fromHours;
                    vm.tohours = data.toHours;
                    vm.customerid = data.customerID;
                    if(data.opportunityID === 0){
                        vm.opportunityid = '';
                    } else {
                        vm.opportunityid = data.opportunityID;
                    }
                    if (data.items && data.items.length) {
                        vm.tableData = data.items.map(item => {
                            const tmp = { ...item };
                            tmp.unitPrice = priceToString(tmp.unitPrice);
                            tmp.ningetsu = Number((Number(tmp.ningetsu) / 100).toFixed(2));
                            return tmp;
                        });
                    } else {
                        vm.tableData = [{}];
                    }
                    vm.show = true;
                } else {
                    vm.getData();
                    console.log(22222);
                }
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
        // 保存按钮
        clickSave() {
            if (this.texts === '見積書初期化') {
                this.getInitEstimation();
            } else {
                this.beforeSubmit();
            }
        },
        // 初始化报价单
        getInitEstimation() {
            if (this.dates.length !== 2
                || !this.fromhours
                || !this.tohours
                || (!this.customerid && !this.opportunityid)
                || !this.employeeids.length) {
                this.$message({
                    type: 'warning',
                    message: '見積条件を指定してください！'
                });
                return;
            }
            if (Number(this.fromhours) > Number(this.tohours)) {
                this.$message({
                    type: 'warning',
                    message: '工数範囲が不正です'
                });
                return;
            }
            const loading = this.$loading({ lock: true, text: 'データ取得中...' });
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
                this.texts = '見積書保存';
                this.isSave = true;
                loading.close();
                if (res && res.code === 0) {
                    const data = res.data || {};
                    data.amount = priceToString(priceToNumber(data.amount));
                    this.totals = priceToString(priceToNumber(data.amount));
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
            const loading = this.$loading({ lock: true, text: 'データ取得中...' });
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
                    this.totals = priceToString(priceToNumber(data.amount));
                    this.data = { ...data };
                    this.dates = [
                        moment(new Date(data.fromDate).getTime()).format('YYYY-MM-DD'),
                        moment(new Date(data.toDate).getTime()).format('YYYY-MM-DD')
                    ];
                    this.fromhours = data.fromHours;
                    this.tohours = data.toHours;
                    this.customerid = data.customerID;
                    if(data.opportunityID === 0){
                        this.opportunityid = '';
                    } else {
                        this.opportunityid = data.opportunityID;
                    }
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
        // 计数器
        handleChange(scope) {
            const tableData = this.tableData.map(item => ({ ...item }));
            tableData[scope.$index].ningetsu = scope.row.ningetsu;
            tableData[scope.$index].amount = priceToString(priceToNumber(scope.row.unitPrice) * scope.row.ningetsu);
            this.tableData = tableData;
            let total = 0;
            tableData.forEach(item => {
                total += priceToNumber(item.amount) || 0;
            });
            this.totals = priceToString(total);
        },
        // 合计
        getSummaries(p) {
            const { columns } = p;
            const sum = [];
            // let total = 0;
            // data.forEach(item => {
            //     total += (item.amount && Number(item.amount)) || 0;
            // });
            // console.log(total);
            columns.forEach((item, index) => {
                if (index === 3) {
                    sum[index] = '合計：';
                } else if (index === 4) {
                    sum[index] = priceToString(priceToNumber(this.totals));
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
            tableData[scope.$index].amount = priceToString(priceToNumber(scope.row.unitPrice) * scope.row.ningetsu);
            this.tableData = tableData;
            let total = 0;
            tableData.forEach(item => {
                total += priceToNumber(item.amount) || 0;
            });
            this.totals = priceToString(total);
        },
        handlePrice() {
            this.data.amount = priceToString(priceToNumber(this.data.amount));
        },
        beforeSubmit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    const params = {
                        Comment: this.data.comment,
                        CustomerID: this.data.customerID,
                        OpportunityID: this.opportunityid || 0,
                        PaymentTermID: this.data.paymentTermID || 0,
                        SubmitDate: this.data.submitDate,
                        SubmitDocuments: this.data.submitDocuments,
                        SubmitLocation: this.data.submitLocation,
                        Title: this.data.title,
                        ValidityPeriod: this.data.validityPeriod || '',
                        FromDate: this.dates[0],
                        ToDate: this.dates[1],
                        FromHours: this.fromhours,
                        ToHours: this.tohours,
                        Amount: priceToNumber(this.totals),
                        Items: this.tableData.map(item => ({
                            ID: item.id,
                            EmployeeID: item.employeeID,
                            Amount: priceToNumber(item.amount) || 0,
                            Comment: item.comment || '',
                            Ningetsu: Number(item.ningetsu || 0) * 100,
                            UnitPrice: priceToNumber(item.unitPrice)
                        }))
                    };
                    for (let item of this.tableData) {
                        if (!item.amount || !item.comment || !item.ningetsu || !item.unitPrice) {
                            this.$message({
                                type: 'warning',
                                message: '必須項目は全部入力してください！'
                            });
                            return;
                        }
                    }
                    if (!this.data.comment) {
                        this.$message({
                            type: 'warning',
                            message: '備考を入力してください！'
                        });
                        return;
                    }
                    if (Number(this.$route.params.id)) {
                        params.ID = this.$route.params.id;
                        if (this.$route.params.arritem) {
                            params.ID = 0;
                        }
                    }
                    this.submit(params);
                } else {
                    this.$message({
                        type: 'warning',
                        message: '必須項目は全部入力してください！'
                    });
                }
            });
        },
        submit(params) {
            const loading = this.$loading({ lock: true, text: 'データ提出中...' });
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
                        message: '見積書作成完了！'
                    });
                    this.$router.push({ name: 'EstimationList' });
                    // if (Number(this.$route.params.id)) {
                    //     this.getData();
                    // } else {
                    //     this.$router.replace({
                    //         name: 'Estimation',
                    //         params: {
                    //             id: res.data.id
                    //         }
                    //     });
                    // }
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
