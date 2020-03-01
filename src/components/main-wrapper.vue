<template>
    <div class="main-wrapper">
        <el-breadcrumb separator-class="el-icon-arrow-right" v-if="!IS_H5 && opt.crumbs.length">
            <el-breadcrumb-item v-for="(item, i) in opt.crumbs" :key="i" :to="item.to">{{item.label}}</el-breadcrumb-item>
        </el-breadcrumb>
        <slot name="header"></slot>
        <div class="content-wrapper">
            <slot></slot>
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
        height: @height;
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
    }
    .footer {
        border-top: 1px solid #c1d4e5;
        width: 100%;
        padding: 50px 0;
        height: 200px;
    }
}
</style>
