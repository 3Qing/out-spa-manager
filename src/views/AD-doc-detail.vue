<template>
    <main-wrapper class="ad-doc-detail">
        <div slot="header" class="main-header">
            <el-button type="primary" size="mini" @click="$router.back()">返回</el-button>
        </div>
        <card-item
            :form="form"
            :items="items"
            :doc-types="docTypes"
            :ac-counts="acCounts"
            :teams="teams"
            :employees="employees"
            :customs="customs"
            :drcr="drcr"></card-item>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import CardItem from '@components/ad-document/card-detail';
import mixins from '@components/ad-document/mixins';
export default {
    components: {
        MainWrapper,
        CardItem
    },
    data() {
        return {
            items: []
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getData();
        });
    },
    mixins: [ mixins ],
    methods: {
        getData() {
            const loading = this.$loading({ lock: true, text: '正在获取数据' });
            this.$axios({
                url: '/api/getdocumentbyid',
                params: {
                    id: this.$route.params.id
                },
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.form = res.data || {};
                    this.items = res.data.items || [];
                }
            });
        }
    }
};
</script>

<style scoped>

</style>
