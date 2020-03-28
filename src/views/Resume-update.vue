<template>
    <main-wrapper class="resume-update">
        <div class="main-header clearfix" slot="header">
            <el-button size="mini" type="primary" @click="beforeSubmit">{{Number($route.params.id) > 0 ? '更新' : '新增'}}</el-button>
            <el-button class="fr" size="mini" type="primary" @click="$router.back()">返回</el-button>
        </div>
        <el-form size="mini" label-width="80px" ref="form" :model="form" :rules="rules">
            <el-row>
                <el-col :span="12">
                    <el-form-item label="大学" prop="SchoolName">
                        <el-input v-model="form.SchoolName"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="専攻" prop="Major">
                        <el-input v-model="form.Major"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="得意技術" prop="MasterSkills">
                <el-input v-model="form.MasterSkills"></el-input>
            </el-form-item>
            <el-form-item label="SAP経験" prop="SAPExperience">
                <el-input v-model="form.SAPExperience"></el-input>
            </el-form-item>
            <el-form-item label="自己PR" prop="SelfIntro">
                <el-input v-model="form.SelfIntro" type="textarea" :rows="5"></el-input>
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
            <el-form-item label="プロジェクト名称" prop="ProjectName">
                <el-input v-model="item.ProjectName"></el-input>
            </el-form-item>
            <el-row v-if="!IS_H5">
                <el-col :span="12">
                    <el-form-item label="ポジション" prop="Position">
                        <el-input v-model="item.Position"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item label="SAPﾊﾞｰｼﾞｮﾝ/ﾓｼﾞｭｰﾙ" label-width="150px" prop="SystemInfo">
                        <el-input v-model="item.SystemInfo"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-form-item label="ポジション" prop="Position" v-if="IS_H5">
                <el-input v-model="item.Position"></el-input>
            </el-form-item>
            <el-form-item label="SAPﾊﾞｰｼﾞｮﾝ/ﾓｼﾞｭｰﾙ" prop="SystemInfo" v-if="IS_H5">
                <el-input v-model="item.SystemInfo"></el-input>
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
                SchoolName: '',
                Major: '',
                MasterSkills: '',
                SAPExperience: '',
                SelfIntro: '',
                Projects: [{
                    time: '',
                    ProjectName: '',
                    Position: '',
                    ProjectDesc: '',
                    WorkContent: '',
                    RequirementDef: false,
                    BasicDesign: false,
                    DetailDesign: false,
                    Development: false,
                    IntegratedTest: false,
                    SystemTest: false,
                    DataMigration: false,
                    Maintenance: false,
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
                SAPExperience: [{
                    required: true, message: '请输入SAP経験'
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
                    required: true, message: '请输入SAPﾊﾞｰｼﾞｮﾝ/ﾓｼﾞｭｰﾙ'
                }]
            }
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (Number(to.params.id) > 0) {
                vm.getInfo();
            }
        });
    },
    computed: {
        ...mapGetters(['IS_H5'])
    },
    methods: {
        getInfo() {
            const loading = this.$loading({ lock: true, text: '正在获取信息中...' });
            this.$axios({
                url: '/api/getresumebyid',
                params: {
                    ID: Number(this.$route.params.id) || 1
                },
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    console.log(res);
                    const data = res.data || {};
                    const projects = data.Projects || [];
                    delete data.Projects;
                    delete data.Sex;
                    delete data.Name;
                    delete data.UpdateDate;
                    delete data.EmpeeID;
                    this.form = Object.assign({ ...data }, {
                        Projects: projects.map(item => {
                            const tmp = { ...item };
                            tmp.time = [
                                (item.FromDate && moment(new Date(item.FromDate).getTime()).format('YYYY-MM')) || '',
                                (item.ToDate && moment(new Date(item.ToDate).getTime()).format('YYYY-MM')) || ''
                            ];
                            delete item.FromDate;
                            delete item.ToDate;
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
            this.form.Projects.push({
                time: '',
                ProjectName: '',
                Position: '',
                ProjectDesc: '',
                WorkContent: '',
                RequirementDef: false,
                BasicDesign: false,
                DetailDesign: false,
                Development: false,
                IntegratedTest: false,
                SystemTest: false,
                DataMigration: false,
                Maintenance: false,
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
                            }
                        });
                    });
                    if (count === this.form.Projects.length) {
                        const params = { ...this.form };
                        params['employee.ID'] = this.$route.params.epId;
                        delete params.Projects;
            
                        params.Projects = this.form.Projects && this.form.Projects.map(item => {
                            const tmp = { ...item };
                            delete tmp.time;
                            tmp.FromDate = (item.time && `${item.time[0]}-01`) || '';
                            tmp.ToDate = (item.time && `${item.time[1]}-01`) || '';
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
                    if (Number(this.$route.params.id)) {
                        this.getInfo();
                    } else {
                        this.$router.replace({
                            name: 'ResumeUpdate',
                            params: {
                                epId: this.$route.params.epId,
                                id: res.data || 0
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
}
</style>
