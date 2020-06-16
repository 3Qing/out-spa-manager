<template>
    <main-wrapper class="finReport-list">
        <el-form class="main-header" slot="header" size="mini" inline>
            <el-form-item>
                <el-radio-group v-model="avaiable" @change="changeHandle">
                    <el-radio :label="true">貸借対照表</el-radio>
                    <el-radio :label="false">損益表</el-radio>
                </el-radio-group>
                <el-button class="update" size="mini" type="primary" @click="updateFile">更新</el-button>
            </el-form-item>
        </el-form>
        <div class="table-wrapper sosd">
            <el-table size="small" :data="tableData" border>
                <el-table-column label="表示順番" prop="order">
                    <template slot-scope="scope">
                        <el-input type="number" v-model="scope.row.order" ></el-input>
                    </template> 
                </el-table-column>
                <el-table-column label="テキスト" prop="text" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.text" ></el-input>
                    </template> 
                </el-table-column>
                <el-table-column label="表示階層" prop="level" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-input type="number" v-model="scope.row.level" ></el-input>
                    </template> 
                </el-table-column>
                <el-table-column label="計算公式" prop="formula">
                    <template slot-scope="scope">
                        <el-input type="text" v-model="scope.row.formula" ></el-input>
                    </template> 
                </el-table-column>
                <el-table-column label="操作" prop="title" show-overflow-tooltip width="70px">
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

export default {
    components: {
        MainWrapper
    },
    data() {
        return {
            avaiable: true,
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
        getData() {
            const loading = this.$loading({ lock: true, text: '数据取得中...' });
            let url = '/api/ACBalance/api_getaccountgrplist';
            this.$axios({
                url,
                params: {
                    bspl: this.avaiable
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.tableData = res.data || [];
                    if (this.tableData.length === 0) {
                        let obj = {
                            order: '',
                            text: '',
                            level: '',
                            formula: ''
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
        // 更新按钮
        updateFile() {
            this.tableData.forEach((item) => {
                item.updateTime = moment(item.updateTime).format('YYYY-MM-DD');
            });
            const loading = this.$loading({ lock: true, text: '数据更新中...' });
            let url = '/api/ACBalance/api_updateaccountgrplist';
            this.$axios({
                method: 'POST',
                url,
                params: {
                    acctgrps: this.tableData,
                    bspl: this.avaiable
                },
                formData: true
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    // this.$message({
                    //     type: 'success',
                    //     showClose: false,
                    //     message: res.message
                    // });
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
        adds(i) {
            let obj = {
                order: '',
                text: '',
                level: '',
                formula: ''
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
