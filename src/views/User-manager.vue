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
            <el-table-column label="ユーザID" prop="ID"></el-table-column>
            <el-table-column label="社員番号" prop="EmpeeID"></el-table-column>
            <el-table-column label="氏名" prop="Name"></el-table-column>
            <el-table-column label="ロール" prop="RoleTitle"></el-table-column>
            <el-table-column label="最終登録日" prop="LatestLoginDate"></el-table-column>
            <el-table-column label="退社期日" prop="LeaveDate"></el-table-column>
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
        <edit-dialog :opt="opt"></edit-dialog>
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
            tableData: []
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
        getEmployees() {
            this.$axios({
                url: '/api/employeesforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.$set(this.opt, 'employees', res.data || []);
                } else {
                    this.$set(this.opt, 'employees', []);
                }
            });
        },
        // 获取角色列表
        getRoleList() {
            this.$axios({
                url: '/api/getrolelist',
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
                url: '/api/getuserlist',
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
                    this.total = res.total || 0;
                    this.tableData = res.data || [];
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
