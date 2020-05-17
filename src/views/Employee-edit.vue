<template>
    <main-wrapper class="employee-edit">
        <el-form size="small" label-width="130px" ref="form" :model="form" :rules="rules">
            <el-form-item label="就职类型" prop="employeeTypeID">
                <el-select v-model="form.employeeTypeID">
                    <el-option v-for="item in employeeTypes" :key="item.id" :value="item.id" :label="item.title"></el-option>
                </el-select>
            </el-form-item>
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
            <el-form-item label="入职日期" prop="onBoardDate">
                <el-date-picker
                    v-model="form.onBoardDate"
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
            <el-form-item label="模块" prop="mainSkill">
                <el-input v-model="form.mainSkill" :maxlength="20"></el-input>
            </el-form-item>
            <el-form-item label="SAP经验开始日" prop="startWorkDate">
                <el-date-picker
                    v-model="form.startWorkDate"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item label="岗位" prop="positionID">
                <el-select v-model="form.positionID">
                    <el-option v-for="item in positions" :key="item.id" :label="item.title" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="来日时间" prop="arriveJPDate">
                <el-date-picker
                    v-model="form.arriveJPDate"
                    type="date"
                    format="yyyy-MM-dd"
                    value-format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item label="所属部门" prop="teamMembers" v-if="!isEdit">
                <el-select v-model="form.teamMembers">
                    <el-option v-for="item in teams" :key="item.id" :label="item.teamName" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="日语能力">
                <el-row>
                    <el-col :span="11">
                        <el-select v-model="form.jpLangCert">
                            <el-option :label="'1级'" :value="1"></el-option>
                            <el-option :label="'2级'" :value="2"></el-option>
                            <el-option :label="'3级'" :value="3"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="11" :offset="2">
                        <el-input v-model="form.jpLangComt"></el-input>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="英语能力">
                <el-input v-model="form.enLangComt"></el-input>
            </el-form-item>
            <el-form-item label="SAP资格认证">
                <el-checkbox-group v-model="form.certificates">
                    <el-checkbox v-for="item in certificates" :key="item.id" :label="item.id">{{item.certName}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="绩效工资" :class="[emptyTip && 'error-input']" v-if="!isEdit">
                <el-input v-model="form.PJSalary" @input="formatPrice('PJSalary')"></el-input>
                <p color="danger" v-if="emptyTip">请填写绩效工资或基本工资</p>
            </el-form-item>
            <el-form-item label="基本工资" :class="[emptyTip && 'error-input']" v-if="!isEdit">
                <el-input v-model="form.BaseSalary" @input="formatPrice('BaseSalary')"></el-input>
                <p color="danger" v-if="emptyTip">请填写基本工资或绩效工资</p>
            </el-form-item>
            <el-form-item label="工资的备注" v-if="!isEdit">
                <el-input v-model="form.SComment" :maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="销售价格" :class="[errorTip && 'error-input']">
                <el-row>
                    <el-col :span="11">
                        <el-input @input="formatPrice('salePriceFrom')" @blur="validSalePrice('salePriceFrom')" v-model="form.salePriceFrom"></el-input>
                    </el-col>
                    <el-col :span="11" :offset="2">
                        <el-input @input="formatPrice('salePriceTo')" @blur="validSalePrice('salePriceTo')" v-model="form.salePriceTo"></el-input>
                    </el-col>
                </el-row>
                <p color="danger" v-if="errorTip">起始价格不得大于最终价格</p>
            </el-form-item>
            <el-form-item label="出差条件">
                <el-input v-model="form.travel" :maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="希望项目">
                <el-input v-model="form.expectPJ" :maxlength="50"></el-input>
            </el-form-item>
            <el-form-item label="备注">
                <el-input v-model="form.comment" type="textarea" :rows="3" :maxlength="200"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" @click="beforeSubmit">保存</el-button>
                <el-button size="small" @click="resetForm">重置</el-button>
                <el-button size="small" @click="$router.back()">返回</el-button>
            </el-form-item>
        </el-form>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import moment from 'moment';
import { mapGetters } from 'vuex';

export default {
    components: {
        MainWrapper
    },
    data() {
        return {
            form: {
                employeeTypeID: '',
                name: '',
                furigana: '',
                onBoardDate: '',
                sex: true,
                birthday: '',
                nationality: '',
                station: '',
                mainSkill: '',
                startworkdate: '',
                position: '',
                arrivejpdate: '',
                teamMembers: '',
                jpLangCert: '',
                jpLangComt: '',
                enLangComt: '',
                certificates: [],
                PJSalary: '',
                BaseSalary: '',
                SComment: '',
                salepricefrom: '',
                salePriceTo: '',
                travel: '',
                expectPJ: '',
                comment: ''
            },
            rules: {
                employeeTypeID: [{
                    required: true, message: '请选择就职类型', trigger: 'blur'
                }],
                firstName: [{
                    required: true, message: '请输入姓', trigger: 'blur'
                }],
                lastName: [{
                    required: true, message: '请输入名', trigger: 'blur'
                }],
                onBoardDate: [{
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
                mainSkill: [{
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
                teamMembers: [{
                    required: true, message: '请选择所属部门', trigger: 'blur'
                }]
            },
            isEdit: false,
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
            if (Number(to.params.id)) {
                vm.getData();
            }
            vm.getTeams();
            vm.getEmployeeTypes();
            vm.getPositions();
            vm.getCertificates();
        });
    },
    computed: {
        ...mapGetters([ 'IS_H5' ])
    },
    methods: {
        getData() {
            const loading = this.$loading({ lock: true, text: '正在获取数据中' });
            this.$axios({
                url: '/api/Employee/api_getemployeeinfo',
                params: {
                    id: this.$route.params.id
                },
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                this.isEdit = true;
                if (res && res.code === 0) {
                    this.formatResultData(res.data || {});
                } else {
                    this.$message({
                        type: 'error',
                        message: (res && res.message) || '接口开小差了，没有返回信息'
                    });
                }
            });
        },
        formatResultData(data) {
            const formatTime = time => moment(time).format('YYYY-MM-DD');
            const form = { ...data };
            form.onBoardDate = data.onBoardDate && formatTime(data.onBoardDate);
            form.birthday = data.birthday && formatTime(data.birthday);
            form.startWorkDate = data.startWorkDate && formatTime(data.startWorkDate);
            form.arriveJPDate = data.arriveJPDate && formatTime(data.arriveJPDate);
            form.certificates = data.certificates && data.certificates.map(item => item.certificateID);
            console.log(form);
            this.form = { ...form };
        },
        // 部门
        getTeams() {
            this.$axios({
                url: '/api/Team/api_teamsforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.teams = res.data || [];
                }
            });
        },
        // 就职类型
        getEmployeeTypes() {
            this.$axios({
                url: '/api/Employee/api_employeetypesforselect'
            }).then(res => {
                if (res.data) {
                    this.employeeTypes = res.data || [];
                }
            });
        },
        // 岗位
        getPositions() {
            this.$axios({
                url: '/api/Position/api_positionsforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.positions = res.data || [];
                }
            });
        },
        // SAP认证资格
        getCertificates() {
            this.$axios({
                url: '/api/Certificate/api_certificatesforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.certificates = res.data || [];
                }
            });
        },
        validSalePrice() {
            this.errorTip = false;
            if (this.form.salePriceFrom && this.form.salePriceTo) {
                let priceFrom = this.form.salePriceFrom.replace(/,/g, '');
                let priceTo = this.form.salePriceTo.replace(/,/g, '');
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
                    if (!this.isEdit && !this.form.PJSalary && !this.form.BaseSalary) {
                        this.emptyTip = true;
                        return false;
                    }
                    let params = {};
                    let type = 'Employee/api_employeeonboard';
                    if (this.isEdit) {
                        params = this.getSubmitParams('edit');
                        type = 'Employee/api_updateemployee';
                    } else {
                        params = this.getSubmitParams();
                    }
                    const formData = new FormData();
                    for (let key in params) {
                        if (params[key] && typeof params[key] === 'object') {
                            params[key].forEach((item, i) => {
                                for (let k in item) {
                                    formData.append(`${key}[${i}].${k}`, item[k]);
                                }
                            });
                        } else {
                            formData.append(key, params[key]);
                        }
                    }
                    this.submit(formData, type);
                } else {
                    this.$message({
                        type: 'warning',
                        message: '有必填内容未填写'
                    });
                }
            });
        },
        getSubmitParams(type) {
            let params = {
                'Certificates': this.form.certificates.map(item => ({
                    certificateID: item,
                    passDate: '2020-01-01'
                })),
                'TeamMembers': '',
                'CandidateID': this.form.candidateID || 0,
                'EmployeeTypeID': this.form.employeeTypeID,
                'OnBoardDate': this.form.onBoardDate,
                'Furigana_FirstName': this.form.furigana_FirstName || '',
                'Furigana_LastName':  this.form.furigana_LastName || '',
                'FirstName': this.form.firstName || '',
                'LastName': this.form.lastName || '',
                'Sex': this.form.sex,
                'Birthday': this.form.birthday,
                'Nationality': this.form.nationality,
                'LiveCity': this.form.liveCity || '',
                'Station': this.form.station,
                'MainSkill': this.form.mainSkill,
                'StartWorkDate': this.form.startWorkDate,
                'PositionID': this.form.positionID,
                'ArriveJPDate': this.form.arriveJPDate,
                'JPLangCert': this.form.jpLangCert || '',
                'JPLangComt': this.form.jpLangComt || '',
                'ENLangComt': this.form.enLangComt || '',
                'SalePriceFrom': Number(this.form.salePriceFrom.toString().replace(/,/g, '')) || 0,
                'SalePriceTo': Number(this.form.salePriceTo.toString().replace(/,/g, '')) || 0,
                'Travel': this.form.travel || '',
                'ExpectPJ': this.form.expectPJ || '',
                'Comment': this.form.comment || ''
            };
            if (this.form.teamMembers instanceof Array) {
                params.TeamMembers = this.form.teamMembers.map(item => ({teamID: item.id}));
            } else {
                params.TeamMembers = [{teamID: this.form.teamMembers}];
            }
            if (type === 'edit') {
                params.ID = this.$route.params.id;
            } else {
                params['Salary.PJSalary'] = Number(this.form.PJSalary.toString().replace(/,/g, ''));
                params['Salary.BaseSalary'] = Number(this.form.BaseSalary.toString().replace(/,/g, ''));
                params['Salary.Comment'] = this.form.SComment;
            }
            return params;
        },
        submit(formData, api) {
            const loading = this.$loading({ lock: true, text: '正在提交入职资料中...' });
            this.$axios({
                method: 'POST',
                url: `/api/${api}`,
                params: formData,
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.$message({
                        type: 'success',
                        showClose: true,
                        message: '保存成功'
                    });
                    // this.$router.back();
                    this.$router.push({ name: 'EmployeeList' });
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
