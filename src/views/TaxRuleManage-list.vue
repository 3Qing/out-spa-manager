<template>
    <main-wrapper class="finReport-list">
        <el-form class="main-header" slot="header" size="mini" inline>
            <el-form-item>
                <el-date-picker
                    v-model="dates"
                    value-format="yyyy"
                    format="yyyy"
                    type="year"
                    placeholder="选择年"
                    @change='changeHandle'>
                </el-date-picker>
                <el-button class="update" size="mini" type="primary" @click="updateFile">更新</el-button>
            </el-form-item>
        </el-form>
        <div class="table-wrapper sosd">
            <el-table size="small" :data="tableData" border>
                <el-table-column label="別表番号" prop="tableNo" width="100px">
                    <template slot-scope="scope">
                        <el-input type="number" v-model="scope.row.tableNo" ></el-input>
                    </template> 
                </el-table-column>
                <el-table-column label="別表名称" prop="tableNoName" width="200px" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.tableNoName" ></el-input>
                    </template> 
                </el-table-column>
                <el-table-column label="課税範囲" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-input style="width:50%" type="number" @blur='isedit' v-model="scope.row.fromAmount" ></el-input>
                        <el-input style="width:50%" type="number" @blur='isedit' v-model="scope.row.toAmount" ></el-input>
                    </template> 
                </el-table-column>
                <el-table-column label="課税率・控除率" prop="percent" width="150px">
                    <template slot-scope="scope">
                        <el-input type="number" v-model="scope.row.percent" ></el-input>
                    </template> 
                </el-table-column>
                <el-table-column label="追加控除額" prop="additionalAmout" width="300px">
                    <template slot-scope="scope">
                        <el-input type="number" v-model="scope.row.additionalAmout" ></el-input>
                    </template> 
                </el-table-column>
                <el-table-column label="四捨五入ルール" prop="roundRule" width="150px">
                    <template slot-scope="scope">
                        <el-input type="number" v-model="scope.row.roundRule" ></el-input>
                    </template> 
                </el-table-column>
                <el-table-column label="操作" prop="title" show-overflow-tooltip width="70px">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="增加" placement="top-start">
                            <i class="icon-add iconfont oper-icon" color="success" @click="adds(scope.row)"></i>
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
            dates: moment(new Date()).format('YYYY'),
            tableData: []
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
            let url = '/api/TaxRule/api_gettaxrulelist';
            this.$axios({
                url,
                params: {
                    year: this.dates
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.tableData = res.data || [];
                    if (this.tableData.length === 0) {
                        let obj = {
                            additionalAmout: '',
                            fromAmount: '',
                            percent: '',
                            roundRule: '',
                            tableNo: '',
                            tableNoName: '',
                            toAmount: ''
                        };
                        this.tableData.push(obj);
                    }
                } else {
                    this.$message({
                        type: 'error',
                        showClose: false,
                        message: res ? res.message : 'インタフェース異常、データ取得できません！'
                    });
                }
            });
        },
        isedit() {
            this.tableData.forEach((item) => {
                if (item.fromAmount !== '' && item.toAmount !== '') {
                    if (Number(item.fromAmount) > Number(item.toAmount)) {
                        this.$message({
                            type: 'error',
                            showClose: false,
                            message: '请重新输入范围！'
                        });
                    }
                }  
            });
        },
        // 更新按钮
        updateFile() {
            this.tableData.forEach((item) => {
                item.updateTime = moment(item.updateTime).format('YYYY-MM-DD');
            });
            const loading = this.$loading({ lock: true, text: '数据更新中...' });
            let url = '/api/TaxRule/api_updatetaxrules';
            this.$axios({
                method: 'POST',
                url,
                params: {
                    taxrules: this.tableData
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
        },
        adds() {
            let obj = {
                additionalAmout: '',
                fromAmount: '',
                percent: '',
                roundRule: '',
                tableNo: '',
                tableNoName: '',
                toAmount: ''
            };
            this.tableData.push(obj);
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
.finReport-list {
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
