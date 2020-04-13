<template>
    <main-wrapper>
        <div class="main-header" slot="header">
            <el-button size="mini" type="primary">新规登录</el-button>
        </div>
        <el-table size="mini" :data="tableData">
            <el-table-column label="勘定コード" prop="Account"></el-table-column>
            <el-table-column label="テキスト" prop="Text"></el-table-column>
            <el-table-column label="BS/PL勘定" prop="BSPL"></el-table-column>
            <el-table-column label="消込管理" prop="ClearManagement"></el-table-column>
        </el-table>
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
            tableData: []
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getData();
        });
    },
    methods: {
        getData() {
            this.$axios({
                url: '/api/getaccountlist'
            }).then(res => {
                console.log(res);
                if (res && res.code === 0) {
                    this.tableData = res.data || [];
                } else {
                    this.$message({
                        type: 'error',
                        message: res ? res.message : '接口开小差了，没有返回信息'
                    });
                }
            });
        }
    }
};
</script>

<style scoped>

</style>
