<template>
    <el-dialog class="tian" :visible="visible" @close="close" title="提案履歴" :close-on-click-modal="dialog">
        <el-table ref="table" :data="data" size="small" border>
            <el-table-column label="Name" prop="name" show-overflow-tooltip></el-table-column>
            <el-table-column label="CreateDate" prop="createDate" show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{scope.row.createDate.substring(0,10)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="SalesPerson" prop="salesPerson" show-overflow-tooltip></el-table-column>
            <el-table-column label="アクション" width="70">
                <template slot-scope="scope">
                    <el-tooltip effect="dark" content="編集" placement="top-start">
                        <i class="el-icon-edit-outline oper-icon" color="warning" @click="toogleExpand(scope.row, 1)"></i>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="削除" placement="top-start">
                        <i class="el-icon-delete oper-icon" color="danger" @click="deletetoogle(scope.row)"></i>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column type="expand" width="1">
                <template slot-scope="props">
                    <el-form label-position="left" inline class="demo-table-expand">
                        <el-form-item label="">
                            <el-input v-model="content" type="textarea" :rows="6"></el-input>
                        </el-form-item>
                        <el-form-item class="lid" v-for='(item,index) in salesCaseItems' :key='index' :label="item.updateTime">
                            <el-input class="input" v-model="item.content" ></el-input>
                            <el-tooltip class="flot" effect="dark" content="削除" placement="top-start">
                                <i class="el-icon-delete oper-icon" color="danger" @click="deletes(index)"></i>
                            </el-tooltip>
                            <el-tooltip v-if='(index+1) === salesCaseItems.length' class="flot flot1" effect="dark" content="追加" placement="top-start">
                                <i class="el-icon-plus oper-icon" color="primary" @click="adds"></i>
                            </el-tooltip>
                        </el-form-item>
                        <el-form-item class="lid" label="提案状態">
                            <el-select size="mini" v-model="props.row.status">
                                <el-option v-for="item in opport" :key="item.id" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="">
                            <el-button size="small" type="primary" @click='save(props.row)'>保存</el-button>
                        </el-form-item>
                    </el-form>
                </template>
            </el-table-column>
        </el-table>
    </el-dialog>
</template>

<script>
import moment from 'moment';
export default {
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        deletetrues: {
            type: Boolean,
            default: false,
        },
        data: Array,
        opport: Array,
    },
    data() {
        return {
            deletetrue: false,
            dialog: false,
            ids: 1,
            content: '',
            salesCaseItems: [{
                content: '',
                updateTime: moment(new Date()).format('YYYY-MM-DD HH:MM')
            }]
        };
    },
    watch: {
    },
    methods: {
        close() {
            this.$emit('close');
            if (this.deletetrue) {
                this.$emit('update');
                this.deletetrue = false;
            }
        },
        // 展开
        toogleExpand(row) {
            let $table = this.$refs.table;
            this.data.map((item) => {
                if (row.id != item.id) {
                    $table.toggleRowExpansion(item, false);
                }
            });
            const loading = this.$loading({ lock: true, text: 'データ取得中...' });
            this.$axios({
                url: '/api/Opportunity/api_getsalescaseinfo',
                params: {
                    scid: row.id
                }
            }).then(res => {
                loading.close();
                $table.toggleRowExpansion(row);
                let datas = {};
                if (res && res.code === 0) {
                    datas = res.data;
                }
                this.data.forEach((item) => {
                    if(item.id === datas.id) {
                        this.content = datas.content;
                        if (datas.salesCaseItems.length>0) {
                            datas.salesCaseItems.forEach((i) => {
                                i.updateTime = moment(i.updateTime).format('YYYY-MM-DD HH:MM');
                            });
                            this.salesCaseItems = datas.salesCaseItems;
                        }
                    }
                });
            });
        },
        deletetoogle(row) {
            this.$confirm('削除確認', '削除', {
                type: 'warning'
            }).then(() => {
                this.$axios({
                    url: '/api/SalesCase/api_deletesalescase',
                    params: {
                        id: row.id
                    }
                }).then(res => {
                    if (res && res.code === 0) {
                        this.data.forEach((item, i) => {
                            if(item.id === row.id) {
                                this.data.splice(i, 1);
                            }
                        });
                        this.$message({
                            type: 'success',
                            message: '削除完了！'
                        });
                        this.deletetrue = true;
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.message
                        });
                    }
                });
            }).catch(() => {});
        },
        // 添加
        adds() {
            this.salesCaseItems.push({
                content: '',
                updateTime: moment(new Date()).format('YYYY-MM-DD HH:MM')
            });
        },
        // 删除
        deletes(i) {
            this.salesCaseItems.splice(i, 1);
        },
        // 保存
        save(row) {
            const loading = this.$loading({ lock: true, text: 'データ保存中...' });
            this.$axios({
                method: 'POST',
                url: '/api/SalesCase/api_updatesalescase',
                params: {
                    id: row.id,
                    content: this.content,
                    Status: row.status,
                    SalesCaseItems: this.salesCaseItems
                },
                formData: true
            }).then(res => {
                loading.close();
                this.$message({
                    type: 'success',
                    message: res ? res.message : 'システム異常、再試行してください！'
                });
            });
        }
    }
};
</script>

<style scoped lang="less">
.demo-table-expand {
    font-size: 0;
    .input{
        float: left;
        width: 530px;
        height: 30px;
        line-height: 30px;
    }
    .flot{
        // float: left;
        position: absolute;
        top: 5px;
        margin-left: 5px;
    }
    .flot1{
        margin-left: 28px !important;
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
    margin-top: 10px;
  }
</style>
