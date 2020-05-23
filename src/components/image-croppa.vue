<template>
    <el-dialog
        class="image-croppa-wrapper"
        title="图片裁剪"
        :lock-scroll="true"
        :visible.sync="visible"
        :close-on-click-modal="false"
        @close="close">
        <div class="croppa-body-container" :style="{height: `${height + 60}px`}">
            <el-row style="text-align: center;">
                <el-button plain type="primary" size="mini" @click="rotateHandler(-1)">左旋</el-button>
                <el-button plain type="primary" size="mini" @click="rotateHandler(1)">右旋</el-button>
                <el-button plain type="primary" size="mini" @click="zoomHandler(true)">放大</el-button>
                <el-button plain type="primary" size="mini" @click="zoomHandler(false)">缩小</el-button>
                <el-button plain type="danger" size="mini" @click="resetHandler">移除</el-button>
            </el-row>
            <croppa v-model="croppa"
                :width="width"
                :height="height"
                :quality="quality"
                placeholder="点击选择图片"
                :initial-image="initialImage"
                :zoom-speed="2"
                :placeholder-font-size="20"
                :disable-drag-to-move="false"
                :show-remove-button="false"></croppa>
        </div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="visible = false">取 消</el-button>
            <el-button type="primary" @click="submit">提 交</el-button>
        </div>
    </el-dialog>
</template>

<script>
// import { doAxios } from '@/utils';
export default {
    data() {
        return {
            visible: false,
            croppa: {},
            width: 240,
            height: 320,
            quality: 1,
            alias: '',
            callBack: null,
            initialImage: ''
        };
    },
    mounted() {
        this.$root.$off('SHOW_CROPPA');
        this.$root.$on('SHOW_CROPPA', (params = {}, cb) => {
            this.callBack = cb || null;
            if (params.w > -1 && params.h > -1) {
                if (params.w > 600 || params.h > 600) {
                    const ratio = Math.ceil(Math.max(params.w, params.h) / 600);
                    this.quality = ratio % 2 === 0 ? ratio : ratio - 1;
                } else {
                    this.quality = 1;
                }
                this.width = params.w / this.quality;
                this.height = params.h / this.quality;
            } else if (params.ratio) {
                this.quality = 2;
                let ratios = params.ratio.split(':');
                let wRatio = parseInt(ratios[0]);
                let hRatio = parseInt(ratios[1]);
                this.height = 400;
                this.width = Math.round(this.height * wRatio / hRatio);
            }
            if (params.alias) this.alias = params.alias;
            if (params.initial) {
                this.initialImage = params.initial;
            }
            this.visible = true;
        });
    },
    methods: {
        close() {
            this.width = 240;
            this.height = 320;
            this.quality = 1;
            this.alias = '';
            this.callBack = null;
            this.initialImage = '';
            this.sizeLimit = 0;
            this.croppa.refresh();
            this.visible = false;
        },
        submit() {
            this.hasImage(() => {
                this.croppa.generateBlob(blob => {
                    let chooseFile = this.croppa.getChosenFile();
                    let fileName = chooseFile ? chooseFile.name : 'no_name.png';
                    let file = new File([blob], fileName, {
                        type: chooseFile ? blob.type : 'image/png',
                        lastModified: Date.now()
                    });
                    // let formData = new FormData();
                    // formData.append('filename', fileName);
                    // formData.append('file', file);
                    // this.$emit('success', { file, fileName });
                    this.callBack && this.callBack({ file, fileName }, this.alias);
                    this.close();
                    // doAxios({
                    //     method: 'POST',
                    //     url: 'manager.bilibili.co/pgc/admin/season/file/upload',
                    //     params: formData,
                    //     include: true
                    // }, this).then(res => {
                    //     if (res.status === 200 && res.data && res.data.data && res.data.data.location) {
                    //         this.callBack && this.callBack({
                    //             url: res.data.data.location
                    //         }, this.alias);
                    //         this.close();
                    //     } else {
                    //         this.$message({
                    //             showClose: true,
                    //             type: 'error',
                    //             message: (res.data && res.data.message ? res.data.message : res.msg) || '服务器开小差了，请稍后重试~'
                    //         });
                    //     }
                    // });
                });
            });
        },
        hasImage(next) {
            if (this.croppa.hasImage()) {
                next && next();
            } else {
                this.$message({
                    showClose: true,
                    type: 'warning',
                    message: '请先添加图片~'
                });
            }
        },
        rotateHandler(step) {
            this.hasImage(() => {
                this.croppa.rotate(step);
            });
        },
        zoomHandler(isIn) {
            this.hasImage(() => {
                this.croppa.zoom(isIn, 30);
            });
        },
        resetHandler() {
            this.croppa.remove();
        }
    }
};
</script>

<style lang="less">
.image-croppa-wrapper {
    .el-dialog {
        width: 600px;
    }
    .el-dialog__body {
        position: relative;
        padding: 20px;
        .croppa-container {
            position: absolute;
            top: 70px;
            left: 50%;
            transform: translateX(-50%);
            // background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQAQMAAAAlPW0iAAAAA3NCSVQICAjb4U/gAAAABlBMVEXMzMz////TjRV2AAAACXBIWXMAAArrAAAK6wGCiw1aAAAAHHRFWHRTb2Z0d2FyZQBBZG9iZSBGaXJld29ya3MgQ1M26LyyjAAAABFJREFUCJlj+M/AgBVhF/0PAH6/D/HkDxOGAAAAAElFTkSuQmCC");
            border: 1px solid #ddd;
            canvas {
                display: block;
            }
            .slots {
                display: none;
            }
            svg.icon-remove {
                position: absolute;
                background: #fff;
                border-radius: 50%;
                filter: drop-shadow(-2px 2px 2px rgba(0,0,0,.7));
                z-index: 10;
                cursor: pointer;
                border: 2px solid #fff;
            }
        }
    }
}
</style>