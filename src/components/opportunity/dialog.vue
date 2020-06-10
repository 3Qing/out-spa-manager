<template>
    <el-dialog
        custom-class="opport-dialog"
        :visible.sync="visible"
        :title="form.id ? '编辑' : '新增'"
        :close-on-click-modal="dialog"
        @close="close">
        <el-form size="mini" label-width="120px" :model="form" :rules="rules" ref="form">
            <el-form-item label="商家标签" prop="tags">
                <el-checkbox-group v-model="form.tags" size="mini">
                    <el-checkbox-button v-for="item in tags" :label="item.id" :key="item.id">{{item.tagName}}</el-checkbox-button>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="客户清单" prop="customerID">
                <el-select
                    v-model="form.customerID"
                    placeholder="選択また入力"
                    remote
                    filterable
                    clearable
                    @clear="clearHandle"
                    :remote-method="setCustomTitle">
                    <el-option v-for="item in customers" :key="item.id" :label="item.title" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商家状态">
                <el-select v-model="form.status">
                    <el-option v-for="item in allStatus" :key="item.id" :label="item.text" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="营业担当">
                <el-select v-model="form.salesPersonID">
                    <el-option v-for="item in jobsLists" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="招聘标题" prop="title">
                <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="招聘内容" prop="content">
                <el-input type="textarea" :rows="15" v-model="form.content"></el-input>
            </el-form-item>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="发布日期">
                        <el-date-picker
                            size="mini"
                            placeholder="发布日期"
                            v-model="form.pubDate"
                            value-format="yyyy-MM-dd"
                            value="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="关闭日期">
                        <el-date-picker
                            size="mini"
                            placeholder="关闭日期"
                            v-model="form.closeDate"
                            value-format="yyyy-MM-dd"
                            value="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="提案履歴">
                <el-button type="primary" size="mini" @click="handleTip">提案</el-button>
            </el-form-item>
            <el-table ref="table" :data="form.salesCases" size="small" border v-if="isShow">
                <el-table-column label="Name" prop="customerID" show-overflow-tooltip></el-table-column>
                <el-table-column label="CreateDate" prop="createDate" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>{{scope.row.createDate.substring(0,10)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="salesPersonID" prop="salesPerson" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" width="70">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="编辑" placement="top-start">
                            <i class="el-icon-edit-outline oper-icon" color="warning" @click="toogleExpand(scope.row, 1)"></i>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除" placement="top-start">
                            <i class="el-icon-delete oper-icon" color="danger" @click="deletetoogle(scope.row)"></i>
                        </el-tooltip>
                    </template>
                </el-table-column>
                <el-table-column type="expand" width="1">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <!-- <el-form-item label="">
                                <el-input v-model="content" type="textarea" :rows="6"></el-input>
                            </el-form-item> -->
                            <el-form-item class="lid" v-for='(item,index) in salesCaseItems' :key='index' :label="item.updateTime">
                                <el-input class="input" v-model="item.content" ></el-input>
                                <el-tooltip class="flot" effect="dark" content="删除" placement="top-start">
                                    <i class="el-icon-delete oper-icon" color="danger" @click="deletes(index)"></i>
                                </el-tooltip>
                                <el-tooltip v-if='(index+1) === salesCaseItems.length' class="flot flot1" effect="dark" content="添加" placement="top-start">
                                    <i class="el-icon-plus oper-icon" color="primary" @click="adds"></i>
                                </el-tooltip>
                            </el-form-item>
                            <el-form-item class="lid" label="提案状态">
                                <el-select size="mini" v-model="props.row.status">
                                    <el-option v-for="item in opport" :key="item.id" :label="item.text" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                            <!-- <el-form-item label="">
                                <el-button size="small" type="primary" @click='save(props.row)'>保存</el-button>
                            </el-form-item> -->
                        </el-form>
                    </template>
                </el-table-column>
            </el-table>
        </el-form>
        <div slot="footer">
            <el-button size="mini" @click="close">取消</el-button>
            <el-button type="primary" size="mini" @click="submit">保存</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { formatTime } from '@_public/utils';
import moment from 'moment';
export default {
    props: {
        allStatus: {
            type: Array,
            required: true
        },
        jobsLists: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            salesCaseItems: [{
                content: '',
                updateTime: moment(new Date()).format('YYYY-MM-DD HH:MM')
            }],
            isShow: false,
            dialog: false,
            visible: false,
            form: {
                tags: [],
                customerID: '',
                title: '',
                content: '',
                pubDate: '',
                closeDate: '',
                status: 0,
                salesPersonID: ''
            },
            rules: {
                title: [{
                    required: true, message: '请填写招聘标题'
                }],
                content: [{
                    required: true, message: '请填写招聘内容'
                }],
                tags: [{
                    required: true, message: '请选择标签'
                }],
                customerID: [{
                    required: true, message: '请选择客户'
                }]
            },
            edit: false,
            callback: null,
            tags: [],
            customers: []
        };
    },
    mounted() {
        this.$root.$off('SHOW_OPPORT_DIALOG');
        this.$root.$on('SHOW_OPPORT_DIALOG', ({ data = null, callback, tags = [], customers = [] }) => {
            if (data) {
                const form = { ...data };
                form.pubDate = formatTime(form.pubDate);
                form.closeDate = formatTime(form.closeDate);
                if (!form.customerID) {
                    form.customerID = '';
                }
                form.tags = [];
                this.form = { ...form };
                console.log(this.form);
                this.getInfo(form);
                this.edit = true;
            } else {
                this.$set(this.form, 'pubDate', moment(new Date().getTime()).format('YYYY-MM-DD'));
                this.$set(this.form, 'closeDate', moment(new Date().getTime()).add(1, 'months').format('YYYY-MM-DD'));
            }
            this.callback = callback;
            this.tags = tags;
            this.customers = customers;
            this.visible = true;
        });
    },
    methods: {
        handleTip() {
            this.isShow = !this.isShow;
        },
        getInfo() {
            this.$axios({
                url: '/api/Opportunity/api_getopportunitybyid',
                params: {
                    id: this.form.id
                }
            }).then(res => {
                if (res && res.code === 0) {
                    const form = { ...this.form };
                    const data  = res.data || {};
                    const tags = data.tags || [];
                    if (!data.customerID) {
                        if (data.customerTitle) {
                            form.customerID = data.customerTitle;
                        }
                    }
                    form.tags = tags.map(item => item.id);
                    this.form = { ...form };
                }
            });
        },
        close() {
            this.visible = false;
            this.isShow = false;
            this.$refs.form.resetFields();
            this.form = {
                tags: [],
                customerID: '',
                title: '',
                content: '',
                pubDate: '',
                closeDate: '',
                status: 0,
                salesPersonID: ''
            };
        },
        submit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    const params = {
                        ID: this.form.id || 0,
                        Tags: this.form.tags.map(item => ({id: item})),
                        Content: this.form.content,
                        Title: this.form.title,
                        PubDate: this.form.pubDate,
                        CloseDate: this.form.closeDate,
                        Status: this.form.status,
                        CustomerID: this.form.customerID || 0,
                        SalesPersonID: this.form.salesPersonID
                    };
                    console.log(params);
                    if (!Number(this.form.customerID) && typeof this.form.customerID !== 'number') {
                        params.CustomerTitle = this.form.customerTitle;
                        params.CustomerID = 0;
                    }
                    const loading = this.$loading({ lock: true, text: '提交数据中' });
                    this.$axios({
                        method: 'POST',
                        url: '/api/Opportunity/api_updateopportunity',
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
                                message: '保存成功'
                            });
                            this.close();
                            this.callback && this.callback();
                        }
                    });
                }
            });
        },
        setCustomTitle(keyword) {
            this.form.customerTitle = keyword;
            this.form.customerID = keyword;
        },
        clearHandle() {
            this.form.customerTitle = '';
            this.form.customerID = '';
        },
        // 提案按钮点击
        // 展开列表
        toogleExpand(row) {
            let $table = this.$refs.table;
            this.form.salesCases.map((item) => {
                if (row.id != item.id) {
                    $table.toggleRowExpansion(item, false);
                }
            });
            console.log(row, this.form.salesCases);
            // const loading = this.$loading({ lock: true, text: '正在加载...' });
            // this.$axios({
            //     url: '/api/Opportunity/api_getsalescaseinfo',
            //     params: {
            //         scid: row.id
            //     }
            // }).then(res => {
            //     loading.close();
            //     $table.toggleRowExpansion(row);
            //     let datas = {};
            //     if (res && res.code === 0) {
            //         datas = res.data;
            //     }
            //     this.data.forEach((item) => {
            //         if(item.id === datas.id) {
            //             this.content = datas.content;
            //             if (datas.salesCaseItems.length>0) {
            //                 datas.salesCaseItems.forEach((i) => {
            //                     i.updateTime = moment(i.updateTime).format('YYYY-MM-DD HH:MM');
            //                 });
            //                 this.salesCaseItems = datas.salesCaseItems;
            //             }
            //         }
            //     });
            // });
        },
        deletetoogle(row) {
            this.$confirm('是否删除', '删除', {
                type: 'warning'
            }).then(() => {
                this.$axios({
                    url: '/api/SalesCase/api_deletesalescase',
                    params: {
                        id: row.id
                    }
                }).then(res => {
                    if (res && res.code === 0) {
                        this.data.forEach((item, i) => {
                            if(item.id === row.id) {
                                this.data.splice(i, 1);
                            }
                        });
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                        this.deletetrue = true;
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.message
                        });
                    }
                });
            }).catch(() => {});
        },
        // 添加
        adds() {
            this.salesCaseItems.push({
                content: '',
                updateTime: moment(new Date()).format('YYYY-MM-DD HH:MM')
            });
        },
        // 删除
        deletes(i) {
            this.salesCaseItems.splice(i, 1);
        },
        // 保存
        save(row) {
            const loading = this.$loading({ lock: true, text: '正在保存...' });
            this.$axios({
                method: 'POST',
                url: '/api/SalesCase/api_updatesalescase',
                params: {
                    id: row.id,
                    content: this.content,
                    Status: row.status,
                    SalesCaseItems: this.salesCaseItems
                },
                formData: true
            }).then(res => {
                loading.close();
                this.$message({
                    type: 'success',
                    message: res ? res.message : '接口开小差了，没有返回信息'
                });
            });
        }
    }
};
</script>

<style lang="less">
.opport-dialog {
    .el-checkbox-group {
        .el-checkbox-button__inner {
            background-color: #f0f0f0;
        }
    }
}
</style>
