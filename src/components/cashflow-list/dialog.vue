<template>
    <el-dialog
        custom-class="ess-edit-dialog"
        :visible.sync="visible"
        @close="close">
        <ess-edit :id="id"></ess-edit>
        <div slot="footer">
            <el-button type="primary" size="small" @click="submit">{{type === 'confirm' ? '承认' : '取消承认'}}</el-button>
            <el-button size="small" @click="close">取消</el-button>
        </div>
    </el-dialog>
</template>

<script>
import EssEdit from '@views/ESS-edit';
export default {
    components: {
        EssEdit
    },
    data() {
        return {
            id: 0,
            type: '',
            callback: null,
            visible: false
        };
    },
    mounted() {
        this.$root.$off('SHOW_ESSEDIT_DAILOG');
        this.$root.$on('SHOW_ESSEDIT_DAILOG', ({ id, type, callback = null }) => {
            this.id = id;
            this.type = type;
            this.callback = callback;
            this.visible = true;
        });
    },
    methods: {
        close() {
            this.visible = false;
        },
        confirm() {
            const loading = this.$loading({ lock: true, text: '正在承认请求书' });
            this.$axios({
                url: '/api/approvetimesheet',
                params: {
                    cfid: this.id
                },
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.close();
                    this.callback && this.callback();
                } else {
                    this.$message({
                        type: 'error',
                        message: res ? res.message : '接口开小差了，没有返回信息'
                    });
                }
            });
        },
        cancel() {
            const loading = this.$loading({ lock: true, text: '正在取消承认请求书' });
            this.$axios({
                url: '/api/canceltimesheetapprove',
                params: {
                    cfid: this.id
                },
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.close();
                    this.callback && this.callback();
                } else {
                    this.$message({
                        type: 'error',
                        message: res ? res.message : '接口开小差了，没有返回信息'
                    });
                }
            });
        },
        submit() {
            if (this.type === 'confirm') {
                this.confirm();
            } else {
                this.cancel();
            }
        }
    }
};
</script>

<style lang="less">
.ess-edit-dialog {
    .content-wrapper {
        padding: 0;
    }
    .main-wrapper {
        .footer {
            display: none;
        }
    }
}
</style>
