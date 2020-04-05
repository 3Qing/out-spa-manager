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
                    <el-form-item label="大学" prop="SchoolName">
                        <el-input v-model="form.SchoolName" style="max-width: 300px"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="専攻" prop="Major">
                        <el-input v-model="form.Major" style="max-width: 300px"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="卒業年月" prop="GraduateDate" label-width="100px">
                        <el-date-picker
                            style="max-width: 140px;width: auto;"
                            v-model="form.GraduateDate"
                            type="month"
                            value-format="yyyy-MM"
                            format="yyyy-MM">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="大学" prop="SchoolName" v-if="IS_H5">
                <el-input v-model="form.SchoolName"></el-input>
            </el-form-item>
            <el-form-item label="専攻" prop="Major" v-if="IS_H5">
                <el-input v-model="form.Major"></el-input>
            </el-form-item>
            <el-form-item label="卒業年月" prop="GraduateDate" v-if="IS_H5">
                <el-date-picker
                    style="width: 100%;"
                    v-model="form.GraduateDate"
                    type="month"
                    value-format="yyyy-MM"
                    format="yyyy-MM">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="得意技術" prop="MasterSkills">
                <el-input type="textarea" :rows="2" v-model="form.MasterSkills"></el-input>
            </el-form-item>
            <el-form-item label="" class="ms-wrapper">
                <el-row :gutter="10">
                    <el-col :span="6">
                        <div><el-input v-model="form.MS01_Title" placeholder="标题" @input="inputHandler(1)"></el-input></div>
                        <div class="mt-10"><el-input v-model="form.MS01_Content" placeholder="内容" @input="inputHandler(1)"></el-input></div>
                        <p v-if="tip1" color="danger">请输入标题和内容</p>
                    </el-col>
                    <el-col :span="6">
                        <div><el-input v-model="form.MS02_Title" placeholder="标题" @input="inputHandler(2)"></el-input></div>
                        <div class="mt-10"><el-input v-model="form.MS02_Content" placeholder="内容" @input="inputHandler(2)"></el-input></div>
                        <p v-if="tip2" color="danger">请输入标题和内容</p>
                    </el-col>
                    <el-col :span="6">
                        <div><el-input v-model="form.MS03_Title" placeholder="标题" @input="inputHandler(3)"></el-input></div>
                        <div class="mt-10"><el-input v-model="form.MS03_Content" placeholder="内容" @input="inputHandler(3)"></el-input></div>
                        <p v-if="tip3" color="danger">请输入标题和内容</p>
                    </el-col>
                    <el-col :span="6">
                        <div><el-input v-model="form.MS04_Title" placeholder="标题" @input="inputHandler(4)"></el-input></div>
                        <div class="mt-10"><el-input v-model="form.MS04_Content" placeholder="内容" @input="inputHandler(4)"></el-input></div>
                        <p v-if="tip4" color="danger">请输入标题和内容</p>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="日本語能力">
                        <el-input type="textarea" v-model="form.JPLangLevel"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="英語能力">
                        <el-input type="textarea" v-model="form.ENLangLevel"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row v-for="(item, i) in form.Certificates" :key="i">
                <el-col :span="12">
                    <el-form-item>
                        <div slot="label">
                            <i class="el-icon-delete pointer" color="danger" @click="deleteCerts(i)"></i>資格名
                        </div>
                        <el-input v-model="item.Title"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="取得期日">
                        <el-date-picker
                            style="width: auto;"
                            v-model="item.Date"
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
            <el-form-item label="自己PR" prop="SelfIntro">
                <el-input v-model="form.SelfIntro" type="textarea" :rows="3"></el-input>
            </el-form-item>
        </el-form>
        <el-form
            class="project-exp-wrapper"
            v-for="(item, i) in form.Projects"
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
                    <el-form-item label="ロケーション" prop="Location">
                        <el-input v-model="item.Location"></el-input>
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
            <el-form-item label="ロケーション" prop="Location" v-if="IS_H5">
                <el-input v-model="item.Location"></el-input>
            </el-form-item>
            <el-form-item label="プロジェクト名称" prop="ProjectName">
                <el-input v-model="item.ProjectName"></el-input>
            </el-form-item>
            <el-row v-if="!IS_H5">
                <el-col :span="8">
                    <el-form-item label="ポジション" prop="Position">
                        <el-input v-model="item.Position"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="SAPバージョン" label-width="160px" prop="SystemInfo">
                        <el-input v-model="item.SystemInfo"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="8">
                    <el-form-item label="モジュール" prop="Modules">
                        <el-input v-model="item.Modules"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="ポジション" prop="Position" v-if="IS_H5">
                <el-input v-model="item.Position"></el-input>
            </el-form-item>
            <el-form-item label="SAPバージョン" prop="SystemInfo" v-if="IS_H5">
                <el-input v-model="item.SystemInfo"></el-input>
            </el-form-item>
            <el-form-item label="モジュール" v-if="IS_H5">
                <el-input v-model="item.Modules"></el-input>
            </el-form-item>
            <el-form-item label="プロジェクト概要">
                <el-input type="textarea" v-model="item.ProjectDesc" :rows="3"></el-input>
            </el-form-item>
            <el-form-item label="作業内容">
                <el-input type="textarea" v-model="item.WorkContent" :rows="5"></el-input>
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
                SchoolName: '',
                Major: '',
                GraduateDate: '',
                MasterSkills: '',
                SelfIntro: '',
                MS01_Title: '',
                MS01_Content: '',
                MS02_Title: '',
                MS02_Content: '',
                MS03_Title: '',
                MS03_Content: '',
                MS04_Title: '',
                MS04_Content: '',
                JPLangLevel: '',
                ENLangLevel: '',
                Certificates: [{
                    ID: '',
                    Title: '',
                    Date: ''
                }],
                Projects: [{
                    ID: '',
                    time: '',
                    ProjectName: '',
                    Position: '',
                    ProjectDesc: '',
                    WorkContent: '',
                    Modules: '',
                    Location: '',
                    SystemInfo: '',
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
                SchoolName: [{
                    required: true, message: '请输入大学'
                }],
                Major: [{
                    required: true, message: '请输入専攻'
                }],
                MasterSkills: [{
                    required: true, message: '请输入得意技術'
                }],
                GraduateDate: [{
                    required: true, message: '请输入卒業年月'
                }],
                SelfIntro: [{
                    required: true, message: '请输入自己PR'
                }]
            },
            projectRules: {
                time: [{
                    required: true, message: '请选择期間'
                }],
                ProjectName: [{
                    required: true, message: '请输入プロジェクト名称'
                }],
                Position: [{
                    required: true, message: '请输入ポジション'
                }],
                SystemInfo: [{
                    required: true, message: '请输入SAPバージョン'
                }],
                Modules: [{
                    required: true, message: '请输入モジュール'
                }],
                Location: [{
                    required: true, message: '请输入ロケーション'
                }]
            },
            tip1: false,
            tip2: false,
            tip3: false,
            tip4: false,
            EmpeeID: ''
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
            let url = '/api/getresumebyuser';
            let params = {};
            if (type) {
                url = '/api/getresumebyid';
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
                    const baseProjects = { ...baseForm.Projects[0] };
                    const baseCerts = { ...baseForm.Certificates[0] };
                    const projects = data.Projects || [];
                    const certs = data.Certificates || [];
                    const form = {};
                    for (let key in baseForm) {
                        if (key !== 'Project' || key !== 'Certificates') {
                            form[key] = data[key];
                        }
                        if (key === 'GraduateDate') {
                            form[key] = moment(new Date(data[key])).format('YYYY-MM');
                        }
                    }
                    if (data.EmpeeID) {
                        this.EmpeeID = data.EmpeeID;
                    }
                    this.form = Object.assign({ ...form }, {
                        Projects: projects.map(item => {
                            const tmp = {};
                            for (let key in baseProjects) {
                                if (key !== 'FromDate' || key !== 'ToDate') {
                                    if (key === 'ID' && !item[key]) {
                                        continue;
                                    }
                                    tmp[key] = item[key];
                                }
                            }
                            tmp.time = [
                                (item.FromDate && moment(new Date(item.FromDate).getTime()).format('YYYY-MM')) || '',
                                (item.ToDate && moment(new Date(item.ToDate).getTime()).format('YYYY-MM')) || ''
                            ];
                            return tmp;
                        }),
                        Certificates: certs.map(item => {
                            const tmp = {};
                            for (let key in baseCerts) {
                                if (key === 'ID' && !item[key]) {
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
            this.form.Projects.push({
                time: '',
                ProjectName: '',
                Position: '',
                ProjectDesc: '',
                WorkContent: '',
                Modules: '',
                Location: '',
                SystemInfo: '',
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
            this.form.Projects.splice(index, 1);
        },
        beforeSubmit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    let count = 0;
                    this.form.Projects.forEach((item, i) => {
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
                    if (count === this.form.Projects.length) {
                        const params = {
                            ID: (this.form.ID && Number(this.form.ID)) || '',
                            SchoolName: this.form.SchoolName || '',
                            Major: this.form.Major || '',
                            GraduateDate: (this.form.GraduateDate && `${this.form.GraduateDate}-01`) || '',
                            MasterSkills: this.form.MasterSkills || '',
                            MS01_Title: this.form.MS01_Title || '',
                            MS01_Content: this.form.MS01_Content || '',
                            MS02_Title: this.form.MS02_Title || '',
                            MS02_Content: this.form.MS02_Content || '',
                            MS03_Title: this.form.MS03_Title || '',
                            MS03_Content: this.form.MS03_Content || '',
                            MS04_Title: this.form.MS04_Title || '',
                            MS04_Content: this.form.MS04_Content || '',
                            SelfIntro: this.form.SelfIntro || '',
                            JPLangLevel: this.form.JPLangLevel || '',
                            ENLangLevel: this.form.ENLangLevel || '',
                            Certificates: this.form.Certificates || []
                        };
                        let noPass = false;
                        this.form.Certificates.forEach(item => {
                            if ((item.Title && !item.Date) || (!item.Title && item.Date)) {
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
                        if ((this.form.MS01_Title && !this.form.MS01_Content) || (!this.form.MS01_Title && this.form.MS01_Content)) {
                            this.tip1 = true;
                            return;
                        }
                        if ((this.form.MS02_Title && !this.form.MS02_Content) || (!this.form.MS02_Title && this.form.MS02_Content)) {
                            this.tip2 = true;
                            return;
                        }
                        if ((this.form.MS03_Title && !this.form.MS03_Content) || (!this.form.MS03_Title && this.form.MS03_Content)) {
                            this.tip3 = true;
                            return;
                        }
                        if ((this.form.MS04_Title && !this.form.MS04_Content) || (!this.form.MS04_Title && this.form.MS04_Content)) {
                            this.tip4 = true;
                            return;
                        }
                        if (this.$route.params.id) {
                            params.ID = this.$route.params.id;
                        }
                        params['employee.ID'] = this.$route.params.epId || this.EmpeeID;
                        delete params.Projects;

                        params.Projects = this.form.Projects && this.form.Projects.map(item => {
                            const tmp = { ...item };
                            delete tmp.time;
                            tmp.FromDate = (item.time && `${item.time[0]}-01`) || '';
                            tmp.ToDate = (item.time && `${item.time[1]}-01`) || '';
                            tmp.Position = item.Position || '';
                            tmp.Modules = item.Modules || '';
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
                            epId = this.EmpeeID;
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
            this.form.Certificates.push({
                Title: '',
                Date: ''
            });
        },
        deleteCerts(i) {
            this.form.Certificates.splice(i, 1);
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
