<template>
    <main-wrapper class="employee-list">
        <el-form class="main-header header-form" slot="header" size="mini" inline>
            <el-form-item>
                <el-select v-model="form.teamid" placeholder="部门" @change="getData" clearable>
                    <el-option v-for="item in teams" :key="item.TeamID" :label="item.TeamName" :value="item.TeamID"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="form.employeetype" placeholder="就职类型" @change="getData" clearable>
                    <el-option v-for="item in employeeTypes" :key="item.ID" :label="item.Title" :value="item.ID"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="form.positions" placeholder="岗位" multiple collapse-tags @visible-change="visibleChange" clearable>
                    <el-option v-for="item in positions" :key="item.ID" :label="item.Title" :value="item.ID"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input v-model="form.module" placeholder="模块" :maxlength="50" @blur="getData" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="form.name" placeholder="姓名" :maxlength="30" @blur="getData" clearable></el-input>
            </el-form-item>
            <el-button type="primary" icon="el-icon-download" size="mini">下载</el-button>
        </el-form>
        <div class="table-wrapper">
            <el-table size="small" :data="tableData">
                <el-table-column label="所属部门" prop="Team" width="80px"></el-table-column>
                <el-table-column label="员工号" prop="EmpeeID" width="100px"></el-table-column>
                <el-table-column label="就职类型" prop="Type" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="姓名" prop="Name" show-overflow-tooltip></el-table-column>
                <el-table-column label="年龄" prop="Age" width="60px"></el-table-column>
                <el-table-column label="性别" prop="Sex" width="60px"></el-table-column>
                <el-table-column label="国籍" prop="Nationality" width="80px"></el-table-column>
                <el-table-column label="最近车站" prop="Station" show-overflow-tooltip></el-table-column>
                <el-table-column label="模块" prop="Module" show-overflow-tooltip></el-table-column>
                <el-table-column label="认证资格" prop="Certificates"></el-table-column>
                <el-table-column label="经验年数" prop="ExpYears" width="100px"></el-table-column>
                <el-table-column label="岗位" prop="Position" show-overflow-tooltip></el-table-column>
                <el-table-column label="来日年数" prop="JPYears" width="100px"></el-table-column>
                <el-table-column label="日语能力" prop="JPLang" min-width="140px" show-overflow-tooltip></el-table-column>
                <el-table-column label="英语能力" prop="ENLang" min-width="140px" show-overflow-tooltip></el-table-column>
                <el-table-column label="状态" prop="Status" min-width="140px" show-overflow-tooltip></el-table-column>
                <el-table-column label="所在项目" prop="PJName" show-overflow-tooltip></el-table-column>
                <el-table-column label="项目结束日期" prop="ContractEndDate" width="140px"></el-table-column>
                <el-table-column label="提案价格" prop="SalesPrice" min-width="140px" show-overflow-tooltip></el-table-column>
                <el-table-column label="出差条件" prop="Travel" min-width="140px" show-overflow-tooltip></el-table-column>
                <el-table-column label="期望项目" prop="ExpectPJ" min-width="140px" show-overflow-tooltip></el-table-column>
                <el-table-column label="备注" prop="Comment" show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" :width="`${operWidth}px`">
                    <template slot-scope="scope">
                        <el-button
                            v-for="(item, i) in (scope.row.Actions || [])"
                            size="mini"
                            :key="i"
                            @click="clickHandle(scope, item)">{{item.text}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-pagination
            :page-size="ps"
            :current-page="pn"
            :page-sizes="pageSizes"
            @size-change="changePs"
            @current-change="changePn"
            :layout="IS_H5 ? 'prev, pager, next' : 'total, sizes, prev, pager, next, jumper'"
            :total="total"></el-pagination>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import { CHANGE_TAB_TITLE } from '@vuex/actions';
import { mapGetters } from 'vuex';

export default {
    components: {
        MainWrapper
    },
    data() {
        return {
            form: {
                teamid: '',
                employeetype: '',
                module: '',
                positions: [],
                name: ''
            },
            teams: [],
            employeeTypes: [],
            positions: [],
            total: 0,
            ps: 10,
            pn: 1,
            pageSizes: [10, 20, 30, 50],
            tableData: [],
            operWidth: 140
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.$store.dispatch({
                type: CHANGE_TAB_TITLE,
                title: '员工清单'
            });
            vm.getTeams();
            vm.getEmployeeTypes();
            vm.getPositions();
            vm.getData();
        });
    },
    computed: {
        ...mapGetters(['IS_H5'])
    },
    methods: {
        getData() {
            const loading = this.$loading({ lock: true, text: '正在获取员工清单...' });
            let positions = [];
            this.form.positions.forEach((item, i) => {
                positions.push(`positions[${i}]=${item}`);
            });
            positions = positions.join('&');
            this.$axios({
                url: `/api/getemployeelist?${positions}`,
                params: {
                    teamid: this.form.teamid || 0,
                    employeetype: this.form.employeetype || 0,
                    module: this.form.module,
                    name: this.form.name,
                    page: this.pn,
                    pagesize: this.ps
                }
            }).then(res => {
                loading.close();
                if (res.code === 0) {
                    let actionLen = 0;
                    (res.data || []).forEach(item => {
                        if (item.Actions) {
                            if (item.Actions.length > actionLen) {
                                actionLen = item.Actions.length;
                            }
                        }
                    });
                    this.operWidth = actionLen * 80;
                    this.tableData = res.data || [];
                    this.total = res.total;
                } else {
                    this.$message({
                        type: 'error',
                        showClose: true,
                        message: res.message ? res.message : '接口开小差了，没有返回信息'
                    });
                }
            });
        },
        getTeams() {
            this.$axios({
                url: '/api/teamsforselect'
            }).then(res => {
                this.teams = res || [];
            });
        },
        getEmployeeTypes() {
            this.$axios({
                url: '/api/employeetypesforselect'
            }).then(res => {
                this.employeeTypes = res || [];
            });
        },
        getPositions() {
            this.$axios({
                url: '/api/positionsforselect'
            }).then(res => {
                this.positions = res || [];
            });
        },
        changePn(pn) {
            this.pn = pn;
            this.getData();
        },
        changePs(ps) {
            this.ps = ps;
            this.getData();
        },
        visibleChange(value) {
            if (!value) {
                this.getData();
            }
        },
        clickHandle() {
            this.$message({
                type: 'warning',
                message: '暂未开放功能'
            });
            // if (data.action === 'act_editempee') {
            //     this.$router.push({ name: 'EmployeeEdit', params: { id: scope.row.ID } });
            // } else {
            //     this.$message({
            //         type: 'warning',
            //         message: '暂未开放功能'
            //     });
            // }
        }
    }
};
</script>

<style lang="less">
.employee-list {
    .table-wrapper {
        padding: 0 20px;
    }
    .el-pagination {
        margin-top: 20px;
        text-align: center;
    }
}
</style>
