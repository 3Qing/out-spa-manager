<template>
    <main-wrapper class="ac-doc-wrapper">
        <div slot="header" class="main-header">
            <el-button type="primary" size="mini" @click="beforeSubmit">転記</el-button>
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
            :vendors="vendors"
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
                'AccountID': '',
                Amount: '',
                'CustomerID': '',
                'TeamID': '',
                'EmployeeID': '',
                Comment: ''
            }, {
                DRCR: '',
                'AccountID': '',
                Amount: '',
                'CustomerID': '',
                'TeamID': '',
                'EmployeeID': '',
                Comment: ''
            }, {
                DRCR: '',
                'AccountID': '',
                Amount: '',
                'CustomerID': '',
                'TeamID': '',
                'EmployeeID': '',
                Comment: ''
            }, {
                DRCR: '',
                'AccountID': '',
                Amount: '',
                'CustomerID': '',
                'TeamID': '',
                'EmployeeID': '',
                Comment: ''
            }],
            errors: {}
        };
    },
    mixins: [ mixins ],
    methods: {
        beforeSubmit() {
            if (!(this.form.PostingDate && this.form['DocType'])) {
                this.$message({
                    type: 'warning',
                    message: '転記日及び伝票タイプを入力してください！'
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
                tmp['AccountID'] = item['AccountID'];
                errors[i] = {};
                for (let key in item) {
                    if (['DRCR', 'AccountID', 'Amount'].includes(key) && (item[key] === undefined || item[key] === '')) {
                        errors[i][key] = true;
                    }
                    if (item['AccountID'].BSPL === false) {
                        if (['TeamID', 'EmployeeID'].includes(key) && !(item['TeamID'] || item['EmployeeID'])) {
                            errors[i][key]  = true;
                        }
                    }
                }
                if (tmp.Amount) {
                    tmp.Amount = tmp.Amount.replace(/,/g, '');
                }
                tmp['EmployeeID'] = item['EmployeeID'] || 0;
                tmp['CustomerID'] = item['CustomerID'] || 0;
                tmp['TeamID'] = item['TeamID'] || 0;
                if (!Object.keys(errors[i]).length) {
                    delete errors[i];
                }
                itemsTmp.push(tmp);
            });
            if (itemsTmp.length < 2) {
                this.$message({
                    type: 'warning',
                    message: '伝票明細は最低２つ入力してください！'
                });
                return false;
            }
            if (Object.keys(errors).length) {
                if (itemsTmp.length - Object.keys(errors).length < 2) {
                    this.errors = errors;
                    this.$message({
                        type: 'warning',
                        message: '必須項目を入力してください！'
                    });
                    return false;
                }
            }
            if (borrowTotal !== provideTotal) {
                this.$message({
                    type: 'warning',
                    message: '伝票借方金額と貸方金額が不一致です！'
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
                DocItems: items
            });
        },
        submit(params) {
            const loading = this.$loading({ lock: true, text: 'データ提出中...' });
            this.$axios({
                method: 'POST',
                url: '/api/ACDoc/api_postdocument',
                params,
                custom: {
                    loading,
                    vm: this
                },
                formData: true
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '保存完了'
                    });
                    this.$router.push({
                        name: 'ACDocDetail',
                        params: {
                            id: res.data
                        }
                    });
                }
            });
        }
    }
};
</script>

<style lang="less">
</style>
