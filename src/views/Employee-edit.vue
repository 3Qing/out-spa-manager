<template>
    <main-wrapper class="employee-edit">
        <el-form size="small" label-width="130px" ref="form" :model="form" :rules="rules">
            <el-form-item label="就职类型" prop="type">
                <el-select v-model="form.type">
                    <el-option v-for="item in employeeTypes" :key="item.ID" :value="item.ID" :label="item.Title"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="姓名" prop="name">
                <el-input v-model="form.name" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="入职日期" prop="onboarddate">
                <el-date-picker
                    v-model="form.onboarddate"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item label="性别" prop="sex">
                <el-select v-model="form.sex">
                    <el-option v-for="(item, i) in sexs" :key="i" :value="item.value" :label="item.label"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="生日" prop="birthday">
                <el-date-picker
                    v-model="form.birthday"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item label="国籍" prop="nationality">
                <el-input v-model="form.nationality" :maxlength="10"></el-input>
            </el-form-item>
            <el-form-item label="最近车站" prop="station">
                <el-input v-model="form.station" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="模块" prop="module">
                <el-input v-model="form.module" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="SAP经验开始日" prop="startworkdate">
                <el-date-picker
                    v-model="form.startworkdate"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item label="岗位" prop="position">
                <el-select v-model="form.position">
                    <el-option v-for="item in positions" :key="item.ID" :label="item.Title" :value="item.ID"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="来日时间" prop="arrivejpdate">
                <el-date-picker
                    v-model="form.arrivejpdate"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item label="所属部门" prop="team">
                <el-select v-model="form.team">
                    <el-option v-for="item in teams" :key="item.TeamID" :label="item.TeamName" :value="item.TeamID"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="日语能力">
                <el-row>
                    <el-col :span="11">
                        <el-select v-model="form.jplangcert">
                            <el-option :label="'1级'" :value="1"></el-option>
                            <el-option :label="'2级'" :value="2"></el-option>
                            <el-option :label="'3级'" :value="3"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="11" :offset="2">
                        <el-input v-model="form.jplangcomt"></el-input>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="英语能力">
                <el-input v-model="form.enlangcomt"></el-input>
            </el-form-item>
            <el-form-item label="SAP资格认证">
                <el-checkbox-group v-model="form.Certs">
                    <el-checkbox v-for="item in certificates" :key="item.CertID" :label="item.CertID">{{item.CertName}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="绩效工资" :class="[emptyTip && 'error-input']">
                <el-input v-model="form.PJSalary" @input="formatPrice('PJSalary')"></el-input>
                <p color="danger" v-if="emptyTip">请填写绩效工资或基本工资</p>
            </el-form-item>
            <el-form-item label="基本工资" :class="[emptyTip && 'error-input']">
                <el-input v-model="form.BaseSalary" @input="formatPrice('BaseSalary')"></el-input>
                <p color="danger" v-if="emptyTip">请填写基本工资或绩效工资</p>
            </el-form-item>
            <el-form-item label="工资的备注">
                <el-input v-model="form.SComment" :maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="销售价格" :class="[errorTip && 'error-input']">
                <el-row>
                    <el-col :span="11">
                        <el-input @input="formatPrice('salepricefrom')" @blur="validSalePrice('salepricefrom')" v-model="form.salepricefrom"></el-input>
                    </el-col>
                    <el-col :span="11" :offset="2">
                        <el-input @input="formatPrice('salepriceto')" @blur="validSalePrice('salepriceto')" v-model="form.salepriceto"></el-input>
                    </el-col>
                </el-row>
                <p color="danger" v-if="errorTip">起始价格不得大于最终价格</p>
            </el-form-item>
            <el-form-item label="出差条件">
                <el-input v-model="form.travel" :maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="希望项目">
                <el-input v-model="form.expectpj" :maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="form.comment" type="textarea" :rows="3" :maxlength="200"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" @click="beforeSubmit">保存</el-button>
                <el-button size="small" @click="resetForm">重置</el-button>
            </el-form-item>
        </el-form>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import { CHANGE_TAB_TITLE } from '@vuex/actions';

export default {
    components: {
        MainWrapper
    },
    data() {
        return {
            form: {
                type: '',
                name: '',
                onboarddate: '',
                sex: true,
                birthday: '',
                nationality: '',
                station: '',
                module: '',
                startworkdate: '',
                position: '',
                arrivejpdate: '',
                team: '',
                jplangcert: '',
                jplangcomt: '',
                enlangcomt: '',
                Certs: [],
                PJSalary: '',
                BaseSalary: '',
                SComment: '',
                salepricefrom: '',
                salepriceto: '',
                travel: '',
                expectpj: '',
                comment: ''
            },
            rules: {
                type: [{
                    required: true, message: '请选择就职类型', trigger: 'blur'
                }],
                name: [{
                    required: true, message: '请输入姓名', trigger: 'blur'
                }],
                onboarddate: [{
                    required: true, message: '请选择入职时间', trigger: 'blur'
                }],
                sex: [{
                    required: true, message: '请选择性别', trigger: 'blur'
                }],
                birthday: [{
                    required: true, message: '请选择生日', trigger: 'blur'
                }],
                nationality: [{
                    required: true, message: '请输入国籍', trigger: 'blur'
                }],
                station: [{
                    required: true, message: '请输入最近车站', trigger: 'blur'
                }],
                module: [{
                    required: true, message: '请输入模块', trigger: 'blur'
                }],
                startworkdate: [{
                    required: true, message: '请选择SAP经验开始日', trigger: 'blur'
                }],
                position: [{
                    required: true, message: '请选择岗位', trigger: 'blur'
                }],
                arrivejpdate: [{
                    required: true, message: '请选择来日时间', trigger: 'blur'
                }],
                team: [{
                    required: true, message: '请选择所属部门', trigger: 'blur'
                }]
            },
            emptyTip: false,
            errorTip: false,
            employeeTypes: [],
            sexs: [{
                label: '男', value: true
            }, {
                label: '女', value: false
            }],
            teams: [],
            positions: [],
            certificates: []
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.$store.dispatch({
                type: CHANGE_TAB_TITLE,
                title: '员工入职'
            });
            vm.getTeams();
            vm.getEmployeeTypes();
            vm.getPositions();
            vm.getCertificates();
        });
    },
    methods: {
        // 部门
        getTeams() {
            this.$axios({
                url: '/api/teamsforselect'
            }).then(res => {
                this.teams = res || [];
            });
        },
        // 就职类型
        getEmployeeTypes() {
            this.$axios({
                url: '/api/employeetypesforselect'
            }).then(res => {
                this.employeeTypes = res || [];
            });
        },
        // 岗位
        getPositions() {
            this.$axios({
                url: '/api/positionsforselect'
            }).then(res => {
                this.positions = res || [];
            });
        },
        // SAP认证资格
        getCertificates() {
            this.$axios({
                url: '/api/certificatesforselect'
            }).then(res => {
                this.certificates = res || [];
            });
        },
        validSalePrice() {
            this.errorTip = false;
            if (this.form.salepricefrom && this.form.salepriceto) {
                let priceFrom = this.form.salepricefrom.replace(/,/g, '');
                let priceTo = this.form.salepriceto.replace(/,/g, '');
                if (Number(priceFrom) > Number(priceTo)) {
                    this.errorTip = true;
                } else {
                    this.errorTip = false;
                }
            } else {
                this.errorTip = false;
            }
        },
        formatPrice(key) {
            let value = this.form[key];
            if (!value) return false;
            if (key === 'PJSalary' || key === 'BaseSalary') {
                this.emptyTip = false;
            }
            value = value.replace(/,/g, '');
            if (value.indexOf('.') > -1) {
                this.form[key] = parseInt(value).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
            } else {
                this.form[key] = value.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
            }
        },
        resetForm() {
            this.$refs.from.resetFields();
        },
        beforeSubmit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    if (this.errorTip) return false;
                    if (!this.form.PJSalary && !this.form.BaseSalary) {
                        this.emptyTip = true;
                        return false;
                    }
                    let params = {
                        'type.ID': this.form.type,
                        name: this.form.name,
                        onboarddate: this.form.onboarddate,
                        sex: this.form.sex,
                        birthday: this.form.birthday,
                        nationality: this.form.nationality,
                        station: this.form.station,
                        module: this.form.module,
                        startworkdate: this.form.startworkdate,
                        'position.ID': this.form.position,
                        arrivejpdate: this.form.arrivejpdate,
                        teammembers: [{
                            FromDate: this.form.onboarddate,
                            ToDate: '9999-12-31',
                            TeamID: this.form.team
                        }],
                        jplangcert: this.form.jplangcert || 0,
                        jplangcomt: this.form.jplangcomt,
                        enlangcomt: this.form.enlangcomt,
                        salaries: [{
                            FromDate: this.form.onboarddate,
                            PJSalary: Number(this.form.PJSalary.toString().replace(/,/g, '')),
                            BaseSalary: Number(this.form.BaseSalary.toString().replace(/,/g, '')),
                            Comment: this.form.SComment,
                        }],
                        salepricefrom: Number(this.form.salepricefrom.toString().replace(/,/g, '')),
                        salepriceto: Number(this.form.salepriceto.toString().replace(/,/g, '')),
                        travel: this.form.travel,
                        expectpj: this.form.expectpj,
                        comment: this.form.comment
                    };
                    params.certificates = this.form.Certs.map(item => {
                        return {
                            CertID: item,
                            Date: '2020-01-01'
                        };
                    });
                    const formData = new FormData();
                    for (let key in params) {
                        if (typeof params[key] === 'object') {
                            params[key].forEach((item, i) => {
                                for (let k in item) {
                                    formData.append(`${key}[${i}].${k}`, item[k]);
                                }
                            });
                        } else {
                            formData.append(key, params[key]);
                        }
                    }
                    this.submit(formData);
                }
            });
        },
        submit(formData) {
            const loading = this.$loading({ lock: true, text: '正在提交入职资料中...' });
            this.$axios({
                method: 'POST',
                url: '/api/employeeonboard',
                params: formData,
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res.code === 0) {
                    this.$message({
                        type: 'success',
                        showClose: true,
                        message: '保存成功'
                    });
                } else {
                    this.$message({
                        type: 'error',
                        showClose: true,
                        message: res.message ? res.message : '接口开小差了，没有返回信息'
                    });
                }
            });
        }
    }
};
</script>

<style lang="less">
.employee-edit {
    .el-form {
        width: 500px;
        .el-date-editor, .el-select {
            width: 100%;
        }
        [color~=danger] {
            position: absolute;
            top: 100%;
            left: 0;
            font-size: 12px;
            height: 12px;
            line-height: 16px;
        }
        .error-input {
            input {
                border-color: #DB414E;
            }
        }
    }
}
</style>
