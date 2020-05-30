<template>
    <el-dialog title="员工清单" custom-class="employee-dialog" :visible.sync="visible" @close="close">
        <!-- <el-table :data="tableData" size="small" @cell-click="rowClickHandler">
            <el-table-column label="员工号" prop="EmpeeID"></el-table-column>
            <el-table-column label="姓名" prop="EmpeeName"></el-table-column>
            <el-table-column label="岗位" prop="Position"></el-table-column>
            <el-table-column label="预计Avaiable日期" prop="AvaiableDate" width="140px"></el-table-column>
            <el-table-column label="销售价格" prop="SalesPrice" show-overflow-tooltip></el-table-column>
        </el-table>
        <el-pagination
            :page-size="pageSize"
            :current-page="page"
            @current-change="changePage"
            :layout="IS_H5 ? 'prev, pager, next' : 'total, prev, pager, next, jumper'"
            :total="total"
            ></el-pagination> -->
        <el-form>
            <el-form-item label="姓(拼音)">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="名(拼音)">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="姓(汉字)">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="名(汉字)">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="就职类型">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="生日">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="国籍">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="常住城市">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="性别">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="开始营业日期">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="入场可能日">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="提案文">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    data() {
        return {
            visible: false,
            page: 1,
            pageSize: 15,
            total: 0,
            tableData: []
        };
    },
    computed: {
        ...mapGetters(['IS_H5'])
    },
    mounted() {
        this.$root.$off('SHOW_EMPLOYEE_DAILOG');
        this.$root.$on('SHOW_EMPLOYEE_DAILOG', ({ data = null, callback = null }) => {
            this.getEmployeeData(data);
            this.callback = callback;
            this.visible = true;
        });
    },
    methods: {
        getEmployeeData() {
            this.$axios({
                url: '/api/unavaiableemployeelist',
                params: {
                    name: '',
                    page: this.page,
                    pagesize: this.pageSize
                }
            }).then(res => {
                if (res && res.code === 0) {
                    this.tableData = res.data || [];
                    this.total = res.total;
                } else {
                    this.total = 0;
                    this.tableData = [];
                }
            });
        },
        close() {
            this.callback && this.callback();
            this.visible = false;
        },
        changePage(page) {
            this.page = page;
            this.getEmployeeData();
        },
        rowClickHandler(row) {
            this.$root.$emit('SHOW_INTRO_DIALOG', {
                data: row || {},
                callback: () => {
                    this.close();
                }
            });
        }
    }
};
</script>

<style lang="less">
.employee-dialog {
    .el-dialog__body {
        padding-top: 10px;
        .el-pagination {
            text-align: center;
            margin-top: 20px;
        }
    }
}
</style>
