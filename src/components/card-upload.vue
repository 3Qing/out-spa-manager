<template>
    <el-card :body-style="{ padding: '0px' }" class="card-upload">
        <div style="padding: 14px;">
            <div class="bottom clearfix">
                <upload-croppa :btn-text="opt.btnText" :alias="opt.field"
                    @success="success"
                    :ratio="opt.ratio"
                    :mini-size="{w: opt.w, h: opt.h}"
                    :limit="8388608"
                ></upload-croppa><el-button class="button"
                    @click="showCropper({w: opt.w, h: opt.h, key: opt.field})" size="small">裁剪</el-button>
            </div>
        </div>
        <div class="image-cover square">
            <span class="size-corner">最大尺寸({{opt.w}} x {{opt.h}})</span>
            <img v-if="previewImage" :src="previewImage">
            <div class="funcs-mask" v-if="previewImage">
                <div class="funcs-wrapper">
                    <div class="btn-download iconfont icon-chengyi_pc_preview" @click="downloadCover(previewImage)"></div>
                    <div class="btn-clear el-icon-close" @click="clearCover(opt.field)"></div>
                </div>
            </div>
        </div>
        <big-picture></big-picture>
    </el-card>
</template>

<script>
import UploadCroppa from './upload-croppa';
import BigPicture from './big-picture';
import { fileToBase64 } from '@_public/utils';
export default {
    components: {
        UploadCroppa,
        BigPicture
    },
    props: {
        form: {
            type: Object,
            default: () => ({})
        },
        opt: {
            type: Object,
            default: () => ({
                btnText: '上传图片',
                field: '',
                w: 300,
                h: 400,
                ratio: ''
            })
        }
    },
    data() {
        return {
            previewImage: ''
        };
    },
    methods: {
        success(res) {
            fileToBase64(res.file).then(res => {
                this.previewImage = res;
            });
            this.$emit('success', { res, opt: this.opt });
        },
        showCropper(params) {
            this.$root.$emit('SHOW_CROPPA', {
                w: params.w || 300,
                h: params.h || 400
            }, (res, alias) => {
                fileToBase64(res.file).then(res => {
                    this.previewImage = res;
                });
                this.$emit('cropper', { res, alias });
            });
        },
        downloadCover(res) {
            this.$root.$emit('SHOW_PICTURE_DIALOG', {
                url: res
            });
        },
        clearCover(key) {
            this.$confirm('是否清除该图片？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.form[key] = '';
                this.previewImage = '';
            }).catch(() => {});
        }
    }
};
</script>
