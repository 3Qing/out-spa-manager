<template>
    <div class="case-item">
        <div class="case-header clearfix">
            <el-form class="header-left fl" size="mini" label-width="50px" label-suffix=":">
                <el-form-item label="客户">
                    <el-select
                        v-model="form.CustomerID"
                        remote
                        filterable
                        clearable
                        :remote-method="setCustomTitle"
                        v-if="form.edit">
                        <el-option v-for="item in opt.customers" :key="item.ID" :label="item.Title" :value="item.ID"></el-option>
                    </el-select>
                    <span v-else>{{form.CustomerTitle}}</span>
                </el-form-item>
                <el-form-item label="营业">
                    <el-select v-model="form.SalesPersonID" v-if="form.edit">
                        <el-option v-for="item in opt.sales" :key="item.ID" :value="item.ID" :label="item.Name"></el-option>
                    </el-select>
                    <span v-else>{{form.SalesPersonName}}</span>
                </el-form-item>
                <el-form-item label="概要">
                    <el-input v-if="form.edit" type="textarea" v-model="form.Content" :maxlength="200" :rows="2"></el-input>
                    <span v-else>{{form.Content}}</span>
                </el-form-item>
            </el-form>
            <el-form class="fl header-status" size="mini" label-width="50px" label-suffix=":">
                <el-form-item label="状态">
                    <el-select v-if="form.edit" v-model="form.Status" size="mini">
                        <el-option v-for="item in displayStatus" :key="item.val" :value="item.val" :label="item.label"></el-option>
                    </el-select>
                    <span v-else :class="[getStatusColor(form.Status)]">{{this.getStatusContent()}}</span>
                </el-form-item>
            </el-form>
            <el-button size="mini" type="primary" @click="beforeSubmit">{{this.getOperText()}}</el-button>
        </div>
        <ul class="case-content">
            <li v-for="(item, i) in form.Items" :key="i">
                <div class="edit-area" v-if="isEdit.includes(i)">
                    <el-date-picker
                        size="mini"
                        type="datetime"
                        format="yyyy-MM-dd HH:mm"
                        value-format="yyyy-MM-dd HH:mm"
                        default-time="10:00:00"
                        v-model="item.UpdateDateTime"></el-date-picker>
                    <el-input size="mini" v-model="item.Content"></el-input>
                </div>
                <p class="display-content" v-else><span class="item-index">{{i + 1}}.</span>{{formatDate(item.UpdateDateTime)}} {{item.Content}}</p>
                <div class="oper-area">
                    <i class="el-icon-circle-plus-outline" @click="addNewItem" v-if="!isEdit.includes(i) && i === form.Items.length - 1" color="primary"></i>
                    <i class="el-icon-edit-outline" v-if="!isEdit.includes(i)" @click="modifyItem(item, i)" color="warning"></i>
                </div>
                <span class="save-btn" v-if="isEdit.includes(i)" @click="submitCaseItem(item, i)" color="primary">保存</span>
            </li>
        </ul>
    </div>
</template>

