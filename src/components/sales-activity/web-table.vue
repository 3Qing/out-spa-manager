<template>
    <div class="sales-web-table">
        <el-table size="small" border stripe :data="data" :span-method="arraySpanMethod">
            <el-table-column label="姓名" prop="EmployeeName" width="100px"></el-table-column>
            <el-table-column v-for="item in cols" :key="item.Date" :prop="item.prop">
                <p slot="header">{{item.label}}<i class="el-icon-plus" @click="addSales(item)"></i></p>
                <template slot-scope="scope">
                    <el-popover
                        width="350"
                        placement="top"
                        trigger="hover">
                        <edit-form v-if="scope.row[item.prop]" :data="scope.row[item.prop]" :opt="opt"></edit-form>
                        <div
                            slot="reference"
                            :class="[cellClassName(scope.row, item.prop)]"
                            @click="showDialog(scope.row, item.prop)">
                            {{formatContext(scope.row, item.prop)}}
                            <i v-if="formatContext(scope.row, item.prop)" class="el-icon-edit-outline"></i>
                        </div>
                    </el-popover>
                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
import EditForm from '@components/sales-activity/edit';
import mixins from './mixins';

export default {
    components: {
        EditForm
    },
    props: {
        data: {
            type: Array
        },
        cols: {
            type: Array
        },
        opt: Object
    },
    mixins: [ mixins ]
};
</script>
<style lang="less">
.sales-web-table {
    .el-icon-plus {
        cursor: pointer;
        font-size: 18px;
        position: absolute;
        right: 5px;
        top: 50%;
        color: #1473b7;
        transform: translateY(-50%);
    }
    .el-icon-edit-outline {
        position: absolute;
        right: 15px;
        top: 50%;
        color: #1473b7;
        cursor: pointer;
        transform: translateY(-50%);
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
