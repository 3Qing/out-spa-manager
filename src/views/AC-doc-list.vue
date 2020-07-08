<template>
    <main-wrapper class="ac-doc-list">
        <el-form slot="header" class="main-header" inline>
            <el-form-item>
                <el-select placeholder="伝票タイプ" size="mini" clearable v-model="selectValue" @change="changeData">
                    <el-option v-for="(item) in selectList" :key="item.type" :label="item.text" :value="item.type"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-date-picker
                    v-model="dateValue"
                    type="daterange"
                    size="mini"
                    value-format="yyyy-MM-dd"
                    value="yyyy-MM-dd"
                    clearable
                    @change="changeData">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-input v-model="inputValue" placeholder="伝票番号" @blur="changeData" size="mini"></el-input>
            </el-form-item>
        </el-form>
        <el-row>
            <el-col :span="IS_H5 ? 24 : 8">
                <el-table size="mini" :data="tableData" @row-click="rowClick" border>
                    <el-table-column label="伝票番号" prop="docNo" width="100px"></el-table-column>
                    <el-table-column label="伝票タイプ" prop="docType" width="100px"></el-table-column>
                    <el-table-column label="転記日" prop="postingDate" width="100px"></el-table-column>
                    <el-table-column label="テキスト" prop="comment"></el-table-column>
                </el-table>
                <el-pagination
                    :current-page="page"
                    :page-size="pageSize"
                    @current-change="changePn"
                    :layout="IS_H5 ? 'prev, pager, next' : 'total, prev, pager, next, jumper'"
                    :total="total"></el-pagination>
            </el-col>
            <el-col :span="15" :offset="1" v-if="!IS_H5">
                <card-item
                    :form="form"
                    :items="items"
                    :doc-types="docTypes"
                    :ac-counts="acCounts"
                    :teams="teams"
                    :employees="employees"
                    :customs="customs"
                    :drcr="drcr"
                    @update="getData"></card-item>
            </el-col>
        </el-row>
        <el-dialog :visible.sync="visible" @close="close">
            <div>
                <card-item
                    :form="form"
                    :items="items"
                    :doc-types="docTypes"
                    :ac-counts="acCounts"
                    :teams="teams"
                    :employees="employees"
                    :customs="customs"
                    :drcr="drcr"></card-item>
            </div>
            <div slot="footer">
                <el-button type="primary" size="mini" @click="close">关闭</el-button>
            </div>
        </el-dialog>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import CardItem from '@components/ac-document/card-detail';
import mixins from '@components/ac-document/mixins';
import { mapGetters } from 'vuex';
export default {
    components: {
        MainWrapper,
        CardItem
    },
    mixins: [ mixins ],
    data() {
        return {
            selectList: [],
            selectValue: '',
            dateValue: '',
            inputValue: '',
            page: 1,
            pageSize: 15,
            total: 0,
            tableData: [],
            visible: false,
            curRow: {},
            items: []
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
        // getDetailData(id) {
        //     const loading = this.$loading({ lock: true, text: '正在获取数据' });
        //     this.$axios({
        //         url: '/api/ACDoc/api_getdocumentbyno',
        //         params: {
        //             docno: id
        //         },
        //         custom: {
        //             loading,
        //             vm: this
        //         }
        //     }).then(res => {
        //         loading.close();
        //         if (res && res.code === 0) {
        //             this.form = res.data || {};
        //             this.items = res.data.docitems || [];
        //         }
        //     });
        // },
        getSelectList() {
            const loading = this.$loading({ lock: true, text: '正在获取数据中' });
            this.$axios({
                url: '/api/ACDoc/api_doctypesforselect',
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
                url: '/api/ACDoc/api_getdocumentlist',
                params: {
                    doctype: this.selectValue,
                    fromdate: this.dateValue ? this.dateValue[0] : '',
                    todate: this.dateValue ? this.dateValue[1] : '',
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
                    const data = res.data || {};
                    this.tableData = data.data || [];
                    this.total = data.total;
                    if (this.tableData.length) {
                        this.form = this.tableData[0] || {};
                        this.items = this.tableData[0].items || [];
                        console.log(this.form, this.items);
                    }
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
            if (this.IS_H5) {
                this.visible = true;
            }
            this.tableData.forEach((item) => {
                if (row.docNo === item.docNo) {
                    this.form = item || {};
                    this.items = item.items || [];
                }
            });
        }
    }
};
</script>

<style scoped lang="less">
.ac-doc-list {
    .main-header {
        .el-date-editor, .el-input {
            margin-left:40px;
        }
        .el-date-editor {
            width: 300px;
        }
        .el-input {
            width: 200px;
        }
    }
}
</style>
