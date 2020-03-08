<template>
    <el-dialog custom-class="intro-dialog" title="介绍文" :visible.sync="visible" @close="close">
        <el-input v-model="content" type="textarea" :rows="3" :maxlength="250"></el-input>
        <el-button type="primary" size="small" @click="submit">确认</el-button>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            tmpData: {},
            content: '',
            visible: false,
            callback: null
        };
    },
    mounted() {
        this.$root.$off('SHOW_INTRO_DIALOG');
        this.$root.$on('SHOW_INTRO_DIALOG', ({ data = null, callback = null }) => {
            this.tmpData = data || {};
            this.getProposeText(data);
            this.callback = callback;
            this.visible = true;
        });
    },
    methods: {
        close() {
            this.visible = false;
        },
        getProposeText(data) {
            this.$axios({
                url: '/api/generateproposetext',
                params: {
                    empeeid: data.ID
                }
            }).then(res => {
                if (res.code === 0) {
                    this.content = res.data;
                } else {
                    this.content = '';
                }
            });
        },
        submit() {
            const loading = this.$loading({ lock: true, text: '正在提交候选人信息...' });
            const params = {
                'employee.ID': this.tmpData.ID,
                AvaiableDate: this.tmpData.AvaiableDate,
                ProposeText: this.content,
                Status: 1
            };
            this.$axios({
                method: 'POST',
                url: '/api/updatepresales',
                params,
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res.code === 0) {
                    this.callback && this.callback();
                    this.close();
                } else {
                    this.$message({
                        type: 'error',
                        showClose: true,
                        message: res.message ? res.message : '接口开小差了，没有返回信息'
                    });
                }
            });
        }
    }
};
</script>

<style lang="less">
.intro-dialog {
    .el-dialog__body {
        padding-top: 10px;
    }
    .el-button {
        display: block;
        margin: 20px auto 0;
    }
}
</style>
