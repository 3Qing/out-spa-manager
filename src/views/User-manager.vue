<template>
    <main-wrapper>
        <div slot="header" class="main-header">
            <el-button
                size="mini"
                type="primary"
                @click="showDialog(null, 'create')"
            >新規追加</el-button>
        </div>
        <el-table size="mini" :data="tableData">
            <el-table-column label="ユーザID" prop="id"></el-table-column>
            <el-table-column label="社員番号" prop="employeeNo"></el-table-column>
            <el-table-column label="氏名" prop="name"></el-table-column>
            <el-table-column label="ロール" prop="roleTitle"></el-table-column>
            <el-table-column label="最終登録日" prop="latestLoginDate"></el-table-column>
            <el-table-column label="退社期日" prop="leaveDate"></el-table-column>
            <el-table-column label="操作" width="180px">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="primary"
                        @click="showDialog(scope.row, 'edit')"
                    >編集</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            :current-page="page"
            @current-change="changePage"
            :total="total"
            layout="total, prev, pager, next, jumper"></el-pagination>
        <edit-dialog :opt="opt" @filter="remoteMethod"></edit-dialog>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import EditDialog from '@components/user-manager/edit-dialog';
export default {
    components: {
        MainWrapper,
        EditDialog
    },
    data() {
        return {
            page: 1,
            pageSize: 10,
            total: 0,
            opt: {},
            allRole: [],
            employees: [],
            tableData: [],
            loading: false
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getEmployees();
            vm.getRoleList();
            vm.getData();
        });
    },
    provide() {
        return {
            modules: this.modules
        };
    },
    methods: {
        // 従業員
        getEmployees(keyword = '') {
            this.loading = true;
            this.$axios({
                url: '/api/Employee/api_employeesforselect',
                params: {
                    keyword
                }
            }).then(res => {
                this.loading = false;
                if (res && res.code === 0) {
                    this.$set(this.opt, 'employees', res.data || []);
                } else {
                    this.$set(this.opt, 'employees', []);
                }
            });
        },
        remoteMethod(keyword) {
            if (keyword) {
                this.getEmployees(keyword);
            }
        },
        // 获取角色列表
        getRoleList() {
            this.$axios({
                url: '/api/Role/api_getrolelist',
            }).then(res => {
                if (res && res.code === 0) {
                    this.$set(this.opt, 'allRole', res.data || []);
                } else {
                    this.$message({
                        type: 'error',
                        showClose: true,
                        message: res.message ? res.message : '接口开小差了，没有返回信息'
                    });
                }
            });
        },
        getData() {
            const loading = this.$loading({ lock: true, text: '正在获取数据中...' });
            this.$axios({
                url: '/api/User/api_getuserlist',
                params: {
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
                    this.total = data.total || 0;
                    this.tableData = data.data || [];
                } else {
                    this.$message({
                        type: 'error',
                        message: res ? res.message : '接口开小差了，没有返回信息'
                    });
                }
            });
        },
        changeHandler() {
            this.page = 1;
            this.getData();
        },
        changePage(page) {
            this.page = page;
            this.getData();
        },
        showDialog(row, type) {
            this.$root.$emit('SHOW_EDIT_DIALOG', {
                data: row,
                type: type,
                callback: () => {
                    this.getData();
                }
            });
        }
    }
};
</script>

<style scoped>

</style>
