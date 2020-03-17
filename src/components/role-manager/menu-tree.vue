<template>
    <div class="role-menu-tree sort-item">
        <div class="clearfix">
            <div class="left fl">
                <el-input v-model="data.Title" placeholder="菜单名称" clearable></el-input>
            </div>
            <div class="oper-area fr">
                <el-button type="warning" size="mini" @click="addSubmenu">新增子集</el-button>
                <i v-if="total > 1" color="primary" class="el-icon-rank"></i>
            </div>
            <i v-if="total > 1" color="danger" class="el-icon-delete" @click="deleteMenu"></i>
        </div>
        <menu-item
            v-if="data.children && data.children.length"
            :data="data.children"
            :deep="deep + 1"
            @delete="deleteItem"></menu-item>
    </div>
</template>

<script>
import MenuItem from './tree-item';
export default {
    props: {
        data: {
            type: Object,
            default: () => ({})
        },
        deep: Number,
        index: Number,
        total: Number
    },
    components: {
        MenuItem
    },
    methods: {
        addSubmenu() {
            this.data.children.push({
                Title: '',
                Name: '',
                key: Math.random() * 1000,
            });
        },
        deleteItem(i) {
            this.data.children.splice(i, 1);
        },
        deleteMenu() {
            this.$emit('delete', this.index);
        }
    }
};
</script>

<style lang="less">
.role-menu-tree {
    margin-bottom: 10px;
    position: relative;
    padding: 10px;
    border-radius: 4px;
    border: 1px solid #DCDFE6;
    .el-input {
        width: 200px;
    }
    .add-btn {
        display: inline-block;
        position: absolute;
        right: -70px;
        top: 0;
    }
    .el-icon-delete, .el-icon-rank {
        cursor: pointer;
        margin-left: 10px;
    }
}
</style>