<script>
import moment from 'moment';
export default {
    props: {
        form: {
            type: Object,
            default: () => ({
                edit: false,
                CustomerID: '',
                SalesPersonID: '',
                SalesPersonName: '',
                Content: '',
                Status: '',
                Items: []
            })
        },
        opt: {
            type: Object,
            default: () => ({
                customers: [],
                sales: []
            })
        }
    },
    inject: [ 'status' ],
    data() {
        return {
            displayStatus: [],
            isEdit: []
        };
    },
    watch: {
        form() {
            this.initNewCase();
        }
    },
    mounted() {
        this.initNewCase();
    },
    methods: {
        initNewCase() {
            if (!this.form.ID) {
                this.displayStatus = [this.status[0]];
            }
            if (!this.form.Items.length && this.form.ID) {
                this.addNewItem();
                if (!this.form.ID) {
                    this.isEdit.push(0);
                }
            }
        },
        getOperText() {
            if (this.form.edit) {
                return this.form.ID ? '保存' : '新增';
            }
            return '编辑';
        },
        setCustomTitle(keyword) {
            this.form.CustomerID = keyword;
        },
        addNewItem() {
            if (this.form.Items.length) {
                this.isEdit.push(this.form.Items.length);
            }
            this.$set(this.form.Items, this.form.Items.length ? this.form.Items.length : 0, {
                UpdateDateTime: '',
                Content: ''
            });
        },
        modifyItem(item, i) {
            if (item.UpdateDateTime) {
                item.UpdateDateTime = moment(new Date(item.UpdateDateTime).getTime()).format('YYYY-MM-DD HH:mm');
            } else {
                item.UpdateDateTime = '';
            }
            this.$set(this.form.Items, i, item);
            this.isEdit.push(i);
        },
        getStatusColor(status) {
            switch (Number(status)) {
                case 1:
                    return 'co-primary';
                case 2:
                    return 'co-primary';
                case 7:
                case 8:
                    return 'co-danger';
                case 9:
                    return 'co-success';
                default:
                    return '';
            }
        },
        saveCaseContent(data, i) {
            this.isEdit = this.isEdit.filter(item => item !== i);
        },
        getStatusContent() {
            for (let item of this.status) {
                if (item.val === this.form.Status) {
                    return item.label;
                }
            }
        },
        formatDate(time) {
            if (time) {
                return moment(new Date(time).getTime()).format('YYYY-MM-DD HH:mm');
            }
            return '';
        },
        beforeSubmit() {
            if (this.form.edit) {
                if (!this.form.SalesPersonID) {
                    this.$message({
                        type: 'warning',
                        showClose: true,
                        message: '请选择营业'
                    });
                    return false;
                } else if (!this.form.CustomerID) {
                    this.$message({
                        type: 'warning',
                        showClose: true,
                        message: '请选择客户'
                    });
                    return false;
                } else if (!this.form.Status) {
                    this.$message({
                        type: 'warning',
                        showClose: true,
                        message: '请选择状态'
                    });
                    return false;
                }
                const params = {
                    'presales.ID': this.opt.ID,
                    Content: this.form.Content || '',
                    CustomerTitle: '',
                    'salesperson.ID': this.form.SalesPersonID,
                    Status: this.form.ID ? this.form.Status : 1
                };
                if (typeof this.form.CustomerID === 'string') {
                    params.CustomerTitle = this.form.CustomerID;
                    params['customer.ID'] = 0;
                } else {
                    params['customer.ID'] = this.form.CustomerID;
                }
                if (this.form.ID) {
                    params['ID'] = this.form.ID;
                }
                this.submit(params);
            } else {
                if (!this.form.Items.length) {
                    this.addNewItem();
                }
                if (!this.form.ID) {
                    this.displayStatus = [this.status[0]];
                } else {
                    this.displayStatus = [...this.status];
                }
                if (this.form.CustomerTitle) {
                    this.form.CustomerID = this.form.CustomerTitle;
                }
                this.$set(this.form, 'edit', !(this.form.edit || false));
            }
        },
        submit(params) {
            const loading = this.$loading({ lock: true, text: '正在提交数据中' });
            this.$axios({
                method: 'POST',
                url: '/api/updatepresalescase',
                params,
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res.code === 0) {
                    this.form.edit = !this.form.edit;
                    this.$emit('update');
                } else {
                    this.$message({
                        type: 'error',
                        showClose: true,
                        message: res.message ? res.message : '接口开小差了，没有返回信息'
                    });
                }
            });
        },
        submitCaseItem(item, i) {
            if (!item.Content || !item.UpdateDateTime) {
                this.$message({
                    type: 'warning',
                    showClose: true,
                    message: '请选择时间并填写内容'
                });
                return false;
            } else if (!this.form.ID) {
                this.$message({
                    type: 'warning',
                    showClose: true,
                    message: '请先新增Case信息'
                });
                return false;
            }
            const params = {
                Content: item.Content,
                UpdateDateTime: item.UpdateDateTime + ':00',
                'presalescase.ID': this.form.ID
            };
            if (item.ID) {
                params['ID'] = item.ID;
            }
            this.$axios({
                method: 'POST',
                url: '/api/updatesalescaseitem',
                params,
                custom: {
                    vm: this
                }
            }).then(res => {
                if (res && res.code === 0) {
                    this.isEdit.splice(this.isEdit.indexOf(i), 1);
                    this.$emit('update');
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
.case-item {
    margin-top: 20px;
    border-radius: 4px;
    padding: 10px;
    border: 1px solid #DCDFE6;
    ul {
        list-style: none;
    }
    .case-header {
        position: relative;
        .header-left {
            width: 40%;
        }
        .header-status {
            width: 45%;
        }
        .el-button {
            position: absolute;
            right: 0;
            top: 0;
        }
        .el-form-item {
            margin-bottom: 10px;
        }
    }
    .case-content {
        li {
            height: 24px;
            position: relative;
            margin-bottom: 10px;
            padding-left: 7px;
        }
        .item-index {
            margin-right: 5px;
        }
        .edit-area {
            .el-date-editor.el-input {
                width: 40%;
                margin-right: 5%;
            }
            .el-input {
                width: 45%;
            }
        }
        .oper-area {
            position: absolute;
            right: 0;
            top: 50%;
            font-size: 18px;
            transform: translateY(-50%);
            i {
                cursor: pointer;
                & + i {
                    margin-left: 5px;
                }
            }
        }
        .display-content {
            padding: 0 5% 0 0;
        }
        .save-btn {
            position: absolute;
            right: 0;
            top: 50%;
            cursor: pointer;
            transform: translateY(-50%);
        }
    }
}
</style>
