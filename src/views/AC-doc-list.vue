<template>
    <main-wrapper class="ac-doc-list">
        <el-form slot="header" class="main-header" inline>
            <el-form-item>
                <el-select placeholder="伝票タイプ" size="mini" clearable v-model="selectValue" @change="changeData">
                    <el-option v-for="(item) in selectList" :key="item.Type" :label="item.Text" :value="item.Type"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-date-picker
                    v-model="dateValue"
                    type="date-range"
                    size="mini"
                    value-format="yyyyMM"
                    value="yyyyMM"
                    :clearable="false"
                    @change="changeData">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-input v-model="inputValue" placeholder="伝票番号" @blur="changeData" size="mini"></el-input>
            </el-form-item>
        </el-form>
        <el-table size="mini" :data="tableData" @row-click="rowClick">
            <el-table-column label="伝票番号" prop="DocNo"></el-table-column>
            <el-table-column label="伝票タイプ" prop="DocType"></el-table-column>
            <el-table-column label="転記日" prop="PostingDate"></el-table-column>
            <el-table-column label="テキスト" prop="Comment"></el-table-column>
        </el-table>
        <el-pagination
            :current-page="page"
            :page-size="pageSize"
            @current-change="changePn"
            :layout="IS_H5 ? 'prev, pager, next' : 'total, prev, pager, next, jumper'"
            :total="total"></el-pagination>
        <el-dialog :visible.sync="visible" @close="close">
            <div>凭证显示</div>
            <div>
                <el-button type="primary" size="mini" @click="close">确认</el-button>
            </div>
        </el-dialog>
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
            selectList: [],
            selectValue: '',
            dateValue: '',
            inputValue: '',
            page: 1,
            pageSize: 10,
            total: 0,
            tableData: [],
            visible: false,
            curRow: {}
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getData();
            vm.getSelectList();
        });
    },
    computed: {
        ...mapGetters(['IS_H5'])
    },
    methods: {
        getSelectList() {
            const loading = this.$loading({ lock: true, text: '正在获取数据中' });
            this.$axios({
                url: '/api/doctypesforselect',
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.selectList = res.data || [];
                } else {
                    this.selectList = [];
                }
            });

        },
        getData() {
            const loading = this.$loading({ lock: true, text: '正在获取数据中' });
            this.$axios({
                url: '/api/getdocumentlist',
                params: {
                    doctype: this.selectValue,
                    fromdate: this.dateValue.length > 1 ? this.dateValue[0] : '',
                    todate: this.dateValue.length > 1 ? this.dateValue[1] : '',
                    docno: this.inputValue,
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
        changeData() {
            this.page = 1;
            this.getData();
        },
        close() {
            this.visible = false;
        },
        rowClick(row) {
            this.curRow = { ...row };
            this.visible = true;
        }
    }
};
</script>

<style scoped lang="less">
.ac-doc-list {
    .main-header {
        .el-date-editor, .el-input{
            margin-left:40px;
        }
        .el-input{
            width: 200px;
        }
    }
}
</style>
