<template>
    <main-wrapper class="employee-list">
        <el-form class="main-header header-form" slot="header" size="mini" inline>
            <el-form-item>
                <el-select v-model="form.teamid" placeholder="部門" @change="changeHandle" clearable>
                    <el-option v-for="item in TEAMS" :key="item.id" :label="item.teamName" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="form.employeetype" placeholder="就職タイプ" @change="changeHandle" clearable>
                    <el-option v-for="item in employeeTypes" :key="item.id" :label="item.title" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-select v-model="form.positions" placeholder="ポジション" multiple collapse-tags @visible-change="visibleChange" clearable>
                    <el-option v-for="item in positions" :key="item.id" :label="item.title" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-input v-model="form.module" placeholder="モジュール" :maxlength="50" @blur="changeHandle" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-input v-model="form.name" placeholder="氏名" :maxlength="30" @blur="changeHandle" clearable></el-input>
            </el-form-item>
        </el-form>
        <div class="table-wrapper">
            <el-table size="small" :data="tableData" border>
                <el-table-column label="所属部門" prop="teamName" width="80px"></el-table-column>
                <el-table-column label="社員番号" prop="employeeNo" width="100px"></el-table-column>
                <el-table-column label="就職タイプ" prop="type" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="氏名" prop="name" show-overflow-tooltip></el-table-column>
                <el-table-column label="年齢" prop="age" width="60px"></el-table-column>
                <el-table-column label="性別" prop="sex" width="60px"></el-table-column>
                <el-table-column label="国籍" prop="nationality" width="80px"></el-table-column>
                <el-table-column label="最寄駅" prop="station" show-overflow-tooltip></el-table-column>
                <el-table-column label="モジュール" prop="mainSkill" show-overflow-tooltip></el-table-column>
                <el-table-column label="認定資格" prop="certificates"></el-table-column>
                <el-table-column label="経験年数" prop="expYears" width="100px"></el-table-column>
                <el-table-column label="ポジション" prop="position" show-overflow-tooltip></el-table-column>
                <el-table-column label="来日年数" prop="jpYears" width="100px"></el-table-column>
                <el-table-column label="日本語能力" prop="jpLang" min-width="140px" show-overflow-tooltip></el-table-column>
                <el-table-column label="英語能力" prop="enLang" min-width="140px" show-overflow-tooltip></el-table-column>
                <el-table-column label="稼働単価" prop="projectSalary" show-overflow-tooltip></el-table-column>
                <el-table-column label="待機代" prop="baseSalary" show-overflow-tooltip></el-table-column>
                <el-table-column label="提案単価" prop="salesPrice" min-width="140px" show-overflow-tooltip></el-table-column>
                <el-table-column label="出張条件" prop="travel" min-width="140px" show-overflow-tooltip></el-table-column>
                <el-table-column label="望む案件" prop="expectPJ" min-width="140px" show-overflow-tooltip></el-table-column>
                <el-table-column label="コメント" prop="comment" show-overflow-tooltip></el-table-column>
                <el-table-column label="アクション" :width="`${operWidth}px`" v-if="operWidth">
                    <template slot-scope="scope">
                        <!-- <i class="el-icon-view oper-icon" color="primary"></i> -->
                        <el-button size="mini" type="success" @click="toDetail(scope.row)">显示</el-button>
                        <el-button
                            v-for="(item, i) in (scope.row.actions || [])"
                            size="mini"
                            :key="i"
                            :type="i === 0 ? 'warning' : 'primary'"
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
            :layout="IS_H5 ? 'prev, pager, next' : 'total, prev, pager, next, jumper'"
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
        <el-dialog :visible.sync="visilble2" title="昇給">
            <el-form size="mini" label-width="100px">
                <el-form-item label="昇給開始日">
                    <el-date-picker
                        v-model="salary.FromDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item label="稼働賃金">
                    <el-input v-model.number="salary.PJSalary"></el-input>
                </el-form-item>
                <el-form-item label="待機代">
                    <el-input v-model.number="salary.BaseSalary"></el-input>
                </el-form-item>
                <el-form-item label="コメント">
                    <el-input type="textarea" v-model="salary.Comment" :rows="3"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" size="mini" @click="confirmSalary">确定</el-button>
            </div>
        </el-dialog>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
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
            vislble: false,
            visilble2: false,
            salary: {
                empeeid: '',
                FromDate: '',
                PJSalary: '',
                BaseSalary: '',
                Comment: ''
            }
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
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
            let url = '/api/Employee/api_getemployeelist';
            this.$axios({
                method: 'POST',
                url,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                params: {
                    teamid: this.form.teamid || '',
                    employeetype: this.form.employeetype || '',
                    positions: this.form.positions,
                    masterskill: this.form.module,
                    name: this.form.name,
                    page: this.pn,
                    pagesize: this.ps
                },
                formData: true
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    let actionLen = 0;
                    const data = res.data || {};
                    (data.data || []).forEach(item => {
                        if (item.actions) {
                            if (item.actions.length > actionLen) {
                                actionLen = item.actions.length;
                            }
                        }
                    });
                    this.operWidth = actionLen * 80 + 80;
                    this.tableData = data.data || [];
                    this.total = data.total;
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
                url: '/api/Team/api_teamsforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.teams = res.data || [];
                }
            });
        },
        getEmployeeTypes() {
            this.$axios({
                url: '/api/Employee/api_employeetypesforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.employeeTypes = res.data || [];
                }
            });
        },
        getPositions() {
            this.$axios({
                url: '/api/Position/api_positionsforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.positions = res.data || [];
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
        toDetail(row) {
            this.$router.push({
                name: 'EmployeeEdit',
                params: {
                    id: row.id
                },
                query: {
                    display: 1
                }
            });
        },
        clickHandle(scope, item) {
            if (item.action === 'act_employeeupdate') {
                this.$router.push({ name: 'EmployeeEdit', params: { id: scope.row.id } });
            } else if (item.action === 'act_employeeleave') {
                this.vislble = true;
                this.curData = scope.row;
            } else if (item.action === 'act_revisesalary') {
                this.salary = {
                    empeeid: scope.row.id,
                    FromDate: '',
                    PJSalary: Number(scope.row.projectSalary) || 0,
                    BaseSalary: Number(scope.row.baseSalary) || 0,
                    Comment: scope.row.comment
                };
                this.visilble2 = true;
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
                url: '/api/Employee/api_employeeleave',
                params: {
                    empeeid: this.curData.id,
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
        },
        confirmSalary() {
            if (!this.salary.FromDate) {
                this.$message({
                    type: 'warning',
                    message: '请选择昇給開始日'
                });
                return;
            }
            const loading = this.$loading({ lock: true, text: '正在提交数据中' });
            this.$axios({
                method: 'POST',
                url: '/api/Employee/api_revisesalary',
                params: {
                    EmployeeID: this.salary.empeeid,
                    FromDate: this.salary.FromDate,
                    PJSalary: Number(this.salary.PJSalary) || 0,
                    BaseSalary: Number(this.salary.BaseSalary) || 0,
                    Comment: this.salary.Comment
                },
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                if (res.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '提交成功'
                    });
                    this.vislble2 = false;
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
