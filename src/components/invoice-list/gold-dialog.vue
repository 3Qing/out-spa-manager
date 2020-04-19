<template>
    <el-dialog custom-class="invoice-gold-dialog" title="入金" :visible.sync="visible" @close="close">
        <el-form size="small" label-width="100px" ref="form" :model="form" :rules="rules">
            <el-form-item label="入金日期" prop="IncomeDate">
                <el-date-picker
                    type="date"
                    v-model="form.IncomeDate"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item label="入金金额" prop="IncomeAmount">
                <el-input v-model.number="form.IncomeAmount"></el-input>
            </el-form-item>
            <el-form-item label="支付人姓名" prop="PayerName">
                <el-input v-model="form.PayerName"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button size="small" @click="close">取消</el-button>
            <el-button size="small" type="primary" @click="beforeSubmit">保存</el-button>
        </div>
    </el-dialog>
</template>

<script>
import moment from 'moment';
export default {
    data() {
        return {
            visible: false,
            form: {
                IncomeDate: '',
                IncomeAmount: '',
                PayerName: ''
            },
            rules: {
                IncomeDate: [{
                    required: true, validator: this.checkEmpyt, msg: '请选择入金日期', trigger: 'blur'
                }],
                IncomeAmount: [{
                    required: true, validator: this.checkEmpyt, msg: '请输入入金金额', trigger: 'blur'
                }],
                PayerName: [{
                    required: true, validator: this.checkEmpyt, msg: '请输入支付人姓名', trigger: 'blur'
                }]
            },
            data: {},
            callback: null
        };
    },
    mounted() {
        this.$root.$off('SHOW_GOLD_DIALOG');
        this.$root.$on('SHOW_GOLD_DIALOG', ({ data = null, callback = null }) => {
            this.form.IncomeDate = new Date();
            this.data = data;
            this.callback = callback;
            this.visible = true;
        });
    },
    methods: {
        checkEmpyt(rule, value, callback) {
            if (value) {
                callback();
            } else {
                callback(new Error(rule.msg));
            }
        },
        close() {
            this.$refs.form.resetFields();
            this.visible = false;
        },
        beforeSubmit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    // let params = {
                    //     invoices: [ Number(this.data.ID) ]
                    // };
                    const params = new FormData();
                    params.append('invoiceids[0]', this.data.ID);
                    for (let key in this.form) {
                        if (key === 'IncomeDate') {
                            params.append('date', moment(this.form[key]).format('YYYY-MM-DD'));
                        } else if (key === 'IncomeAmount') {
                            params.append('amount', this.form[key]);
                        } else {
                            params.append('payer', this.form[key]);
                        }
                    }
                    // params = Object.assign(params, this.form);
                    this.submit(params);
                }
            });
        },
        submit(params) {
            // console.log(qs.stringify(params, {arrayFormat: 'indices', allowDots: true}));
            this.$axios({
                method: 'POST',
                url: `/api/collectsales`,
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                params,
                custom: {
                    vm: this
                }
            }).then(res => {
                if (res && res.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '入金成功'
                    });
                    this.callback();
                    this.close();
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

<style scoped lang="less">
.invoice-gold-dialog {
    .el-input {
        width: 100%;
    }
}
</style>
