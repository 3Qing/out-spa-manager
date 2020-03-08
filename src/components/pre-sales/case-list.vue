<template>
    <div class="sales-case-list">
        <el-button class="add-case-btn" size="mini" type="primary" @click="addCase">新建营业Case</el-button>
        <div class="empty-text" v-if="!data.length && !loading">暂无数据</div>
        <div class="loading-wrapper" v-if="loading">
            <i class="el-icon-loading" color="primary"></i>
            <p color="primary">拼命加载中</p>
        </div>
        <div class="list-wrapper" :style="style">
            <case-item
                v-for="(item, i) in data"
                :form="item"
                :key="i"
                @update="$emit('update')"
                :opt="opt"></case-item>
        </div>
    </div>
</template>

<script>
import CaseItem from './case-item';

export default {
    components: {
        CaseItem
    },
    props: {
        data: {
            type: Array,
            default: () => ([])
        },
        loading: {
            type: Boolean,
            default: false,
        },
        itemID: {
            type: Number,
            default: -1
        }
    },
    data() {
        return {
            opt: {},
            style: {}
        };
    },
    watch: {
        itemID(val) {
            this.$set(this.opt, 'ID', val);
        }
    },
    mounted() {
        const mainWrapper = document.documentElement.clientHeight;
        const webHeaderH = document.querySelector('.web-header').clientHeight;
        const addCaseBtnH = document.querySelector('.add-case-btn').clientHeight;
        this.$set(this.style, 'max-height', `${mainWrapper - webHeaderH - addCaseBtnH - 20}px`);
        this.getSalespersonforselect();
        this.getCustomerList();
    },
    methods: {
        addCase() {
            this.data.unshift({
                CustomerID: '',
                SalesPersonID: '',
                SalesPersonName: '',
                Content: '',
                Status: '',
                Items: []
            });
        },
        getSalespersonforselect() {
            this.$axios({
                url: '/api/salespersonforselect'
            }).then(res => {
                this.$set(this.opt, 'sales', res.data || []);
            });
        },
        getCustomerList() {
            this.$axios({
                url: '/api/customersforselect'
            }).then(res => {
                this.$set(this.opt, 'customers', res.data || []);
            });
        }
    }
};
</script>

<style scoped lang="less">
.sales-case-list {
    min-height: 200px;
    position: relative;
    .loading-wrapper {
        position: absolute;
        width: 100%;
        height: 100%;
        font-size: 18px;
        text-align: center;
        top: 0;
        left: 0;
        z-index: 9;
        background-color: hsla(0, 0%, 100%, .9);
        .el-icon-loading {
            margin-top: 18%;
        }
        p {
            font-size: 12px;
        }
    }
    .empty-text {
        margin-top: 18%;
        text-align: center;
        color: #909399;
    }
    .list-wrapper {
        overflow-y: auto;
    }
}
</style>
