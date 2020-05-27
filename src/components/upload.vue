<template>
    <div class="upload-wrapper">
        <div :class="[opt.showIcon && 'upload-icon', 'upload']" :title="opt.btnText">
            <input
                type="file"
                :title="opt.btnText"
                :accept="opt.accept"
                @change="beforeUpload">
            <p v-if="!opt.showIcon">{{opt.btnText}}</p>
            <i v-else style="font-size:17px;" class="iconfont icon-icon-test2"></i>
        </div>
        <div class="upload-preview" v-if="filename && opt.show">
            <i class="el-icon-document"></i>
            <span class="txt-dash" :title="filename">{{filename || ''}}</span>
            <i class="el-icon-close" @click="clearUpload"></i>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        opt: {
            type: Object,
            default: () => ({
                btnText: '上传文件',
                accept: 'image/*, application/pdf',
                show: true,
                showIcon: false
            })
        }
    },
    data() {
        return {
            filename: '',
            files: null
        };
    },
    mounted() {
        this.$root.$on('UPLOAD', ({ type = '' }) => {
            if (type === 'clear') {
                this.filename = '';
                this.files = null;
            }
        });
    },
    methods: {
        beforeUpload(evt) {
            const files = evt.target.files || [];
            this.files = files;
            this.filename = (files[0] || {}).name || '';
            this.$emit('upload', { file: files[0] || null, opt: this.opt });
        },
        clearUpload() {
            this.filename = '';
            this.files = null;
            this.$emit('upload', { file: null, opt: this.opt });
        }
    }
};
</script>

<style scoped lang="less">
.upload-wrapper {
    height: 28px;
    line-height: 28px;
    .upload {
        display: inline-block;
        padding: 0 15px;
        height: 28px;
        line-height: 28px;
        position: relative;
        overflow: hidden;
        border-radius: 4px;
        text-align: center;
        color: #fff;
        background-color: #1473B7;
        &:hover {
            background-color: rgba(20, 115, 183, .8);
        }
        input {
            position: absolute;
            top: 0;
            left: 0;
            transform: translate(-50%, -50%);
            width: 200%;
            height: 200%;
            opacity: 1;
            font-size: 0;
            outline: none;
            cursor: pointer;
        }
        &.upload-icon {
            text-align: center;
            color: #1473B7;
            background-color: transparent;
            &:hover {
                background-color: transparent;
            }
        }
    }
    .upload-preview {
        display: inline-block;
        cursor: pointer;
        height: 32px;
        line-height: 32px;
        position: relative;
        vertical-align: top;
        padding: 0 40px 0 15px;
        width: calc(100% - 100px);
        &:hover {
            background-color: #F2F6FC;
            .el-icon-close {
                display: inline;
            }
            span {
                color: #409EFF;
            }
        }
        .el-icon-close {
            display: none;
            cursor: pointer;
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
        }
        .el-icon-document {
            position: absolute;
            left: 2px;
            top: 50%;
            transform: translateY(-50%);
        }
        span {
            display: inline-block;
            max-width: 100%;
            margin-left: 10px;
        }
    }
}
</style>