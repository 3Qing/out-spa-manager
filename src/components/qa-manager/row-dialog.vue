<template>
    <el-dialog
        :visible="visible"
        custom-class="qa-row-dialog"
        title="详情"
        @close="close">
        <el-form size="small" label-width="80px" label-suffix=":">
            <el-form-item label="質問1">
                <p>{{data.ask1}}</p>
            </el-form-item>
            <el-form-item label="質問2">
                <p>{{data.ask2}}</p>
            </el-form-item>
            <el-form-item label="質問3">
                <p>{{data.ask3}}</p>
            </el-form-item>
            <el-form-item label="回答">
                <p>{{data.answer}}</p>
            </el-form-item>
            <el-form-item label="コメント">
                <p>{{data.comment}}</p>
            </el-form-item>
        </el-form>
        <div slot="footer" style="text-align: center">
            <el-button type="primary" size="small" @click="close">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
export default {
    props: {
        form: Object,
        visible: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            data: {}
        };
    },
    watch: {
        visible: function(val) {
            if (val) {
                this.getData(this.form.id);
            }
        }
    },
    methods: {
        getData(id) {
            const loading = this.$loading({ lock: true, text: '获取数据中' });
            this.$axios({
                url: '/api/QA/api_getqabyid',
                params: {
                    qaid: id
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    const data = res.data || {};
                    this.data = { ...data };
                }
            });
        },
        close() {
            this.$emit('close');
        }
    }
};
</script>

<style scoped lang="less">
.qa-row-dialog {
    .el-dialog__body {
        padding: 0 20px;
    }
}
</style>
