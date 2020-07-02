<template>
    <main-wrapper class="customer-manager">
        <el-form class="main-header" slot="header" size="mini">
            <el-form-item>
                <el-select v-model="bptype" placeholder="取引先タイプ" @change="changeHandler">
                    <el-option v-for="item in types" :key="item.id" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-button type="primary" size="mini" @click="newHandler" style="margin-left:20px; margin-bottom: 10px;">新規登録</el-button>
            </el-form-item>
        </el-form>
        <div class="main-content">
            <div class="left">
                <el-table size="mini" :data="tableData" @row-click="rowClickHandler" border>
                    <el-table-column label="取引先番号" prop="id" width="100px"></el-table-column>
                    <el-table-column label="名称" prop="title" show-overflow-tooltip></el-table-column>
                    <el-table-column label="タイプ">
                        <template slot-scope="scope">
                            <span>{{formatCxt(scope.row)}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <el-pagination
                    :current-page="page"
                    :page-size="pageSize"
                    @current-change="changePn"
                    :layout="IS_H5 ? 'prev, pager, next' : 'total, prev, pager, next, jumper'"
                    :total="total"></el-pagination>
            </div>
            <el-card class="right display-container">
                <div class="display-header">
                    <el-button size="mini" type="primary" @click="beforeSubmit('edit','showForm')">変更</el-button>
                    <el-button size="mini" type="danger" @click="deleteHandler">削除</el-button>
                </div>
                <el-form class="blackColor" size="mini" ref="showForm" :model="showForm" label-width="140px" :rules="rules">
                    <el-form-item :label="showFields.title" prop="title">
                        <el-input v-model="showForm.title" :placeholder="showFields.title"></el-input>
                    </el-form-item>
                    <el-form-item :label="showFields.abbreTitle" prop="abbreTitle">
                        <el-input maxlength="20" show-word-limit v-model="showForm.abbreTitle" :placeholder="showFields.abbreTitle"></el-input>
                    </el-form-item>
                    <el-form-item :label="showFields.address1">
                        <el-input v-model="showForm.address1" :placeholder="showFields.address1"></el-input>
                    </el-form-item>
                    <el-form-item :label="showFields.address2">
                        <el-input v-model="showForm.address2" :placeholder="showFields.address2"></el-input>
                    </el-form-item>
                    <el-form-item :label="showFields.bank_AccountHolder">
                        <el-input v-model="showForm.bank_AccountHolder" :placeholder="showFields.bank_AccountHolder"></el-input>
                    </el-form-item>
                    <el-form-item :label="showFields.paymentTermID" prop="paymentTermID">
                        <el-select v-model="showForm.paymentTermID">
                            <el-option v-for="item in payments" :key="item.id" :label="item.title" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item :label="showFields.customerFlag" prop="customerFlag">
                                <el-checkbox v-model="showForm.customerFlag"></el-checkbox>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item :label="showFields.vendorFlag" prop="vendorFlag">
                                <el-checkbox v-model="showForm.vendorFlag"></el-checkbox>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item :label="showFields.contactPerson">
                        <el-input v-model="showForm.contactPerson" :placeholder="showFields.contactPerson"></el-input>
                    </el-form-item>
                    <el-form-item :label="showFields.tel">
                        <el-input v-model="showForm.tel" :placeholder="showFields.tel"></el-input>
                    </el-form-item>
                    <el-form-item :label="showFields.fax">
                        <el-input v-model="showForm.fax" :placeholder="showFields.fax"></el-input>
                    </el-form-item>
                    <el-form-item :label="showFields.postal">
                        <el-input v-model="showForm.postal" :placeholder="showFields.postal"></el-input>
                    </el-form-item>
                </el-form>
            </el-card>
        </div>
        <el-dialog :visible.sync="visible" title="新規登録" @close="close('curForm')">
            <el-form class="blackColor" size="mini" ref="curForm" :model="curForm" label-width="140px" :rules="rules">
                <el-form-item :label="showFields.title" prop="title">
                    <el-input v-model="curForm.title" :placeholder="showFields.title"></el-input>
                </el-form-item>
                <el-form-item :label="showFields.abbreTitle" prop="abbreTitle">
                    <el-input v-model="showForm.abbreTitle" maxlength="20" show-word-limit :placeholder="showFields.abbreTitle"></el-input>
                </el-form-item>
                <el-form-item :label="showFields.address1">
                    <el-input v-model="curForm.address1" :placeholder="showFields.address1"></el-input>
                </el-form-item>
                <el-form-item :label="showFields.address2">
                    <el-input v-model="curForm.address2" :placeholder="showFields.address2"></el-input>
                </el-form-item>
                <el-form-item :label="showFields.bank_AccountHolder">
                    <el-input v-model="curForm.bank_AccountHolder" :placeholder="showFields.bank_AccountHolder"></el-input>
                </el-form-item>
                <el-form-item :label="showFields.paymentTermID" prop="paymentTermID">
                    <el-select v-model="curForm.paymentTermID">
                        <el-option v-for="item in payments" :key="item.id" :label="item.title" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item :label="showFields.customerFlag" prop="customerFlag">
                            <el-checkbox v-model="curForm.customerFlag"></el-checkbox>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item :label="showFields.vendorFlag" prop="vendorFlag">
                            <el-checkbox v-model="curForm.vendorFlag"></el-checkbox>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item :label="showFields.contactPerson">
                    <el-input v-model="curForm.contactPerson" :placeholder="showFields.contactPerson"></el-input>
                </el-form-item>
                <el-form-item :label="showFields.tel">
                    <el-input v-model="curForm.tel" :placeholder="showFields.tel"></el-input>
                </el-form-item>
                <el-form-item :label="showFields.fax">
                    <el-input v-model="curForm.fax" :placeholder="showFields.fax"></el-input>
                </el-form-item>
                <el-form-item :label="showFields.postal">
                    <el-input v-model="curForm.postal" :placeholder="showFields.postal"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="mini" @click="close">取消</el-button>
                <el-button size="mini" type="primary" @click="beforeSubmit('add', 'curForm')">保存</el-button>
            </div>
        </el-dialog>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import { mapGetters } from 'vuex';
export default {
    components: {
        MainWrapper
    },
    data() {
        return {
            bptype: 0,
            types: [{
                label: '全部', value: 0
            }, {
                label: '得意先', value: 1
            }, {
                label: '仕入先', value: 2
            }],
            tableData: [],
            page: 1,
            pageSize: 15,
            total: 0,
            showFields: {
                abbreTitle: '略称',
                address1: '住所（番地まで）',
                address2: '住所（詳細）',
                bank_AccountHolder: '銀行名義人',
                contactPerson: '連絡担当',
                customerFlag: '得意先フラグ',
                fax: 'FAX',
                tel: '電話',
                postal: '郵便番号',
                title: '名称',
                vendorFlag: '仕入先フラグ',
                paymentTermID: '支払条件'
            },
            rules: {
                abbreTitle: [
                    { required: true, message: '请输入略称', trigger: 'blur' }
                ],
                title: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ],
                paymentTermID: [
                    { required: true, message: '请输入支払条件', trigger: 'blur' }
                ],
                customerFlag: [
                    { required: true, message: '请选择得意先フラグ', trigger: 'blur' }
                ],
                vendorFlag: [
                    { required: true, message: '请选择仕入先フラグ', trigger: 'blur' }
                ]
            },
            showForm: {},
            curForm: {},
            curId: '',
            visible: false,
            payments: []
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getData();
            vm.getPayment();
        });
    },
    computed: {
        ...mapGetters(['IS_H5'])
    },
    methods: {
        getData() {
            const loading = this.$loading({ lock: true, text: 'データ取得中...' });
            this.$axios({
                url: '/api/Customer/api_getcustomerlist',
                params: {
                    bptype: this.bptype,
                    page: this.page,
                    pagesize: this.pageSize
                }
            }).then(res => {
                loading.close();
                if (res.code === 0) {
                    const data = res.data || {};
                    this.total = data.total || 0;
                    this.tableData = data.data || [];
                    if (data.data.length) {
                        if (this.curId) {
                            const curForm = data.data.filter(item => item.id === this.curId);
                            if (curForm.length) {
                                this.handlerForm(curForm[0]);
                                return;
                            }
                        }
                        this.handlerForm(data.data[0]);
                    }
                }
            });
        },
        getPayment() {
            this.$axios({
                url: '/api/PaymentTerm/api_paymenttermsforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.payments = res.data || [];
                }
            });
        },
        handlerForm(data) {
            const form = { ...this.showFields };
            for (let key in form) {
                if (key === 'vendorFlag' || key === 'customerFlag') {
                    form[key] = !!data[key];
                } else {
                    form[key] = data[key] || '';
                }
            }
            this.curId = data.id;
            this.showForm = { ...form };
            this.showForm.companyID = data.companyID;
        },
        formatCxt(row) {
            if (row.customerFlag && !row.vendorFlag) {
                return '得意先';
            } else if (!row.customerFlag && row.vendorFlag) {
                return '仕入先';
            } else if (row.customerFlag && row.vendorFlag) {
                return '得意先＆仕入先';
            }
            return '-';
        },
        changePn(page) {
            this.page = page;
            this.getData();
        },
        changeHandler() {
            this.page = 1;
            this.getData();
        },
        rowClickHandler(row) {
            this.handlerForm(row);
        },
        deleteHandler() {
            this.$confirm('削除しますか？', '削除', {
                type: 'warning'
            }).then(() => {
                this.$axios({
                    url: '/api/Customer/api_deletecustomer',
                    params: {
                        id: this.curId
                    }
                }).then(res => {
                    if (res.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '削除完了'
                        });
                        this.getData();
                        this.curId = '';
                    } else {
                        this.$message({
                            type: 'warning',
                            message: res.message
                        });
                    }
                });
            }).catch(() => {});
        },
        newHandler() {
            this.curForm = {
                address1: '',
                address2: '',
                bank_AccountHolder: '',
                contactPerson: '',
                customerFlag: false,
                fax: '',
                postal: '',
                title: '',
                vendorFlag: false
            };
            this.visible = true;
        },
        close(formName) {
            this.visible = false;
            this.curForm = {};
            this.$refs[formName].resetFields();
        },
        beforeSubmit(type, restd) {
            this.$refs[restd].validate((valid) => {
                if (valid) {
                    let form = {};
                    if (type === 'edit') {
                        form = { ...this.showForm };
                    } else {
                        form = { ...this.curForm };
                    }
                    const params = {
                        AbbreTitle: form.abbreTitle,
                        Title: form.title,
                        Bank_AccountHolder: form.bank_AccountHolder,
                        Postal: form.postal,
                        Address1: form.address1,
                        Address2: form.address2,
                        Tel: form.tel,
                        Fax: form.fax,
                        ContactPerson: form.contactPerson,
                        CustomerFlag: form.customerFlag,
                        VendorFlag: form.vendorFlag,
                        PaymentTermID: form.paymentTermID
                    };
                    if (type === 'edit') {
                        params.ID = this.curId;
                        params.CompanyID = this.showForm.companyID;
                    }
                    if (!params.Title) {
                        this.$message({
                            type: 'warning',
                            message: '名称を入力してください！'
                        });
                        return;
                    } else if (!params.CustomerFlag && !params.VendorFlag) {
                        this.$message({
                            type: 'warning',
                            message: `${this.showFields.CustomerFlag}と${this.showFields.VendorFlag}最低一つ選択してください！`
                        });
                    } else {
                        this.submit(params, type);
                        this.$refs[restd].resetFields();
                    }
                }
            });
        },
        submit(params, type) {
            const loading = this.$loading({ lock: true, text: 'データ提出中...' });
            this.$axios({
                method: 'POST',
                url: '/api/Customer/api_updatecustomer',
                params,
                formData: true,
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(res => {
                loading.close();
                if (res.code === 0) {
                    this.$message({
                        type: 'success',
                        message: type === 'edit' ? '更新完了' : '作成完了'
                    });
                    if (type === 'add') {
                        this.close();
                    }
                    this.getData();
                } else {
                    this.$message({
                        type: 'warning',
                        message: res.message
                    });
                }
            });
        }
    }
};
</script>

<style scoped lang="less">
.customer-manager {
    .main-content {
        display: flex;
        justify-content: space-between;
        .left {
            width: 45%;
        }
        .right {
            width: 50%;
        }
    }
    .display-container {
        padding: 15px;
        border-radius: 8px;
        text-align: left;
        // border: 1px solid #DCDFE6;
        .display-header {
            margin-bottom: 20px;
        }
    }
}
</style>
