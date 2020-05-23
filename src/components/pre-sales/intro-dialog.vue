<template>
    <el-dialog custom-class="intro-dialog" :title="form.id ? '介绍文编辑' : '介绍文新增'" :visible.sync="visible" @close="close">
        <el-form label-width="130px" size="mini">
            <el-row v-if="!IS_H5">
                <el-col :span="12">
                    <el-form-item label="英語姓">
                        <el-input v-model="form.furigana_FirstName" :maxlength="20"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="英語名">
                        <el-input v-model="form.furigana_LastName" :maxlength="20"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="英語姓" v-if="IS_H5">
                <el-input v-model="form.furigana_FirstName" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="英語名" v-if="IS_H5">
                <el-input v-model="form.furigana_LastName" :maxlength="20"></el-input>
            </el-form-item>
            <el-row v-if="!IS_H5">
                <el-col :span="12">
                    <el-form-item label="姓" prop="firstName">
                        <el-input v-model="form.firstName" :maxlength="20"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="名" prop="lastName">
                        <el-input v-model="form.lastName" :maxlength="20"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="姓" prop="firstName" v-if="IS_H5">
                <el-input v-model="form.firstName" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="名" prop="lastName" v-if="IS_H5">
                <el-input v-model="form.lastName" :maxlength="20"></el-input>
            </el-form-item>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="生日" prop="birthday">
                        <el-date-picker
                            v-model="form.birthday"
                            type="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="国籍" prop="nationality">
                        <el-input v-model="form.nationality" :maxlength="10"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="城市" prop="liveCity">
                        <el-input v-model="form.liveCity" :maxlength="10"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="主要技能" prop="mainSkill">
                        <el-input v-model="form.mainSkill" :maxlength="20"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="性别" prop="sex">
                        <el-select v-model="form.sex">
                            <el-option v-for="(item, i) in sexs" :key="i" :value="item.value" :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="开始营业日期" prop="salesFromDate">
                        <el-date-picker
                            v-model="form.salesFromDate"
                            type="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="稼働可能开始日" prop="avaiableDate">
                        <el-date-picker
                            v-model="form.avaiableDate"
                            type="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="状态">
                        <el-select v-model="form.status">
                            <el-option v-for="item in allStatus" :key="item.id" :value="item.id" :label="item.text"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="提案文">
                <el-input v-model="form.proposeText" type="textarea" :rows="12" :maxlength="250"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="form.comment" type="textarea" :rows="5" :maxlength="250"></el-input>
            </el-form-item>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="最低人件费金额">
                        <el-input v-model.number="form.costFrom"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="最高人件费金额">
                        <el-input v-model.number="form.costTo"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="最低提案金额">
                        <el-input v-model.number="form.salesFrom"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="最高提案金额">
                        <el-input v-model.number="form.salesTo"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="工作开始日">
                        <el-date-picker
                            v-model="form.startWorkDate"
                            type="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="简历附件存储路径">
                        <upload
                            :opt="{ btnText: '上传附件', accept: 'application/pdf', show: false, showIcon: true }"
                            @upload="uploadFile"></upload>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-button type="primary" size="small" @click="submit">确认</el-button>
    </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex';
import Upload from '@components/upload';
export default {
    props: {
        allStatus: {
            type: Array,
            default: () => {}
        }
    },
    components: {
        Upload
    },
    data() {
        return {
            form: {
                furigana_FirstName: '',
                furigana_LastName: '',
                firstName: '',
                lastName: '',
                birthday: '',
                nationality: '',
                liveCity: '',
                mainSkill: '',
                sex: '',
                salesFromDate: '',
                avaiableDate: '',
                status: '',
                proposeText: '',
                comment: '',
                costFrom: '',
                costTo: '',
                salesFrom: '',
                salesTo: '',
                startWorkDate: '',
                attachResume: ''
            },
            sexs: [{
                label: '男', value: true
            }, {
                label: '女', value: false
            }],
            showDate: false,
            visible: false,
            callback: null
        };
    },
    computed: {
        ...mapGetters(['IS_H5'])
    },
    mounted() {
        this.getSelect();
        this.$root.$off('SHOW_INTRO_DIALOG');
        this.$root.$on('SHOW_INTRO_DIALOG', ({ data = null, callback = null, showDate = false }) => {
            if (data) {
                if (!showDate) {
                    this.createProposeText(data);
                } else {
                    this.getProposeText(data);
                }
            }
            this.callback = callback;
            this.visible = true;
        });
    },
    methods: {
        close() {
            this.visible = false;
            this.form = {
                furigana_FirstName: '',
                furigana_LastName: '',
                firstName: '',
                lastName: '',
                birthday: '',
                nationality: '',
                liveCity: '',
                mainSkill: '',
                sex: '',
                salesFromDate: '',
                avaiableDate: '',
                status: '',
                proposeText: '',
                comment: '',
                costFrom: '',
                costTo: '',
                salesFrom: '',
                salesTo: '',
                startWorkDate: '',
                attachResume: ''
            };
        },
        getSelect() {
            this.$axios({
                url: '/api/Candidate/api_candidatetypeforselect'
            }).then(res => {
                console.log(res);
            });
        },
        createProposeText(data) {
            this.$axios({
                url: '/api/Candidate/api_generateproposetext',
                params: {
                    empeeid: data.id
                }
            }).then(res => {
                if (res && res.code === 0) {
                    this.content = res.data;
                } else {
                    this.content = '';
                }
            });
        },
        getProposeText(data) {
            this.$axios({
                url: '/api/Candidate/api_getcandidateforupdate',
                params: {
                    id: data.id
                }
            }).then(res => {
                if (res && res.code === 0) {
                    this.form = { ...res.data };
                } else {
                    this.$message({
                        type: 'error',
                        showClose: true,
                        message: res.message ? res.message : '接口开小差了，没有返回信息'
                    });
                }
            });
        },
        submit() {
            const loading = this.$loading({ lock: true, text: '正在提交候选人信息...' });
            const params = {
                Furigana_FirstName: this.form.furigana_FirstName,
                Furigana_LastName: this.form.furigana_LastName,
                FirstName: this.form.firstName,
                LastName: this.form.lastName,
                Type: this.form.type,
                Birthday: this.form.birthday,
                Nationality: this.form.nationality,
                LiveCity: this.form.liveCity,
                Sex: this.form.sex,
                SalesFromDate: this.form.salesFromDate,
                Comment: this.form.comment,
                CostFrom: this.form.costFrom,
                CostTo: this.form.costTo,
                SalesFrom: this.form.salesFrom,
                SalesTo: this.form.salesTo,
                MainSkill: this.form.mainSkill,
                StartWorkDate: this.form.startWorkDate,
                AttachResume: this.form.attachResume,
                AvaiableDate: this.form.avaiableDate,
                ProposeText: this.form.proposeText,
                Status: this.form.status || 1,
                ID: this.form.id || 0
            };
            
            this.$axios({
                method: 'POST',
                url: '/api/Candidate/api_updatecandidate',
                params,
                custom: {
                    loading,
                    vm: this
                },
                formData: true
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.callback && this.callback();
                    this.close();
                } else {
                    this.$message({
                        type: 'error',
                        showClose: true,
                        message: res.message ? res.message : '接口开小差了，没有返回信息'
                    });
                }
            });
        },
        uploadFile({ file }) {
            this.form.attachResume = file;
        }
    }
};
</script>

