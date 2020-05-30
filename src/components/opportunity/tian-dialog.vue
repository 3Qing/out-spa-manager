<template>
    <el-dialog :visible="visible" @close="close" title="提案履歴">
        <el-table :data="data" size="small" border>
            <el-table-column label="Name" prop="name" show-overflow-tooltip></el-table-column>
            <el-table-column label="CreateDate" prop="createDate" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.createDate.substring(0,10)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="SalesPerson" prop="salesPerson" show-overflow-tooltip></el-table-column>
        </el-table>
    </el-dialog>
</template>

<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        data: Array
    },
    data() {
        return {};
    },
    watch: {
    },
    methods: {
        close() {
            this.$emit('close');
        }
    }
};
</script>

<style scoped>

</style>
