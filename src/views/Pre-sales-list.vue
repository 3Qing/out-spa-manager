<template>
    <main-wrapper class="pre-sales-list">
        <el-form slot="header" class="main-header" size="mini" inline>
            <el-form-item>
                <el-radio-group v-model="avaiable" @change="changeHandle">
                    <el-radio :label="true">营业中</el-radio>
                    <el-radio :label="false">全部</el-radio>
                </el-radio-group>
                <!-- <el-select v-model="avaiable" @change="getData">
                    <el-option v-for="item in options" :key="item.val" :label="item.label" :value="item.val"></el-option>
                </el-select> -->
            </el-form-item>
            <el-button size="mini" type="primary" @click="downloadFile">リソース一覧ダウンロード</el-button>
        </el-form>
        <el-table :data="tableData" size="small" :cell-class-name="cellClassName">
            <el-table-column label="営業可否">
                <template slot-scope="scope">
                    <div>{{transformText(scope.row, 'avaiable')}}</div>
                </template>
            </el-table-column>
            <el-table-column label="入場可能日" prop="avaiableDate" width="120px"></el-table-column>
            <el-table-column label="営業状態" show-overflow-tooltip>
                <template slot-scope="scope">
                    <div>{{transformText(scope.row, 'status')}}</div>
                </template>
            </el-table-column>
            <el-table-column label="氏名" prop="name"></el-table-column>
            <el-table-column label="国籍" prop="nationality"></el-table-column>
            <el-table-column label="性別" prop="sex"></el-table-column>
            <el-table-column label="所属" prop="employeeType" width="100px" show-overflow-tooltip></el-table-column>
            <el-table-column label="ポジション" prop="position" width="100px" show-overflow-tooltip></el-table-column>
            <el-table-column label="モジュール" prop="mainSkill" width="100px" show-overflow-tooltip></el-table-column>
            <el-table-column label="技術能力" prop="comment" show-overflow-tooltip></el-table-column>
            <el-table-column label="認定資格" prop="certificates"></el-table-column>
            <el-table-column label="SAP経験年数" prop="expYears"></el-table-column>
            <el-table-column label="来日年数" prop="jpYears"></el-table-column>
            <el-table-column label="日本語" prop="jpLang" show-overflow-tooltip></el-table-column>
            <el-table-column label="英語" prop="enLang" show-overflow-tooltip></el-table-column>
            <el-table-column label="単価" prop="salesPrice"></el-table-column>
            <el-table-column label="最寄駅" prop="station" show-overflow-tooltip></el-table-column>
            <el-table-column label="出張条件" prop="travel" show-overflow-tooltip></el-table-column>
            <el-table-column label="アサイン中案件">
                <el-table-column label="案件名" prop="curPJ" show-overflow-tooltip></el-table-column>
                <el-table-column label="顧客" prop="curPJCustomer" show-overflow-tooltip></el-table-column>
                <el-table-column label="契約終了日" prop="curPJEndDate" width="120px"></el-table-column>
            </el-table-column>
            <el-table-column label="提案文" width="70px">
                <template slot-scope="scope">
                    <el-popover
                        v-if="!!scope.row.proposeText"
                        placement="left"
                        title="提案文"
                        trigger="hover">
                        <pre>{{scope.row.proposeText}}</pre>
                        <i slot="reference" class="el-icon-document"></i>
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            :current-page="page"
            :page-size="pageSize"
            @current-change="changePn"
            :layout="IS_H5 ? 'prev, pager, next' : 'total, prev, pager, next, jumper'"
            :total="total"></el-pagination>
        <el-dialog
            :visible.sync="visible"
            custom-class="download-dialog"
            :show-close="false"
            width="200px">
            <div class="tip-block">{{tip}}</div>
            <el-button type="primary" @click="downloadFile">下载既存リソース一覧</el-button>
            <el-button type="primary" @click="createExcel">リソース一覧再作成してからダウンロード</el-button>
        </el-dialog>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import { mapGetters } from 'vuex';
import { apiDownloadFile } from '@_public/utils';

