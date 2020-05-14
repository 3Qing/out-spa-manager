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
        <div class="salary-wrapper">
            <p>株式会社ユアパートナー</p>
            <el-row>
                <el-col :span="6">{{form.Periperiodod || period}}給料明細書</el-col>
                <el-col :span="3" class="label">部門-所属</el-col>
                <el-col :span="3">{{form.teamName || '-'}}</el-col>
                <el-col :span="3" class="label">社員</el-col>
                <el-col :span="3">{{form.employeeNo || '-'}}</el-col>
                <el-col :span="3" class="label">氏名</el-col>
                <el-col :span="3">{{form.name || '-'}}</el-col>
            </el-row>
            <div class="row-wrapper multiple-row">
                <el-row>
                    <el-col :span="2" class="row-label label">支給</el-col>
                    <el-col :span="4" :offset="2" class="label">基本給</el-col>
                    <el-col :span="4" class="label">待機代</el-col>
                    <el-col :span="4" class="label">時間外手当</el-col>
                    <el-col :span="4" class="label">通勤手当</el-col>
                    <el-col :span="6" class="label">総支給額</el-col>
                </el-row>
                <el-row>
                    <el-col :span="4" :offset="2">{{formatPrice(form.projectSalary)}}</el-col>
                    <el-col :span="4">{{formatPrice(form.benchSalary)}}</el-col>
                    <el-col :span="4">{{formatPrice(form.overtimeSalary)}}</el-col>
                    <el-col :span="4">{{formatPrice(form.travelFare)}}</el-col>
                    <el-col :span="6">{{formatPrice(allowance)}}</el-col>
                </el-row>
            </div>
            <div class="row-wrapper multiple-row">
                <el-row>
                    <el-col :span="2" class="row-label label">控除</el-col>
                    <el-col :span="4" :offset="2" class="label">雇用保険</el-col>
                    <el-col :span="4" class="label">社会保険計</el-col>
                    <el-col :span="4" class="label">所得税</el-col>
                    <el-col :span="4" class="label"></el-col>
                    <el-col :span="6" class="label">控除計</el-col>
                </el-row>
                <el-row>
                    <el-col :span="4" :offset="2">{{formatPrice(form.hireInsurance)}}</el-col>
                    <el-col :span="4">{{formatPrice(form.hireInsurance)}}</el-col>
                    <el-col :span="4">{{formatPrice(form.incomeTax)}}</el-col>
                    <el-col :span="4"></el-col>
                    <el-col :span="6">{{formatPrice(meter)}}</el-col>
                </el-row>
            </div>
            <div class="row-wrapper total-row">
                <el-row>
                    <el-col :span="6" :offset="18" class="label">現金</el-col>
                </el-row>
                <el-row>
                    <el-col :span="6" :offset="18">{{formatPrice(allowance - meter)}}</el-col>
                </el-row>
            </div>
            <div class="row-wrapper">
                <el-row>
                    <el-col :span="2" class="label">出勤日数</el-col>
                    <el-col :span="2">{{form.workDays || 0}}天</el-col>
                </el-row>
            </div>
        </div>
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
                Period: '',
                Team: '',
                EmpeeNo: '',
                Name: '',
                projectSalary: 0,
                benchSalary: 0,
                overtimeSalary: 0,
                travelFare: 0,
                hireInsurance: 0,
                incomeTax: 0,
                workDays: 0
            }
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            const time = new Date();
            vm.period = moment(time.getTime()).format('YYYYMM');
            vm.getData();
        });
    },
    computed: {
        allowance() {
            const {
                projectSalary = 0,
                benchSalary = 0,
                overtimeSalary = 0,
                travelFare = 0
            } = this.form;
            return Number(projectSalary) + Number(benchSalary) + Number(overtimeSalary) + Number(travelFare);
        },
        meter() {
            const {
                hireInsurance = 0,
                incomeTax = 0
            } = this.form;
            return Number(hireInsurance) * 2 + Number(incomeTax);
        }
    },
    methods: {
        getData() {
            const loading = this.$loading({ lock: true, text: '正在获取数据...' });
            this.$axios({
                url: '/api/Salary/api_getsalaryinfobyemp',
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
            if (!value) return 0;
            return Number(value).toLocaleString();
        }
    }
};
</script>

<style scoped lang="less">
.salary-detail {
    .salary-wrapper {
        .row-wrapper {
            &:last-child {
                .el-row {
                    border-bottom: 1px solid rgb(108, 146, 190);
                    border-right: 1px solid rgb(108, 146, 190);
                }
            }
        }
        .el-row {
            border: 1px solid rgb(108, 146, 190);
            border-bottom: none;
            border-right: none;
        }
        .el-col {
            padding-left: 5px;
            height: 36px;
            line-height: 36px;
            border-right: 1px solid rgb(108, 146, 190);
        }
        .multiple-row {
            position: relative;
            .row-label {
                position: absolute;
                left: 0;
                top: 0;
                height: 72px;
                line-height: 72px;
                z-index: 1;
            }
        }
        .total-row {
            .el-row:last-child {
                border-top: none;
                .el-col {
                    border-top: 1px solid rgb(108, 146, 190);
                }
            }
            .el-col {
                border-left: 1px solid rgb(108, 146, 190);
                // position: relative;
                // left: -1px;
            }
        }
        .label {
            color: #1473B7;
            overflow: hidden;
            white-space: nowrap;
            background-color: rgb(236, 254, 253);
        }
    }
    // .th-row {
    //     .el-col {
    //         border: 1px solid #E4E7ED;
    //         padding-left: 5px;
    //         border-bottom: 0;
    //         &:not(:last-child) {
    //             border-right: 0;
    //         }
    //     }
    // }
    // .td-row {
    //     .el-col {
    //         padding-left: 5px;
    //         border: 1px solid #E4E7ED;
    //         &:not(:last-child) {
    //             border-right: 0;
    //         }
    //     }
    // }
}
</style>
