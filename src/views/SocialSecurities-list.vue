<template>
    <main-wrapper class="social-list">
        <el-form class="main-header" slot="header" size="mini" inline>
            <el-form-item>
                <el-date-picker
                    v-model="dates"
                    value-format="yyyy-MM-dd"
                    format="yyyy-MM-dd"
                    type="date"
                    placeholder="选择年月日"
                    @change='changeHandle'>
                </el-date-picker>
                <el-button class="update" size="mini" type="primary" v-if='isAdd===true&&isEdit===true' @click="updateFile(1)">新增</el-button>
                <el-button class="update" size="mini" type="primary" v-if='isAdd===true&&isEdit===false' @click="saves(false)">保存</el-button>
                <el-button class="update" size="mini" type="primary" v-if='isAdd===true&&isEdit===true' @click="updateFile(2)">编辑</el-button>
                <el-button class="update" size="mini" type="primary" v-if='isAdd===false&&isEdit===true' @click="saves(true)">保存</el-button>
                <el-button class="update" size="mini" type="info" v-if='isShow' @click="getData">返回</el-button>
            </el-form-item>
        </el-form>
        <div class="table-wrapper sosd">
            <el-table size="small" :data="tableData" border >
                <el-table-column label="タイプ" prop="type" width="120px">
                    <template slot-scope="scope">
                        <el-select
                            v-if='(isAdd === true && isEdit === false) || (isAdd === false && isEdit === true)'
                            v-model="scope.row.type"
                            size="mini"
                            placeholder="タイプ">
                            <el-option
                                v-for="item in tabSelect"
                                :key="item.id"
                                :label="item.text"
                                :value="item.id">
                            </el-option>
                        </el-select>
                        <span v-else>{{getContent(scope.row.type, tabSelect, 'id', 'text')}}</span>
                    </template> 
                </el-table-column>
                <el-table-column label="有効開始日" prop="effectFromDate" width="160px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-date-picker
                            v-if='(isAdd === true && isEdit === false) || (isAdd === false && isEdit === true)'
                            v-model="scope.row.effectFromDate"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            type="date"
                            placeholder="选择年月日">
                        </el-date-picker>
                        <span v-else>{{scope.row.effectFromDate}}</span>
                    </template> 
                </el-table-column>
                <el-table-column label="有効終了日" width="160px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-date-picker
                            v-if='(isAdd === true && isEdit === false) || (isAdd === false && isEdit === true)'
                            v-model="scope.row.effectToDate"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            type="date"
                            placeholder="选择年月日">
                        </el-date-picker>
                        <span v-else>{{scope.row.effectToDate}}</span>
                    </template> 
                </el-table-column>
                <el-table-column label="等級" prop="insuranceLevel" width="120px">
                    <template slot-scope="scope">
                        <el-input v-if='(isAdd === true && isEdit === false) || (isAdd === false && isEdit === true)' type="number" v-model="scope.row.insuranceLevel" ></el-input>
                        <span v-else>{{scope.row.insuranceLevel}}</span>
                    </template> 
                </el-table-column>
                <el-table-column label="標準報酬" prop="standardSalary" >
                    <template slot-scope="scope">
                        <el-input v-if='(isAdd === true && isEdit === false) || (isAdd === false && isEdit === true)' @input='isedit' v-model="scope.row.standardSalary" ></el-input>
                        <span v-else>{{scope.row.standardSalary}}</span>
                    </template> 
                </el-table-column>
                <el-table-column label="報酬月額" >
                    <template slot-scope="scope">
                        <el-input v-if='(isAdd === true && isEdit === false) || (isAdd === false && isEdit === true)' style="width:50%" @input='isedit'  v-model="scope.row.salaryFrom" ></el-input>
                        <el-input v-if='(isAdd === true && isEdit === false) || (isAdd === false && isEdit === true)' style="width:50%" @input='isedit'  v-model="scope.row.salaryTo" ></el-input>
                        <span v-else>{{scope.row.salaryFrom}}-{{scope.row.salaryTo}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="保険率" prop="standardPercent" width="150px">
                    <template slot-scope="scope">
                        <el-input v-if='(isAdd === true && isEdit === false) || (isAdd === false && isEdit === true)' v-model="scope.row.standardPercent" type='number'>
                            <template slot="append">%</template>
                        </el-input>
                        <span v-else>{{scope.row.standardPercent}}%</span>
                    </template> 
                </el-table-column>
                <el-table-column label="追加率" prop="additionalPercent" width="150px" :render-header="renderHeader">
                    <template slot-scope="scope">
                        <el-input v-if='(isAdd === true && isEdit === false) || (isAdd === false && isEdit === true)' v-model="scope.row.additionalPercent" 
                        type='number'>
                            <template slot="append">%</template>
                        </el-input>
                        <span v-else>{{scope.row.additionalPercent}}%</span>
                    </template> 
                </el-table-column>
                <el-table-column v-if='(isAdd === true && isEdit === false) || (isAdd === false && isEdit === true)' label="操作" prop="title" show-overflow-tooltip width="70px">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="增加" placement="top-start">
                            <i class="icon-add iconfont oper-icon" color="success" @click="adds(scope.$index)"></i>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除" placement="top-start">
                            <i class="el-icon-delete oper-icon" color="danger" @click="deletes(scope.$index)"></i>
                        </el-tooltip>
                    </template> 
                </el-table-column>
            </el-table>
        </div>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import { mapGetters } from 'vuex';
import moment from 'moment';
import { priceToString, priceToNumber } from '@_public/utils';

export default {
    components: {
        MainWrapper
    },
    data() {
        return {
            dates: moment(new Date()).format('YYYY-MM-DD'),
            tableData: [],
            updates: false,
            isShow: false,
            isEdit: true,
            isAdd: true,
            tabSelect: [{
                id: 1,
                text: '健康保険'
            },{
                id: 2,
                text: '厚生年金'
            }]
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getData();
        });
    },
    computed: {
        ...mapGetters(['IS_H5', 'TEAMS'])
    },
    methods: {
        priceToString: priceToString,
        priceToNumber: priceToNumber,
        getData() {
            const loading = this.$loading({ lock: true, text: '数据取得中...' });
            let url = '/api/SocialSecurity/api_getsocialsecuritylist';
            this.$axios({
                url,
                params: {
                    currdate: this.dates
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.isShow = false;
                    this.isEdit = true;
                    this.isAdd = true;
                    this.tableData = res.data || [];
                    this.tableData.forEach((item) => {
                        item.effectFromDate = moment(item.effectFromDate).format('YYYY-MM-DD');
                        item.effectToDate = moment(item.effectToDate).format('YYYY-MM-DD');
                        item.salaryFrom = priceToString(priceToNumber(item.salaryFrom));
                        item.salaryTo = priceToString(priceToNumber(item.salaryTo));
                        item.standardSalary = priceToString(priceToNumber(item.standardSalary));
                    });
                } else {
                    this.$message({
                        type: 'error',
                        showClose: false,
                        message: res ? res.message : 'インタフェース異常、データ取得できません！'
                    });
                }
            });
        },
        renderHeader(h, { column }) {
            return h("div", [
                h("span", column.label),
                h("el-tooltip",{
                    props: {
                        effect: "dark",
                        content:"介護保険第２号被保険者に該当する場合",
                        placement: "top"
                    }
                },
                [
                    h("i", {
                        class: "el-icon-question",
                        style: "color:#1473B7;margin-left:5px;cursor:pointer;"
                    })
                ],
                {
                    content: "介護保険第２号被保険者に該当する場合"
                })
            ]);
        },
        isedit() {
            this.tableData.forEach((item) => {
                item.salaryFrom = priceToString(priceToNumber(item.salaryFrom));
                item.salaryTo = priceToString(priceToNumber(item.salaryTo));
                item.standardSalary = priceToString(priceToNumber(item.standardSalary));
                // if (item.salaryFrom !== '' && item.salaryTo !== '') {
                //     if (Number(item.salaryFrom) > Number(item.salaryTo)) {
                //         this.$message({
                //             type: 'error',
                //             showClose: false,
                //             message: '请重新输入報酬月額！'
                //         });
                //     }
                // }  
            });
        },
        getContent(val, arr, key, field) {
            for (let item of arr) {
                if (item[key] === val) {
                    return item[field];
                }
            }
            return '-';
        },
        // 新增编辑按钮
        updateFile(inid) {
            this.isShow = true;
            if (inid === 1) {
                this.isEdit = false;
                this.isAdd = true;
                this.tableData = [];
                this.tableData = [{
                    type: '',
                    effectFromDate: '',
                    effectToDate: '9999-12-31',
                    insuranceLevel: '',
                    standardSalary: '',
                    salaryFrom: '',
                    salaryTo: '',
                    standardPercent: '',
                    additionalPercent: ''
                }];
            } else if (inid === 2) {
                // 编辑
                this.isEdit = true;
                this.isAdd = false;
                this.updates = true;
            }
        },
        saves(inid) {
            let arr = this.tableData;
            let istrue = false;
            for (let i=0;i<arr.length;i++) {
                if (arr[i].type === '') {
                    istrue = true;
                    this.$message({
                        type: 'error',
                        showClose: false,
                        message: 'タイプ不能为空！'
                    });
                    break;
                } else if (arr[i].effectFromDate === '') {
                    istrue = true;
                    this.$message({
                        type: 'error',
                        showClose: false,
                        message: '有効開始日不能为空！'
                    });
                    break;
                } else if (arr[i].effectToDate === '') {
                    istrue = true;
                    this.$message({
                        type: 'error',
                        showClose: false,
                        message: '有効終了日不能为空！'
                    });
                    break;
                } else if (arr[i].insuranceLevel === '') {
                    istrue = true;
                    this.$message({
                        type: 'error',
                        showClose: false,
                        message: '等級不能为空！'
                    });
                    break;
                } else if (arr[i].standardSalary === '') {
                    istrue = true;
                    this.$message({
                        type: 'error',
                        showClose: false,
                        message: '標準報酬不能为空！'
                    });
                    break;
                } else if (arr[i].salaryFrom === '' && arr[i].salaryTo === '') {
                    istrue = true;
                    this.$message({
                        type: 'error',
                        showClose: false,
                        message: '報酬月額至少填写一个！'
                    });
                    break;
                } else if (arr[i].standardPercent === '') {
                    istrue = true;
                    this.$message({
                        type: 'error',
                        showClose: false,
                        message: '保険率不能为空！'
                    });
                    break;
                }
            }
            if (istrue === false) {
                this.tableData.forEach((item) => {
                    item.salaryFrom = priceToNumber(item.salaryFrom);
                    item.salaryTo = priceToNumber(item.salaryTo);
                    item.standardSalary = priceToNumber(item.standardSalary);
                    item.updateTime = moment(item.updateTime).format('YYYY-MM-DD');
                });
                const loading = this.$loading({ lock: true, text: '数据更新中...' });
                let url = '/api/SocialSecurity/api_updatesocialsecurities';
                this.$axios({
                    method: 'POST',
                    url,
                    params: {
                        ssrules: this.tableData,
                        date: this.dates,
                        updateflag: inid
                    },
                    formData: true
                }).then(res => {
                    loading.close();
                    if (res && res.code === 0) {
                        this.getData();
                    } else {
                        this.$message({
                            type: 'error',
                            showClose: false,
                            message: res ? res.message : 'インタフェース異常、データ取得できません！'
                        });
                    }
                });
            }
        },
        adds(i) {
            let obj = {
                type: '',
                effectFromDate: '',
                effectToDate: '9999-12-31',
                insuranceLevel: '',
                standardSalary: '',
                salaryFrom: '',
                salaryTo: '',
                standardPercent: '',
                additionalPercent: ''
            };
            this.tableData.splice(i+1, 0, obj);
        },
        deletes(i) {
            this.tableData.splice(i, 1);
        },
        changeHandle() {
            this.getData();
        }
    }
};
</script>

<style lang="less">
.social-list {
    .table-wrapper {
        padding: 0 20px;
    }
    .el-pagination {
        margin-top: 20px;
        text-align: center;
    }
    .update{
        margin-left: 30px;
    }
}
</style>
