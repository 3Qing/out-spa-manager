<template>
    <el-dialog
        :title="type === 'edit' ? '更新' : '创建'"
        :visible.sync="visible"
        v-if="visible"
        @close="close">
        <el-form size="small" label-width="100px" ref="form" :model="form" :rules="rules">
            <el-form-item label="社員番号" prop="EmpeeID">
                <el-select v-model="form.EmpeeID">
                    <el-option v-for="item in opt.employees" :key="item.ID" :label="item.Name" :value="item.ID"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="ロール" prop="RoleID">
                <el-select v-model="form.RoleID">
                    <el-option v-for="item in opt.allRole" :key="item.ID" :label="item.Title" :value="item.ID"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="パスワード" prop="UserPwd">
                <el-input type="password" v-model="form.UserPwd"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button type="primary" size="small" @click="submit">保存</el-button>
            <el-button size="small" @click="close">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    props: {
        opt: {
            type: Object,
            default: () => ({
                allRole: [],
                employees: []
            })
        }
    },
    data() {
        return {
            visible: false,
            form: {
                UserID: 0,
                RoleID: '',
                EmpeeID: '',
                UserPwd: ''
            },
            rules: {
                RoleID: [{
                    required: true, message: '请选择ロール'
                }],
                EmpeeID: [{
                    required: true, message: '请选择社員番号'
                }],
                UserPwd: [{
                    required: true, message: '请输入密码'
                }]
            },
            type: '',
            callback: null
        };
    },
    inject: ['modules'],
    mounted() {
        this.$root.$off('SHOW_EDIT_DIALOG');
        this.$root.$on('SHOW_EDIT_DIALOG', ({ data = null, type = '', callback = null }) => {
            if (data) {
                this.form.UserID = data.ID;
            }
            this.rules = {
                RoleID: [{
                    required: true, message: '请选择ロール'
                }],
                EmpeeID: [{
                    required: true, message: '请选择社員番号'
                }],
                UserPwd: [{
                    required: true, message: '请输入密码'
                }]
            };
            if (type === 'edit') {
                for (let key in this.form) {
                    if (key !== 'UserID') {
                        this.form[key] = data[key];
                    }
                }
                this.rules = {
                    RoleID: [{
                        required: true, message: '请选择ロール'
                    }],
                    EmpeeID: [{
                        required: true, message: '请选择社員番号'
                    }]
                };
            }
            this.type = type;
            this.callback = callback;
            this.visible = true;
        });
    },
    methods: {
        submit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    const loading = this.$loading({ lock: true, text: '正在保存中...' });
                    this.$axios({
                        method: 'POST',
                        url: '/api/updateuser',
                        params: this.form,
                        custom: {
                            loading,
                            vm: this
                        }
                    }).then(res => {
                        loading.close();
                        if (res && res.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '保存成功'
                            });
                            this.callback && this.callback();
                            this.close();
                        } else {
                            this.$message({
                                type: 'error',
                                message: res ? res.message : '接口开小差了，没有返回信息'
                            });
                        }
                    });
                }
            });
        },
        close() {
            this.form = {
                UserID: 0,
                RoleID: '',
                EmpeeID: '',
                UserPwd: ''
            };
            this.$refs.form.resetFields();
            this.visible = false;
        }
    }
};
</script>

<style scoped>

</style>
