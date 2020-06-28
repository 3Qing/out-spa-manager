<template>
    <main-wrapper class="pre-sales-list">
        <el-form slot="header" class="main-header" size="mini" inline>
            <el-form-item>
                <el-radio-group v-model="avaiable" @change="changeHandle">
                    <el-radio :label="true">営業中</el-radio>
                    <el-radio :label="false">全部</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-button size="mini" type="primary" @click="downloadFile">リソース一覧ダウンロード</el-button>
            <el-button size="mini" type="primary" @click="showIntroDialog('add')">新規登録</el-button>
        </el-form>
        <el-table :data="tableData" size="small" :cell-class-name="cellClassName">
            <el-table-column label="氏名" fixed prop="name" width="120px"></el-table-column>
            <el-table-column label="稼働日" prop="avaiableDates" width="120px"></el-table-column>
            <!-- <el-table-column label="営業可否">
                <template slot-scope="scope">
                    <div>{{transformText(scope.row, 'avaiable')}}</div>
                </template>
            </el-table-column> -->
            <!-- <el-table-column label="営業状態" show-overflow-tooltip>
                <template slot-scope="scope">
                    <div>{{transformText(scope.row, 'status')}}</div>
                </template>
            </el-table-column> -->
            <el-table-column label="国籍" prop="nationality"></el-table-column>
            <el-table-column label="性別" prop="sex"></el-table-column>
            <el-table-column label="所属" prop="employeeType" width="100px" show-overflow-tooltip></el-table-column>
            <el-table-column label="ポジション" prop="position" width="100px" show-overflow-tooltip></el-table-column>
            <el-table-column label="モジュール" prop="mainSkill" width="100px" show-overflow-tooltip></el-table-column>
            <el-table-column label="認定資格" prop="certificates"></el-table-column>
            <el-table-column label="経験年数" prop="expYears"></el-table-column>
            <el-table-column label="日本語力" prop="jpLang" show-overflow-tooltip></el-table-column>
            <el-table-column label="英語力" prop="enLang" show-overflow-tooltip></el-table-column>
            <el-table-column label="提案単価" prop="salesPrice"></el-table-column>
            <el-table-column label="案件名" prop="curPJ" show-overflow-tooltip></el-table-column>
            <el-table-column label="顧客" prop="curPJCustomer" show-overflow-tooltip></el-table-column>
            <el-table-column label="契約終了日" prop="curPJEndDate" width="120px"></el-table-column>
            <!-- <el-table-column label="技術能力" prop="comment" show-overflow-tooltip></el-table-column>
            <el-table-column label="来日年数" prop="jpYears"></el-table-column>
            <el-table-column label="最寄駅" prop="station" show-overflow-tooltip></el-table-column>
            <el-table-column label="出張条件" prop="travel" show-overflow-tooltip></el-table-column>
            <el-table-column label="アサイン中案件">
            </el-table-column> -->
            <el-table-column label="提案文" fixed="right" width="70px">
                <template slot-scope="scope">
                    <el-popover
                        v-if="!!scope.row.proposeText"
                        placement="left"
                        title="提案文"
                        trigger="hover">
                        <pre>{{scope.row.proposeText}}</pre>
                        <i slot="reference" class="el-icon-document oper-icon"></i>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column label="アクション" fixed="right" width="80px">
                <template slot-scope="scope">
                    <el-tooltip effect="dark" content="編集" placement="top-start">
                        <i class="el-icon-edit-outline oper-icon" color="warning" @click="showIntroDialog('edit', scope.row)"></i>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="削除" placement="top-start">
                        <i class="el-icon-delete oper-icon" color="danger" @click="deletes(scope.row)"></i>
                    </el-tooltip>
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
        <intro-dialog :allStatus="allStatus"></intro-dialog>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import IntroDialog from '@components/pre-sales/intro-dialog';
import { mapGetters } from 'vuex';
import { apiDownloadFile } from '@_public/utils';
import moment from 'moment';

export default {
    components: {
        MainWrapper,
        IntroDialog
    },
    data() {
        return {
            visible: false,
            avaiable: true,
            tip: '',
            total: 0,
            page: 1,
            pageSize: 15,
            options: [{
                label: '営業中', val: true,
            }, {
                label: '全部', val: false
            }],
            tableData: [],
            allStatus: []
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getData();
            vm.getSales();
        });
    },
    computed: {
        ...mapGetters(['IS_H5'])
    },
    methods: {
        getSales() {
            this.$axios({
                url: '/api/Candidate/api_candidatestatusforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.allStatus = res.data || [];
                }
            });
        },
        changeHandle() {
            this.page = 1;
            this.getData();
        },
        getData() {
            const loading = this.$loading({ lock: true, text: '候補者リスト取得中...' });
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
                    this.tableData.forEach((item) => {
                        let differ = new Date(item.avaiableDate) - new Date();
                        let differrence = differ / (1000 * 60 * 60 * 24);
                        if (differrence <= 0) {
                            item.avaiableDates = '即日';
                        } else {
                            item.avaiableDates = item.avaiableDate;
                        }
                    });
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
                filename: `YPリソース一覧${moment(new Date().getTime()).format('MMDD')}.xlsx`
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
                let differ = new Date(row.avaiableDate) - new Date();
                let differrence = differ / (1000 * 60 * 60 * 24);
                if (differrence <= 30 && differrence > 0) {
                    return 'bg-warning';
                }
                if (differrence > 30) {
                    return 'bg-success';
                }
                if (differrence <= 0) {
                    return 'bg-danger';
                }
            } else if (columnIndex === 1) {
                let differ = new Date(row.avaiableDate) - new Date();
                let differrence = differ / (1000 * 60 * 60 * 24);
                if (differrence <= 30 && differrence > 0) {
                    return 'bg-warning';
                }
                if (differrence > 30) {
                    return 'bg-success';
                }
                if (differrence <= 0) {
                    return 'bg-danger';
                }
            }
        },
        // 删除按钮
        deletes(row) {
            this.$confirm('削除確認', '削除', {
                type: 'warning'
            }).then(() => {
                this.$axios({
                    url: '/api/Candidate/api_deletecandidate',
                    params: {
                        id: row.id
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
        transformText(row, field) {
            // if (field === 'avaiable') {
            //     switch (Number(row[field])) {
            //         case 1:
            //             return '可能';
            //         case 2:
            //             return '不可';
            //         case 3:
            //             return '要確認';
            //         default:
            //             return '';
            //     }
            // } else {
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
            // }
        },
        showIntroDialog(type, data) {
            this.$root.$emit('SHOW_INTRO_DIALOG', {
                data: type === 'add' ? null : data,
                showDate: true,
                callback: () => {
                    this.getData();
                }
            });
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
