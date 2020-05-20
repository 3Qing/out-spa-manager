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
                <el-option v-for="item in customers" :key="item.id" :value="item.id" :label="item.title"></el-option>
            </el-select>
        </div>
        <el-table size="small" :data="tableData" :row-class-name="rowClassName" border>
            <el-table-column label="請求書番号" prop="invoiceNo" show-overflow-tooltip></el-table-column>
            <el-table-column label="請求書ﾀｲﾄﾙ" prop="invoiceTitle" show-overflow-tooltip></el-table-column>
            <el-table-column label="取引先" prop="customerTitle" show-overflow-tooltip></el-table-column>
            <el-table-column label="作業担当者" prop="employeeName"></el-table-column>
            <el-table-column label="請求額" prop="invoiceAmount"></el-table-column>
            <el-table-column label="請求日" prop="invoiceDate"></el-table-column>
            <el-table-column label="入金予定日" prop="planCollectDate"></el-table-column>
            <el-table-column label="実際入金日" prop="actualCollectDate"></el-table-column>
            <el-table-column label="入金額" prop="collectAmount"></el-table-column>
            <el-table-column label="アクション" width="320px">
                <template slot-scope="scope">
                    <i class="iconfont icon-chengyi_pc_preview link oper-icon" color="primary" @click="preview(scope.row)"></i>
                    <i class="icon-PDF iconfont oper-icon" color="danger" @click="downloadFile('pdf', scope.row)"></i>
                    <i class="icon-Excel iconfont oper-icon" color="success" @click="downloadFile('excel', scope.row)"></i>
                    <el-button
                        type="primary"
                        v-for="item in scope.row.actions"
                        :key="item.id"
                        @click="actionHandler(item, scope.row)"
                        size="mini">{{item.title}}</el-button>
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
        <big-picture></big-picture>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import { mapGetters } from 'vuex';
import { apiDownloadFile, imageFileToPreview } from '@_public/utils';
import GoldDialog from '@/components/invoice-list/gold-dialog';
import BigPicture from '@components/big-picture';
export default {
    components: {
        MainWrapper,
        GoldDialog,
        BigPicture
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
                url: '/api/Customer/api_customersforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.customers = res.data || [];
                }
            });
        },
        getData() {
            const loading = this.$loading({ lock: true, text: '正在获取数据中' });
            this.$axios({
                url: '/api/Invoice/api_getinvoicelist',
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
                if (res && res.code === 0) {
                    const data = res.data || {};
                    const tableData = data.data || [];
                    this.tableData = tableData.map(item => {
                        const actions = item.actions || [];
                        item.actions = actions.filter(item => item.id !== 'act_downloadinvoice');
                        return item;
                    });
                    this.total = data.total;
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
            if (item.id === 'act_downloadinvoice') {
                this.downloadInvoice(row);
            } else if (item.id === 'act_collectsales') {
                this.$root.$emit('SHOW_GOLD_DIALOG', {
                    data: row,
                    callback: () => {
                        this.getData();
                    }
                });
            } else if (item.id === 'act_cancelinvoice') {
                this.cancelInvoice(row);
            }
        },
        downloadInvoice(row) {
            apiDownloadFile({
                vm: this,
                url: `/api/Invoice/api_downloadinvoiceexcel?invid=${row.id}`,
                filename: `${Date.now()}.xlsx`
            });
        },
        cancelInvoice(row) {
            const loading = this.$loading({ lock: true, text: '正在取消请求书' });
            this.$axios({
                url: '/api/Invoice/api_cancelinvoice',
                params: {
                    invid: row.id
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
                        message: '已取消请求书'
                    });
                    this.getData();
                } else {
                    this.$message({
                        type: 'error',
                        message: res ? res.message : '接口开小差了，没有返回信息'
                    });
                }
            });
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
        },
        downloadFile(type, row) {
            if (type === 'pdf') {
                apiDownloadFile({
                    vm: this,
                    url: `/api/Invoice/api_downloadinvoice?invid=${row.id}&filetype=0`,
                    filename: `${Date.now()}.pdf`
                });
            } else if (type === 'excel') {
                apiDownloadFile({
                    vm: this,
                    url: `/api/Invoice/api_downloadinvoice?invid=${row.id}&filetype=1`,
                    filename: `${Date.now()}.xlsx`
                });
            }
        },
        preview(row) {
            imageFileToPreview({
                vm: this,
                url: '/api/Invoice/api_previewinvoicefile',
                params: {
                    invid: row.id
                }
            });
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
    .iconfont {
        font-size: 20px;
        margin-right: 10px;
        display: inline-block;
        vertical-align: top;
    }
    .el-table {
        .oper-icon {
            font-size: 20px;
            margin-top: 4px;
        }
    }
}
</style>
