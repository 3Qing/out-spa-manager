<template>
    <main-wrapper class="balance-sheet contract-list">
        <div slot="header" class="main-header">
            <el-radio-group v-model="avaiable" @change="changeData" class="flops">
                <el-radio :label="true">貸借対照表</el-radio>
                <el-radio :label="false">損益表</el-radio>
            </el-radio-group>
            <el-date-picker
                v-model="form.period"
                type="month"
                size="mini"
                placeholder="开始时间"
                value-format="yyyyMM"
                format="yyyyMM"
                clearable
                @change="changeStartTime">
            </el-date-picker>
            <!-- <span class="flops">~</span> -->
            <!-- <el-date-picker
                v-model="form.toperiod"
                type="month"
                size="mini"
                placeholder="结束时间"
                value-format="yyyyMM"
                format="yyyyMM"
                clearable
                @change="changeEndTime">
            </el-date-picker> -->
            <el-select placeholder="チーム" clearable size="mini" v-model="form.teamid" @change="getData">
                <el-option v-for="item in teams" :key="item.id" :value="item.id" :label="item.teamName"></el-option>
            </el-select>
        </div>
        <div class="content">
            <span>{{company}}</span>
            <span>累计期间：{{form.period}}</span>
        </div>
        <el-table :data="tableData" size="mini" border :row-class-name="rowClassName">
            <el-table-column label="勘定科目" prop="item" show-overflow-tooltip></el-table-column>
            <el-table-column label="勘定コード" prop="account"></el-table-column>
            <el-table-column :label="avaiable?'前期残高':'前期発生額'">
                <template slot-scope="scope">
                    <span>
                        {{priceToString(scope.row.carryforward) || 0}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="借方">
                <template slot-scope="scope">
                    <span>
                        {{priceToString(scope.row.drAmount) || 0}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="貸方" >
                <template slot-scope="scope">
                    <span>
                        {{priceToString(scope.row.crAmount) || 0}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="残高">
                <template slot-scope="scope">
                    <span>
                        {{priceToString(scope.row.balance) || 0}}
                    </span>
                </template>
            </el-table-column>
        </el-table>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import moment from 'moment';
import { priceToString } from '@_public/utils';
export default {
    components: {
        MainWrapper
    },
    data() {
        return {
            company: '',
            teams: [],
            avaiable: true,
            form: {
                period: '',
                teamid: ''
            },
            tableData: []
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.form.period = moment(new Date()).format('YYYYMM');
            // vm.form.toperiod = moment(new Date()).format('YYYYMM');
            vm.company = JSON.parse(sessionStorage.getItem('appInfo')).companyName;
            vm.getTeams();
        });
    },
    methods: {
        priceToString: priceToString,
        changeData() {
            this.getData();
        },
        getTeams() {
            this.$axios({
                url: '/api/Team/api_teamsforselect'
            }).then(res => {
                const data = res.data || [];
                this.teams = data;
                // console.log(this.teams);
                if (data.length === 1) {
                    this.form.teamid = data[0].id;
                }
                this.getData();
            });
        },
        rowClassName({ row }) {
            if (row.summaryLevel === 1) {
                return 'color1';
            } else if (row.summaryLevel === 2) {
                return 'color2';
            } else if (row.summaryLevel === 3) {
                return 'color3';
            }
        },
        getData() {
            const loading = this.$loading({ lock: true, text: '正在获取数据中' });
            let url = '';
            if (this.avaiable) {
                url = '/api/ACBalance/api_balancesheet';
            } else {
                url = '/api/ACBalance/api_plsheet';
            }
            this.$axios({
                url,
                params: this.form,
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.tableData = res.data || [];
                } else {
                    this.$message({
                        type: 'error',
                        message: res ? res.message : '接口开小差了，没有返回信息'
                    });
                }
            });
        },
        changeStartTime(val) {
            if (!val) {
                if (this.form.toperiod) {
                    this.$message({
                        type: 'warning',
                        message: '请先取消结束时间'
                    });
                } else {
                    this.page = 1;
                    this.getData();
                }
            } else {
                this.page = 1;
                this.getData();
            }
        },
        changeEndTime(val) {
            if (this.form.fromperiod) {
                const startTime = new Date(this.form.fromperiod).getTime();
                if (val) {
                    const endTime = new Date(val).getTime();
                    if (startTime > endTime) {
                        this.$message({
                            type: 'warning',
                            message: '开始时间不得小于结束时间'
                        });
                        this.form.toperiod = '';
                    } else {
                        this.page = 1;
                        this.getData();
                    }
                } else {
                    this.page = 1;
                    this.getData();
                }
            } else {
                if (this.form.fromperiod) {
                    this.$message({
                        type: 'warning',
                        message: '请先选择开始时间'
                    });
                }
            }
        },
    }
};
</script>

<style scoped lang="less">
.balance-sheet {
    .flops{
        margin-right: 20px;
    }
    .el-date-editor, .el-select {
        & + .el-date-editor {
            margin-left: 2%;
        }
        width: 15%;
        max-width: 140px;
    }
    .el-select {
        margin-left: 2%;
    }
    .content{
        padding: 0 2px;
        height: 30px;
        line-height: 20px;
        span:first-child{
            float: left;
        }
        span:last-child{
            float: right;
        }
    }
}
</style>
