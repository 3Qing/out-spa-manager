<template>
    <main-wrapper class="resume-list">
        <el-table size="mini" stripe :data="tableData">
            <el-table-column label="社員番号" prop="EmpeeNo"></el-table-column>
            <el-table-column label="氏名" prop="Name"></el-table-column>
            <el-table-column label="就職タイプ" prop="RecruitType"></el-table-column>
            <el-table-column label="履歴書更新" prop="ResumeID" width="120px">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="primary"
                        @click="toUpdate(scope.row)"
                        >{{Number(scope.row.ResumeID) === 0 ? '履歴書登録' : '履歴書更新'}}</el-button>
                </template>
            </el-table-column>
            <el-table-column label="最終更新日" prop="UpdateDate" width="140px">
                <template slot-scope="scope">
                    <span>{{scope.row.UpdateDate || '-'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="ダウンロード">
                <el-table-column label="Excel" width="60px">
                    <template slot-scope="scope">
                        <i class="icon-web-icon- iconfont" v-if="scope.row.ResumeID"></i>
                    </template>
                </el-table-column>
                <el-table-column label="PDF" width="60px">
                    <template slot-scope="scope">
                        <i class="icon-PDF iconfont" v-if="scope.row.ResumeID"></i>
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
export default {
    components: {
        MainWrapper
    },
    data() {
        return {
            tableData: [],
            page: 1,
            pageSize: 10,
            total: 0
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getData();
        });
    },
    methods: {
        getData() {
            const loading = this.$loading({ lock: true, text: '正在获取数据中...' });
            this.$axios({
                url: '/api/getresumelist',
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
                    this.tableData = res.data || [];
                    this.total = res.total || 0;
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
                    epId: row.EmpeeID,
                    id: row.ResumeID || 0
                }
            });
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
        &:hover {
            color: #1473B7;
        }
    }
}
</style>
