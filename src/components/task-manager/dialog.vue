<template>
    <el-dialog :visible.sync="visible" :close="close" :title="!edit ? '查看' : form.id ? '编辑' : '新增'">
        <el-switch v-if="form.id" v-model="edit" inactive-text="查看" active-text="编辑" class="status-btn"></el-switch>
        <el-form size="mini" label-width="120px" :model="form" ref="form" :rules="edit ? rules : {}" label-suffix=":">
            <el-form-item label="营业活动" prop="atyType">
                <el-select v-model="form.atyType" v-if="edit">
                    <el-option v-for="item in atyTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <p v-else>{{getContent(form.atyType, atyTypes, 'value', 'label')}}</p>
            </el-form-item>
            <el-form-item label="候选人" prop="candidateID" v-if="form.atyType === 0">
                <el-select
                    v-if="edit"
                    v-model="form.candidateID"
                    remote
                    filterable
                    clearable
                    @clear="clearHandle"
                    @change="handleChange"
                    :remote-method="getCandidate">
                    <el-option v-for="item in candidates" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
                <p v-else>{{getContent(form.candidateID, candidates, 'id', 'name')}}</p>
            </el-form-item>
            <el-form-item label="商机" prop="opportunityID" v-if="form.atyType === 0">
                <el-select v-model="form.opportunityID" v-if="edit">
                    <el-option v-for="item in opportunits" :key="item.id" :label="item.text" :value="item.id"></el-option>
                </el-select>
                <p v-else>{{getContent(form.opportunityID, opportunits, 'id', 'text')}}</p>
            </el-form-item>
            <el-form-item label="任务开始时间" prop="atyDate">
                <el-date-picker
                    v-if="edit"
                    v-model="form.atyDate"
                    type="datetime"
                    value-format="yyyy-MM-dd HH:mm"
                    format="yyyy-MM-dd HH:mm"
                    :default-value="curTime"></el-date-picker>
                <span v-else>{{form.atyDate}}</span>
            </el-form-item>
            <el-form-item label="面试时长" prop="atyMinutes">
                <el-input v-if="edit" v-model.number="form.atyMinutes">
                    <span slot="suffix">分钟</span>
                </el-input>
                <span v-else>{{form.atyMinutes}}分钟</span>
            </el-form-item>
            <el-form-item label="地点" prop="atyLocation">
                <el-input v-if="edit" v-model="form.atyLocation" :maxlength="50"></el-input>
                <span v-else>{{form.atyLocation}}</span>
            </el-form-item>
            <el-form-item label="任务描述" prop="atyPurpose">
                <el-input v-if="edit" v-model="form.atyPurpose" type="textarea" :maxlength="200" :row="3"></el-input>
                <p v-else>{{form.atyPurpose}}</p>
            </el-form-item>
        </el-form>
        <div slot="footer">
            <el-button size="mini" @click="close">取消</el-button>
            <el-button size="mini" type="primary" @click="beforeSubmit">确认</el-button>
        </div>
    </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import moment from 'moment';
export default {
    data() {
        return {
            visible: false,
            atyTypes: [{
                label: '面谈', value: 0
            }, {
                label: '顾客访问', value: 1
            }, {
                label: '其他', value: 2
            }],
            form: {
                atyType: '',
                candidateID: '',
                opportunityID: '',
                atyDate: '',
                atyMinutes: '',
                atyLocation: '',
                atyPurpose: ''
            },
            rules: {
                atyType: [{
                    required: true, message: '请选择营业活动', trigger: 'blur'
                }],
                candidateID: [{
                    required: true, message: '请选择候选人', trigger: 'blur'
                }],
                opportunityID: [{
                    required: true, message: '请选择商机', trigger: 'blur'
                }],
                atyDate: [{
                    required: true, message: '请选择任务开始时间', trigger: 'blur'
                }],
                atyMinutes: [{
                    required: true, message: '请选择面试时长', trigger: 'blur'
                }],
                atyLocation: [{
                    required: true, message: '请输入地点', trigger: 'blur'
                }]
            },
            callback: null,
            edit: true,
            loading: false,
            opportunits: [],
            candidates: [],
            curTime: ''
        };
    },
    watch: {
        edit: function(val) {
            if (val) {
                this.reset();
            }
        }
    },
    computed: {
        ...mapGetters([ 'POST_LOADING' ])
    },
    mounted() {
        this.$root.$off('SHOW_TASK_DIALOG');
        this.$root.$on('SHOW_TASK_DIALOG', ({ data = null, callback = null, edit = true, news = false }) => {
            console.log(news);
            if(news){
                this.form = {
                    atyType: '',
                    candidateID: '',
                    opportunityID: '',
                    atyDate: '',
                    atyMinutes: '',
                    atyLocation: '',
                    atyPurpose: ''
                };
            }
            this.curTime = moment(new Date().getTime()).hour(10).minutes(0).format('YYYY-MM-DD HH:mm');
            this.getCandidate();
            this.getOpportunit();
            if (data) {
                const form = { ...data };
                form.atyDate = moment(new Date(form.atyDate).getTime()).format('YYYY-MM-DD HH:mm');
                this.form = form;
            }
            this.edit = edit;
            this.callback = callback;
            this.visible = true;
        });
    },
    methods: {
        reset() {
            this.$nextTick(() => {
                this.$refs.form.resetFields();
            });
        },
        close() {
            this.reset();
            this.visible = false;
        },
        getCandidate(keyword) {
            this.loading = true;
            this.form.candidateID = keyword;
            this.$axios({
                url: '/api/Candidate/api_candidatesforselect',
                params: {
                    keyword
                }
            }).then(res => {
                this.loading = false;
                if (res && res.code === 0) {
                    this.candidates = res.data || [];
                }
            });
        },
        clearHandle() {
            this.form.candidateID = '';
        },
        handleChange(val) {
            this.$set(this.form, 'candidateID', val);
        },
        getOpportunit() {
            this.$axios({
                url: '/api/Opportunity/api_opportunityforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.opportunits = res.data || [];
                }
            });
        },
        beforeSubmit() {
            const params = {
                AtyType: this.form.atyType,
                CandidateID: this.form.candidateID || 0,
                OpportunityID: this.form.opportunityID || 0,
                AtyDate: this.form.atyDate,
                AtyMinutes: this.form.atyMinutes,
                AtyLocation: this.form.atyLocation,
                AtyPurpose: this.form.atyPurpose
            };
            this.submit(params);
        },
        submit(params) {
            const loading = this.$loading({ lock: true, text: this.POST_LOADING });
            this.$axios({
                method: 'POST',
                url: '/api/SalesActivity/api_updatesalesactivity',
                params,
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
                } else {
                    this.$message({
                        type: 'warning',
                        message: res.message
                    });
                }
            });
        },
        getContent(val, arr, key, field) {
            for (let item of arr) {
                if (item[key] === val) {
                    return item[field];
                }
            }
        }
    }
};
</script>

<style scoped lang="less">
.status-btn {
    position: absolute;
    right: 20px;
    top: 60px;
    z-index: 1;
}
</style>
