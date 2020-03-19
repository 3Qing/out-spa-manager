<template>
    <main-wrapper class="invoice-list">
        <div slot="header" class="main-header">
            <el-date-picker
                size="mini"
                v-model="date"
                type="monthrange"
                value-format="yyyyMM"
                value="yyyyMM"
                range-separator="~"
                start-placeholder="开始月份"
                end-placeholder="结束月份"
                @change="changeDate"></el-date-picker>
            <el-select
                size="mini"
                clearable
                placeholder="取引先"
                v-model="customerid"
                @change="changeDate">
                <el-option v-for="item in customers" :key="item.ID" :value="item.ID" :label="item.Title"></el-option>
            </el-select>
        </div>
        <el-table size="small" :data="tableData" :row-class-name="rowClassName">
            <el-table-column label="請求書番号" prop="InvoiceNo" show-overflow-tooltip></el-table-column>
            <el-table-column label="請求書ﾀｲﾄﾙ" prop="InvoiceTitle" show-overflow-tooltip></el-table-column>
            <el-table-column label="取引先" prop="CustomerTitle" show-overflow-tooltip></el-table-column>
            <el-table-column label="作業担当者" prop="EmployeeName"></el-table-column>
            <el-table-column label="請求額" prop="InvoiceAmount"></el-table-column>
            <el-table-column label="請求日" prop="InvoiceDate"></el-table-column>
            <el-table-column label="入金予定日" prop="PlanCollectDate"></el-table-column>
            <el-table-column label="実際入金日" prop="ActualCollectDate"></el-table-column>
            <el-table-column label="入金額" prop="CollectAmount"></el-table-column>
            <el-table-column label="アクション" width="320px">
                <template slot-scope="scope">
                    <el-button
                        type="primary"
                        v-for="item in scope.row.Actions"
                        :key="item.ID"
                        @click="actionHandler(item, scope.row)"
                        size="mini">{{item.Title}}</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            :current-page="page"
            :page-size="pageSize"
            @current-change="changePn"
            :layout="IS_H5 ? 'prev, pager, next' : 'total, prev, pager, next, jumper'"
            :total="total"></el-pagination>
        <gold-dialog></gold-dialog>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import { mapGetters } from 'vuex';
import { formatApiUrl } from '@_public/utils';
import GoldDialog from '@/components/invoice-list/gold-dialog';
export default {
    components: {
        MainWrapper,
        GoldDialog
    },
    data() {
        return {
            date: null,
            page: 1,
            pageSize: 10,
            total: 0,
            customers: [],
            customerid: '',
            tableData: []
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            const time = new Date();
            vm.date = [
                `${time.getFullYear()}${String(time.getMonth()).padStart(2, '0')}`,
                `${time.getFullYear()}${String(time.getMonth()).padStart(2, '0')}`
            ];
            vm.getData();
            vm.getCustomers();
        });
    },
    computed: {
        ...mapGetters(['IS_H5'])
    },
    methods: {
        getCustomers() {
            this.$axios({
                url: '/api/customersforselect'
            }).then(res => {
                if (res.code === 0) {
                    this.customers = res.data || [];
                }
            });
        },
        getData() {
            const loading = this.$loading({ lock: true, text: '正在获取数据中' });
            this.$axios({
                url: '/api/getinvoicelist',
                params: {
                    fromperiod: this.date[0],
                    toperiod: this.date[1],
                    customerid: this.customerid,
                    page: this.page,
                    pagesize: this.pageSize
                },
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res.code === 0) {
                    this.tableData = res.data || [];
                    this.total = res.total;
                } else {
                    this.tableData = [];
                    this.total = 0;
                }
            });
        },
        changePn(page) {
            this.page = page;
            this.getData();
        },
        actionHandler(item, row) {
            if (item.ID === 'act_downloadinvoice') {
                this.downloadInvoice(row);
            } else if (item.ID === 'act_collectsales') {
                this.$root.$emit('SHOW_GOLD_DIALOG', {
                    data: row,
                    callback: () => {
                        this.getData();
                    }
                });
            }
        },
        downloadInvoice(row) {
            formatApiUrl('/api/downloadinvoice', `?invid=${row.ID}`);
        },
        rowClassName({ row }) {
            if (row.Status === 0 || row.Status === 2) {
                return 'bg-warning';
            } else if (row.Status === 1) {
                return 'bg-success';
            }
        },
        changeDate() {
            this.page = 1;
            this.getData();
        }
    }
};
</script>

<style lang="less">
.invoice-list {
    .el-select {
        margin-left: 40px;
        vertical-align: top;
    }
    .bg-warning td {
        color: #fff;
        background-color: rgba(230, 162, 60, 0.78) !important;
    }
    .bg-success td {
        color: #fff;
        background-color: rgba(69, 190, 135, 0.78) !important;
    }
}
</style>
