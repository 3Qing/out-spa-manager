<template>
    <main-wrapper class="ac-doc-wrapper">
        <div slot="header" class="main-header">
            <el-button type="primary" size="mini" @click="beforeSubmit">保存</el-button>
        </div>
        <card-item
            :form="form"
            :items="items"
            :doc-types="docTypes"
            :ac-counts="acCounts"
            :teams="teams"
            :employees="employees"
            :customs="customs"
            :drcr="drcr"
            :errors="errors"></card-item>
    </main-wrapper>
</template>

<script>
import MainWrapper  from '@components/main-wrapper';
import CardItem from '@components/ac-document/card';
import mixins from '@components/ac-document/mixins';

export default {
    components: {
        MainWrapper,
        CardItem
    },
    data() {
        return {
            items: [{
                DRCR: '',
                'account.ID': '',
                Amount: '',
                'customer.ID': '',
                'team.TeamID': '',
                'employee.ID': '',
                Comment: ''
            }, {
                DRCR: '',
                'account.ID': '',
                Amount: '',
                'customer.ID': '',
                'team.TeamID': '',
                'employee.ID': '',
                Comment: ''
            }, {
                DRCR: '',
                'account.ID': '',
                Amount: '',
                'customer.ID': '',
                'team.TeamID': '',
                'employee.ID': '',
                Comment: ''
            }, {
                DRCR: '',
                'account.ID': '',
                Amount: '',
                'customer.ID': '',
                'team.TeamID': '',
                'employee.ID': '',
                Comment: ''
            }],
            errors: {}
        };
    },
    mixins: [ mixins ],
    methods: {
        beforeSubmit() {
            if (!(this.form.PostingDate && this.form['doctype.ID'])) {
                this.$message({
                    type: 'warning',
                    message: '请填写転記日或伝票タイプ'
                });
                return false;
            }
            let borrowTotal = 0;
            let provideTotal = 0;
            const itemsTmp = [];
            const errors = {};
            // 校验必填字段
            this.items.forEach((item, i) => {
                const tmp = { ...item };
                if (item.DRCR) {
                    borrowTotal += (item.Amount && Number(item.Amount.replace(/,/g, ''))) || 0;
                } else {
                    provideTotal += (item.Amount && Number(item.Amount.replace(/,/g, ''))) || 0;
                }
                tmp['account.ID'] = item['account.ID'].ID;
                errors[i] = {};
                for (let key in item) {
                    if (['DRCR', 'account.ID', 'Amount'].includes(key) && (item[key] === undefined || item[key] === '')) {
                        errors[i][key] = true;
                    }
                    if (item['account.ID'].BSPL === false) {
                        if (['team.TeamID', 'employee.ID'].includes(key) && !(item['team.TeamID'] || item['employee.ID'])) {
                            errors[i][key]  = true;
                        }
                    }
                }
                if (tmp.Amount) {
                    tmp.Amount = tmp.Amount.replace(/,/g, '');
                }
                tmp['employee.ID'] = item['employee.ID'] || 0;
                tmp['customer.ID'] = item['customer.ID'] || 0;
                tmp['team.TeamID'] = item['team.TeamID'] || 0;
                if (!Object.keys(errors[i]).length) {
                    delete errors[i];
                }
                itemsTmp.push(tmp);
            });
            if (itemsTmp.length < 2) {
                this.$message({
                    type: 'warning',
                    message: '至少两条明细数据'
                });
                return false;
            }
            if (Object.keys(errors).length) {
                if (itemsTmp.length - Object.keys(errors).length < 2) {
                    this.errors = errors;
                    this.$message({
                        type: 'warning',
                        message: '请填写信息'
                    });
                    return false;
                }
            }
            if (borrowTotal !== provideTotal) {
                this.$message({
                    type: 'warning',
                    message: '借方金额合计不等于贷方金额合计'
                });
                return false;
            }
            this.errors = {};
            const items = [];
            itemsTmp.forEach((item, i) => {
                if (!errors[i]) {
                    items.push(item);
                }
            });
            this.submit({
                ...this.form,
                items: items
            });
        },
        submit(params) {
            const loading = this.$loading({ lock: true, text: '正在提交数据' });
            this.$axios({
                method: 'POST',
                url: '/api/postdocument',
                params,
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    });
                    this.$router.push({
                        name: 'ACDocDetail',
                        params: {
                            id: res.data
                        }
                    });
                } else {
                    this.$message({
                        type: 'error',
                        message: res ? res.message : '接口开小差了，没有返回信息'
                    });
                }
            });
        }
    }
};
</script>

<style lang="less">
</style>
