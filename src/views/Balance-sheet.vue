<template>
    <main-wrapper class="balance-sheet contract-list">
        <div slot="header" class="main-header">
            <el-date-picker
                v-model="form.fromperiod"
                type="month"
                size="mini"
                placeholder="开始时间"
                value-format="yyyyMM"
                format="yyyyMM"
                clearable
                @change="changeStartTime">
            </el-date-picker>
            <el-date-picker
                v-model="form.toperiod"
                type="month"
                size="mini"
                placeholder="结束时间"
                value-format="yyyyMM"
                format="yyyyMM"
                clearable
                @change="changeEndTime">
            </el-date-picker>
            <el-select placeholder="チーム" size="mini" v-model="form.teamid" @change="getData">
                <el-option v-for="item in teams" :key="item.TeamID" :label="item.TeamName" :value="item.TeamID"></el-option>
            </el-select>
        </div>
        <el-table :data="tableData" size="mini">
            <el-table-column label="勘定科目" prop="Item" show-overflow-tooltip></el-table-column>
            <el-table-column label="勘定コード" prop="Account"></el-table-column>
            <el-table-column label="前期残高" prop="Carryforward"></el-table-column>
            <el-table-column label="借方" prop="DRAmount"></el-table-column>
            <el-table-column label="貸方" prop="CRAmount"></el-table-column>
            <el-table-column label="残高" prop="Balance"></el-table-column>
        </el-table>
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
            teams: [],
            form: {
                fromperiod: '',
                toperiod: '',
                teamid: ''
            },
            tableData: []
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.form.fromperiod = moment(new Date()).format('YYYYMM');
            vm.getTeams();
        });
    },
    methods: {
        getTeams() {
            this.$axios({
                url: '/api/teamsforselect'
            }).then(res => {
                const data = res || [];
                this.teams = data;
                if (data.length === 1) {
                    this.form.teamid = data[0].TeamID;
                }
                this.getData();
            });
        },
        getData() {
            const loading = this.$loading({ lock: true, text: '正在获取数据中' });
            this.$axios({
                url: '/api/balancesheet',
                params: this.form,
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                console.log(res);
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
}
</style>
