<template>
    <main-wrapper class="docType-list">
        <el-form class="main-header" slot="header" size="mini" inline>
            <el-button size="mini" type="primary" @click="addLogin(1)">新規登録</el-button>
        </el-form>
        <div class="table-wrapper">
            <el-table size="small" :data="tableData" border>
                <el-table-column label="伝票タイプ" prop="type"></el-table-column>
                <el-table-column label="テキスト" prop="text" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" width="70px">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="编辑" placement="top-start">
                            <i class="el-icon-edit-outline oper-icon" color="warning" @click="addLogin(2, scope.row)"></i>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除" placement="top-start">
                           <i class="el-icon-delete oper-icon" color="danger" @click="deletes(scope.row)"></i>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog :visible.sync="vislble" :title="types === 1?'新增':'编辑'" @close='closeDialog'>
            <el-form size="mini" label-width="100px" :model="form" :rules="rules" ref="form">
                <el-form-item label="伝票タイプ" prop="type">
                    <el-input v-model="form.type"></el-input>
                </el-form-item>
                <el-form-item label="テキスト" prop="text">
                    <el-input v-model="form.text"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" size="mini" @click="confirm">确定</el-button>
            </div>
        </el-dialog>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import { mapGetters } from 'vuex';
// import moment from 'moment';

export default {
    components: {
        MainWrapper
    },
    data() {
        return {
            types: 1,
            form: {
                type: '',
                text: ''
            },
            tableData: [],
            vislble: false,
            rules: {
                type: [{
                    required: true, message: '请输入伝票タイプ！', trigger: 'blur'
                }],
                text: [{
                    required: true, message: '请输入テキスト！', trigger: 'blur'
                }]
            }
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getData();
        });
    },
    computed: {
        ...mapGetters(['IS_H5', 'TEAMS'])
    },
    methods: {
        getData() {
            const loading = this.$loading({ lock: true, text: '数据取得中...' });
            let url = '/api/ACDoc/api_doctypesforselect';
            this.$axios({
                url
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    console.log(res);
                    this.tableData = res.data || [];
                } else {
                    this.$message({
                        type: 'error',
                        showClose: true,
                        message: res ? res.message : 'インタフェース異常、データ取得できません！'
                    });
                }
            });
        },
        closeDialog() {
            this.$refs.form.resetFields();
        },
        // 新增 编辑按钮
        addLogin(type, row) {
            this.types = type;
            if (type === 1) {
                this.form = {
                    type: '',
                    text: ''
                };
            } else {
                this.form = row;
            }
            this.vislble = true;
        },
        // 删除按钮
        deletes(row) {
            this.$confirm('削除確認', '削除', {
                type: 'warning'
            }).then(() => {
                this.$axios({
                    url: '/api/ACDoc/api_deletedoctype',
                    params: {
                        doctype: row.type
                    }
                }).then(res => {
                    if (res && res.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '削除完了！'
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
        confirm() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    // 保存
                    const loading = this.$loading({ lock: true, text: '正在提交数据中' });
                    const url = '/api/ACDoc/api_updatedoctype';
                    this.$axios({
                        url,
                        params: {
                            companyID: 0,
                            type: String(this.form.type),
                            text: String(this.form.text)
                        }
                    }).then( res => {
                        loading.close();
                        if (res && res.code === 0) {
                            this.vislble = false;
                            this.getData();
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.message
                            });
                        }
                    });
                }
            });
        }
    }
};
</script>

<style lang="less">
.docType-list {
}
</style>
