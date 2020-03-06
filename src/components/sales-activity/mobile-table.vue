<template>
    <div class="sales-mobile-table">
        <el-table size="small" border v-for="list in data" :key="list.column.label" :data="list.data" :cell-class-name="mobileCellClassName">
            <el-table-column label="姓名" prop="EmployeeName" width="100px"></el-table-column>
            <el-table-column :label="list.column.label" :prop="list.column.prop">
                <p slot="header">{{list.column.label}}<i class="el-icon-edit-outline" @click="addSales(list.column)"></i></p>
                <template slot-scope="scope">
                    <span @click="showDialog(scope, 'row')">{{formatContext(scope, 'row')}}</span>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
// import moment from 'moment';
import mixins from './mixins';
export default {
    props: {
        data: Array,
        opt: Object
    },
    mixins: [ mixins ]
};
</script>

<style lang="less">
.sales-mobile-table {
    .el-table {
        margin-bottom: 0.4rem;
        .el-icon-edit-outline {
            font-size: 0.28rem;
            position: absolute;
            right: .2rem;
            top: 50%;
            color: #1473b7;
            transform: translateY(-50%);
        }
    }
    .el-form {
        .el-form-item {
            .el-input, .el-select, .el-date-picker {
                width: 100%;
            }
        }
    }
    .cell-info {
        background-color: rgb(233, 233, 235) !important;
    }
    .cell-success {
        background-color: rgba(69, 190, 135, 0.4) !important;
    }
    .cell-warning {
        background-color: rgb(250, 236, 216) !important;
    }
}
</style>
