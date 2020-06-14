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
                <el-table-column label="祝日" prop="date" width="250px">
                    <template slot-scope="scope">
                        <el-date-picker
                            v-model="scope.row.date"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            :default-value=scos
                            type="date"
                            placeholder="选择日期"
                            @change='isChangesel(scope.row.date)'>
                        </el-date-picker>
                    </template> 
                </el-table-column>
                <el-table-column label="祝日名称" prop="title" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.title" ></el-input>
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

export default {
    components: {
        MainWrapper
    },
    data() {
        return {
            dates: moment(new Date()).format('YYYY'),
            tableData: [],
            scos: ''
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (moment(new Date()).format('YYYY') === vm.dates) {
                vm.scos = vm.dates + moment(new Date()).format('-MM-DD');
            } else {
                vm.scos = vm.dates + '-01-01';
            }
            vm.getData();
        });
    },
    computed: {
        ...mapGetters(['IS_H5', 'TEAMS'])
    },
    methods: {
        getData() {
            const loading = this.$loading({ lock: true, text: '数据取得中...' });
            let url = '/api/Holiday/api_getholidays';
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
                            date: '',
                            title: ''
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
        adds() {
            let obj = {
                date: '',
                title: ''
            };
            this.tableData.push(obj);
        },
        deletes(i) {
            this.tableData.splice(i, 1);
        },
        // 判断日期是否重复
        isChangesel() {
            var arr = this.tableData;
            var find = false;
            for (var i = 0; i < arr.length; i++) {
                for (var j = i + 1; j < arr.length; j++) {
                    if (moment(arr[i].date).format('YYYY-MM-DD') === moment(arr[j].date).format('YYYY-MM-DD')) { 
                        find = true; 
                        break;
                    }
                }
                if (find) break;
            }
            if (find) {
                this.$message({
                    type: 'error',
                    message: '日期重复，请重新选择！'
                });
            }
        },
        // 更新按钮
        updateFile() {
            const loading = this.$loading({ lock: true, text: '数据更新中...' });
            let url = '/api/Holiday/api_updateholidays';
            this.$axios({
                method: 'POST',
                url,
                params: {
                    holidays: this.tableData
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
        changeHandle() {
            if (moment(new Date()).format('YYYY') === this.dates) {
                this.scos = this.dates + moment(new Date()).format('-MM-DD');
            } else {
                this.scos = this.dates + '-01-01';
            }
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
