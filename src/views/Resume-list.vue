<template>
    <main-wrapper class="resume-list">
        <el-table size="mini" stripe :data="tableData">
            <el-table-column label="社員番号" prop="employeeNo" width="140px"></el-table-column>
            <el-table-column label="氏名" prop="name"></el-table-column>
            <el-table-column label="就職タイプ" prop="recruitType"></el-table-column>
            <el-table-column label="履歴書更新" prop="resumeID" width="120px">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="primary"
                        @click="toUpdate(scope.row)"
                        >{{Number(scope.row.resumeID) === 0 ? '履歴書登録' : '履歴書更新'}}</el-button>
                </template>
            </el-table-column>
            <el-table-column label="最終更新日" prop="updateTime" width="140px">
                <template slot-scope="scope">
                    <span>{{(formatTime(scope.row.updateTime) !== '0001-01-01' ? formatTime(scope.row.updateTime) : '-')}}</span>
                </template>
            </el-table-column>
            <el-table-column label="ダウンロード">
                <el-table-column label="Excel" width="60px">
                    <template slot-scope="scope">
                        <i class="icon-Excel iconfont" color="success" @click="download(scope.row, 'excel')" v-if="scope.row.resumeID"></i>
                    </template>
                </el-table-column>
                <el-table-column label="Wrod" width="60px">
                    <template slot-scope="scope">
                        <i class="icon-word iconfont" color="primary" @click="download(scope.row, 'word')" v-if="scope.row.resumeID"></i>
                    </template>
                </el-table-column>
                <el-table-column label="PDF" width="60px">
                    <template slot-scope="scope">
                        <i class="icon-PDF iconfont" color="danger" v-if="scope.row.resumeID"></i>
                    </template>
                </el-table-column>
            </el-table-column>
        </el-table>
        <el-pagination
            :current-page="page"
            @current-change="changePage"
            :total="total"
            layout="total, prev, pager, next, jumper"></el-pagination>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import { apiDownloadFile, formatTime } from '@_public/utils';
export default {
    components: {
        MainWrapper
    },
    data() {
        return {
            tableData: [],
            page: 1,
            pageSize: 15,
            total: 0
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getData();
        });
    },
    methods: {
        formatTime: formatTime,
        getData() {
            const loading = this.$loading({ lock: true, text: '正在获取数据中...' });
            this.$axios({
                url: '/api/Resume/api_getresumelist',
                params: {
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
                    this.total = data.total || 0;
                } else {
                    this.$message({
                        type: 'error',
                        message: res ? res.message : '接口开小差了，没有返回信息'
                    });
                }
            });
        },
        changePage(page) {
            this.page = page;
            this.getData();
        },
        toUpdate(row) {
            this.$router.push({
                name: 'ResumeUpdate',
                params: {
                    epId: row.employeeID,
                    id: row.resumeID || 0,
                    doId1: row.furigana_LastName,
                    doId2: row.furigana_FirstName
                }
            });
        },
        download(row, type) {
            if (type === 'excel') {
                apiDownloadFile({
                    vm: this,
                    url: `/api/Resume/api_downloadresumeexcel?id=${row.resumeID}`,
                    filename: `YP履歴書_${row.furigana_LastName.substring(0, 1)}${row.furigana_FirstName.substring(0,1)}.xlsx`
                });
            } else if (type === 'word') {
                apiDownloadFile({
                    vm: this,
                    url: `/api/Resume/api_downloadresumeword?id=${row.resumeID}`,
                    filename: `YP履歴書_${row.furigana_LastName.substring(0, 1)}${row.furigana_FirstName.substring(0,1)}.doc`
                });
            }
        }
    }
};
</script>

<style scoped lang="less">
.resume-list {
    .iconfont {
        cursor: pointer;
        font-size: 26px;
        position: relative;
        top: 4px;
        // &:hover {
        //     color: #1473B7;
        // }
    }
}
</style>
