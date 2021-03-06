<template>
    <main-wrapper class="ac-doc-wrapper" :class="[!show && 'hidden-card']">
        <div slot="header" class="main-header">
            <el-button type="primary" size="mini" @click="beforeSubmit" v-if="show">転記</el-button>
            <upload :opt="{
                btnText: '上传文件',
                accept: 'image/*, application/pdf',
                show: false
            }" @upload="upload"></upload>
        </div>
        <el-row v-if="show">
            <el-col :span="12">
                <div class="preview-image"><img :src="img"></div>
            </el-col>
            <el-col :span="12">
                <card-item
                    :ocr="true"
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
            </el-col>
        </el-row>
    </main-wrapper>
</template>

<script>
import MainWrapper  from '@components/main-wrapper';
import CardItem from '@components/ac-document/card';
import mixins from '@components/ac-document/mixins';
import Upload from '@components/upload';
import { mapGetters } from 'vuex';
import moment from 'moment';
import { fileToBase64 } from '@_public/utils';

export default {
    components: {
        MainWrapper,
        CardItem,
        Upload
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
            errors: {},
            show: false,
            img: ''
        };
    },
    mixins: [ mixins ],
    computed: {
        ...mapGetters([ 'POST_LOADING' ])
    },
    methods: {
        upload({ file }) {
            const loading = this.$loading({ lock: true, text: this.POST_LOADING });
            this.$axios({
                method: 'POST',
                url: '/api/ACDoc/api_proposedocumentbyocr',
                params: {
                    file: file
                },
                formData: true
            }).then(res => {
                loading.close();
                fileToBase64(file).then(result => {
                    this.img = result;
                });
                if (res && res.code === 0) {
                    const data = res.data || {};
                    const items = data.docItems || [];
                    this.items = items.map(item => ({
                        DRCR: item.drcr,
                        'AccountID': item.accountID,
                        Amount: item.amount,
                        'CustomerID': item.customerID,
                        'TeamID': item.teamID,
                        'EmployeeID': item.employeeID,
                        Comment: item.comment
                    }));
                    this.items.forEach(item => {
                        if (item.CustomerID === 0) {
                            item.CustomerID = '';
                        }
                        if (item.EmployeeID === 0) {
                            item.EmployeeID = '';
                        }
                        if (item.TeamID === 0) {
                            item.TeamID = '';
                        }
                    });
                    this.form = {
                        PostingDate: moment(new Date(data.postingDate).getTime()).format('YYYY-MM-DD'),
                        DocType: data.docType,
                        Comment: data.comment
                    };
                    this.show = true;
                }
            });
        },
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
            console.log(this.items);
            this.items.forEach((item, i) => {
                const tmp = { ...item };
                if (item.DRCR) {
                    borrowTotal += (item.Amount) || 0;
                } else {
                    provideTotal += (item.Amount) || 0;
                }
                // console.log(item['AccountID']);
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
                // if (tmp.Amount) {
                //     tmp.Amount = tmp.Amount;
                // }
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
.ac-doc-wrapper {
    .main-header {
        .upload-wrapper {
            display: inline-block;
            vertical-align: top;
            margin: 11px 0 0 15px;
        }
    }
    &.hidden-card {
        .content-wrapper {
            & > div {
                display: none;
            }
        }
    }
    .preview-image {
        width: 100%;
        img {
            width: 100%;
        }
    }
    .ac-box {
        width: 100% !important;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1) !important;
        text-align: left;
    }
}
</style>
