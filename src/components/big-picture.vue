<template>
    <el-dialog
        custom-class="big-picture-dialog"
        :visible.sync="visible"
        @close="close">
        <div class="cover-wrapper"><img :src="url"></div>    
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            url: '',
            visible: false
        };
    },
    mounted() {
        this.$root.$off('SHOW_PICTURE_DIALOG');
        this.$root.$on('SHOW_PICTURE_DIALOG', ({ url = '' }) => {
            if (url) {
                this.url = url;
                this.visible = true;
            }
        });
    },
    methods: {
        close() {
            this.visible = false;
        }
    }
};
</script>

<style lang="less">
.big-picture-dialog {
    .el-dialog__header {
        padding: 0;
        .el-icon-close {
            color: #fff;
        }
    }
    .el-dialog__body {
        padding: 0;
        .cover-wrapper {
            line-height: 1;
            font-size: 0;
        }
    }
    img {
        width: 100%;
    }
}
</style>
