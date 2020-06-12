<template>
    <main-wrapper class="estimation-list-wrapper">
        <div slot="header" class="main-header">
            <el-select v-model="customerid" size="mini" @change="handleChange" clearable>
                <el-option v-for="item in customers" :key="item.id" :label="item.title" :value="item.id"></el-option>
            </el-select>
            <el-button type="primary" size="mini" @click="handleEdit({id: 'new'})">新規登録</el-button>
        </div>
        <el-table :data="tableData" size="small" border>
            <el-table-column label="No" prop="estimationNo" width="130px"></el-table-column>
            <el-table-column label="得意先名称" prop="customerTitle"></el-table-column>
            <el-table-column label="商機（案件）名" prop="title" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.title || '-'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="期间" width="200px">
                <template slot-scope="scope">
                    <span>{{formatTime(scope.row.fromDate)}} ~ {{formatTime(scope.row.toDate)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="担当者" prop="salesPerson" width="100px"></el-table-column>
            <el-table-column label="作成日付" prop="pubDate" width="100px">
                <template slot-scope="scope">
                    <span>{{formatTime(scope.row.pubDate)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="下载" width="120px">
                <template slot-scope="scope">
                    <i class="iconfont icon-chengyi_pc_preview oper-icon" color="primary" @click="previewHandle(scope)"></i>
                    <i class="icon-PDF iconfont oper-icon" color="danger" @click="downloadFile(scope.row, 0, 'pdf')"></i>
                    <i class="icon-Excel iconfont oper-icon" color="success" @click="downloadFile(scope.row, 1, 'xlsx')"></i>
                </template>
            </el-table-column>
            <el-table-column label="アクション" width="120px" fixed="right">
                <template slot-scope="scope">
                    <el-tooltip effect="dark" content="编辑" placement="top-start">
                        <i class="el-icon-edit-outline oper-icon" color="warning" @click="handleEdit(scope.row)"></i>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="删除" placement="top-start">
                        <i class="el-icon-delete oper-icon" color="danger" @click="handleDel(scope)"></i>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="拷贝" placement="top-start">
                        <i class="el-icon-document-copy oper-icon" color="success" @click="handleCopy(scope)"></i>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            :page-size="pageSize"
            :current-page="page"
            @current-change="changePage"
            :layout="IS_H5 ? 'prev, pager, next' : 'total, prev, pager, next, jumper'"
            :total="total"></el-pagination>
        <big-picture></big-picture>
        <el-dialog custom-class="update-dialog" :visible.sync="visible" @close="close">
            <div>拷贝报价单</div>
            <el-date-picker
                size="mini"
                v-model="datetime"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="yyyy-MM-dd"
                value="yyyy-MM-dd"></el-date-picker>
            <div>
                <el-button type="primary" size="mini" @click="submitCopy">拷贝</el-button>
            </div>
        </el-dialog>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import BigPicture from '@components/big-picture';
import { mapGetters } from 'vuex';
import { formatTime, apiDownloadFile, imageFileToPreview } from '@_public/utils';
export default {
    components: {
        MainWrapper,
        BigPicture
    },
    data() {
        return {
            tableData: [],
            page: 1,
            pageSize: 10,
            customerid: '',
            customers: [],
            total: 0,
            visible: false,
            datetime: null,
            curData: {}
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getData();
            vm.getCustomer();
        });
    },
    computed: {
        ...mapGetters(['IS_H5'])
    },
    methods: {
        formatTime: formatTime,
        getData() {
            const loading = this.$loading({ lock: true, text: 'データ取得中...' });
            this.$axios({
                url: '/api/Estimation/api_getestimationlist',
                params: {
                    page: this.page,
                    pagesize: this.pageSize,
                    customerid: this.customerid
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    console.log(res.data);
                    const data = res.data || {};
                    this.tableData = data.data || [];
                    this.total = data.total || 0;
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
        changePage(page) {
            this.page = page;
            this.getData();
        },
        handleEdit(row) {
            this.$router.push({
                name: 'Estimation',
                params: {
                    id: row.id || 'new'
                }
            });
        },
        handleChange() {
            this.page = 1;
            this.getData();
        },
        downloadFile(row, type, ext) {
            console.log(row);
            apiDownloadFile({
                vm: this,
                url: `/api/Estimation/api_downloadestimation?id=${row.id}&filetype=${type}`,
                filename: `${row.customerTitle}${row.estimationNo}.${ext}`
            });
        },
        handleDel(scope) {
            this.$confirm('是否删除', '删除', {
                type: 'warning'
            }).then(() => {
                this.$axios({
                    url: '/api/Estimation/api_deleteestimation',
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
                            type: 'error',
                            message: res.message
                        });
                    }
                });
            }).catch(() => {});
        },
        // 预览
        previewHandle(scope) {
            imageFileToPreview({
                vm: this,
                url: '/api/Estimation/api_previewestimationfile',
                params: {
                    id: scope.row.id
                }
            });
        },
        close() {
            this.visible = false;
            this.datetime = null;
        },
        handleCopy(scope) {
            this.visible = true;
            this.curData = scope.row;
        },
        submitCopy() {
            if (!this.datetime) {
                this.$message({
                    type: 'warning',
                    message: '请选择时间'
                });
                return;
            }
            this.$axios({
                url: '/api/Estimation/api_simulateestimation',
                params: {
                    id: this.curData.id,
                    fromdate: this.datetime[0],
                    todate: this.datetime[1]
                }
            }).then(res => {
                if (res && res.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '拷贝成功'
                    });
                    this.getData();
                } else {
                    this.$message({
                        type: 'error',
                        message: res.message
                    });
                }
            });
        }
    }
};
</script>

<style lang="less">
.estimation-list-wrapper {
    .main-header {
        .el-button {
            margin-left: 10px;
        }
    }
    .link {
        font-size: 16px;
        & + .link {
            margin-left: 15px;
        }
    }
    .oper-icon {
        font-size: 20px !important;
    }
}
</style>
