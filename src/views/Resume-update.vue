<template>
    <main-wrapper class="resume-update">
        <div class="main-header clearfix" slot="header">
            <el-button v-if="$route.name === 'ResumeUpdate'" size="mini" type="primary" @click="beforeSubmit">{{Number($route.params.id) > 0 ? '変更' : '新規'}}</el-button>
            <el-button v-if="$route.name !== 'ResumeUpdate'" size="mini" type="warning" @click="beforeSubmit">変更</el-button>
            <el-button v-if="Number($route.params.id) > 0 || $route.name === 'ResumeEdit'" size="mini" type="primary" @click="download(Number($route.params.id), 'excel')">下载Excel</el-button>
            <el-button v-if="Number($route.params.id) > 0 || $route.name === 'ResumeEdit'" size="mini" type="primary" @click="download(Number($route.params.id), 'word')">下载Word</el-button>
            <!-- <el-button class="fr" size="mini" @click="$router.back()">リターン</el-button> -->
        </div>
        <el-form size="mini" label-width="100px" ref="form" :model="form" :rules="rules">
            <el-row v-if="!IS_H5">
                <el-col :span="8">
                    <el-form-item label="大学" prop="schoolName">
                        <el-input v-model="form.schoolName" style="max-width: 300px"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="専攻" prop="major">
                        <el-input v-model="form.major" style="max-width: 300px"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="卒業年月" prop="graduateDate" label-width="100px">
                        <el-date-picker
                            style="max-width: 140px;width: auto;"
                            v-model="form.graduateDate"
                            type="month"
                            value-format="yyyy-MM"
                            format="yyyy-MM">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="大学" prop="schoolName" v-if="IS_H5">
                <el-input v-model="form.schoolName"></el-input>
            </el-form-item>
            <el-form-item label="専攻" prop="major" v-if="IS_H5">
                <el-input v-model="form.major"></el-input>
            </el-form-item>
            <el-form-item label="卒業年月" prop="graduateDate" v-if="IS_H5">
                <el-date-picker
                    style="width: 100%;"
                    v-model="form.graduateDate"
                    type="month"
                    value-format="yyyy-MM"
                    format="yyyy-MM">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="得意技術" prop="masterSkills">
                <el-input type="textarea" :rows="6" maxlength="1000" show-word-limit v-model="form.masterSkills"></el-input>
            </el-form-item>
            <!-- <el-form-item v-for="(item,i) in msTitles" :key="item.id" label="" class="ms-wrapper">
                <div slot="label">
                    <i class="el-icon-delete pointer" color="danger" @click="deleteDe(i)"></i>得意分野{{item.id}}
                </div>
                <el-row :gutter="10">
                    <el-col :span="12">
                        <div class="tel1">
                            <el-input class="tel2" v-model="item['mS0'+item.id+'_Title']" placeholder="タイトル" @input="inputHandler(item.id)"></el-input>
                            <el-input class="tel3" v-model="item['mS0'+item.id+'_Content']" placeholder="内容" @input="inputHandler(item.id)"></el-input>
                        </div>
                        <p v-if="`tip${item.id}` === true" color="danger">タイトルと内容を入力してください！</p>
                    </el-col>
                </el-row>
            </el-form-item> -->
            <el-form-item v-for="(item,i) in msTitles" :key="item.id" label="" class="msg ms-wrapper">
                <div slot="label">
                    <i class="el-icon-delete pointer" color="danger" @click="deleteDe(i)"></i>得意分野
                </div>
                <el-row>
                    <el-col :span="24">
                        <div class="tel1">
                            <el-input class="tel2" v-model="item['mS0_Title']" placeholder="タイトル" @input="inputHandler(i+1)"></el-input>
                            <el-input class="tel3" v-model="item['mS0_Content']" placeholder="内容" @input="inputHandler(i+1)"></el-input>
                        </div>
                        <p v-if="`tip${i+1}` === true" color="danger">タイトルと内容を入力してください！</p>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="mini" v-if='msTitles.length<4' @click="addDe(msTitles.length)">得意分野追加</el-button>
                <el-button type="info" size="mini" v-else >得意分野追加</el-button>
            </el-form-item>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="日本語能力">
                        <el-input type="textarea" v-model="form.jpLangLevel"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="英語能力">
                        <el-input type="textarea" v-model="form.enLangLevel"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-for="(item, i) in form.certificates" :key="i">
                <el-col :span="12">
                    <el-form-item>
                        <div slot="label">
                            <i class="el-icon-delete pointer" color="danger" @click="deleteCerts(i)"></i>資格名
                        </div>
                        <el-input v-model="item.title"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="取得期日">
                        <el-date-picker
                            style="width: auto;"
                            v-model="item.passDate"
                            type="month"
                            value-format="yyyy-MM"
                            format="yyyy-MM">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item>
                <el-button type="primary" size="mini" @click="addCert">資格追加</el-button>
            </el-form-item>
            <el-form-item label="自己PR" prop="selfIntro">
                <el-input v-model="form.selfIntro" type="textarea" :rows="6" maxlength="1000" show-word-limit></el-input>
            </el-form-item>
        </el-form>
        <el-form
            class="project-exp-wrapper"
            v-for="(item, i) in form.projects"
            :key="i"
            :model="item"
            :ref="`form_${i}`"
            size="mini"
            label-width="140px"
            :rules="projectRules">
            <div class="clearfix project-header">
                <span class="fl">プロジェクト経験</span>
                <i class="fr el-icon-delete" color="danger" @click="delProject(i)"></i>
            </div>
            <el-row v-if="!IS_H5">
                <el-col :span="12">
                    <el-form-item label="期間" prop="time">
                        <el-date-picker
                            v-model="item.time"
                            style="width: auto;"
                            type="monthrange"
                            range-separator="~"
                            start-placeholder="開始年月"
                            end-placeholder="終了年月"
                            value-format="yyyy-MM"
                            format="yyyy-MM"></el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="ロケーション" prop="location">
                        <el-input v-model="item.location"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="期間" prop="time" v-if="IS_H5">
                <el-date-picker
                    v-model="item.time"
                    style="width: auto;"
                    type="monthrange"
                    range-separator="~"
                    start-placeholder="開始年月"
                    end-placeholder="終了年月"
                    value-format="yyyy-MM"
                    format="yyyy-MM"></el-date-picker>
            </el-form-item>
            <el-form-item label="ロケーション" prop="location" v-if="IS_H5">
                <el-input v-model="item.location"></el-input>
            </el-form-item>
            <el-form-item label="プロジェクト名称" prop="projectName">
                <el-input v-model="item.projectName"></el-input>
            </el-form-item>
            <el-row v-if="!IS_H5">
                <el-col :span="8">
                    <el-form-item label="ポジション" prop="position">
                        <el-input v-model="item.position"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="SAPバージョン" label-width="160px" prop="systemInfo">
                        <el-input v-model="item.systemInfo"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="モジュール" prop="modules">
                        <el-input v-model="item.modules"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="ポジション" prop="position" v-if="IS_H5">
                <el-input v-model="item.position"></el-input>
            </el-form-item>
            <el-form-item label="SAPバージョン" prop="systemInfo" v-if="IS_H5">
                <el-input v-model="item.systemInfo"></el-input>
            </el-form-item>
            <el-form-item label="モジュール" v-if="IS_H5">
                <el-input v-model="item.modules"></el-input>
            </el-form-item>
            <el-form-item label="プロジェクト概要">
                <el-input type="textarea" v-model="item.projectDesc" :rows="3"></el-input>
            </el-form-item>
            <el-form-item label="作業内容">
                <el-input type="textarea" v-model="item.workContent" :rows="5"></el-input>
            </el-form-item>
            <el-form-item label="参画フェーズ">
                <el-checkbox v-model="item.requirementDef">要件定義</el-checkbox>
                <el-checkbox v-model="item.basicDesign">基本設計</el-checkbox>
                <el-checkbox v-model="item.detailDesign">詳細設計</el-checkbox>
                <el-checkbox v-model="item.development">製造・単体テスト</el-checkbox>
                <el-checkbox v-model="item.unitTest">単体テスト</el-checkbox>
                <el-checkbox v-model="item.integratedTest">結合テスト</el-checkbox>
                <el-checkbox v-model="item.systemTest">総合テスト</el-checkbox>
                <el-checkbox v-model="item.dataMigration">データ移行</el-checkbox>
                <el-checkbox v-model="item.maintenance">運用保守</el-checkbox>
            </el-form-item>

        </el-form>
        <div class="text-center">
            <el-button size="mini" type="primary" @click="newProject">プロジェクト経験追加</el-button>
        </div>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import { mapGetters } from 'vuex';
