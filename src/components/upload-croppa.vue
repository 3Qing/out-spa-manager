<template>
    <el-upload
        class="btn-upload-croppa"
        action=""
        :on-change="beforeUpload"
        :show-file-list="false"
        :auto-upload="false"
        size="small">
        <el-button size="small" :disabled="disabled">{{btnText}}</el-button>
    </el-upload>
</template>

<script>
export default {
    props: {
        btnText: {
            type: String,
            default: () => {
                return '上传图片';
            }
        },
        size: {
            type: Object,
            default: () => {
                return {
                    w: -1, h: -1
                };
            }
        },
        miniSize: {
            type: Object,
            default: () => {
                return {
                    w: -1, h: -1
                };
            }
        },
        dpr: { // 图片质量，为了解决裁图区域太小难以操作以及图片模糊的问题
            type: Number,
            default: 1
        },
        ratio: {
            type: String,
            default: () => {
                return '';
            }
        },
        autoCroppa: {
            type: Boolean,
            default: true
        },
        limit: {
            type: Number,
            default: 0
        },
        alias: {},
        fileType: {
            type: Number,
            default: 0 // 0 图片文件 1 svga文件 2 json&svga文件
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    methods: {
        getBlobUrl(file, cback) {
            let reader = new FileReader();
            reader.onload = (e) => {
                let blobUrl = null;
                if (e.target.result === 'object') {
                    blobUrl = window.URL.createObjectURL(new Blob([e.target.result]));
                } else {
                    blobUrl = e.target.result;
                }
                cback && cback(blobUrl);
            };
            reader.onerror = () => {
                cback && cback(null);
            };
            reader.readAsDataURL(file.raw);
        },
        getImageSize(url, cback) {
            let image = new Image();
            image.onload = () => {
                cback && cback({
                    width: image.width,
                    height: image.height
                });
            };
            image.onerror = () => {
                cback && cback({
                    width: -1,
                    height: -1
                });
            };
            image.src = url;
        },
        beforeUpload(file) {
            if (this.fileType === 0 && /\.(jpg|jpeg|png|bmp|gif|webp|JPG|PNG|BMP|GIF)$/.test(file.name)) {
                this.getBlobUrl(file, blobUrl => {
                    if (blobUrl) {
                        this.getImageSize(blobUrl, info => {
                            if (info.width > 0 && info.height > 0) {
                                let sizeLimit = false;
                                // if (this.ratio) {
                                //     let ratios = this.ratio.split(':');
                                //     let wRatio = parseInt(ratios[0]);
                                //     let hRatio = parseInt(ratios[1]);
                                //     let w = info.height * wRatio / hRatio;
                                //     sizeLimit = info.width !== w;
                                // } else
                                if (this.size.w > 0 && this.size.h > 0) {
                                    sizeLimit = info.width !== this.size.w || info.height !== this.size.h;
                                }
                                let miniLimit = false;
                                // if (this.miniSize.w > 0 && this.miniSize.h > 0) {
                                //     miniLimit = info.width < this.miniSize.w || info.height < this.miniSize.h;
                                // }
                                let fileLimit = this.limit && this.limit < file.size;
                                if (miniLimit) {
                                    this.$message({
                                        showClose: true,
                                        type: 'warning',
                                        message: '图片小于最小尺寸限制，请使用更大的图片'
                                    });
                                } else if ((fileLimit || sizeLimit) && this.autoCroppa) {
                                    const tip = fileLimit ? '文件大小超出限制' : '图片尺寸不符';
                                    this.$confirm('是否对图片进行裁剪？', tip, {
                                        confirmButtonText: '去裁剪',
                                        cancelButtonText: '放弃',
                                        type: 'warning'
                                    }).then(() => {
                                        this.$root.$emit('SHOW_CROPPA', {
                                            ratio: this.ratio,
                                            w: Math.max(this.size.w, this.miniSize.w) * (this.ratio ? this.dpr : 1),
                                            h: Math.max(this.size.h, this.miniSize.h) * (this.ratio ? this.dpr : 1),
                                            initial: blobUrl,
                                            alias: this.alias
                                        }, (res, alias) => {
                                            this.$emit('success', res, alias || '');
                                        });
                                    }).catch(() => {});
                                } else if (fileLimit || sizeLimit) {
                                    const tip = fileLimit ? '文件大小超出限制' : '图片尺寸不符';
                                    this.$message({
                                        showClose: true,
                                        type: 'warning',
                                        message: `${tip}，请自行修改后重新上传`
                                    });
                                } else {
                                    this.upload(file.raw);
                                }
                            } else {
                                this.$message({
                                    showClose: true,
                                    type: 'warning',
                                    message: '图片解析失败，请稍后重试'
                                });
                            }
                        });
                    } else {
                        this.$message({
                            showClose: true,
                            type: 'warning',
                            message: '图片解析失败，请稍后重试'
                        });
                    }
                });
            } else if (this.fileType === 1 && /\.(svga|SVGA)$/.test(file.name)) {
                this.getBlobUrl(file, blobUrl => {
                    if (blobUrl) {
                        this.upload(file.raw);
                    }
                });
            } else {
                let message = '';
                if (this.fileType === 0) {
                    message = '图片格式不正确';
                }
                this.$message({
                    showClose: true,
                    type: 'warning',
                    message: message
                });
            }
        },
        upload(file) {
            this.$emit('success', { file, fileName: file.fileName }, this.alias || '');
        }
    }
};
</script>
