<template>
    <div class="role-tree-item" :style="style">
        <div class="tree-item" v-for="(item, i) in data" :key="item.key">
            <div>
                <el-input v-model="item.title" placeholder="菜单名称" clearable></el-input>
                <el-select v-model="item.name">
                    <el-option v-for="route in opt.routeData" :label="route.routeName" :value="route.routePath" :key="route.routePath"></el-option>
                </el-select>
                <i color="danger" class="el-icon-delete" @click="deleteItem(i)"></i>
                <i color="primary" class="el-icon-rank"></i>
            </div>
        </div>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    name: 'RoleTreeItem',
    props: {
        deep: Number,
        opt: Object,
        data: {
            type: Array,
            default: () => ([])
        }
    },
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
