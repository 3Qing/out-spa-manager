<template>
    <el-dialog
        :visible="visible"
        custom-class="qa-row-dialog"
        title="详情"
        @close="close">
        <el-form size="small" label-width="80px" label-suffix=":">
            <el-form-item label="質問1">
                <p>{{form.Ask1}}</p>
            </el-form-item>
            <el-form-item label="質問2">
                <p>{{form.Ask2}}</p>
            </el-form-item>
            <el-form-item label="質問3">
                <p>{{form.Ask3}}</p>
            </el-form-item>
            <el-form-item label="回答">
                <p>{{form.Answer}}</p>
            </el-form-item>
            <el-form-item label="コメント">
                <p>{{form.Comment}}</p>
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
    methods: {
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
