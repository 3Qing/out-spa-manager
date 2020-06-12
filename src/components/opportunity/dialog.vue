<template>
    <div>
        <el-dialog
            class="tian tians"
            custom-class="opport-dialog"
            :visible.sync="visible"
            :title="form.id ? '' : '新增'"
            :close-on-click-modal="dialog"
            @close="close">
            <el-form size="mini" label-width="80px" :model="form" :rules="rules" ref="form">
                <el-form-item label="案件情報" v-if='form.id'>
                    <!-- <el-button type="primary" size="mini" @click="handleTip(form)">提案</el-button> -->
                </el-form-item>
                <el-form-item label="案件タグ" prop="tags">
                    <el-checkbox-group v-model="form.tags" size="mini">
                        <el-checkbox-button v-for="item in tags" :label="item.id" :key="item.id">{{item.tagName}}</el-checkbox-button>
                    </el-checkbox-group>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="得意先" prop="customerID">
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
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="所在地">
                            <el-select v-model="form.location">
                                <el-option v-for="item in adressArrs" :key="item.id" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="案件状態">
                            <el-select v-model="form.status">
                                <el-option v-for="item in allStatus" :key="item.id" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="営業担当">
                            <el-select v-model="form.salesPersonID">
                                <el-option v-for="item in jobsLists" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="案件名称" prop="title">
                    <el-input v-model="form.title"></el-input>
                </el-form-item>
                <el-form-item label="案件内容" prop="content">
                    <el-input type="textarea" :rows="13" v-model="form.content"></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="募集開始日">
                            <el-date-picker
                                size="mini"
                                placeholder="募集開始日"
                                v-model="form.pubDate"
                                value-format="yyyy-MM-dd"
                                value="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="募集終了日">
                            <el-date-picker
                                size="mini"
                                placeholder="募集終了日"
                                v-model="form.closeDate"
                                value-format="yyyy-MM-dd"
                                value="yyyy-MM-dd"></el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="" v-if='form.id'>
                    <el-button class="btnFlo" type="primary" size="mini" @click="submit">案件保存</el-button>
                </el-form-item>
                <p class="line" v-if='form.id'></p>
                <el-form-item label="提案履歴" v-if='form.id'>
                    <el-button type="primary" size="mini" @click="handleTip(form)">提案</el-button>
                </el-form-item>
                <el-table class="tabels" v-if='form.id' ref="table" :data="form.salesCases" size="small" border>
                    <el-table-column label="候補者" prop="name" show-overflow-tooltip></el-table-column>
                    <el-table-column label="提案日" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{scope.row.createDate.substring(0,10)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="営業担当" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span>{{getContent(scope.row.salesPersonID, jobsLists, 'jobsLists')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="最新情報" show-overflow-tooltip>
                        <template slot-scope="scope">
                            <span v-if='scope.row.salesCaseItems.length>0'>{{scope.row.salesCaseItems[scope.row.salesCaseItems.length - 1].content}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="提案状態" prop="status">
                        <template slot-scope="scope">
                            <span>{{getContent(scope.row.status, opport, 'opport')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="アクション" width="70">
                        <template slot-scope="scope">
                            <el-tooltip effect="dark" content="編集" placement="top-start">
                                <i class="el-icon-edit-outline oper-icon" color="warning" @click="toogleExpand(scope.row, form.salesCases)"></i>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="削除" placement="top-start">
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
                                <el-form-item class="lid" v-for='(item,index) in props.row.salesCaseItems' :key='index' :label="item.updateTime">
                                    <el-input class="input" v-model="item.content" ></el-input>
                                    <el-tooltip class="flot" effect="dark" content="删除" placement="top-start">
                                        <i class="el-icon-delete oper-icon" color="danger" @click="deletes(props.row.id, index)"></i>
                                    </el-tooltip>
                                    <el-tooltip v-if='(index+1) === props.row.salesCaseItems.length' class="flot flot1" effect="dark" content="添加" placement="top-start">
                                        <i class="el-icon-plus oper-icon" color="primary" @click="adds(props.row.id)"></i>
                                    </el-tooltip>
                                </el-form-item>
                                <el-form-item class="lid" label="提案状態">
                                    <el-select size="mini" v-model="props.row.status">
                                        <el-option v-for="item in opport" :key="item.id" :label="item.text" :value="item.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </template>
                    </el-table-column>
                </el-table>
                <el-form-item label="" v-if='form.id'>
                    <el-button class="btnFlo" size="small" type="primary" @click='save()'>提案保存</el-button>
                </el-form-item>
            </el-form>
            <div slot="footer" v-if='!form.id'>
                <el-button type="primary" size="mini" @click="submit">保存</el-button>
                <el-button size="mini" @click="close">取消</el-button>
            </div>
        </el-dialog>
        <apply-dialog
            :visible="showApply"
            :data="curData"
            @close="showApply = false"
            @update="getCandiList">
            </apply-dialog>
    </div>
</template>

<script>
import { formatTime } from '@_public/utils';
import ApplyDialog from '@components/opportunity/apply-dialog';
import moment from 'moment';
export default {
    components: {
        ApplyDialog
    },
    props: {
        allStatus: {
            type: Array,
            required: true
        },
        jobsLists: {
            type: Array,
            required: true
        },
        opport: {
            type: Array,
            required: true
        },
        adressArrs: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            curData: {},
            salesCaseItems: [{
                content: '',
                updateTime: moment(new Date()).format('YYYY-MM-DD HH:MM')
            }],
            showApply: false,
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
                salesPersonID: '',
                location: ''
            },
            rules: {
                title: [{
                    required: true, message: '案件名称を入力してください！'
                }],
                content: [{
                    required: true, message: '案件内容を入力してください！'
                }],
                tags: [{
                    required: true, message: 'タグを選択してください！'
                }],
                customerID: [{
                    required: true, message: '得意先を指定してください！'
                }]
            },
            edit: false,
            callback: null,
            tags: [],
            customers: [],
            candidates: [],
            isShow: false
        };
    },
    mounted() {
        this.$root.$off('SHOW_OPPORT_DIALOG');
        this.$root.$on('SHOW_OPPORT_DIALOG', ({ data = null, callback, tags = [], customers = [] }) => {
            this.isShow = false;
            if (data) {
                const form = { ...data };
                form.pubDate = formatTime(form.pubDate);
                form.closeDate = formatTime(form.closeDate);
                if (!form.customerID) {
                    form.customerID = '';
                }
                form.tags = [];
                this.form = { ...form };
                this.getInfo(form);
                this.edit = true;
            } else {
                this.$set(this.form, 'pubDate', moment(new Date().getTime()).format('YYYY-MM-DD'));
                this.$set(this.form, 'closeDate', moment(new Date().getTime()).add(1, 'months').format('YYYY-MM-DD'));
            }
            this.callback = callback;
            this.tags = tags;
            this.customers = customers;
            console.log(customers);
            this.visible = true;
        });
        this.getCandiList();
    },
    methods: {
        // 获取提案列表
        getCandiList() {
            this.$axios({
                url: '/api/Opportunity/api_getopportunitybyid',
                params: {
                    id: this.form.id
                }
            }).then(res => {
                if (res && res.code === 0) {
                    // this.candidates = res.data || [];
                    this.form.salesCases = res.data.salesCases;
                }
                console.log(this.form);
            });
        },
        handleTip(data) {
            this.showApply = true;
            this.curData = { ...data };
        },
        // 获取字段函数
        getContent(id, arr, arrName) {
            if (arrName === 'opport') {
                for (let item of arr) {
                    if (item.id === id) {
                        return item.text;
                    }
                }
            }
            if (arrName === 'jobsLists') {
                for (let item of arr) {
                    if (item.id === id) {
                        return item.name;
                    }
                }
            }
            return '-';
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
            if (this.isShow) {
                this.$emit('update');
            }
            this.visible = false;
            this.$refs.form.resetFields();
            this.form = {
                tags: [],
                customerID: '',
                title: '',
                content: '',
                pubDate: '',
                closeDate: '',
                status: 0,
                salesPersonID: '',
                location: ''
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
                        Location: this.form.location,
                        SalesPersonID: this.form.salesPersonID
                    };
                    if (!Number(this.form.customerID) && typeof this.form.customerID !== 'number') {
                        params.CustomerTitle = this.form.customerTitle;
                        params.CustomerID = 0;
                    }
                    const loading = this.$loading({ lock: true, text: 'データ提出中...' });
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
                            this.isShow = true;
                            this.$message({
                                type: 'success',
                                message: '保存完了！'
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
            $table.toggleRowExpansion(row);
            this.form.salesCases.forEach((item) => {
                if(item.id === row.id) {
                    if (item.salesCaseItems.length>0) {
                        item.salesCaseItems.forEach((i) => {
                            i.updateTime = moment(i.updateTime).format('YYYY-MM-DD HH:MM');
                        });
                    } else {
                        item.salesCaseItems = [{
                            content: '',
                            updateTime: moment(new Date()).format('YYYY-MM-DD HH:MM')
                        }];
                    }
                }
            });
        },
        deletetoogle(row) {
            this.$confirm('削除確認', '削除', {
                type: 'warning'
            }).then(() => {
                this.$axios({
                    url: '/api/SalesCase/api_deletesalescase',
                    params: {
                        id: row.id
                    }
                }).then(res => {
                    if (res && res.code === 0) {
                        this.isShow = true;
                        this.form.salesCases.forEach((item, i) => {
                            if(item.id === row.id) {
                                this.form.salesCases.splice(i, 1);
                            }
                        });
                        this.$message({
                            type: 'success',
                            message: '削除完了！'
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
        adds(id) {
            // this.salesCaseItems.push({
            //     content: '',
            //     updateTime: moment(new Date()).format('YYYY-MM-DD HH:MM'),
            //     salesCaseID: id
            // });
            this.form.salesCases.forEach((item) => {
                if(item.id === id) {
                    item.salesCaseItems.push({
                        content: '',
                        updateTime: moment(new Date()).format('YYYY-MM-DD HH:MM')
                    });
                }
            });
        },
        // 删除
        deletes(id, i) {
            this.form.salesCases.forEach((item) => {
                if(item.id === id) {
                    item.salesCaseItems.splice(i, 1);
                }
            });
            // this.salesCaseItems.splice(i, 1);
        },
        // 保存
        save() {
            let arra = this.form.salesCases;
            arra.forEach((item) => {
                item.createDate = moment(item.createDate).format('YYYY-MM-DD HH:MM');
                item.updateTime = moment(item.updateTime).format('YYYY-MM-DD HH:MM');
                item.salesCaseItems.forEach((i) => {
                    i.updateTime = moment(i.updateTime).format('YYYY-MM-DD HH:MM');
                });
            });
            const loading = this.$loading({ lock: true, text: 'データ保存中...' });
            this.$axios({
                method: 'POST',
                url: '/api/SalesCase/api_updatesalescases',
                params: {
                    salescases: arra
                },
                formData: true
            }).then(res => {
                this.isShow = true;
                loading.close();
                this.getCandiList();
                this.$message({
                    type: 'success',
                    message: res ? res.message : 'システム異常、再試行してください！'
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
    .demo-table-expand {
        font-size: 0;
        .input{
            float: left;
            width: 553px;
            height: 30px;
            line-height: 30px;
        }
        .flot{
            // float: left;
            position: absolute;
            top: 5px;
            margin-left: 5px;
        }
        .flot1{
            margin-left: 33px !important;
        }
  }
  .line{
      height: 1px;
      border-top:1px dashed #EBEEF5;
      margin-bottom: 15px;
  }
  .tabels{
      margin-bottom: 20px;
  }
  .btnFlo{
      float: right;
  }
}
</style>
