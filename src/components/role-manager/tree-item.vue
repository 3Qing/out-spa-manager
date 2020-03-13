<template>
    <div class="role-tree-item" :style="style">
        <div class="tree-item" v-for="(item, i) in data" :key="i">
            <div>
                <el-input v-model="item.Title" placeholder="菜单名称" clearable></el-input>
                <el-select v-model="item.Name">
                    <el-option v-for="route in routeName" :label="route.label" :value="route.name" :key="route.name"></el-option>
                </el-select>
                <i color="danger" class="el-icon-delete" @click="deleteItem(i)"></i>
            </div>
            <role-tree-item v-if="item.children && item.children.length" :data="item.children" :deep="deep + 1"></role-tree-item>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: 'RoleTreeItem',
    props: {
        deep: Number,
        data: {
            type: Array,
            default: () => ([])
        }
    },
    inject: [ 'routeName' ],
    computed: {
        ...mapGetters(['IS_H5']),
        style() {
            return {
                'margin-left': this.IS_H5 ? `${this.deep * 0.2}rem` : `${this.deep * 20}px`
            };
        }
    },
    methods: {
        deleteItem(i) {
            this.$emit('delete', i);
        }
    }
};
</script>

<style scoped lang="less">
.role-tree-item {
    margin-top: 10px;
    .tree-item + .tree-item {
        margin-top: 10px;
    }
    .el-select {
        margin-left: 10px;
    }
}
</style>
