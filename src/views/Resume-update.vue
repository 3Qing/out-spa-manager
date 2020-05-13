<template>
    <main-wrapper class="resume-update">
        <div class="main-header clearfix" slot="header">
            <el-button v-if="$route.name === 'ResumeUpdate'" size="mini" type="primary" @click="beforeSubmit">{{Number($route.params.id) > 0 ? '更新' : '新增'}}</el-button>
            <el-button v-else size="mini" type="primary" @click="beforeSubmit">修改</el-button>
            <el-button class="fr" size="mini" type="primary" @click="$router.back()">返回</el-button>
        </div>
        <el-form size="mini" label-width="90px" ref="form" :model="form" :rules="rules">
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
                <el-input type="textarea" :rows="2" v-model="form.masterSkills"></el-input>
            </el-form-item>
            <el-form-item label="" class="ms-wrapper">
                <el-row :gutter="10">
                    <el-col :span="6">
                        <div><el-input v-model="form.mS01_Title" placeholder="标题" @input="inputHandler(1)"></el-input></div>
                        <div class="mt-10"><el-input v-model="form.mS01_Content" placeholder="内容" @input="inputHandler(1)"></el-input></div>
                        <p v-if="tip1" color="danger">请输入标题和内容</p>
                    </el-col>
                    <el-col :span="6">
                        <div><el-input v-model="form.mS02_Title" placeholder="标题" @input="inputHandler(2)"></el-input></div>
                        <div class="mt-10"><el-input v-model="form.mS02_Content" placeholder="内容" @input="inputHandler(2)"></el-input></div>
                        <p v-if="tip2" color="danger">请输入标题和内容</p>
                    </el-col>
                    <el-col :span="6">
                        <div><el-input v-model="form.mS03_Title" placeholder="标题" @input="inputHandler(3)"></el-input></div>
                        <div class="mt-10"><el-input v-model="form.mS03_Content" placeholder="内容" @input="inputHandler(3)"></el-input></div>
                        <p v-if="tip3" color="danger">请输入标题和内容</p>
                    </el-col>
                    <el-col :span="6">
                        <div><el-input v-model="form.mS04_Title" placeholder="标题" @input="inputHandler(4)"></el-input></div>
                        <div class="mt-10"><el-input v-model="form.mS04_Content" placeholder="内容" @input="inputHandler(4)"></el-input></div>
                        <p v-if="tip4" color="danger">请输入标题和内容</p>
                    </el-col>
                </el-row>
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
                <el-button type="primary" size="mini" @click="addCert">新增资格</el-button>
            </el-form-item>
            <el-form-item label="自己PR" prop="selfIntro">
                <el-input v-model="form.selfIntro" type="textarea" :rows="3"></el-input>
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
                            start-placeholder="开始月份"
                            end-placeholder="结束月份"
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
                    start-placeholder="开始月份"
                    end-placeholder="结束月份"
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
                <el-checkbox v-model="item.RequirementDef">要件定義</el-checkbox>
                <el-checkbox v-model="item.BasicDesign">基本設計</el-checkbox>
                <el-checkbox v-model="item.DetailDesign">詳細設計</el-checkbox>
                <el-checkbox v-model="item.Development">製造・単体テスト</el-checkbox>
                <el-checkbox v-model="item.UnitTest">単体テスト</el-checkbox>
                <el-checkbox v-model="item.IntegratedTest">結合テスト</el-checkbox>
                <el-checkbox v-model="item.SystemTest">総合テスト</el-checkbox>
                <el-checkbox v-model="item.DataMigration">データ移行</el-checkbox>
                <el-checkbox v-model="item.Maintenance">運用保守</el-checkbox>
            </el-form-item>

        </el-form>
        <div class="text-center">
            <el-button size="mini" type="primary" @click="newProject">新增项目经验</el-button>
        </div>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import { mapGetters } from 'vuex';
import moment from 'moment';
export default {
    components: {
        MainWrapper
    },
    data() {
        return {
            form: {
                ID: '',
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
                    ID: '',
                    title: '',
                    passDate: ''
                }],
                projects: [{
                    ID: '',
                    time: '',
                    projectName: '',
                    position: '',
                    projectDesc: '',
                    workContent: '',
                    modules: '',
                    location: '',
                    systemInfo: '',
                    RequirementDef: false,
                    BasicDesign: false,
                    DetailDesign: false,
                    Development: false,
                    IntegratedTest: false,
                    SystemTest: false,
                    DataMigration: false,
                    Maintenance: false,
                    UnitTest: false,
                }]
            },
            rules: {
                schoolName: [{
                    required: true, message: '请输入大学'
                }],
                major: [{
                    required: true, message: '请输入専攻'
                }],
                masterSkills: [{
                    required: true, message: '请输入得意技術'
                }],
                graduateDate: [{
                    required: true, message: '请输入卒業年月'
                }],
                selfIntro: [{
                    required: true, message: '请输入自己PR'
                }]
            },
            projectRules: {
                time: [{
                    required: true, message: '请选择期間'
                }],
                projectName: [{
                    required: true, message: '请输入プロジェクト名称'
                }],
                position: [{
                    required: true, message: '请输入ポジション'
                }],
                systemInfo: [{
                    required: true, message: '请输入SAPバージョン'
                }],
                modules: [{
                    required: true, message: '请输入モジュール'
                }],
                location: [{
                    required: true, message: '请输入ロケーション'
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
        getInfo(type) {
            const loading = this.$loading({ lock: true, text: '正在获取信息中...' });
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
                    const baseForm = JSON.parse(JSON.stringify(this.form));
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
                                    if (key === 'ID' && !item[key]) {
                                        continue;
                                    }
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
                RequirementDef: false,
                BasicDesign: false,
                DetailDesign: false,
                Development: false,
                IntegratedTest: false,
                SystemTest: false,
                DataMigration: false,
                Maintenance: false,
                UnitTest: false,
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
                            ID: (this.form.ID && Number(this.form.ID)) || '',
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
                            if ((item.title && !item.passDate) || (!item.title && item.passDate)) {
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
                        if (this.$route.params.id) {
                            params.ID = this.$route.params.id;
                        }
                        params['employee.ID'] = this.$route.params.epId || this.employeeID;
                        delete params.projects;

                        params.projects = this.form.projects && this.form.projects.map(item => {
                            const tmp = { ...item };
                            delete tmp.time;
                            tmp.fromDate = (item.time && `${item.time[0]}-01`) || '';
                            tmp.toDate = (item.time && `${item.time[1]}-01`) || '';
                            tmp.position = item.position || '';
                            tmp.modules = item.modules || '';
                            return tmp;
                        });
                        this.submit(params);
                    }
                }
            });
        },
        submit(params) {
            const loading = this.$loading({ lock: true, text: '正在提交信息中...' });
            this.$axios({
                method: 'POST',
                url: '/api/updateresume',
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
            } else if (type === 2) {
                this.tip2 = false;
            } else if (type === 3) {
                this.tip3 = false;
            } else {
                this.tip4 = false;
            }
        },
        addCert() {
            this.form.certificates.push({
                title: '',
                passDate: ''
            });
        },
        deleteCerts(i) {
            this.form.certificates.splice(i, 1);
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
}
</style>
