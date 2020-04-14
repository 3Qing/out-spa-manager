<template>
    <main-wrapper>
        <div class="main-header" slot="header">
            <el-button size="mini" type="primary" @click="dataChange('add')">新规登录</el-button>
        </div>
        <el-table size="mini" :data="tableData">
            <el-table-column label="勘定コード" prop="Account"></el-table-column>
            <el-table-column label="テキスト" prop="Text"></el-table-column>
            <el-table-column label="BS/PL勘定" prop="BSPL">
                <template slot-scope="scope">
                    <span>{{formatText(scope)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="消込管理" prop="ClearManagement">
                <template slot-scope="scope">
                    <span>{{scope.row.ClearManagement ? '消込' : '未消込'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="dataChange('edit', scope.row)">变更</el-button>
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
                    <el-input size="mini" class="content" v-model="curData.Account" :disabled="isEdit"></el-input>
                </div>
                <div class="item">
                    <span class="label">テキスト</span>
                    <el-input size="mini" class="content" v-model="curData.Text"></el-input>
                </div>
                <div class="item">
                    <span class="label">BS/PL勘定</span>
                    <el-select size="mini" class="content" v-model="curData.BSPL">
                        <el-option v-for="item in selects" :key="item.value" :value="item.value" :label="item.label"></el-option>
                    </el-select>
                </div>
                <div class="item">
                    <span class="label">消込管理</span>
                    <el-checkbox v-model="curData.ClearManagement"></el-checkbox>
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
            curData: {
                Account: '',
                Text: '',
                BSPL: true,
                ClearManagement: ''
            }

        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getData();
        });
    },
    methods: {
        dataChange(type, data) {
            if (type === 'add') {
                this.isEdit = false;
                this.curData = {
                    Account: '',
                    Text: '',
                    BSPL: '',
                    ClearManagement: ''
                };
            } else {
                this.isEdit = true;
                this.curData = JSON.parse(JSON.stringify(data));
            }
            this.visible = true;
        },
        getData() {
            const loading = this.$loading({ lock: true, text: '正在获取数据中...' });
            this.$axios({
                url: '/api/getaccountlist',
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
            if (!this.curData.Account) {
                this.$message.warning('');
                return false;
            }
            const params = { ...this.curData };
            delete params.reportgroup;
            const loading = this.$loading({ lock: true, text: '正在提交数据中' });
            this.$axios({
                method: 'POST',
                url: '/api/updateaccount',
                params,
                custom: {
                    loading,
                    vm: this
                }
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
                if (scope.row.BSPL === item.value) {
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
