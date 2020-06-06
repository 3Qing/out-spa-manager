<template>
    <el-dialog custom-class="intro-dialog" :title="form.id ? '介绍文编辑' : '介绍文新增'" :visible.sync="visible" :close-on-click-modal="dialog" @close="close">
        <el-form label-width="130px" size="mini" ref="form" :model="form" :rules="rules" class='blackColor'>
            <el-row v-if="!IS_H5">
                <el-col :span="12" class="width50">
                    <el-col :span="6">
                        <el-form-item label="英語姓名" prop='furigana_FirstName'>
                            <el-input v-model="form.furigana_FirstName" :maxlength="20"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" class="width25" label-width="0px">
                        <el-form-item label="" prop='furigana_LastName'>
                            <el-input v-model="form.furigana_LastName" :maxlength="20"></el-input>
                        </el-form-item>
                    </el-col>
                </el-col>
                <el-col :span="12" class="width50">
                    <el-col :span="6">
                        <el-form-item label="汉字姓名" prop='firstName'>
                            <el-input v-model="form.firstName" :maxlength="20"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" class="width25" label-width="0px">
                        <el-form-item label="" prop='lastName'>
                            <el-input v-model="form.lastName" :maxlength="20"></el-input>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <!-- <el-form-item label="英語姓" v-if="IS_H5">
                <el-input v-model="form.furigana_FirstName" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="英語名" v-if="IS_H5">
                <el-input v-model="form.furigana_LastName" :maxlength="20"></el-input>
            </el-form-item> -->
            <el-row>
                <el-col :span="12">
                    <el-form-item label="性别" prop="sex">
                        <el-select v-model="form.sex">
                            <el-option v-for="(item, i) in sexs" :key="i" :value="item.value" :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="生日" prop="birthday">
                        <el-date-picker
                            v-model="form.birthday"
                            type="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <!-- <el-form-item label="姓" prop="firstName" v-if="IS_H5">
                <el-input v-model="form.firstName" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="名" prop="lastName" v-if="IS_H5">
                <el-input v-model="form.lastName" :maxlength="20"></el-input>
            </el-form-item> -->
            <el-row>
                <el-col :span="12">
                    <el-form-item label="国籍" prop="nationality">
                        <el-select v-model="form.nationality">
                            <el-option v-for="item in countryTypeArr" :key="item.id" :value="item.id" :label="item.text"></el-option>
                        </el-select>
                        <!-- <el-input v-model="form.nationality" :maxlength="10"></el-input> -->
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="来日年数" prop="arriveJPDate">
                        <!-- <el-input v-model="form.arriveJPDate" :maxlength="2"></el-input> -->
                        <el-date-picker
                            v-model="form.arriveJPDate"
                            type="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="工作开始日" prop="startWorkDate">
                        <el-date-picker
                            v-model="form.startWorkDate"
                            type="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="居住城市" prop="liveCity">
                        <el-select v-model="form.liveCity">
                            <el-option v-for="item in cityTypeArr" :key="item.id" :value="item.id" :label="item.text"></el-option>
                        </el-select>
                        <!-- <el-input v-model="form.liveCity" :maxlength="10"></el-input> -->
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="营业开始日" prop="salesFromDate">
                        <el-date-picker
                            v-model="form.salesFromDate"
                            type="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="稼働开始日" prop="avaiableDate">
                        <el-date-picker
                            v-model="form.avaiableDate"
                            type="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="候选人类型">
                        <el-select v-model="form.type">
                            <el-option v-for="item in peopleTypeArr" :key="item.id" :value="item.id" :label="item.text"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="营业状态">
                        <el-select v-model="form.status">
                            <el-option v-for="item in allStatus" :key="item.id" :value="item.id" :label="item.text"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="提案文" prop='proposeText'>
                <el-input v-model="form.proposeText" type="textarea" :rows="16" :maxlength="500"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="form.comment" type="textarea" :rows="5" :maxlength="300"></el-input>
            </el-form-item>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="主要技能" prop="mainSkill">
                        <el-input v-model="form.mainSkill" :maxlength="20"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-col :span="12">
                        <el-form-item label="人件费范围" prop='costFrom'>
                            <el-input v-model.number="form.costFrom" type='number'></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="" prop='costTo' label-width="0px">
                            <el-input v-model.number="form.costTo" type='number'></el-input>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-col :span="12">
                        <el-form-item label="提案金额范围" prop='salesFrom'>
                            <el-input v-model.number="form.salesFrom" type='number'></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="" prop='salesTo' label-width="0px">
                            <el-input v-model.number="form.salesTo" type='number'></el-input>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="简历附件">
                        <upload
                            ref="child"
                            :opt="{ btnText: '上传附件', accept: 'application/pdf,application/msword,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', show: trus, showIcon: true }"
                            @upload="uploadFile">
                            </upload>
                        <span class="flop" v-if='form.id&&trus === false && form.attachResume !== null'>{{form.attachResumeFileName}}</span>
                        <i v-if='form.id&&trus === false && form.attachResume !== null' class="flor iconfont icon-icon-test link" color="primary" @click="downloads(form.attachResume)"></i>
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
import moment from 'moment';
import { apiDownloadFile } from '@_public/utils';
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
            trus: false,
            dialog: false,
            form: {
                furigana_FirstName: '',
                furigana_LastName: '',
                firstName: '',
                lastName: '',
                birthday: '1985-01-01',
                nationality: 0,
                liveCity: 0,
                mainSkill: '',
                sex: true,
                salesFromDate: this.month,
                avaiableDate: this.nextMonth,
                status: 0,
                proposeText: '',
                comment: '',
                costFrom: '',
                costTo: '',
                salesFrom: '',
                salesTo: '',
                startWorkDate: '',
                attachResume: '',
                employeeType: '',
                arriveJPDate: '',
                jpYears: 1,
                type: ''
            },
            rules:{
                mainSkill: [{
                    required: true, message: '请填写主要技能！'
                }],
                furigana_FirstName: [{
                    required: true, message: '请填写英文名字！'
                }],
                furigana_LastName: [{
                    required: true, message: '请填写英文名字！'
                }],
                firstName: [{
                    required: true, message: '请填写汉字名字！'
                }],
                lastName: [{
                    required: true, message: '请填写汉字名字！'
                }],
                sex: [{
                    required: true, message: '请选择性别！'
                }],
                birthday: [{
                    required: true, message: '请填写出生日期！'
                }],
                nationality: [{
                    required: true, message: '请选择国籍！'
                }],
                startWorkDate: [{
                    required: true, message: '请填写工作开始日期！'
                }],
                liveCity: [{
                    required: true, message: '请选择居住城市！'
                }],
                salesFromDate: [{
                    required: true, message: '请填写营业开始日！'
                }],
                avaiableDate: [{
                    required: true, message: '请填写稼働开始日！'
                }],
                proposeText: [{
                    required: true, message: '请填写提案文！'
                }],
                costFrom: [{
                    required: true, message: '请填写人件费范围！'
                }],
                costTo: [{
                    required: true, message: '请填写人件费范围！'
                }],
                salesFrom: [{
                    required: true, message: '请填写提案金额范围！'
                }],
                salesTo: [{
                    required: true, message: '请填写提案金额范围！'
                }]
            },
            sexs: [{
                label: '男', value: true
            }, {
                label: '女', value: false
            }],
            showDate: false,
            visible: false,
            callback: null,
            cityTypeArr: [],
            peopleTypeArr: [],
            countryTypeArr: [],
            month: '',
            nextMonth: ''
        };
    },
    computed: {
        ...mapGetters(['IS_H5'])
    },
    mounted() {
        let date = new Date();
        let years = date.getFullYear();
        let nextMonth = years + '-' + Number(date.getMonth()+2) + '-01';
        this.nextMonth = nextMonth;
        this.month = moment(new Date()).format('YYYY-MM-DD');
        this.form.salesFromDate = this.month;
        this.form.avaiableDate = this.nextMonth;
        this.getSelect();
        this.cityType();
        this.countryType();
        this.$root.$off('SHOW_INTRO_DIALOG');
        this.$root.$on('SHOW_INTRO_DIALOG', ({ data = null, callback = null, showDate = false}) => {
            this.trus = false;
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
        // 城市列表
        cityType() {
            this.$axios({
                url: '/api/Candidate/api_cityforselect'
            }).then(res => {
                console.log('city', res);
                this.cityTypeArr = res.data;
                this.form.liveCity = this.cityTypeArr[0].id;
            });
        },
        // 国籍列表
        countryType() {
            this.$axios({
                url: '/api/Candidate/api_nationalityforselect'
            }).then(res => {
                console.log('country', res, res.data[0].text);
                this.countryTypeArr = res.data;
                this.form.nationality = this.countryTypeArr[0].id;
            });
        },
        // 候选人列表
        getSelect() {
            this.$axios({
                url: '/api/Candidate/api_candidatetypeforselect'
            }).then(res => {
                console.log('people', res);
                this.peopleTypeArr = res.data;
                this.form.type = this.peopleTypeArr[0].id;
            });
        },
        close() {
            this.form = {
                furigana_FirstName: '',
                furigana_LastName: '',
                firstName: '',
                lastName: '',
                birthday: '1985-01-01',
                nationality: this.countryTypeArr[0].id,
                liveCity: this.cityTypeArr[0].id,
                mainSkill: '',
                sex: true,
                salesFromDate: this.month,
                avaiableDate: this.nextMonth,
                status: 0,
                proposeText: '',
                comment: '',
                costFrom: '',
                costTo: '',
                salesFrom: '',
                salesTo: '',
                startWorkDate: '',
                arriveJPDate: '',
                attachResume: '',
                employeeType: '',
                jpYears: 1,
                type: this.peopleTypeArr[0].id
            };
            this.$refs.child.clearUpload();
            this.$refs.form.resetFields();
            this.visible = false;
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
        getContent(val, arr, key, field) {
            for (let item of arr) {
                if (item[key] === val) {
                    return item[field];
                }
            }
            return '-';
        },
        submit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    const loading = this.$loading({ lock: true, text: '正在提交候选人信息...' });
                    // this.form.nationality = this.getContent(this.form.nationality, this.countryTypeArr, 'id', 'text');
                    console.log(this.form.liveCity);
                    const params = {
                        Furigana_FirstName: this.form.furigana_FirstName,
                        Furigana_LastName: this.form.furigana_LastName,
                        FirstName: this.form.firstName,
                        LastName: this.form.lastName,
                        Type: this.form.type,
                        Birthday: this.form.birthday,
                        Nationality: this.form.nationality,
                        LiveCity: Number(this.form.liveCity),
                        Sex: this.form.sex,
                        SalesFromDate: this.form.salesFromDate,
                        Comment: this.form.comment,
                        CostFrom: this.form.costFrom,
                        CostTo: this.form.costTo,
                        SalesFrom: this.form.salesFrom,
                        SalesTo: this.form.salesTo,
                        MainSkill: this.form.mainSkill,
                        StartWorkDate: this.form.startWorkDate,
                        ArriveJPDate: this.form.arriveJPDate,
                        AttachResume: this.form.attachResume,
                        AvaiableDate: this.form.avaiableDate,
                        ProposeText: this.form.proposeText,
                        Status: this.form.status,
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
                        this.$refs.child.clearUpload();
                        this.$refs.form.resetFields();
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
                } else {
                    this.$message({
                        type: 'warning',
                        message: '有信息未填写'
                    });
                }
            });
        },
        uploadFile({ file }) {
            if (file) {
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isLt5M) {
                    this.$message.error('上传简历大小不能超过 5MB!');
                } else {
                    this.trus = true;
                    this.form.attachResume = file;

                }
            }
        },
        // 下载简历
        downloads(ids) {
            apiDownloadFile({
                vm: this,
                url: `/api/Candidate/api_downloadcandidateresume?filename=${ids}`,
                filename: ids
            });
        }
    }
};
</script>
<style lang="less">
    .width25{
        margin-left: 16px;
    }
    .marginLeft30{
        margin-left: 30px;
    }
    .flop{
        position: absolute;
        top: 0px;
        left: 45px;
    }
    .flor{
        position: absolute;
        top: 0px;
        left: 100px;
    }
</style>
