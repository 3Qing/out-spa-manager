<template>
    <el-radio-group class="role-list clearfix">
        <i></i>
        <!-- el-icon-arrow-down
            el-icon-arrow-up
            el-icon-arrow-right
 -->
        <!-- <li v-for="item in data" :key="item.ID">{{item.Title}}</li> -->
        <el-radio v-for="item in data" :key="item.ID" :label="item.ID" :value="item.Title"></el-radio>
    </el-radio-group>
</template>

<script>
export default {
    props: {
        data: {
            type: Array,
            default: () => ([])
        }
    }
};
</script>

<style scoped lang="less">
.role-list {
    list-style: none;
    position: relative;
    li {
        padding: 0 15px;
        margin-bottom: 10px;
    }
}
</style>
