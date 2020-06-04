<template>
    <el-dialog :visible="visible" @close="close" title="提案履歴">
        <el-table :data="data" size="small" border>
            <el-table-column type="expand">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="">
                            <el-input v-model="props.row.name" type="textarea" :rows="3"></el-input>
                        </el-form-item>
                        <el-form-item label="2020-06-04 18:00">
                            <el-input class="input" v-model="props.row.name" ></el-input>
                            <el-tooltip class="flot" effect="dark" content="删除" placement="top-start">
                                <i class="el-icon-delete oper-icon" color="danger" @click="deletes(props.row)"></i>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="2020-06-04 19:00">
                            <el-input class="input" v-model="props.row.name" ></el-input>
                            <el-tooltip class="flot" effect="dark" content="删除" placement="top-start">
                                <i class="el-icon-delete oper-icon" color="danger" @click="deletes(props.row)"></i>
                            </el-tooltip>
                            <el-tooltip class="flot flot1" effect="dark" content="添加" placement="top-start">
                                <i class="el-icon-plus oper-icon" color="primary" @click="showDialog(props.row)"></i>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item label="提案状态">
                            <el-select size="mini" v-model="states">
                                <el-option v-for="item in docTypes" :key="item.type" :label="item.text" :value="item.type"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="">
                            <el-button size="small" type="primary">保存</el-button>
                        </el-form-item>
                    </el-form>
                </template>
                </el-table-column>
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
        return {
            states: 0,
            docTypes: [{
                type: 0,
                text: '已提案'
            }]
        };
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

<style scoped lang="less">
.demo-table-expand {
    font-size: 0;
    textarea {
        width: 500px;
    }
    .input{
        float: left;
        width: 465px;
    }
    .flot{
        // float: left;
        position: absolute;
        top: 10px;
        margin-left: 10px;
    }
    .flot1{
        margin-left: 40px !important;
    }
  }
  .demo-table-expand label {
    width: 150px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 100%;
    margin-top: 15px;
  }
</style>
