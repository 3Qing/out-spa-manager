<template>
    <div class="sales-case-list">
        <el-button class="add-case-btn" size="mini" type="primary" @click="addCase">新建营业Case</el-button>
        <el-button size="mini" type="warning" @click="beforeSu">保存</el-button>
        <div class="empty-text" v-if="!data.length && !loading">暂无数据</div>
        <div class="loading-wrapper" v-if="loading">
            <i class="el-icon-loading" color="primary"></i>
            <p color="primary">拼命加载中</p>
        </div>
        <div class="list-wrapper" :style="style">
            <case-item
                v-for="(item, i) in data"
                :ref="'item'+i"
                :form="item"
                :datas="data"
                :opport="oppStatu"
                :key="item.id || i"
                @update="$emit('update')"
                :opt="opt"></case-item>
        </div>
        <!-- <tian-dialog
            :visible="tianApply"
            :data="tianArr"
            :opport="oppStatu"
            @close="tianApply = false"
            @update="getData"></tian-dialog> -->
    </div>
</template>

<script>
import CaseItem from './case-item';
// import TianDialog from './tian-dialog';
import moment from 'moment';
export default {
    components: {
        CaseItem,
        // TianDialog
    },
    props: {
        oppStatu: Array,
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
            style: {},
            tianApply: false,
            tianArr: [],
            isAddCase: false
        };
    },
    watch: {
        itemID(val) {
            this.$set(this.opt, 'id', val);
        }
    },
    mounted() {
        const mainWrapper = document.documentElement.clientHeight;
        const webHeaderH = document.querySelector('.web-header').clientHeight;
        const addCaseBtnH = document.querySelector('.add-case-btn').clientHeight;
        this.$set(this.style, 'max-height', `${mainWrapper - webHeaderH - addCaseBtnH - 20}px`);
        this.getSalespersonforselect();
        this.getCustomerList();
        this.getOpport();
    },
    methods: {
        beforeSu() {
            this.data.forEach((item, i) => {
                let gv = 'item'+i;
                if (gv === 'item0') {
                    this.$refs[gv][0].beforeSubmit();
                }
            });
        },
        addCase() {
            this.isAddCase = true;
            this.data.unshift({
                isAddCase: true,
                customerID: '',
                salesPersonID: '',
                content: '',
                status: '',
                salesCaseItems: [{
                    content: '',
                    updateTime: moment(new Date()).format('YYYY-MM-DD HH:MM')
                }]
            });
        },
        getSalespersonforselect() {
            this.$axios({
                url: '/api/Employee/api_salespersonforselect'
            }).then(res => {
                this.$set(this.opt, 'sales', res.data || []);
            });
        },
        getCustomerList() {
            this.$axios({
                url: '/api/Customer/api_customersforselect'
            }).then(res => {
                this.$set(this.opt, 'customers', res.data || []);
            });
        },
        getOpport() {
            this.$axios({
                url: '/api/Opportunity/api_opportunityforselect'
            }).then(res => {
                this.$set(this.opt, 'opports', res.data || []);
            });
        },
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
