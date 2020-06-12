
<template>
    <main-wrapper>
        <div class="main-header" slot="header">
            <el-button size="mini" type="primary" @click="dataChange('add')">新规登录</el-button>
        </div>
        <el-table size="mini" :data="tableData" border>
            <el-table-column label="勘定コード" prop="accountID" width="140px"></el-table-column>
            <el-table-column label="テキスト" prop="text"></el-table-column>
            <el-table-column label="BS/PL勘定" prop="bspl">
                <template slot-scope="scope">
                    <span>{{formatText(scope)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="消込管理" prop="clearManagement">
                <template slot-scope="scope">
                    <span>{{scope.row.clearManagement ? '消込' : '未消込'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="財務諸表項目" prop="groupText"></el-table-column>
            <el-table-column label="操作" width="70px">
                <template slot-scope="scope">
                    <!-- <el-button size="mini" type="warning" @click="dataChange('edit', scope.row)">变更</el-button> -->
                    <el-tooltip effect="dark" content="变更" placement="top-start">
                        <i class="el-icon-edit-outline oper-icon" color="warning" @click="dataChange('edit', scope.row)"></i>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="删除" placement="top-start">
                        <i class="el-icon-delete oper-icon" color="danger" @click="deletes(scope.row)"></i>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="visible" @close="close">
            <div slot="title">
                <span v-show="!isEdit">新规登录</span>
                <span v-show="isEdit">变更</span>
            </div>
            <div class="line-content">
                <div class="item">
                    <span class="label">勘定コード</span>
                    <el-input size="mini" class="content" v-model="curData['accountID']" :disabled="isEdit"></el-input>
                </div>
                <div class="item">
                    <span class="label">テキスト</span>
                    <el-input size="mini" class="content" v-model="curData['text']"></el-input>
                </div>
                <div class="item">
                    <span class="label">BS/PL勘定</span>
                    <el-select size="mini" class="content" v-model="curData['bspl']">
                        <el-option v-for="item in selects" :key="item.value" :value="item.value" :label="item.label"></el-option>
                    </el-select>
                </div>
                <div class="item">
                    <span class="label">消込管理</span>
                    <el-checkbox v-model="curData['clearManagement']"></el-checkbox>
                </div>
                <div class="item">
                    <span class="label">財務諸表項目</span>
                    <el-select size="mini" class="content" v-model="curData['groupID']">
                        <el-option v-for="item in accounts" :key="item.id" :value="item.id" :label="item.text"></el-option>
                    </el-select>
                </div>
            </div>
            <div slot="footer">
                <el-button type="primary" size="mini" @click="save">确认</el-button>
            </div>
        </el-dialog>
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
            visible: false,
            isEdit: false,
            tableData: [],
            selects: [
                {
                    label: 'BS勘定',
                    value: true
                },
                {
                    label: 'PL勘定',
                    value: false
                }
            ],
            accounts: [],
            curData: {
                'accountID': '',
                'text': '',
                'bspl': true,
                'clearManagement': false,
                'groupID': '',
            }

        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getAccount();
            vm.getData();
        });
    },
    methods: {
        dataChange(type, data) {
            if (type === 'add') {
                this.isEdit = false;
                this.curData = {
                    'accountID': '',
                    'text': '',
                    'bspl': true,
                    'clearManagement': false,
                    'groupID': ''
                };
            } else {
                this.isEdit = true;
                this.curData = {
                    'accountID': data.accountID,
                    'text': data.text,
                    'bspl': data.bspl,
                    'clearManagement': data.clearManagement,
                    'groupID': data.groupID
                };
                // console.log(this.curData);
            }
            this.visible = true;
        },
        // 删除
        deletes(row) {
            this.$confirm('是否删除', '删除', {
                type: 'warning'
            }).then(() => {
                this.$axios({
                    url: '/api/ACAccount/api_deleteaccount',
                    params: {
                        account: row.accountID
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
        getAccount() {
            this.$axios({
                url: '/api/ACAccount/api_accountgroupsforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.accounts = res.data || [];
                }
            });
        },
        getData() {
            const loading = this.$loading({ lock: true, text: '正在获取数据中...' });
            this.$axios({
                url: '/api/ACAccount/api_getaccountlist',
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.tableData = res.data || [];
                } else {
                    this.$message({
                        type: 'error',
                        message: res ? res.message : '接口开小差了，没有返回信息'
                    });
                }
            });
        },
        close() {
            this.visible = false;
        },
        save() {
            if (!this.curData['accountID']) {
                this.$message.warning('');
                return false;
            }
            if (this.curData.groupID === '') {
                this.curData.groupID = 0;
            }
            const params = {
                AccountID: this.curData.accountID,
                Text: this.curData.text,
                BSPL: this.curData.bspl,
                ClearManagement: this.curData.clearManagement,
                ACAccountGroupID: this.curData.groupID
            };
            // console.log(params);
            const loading = this.$loading({ lock: true, text: '正在提交数据中' });
            this.$axios({
                method: 'POST',
                url: '/api/ACAccount/api_updateaccount',
                params,
                custom: {
                    loading,
                    vm: this
                },
                formData: true
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.getData();
                } else {
                    this.$message({
                        type: 'error',
                        message: res ? res.message : '接口开小差了，没有返回信息'
                    });
                }
            });
            this.visible = false;
        },
        formatText(scope) {
            for (let item of this.selects) {
                if (scope.row.bspl === item.value) {
                    return item.label;
                }
            }
        }
    }
};
</script>

<style scoped>
    .line-content{
        width: 100%;
        box-sizing: border-box;
        /* padding */
    }
    .line-content .item{
        width: 100%;
    }
    .line-content .item + .item{
        margin-top: 20px;
    }
    .line-content .item .label{
        display: inline-block;
        width: calc(30% - 20px);
        text-align: right;
        margin-right: 20px;
    }
    .line-content .item .content{
        width: 70%;
    }
</style>
