<template>
    <main-wrapper class="salary-detail">
        <div class="main-header" slot="header">
            <el-date-picker
                v-model="period"
                type="month"
                size="small"
                value-format="yyyyMM"
                format="yyyyMM"
                :clearable="false"
                @change="getData"></el-date-picker>
        </div>
        <el-form size="small" label-width="90px" label-suffix=":">
            <el-form-item label="部門-所属">
                <p>{{form.Team}}</p>
            </el-form-item>
            <el-form-item label="社員">
                <p>{{form.EmpeeNo}}</p>
            </el-form-item>
            <el-form-item label="氏名">
                <p>{{form.Name}}</p>
            </el-form-item>
            <el-form-item label="支給">
                <el-row class="th-row">
                    <el-col :span="4">基本給</el-col>
                    <el-col :span="4">待機代</el-col>
                    <el-col :span="4">時間外手当</el-col>
                    <el-col :span="4">通勤手当</el-col>
                    <el-col :span="4">総支給額</el-col>
                </el-row>
                <el-row class="td-row">
                    <el-col :span="4">{{formatPrice(form.ProjectSalary)}}</el-col>
                    <el-col :span="4">{{formatPrice(form.BaseSalary)}}</el-col>
                    <el-col :span="4">{{formatPrice(form.OverTimeSalary)}}</el-col>
                    <el-col :span="4">{{formatPrice(form.TravelFare)}}</el-col>
                    <el-col :span="4">{{formatPrice(allowance)}}</el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="控除">
                <el-row class="th-row">
                    <el-col :span="6">雇用保険</el-col>
                    <el-col :span="6">社会保険計</el-col>
                    <el-col :span="6">所得税</el-col>
                    <el-col :span="6">控除計</el-col>
                </el-row>
                <el-row class="td-row">
                    <el-col :span="6">{{formatPrice(form.HireInsurance)}}</el-col>
                    <el-col :span="6">{{formatPrice(form.HireInsurance)}}</el-col>
                    <el-col :span="6">{{formatPrice(form.IncomeTax)}}</el-col>
                    <el-col :span="6">{{formatPrice(meter)}}</el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="現金">
                <p>{{formatPrice(allowance - meter)}}</p>
            </el-form-item>
            <el-form-item label="出勤日数">
                <p>{{form.WorkDays}}天</p>
            </el-form-item>
        </el-form>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import moment from 'moment';
export default {
    components: {
        MainWrapper
    },
    data() {
        return {
            period: '',
            form: {
                Team: '',
                EmpeeNo: '',
                Name: '',
                ProjectSalary: 0,
                BaseSalary: 0,
                OverTimeSalary: 0,
                TravelFare: 0,
                HireInsurance: 0,
                IncomeTax: 0,
                WorkDays: 0
            }
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            const time = new Date();
            vm.period = moment(time.getTime()).format('YYYYMM');
            console.log(vm.period);
            vm.getData();
        });
    },
    computed: {
        allowance() {
            const {
                ProjectSalary = 0,
                BaseSalary = 0,
                OverTimeSalary = 0,
                TravelFare = 0
            } = this.form;
            return Number(ProjectSalary) + Number(BaseSalary) + Number(OverTimeSalary) + Number(TravelFare);
        },
        meter() {
            const {
                HireInsurance = 0,
                IncomeTax = 0
            } = this.form;
            return Number(HireInsurance) * 2 + Number(IncomeTax);
        }
    },
    methods: {
        getData() {
            const loading = this.$loading({ lock: true, text: '正在获取数据...' });
            this.$axios({
                url: '/api/getsalaryinfo',
                params: {
                    period: this.period
                },
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.form = res.data || {};
                } else {
                    this.$message({
                        type: 'error',
                        message: res ? res.message : '接口开小差了，没有返回信息'
                    });
                }
            });
        },
        formatPrice(value) {
            return Number(value).toLocaleString();
        }
    }
};
</script>

<style scoped lang="less">
.salary-detail {
    .th-row {
        .el-col {
            border: 1px solid #E4E7ED;
            padding-left: 5px;
            border-bottom: 0;
            &:not(:last-child) {
                border-right: 0;
            }
        }
    }
    .td-row {
        .el-col {
            padding-left: 5px;
            border: 1px solid #E4E7ED;
            &:not(:last-child) {
                border-right: 0;
            }
            // &:last-child {
            //     border-top-color: transparent;
            // }
        }
    }
}
</style>
