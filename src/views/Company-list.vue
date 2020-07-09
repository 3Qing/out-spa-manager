<template>
    <main-wrapper class="compang-list">
        <div class="main-header" slot="header">
            <el-button type="primary" size="mini" @click="newHandle">新規登録</el-button>
        </div>
        <el-table border size="small" :data="tableData">
            <el-table-column label="title" prop="title"></el-table-column>
            <el-table-column label="joinDate" prop="joinDate" width="120px">
                <template slot-scope="scope">
                    <span>{{formatTime(scope.row.joinDate)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="webSite" prop="webSite"></el-table-column>
            <el-table-column label="利用ステータス" prop="status">
                <template slot-scope="scope">
                    <span>{{getContent(scope.row.status, studs, 'id', 'text')}}</span>
                </template>
            </el-table-column>
            <el-table-column label="comapnyRoleID" prop="comapnyRoleID">
                <template slot-scope="scope">
                    <span>{{getContent(scope.row.comapnyRoleID, roles, 'id', 'title')}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100px">
                <template slot-scope="scope">
                    <i class="el-icon-view oper-icon" color="primary" @click="editHandle(scope.row, { display: 1 })"></i>
                    <i class="el-icon-edit-outline oper-icon" color="warning" @click="editHandle(scope.row)"></i>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            :current-page="page"
            @current-change="changePage"
            :total="total"
            :layout="IS_H5 ? 'prev, pager, next' : 'total, prev, pager, next, jumper'"></el-pagination>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import { mapGetters } from 'vuex';
import { formatTime } from '@_public/utils';
export default {
    components: {
        MainWrapper
    },
    data() {
        return {
            tableData: [],
            page: 1,
            pageSize: 15,
            total: 0,
            roles: [],
            studs: []
        };
    },
    computed: {
        ...mapGetters([ 'IS_H5', 'GET_LOADING' ])
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            console.log(vm);
            // vm.getStus();
            // vm.getData();
            // vm.getRole();
        });
    },
    mounted() {
        this.getStus();
        this.getRole();
        this.getData();
    },
    methods: {
        formatTime: formatTime,
        getData() {
            const loading = this.$loading({ lock: true, text: this.GET_LOADING });
            this.$axios({
                url: '/api/Company/api_getcompanylist',
                params: {
                    page: this.page,
                    pagesize: this.pageSize
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
        getRole() {
            this.$axios({
                url: '/api/Company/api_getcompanyrolelist'
            }).then(res => {
                if (res && res.code === 0) {
                    this.roles = res.data || [];
                }
            });
        },
        getStus() {
            this.$axios({
                url: '/api/Company/api_joinstatusforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.studs = res.data || [];
                }
            });
        },
        changePage(page) {
            this.page = page;
            this.getData();
        },
        newHandle() {
            this.$router.push({ 
                name: 'CompanyNew',
                params: {
                    edit: 'new'
                }
            });
        },
        editHandle(row, query = {}) {
            this.$router.push({
                name: 'CompanyEdit',
                params: {
                    id: row.id
                },
                query
            });
        },
        getContent(val, arr, key, field) {
            for (let item of arr) {
                if (item[key] === val) {
                    return item[field];
                }
            }
            return '-';
        }
    }
};
</script>

<style lang="less">
.compang-list {
    .oper-icon {
        font-size: 18px !important;
    }
}
</style>
