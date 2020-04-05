<template>
    <main-wrapper class="employee-list">
        <el-form class="main-header header-form" slot="header" size="mini" inline>
            <el-form-item>
                <el-select v-model="form.teamid" placeholder="部門" @change="changeHandle" clearable>
                    <el-option v-for="item in TEAMS" :key="item.TeamID" :label="item.TeamName" :value="item.TeamID"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="form.employeetype" placeholder="就職タイプ" @change="changeHandle" clearable>
                    <el-option v-for="item in employeeTypes" :key="item.ID" :label="item.Title" :value="item.ID"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="form.positions" placeholder="ポジション" multiple collapse-tags @visible-change="visibleChange" clearable>
                    <el-option v-for="item in positions" :key="item.ID" :label="item.Title" :value="item.ID"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input v-model="form.module" placeholder="モジュール" :maxlength="50" @blur="changeHandle" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="form.name" placeholder="氏名" :maxlength="30" @blur="changeHandle" clearable></el-input>
            </el-form-item>
            <!-- <el-button type="primary" icon="el-icon-download" size="mini">下载</el-button> -->
        </el-form>
        <div class="table-wrapper">
            <el-table size="small" :data="tableData">
                <el-table-column label="所属部門" prop="Team" width="80px"></el-table-column>
                <el-table-column label="社員番号" prop="EmpeeID" width="100px"></el-table-column>
                <el-table-column label="就職タイプ" prop="Type" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="氏名" prop="Name" show-overflow-tooltip></el-table-column>
                <el-table-column label="年齢" prop="Age" width="60px"></el-table-column>
                <el-table-column label="性別" prop="Sex" width="60px"></el-table-column>
                <el-table-column label="国籍" prop="Nationality" width="80px"></el-table-column>
                <el-table-column label="最寄駅" prop="Station" show-overflow-tooltip></el-table-column>
                <el-table-column label="モジュール" prop="Module" show-overflow-tooltip></el-table-column>
                <el-table-column label="認定資格" prop="Certificates"></el-table-column>
                <el-table-column label="経験年数" prop="ExpYears" width="100px"></el-table-column>
                <el-table-column label="ポジション" prop="Position" show-overflow-tooltip></el-table-column>
                <el-table-column label="来日年数" prop="JPYears" width="100px"></el-table-column>
                <el-table-column label="日本語能力" prop="JPLang" min-width="140px" show-overflow-tooltip></el-table-column>
                <el-table-column label="英語能力" prop="ENLang" min-width="140px" show-overflow-tooltip></el-table-column>
                <!-- <el-table-column label="ｽﾃｰﾀｽ" prop="Status" min-width="140px" show-overflow-tooltip></el-table-column>
                <el-table-column label="所在案件" prop="PJName" show-overflow-tooltip></el-table-column>
                <el-table-column label="案件終了日" prop="ContractEndDate" width="140px"></el-table-column> -->
                <el-table-column label="稼働単価" prop="ProjectSalary" show-overflow-tooltip></el-table-column>
                <el-table-column label="待機代" prop="BaseSalary" show-overflow-tooltip></el-table-column>
                <el-table-column label="提案単価" prop="SalesPrice" min-width="140px" show-overflow-tooltip></el-table-column>
                <el-table-column label="出張条件" prop="Travel" min-width="140px" show-overflow-tooltip></el-table-column>
                <el-table-column label="望む案件" prop="ExpectPJ" min-width="140px" show-overflow-tooltip></el-table-column>
                <el-table-column label="コメント" prop="Comment" show-overflow-tooltip></el-table-column>
                <el-table-column label="アクション" :width="`${operWidth}px`">
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
        <el-dialog :visible.sync="vislble" title="退職">
            <el-form size="mini">
                <el-form-item label="离职日期">
                    <el-date-picker
                        v-model="leavedate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" size="mini" @click="confirmLeave">确定</el-button>
            </div>
        </el-dialog>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
// import { CHANGE_TAB_TITLE } from '@vuex/actions';
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
            operWidth: 140,
            leavedate: '',
            vislble: false
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            // vm.$store.dispatch({
            //     type: CHANGE_TAB_TITLE,
            //     title: '员工清单'
            // });
            vm.getTeams();
            vm.getEmployeeTypes();
            vm.getPositions();
            vm.getData();
        });
    },
    computed: {
        ...mapGetters(['IS_H5', 'TEAMS'])
    },
    methods: {
        getData() {
            const loading = this.$loading({ lock: true, text: '社員一覧データ取得中...' });
            let positions = [];
            this.form.positions.forEach((item, i) => {
                positions.push(`positions[${i}]=${item}`);
            });
            let url = '/api/getemployeelist';
            if (positions.length) {
                positions = positions.join('&');
                url += `?${positions}`;
            }
            this.$axios({
                url,
                params: {
                    teamid: this.form.teamid || '',
                    employeetype: this.form.employeetype || '',
                    module: this.form.module,
                    name: this.form.name,
                    page: this.pn,
                    pagesize: this.ps
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
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
                        message: res ? res.message : 'インタフェース異常、データ取得できません！'
                    });
                }
            });
        },
        getTeams() {
            this.$axios({
                url: '/api/teamsforselect'
            }).then(res => {
                if (res) {
                    this.teams = res || [];
                }
            });
        },
        getEmployeeTypes() {
            this.$axios({
                url: '/api/employeetypesforselect'
            }).then(res => {
                if (res) {
                    this.employeeTypes = res || [];
                }
            });
        },
        getPositions() {
            this.$axios({
                url: '/api/positionsforselect'
            }).then(res => {
                if (res) {
                    this.positions = res || [];
                }
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
                this.pn = 1;
                this.getData();
            }
        },
        changeHandle() {
            this.pn = 1;
            this.getData();
        },
        clickHandle(scope, item) {
            if (item.action === 'act_employeeupdate') {
                this.$router.push({ name: 'EmployeeEdit', params: { id: scope.row.ID } });
            } else if (item.action === 'act_employeeleave') {
                this.vislble = true;
                this.curData = scope.row;
            } else {
                this.$message({
                    type: 'warning',
                    message: '該当機能は構築中'
                });
            }
        },
        confirmLeave() {
            if (!this.leavedate) {
                this.$message({
                    type: 'warning',
                    message: '请选择离职日期'
                });
                return;
            }
            const loading = this.$loading({ lock: true, text: '正在提交数据中' });
            this.$axios({
                url: '/api/employeeleave',
                params: {
                    empeeid: this.curData.ID,
                    leavedate: this.leavedate
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '提交成功'
                    });
                    this.vislble = false;
                    this.getData();
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
