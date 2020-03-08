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
                        v-if="edit">
                        <el-option v-for="item in opt.customers" :key="item.ID" :label="item.Title" :value="item.ID"></el-option>
                    </el-select>
                    <span v-else>{{form.CustomerTitle}}</span>
                </el-form-item>
                <el-form-item label="营业">
                    <el-select v-model="form.SalesPersonID" v-if="edit">
                        <el-option v-for="item in opt.sales" :key="item.ID" :value="item.ID" :label="item.Name"></el-option>
                    </el-select>
                    <span v-else>{{form.SalesPersonName}}</span>
                </el-form-item>
                <el-form-item label="概要">
                    <el-input v-if="edit" type="textarea" v-model="form.Content" :maxlength="200" :rows="2"></el-input>
                    <span v-else>{{form.Content}}</span>
                </el-form-item>
            </el-form>
            <el-form class="fl header-status" size="mini" label-width="50px" label-suffix=":">
                <el-form-item label="状态">
                    <el-select v-if="edit" v-model="form.Status" size="mini">
                        <el-option :value="1" label="进行中"></el-option>
                    </el-select>
                    <span v-else :class="[getStatusColor(form.Status)]">{{this.getStatusContent()}}</span>
                </el-form-item>
            </el-form>
            <el-button size="mini" type="primary" @click="beforeSubmit">{{this.getOperText()}}</el-button>
        </div>
        <ul class="case-content">
            <li v-for="(item, i) in form.Items" :key="i">
                <span class="item-index">{{i + 1}}</span>
                <div class="edit-area" v-if="isEdit.includes(i)">
                    <el-date-picker
                        size="mini"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm"
                        format="yyyy-MM-dd HH:mm"
                        v-model="item.UpdateDateTime"></el-date-picker>
                    <el-input size="mini" v-model="item.Content"></el-input>
                </div>
                <p class="display-content" v-else>{{item.UpdateDateTime}} {{item.Content}}</p>
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
                custom: '',
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
    data() {
        return {
            status: [{
                label: '営業可能・平行なし', value: 1
            }, {
                label: '並行面談中', value: 2
            }, {
                label: '営業失敗終了', value: 7
            }, {
                label: '営業取消', value: 8
            }, {
                label: '営業成功終了', value: 9
            }],
            edit: false,
            isEdit: []
        };
    },
    methods: {
        getOperText() {
            if (this.edit) {
                return this.form.ID ? '保存' : '新增';
            }
            return '编辑';
        },
        setCustomTitle(keyword) {
            this.form.custom = keyword;
        },
        addNewItem() {
            this.$set(this.form.Items, this.form.Items.length ? this.form.Items.length - 1 : 0, {
                UpdateDateTime: '',
                Content: '无'
            });
        },
        modifyItem(item, i) {
            item.UpdateDateTime = moment(new Date(item.UpdateDateTime).getTime()).format('YYYY-MM-DD HH:mm');
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
                if (item.value === this.form.Status) {
                    return item.label;
                }
            }
        },
        beforeSubmit() {
            if (this.edit) {
                const params = {
                    'presales.ID': this.opt.ID,
                    Content: this.form.Content,
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
                this.edit = !this.edit;
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
                    this.edit = !this.edit;
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
                params
            }).then(res => {
                if (res.code === 0) {
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
            position: relative;
            margin-bottom: 10px;
        }
        .item-index {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
        }
        .edit-area {
            .el-date-editor.el-input {
                width: 40%;
            }
            .el-input {
                width: 40%;
                margin-left: 5%;
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
            padding: 0 5%;
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
