<template>
    <main-wrapper class="opportunity-wrapper">
        <div class="main-header" slot="header">
            <el-select v-model="status" size="mini" style="margin-left: 10px;" @change="changeHandle">
                <el-option v-for="(item, i) in allStatus" :key="i" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-button type="primary" size="mini" @click="showDialog(1)">新增</el-button>
            <el-button type="primary" size="mini" @click="showTagDialog">标签管理</el-button>
        </div>
        <el-table :data="tableData" size="small" border>
            <el-table-column label="标题" prop="title" show-overflow-tooltip></el-table-column>
            <el-table-column label="内容" prop="content" show-overflow-tooltip></el-table-column>
            <el-table-column label="发布日期" prop="pubDate" width="140px">
                <template slot-scope="scope">
                    <span>{{formatTime(scope.row.pubDate)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="关闭日期" prop="closeDate" width="140px">
                <template slot-scope="scope">
                    <span>{{formatTime(scope.row.closeDate)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="客户姓名" width="140px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{(scope.row.customerID > 0 ? scope.row.formalCustomer : scope.row.temporaryCustomer) || '-'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="提案次数" prop="salesCaseCnt" width="120px"></el-table-column>
            <el-table-column label="营业担当" prop="salesPerson" width="120px"></el-table-column>
            <el-table-column label="操作" width="260px">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleAction(scope.row)">提案</el-button>
                    <el-button type="warning" size="mini" @click="showDialog(2, scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" @click="deleteHandler(scope)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            :current-page="page"
            :page-size="pageSize"
            @current-change="changePn"
            :layout="IS_H5 ? 'prev, pager, next' : 'total, prev, pager, next, jumper'"
            :total="total"></el-pagination>
        <opport-dialog :allStatus="opportStatus"></opport-dialog>
        <tag-dialog :visible="visibleDialog" @close="visibleDialog = false" @updateTag="getTags"></tag-dialog>
        <apply-dialog
            :visible="showApply"
            :data="curData"
            @close="showApply = false"
            @update="getData"></apply-dialog>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import { mapGetters } from 'vuex';
import { formatTime } from '@_public/utils';
import OpportDialog from '@components/opportunity/dialog';
import TagDialog from '@/components/opportunity/tag-dialog';
import ApplyDialog from '@components/opportunity/apply-dialog';
export default {
    components: {
        MainWrapper,
        OpportDialog,
        TagDialog,
        ApplyDialog
    },
    data() {
        return {
            page: 1,
            pageSize: 10,
            total: 0,
            tableData: [],
            tags: [],
            customers: [],
            status: 0,
            allStatus: [{
                label: '进行中', value: 0
            }, {
                label: '成功', value: 1
            }, {
                label: '终止', value: 2
            }, {
                label: '取消', value: 3
            }],
            visibleDialog: false,
            curData: {},
            opportStatus: [],
            showApply: false
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getData();
            vm.getTags();
            vm.getCustomer();
            vm.getOpportStatus();
        });
    },
    computed: {
        ...mapGetters(['IS_H5'])
    },
    methods: {
        formatTime: formatTime,
        changePn(page) {
            this.page = page;
            this.getData();
        },
        getData() {
            const loading = this.$loading({ lock: true, text: '正在获取数据中' });
            this.$axios({
                url: '/api/Opportunity/api_getopportunitylist',
                params: {
                    status: this.status,
                    page: this.page,
                    pagesize:  this.pageSize
                },
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    const data = res.data || {};
                    this.tableData = data.oppolist || [];
                    this.total = data.total || 0;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.message ? res.message : '接口开小差了，没有返回信息'
                    });
                }
            });
        },
        getOpportStatus() {
            this.$axios({
                url: '/api/Opportunity/api_opportunitystatusforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.opportStatus = res.data || [];
                }
            });
        },
        getTags() {
            this.$axios({
                url: '/api/Opportunity/api_getopportunitytaglist'
            }).then(res => {
                if (res && res.code === 0) {
                    this.tags = res.data || [];
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
        changeHandle() {
            this.page = 1;
            this.getData();
        },
        showDialog(type, row) {
            console.log(row);
            this.$root.$emit('SHOW_OPPORT_DIALOG', {
                data: type === 2 ? row : null,
                tags: this.tags,
                customers: this.customers,
                callback: () => {
                    this.getData();
                }
            });
        },
        deleteHandler(scope) {
            this.$confirm('是否删除', '删除', {
                type: 'warning'
            }).then(() => {
                this.$axios({
                    url: '/api/Opportunity/api_deleteopportunity',
                    params: {
                        id: scope.row.id
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
                            type: 'warning',
                            message: res.message
                        });
                    }
                });
            }).catch(() => {});
        },
        showTagDialog() {
            this.visibleDialog = true;
        },
        handleAction(data) {
            this.showApply = true;
            this.curData = { ...data };
        }
    }
};
</script>

<style lang="less">
.opportunity-wrapper {
    .main-header {
        .el-button {
            margin-left: 10px;
        }
    }
}
</style>
