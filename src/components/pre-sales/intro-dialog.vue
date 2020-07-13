<template>
    <el-dialog custom-class="intro-dialog" :title="form.id ? '候補者編集' : '候補者新規登録'" :visible.sync="visible" :close-on-click-modal="dialog" @close="close">
        <el-form label-width="130px" size="mini" ref="form" :model="form" :rules="rules" class='blackColor'>
            <el-row>
                <el-col :span="12" class="width50">
                    <el-col :span="6">
                        <el-form-item label="氏名" prop='furigana_FirstName'>
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
                        <el-form-item label="漢字氏名" prop='firstName'>
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
            <el-row>
                <el-col :span="12" class="width50">
                    <el-col :span="6">
                        <el-form-item label="英語氏名" prop='pinYin_FirstName'>
                            <el-input v-model="form.pinYin_FirstName" :maxlength="20"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6" class="width25" label-width="0px">
                        <el-form-item label="" prop='pinYin_LastName'>
                            <el-input v-model="form.pinYin_LastName" :maxlength="20"></el-input>
                        </el-form-item>
                    </el-col>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="性別" prop="sex">
                        <el-select v-model="form.sex">
                            <el-option v-for="(item, i) in sexs" :key="i" :value="item.value" :label="item.label"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="生年月日" prop="birthday">
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
                    <el-form-item label="来日年月" prop="arriveJPDate">
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
                    <el-form-item label="ポジション" prop="positionID">
                        <el-select v-model="form.positionID">
                            <el-option v-for="item in positionTypeArr" :key="item.id" :value="item.id" :label="item.title"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="メインスキル" prop="mainSkill">
                        <el-input v-model="form.mainSkill" :maxlength="20"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="仕事開始日" prop="startWorkDate">
                        <el-date-picker
                            v-model="form.startWorkDate"
                            type="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="居住地" prop="liveCity">
                        <el-select v-model="form.liveCity">
                            <el-option v-for="item in cityTypeArr" :key="item.id" :value="item.id" :label="item.text"></el-option>
                        </el-select>
                        <!-- <el-input v-model="form.liveCity" :maxlength="10"></el-input> -->
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="営業開始日" prop="salesFromDate">
                        <el-date-picker
                            v-model="form.salesFromDate"
                            type="date"
                            format="yyyy-MM-dd"
                            value-format="yyyy-MM-dd"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="稼働可能日" prop="avaiableDate">
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
                    <el-form-item label="候補者タイプ">
                        <el-select v-model="form.type" @change="changeHandler">
                            <el-option v-for="item in peopleTypeArr" :key="item.id" :value="item.id" :label="item.text"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if='isfalse'>
                    <el-form-item label="仕入先">
                        <el-select v-model="form.vendorID">
                            <el-option v-for="item in allVenderTypeArr" :key="item.id" :value="item.id" :label="item.title"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="営業状態">
                        <el-select v-model="form.status">
                            <el-option v-for="item in allStatus" :key="item.id" :value="item.id" :label="item.text"></el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="提案文" prop='proposeText'>
                <el-input v-model="form.proposeText" type="textarea" :rows="16" :maxlength="500"></el-input>
            </el-form-item>
            <el-form-item label="コメント">
                <el-input v-model="form.comment" type="textarea" :rows="5" :maxlength="300"></el-input>
            </el-form-item>
            <el-row>
                <el-col :span="24">
                    <el-col :span="12">
                        <el-form-item label="人件費範囲" prop='costFrom'>
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
                        <el-form-item label="提案単価範囲" prop='salesFrom'>
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
                    <el-form-item label="履歴書添付">
                        <upload
                            ref="child"
                            :opt="{ btnText: '履歴書アップロード', accept: 'application/pdf,application/msword,.csv,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', show: trus, showIcon: true }"
                            @upload="uploadFile">
                            </upload>
                        <span class="flop" v-if='form.id&&trus === false && form.attachResume !== null'>
                            {{form.attachResumeFileName}}
                            <i class="iconfont icon-icon-test link mrl" color="primary" @click="downloads(form.attachResumeFileName, form.id)"></i>
                        </span>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <el-button type="primary" size="small" @click="submit">保存</el-button>
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
                vendorID: '',
                positionID: '',
                pinYin_FirstName: '',
                pinYin_LastName: '',
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
                vendorID: [{
                    required: true, message: '仕入先を入力してください！'
                }],
                mainSkill: [{
                    required: true, message: 'メインスキルを入力してください！'
                }],
                furigana_FirstName: [{
                    required: true, message: '氏名を入力してください！'
                }],
                furigana_LastName: [{
                    required: true, message: '氏名を入力してください！'
                }],
                firstName: [{
                    required: true, message: '漢字氏名を入力してください！'
                }],
                lastName: [{
                    required: true, message: '漢字氏名を入力してください！'
                }],
                pinYin_FirstName: [{
                    required: true, message: '英語氏名を入力してください！'
                }],
                pinYin_LastName: [{
                    required: true, message: '英語氏名を入力してください！'
                }],
                sex: [{
                    required: true, message: '性別を指定してください！'
                }],
                birthday: [{
                    required: true, message: '生年月日を入力してください！'
                }],
                positionID: [{
                    required: true, message: 'ポジションを入力してください！'
                }],
                nationality: [{
                    required: true, message: '国籍を指定してください！'
                }],
                startWorkDate: [{
                    required: true, message: '仕事開始日を指定してください！'
                }],
                liveCity: [{
                    required: true, message: '居住地を指定してください！'
                }],
                salesFromDate: [{
                    required: true, message: '営業開始日を入力してください！'
                }],
                avaiableDate: [{
                    required: true, message: '稼働可能日を入力してください！'
                }],
                proposeText: [{
                    required: true, message: '提案文を入力してください！'
                }],
                costFrom: [{
                    required: true, message: '人件費範囲を入力してください！'
                }],
                costTo: [{
                    required: true, message: '人件費範囲を入力してください！'
                }],
                salesFrom: [{
                    required: true, message: '提案単価範囲を入力してください！'
                }],
                salesTo: [{
                    required: true, message: '提案単価範囲をを入力してください！'
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
            positionTypeArr: [],
            peopleTypeArr: [],
            countryTypeArr: [],
            month: '',
            nextMonth: '',
            allVenderTypeArr: [],
            isfalse: false
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
        this.positionType();
        this.vendorType();
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
        changeHandler(val) {
            console.log(val);
            if (val === 2) {
                this.isfalse = true;
            } else {
                this.isfalse = false;
            }
        },
        // 仕入先
        vendorType() {
            this.$axios({
                url: '/api/Customer/api_vendorsforselect'
            }).then(res => {
                this.allVenderTypeArr = res.data;
            });
        },
        // 城市列表
        cityType() {
            this.$axios({
                url: '/api/Candidate/api_cityforselect'
            }).then(res => {
                this.cityTypeArr = res.data;
                this.form.liveCity = this.cityTypeArr[0].id;
            });
        },
        // 岗位列表
        positionType() {
            this.$axios({
                url: '/api/Position/api_positionsforselect'
            }).then(res => {
                this.positionTypeArr = res.data;
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
                vendorID: '',
                positionID: '',
                pinYin_FirstName: '',
                pinYin_LastName: '',
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
                    if (this.form.vendorID === 0) {
                        this.form.vendorID = '';
                    }
                    if (this.form.positionID === 0) {
                        this.form.positionID = '';
                    }
                } else {
                    this.$message({
                        type: 'error',
                        showClose: true,
                        message: res.message ? res.message : 'システム異常、再試行してください！'
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
                    const loading = this.$loading({ lock: true, text: '候補者データを更新中...' });
                    // this.form.nationality = this.getContent(this.form.nationality, this.countryTypeArr, 'id', 'text');
                    console.log(this.form.liveCity);
                    if (this.form.type !== 2) {
                        this.form.vendorID = 0;
                    }
                    if (this.form.vendorID === '') {
                        this.form.vendorID = 0;
                    }
                    const params = {
                        VendorID: this.form.vendorID,
                        PositionID: this.form.positionID,
                        PinYin_FirstName: this.form.pinYin_FirstName,
                        pinYin_LastName: this.form.pinYin_LastName,
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
                                message: res.message ? res.message : 'システム異常、再試行してください！'
                            });
                        }
                    });
                } else {
                    this.$message({
                        type: 'warning',
                        message: '必須項目を全部入力してください！'
                    });
                }
            });
        },
        uploadFile({ file }) {
            if (file) {
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isLt5M) {
                    this.$message.error('添付履歴書のサイズは最大5MB！');
                } else {
                    this.trus = true;
                    this.form.attachResume = file;
                }
            }
        },
        // 下载简历
        downloads(ids, id) {
            apiDownloadFile({
                vm: this,
                url: `/api/Candidate/api_downloadcandidateresume?id=${id}`,
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
    .mrl{
        margin-left: 8px;
    }
</style>
