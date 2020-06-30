<template>
    <div class="main-wrapper">
        <slot name="header"></slot>
        <div class="content-wrapper">
            <div>
                <slot></slot>
            </div>
        </div>
        <div class="footer"></div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    props: {
        opt: {
            type: Object,
            default: () => ({
                crumbs: []
            })
        }
    },
    computed: {
        ...mapGetters(['IS_H5'])
    }
};
</script>

<style lang="less">
@height: 48px;

.main-wrapper {
    width: 100%;
    height: 100%;
    .el-breadcrumb {
        margin-bottom: 20px;
    }
    .main-header {
        padding: 0 20px;
        min-height: @height;
        line-height: @height;
        background-color: #e5edf4;
        .el-form-item__label, .el-form-item__content {
            height: @height;
            line-height: @height;
        }
        .el-form-item {
            margin: 0;
        }
    }
    .content-wrapper {
        padding: 20px 20px 50px;
        background-color: #fff;
        & > div {
            padding: 20px;
            border-radius: 4px;
            // box-shadow: 0 0 5px 5px #f8f8f8;
        }
    }
    .footer {
        border-top: 1px solid #c1d4e5;
        width: 100%;
        padding: 50px 0;
        height: 200px;
    }
}
</style>
