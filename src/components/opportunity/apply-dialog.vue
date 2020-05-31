<template>
    <el-dialog :visible="visible" @close="close" :close-on-click-modal="dialog">
        <el-form size="mini" label-width="80px">
            <el-form-item label="候选人">
                <el-select
                    v-model="form.candidateid"
                    remote
                    filterable
                    clearable
                    @clear="clearHandle"
                    @change="handleChange"
                    :remote-method="getCandidate">
                    <el-option v-for="item in candidates" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="form.comment" type="textarea" :rows="5"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button size="mini" type="primary" @click="submit">保存</el-button>
            <el-button size="mini" @click="close">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    props: {
        visible: {
            type: Boolean,
            default: false,
        },
        data: Object
    },
    data() {
        return {
            dialog: false,
            curId: '',
            form: {
                candidateid: '',
                comment: ''
            },
            candidates: []
        };
    },
    watch: {
        visible: function(val) {
            if (val) {
                this.curId = this.data.id;
                this.getCandidate();
            }
        }
    },
    methods: {
        getCandidate(keyword) {
            this.loading = true;
            this.form.candidateid = keyword;
            this.$axios({
                url: '/api/Candidate/api_candidatesforselect',
                params: {
                    keyword
                }
            }).then(res => {
                this.loading = false;
                if (res && res.code === 0) {
                    this.candidates = res.data || [];
                }
            });
        },
        handleChange(val) {
            this.$set(this.form, 'candidateid', val);
        },
        clearHandle() {
            this.form.candidateid = '';
        },
        close() {
            this.$emit('close');
            this.form = {
                candidateid: '',
                comment: ''
            };
        },
        submit() {
            const loading = this.$loading({ lock: true, text: '正在提交信息中' });
            this.$axios({
                url: '/api/Opportunity/api_applyforopportunity',
                params: {
                    opportunityid: this.curId,
                    candidateid: this.form.candidateid,
                    comment: this.form.comment
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.$emit('update');
                    this.$message({
                        type: 'success',
                        message: '提交成功'
                    });
                    this.$emit('close');
                } else {
                    this.$message({
                        type: 'warning',
                        message: res.message
                    });
                    this.$emit('close');
                }
            });
        }
    }
};
</script>

<style scoped>

</style>
