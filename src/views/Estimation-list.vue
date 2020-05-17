<template>
    <main-wrapper>
        <div slot="header" class="main-header">
            <!-- <el-select>
                <el-option></el-option>
            </el-select> -->
        </div>
        <el-table>
            <el-table-column label="estimationNo" prop="estimationNo"></el-table-column>
            <el-table-column label="pubDate" prop="pubDate"></el-table-column>
            <el-table-column label="customerTitle" prop="customerTitle"></el-table-column>
            <el-table-column label="opportunityTitle" prop="opportunityTitle"></el-table-column>
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
            total: 0
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getData();
        });
    },
    computed: {
        ...mapGetters(['IS_H5'])
    },
    methods: {
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
        changePage(page) {
            this.page = page;
            this.getData();
        }
    }
};
</script>

<style scoped>

</style>
