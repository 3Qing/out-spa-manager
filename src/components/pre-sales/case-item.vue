<template>
    <div class="case-item">
        <div class="case-header clearfix">
            <el-form size="mini" label-width="150px" label-suffix=":" inline>
                <el-form-item label="商机" class="">
                    <el-select v-if='form.isAddCase' v-model="form.opportunityID">
                        <el-option v-for="item in opt.opports" :key="item.id" :label="item.text" :value="item.id"></el-option>
                    </el-select>
                    <span v-else>{{handleText(form.opportunityID, opt.opports, 'text')}}</span>
                </el-form-item>
                <el-form-item label="提案状態">
                    <el-select size="mini" v-model="form.status">
                        <el-option v-for="item in opport" :key="item.id" :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="客户">
                    <el-select
                        v-if='form.isAddCase'
                        v-model="form.customerID"
                        remote
                        filterable
                        clearable
                        :remote-method="setCustomTitle">
                        <el-option v-for="item in opt.customers" :key="item.id" :label="item.title" :value="item.id"></el-option>
                    </el-select>
                    <span v-if='!form.isAddCase && form.customerID!==0'>{{handleText(form.customerID, opt.customers, 'title')}}</span>
                    <span v-if='!form.isAddCase && form.customerID===0'>{{form.customerTitle || '-'}}</span>
                </el-form-item>
                <el-form-item label="营业">
                    <el-select v-model="form.salesPersonID" >
                        <el-option v-for="item in opt.sales" :key="item.id" :value="item.id" :label="item.name"></el-option>
                    </el-select>
                    <!-- <span v-else>{{handleText(form.salesPersonID, opt.sales, 'name')}}</span> -->
                </el-form-item>
                <el-form-item class="shangji" v-for='(item,index) in form.salesCaseItems' :key='index' :label="item.updateTime">
                    <!-- <el-input  type="input" v-model="form.content" :maxlength="200"></el-input> -->
                    <el-input class="input" v-model="item.content" ></el-input>
                    <el-tooltip class="flot" effect="dark" content="删除" placement="top-start">
                        <i class="el-icon-delete oper-icon" color="danger" @click="deletes(form.id, index)"></i>
                    </el-tooltip>
                    <el-tooltip v-if='(index+1) === form.salesCaseItems.length' class="flot flot1" effect="dark" content="添加" placement="top-start">
                        <i class="el-icon-plus oper-icon" color="primary" @click="adds(form.id)"></i>
                    </el-tooltip>
                </el-form-item>
            </el-form>
            <!-- <el-button class="disk" size="mini" type="warning" @click="beforeSubmit">保存</el-button> -->
        </div>
        <!-- <ul class="case-content" v-if="form.items && form.items.length">
            <li v-for="(item, i) in form.items" :key="i">
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
                    <i class="el-icon-circle-plus-outline" @click="addNewItem" v-if="!isEdit.includes(i) && i === (form.items && form.items.length - 1)" color="primary"></i>
                    <i class="el-icon-edit-outline-outline" v-if="!isEdit.includes(i)" @click="modifyItem(item, i)" color="warning"></i>
                </div>
                <span class="save-btn" v-if="isEdit.includes(i)" @click="submitCaseItem(item, i)" color="primary">保存</span>
            </li>
        </ul> -->
    </div>
</template>

