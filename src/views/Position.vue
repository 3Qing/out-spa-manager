<template>
    <main-wrapper class="payment-wrapper">
        <div class="main-header" slot="header">
            <el-button type="primary" size="mini" @click="handleEdit(null)">新增岗位</el-button>
        </div>
        <el-table size="small" :data="tableData" border>
            <el-table-column label="ID" prop="id" width="100px"></el-table-column>
            <el-table-column label="岗位名称" prop="title"></el-table-column>
            <el-table-column label="操作" width="100px">
                <template slot-scope="scope">
                    <el-tooltip effect="dark" content="编辑" placement="top-start">
                        <i class="el-icon-edit-outline link" color="primary" @click="handleEdit(scope.row)"></i>
                    </el-tooltip>
                    <el-tooltip effect="dark" content="删除" placement="top-start">
                        <i class="el-icon-delete link" color="danger" @click="handleDelete(scope.row)"></i>
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :title="data.id ? `编辑：${data.id}` : '新增'" @close="close" :visible.sync="visible" custom-class="candition-dialog">
            <el-form :model="data" ref="form" :rules="rules" label-width="80px">
                <el-form-item label="岗位名称" prop="title">
                    <el-input v-model="data.title" size="mini" :maxlength="20"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" size="mini" @click="submit">保存</el-button>
                <el-button size="mini" @click="close">取消</el-button>
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
            tableData: [],
            visible: false,
            data: {
                id: '',
                title: ''
            },
            rules: {
                title: [{
                    required: true, trigger: 'blur'
                }]
            }
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getData();
        });
    },
    methods: {
        getData() {
            const loading = this.$loading({ lock: true, text: '正在获取信息中' });
            this.$axios({
                url: '/api/Position/api_positionsforselect'
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.tableData = res.data || [];
                }
            });
        },
        handleEdit(row) {
            if (row) {
                this.data = { ...row };
            }
            this.visible = true;
        },
        handleDelete(row) {
            this.$confirm('是否删除', '删除', {
                type: 'warning'
            }).then(() => {
                this.$axios({
                    url: '/api/Position/api_deleteposition',
                    params: {
                        id: row.id
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
                            type: 'warning',
                            message: res.message
                        });
                    }
                });
            }).catch(() => {});
        },
        close() {
            this.visible = false;
            this.data = {
                id: '',
                title: ''
            };
            this.$refs.form.resetFields();
        },
        submit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    const params = {
                        ID: this.data.id || 0,
                        Title: this.data.title || ''
                    };
        
                    const loading = this.$loading({ lock: true, text: '正在提交信息中' });
                    this.$axios({
                        method: 'POST',
                        url: '/api/Position/api_updateposition',
                        params,
                        formData: true
                    }).then(res => {
                        loading.close();
                        if (res && res.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '保存成功'
                            });
                            this.close();
                            this.getData();
                        } else {
                            this.$message({
                                type: 'warning',
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
.payment-wrapper {
    .link {
        font-size: 18px;
        margin-right: 20px;
    }
}
</style>
