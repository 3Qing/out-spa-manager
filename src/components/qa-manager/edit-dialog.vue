<template>
    <el-dialog
        :title="form.ID ? '更新' : '创建'"
        :visible.sync="visible"
        @close="close">
        <el-form size="small" label-width="100px" ref="form" :model="form" :rules="rules">
            <el-form-item label="モジュール" prop="Module">
                <el-select v-model="form.Module">
                    <el-option v-for="item in modules" :key="item" :value="item"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="質問１" prop="ask1">
                <el-input v-model="form.ask1"></el-input>
            </el-form-item>
            <el-form-item label="質問2">
                <el-input v-model="form.ask2"></el-input>
            </el-form-item>
            <el-form-item label="質問3">
                <el-input v-model="form.ask3"></el-input>
            </el-form-item>
            <el-form-item label="回答" prop="answer">
                <el-input type="textarea" v-model="form.answer" :rows="5"></el-input>
            </el-form-item>
            <el-form-item label="重要度" prop="importance">
                <el-rate v-model="form.importance" style="margin-top: 6px;"></el-rate>
            </el-form-item>
            <el-form-item label="コメント" prop="comment">
                <el-input type="textarea" v-model="form.comment" :rows="5"></el-input>
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
    data() {
        return {
            visible: false,
            form: {
                ID: '',
                Module: '',
                ask1: '',
                ask2: '',
                ask3: '',
                answer: '',
                importance: '',
                comment: ''
            },
            rules: {
                Module: [{
                    required: true, message: '请填写モジュール'
                }],
                ask1: [{
                    required: true, message: '请填写質問１'
                }],
                answer: [{
                    required: true, message: '请填写回答'
                }],
                comment: [{
                    required: true, message: '请填写コメント'
                }],
            },
            callback: null
        };
    },
    inject: ['modules'],
    mounted() {
        this.$root.$off('SHOW_EDIT_DIALOG');
        this.$root.$on('SHOW_EDIT_DIALOG', ({ data = null, callback = null }) => {
            const res = { ...(data || {})};
            if (res.Module) {
                res.Module = res.Module.toUpperCase();
            }
            for (let key in this.form) {
                this.form[key] = res[key];
            }
            this.callback = callback;
            this.visible = true;
        });
    },
    methods: {
        submit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    const loading = this.$loading({ lock: true, test: '正在保存中...' });
                    const params = {
                        Tags: '',
                        Ask1: this.form.ask1 || '',
                        Ask2: this.form.ask2 || '',
                        Ask3: this.form.ask3 || '',
                        Answer: this.form.answer || '',
                        Comment: this.form.comment || '',
                        Importance: this.form.importance || 0
                    };
                    this.$axios({
                        url: '/api/QA/api_updateqa',
                        params,
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
            this.$refs.form.resetFields();
            this.visible = false;
        }
    }
};
</script>

<style scoped>

</style>
