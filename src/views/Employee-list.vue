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
            <el-form-item>
                <el-select v-model="form.onjob" placeholder="是否在职" @change="changeHandle" clearable>
                    <el-option v-for="item in selectLabs" :key="item.id" :label="item.title" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <div class="table-wrapper">
            <el-table size="small" :data="tableData" border>
                <el-table-column fixed label="社員番号" prop="employeeNo" width="100px"></el-table-column>
                <el-table-column fixed label="氏名" prop="name" show-overflow-tooltip></el-table-column>
                <el-table-column label="就職タイプ" prop="type" width="100px" show-overflow-tooltip></el-table-column>
                <el-table-column label="所属部門" prop="teamName" width="80px"></el-table-column>
                <el-table-column label="年齢" prop="age" width="60px"></el-table-column>
                <el-table-column label="性別" prop="sex" width="60px"></el-table-column>
                <el-table-column label="国籍" prop="nationality" width="80px"></el-table-column>
                <el-table-column label="最寄駅" prop="station" show-overflow-tooltip></el-table-column>
                <el-table-column label="スキル" prop="mainSkill" show-overflow-tooltip></el-table-column>
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
                <el-table-column label="アクション" width="160px" fixed="right">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="显示" placement="top-start">
                            <i class="el-icon-view oper-icon" color="success" @click="toDetail(scope.row)"></i>
                        </el-tooltip>
                        <el-tooltip
                            v-for="(item, i) in (scope.row.actions || [])"
                            :key="i"
                            effect="dark"
                            :content="item.text"
                            placement="top-start">
                            <i :class="[getClass(item), 'oper-icon']"
                                :color="getColor(item)"
                                @click="clickHandle(scope, item)"></i>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-pagination
            v-if='isGame'
            :page-size="form.pagesize"
            :current-page="form.page"
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
        <!-- 異動 -->
        <el-dialog :visible.sync="visilbleBoole" title="異動">
            <el-form size="mini" label-width="100px">
                <el-form-item>
                    <el-radio-group v-model="avaiable" @change="changeRadio">
                        <el-radio :label="true">異動</el-radio>
                        <el-radio :label="false">退職</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="現在部門">
                    <el-date-picker
                        style="width:200px;"
                        :disabled=dis
                        v-model="jobObj.teamFromDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"></el-date-picker>
                    <el-input :disabled=dis style="width:200px;margin-left:20px;" v-model="jobObj.teamName"></el-input>
                    <el-input :disabled=dis style="width:200px;margin-left:20px;" v-model="jobObj.teamLeader"></el-input>
                </el-form-item>
                <el-form-item label="異動部門" v-if="avaiable">
                    <el-date-picker
                        style="width:200px;"
                        v-model="teamFromdate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"></el-date-picker>
                    <el-select style="width:200px;margin-left:20px;" v-model="teamFromid" placeholder="部門" clearable>
                        <el-option v-for="item in TEAMS" :key="item.id" :label="item.teamName" :value="item.id">
                    </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="退職日付" v-if="!avaiable">
                    <el-date-picker
                        style="width:200px;"
                        v-model="teamTodate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        format="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item label="異動理由" v-if="avaiable">
                    <el-input type="textarea" v-model="teamFromReason" :rows="3"></el-input>
                </el-form-item>
                <el-form-item label="退職理由" v-if="!avaiable">
                    <el-input type="textarea" v-model="teamToReason" :rows="3"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" size="mini" @click="confirmSubmit">确定</el-button>
            </div>
        </el-dialog>
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
            selectLabs: [{
                id: false,
                title: '全部'
            },{
                id: true,
                title: '在职'
            }],
            teamFromdate: '',
            teamFromid: '',
            teamTodate: '',
            teamToReason: '',
            teamFromReason: '',
            dis: true,
            avaiable: true,
            form: {
                teamid: '',
                employeetype: '',
                module: '',
                positions: [],
                name: '',
                onjob: '',
                page: 1,
                pagesize: 15
            },
            teams: [],
            employeeTypes: [],
            positions: [],
            total: 0,
            tableData: [],
            operWidth: 140,
            leavedate: '',
            vislble: false,
            visilble2: false,
            visilbleBoole: false,
            salary: {
                empeeid: '',
                FromDate: '',
                PJSalary: '',
                BaseSalary: '',
                Comment: ''
            },
            jobObj: {},
            isGame: false
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (to.params.formid) {
                vm.form = to.params.formid;
                vm.form.page = to.params.formid.page;
            }
            vm.getTeams();
            vm.getEmployeeTypes();
            vm.getPositions();
            vm.getData();
            vm.isGame = true;
        });
    },
    computed: {
        ...mapGetters(['IS_H5', 'TEAMS'])
    },
    methods: {
        // 千分位字符格式化
        thousandFormat(num) {
            var reg = /\d{1,3}(?=(\d{3})+$)/g;
            return (num + '').replace(reg, '$&,');
        },
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
                    onjob: this.form.onjob,
                    page: this.form.page,
                    pagesize: this.form.pagesize
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
            this.form.page = pn;
            this.getData();
        },
        changePs(ps) {
            this.form.pagesize = ps;
            this.getData();
        },
        visibleChange(value) {
            if (!value) {
                this.form.page = 1;
                this.getData();
            }
        },
        changeHandle() {
            this.form.page = 1;
            this.getData();
        },
        toDetail(row) {
            this.$router.push({
                name: 'EmployeeEdit',
                params: {
                    id: row.id,
                    formsId: this.form,
                    news: 'new'
                },
                query: {
                    display: 1
                }
            });
        },
        clickHandle(scope, item) {
            if (item.action === 'act_employeeupdate') {
                this.$router.push({ name: 'EmployeeEdit', params: { id: scope.row.id, formsId: this.form } });
            } else if (item.action === 'act_employeeleave') {
                this.vislble = true;
                this.curData = scope.row;
            } else if (item.action === 'act_revisesalary') {
                this.salary = {
                    empeeid: scope.row.id,
                    FromDate: '',
                    PJSalary: this.thousandFormat(Number(scope.row.projectSalary)) || 0,
                    BaseSalary: Number(scope.row.baseSalary) || 0,
                    Comment: ''
                };
                this.visilble2 = true;
            } else {
                this.jobObj = scope.row;
                this.teamFromdate = moment(new Date()).format('YYYY-MM-01');
                this.teamFromid = '';
                this.teamFromReason = '';
                this.teamTodate = moment(new Date()).format('YYYY-MM-01');
                this.teamToReason = '';
                this.visilbleBoole = true;
            }
        },
        getClass(item) {
            if (item.action === 'act_employeeupdate') {
                return 'el-icon-edit-outline';
            } else if (item.action === 'act_employeeleave') {
                return 'el-icon-user';
            } else if (item.action === 'act_revisesalary') {
                return 'el-icon-money';
            } else {
                return 'el-icon-user';
            }
        },
        getColor(item) {
            if (item.action === 'act_employeeupdate') {
                return 'warning';
            } else if (item.action === 'act_employeeleave') {
                return 'primary';
            } else if (item.action === 'act_revisesalary') {
                return 'danger';
            } else {
                return 'primary';
            }
        },
        // changeRadio
        changeRadio() {
            const _this = this;
            _this.avaiable = !!_this.avaiable;
            _this.teamFromdate = moment(new Date()).format('YYYY-MM-01');
            _this.teamFromid = '';
            _this.teamFromReason = '';
            _this.teamTodate = moment(new Date()).format('YYYY-MM-01');
            _this.teamToReason = '';
        },
        // 異動提交
        confirmSubmit() {
            // teamFromdate: '',
            // teamFromid: '',
            // teamTodate: '',
            // teamToReason: '',
            // teamFromReason: '',
            const _this = this;
            const loading = _this.$loading({ lock: true, text: '正在提交数据中' });
            if (_this.avaiable) {
                _this.$axios({
                    url: '/api/employee/api_transferemployee',
                    params: {
                        empeeid: _this.jobObj.id,
                        teamid: _this.teamFromid,
                        fromdate: _this.teamFromdate,
                        comment: _this.teamFromReason
                    }
                }).then(res => {
                    loading.close();
                    if (res && res.code === 0) {
                        _this.$message({
                            type: 'success',
                            message: '提交成功'
                        });
                        _this.visilbleBoole = false;
                        _this.getData();
                    } else {
                        _this.$message({
                            type: 'error',
                            message: res ? res.message : '接口开小差了，没有返回信息'
                        });
                    }
                });
            } else {
                _this.$axios({
                    url: '/api/Employee/api_employeeleave',
                    params: {
                        empeeid: _this.jobObj.id,
                        leavedate: _this.teamTodate,
                        comment: _this.teamToReason
                    }
                }).then(res => {
                    loading.close();
                    if (res && res.code === 0) {
                        _this.$message({
                            type: 'success',
                            message: '提交成功'
                        });
                        _this.visilbleBoole = false;
                        _this.getData();
                    } else {
                        _this.$message({
                            type: 'error',
                            message: res ? res.message : '接口开小差了，没有返回信息'
                        });
                    }
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
                    Comment: this.salary.Comment || ''
                },
                custom: {
                    loading,
                    vm: this
                },
                formData: true
            }).then(res => {
                loading.close();
                if (res.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '提交成功'
                    });
                    this.visilble2 = false;
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
    .oper-icon {
        font-size: 18px !important;
    }
}
</style>
