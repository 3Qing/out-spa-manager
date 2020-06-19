<template>
    <main-wrapper class="pre-sales">
        <div slot="header" class="main-header">
            <el-select v-model="status" multiple collapse-tags @visible-change="visibelChange" size="mini">
                <el-option v-for="item in empStatus" :key="item.val" :value="item.val" :label="item.label"></el-option>
            </el-select>
            <el-select
                v-model="keyword"
                multiple
                filterable
                remote
                reserve-keyword
                placeholder="请输入姓名"
                :remote-method="remoteMethod"
                size="mini"
                :loading="loading">
                <el-option
                    v-for="item in allName"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
        </div>
        <div class="left">
            <el-button size="mini" type="primary" @click="showIntroDialog" style="margin-bottom: 10px">添加营业候选人</el-button>
            <el-table size="small" :data="tableData" @cell-click="cellClick" border>
                <el-table-column label="员工号" prop="employeeNo" width="100px"></el-table-column>
                <el-table-column label="姓名" prop="name" show-overflow-tooltip></el-table-column>
                <el-table-column label="Avaiable Date" prop="avaiableDate" width="120px">
                    <template slot-scope="scope">
                        <span>{{formatTime(scope.row.avaiableDate)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="营业状态" prop="salesStatusText">
                    <template slot-scope="scope">
                        <div>{{scope.row.salesStatusText}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="进行中Case数" prop="salesCaseCnt" width="100px"></el-table-column>
                <el-table-column label="操作" width="50px">
                    <template slot-scope="scope">
                        <!-- <el-button type="warning" size="mini" @click="showIntroDialog(scope.row)">编辑</el-button> -->
                        <el-tooltip effect="dark" content="编辑" placement="top-start">
                            <i class="el-icon-edit-outline oper-icon" color="warning" @click="showIntroDialog(scope.row)"></i>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                :current-page="page"
                :page-size="pageSize"
                @current-change="changePn"
                :layout="IS_H5 ? 'prev, pager, next' : 'total, prev, pager, next, jumper'"
                :total="total"></el-pagination>
        </div>
        <div class="right">
            <case-list
                :loading="caseLoading"
                :data="caseListData"
                :itemID="curItemID"
                :oppStatu='oppStatus'
                @update="getCaseListData"></case-list>
        </div>
        <intro-dialog :allStatus="allStatus"></intro-dialog>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import CaseList from '@components/pre-sales/case-list';
// import EmployeeDialog from '@components/pre-sales/employee-dialog';
import IntroDialog from '@components/pre-sales/intro-dialog';
import { formatTime } from '@_public/utils';
import { mapGetters } from 'vuex';

export default {
    components: {
        MainWrapper,
        CaseList,
        // EmployeeDialog,
        IntroDialog
    },
    data() {
        return {
            tableData: [],
            caseListData: [],
            curItemID: -1,
            caseLoading: false,
            status: [1, 2, 3],
            empStatus: [{
                label: '開始', val: 1
            }, {
                label: '提案のみ', val: 2
            }, {
                label: '並行面談中', val: 3
            }, {
                label: '取消', val: 7
            }, {
                label: '失敗終了', val: 8
            }, {
                label: '成功終了', val: 9
            }],
            page: 1,
            pageSize: 15,
            total: 0,
            loading: false,
            allName: [],
            keyword: '',
            allStatus: [],
            oppStatus: []
        };
    },
    provide() {
        return {
            status: this.empStatus
        };
    },
    computed: {
        ...mapGetters(['IS_H5'])
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getListData();
            vm.getSales();
            vm.getStatus();
        });
    },
    methods: {
        formatTime: formatTime,
        getStatus() {
            this.$axios({
                url: '/api/SalesCase/api_salescasestatusforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.oppStatus = res.data || [];
                }
            });
        },
        getSales() {
            this.$axios({
                url: '/api/Employee/api_salespersonforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.allStatus = res.data || [];
                }
            });
        },
        getListData() {
            const loading = this.$loading({ lock: true, text: '正在获取列表数据...' });
            let url = '/api/Candidate/api_getcandidatelistinsale';
            let params = this.status.map((item, i) => `statuses[${i}]=${item}`);
            this.$axios({
                url: `${url}?${params.join('&')}`,
                params: {
                    name: this.keyword || '',
                    page: this.page,
                    pagesize: this.pageSize
                },
                custom: {
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    const data = res.data || {};
                    this.tableData = data.data;
                    this.total = data.total || 0;
                    if (data.data.length) {
                        this.curItemID = data.data[0].id;
                        this.getCaseListData();
                    }
                } else {
                    this.$message({
                        type: 'error',
                        showClose: true,
                        message: res.message ? res.message : '接口开小差了，没有返回信息'
                    });
                }
            });
        },
        changePn(page) {
            this.page = page;
            this.getListData();
        },
        getCaseListData() {
            this.tableData.forEach((item) => {
                if(this.curItemID === item.id) {
                    this.caseListData = item.salesCases;
                    this.caseListData.forEach((item) => {
                        item['isAddCase'] = false;
                    });
                }
            });
            // this.caseLoading = true;
            // this.$axios({
            //     url: '/api/Candidate/api_getcandidatebyid',
            //     params: {
            //         id: this.curItemID
            //     }
            // }).then(res => {
            //     this.caseLoading = false;
            //     if (res && res.code === 0) {
            //         const data = res.data || {};
            //         this.caseListData = data.salesCases || [];
            //     } else {
            //         this.$message({
            //             type: 'error',
            //             showClose: true,
            //             message: res.message ? res.message : '接口开小差了，没有返回信息'
            //         });
            //     }
            // }).catch(() => {
            //     this.caseLoading = false;
            // });
        },
        showIntroDialog() {
            this.$root.$emit('SHOW_INTRO_DIALOG', {
                data: null,
                showDate: true,
                callback: () => {
                    this.getListData();
                }
            });
        },
        cellClick(row, column) {
            if (column.label !== '操作') {
                this.curItemID = row.id;
                this.getCaseListData();
            }
        },
        getStatusText(val) {
            for (let item of this.empStatus) {
                if (item.val === val) {
                    return item.label;
                }
            }
        },
        visibelChange(val) {
            if (!val) {
                this.getListData();
            }
        },
        remoteMethod(keyword) {
            if (keyword) {
                this.$axios({
                    url: '/api/Candidate/api_candidatesforselect',
                    params: {
                        keyword
                    }
                }).then(res => {
                    console.log(res);
                });
            }
        }
    }
};
</script>

<style lang="less">
.pre-sales {
    .content-wrapper {
        & > div {
            &:after {
                content: '';
                display: block;
                width: 100%;
                height: 0;
                clear: both;
            }
        }
    }
    .left {
        float: left;
        width: 40%;
        .el-table{
            width: 100%;
        }
    }
    .right {
        width: 60%;
        float: left;
        padding-left: 20px;
        box-sizing: border-box;
    }
}
</style>