export default {
    components: {
        MainWrapper
    },
    data() {
        return {
            visible: false,
            avaiable: true,
            tip: '',
            total: 0,
            page: 1,
            pageSize: 20,
            options: [{
                label: '营业中', val: true,
            }, {
                label: '全部', val: false
            }],
            tableData: []
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getData();
        });
    },
    computed: {
        ...mapGetters(['IS_H5'])
    },
    methods: {
        changeHandle() {
            this.page = 1;
            this.getData();
        },
        getData() {
            const loading = this.$loading({ lock: true, text: '正在获取候选人清单数据' });
            this.$axios({
                url: '/api/Candidate/api_getcandidatelist',
                params: {
                    avaiable: this.avaiable,
                    page: this.page,
                    pagesize: this.pageSize
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    const data = res.data || {};
                    this.tableData = data.data || [];
                    this.total = data.total;
                }
            });
        },
        changePn(page) {
            this.page = page;
            this.getData();
        },
        async beforeDownload() {
            const listRes = await this.$axios({
                url: '/api/getexistproposelist'
            });
            if (listRes && listRes.code === 0) {
                this.tip = listRes.message;
                this.visible = true;
            } else if (listRes.code === 4) {
                const creRes = await this.$axios({
                    url: '/api/createproposelistexcel'
                });
                if (creRes && creRes.code === 0) {
                    this.downloadFile();
                } else {
                    this.$message({
                        type: 'error',
                        showClose: true,
                        message: creRes.message || '接口开小差了，没有返回信息'
                    });
                }
            } else {
                this.$message({
                    type: 'error',
                    showClose: true,
                    message: listRes.message || '接口开小差了，没有返回信息'
                });
            }
        },
        downloadFile() {
            apiDownloadFile({
                vm: this,
                url: `/api/Candidate/api_downloadcandidatelistexcel?insale=${this.avaiable}`,
                filename: `${Date.now()}.xls`
            });
            this.visible = false;
        },
        createExcel() {
            this.$axios({
                url: '/api/createproposelistexcel'
            }).then(res => {
                if (res && res.code === 0) {
                    this.downloadFile();
                } else {
                    this.$message({
                        type: 'error',
                        showClose: true,
                        message: res.message || '接口开小差了，没有返回信息'
                    });
                }
            });
        },
        cellClassName({ row, columnIndex }) {
            if (columnIndex === 0) {
                switch (Number(row.avaiable)) {
                    case 1:
                        return 'bg-success';
                    case 2:
                        return 'bg-info';
                    case 3:
                        return 'bg-warning';
                    default:
                        return '';
                }
            } else if (columnIndex === 2) {
                if (!this.avaiable) {
                    switch (Number(row.status)) {
                        case 1:
                            return 'bg-success';
                        case 2:
                        case 4:
                            return 'bg-warning';
                        case 3:
                            return 'bg-danger';
                        default:
                            return '';
                    }
                }
            }
        },
        transformText(row, field) {
            if (field === 'avaiable') {
                switch (Number(row[field])) {
                    case 1:
                        return '可能';
                    case 2:
                        return '不可';
                    case 3:
                        return '要確認';
                    default:
                        return '';
                }
            } else {
                if (this.avaiable) {
                    switch (Number(row[field])) {
                        case 1:
                            return '営業開始';
                        case 2:
                            return '提案のみ';
                        case 3:
                            return '並行面談中';
                        case 4:
                            return '取消';
                        case 5:
                            return '失敗終了';
                        case 6:
                            return '成功終了';
                        default:
                            return '';
                    }
                } else {
                    switch (Number(row[field])) {
                        case 1:
                            return '稼働中';
                        case 2:
                            return '間もなく待機';
                        case 3:
                            return '待機中';
                        case 4:
                            return '営業中';
                        default:
                            return '';
                    }
                }
            }
        }
    }
};
</script>

<style lang="less">
.pre-sales-list {
    .main-header {
        .el-button {
            margin-left: 50px;
        }
    }
    .el-table {
        .el-icon-document {
            font-size: 16px;
            cursor: pointer;
            color: #1473B7;
        }
        .bg-danger td {
            .el-icon-document {
                color: #fff;
            }
            color: #fff;
            background-color: rgba(219, 65, 78, 0.78) !important;
        }
        .bg-success td {
            .el-icon-document {
                color: #fff;
            }
            color: #fff;
            background-color: rgba(69, 190, 135, 0.78) !important;
        }
        .bg-warning td {
            .el-icon-document {
                color: #fff;
            }
            color: #fff;
            background-color: rgba(230, 162, 60, 0.78) !important;
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
            background-color: rgba(144, 147, 153, 0.78) !important;
        }
    }
    .download-dialog {
        .el-dialog__header {
            display: none;
        }
        .el-dialog__body {
            text-align: center;
            .tip-block {
                margin-bottom: 20px;
            }
            .el-button {
                padding: 0;
                width: 120px;
                height: 80px;
                vertical-align: top;
                & + .el-button {
                    margin-left: 20px;
                }
                span {
                    display: block;
                    width: 100%;
                    white-space: normal;
                }
            }
        }
    }
    .el-pagination {
        margin-top: 20px;
        text-align: center;
    }
}
</style>
