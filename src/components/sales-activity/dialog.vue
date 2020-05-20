<template>
    <el-dialog :title="`${baseForm.ID ? '编辑' : '新增'}`" custom-class="sales-dialog" :visible.sync="visible" @close="close">
        <div class="oper-area">
            <el-button size="mini" type="primary" @click="beforeUpdate">{{baseForm.ID ? '更新' : '保存'}}</el-button>
        </div>
        <edit-form v-if="showForm" ref="formWrapper" :data="baseForm" :edit="edit" :opt="opt"></edit-form>
    </el-dialog>
</template>

<script>
import EditForm from './edit';
import moment from 'moment';

export default {
    components: {
        EditForm
    },
    data() {
        return {
            visible: false,
            edit: false,
            opt: {},
            baseForm: {
                AtyDate: '',
                AtyWeekDay: '',
                AtyMinutes: 60,
                AtyType: 1,
                AtyLocation: '',
                AtyPurpose: '',
                BusinessFlow: '',
                EmployeeID: '',
                EmployeeName: '',
                SalesPersonID: '',
                SalesPerson: '',
                Status: '',
                AtyResult: ''
            },
            showForm: true,
            callback: null
        };
    },
    mounted() {
        this.$root.$off('SHOW_ATY_DIALOG');
        this.$root.$on('SHOW_ATY_DIALOG', ({ data = null, edit = false, opt = null, callback = null }) => {
            this.edit = edit;
            this.showForm = true;
            if (data) {
                this.baseForm = JSON.parse(JSON.stringify(data));
            } else {
                this.baseForm = {
                    AtyDate: '',
                    AtyWeekDay: '',
                    AtyMinutes: 60,
                    AtyType: 1,
                    Status: '',
                    AtyLocation: '',
                    AtyPurpose: '',
                    BusinessFlow: '',
                    EmployeeID: '',
                    EmployeeName: '',
                    SalesPersonID: '',
                    SalesPerson: '',
                    AtyResult: ''
                };
            }
            if (opt.Date) {
                this.$set(this.baseForm, 'AtyDate', moment(new Date(opt.Date).setHours(10)).format('YYYY-MM-DD HH:mm'));
            } else {
                this.$set(this.baseForm, 'AtyDate', moment(new Date(this.baseForm.AtyDate).getTime()).format('YYYY-MM-DD HH:mm'));
            }
            if (!this.baseForm.Status) {
                this.$set(this.baseForm, 'Status', '');
            }
            this.callback = callback;
            this.opt = opt;
            this.visible = true;
        });
    },
    methods: {
        close() {
            this.visible = false;
            this.$refs.formWrapper.$refs.form.resetFields();
                
            const time = setTimeout(() => {
                clearTimeout(time);
                this.showForm = false;
            }, 100);
        },
        cancelAty() {
            this.baseForm.Status = 8;
            this.beforeUpdate();
        },
        beforeUpdate() {
            this.$refs.formWrapper.$refs.form.validate(valid => {
                if (valid) {
                    const formData = new FormData();
                    for (let key in this.baseForm) {
                        if (key === 'SalesPersonID') {
                            formData.append('SalesPersonID', this.baseForm[key]);
                        } else if (key === 'EmployeeID') {
                            formData.append('CandidateID', this.baseForm[key]);
                        } else if (key === 'AtyDate') {
                            formData.append('AtyDate', this.baseForm[key]);
                        } else if (key === 'Status') {
                            formData.append(key, this.baseForm[key] || 0);
                        } else if (!'SalesPerson,EmployeeName'.includes(key)) {
                            formData.append(key, this.baseForm[key]);
                        }
                    }
                    this.submit(formData);
                }
            });
        },
        submit(params) {
            const loading = this.$loading({ lock: true, text: '正在提交活动信息中...' });
            this.$axios({
                method: 'POST',
                url: '/api/SalesActivity/api_updatesalesactivity',
                params,
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.close();
                    this.callback && this.callback();
                } else {
                    this.$message({
                        type: 'error',
                        showClose: true,
                        message: res.message ? res.message : '接口开小差了，没有返回信息'
                    });
                }
            });
        }
    }
};
</script>

<style lang="less">
.sales-dialog {
    max-width: 800px !important;
    .el-dialog__body {
        padding-top: 0;
    }
    .oper-area {
        text-align: right;
        margin-bottom: 10px;
    }
    .el-form {
        .el-form-item {
            width: 100% !important;
            .el-select, .el-input, .el-textarea, .el-date-editor {
                width: 300px;
            }
        }
    }
}
</style>