<script>
import moment from 'moment';
export default {
    props: {
        opport: Array,
        datas: Array,
        form: {
            type: Object,
            default: () => ({
                isAddCase: false,
                opportunityID: '',
                customerID: '',
                salesPersonID: '',
                content: '',
                status: '',
                salesCaseItems: [{
                    content: '',
                    updateTime: moment(new Date()).format('YYYY-MM-DD HH:MM')
                }]
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
        if (this.form.salesCaseItems.length>0) {
            this.form.salesCaseItems.forEach((i) => {
                i.updateTime = moment(i.updateTime).format('YYYY-MM-DD HH:MM');
            });
        } else {
            this.form.salesCaseItems = [{
                content: '',
                updateTime: moment(new Date()).format('YYYY-MM-DD HH:MM')
            }];
        }
    },
    methods: {
        initNewCase() {
            // if (!this.form.id) {
            //     this.displayStatus = [this.status[0]];
            // }
            // if (!this.form.items || (this.form.items && !this.form.items.length) && this.form.id) {
            //     this.addNewItem();
            //     if (!this.form.id) {
            //         this.isEdit.push(0);
            //     }
            // }
        },
        getOperText() {
            // if (this.form.edit) {
            return this.form.id ? '保存' : '新增';
            // }
            // return '编辑';
        },
        setCustomTitle(keyword) {
            this.form.customerID = keyword;
        },
        addNewItem() {
            // if (!this.form.items)  this.form.items = [];
            // if (this.form.items && this.form.items.length) {
            //     this.isEdit.push(this.form.items.length);
            // }
            // this.$set(this.form.items, this.form.items.length ? this.form.items.length : 0, {
            //     UpdateDateTime: '',
            //     Content: ''
            // });
        },
        modifyItem(item, i) {
            if (item.UpdateDateTime) {
                item.UpdateDateTime = moment(new Date(item.UpdateDateTime).getTime()).format('YYYY-MM-DD HH:mm');
            } else {
                item.UpdateDateTime = '';
            }
            this.$set(this.form.items, i, item);
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
        handleText(id, arr, field) {
            if (arr !== undefined) {
                for (let item of arr) {
                    if (item.id === id) {
                        return item[field];
                    }
                }
                return '-';
            }
        },
        saveCaseContent(data, i) {
            this.isEdit = this.isEdit.filter(item => item !== i);
        },
        getStatusContent() {
            for (let item of this.status) {
                if (item.val === this.form.status) {
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
            // if (this.form.edit) {
            if (!this.form.salesPersonID) {
                this.$message({
                    type: 'warning',
                    showClose: true,
                    message: '请选择营业'
                });
                return false;
            } else if (!this.form.customerID) {
                this.$message({
                    type: 'warning',
                    showClose: true,
                    message: '请选择客户'
                });
                return false;
            }
            const params = {
                CandidateID: this.opt.id,
                OpportunityID: this.form.opportunityID,
                Content: this.form.content || '',
                CustomerID: this.form.customerID,
                SalesPersonID: this.form.salesPersonID,
                Status: this.form.status
            };
            if (typeof this.form.customerID === 'string') {
                params.CustomerTitle = this.form.customerID;
                params.CustomerID = 0;
            } else {
                params.CustomerID = this.form.customerID;
            }
            if (this.form.id) {
                params['ID'] = this.form.id;
            }
            this.submit(params);
            // }
            // else {
            //     if (!this.form.items.length) {
            //         this.addNewItem();
            //     }
            //     if (!this.form.id) {
            //         this.displayStatus = [this.status[0]];
            //     } else {
            //         this.displayStatus = [...this.status];
            //     }
            //     if (this.form.customerTitle) {
            //         this.form.customerID = this.form.customerTitle;
            //     }
            //     this.$set(this.form, 'edit', !(this.form.edit || false));
            // }
        },
        // 添加
        adds(id) {
            console.log(id);
            this.form.salesCaseItems.push({
                content: '',
                updateTime: moment(new Date()).format('YYYY-MM-DD HH:MM')
            });
            // this.salesCaseItems.push({
            //     content: '',
            //     updateTime: moment(new Date()).format('YYYY-MM-DD HH:MM'),
            //     salesCaseID: id
            // });
            // this.form.salesCases.forEach((item) => {
            //     if(item.id === id) {
            //         item.salesCaseItems.push({
            //             content: '',
            //             updateTime: moment(new Date()).format('YYYY-MM-DD HH:MM')
            //         });
            //     }
            // });
        },
        // 删除
        deletes(id, i) {
            console.log(id);
            this.form.salesCaseItems.splice(i, 1);
            // this.form.salesCases.forEach((item) => {
            //     if(item.id === id) {
            //         this.form.salesCaseItems.splice(i, 1);
            //     }
            // });
            // this.salesCaseItems.splice(i, 1);
        },
        submit(params) {
            let arra = this.datas;
            arra.forEach((item) => {
                item.createDate = moment(item.createDate).format('YYYY-MM-DD HH:MM');
                item.updateTime = moment(item.updateTime).format('YYYY-MM-DD HH:MM');
                delete item.isAddCase;
                item.salesCaseItems.forEach((i) => {
                    i.updateTime = moment(i.updateTime).format('YYYY-MM-DD HH:MM');
                });
            });
            console.log(params, arra);
            const loading = this.$loading({ lock: true, text: '正在提交数据中' });
            this.$axios({
                method: 'POST',
                url: '/api/SalesCase/api_updatesalescases',
                params: {
                    salescases: arra
                },
                custom: {
                    loading,
                    vm: this
                },
                formData: true
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
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
            } else if (!this.form.id) {
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
                'presalescase.ID': this.form.id
            };
            if (item.id) {
                params['ID'] = item.id;
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
        .el-form {
            // display: flex;
            .el-form-item {
                width: 48%;
                .el-form-item__content{
                    width: calc(100% - 150px);
                }
            }
            .shangji {
                width: 100%;
                .el-form-item__content{
                    width: calc(100% - 185px);
                    .el-select{
                        width: 100%;
                    }
                }
                // .el-form-item__content {
                //     width: calc(100% - 185px);
                // }
            }
            // .shangji{
            //     width: 100% !important;
            //     .el-form-item__content{
            //         width: 79%;
            //         .el-select{
            //             width: 100%;
            //         }
            //     }
            // }
        }
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
    .flot{
        position: absolute;
        top: 5px;
        margin-left: 5px;
    }
    .flot1{
        margin-left: 25px !important;
    }
    .display{
        display: none;
    }
    .list-wrapper{
        .case-item:first-child{
            .display{
                display: block;
            }
        }
    }
}
</style>
