<template>
    <main-wrapper class="qa-manager">
        <el-form slot="header" class="main-header" size="mini" inline>
            <el-form-item>
                <el-checkbox-group v-model="tag" size="mini" @change="changeHandler">
                    <el-checkbox-button v-for="(item, i) in tags" :label="item.id" :key="i">{{item.tagName}}</el-checkbox-button>
                </el-checkbox-group>
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
            <el-button type="primary" size="mini" @click="showDialog = true">标签管理</el-button>
        </el-form>
        <el-table size="mini" :data="tableData" @row-click="rowClick">
            <el-table-column label="番号" width="100px">
                <template slot-scope="scope">
                    <span>{{scope.$index + 1}}</span>
                </template>
            </el-table-column>
            <el-table-column label="質問" prop="ask1" show-overflow-tooltip></el-table-column>
            <el-table-column label="モジュール" prop="Module" show-overflow-tooltip></el-table-column>
            <el-table-column label="重要度" prop="importance" width="140px">
                <template slot-scope="scope">
                    <el-rate v-model="scope.row.importance" :max="5" disabled></el-rate>
                </template>
            </el-table-column>
            <el-table-column label="更新日" prop="updateTime" width="120px">
                <template slot-scope="scope">
                    <span>{{formatTime(scope.row.updateTime)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="180px">
                <template slot-scope="scope">
                    <el-button
                        v-if="hasUpdateAu"
                        size="mini"
                        type="primary"
                        @click="doEdit(scope.row)"
                    >編集</el-button>
                    <el-button size="mini" type="danger" @click="deleteHandler(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            :current-page="page"
            @current-change="changePage"
            :total="total"
            :layout="IS_H5 ? 'prev, pager, next' : 'total, prev, pager, next, jumper'"></el-pagination>
        <edit-dialog :allTags="tags"></edit-dialog>
        <row-dialog :form="curRow" :visible="visible" @close="visible = false"></row-dialog>
        <tag-dialog :visible="showDialog" @close="showDialog = false" @updateTag="getTags"></tag-dialog>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import EditDialog from '@components/qa-manager/edit-dialog';
import RowDialog from '@components/qa-manager/row-dialog';
import TagDialog from '@/components/qa-manager/tag-dialog';
import { mapGetters } from 'vuex';
import { formatTime } from '@_public/utils';
export default {
    components: {
        MainWrapper,
        EditDialog,
        RowDialog,
        TagDialog
    },
    data() {
        return {
            page: 1,
            pageSize: 10,
            total: 0,
            module: '',
            keyword: '',
            tags: [],
            tag: [],
            tableData: [],
            visible: false,
            showDialog: false,
            curRow: {}
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getData();
            vm.getTags();
        });
    },
    computed: {
        ...mapGetters(['ACTIONS', 'IS_H5']),
        hasUpdateAu() {
            return this.ACTIONS.includes('act_updateqa');
        },
    },
    methods: {
        formatTime: formatTime,
        getData() {
            const loading = this.$loading({ lock: true, text: 'データ取得中...' });
            this.$axios({
                method: 'POST',
                url: '/api/QA/api_getqalist',
                params: {
                    tagids: this.tag,
                    keyword: this.keyword,
                    page: this.page,
                    pagesize: this.pageSize
                },
                custom: {
                    loading,
                    vm: this
                },
                formData: true
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    const data = res.data || {};
                    this.total = data.total || 0;
                    this.tableData = data.data || [];
                } else {
                    this.$message({
                        type: 'error',
                        message: res ? res.message : 'インタフェース異常、データ取得できません！'
                    });
                }
            });
        },
        getTags() {
            this.$axios({
                url: '/api/QA/api_getqatags'
            }).then(res => {
                console.log(res);
                if (res && res.code === 0) {
                    this.tags = res.data  || [];
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
        },
        deleteHandler(row) {
            this.$confirm('是否删除', '删除', {
                type: 'warning'
            }).then(() => {
                this.$axios({
                    url: '​/api​/QA​/api_deleteqa',
                    params: {
                        qaid: row.id
                    }
                }).then(res => {
                    if (res && res.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                        this.getData();
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.message
                        });
                    }
                });
            }).catch(() => {});
        }
    }
};
</script>

<style lang="less">
.qa-manager {
    .main-header {
        .el-form-item {
            margin-left: 0 !important;
            margin-right: 20px;
        }
        .el-button {
            margin-left: 0;
            margin-right: 20px;
        }
    }
}
</style>
