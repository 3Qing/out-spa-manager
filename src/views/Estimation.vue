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
        </div>
        <el-row v-if="show">
            <el-col :span="12">
                <el-form size="mini" label-width="100px">
                    <el-form-item class="first-item">
                        <el-input v-model="data.customerTitle"></el-input>
                        <span>御中</span>
                    </el-form-item>
                    <el-form-item label="简明">
                        <el-input v-model="data.title"></el-input>
                    </el-form-item>
                    <el-form-item label="预见期金额">
                        <el-input v-model="data.amount"></el-input>
                    </el-form-item>
                    <el-form-item label="纳期">
                        <el-date-picker
                            v-model="data.submitDate"
                            type="date"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="纳入场所">
                        <el-input v-model="data.submitLocation"></el-input>
                    </el-form-item>
                    <el-form-item label="纳品物品">
                        <el-input v-model="data.submitDocuments"></el-input>
                    </el-form-item>
                    <el-form-item label="支出">
                        <el-select v-model="data.paymentTermID">
                            <el-option
                                v-for="item in pays"
                                :key="item.id"
                                :label="item.title"
                                :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="有效期间">
                        <el-input v-model="data.validatyPeriod"></el-input>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="12"></el-col>
        </el-row>
        <el-table size="small" v-if="show" :data="tableData" :summary-method="getSummaries" show-summary>
            <el-table-column label="No" width="100px">
                <template slot-scope="scope">
                    <span>{{scope.row.estimationID}}</span>
                </template>
            </el-table-column>
            <el-table-column label="工数" width="160px">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.ningetsu" size="mini"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="基本单位" width="140px">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.unitPrice" size="mini"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="金额" width="100px">
                <template slot-scope="scope">
                    <span>{{scope.row.amount || 0}}</span>
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
            <el-input v-model="data.comment" type="textarea" :rows="10"></el-input>
        </div>
        <div class="text-center" v-if="show">
            <el-button type="primary" size="mini" @click="beforeSubmit">保存</el-button>
            <el-button size="mini" @click="$router.back()">返回</el-button>
        </div>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import moment from 'moment';
import { formatTime } from '@_public/utils';
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
            form: {},
            customers: [],
            employees: [],
            opports: [],
            pays: [],
            data: {},
            show: false,
            tableData: []
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
                    data.submitDate = moment(data.submitDate).format('YYYY-MM-DD');
                    this.data = { ...data };
                    if (this.data.items && this.data.items.length) {
                        this.tableData = [ ...data.items ];
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
                    console.log(res);
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
        getSummaries({ column, data }) {
            console.log(column, data);
        },
        handleAdd(scope) {
            const tmp = [ ...this.tableData ];
            tmp.splice(scope.$index + 1, 1, {});
            this.tableData = [ ...tmp ];
        },
        handleDel(scope) {
            const tmp = [ ...this.tableData ];
            tmp.splice(scope.$index + 1, 0);
            this.tableData = [ ...tmp ];
        },
        beforeSubmit() {
            const params = {
                Comment: this.data.comment,
                CustomerID: this.customerid,
                OpportunityID: this.opportunityid || 0,
                PaymentTermID: this.data.paymentTermID || 0,
                SubmitDate: this.data.submitDate,
                SubmitDocuments: this.data.submitDocuments,
                SubmitLocation: this.data.submitLocation,
                Title: this.data.title,
                ValidatyPeriod: this.data.validatyPeriod || '',
                FromDate: this.dates[0],
                ToDate: this.dates[1],
                Items: this.tableData.map(item => ({
                    ID: item.id,
                    Amount: item.amount || 0,
                    Comment: item.comment || '',
                    Ningetsu: item.ningetsu || 0,
                    UnitPrice: item.unitPrice
                }))
            };
            this.submit(params);
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
            line-height: 117px;
        }
        .el-input {
            flex: 1 0 0;
        }
    }
}
</style>
