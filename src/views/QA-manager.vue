<template>
    <main-wrapper class="qa-manager">
        <el-form slot="header" class="main-header" size="mini" inline>
            <el-form-item>
                <el-select v-model="module" @change="changeHandler" clearable>
                    <el-option v-for="item in modules" :key="item" :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="margin-left: 20px;">
                <el-input v-model="keyword" placeholder="请输入关键词" maxlength="10" @blur="changeHandler"></el-input>
            </el-form-item>
            <el-button
                v-if="hasUpdateAu"
                size="mini"
                type="primary"
                @click="doCreate"
            >新規追加</el-button>
        </el-form>
        <el-table size="mini" :data="tableData" @row-click="rowClick">
            <el-table-column label="番号" prop="No"></el-table-column>
            <el-table-column label="質問" prop="Ask1" show-overflow-tooltip></el-table-column>
            <el-table-column label="モジュール" prop="Module"></el-table-column>
            <el-table-column label="重要度" prop="Importance"></el-table-column>
            <el-table-column label="更新日" prop="UpdateDate"></el-table-column>
            <el-table-column label="操作" width="180px">
                <template slot-scope="scope">
                    <el-button
                        v-if="hasUpdateAu"
                        size="mini"
                        type="primary"
                        @click="doEdit(scope.row)"
                    >編集</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            :current-page="page"
            @current-change="changePage"
            :total="total"
            layout="total, prev, pager, next, jumper"></el-pagination>
        <edit-dialog></edit-dialog>
        <row-dialog :form="curRow" :visible="visible" @close="visible = false"></row-dialog>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import EditDialog from '@components/qa-manager/edit-dialog';
import RowDialog from '@components/qa-manager/row-dialog';
import { mapGetters } from 'vuex';
export default {
    components: {
        MainWrapper,
        EditDialog,
        RowDialog
    },
    data() {
        return {
            page: 1,
            pageSize: 10,
            total: 0,
            module: '',
            keyword: '',
            modules: ['FI', 'CO', 'ABAP', 'MM', 'SD', 'Fiori', 'データ移行'],
            tableData: [],
            visible: false,
            curRow: {}
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getData();
        });
    },
    computed: {
        ...mapGetters(['ACTIONS']),
        hasUpdateAu() {
            return this.ACTIONS.includes('act_updateqa');
        },
    },
    provide() {
        return {
            modules: this.modules
        };
    },
    methods: {
        getData() {
            const loading = this.$loading({ lock: true, text: 'データ取得中...' });
            this.$axios({
                url: '/api/getqalist',
                params: {
                    module: this.module,
                    keyword: this.keyword,
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
                        message: res ? res.message : 'インタフェース異常、データ取得できません！'
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
        doEdit(row) {
            this.$root.$emit('SHOW_EDIT_DIALOG', {
                data: row,
                callback: () => {
                    this.getData();
                }
            });
        },
        doCreate() {
            this.$root.$emit('SHOW_EDIT_DIALOG', {
                data: null,
                callback: () => {
                    this.getData();
                }
            });
        },
        rowClick(row, column) {
            if (column.label !== '操作') {
                this.curRow = { ...row };
                this.visible = true;
            }
        }
    }
};
</script>

<style lang="less">
.qa-manager {
    .main-header {
        .el-button {
            margin-left: 20px;
        }
    }
}
</style>