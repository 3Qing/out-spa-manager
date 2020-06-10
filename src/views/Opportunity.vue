<template>
    <main-wrapper class="opportunity-wrapper">
        <div class="main-header" slot="header">
            <el-form slot="header" class="main-header" size="mini" inline>
                <el-form-item>
                    <el-checkbox-group v-model="tag" size="mini" @change="changeHandler">
                        <el-checkbox-button v-for="(item, i) in tags" :label="item.id" :key="i">{{item.tagName}}</el-checkbox-button>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="status" size="mini" style="margin-left: 10px;" @change="changeHandle">
                        <el-option v-for="(item, i) in opportStatus" :key="i" :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-select v-model="customersId" size="mini" style="margin-left: 10px;" @change="changeHandle">
                        <el-option v-for="(item, i) in customers" :key="i" :label="item.title" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="mini" @click="showDialog(1)">新增</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="mini" @click="showTagDialog">标签管理</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table :data="tableData" size="small" border :cell-class-name="cellClassName" @row-dblclick='showTag'>
            <el-table-column label="番号" width="100px">
                <template slot-scope="scope">
                    <span>{{scope.$index + 1}}</span>
                </template>
            </el-table-column>
            <el-table-column label="提案状态" prop="saleStatusText" width="140px">
                <template slot-scope="scope">
                    <span>{{scope.row.saleStatusText}}</span>
                </template>
            </el-table-column>
            <el-table-column label="项目地" prop="location" width="140px">
                <template slot-scope="scope">
                    <span>{{getContent(scope.row.location, adressArr)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="标题" prop="title" show-overflow-tooltip></el-table-column>
            <!-- <el-table-column label="内容" prop="content" show-overflow-tooltip></el-table-column> -->
            <el-table-column label="发布日期" prop="pubDate" width="140px">
                <template slot-scope="scope">
                    <span>{{formatTime(scope.row.pubDate)}}</span>
                </template>
            </el-table-column>
            <!-- <el-table-column label="关闭日期" prop="closeDate" width="140px">
                <template slot-scope="scope">
                    <span>{{formatTime(scope.row.closeDate)}}</span>
                </template>
            </el-table-column> -->
            <el-table-column label="客户姓名" width="140px" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{(scope.row.customerID > 0 ? scope.row.formalCustomer : scope.row.temporaryCustomer) || '-'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="提案次数" width="120px">
                <template slot-scope="scope">
                    <span>{{scope.row.salesCaseCnt}}</span>
                    <!-- <el-tooltip class="leftTip" effect="dark" content="提案履歴" placement="top-start" v-if='scope.row.salesCaseCnt > 0'>
                        <i class="icon-KHCFDC_chakanlishibanben iconfont oper-icon" color="success" @click="handleTip(scope.row)"></i>
                    </el-tooltip> -->
                </template>  
            </el-table-column>
            <el-table-column label="营业担当" prop="salesPerson" width="120px"></el-table-column>
            <el-table-column label="操作" width="70px">
                <template slot-scope="scope">
                    <!-- <el-tooltip effect="dark" content="提案" placement="top-start">
                        <i class="icon-applypeople iconfont oper-icon" color="success" @click="handleAction(scope.row)"></i>
                    </el-tooltip> -->
                    <el-tooltip effect="dark" content="编辑" placement="top-start">
                        <i class="el-icon-edit-outline oper-icon" color="warning" @click="showDialog(2, scope.row)"></i>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="删除" placement="top-start">
                        <i class="el-icon-delete oper-icon" color="danger" @click="deleteHandler(scope)"></i>
                    </el-tooltip>
                </template>
                <!-- <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleAction(scope.row)">提案</el-button>
                    <el-button type="warning" size="mini" @click="showDialog(2, scope.row)">编辑</el-button>
                    <el-button type="danger" size="mini" @click="deleteHandler(scope)">删除</el-button>
                </template> -->
            </el-table-column>
        </el-table>
        <el-pagination
            :current-page="page"
            :page-size="pageSize"
            @current-change="changePn"
            :layout="IS_H5 ? 'prev, pager, next' : 'total, prev, pager, next, jumper'"
            :total="total"></el-pagination>
        <opport-dialog :allStatus="opportStatus" :jobsLists="jobsList"></opport-dialog>
        <tag-dialog :visible="visibleDialog" @close="visibleDialog = false" @updateTag="getTags"></tag-dialog>
        <apply-dialog
            :visible="showApply"
            :data="curData"
            @close="showApply = false"
            @update="getData"></apply-dialog>
        <tian-dialog
            :visible="tianApply"
            :data="tianArr"
            :opport="oppStatus"
            :deletetrues="deletetrue"
            @close="tianApply = false"
            @update="getData"></tian-dialog>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import { mapGetters } from 'vuex';
import { formatTime } from '@_public/utils';
import OpportDialog from '@components/opportunity/dialog';
import TagDialog from '@/components/opportunity/tag-dialog';
import ApplyDialog from '@components/opportunity/apply-dialog';
import TianDialog from '@components/opportunity/tian-dialog';
export default {
    components: {
        MainWrapper,
        OpportDialog,
        TagDialog,
        ApplyDialog,
        TianDialog
    },
    data() {
        return {
            customersId: 0,
            page: 1,
            pageSize: 15,
            total: 0,
            tableData: [],
            tag: [],
            tags: [],
            customers: [],
            status: 0,
            deletetrue: false,
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
            tianArr: [],
            opportStatus: [],
            oppStatus: [],
            showApply: false,
            tianApply: false,
            adressArr: [],
            jobsList: [] // 营业担当
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getAdress();
            vm.getOpportStatus();
            vm.getTags();
            vm.getStatus();
            vm.getCustomer();
            vm.getData();
            vm.getJobsList();
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
        changeHandler() {
            this.page = 1;
            this.getData();
        },
        // 获取营业担当
        getJobsList() {
            this.$axios({
                url: '/api/Employee/api_salespersonforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.jobsList = res.data || [];
                    console.log(res.data);
                }
            });
        },
        // 获取地址函数
        getAdress() {
            this.$axios({
                url: '/api/Candidate/api_cityforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.adressArr = res.data || [];
                }
            });
        },
        // 获取字段函数
        getContent(id, arr) {
            for (let item of arr) {
                if (item.id === id) {
                    return item.text;
                }
            }
            return '-';
        },
        // 列表颜色
        cellClassName({ row, columnIndex }) {
            if (columnIndex === 1) {
                if (row.saleStatus === 0) {
                    return 'bg-danger';
                }
                if (row.saleStatus === 1) {
                    return 'bg-warning';
                }
                if (row.saleStatus === 2) {
                    return 'bg-info';
                }
                if (row.saleStatus === 3 || row.saleStatus === 4) {
                    return 'bg-success';
                }
            }
        },
        getData() {
            // customersId
            let params = {
                tagids: this.tag,
                status: this.status,
                page: this.page,
                pagesize:  this.pageSize,
                customerid: this.customersId
            };
            const loading = this.$loading({ lock: true, text: '正在获取数据中' });
            this.$axios({
                method: 'POST',
                url: '/api/Opportunity/api_getopportunitylist',
                params,
                custom: {
                    loading,
                    vm: this
                },
                formData: true
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    const data = res.data || {};
                    this.tableData = data.list || [];
                    console.log('tableData', data.list);
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
        getStatus() {
            this.$axios({
                url: '/api/SalesCase/api_salescasestatusforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.oppStatus = res.data || [];
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
                    console.log(res.data);
                }
            });
        },
        changeHandle() {
            this.page = 1;
            this.getData();
        },
        // 双击列表显示
        showTag(row) {
            this.$root.$emit('SHOW_OPPORT_DIALOG', {
                data: row,
                tags: this.tags,
                customers: this.customers,
                callback: () => {
                    this.getData();
                }
            });
        },
        showDialog(type, row) {
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
        },
        // 提案历史
        handleTip(data) {
            this.$axios({
                url: '/api/Opportunity/api_getapplyhistorybyoppo',
                params: {
                    oppoid: data.id
                }
            }).then(res => {
                if (res && res.code === 0) {
                    this.tianApply = true;
                    this.tianArr = res.data;
                }
            });
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
    .leftTip{
        margin-left: 15px;
        position: relative;
        top: 2px;
    }
    td.bg-danger {
        color: #fff;
        background-color: rgba(219, 65, 78, 0.78) !important;
    }
    td.bg-success {
        color: #fff;
        background-color: rgba(69, 190, 135, 0.78) !important;
    }
    td.bg-warning {
        color: #fff;
        background-color: rgba(230, 162, 60, 0.78) !important;
    }
    td.bg-info {
        color: #fff;
        background-color: #438fc5 !important;
    }
}
</style>
