<template>
    <el-card class="vendor-box">
        <div slot="header" class="card-header">
            <el-button type="primary" size="mini" style="margin: 0 0 10px 15px;" @click="beforeSubmit" >提交</el-button>
            <el-form size="small" label-width="130px" ref="form" :model="form" :rules="errors" class="blackColor">
                <el-form-item label="請求書番号" prop="invoiceNo">
                    <el-input v-model="form.invoiceNo"></el-input>
                </el-form-item>
                <el-form-item label="仕入先" prop="vendorID">
                    <el-select
                        @change="changeVendor"
                        v-model="form.vendorID"
                        placeholder="仕入先">
                        <el-option v-for="item in vendors" :key="item.id" :label="item.title" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="請求書タイトル" prop="invoiceTitle">
                    <el-input v-model="form.invoiceTitle"></el-input>
                </el-form-item>
                <el-form-item label="請求日" prop="invoiceDate">
                    <el-date-picker
                        size="mini"
                        placeholder="請求日"
                        v-model="form.invoiceDate"
                        value-format="yyyy-MM-dd"
                        value="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item label="支払期日" prop="planCollectDate">
                    <el-date-picker
                        size="mini"
                        placeholder="支払期日"
                        v-model="form.planCollectDate"
                        value-format="yyyy-MM-dd"
                        value="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item label="合計金額" prop="invoiceAmount">
                    <el-input v-model="form.invoiceAmount"></el-input>
                </el-form-item>
                <el-form-item label="備考" prop="comment">
                    <el-input type='textarea' :rows='4' v-model="form.comment"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <el-button type="primary" size="mini" v-if="temshow" @click="addRow" style="margin-bottom: 10px;">請求明細選択</el-button>
        <el-table size="mini" v-if="cashshow" :data="tabels" border>
            <el-table-column label="番号">
                <template slot-scope="scope">
                    <!-- <el-input v-if='!show' v-model="scope.row.ids" size="mini"></el-input> -->
                    <span >{{scope.$index+1}}</span>
                </template>
            </el-table-column>
            <el-table-column label="受注書番号" prop="contractNo" >
                <template slot-scope="scope">
                    <el-input v-if='!show' v-model="scope.row.contractNo" size="mini"></el-input>
                    <span v-else>{{scope.row.contractNo}}</span>
                </template>
            </el-table-column>
            <el-table-column label="担当者" prop="employeeID" >
                <template slot-scope="scope">
                    <el-select
                        v-model="scope.row.employeeID"
                        placeholder="担当者">
                        <el-option v-for="item in vendors" :key="item.id" :label="item.title" :value="item.id"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="摘要" prop="invoiceComment" >
                <template slot-scope="scope">
                    <el-input v-model="scope.row.invoiceComment" size="mini" :maxlength="100"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="開始日" >
                <template slot-scope="scope">
                    <el-date-picker
                        size="mini"
                        placeholder="開始日"
                        v-model="scope.row.fromDate"
                        value-format="yyyy-MM-dd"
                        value="yyyy-MM-dd"></el-date-picker>
                </template>
            </el-table-column>
            <el-table-column label="終了日" >
                <template slot-scope="scope">
                    <el-date-picker
                        size="mini"
                        placeholder="終了日"
                        v-model="scope.row.toDate"
                        value-format="yyyy-MM-dd"
                        value="yyyy-MM-dd"></el-date-picker>
                </template>
            </el-table-column>
            <el-table-column label="人月" >
                <template slot-scope="scope">
                    <el-input v-model="scope.row.ningetsu" size="mini"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="支払期日" >
                <template slot-scope="scope">
                    <el-date-picker
                        size="mini"
                        placeholder="支払期日"
                        v-model="scope.row.planCollectDate"
                        value-format="yyyy-MM-dd"
                        value="yyyy-MM-dd"></el-date-picker>
                </template>
            </el-table-column>
            <el-table-column label="契約単価" >
                <template slot-scope="scope">
                    <el-input v-model="scope.row.planCollectSales" size="mini"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="精算額" >
                <template slot-scope="scope">
                    <el-input v-model="scope.row.planCollectAddSales" size="mini"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="消費税" >
                <template slot-scope="scope">
                    <el-input v-model="scope.row.planCollectTax" size="mini"></el-input>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog title="入金" :visible.sync="visible" @close="close">
            <el-table size="mini" :data="tableData" border>
                <el-table-column label="選択">
                    <template slot-scope="scope">
                        <el-checkbox v-model="scope.row.isTrue"></el-checkbox>
                    </template>
                </el-table-column>
                <el-table-column label="受注書番号" >
                    <template slot-scope="scope">
                        <span>{{scope.row.cashflow.contractNo}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="担当者" >
                    <template slot-scope="scope">
                        <span>{{scope.row.employeeNo}} {{scope.row.name}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="開始日" >
                    <template slot-scope="scope">
                        <!-- <el-date-picker
                            size="mini"
                            placeholder="開始日"
                            v-model="scope.row.fromDate"
                            value-format="yyyy-MM-dd"
                            value="yyyy-MM-dd"></el-date-picker> -->
                        <span>{{formatTime(scope.row.cashflow.fromDate)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="終了日" >
                    <template slot-scope="scope">
                        <!-- <el-date-picker
                            size="mini"
                            placeholder="終了日"
                            v-model="scope.row.toDate"
                            value-format="yyyy-MM-dd"
                            value="yyyy-MM-dd"></el-date-picker> -->
                        <span>{{formatTime(scope.row.cashflow.toDate)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="人月" >
                    <template slot-scope="scope">
                        <!-- <el-input v-model="scope.row.ningetsu" size="mini"></el-input> -->
                        <span>{{scope.row.cashflow.ningetsu}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="支払期日" >
                    <template slot-scope="scope">
                        <!-- <el-date-picker
                            size="mini"
                            placeholder="支払期日"
                            v-model="scope.row.planCollectDate"
                            value-format="yyyy-MM-dd"
                            value="yyyy-MM-dd"></el-date-picker> -->
                        <span>{{formatTime(scope.row.cashflow.planCollectDate)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="契約単価" >
                    <template slot-scope="scope">
                        <!-- <el-input v-model="scope.row.planCollectSales" size="mini"></el-input> -->
                        <span>{{scope.row.cashflow.contractSales}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer">
                <el-button size="small" @click="close">取消</el-button>
                <el-button size="small" type="primary" @click="submit">保存</el-button>
            </div>
        </el-dialog>
    </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
import { formatTime } from '@_public/utils';
export default {
    data() {
        return {
            temshow: false,
            visible: false,
            cashshow: false,
            tableData: [],
            tabels: []
        };
    },
    props: {
        show: Boolean,
        form: Object,
        items: Array,
        teams: Array,
        employees: Array,
        customs: Array,
        errors: Object,
        vendors: Array
    },
    computed: {
        ...mapGetters(['IS_H5'])
    },
    methods: {
        formatTime: formatTime,
        getContent(val, arr, key, field) {
            for (let item of arr) {
                if (item[key] === val) {
                    return item[field];
                }
            }
        },
        beforeSubmit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    const loading = this.$loading({ lock: true, text: '正在提交信息中...' });
                    let params = {
                        cashflows: this.tabels,
                        InvoiceNo: this.form.invoiceNo,
                        InvoiceTitle: this.form.invoiceTitle,
                        InvoiceAmount: this.form.invoiceAmount,
                        InvoiceDate: this.form.invoiceDate,
                        PlanCollectDate: this.form.planCollectDate,
                        CreateDate: moment(new Date()).format('YYYY-MM-DD'),
                        Comment: this.form.comment,
                        VendorID: this.form.vendorID,
                        ID: 0,
                        UpdateTime: moment(new Date()).format('YYYY-MM-DD')
                    };
                    this.$axios({
                        formData: true,
                        method: 'POST',
                        url: '/api/POInvoice/api_createinvoice',
                        params,
                        custom: {
                            loading,
                            vm: this
                        }
                    }).then(res => {
                        loading.close();
                        if (res && res.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '保存成功'
                            });
                            location.reload();
                        }
                    });
                }
            });
        },
        close() {
            this.visible = false;
        },
        submit() {
            this.tabels = [];
            this.tableData.forEach((item) => {
                if (item.isTrue) {
                    this.cashshow = true;
                    item.cashflow.actualCollectDate = formatTime(item.cashflow.actualCollectDate);
                    item.cashflow.updateTime = formatTime(item.cashflow.updateTime);
                    this.tabels.push(item.cashflow);
                }
            });
            this.visible = false;
        },
        addRow() {
            const loading = this.$loading({ lock: true, text: '信息取得中...' });
            let url = '/api/POInvoice/api_getcashflowsbyvendor';
            let params = {
                vendorid: this.form.vendorID
            };
            this.$axios({
                url,
                params,
                custom: {
                    vm: this
                }
            }).then(res => {
                loading.close();
                res.data.forEach(element => {
                    element['isTrue'] = false;
                });
                this.tableData = res.data;
                this.visible = true;
            });
        },
        changeVendor() {
            this.temshow = true;
        }
    }
};
</script>

<style lang="less">
.vendor-box {
    box-shadow: none !important;
    .errors-tip {
        input {
            border-color: #DB414E !important;
        }
    }
}
</style>
