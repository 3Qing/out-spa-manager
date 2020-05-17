<template>
    <main-wrapper class="estimation-list-wrapper">
        <div slot="header" class="main-header">
            <el-select v-model="customerid" size="mini" @change="handleChange" clearable>
                <el-option v-for="item in customers" :key="item.id" :label="item.title" :value="item.id"></el-option>
            </el-select>
            <el-button type="primary" size="mini" @click="handleEdit({estimationNo: 'new'})">新建登録</el-button>
        </div>
        <el-table :data="tableData" size="small">
            <el-table-column label="No" prop="estimationNo" width="100px"></el-table-column>
            <el-table-column label="发布日期" prop="pubDate" width="120px">
                <template slot-scope="scope">
                    <span>{{formatTime(scope.row.pubDate)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="客户名称" prop="customerTitle"></el-table-column>
            <el-table-column label="商标名称" prop="opportunityTitle"></el-table-column>
            <el-table-column label="操作" width="80px">
                <template slot-scope="scope">
                    <i class="el-icon-edit link" color="primary" @click="handleEdit(scope.row)"></i>
                    <i class="iconfont icon-icon-test link" color="primary" @click="downloadFile(scope.row)"></i>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            :page-size="pageSize"
            :current-page="page"
            @current-change="changePage"
            :layout="IS_H5 ? 'prev, pager, next' : 'total, prev, pager, next, jumper'"
            :total="total"></el-pagination>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import { mapGetters } from 'vuex';
import { formatTime, apiDownloadFile } from '@_public/utils';
export default {
    components: {
        MainWrapper
    },
    data() {
        return {
            tableData: [],
            page: 1,
            pageSize: 10,
            customerid: '',
            customers: [],
            total: 0
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getData();
            vm.getCustomer();
        });
    },
    computed: {
        ...mapGetters(['IS_H5'])
    },
    methods: {
        formatTime: formatTime,
        getData() {
            const loading = this.$loading({ lock: true, text: '正在获取数据中' });
            this.$axios({
                url: '/api/Estimation/api_getestimationlist',
                params: {
                    page: this.page,
                    pagesize: this.pageSize,
                    customerid: this.customerid
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    const data = res.data || {};
                    this.tableData = data.data || [];
                    this.total = data.total || 0;
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
        changePage(page) {
            this.page = page;
            this.getData();
        },
        handleEdit(row) {
            this.$router.push({
                name: 'Estimation',
                params: {
                    id: row.estimationNo || 'new'
                }
            });
        },
        handleChange() {
            this.page = 1;
            this.getData();
        },
        downloadFile(row) {
            apiDownloadFile({
                vm: this,
                api: `/api/Estimation/api_downloadestimationexcel?id=${row.id}`,
                filename: `${Date.now()}.cls`
            });
        }
    }
};
</script>

<style lang="less">
.estimation-list-wrapper {
    .main-header {
        .el-button {
            margin-left: 10px;
        }
    }
    .link {
        font-size: 16px;
        & + .link {
            margin-left: 15px;
        }
    }
}
</style>
