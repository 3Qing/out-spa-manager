<template>
    <el-dialog
        custom-class="opport-dialog"
        :visible.sync="visible"
        :title="form.id ? '编辑' : '新增'"
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
                    <el-option v-for="item in allStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="招聘标题">
                <el-input v-model="form.title"></el-input>
            </el-form-item>
            <el-form-item label="招聘内容" prop="content">
                <el-input type="textarea" :rows="5" v-model="form.content"></el-input>
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
        </el-form>
        <div slot="footer">
            <el-button size="mini" @click="close">取消</el-button>
            <el-button type="primary" size="mini" @click="submit">保存</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { formatTime } from '@_public/utils';
export default {
    props: {
        allStatus: {
            type: Array
        }
    },
    data() {
        return {
            visible: false,
            form: {
                tags: [],
                customerID: '',
                title: '',
                content: '',
                pubDate: '',
                closeDate: ''
            },
            rules: {
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
                if (!form.customerID) form.customerID = '';
                form.tags = [];
                this.form = { ...form };
                this.getTags(form);
                this.edit = true;
            }
            this.callback = callback;
            this.tags = tags;
            this.customers = customers;
            this.visible = true;
        });
    },
    methods: {
        getTags() {
            this.$axios({
                url: '/api/Opportunity/api_getopportunitybyid',
                params: {
                    id: this.form.id
                }
            }).then(res => {
                if (res && res.code === 0) {
                    const form = { ...this.form };
                    const tags = (res.data && res.data.tags) || [];
                    form.tags = tags.map(item => item.id);
                    this.form = { ...form };
                }
            });
        },
        close() {
            this.visible = false;
            this.$refs.form.resetFields();
            this.form = {
                tags: [],
                customerID: '',
                title: '',
                content: '',
                pubDate: '',
                closeDate: ''
            };
        },
        submit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    const params = {
                        Tags: this.form.tags.map(item => ({id: item})),
                        Content: this.form.content,
                        Title: this.form.title,
                        PubDate: this.form.pubDate,
                        CloseDate: this.form.closeDate,
                        Status: this.form.status,
                        CustomerID: this.form.customerID
                    };
                    if (this.edit) {
                        params.ID = this.form.id;
                    }
                    if (!Number(this.form.customerID) && typeof this.form.customerID !== 'number') {
                        params.CustomerTitle = this.form.customerTitle;
                        params.CustomerID = '';
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