import moment from 'moment';
import { apiDownloadFile } from '@_public/utils';
export default {
    components: {
        MainWrapper
    },
    data() {
        return {
            msTitles: [{
                id: 'v1',
                mS0_Title: '',
                mS0_Content: ''
            }],
            form: {
                id: 0,
                schoolName: '',
                major: '',
                graduateDate: '',
                masterSkills: '',
                selfIntro: '',
                mS01_Title: '',
                mS01_Content: '',
                mS02_Title: '',
                mS02_Content: '',
                mS03_Title: '',
                mS03_Content: '',
                mS04_Title: '',
                mS04_Content: '',
                jpLangLevel: '',
                enLangLevel: '',
                certificates: [{
                    id: 0,
                    title: '',
                    passDate: ''
                }],
                projects: [{
                    id: 0,
                    time: '',
                    projectName: '',
                    position: '',
                    projectDesc: '',
                    workContent: '',
                    modules: '',
                    location: '',
                    systemInfo: '',
                    requirementDef: false,
                    basicDesign: false,
                    detailDesign: false,
                    development: false,
                    integratedTest: false,
                    systemTest: false,
                    dataMigration: false,
                    maintenance: false,
                    unitTest: false,
                }]
            },
            rules: {
                schoolName: [{
                    required: true, message: '大学を入力してください！'
                }],
                major: [{
                    required: true, message: '専攻を入力してください！'
                }],
                masterSkills: [{
                    required: true, message: '得意技術を入力してください！'
                }],
                graduateDate: [{
                    required: true, message: '卒業年月を入力してください！'
                }],
                selfIntro: [{
                    required: true, message: '自己PRを入力してください！'
                }]
            },
            projectRules: {
                time: [{
                    required: true, message: '期間を指定してください！'
                }],
                projectName: [{
                    required: true, message: 'プロジェクト名称を入力してください！'
                }],
                position: [{
                    required: true, message: 'ポジションを入力してください！'
                }],
                systemInfo: [{
                    required: true, message: 'SAPバージョンを入力してください！'
                }],
                modules: [{
                    required: true, message: 'モジュールを入力してください！'
                }],
                location: [{
                    required: true, message: 'ロケーションを入力してください！'
                }]
            },
            tip1: false,
            tip2: false,
            tip3: false,
            tip4: false,
            employeeID: ''
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (to.name === 'ResumeEdit') {
                vm.getInfo(0);
            } else {
                if (Number(to.params.id) > 0) {
                    vm.getInfo(1);
                }
            }
        });
    },
    computed: {
        ...mapGetters(['IS_H5'])
    },
    methods: {
        download(row, type) {
            console.log(row, this.$route.params.doId1, this.$route.params.doId2);
            if (type === 'excel') {
                apiDownloadFile({
                    vm: this,
                    url: `/api/Resume/api_downloadresumeexcel?id=${row}`,
                    filename: `YP履歴書_${this.$route.params.doId1.substring(0, 1)}${this.$route.params.doId2.substring(0,1)}.xlsx`
                });
            } else if (type === 'word') {
                apiDownloadFile({
                    vm: this,
                    url: `/api/Resume/api_downloadresumeword?id=${row}`,
                    filename: `YP履歴書_${this.$route.params.doId1.substring(0, 1)}${this.$route.params.doId2.substring(0,1)}.doc`
                });
            }
        },
        getInfo(type) {
            const loading = this.$loading({ lock: true, text: 'データ取得中...' });
            let url = '/api/Resume/api_getresumebyuser';
            let params = {};
            if (type) {
                url = '/api/Resume/api_getresumebyid';
                params.ID = Number(this.$route.params.id) || 1;
            }
            this.$axios({
                url,
                params,
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    const data = res.data || {};
                    let msTitle = [];
                    if(data.mS01_Title!==null || data.mS01_Content!==null){
                        let obj1 = {
                            id: 'v1',
                            mS0_Title: data.mS01_Title,
                            mS0_Content: data.mS01_Content
                        };
                        msTitle.push(obj1);
                    }
                    if(data.mS02_Title!==null || data.mS02_Content!==null){
                        let obj2 = {
                            id: 'v2',
                            mS0_Title: data.mS02_Title,
                            mS0_Content: data.mS02_Content
                        };
                        msTitle.push(obj2);
                    }
                    if(data.mS03_Title!==null || data.mS03_Content!==null){
                        let obj3 = {
                            id: 'v3',
                            mS0_Title: data.mS03_Title,
                            mS0_Content: data.mS03_Content
                        };
                        msTitle.push(obj3);
                    }
                    if(data.mS04_Title!==null || data.mS04_Content!==null){
                        let obj4 = {
                            id: 'v4',
                            mS0_Title: data.mS04_Title,
                            mS0_Content: data.mS04_Content
                        };
                        msTitle.push(obj4);
                    }
                    if(data.mS01_Title===null&&data.mS01_Content===null&&data.mS02_Title===null&&data.mS02_Content===null&&data.mS03_Title===null&&data.mS03_Content===null&&data.mS04_Title===null&&data.mS04_Content===null){
                        let obj = {
                            id: 'v1',
                            mS0_Title: '',
                            mS0_Content: ''
                        };
                        msTitle.push(obj);
                    }
                    // let obj2 = {
                    //     id: 2,
                    //     mS02_Title: data.mS02_Title,
                    //     mS02_Content: data.mS02_Content
                    // };
                    // let obj3 = {
                    //     id: 3,
                    //     mS03_Title: data.mS03_Title,
                    //     mS03_Content: data.mS03_Content
                    // };
                    // let obj4 = {
                    //     id: 4,
                    //     mS04_Title: data.mS04_Title,
                    //     mS04_Content: data.mS04_Content
                    // };
                    
                    // msTitle.push(obj2);
                    // msTitle.push(obj3);
                    // msTitle.push(obj4);
                    this.msTitles = msTitle;
                    console.log(this.msTitles);
                    const baseForm = JSON.parse(JSON.stringify(this.form));
                    console.log(baseForm);
                    const baseProjects = { ...baseForm.projects[0] };
                    const baseCerts = { ...baseForm.certificates[0] };
                    const projects = data.projects || [];
                    const certs = data.certificates || [];
                    const form = {};
                    for (let key in baseForm) {
                        if (key !== 'projects' || key !== 'certificates') {
                            form[key] = data[key];
                        }
                        if (key === 'graduateDate') {
                            form[key] = moment(new Date(data[key])).format('YYYY-MM');
                        }
                    }
                    if (data.employeeID) {
                        this.employeeID = data.employeeID;
                    }
                    this.form = Object.assign({ ...form }, {
                        projects: projects.map(item => {
                            const tmp = {};
                            for (let key in baseProjects) {
                                if (key !== 'fromDate' || key !== 'toDate') {
                                    // if (key === 'ID' && !item[key]) {
                                    //     continue;
                                    // }
                                    tmp[key] = item[key];
                                }
                            }
                            tmp.time = [
                                (item.fromDate && moment(new Date(item.fromDate).getTime()).format('YYYY-MM')) || '',
                                (item.toDate && moment(new Date(item.toDate).getTime()).format('YYYY-MM')) || ''
                            ];
                            return tmp;
                        }),
                        certificates: certs.map(item => {
                            const tmp = {};
                            for (let key in baseCerts) {
                                if (key === 'id' && !item[key]) {
                                    continue;
                                }
                                tmp[key] = item[key];
                            }
                            return tmp;
                        })
                    });
                    console.log(this.form);
                } else {
                    this.$message({
                        type: 'error',
                        message: res ? res.message : '接口开小差了，没有返回信息'
                    });
                }
            });
        },
        newProject() {
            this.form.projects.push({
                time: '',
                projectName: '',
                position: '',
                projectDesc: '',
                workContent: '',
                modules: '',
                location: '',
                systemInfo: '',
                requirementDef: false,
                basicDesign: false,
                detailDesign: false,
                development: false,
                integratedTest: false,
                systemTest: false,
                dataMigration: false,
                maintenance: false,
                unitTest: false,
            });
        },
        delProject(index) {
            this.form.projects.splice(index, 1);
        },
        beforeSubmit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    let count = 0;
                    this.form.projects.forEach((item, i) => {
                        this.$refs[`form_${i}`][0].validate(valid => {
                            if (valid) {
                                count++;
                            } else {
                                this.$message({
                                    type: 'warning',
                                    message: '有信息未填写'
                                });
                            }
                        });
                    });
                    if (count === this.form.projects.length) {
                        const params = {
                            ID: (this.form.id && Number(this.form.id)) || 0,
                            schoolName: this.form.schoolName || '',
                            major: this.form.major || '',
                            graduateDate: (this.form.graduateDate && `${this.form.graduateDate}-01`) || '',
                            masterSkills: this.form.masterSkills || '',
                            mS01_Title: this.form.mS01_Title || '',
                            mS01_Content: this.form.mS01_Content || '',
                            mS02_Title: this.form.mS02_Title || '',
                            mS02_Content: this.form.mS02_Content || '',
                            mS03_Title: this.form.mS03_Title || '',
                            mS03_Content: this.form.mS03_Content || '',
                            mS04_Title: this.form.mS04_Title || '',
                            mS04_Content: this.form.mS04_Content || '',
                            selfIntro: this.form.selfIntro || '',
                            jpLangLevel: this.form.jpLangLevel || '',
                            enLangLevel: this.form.enLangLevel || '',
                            certificates: this.form.certificates || []
                        };
                        let noPass = false;
                        this.form.certificates.forEach(item => {
                            console.log(item.title, item.passDate);
                            if ((item.title === '' && item.passDate !== '') || (item.title !== '' && item.passDate === '') || (item.title === '' && item.passDate === '')) {
                                noPass = true;
                            }
                        });
                        if (noPass) {
                            this.$message({
                                type: 'warning',
                                message: '请填写資格名'
                            });
                            return false;
                        }
                        if ((this.form.mS01_Title && !this.form.mS01_Content) || (!this.form.mS01_Title && this.form.mS01_Content)) {
                            this.tip1 = true;
                            return;
                        }
                        if ((this.form.mS02_Title && !this.form.mS02_Content) || (!this.form.mS02_Title && this.form.mS02_Content)) {
                            this.tip2 = true;
                            return;
                        }
                        if ((this.form.mS03_Title && !this.form.mS03_Content) || (!this.form.mS03_Title && this.form.mS03_Content)) {
                            this.tip3 = true;
                            return;
                        }
                        if ((this.form.mS04_Title && !this.form.mS04_Content) || (!this.form.mS04_Title && this.form.mS04_Content)) {
                            this.tip4 = true;
                            return;
                        }
                        params.ID = this.form.id;
                        params['employeeID'] = this.$route.params.epId || this.employeeID;
                        delete params.projects;

                        params.projects = this.form.projects && this.form.projects.map(item => {
                            const tmp = { ...item };
                            delete tmp.time;
                            tmp.fromDate = (item.time && `${item.time[0]}-01`) || '';
                            tmp.toDate = (item.time && `${item.time[1]}-01`) || '';
                            tmp.position = item.position || '';
                            tmp.modules = item.modules || '';
                            tmp.projectDesc = item.projectDesc || '';
                            return tmp;
                        });
                        this.submit(params);
                    }
                }
            });
        },
        submit(params) {
            const loading = this.$loading({ lock: true, text: '正在提交信息中...' });
            console.log(params);
            this.$axios({
                formData: true,
                method: 'POST',
                url: '/api/Resume/api_updateresume',
                params,
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    });
                    if (Number(this.$route.params.id) || this.$route.name === 'ResumeEdit') {
                        if (this.$route.name === 'ResumeEdit') {
                            this.getInfo(0);
                        } else {
                            this.getInfo(1);
                        }
                    } else {
                        let epId = this.$route.params.epId;
                        let id = res.data || 0;
                        if (this.$route.name === 'ResumeEdit') {
                            epId = this.employeeID;
                            id = this.form.ID;
                        }
                        this.$router.replace({
                            name: 'ResumeUpdate',
                            params: {
                                epId,
                                id
                            }
                        });
                    }
                } else {
                    this.$message({
                        type: 'error',
                        message: res ? res.message : '接口开小差了，没有返回信息'
                    });
                }
            });
        },
        inputHandler(type) {
            if (type === 1) {
                this.tip1 = false;
                this.form.mS01_Title = this.msTitles[0].mS0_Title;
                this.form.mS01_Content = this.msTitles[0].mS0_Content;
            } else if (type === 2) {
                this.tip2 = false;
                this.form.mS02_Title = this.msTitles[1].mS0_Title;
                this.form.mS02_Content = this.msTitles[1].mS0_Content;
            } else if (type === 3) {
                this.tip3 = false;
                this.form.mS03_Title = this.msTitles[2].mS0_Title;
                this.form.mS03_Content = this.msTitles[2].mS0_Content;
            } else if (type === 4) {
                this.tip4 = false;
                this.form.mS04_Title = this.msTitles[3].mS0_Title;
                this.form.mS04_Content = this.msTitles[3].mS0_Content;
            }
        },
        addCert() {
            this.form.certificates.push({
                title: '',
                passDate: ''
            });
        },
        addDe(row) {
            // var rowd = row + 1;
            // var title = 'mS0'+ rowd +'_Title';
            // var content = 'mS0'+ rowd +'_Content';
            // this.msTitles.push({
            //     id: rowd,
            //     [`${title}`]: '',
            //     [`${content}`]: '',
            // });
            var rowd = row + 1;
            this.msTitles.push({
                id: 'v'+rowd,
                mS0_Title: '',
                mS0_Content: '',
            });
        },
        deleteCerts(i) {
            this.form.certificates.splice(i, 1);
        },
        deleteDe(i) {
            this.msTitles.splice(i, 1);
            if (i === 0) {
                this.form.mS01_Title = '';
                this.form.mS01_Content = '';
            } else if (i === 1){
                this.form.mS02_Title = '';
                this.form.mS02_Content = '';
            } else if (i === 2){
                this.form.mS03_Title = '';
                this.form.mS03_Content = '';
            } else if (i === 3){
                this.form.mS04_Title = '';
                this.form.mS04_Content = '';
            }
            this.msTitles.forEach((item,i) => {
                if(i === 0){
                    this.form.mS01_Title = item.mS0_Title;
                    this.form.mS01_Content = item.mS0_Content;
                } else if (i === 1){
                    this.form.mS02_Title = item.mS0_Title;
                    this.form.mS02_Content = item.mS0_Content;
                } else if (i === 2){
                    this.form.mS03_Title = item.mS0_Title;
                    this.form.mS03_Content = item.mS0_Content;
                } else if (i === 3){
                    this.form.mS04_Title = item.mS0_Title;
                    this.form.mS04_Content = item.mS0_Content;
                }
            });
        }
    }
};
</script>

<style scoped lang="less">
.resume-update {
    .main-header {
        .fr {
            margin-top: 10px;
        }
    }
    .project-exp-wrapper {
        padding: 10px;
        border-radius: 4px;
        margin-bottom: 10px;
        border: 1px solid #DCDFE6;
        .project-header {
            height: 32px;
            line-height: 32px;
            span {
                font-weight: bold;
            }
            .el-icon-delete {
                cursor: pointer;
                font-size: 16px;
                line-height: 32px;
            }
        }
    }
    .text-center {
        text-align: center;
    }
    .ms-wrapper {
        .mt-10 {
            margin-top: 10px;
        }
        .el-input {
            width: 100%;
        }
    }
    .pointer {
        cursor: pointer;
        margin-right: 5px;
    }
    .tel1{
        overflow: hidden;
        .tel2{
            width: 30%;
            float: left;
        }
        .tel3{
            width: calc(70% - 20px);
            float: right;
            // margin-left: 20px;
        }
    }
}
</style>
