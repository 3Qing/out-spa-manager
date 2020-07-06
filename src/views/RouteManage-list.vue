<template>
    <main-wrapper class="finReport-list">
        <el-form class="main-header" slot="header" size="mini" inline>
            <el-form-item>
                <el-button size="mini" type="primary" @click="toEdit('new')">新增</el-button>
            </el-form-item>
        </el-form>
        <div class="table-wrapper sosd">
            <el-table size="small" :data="tableData" border>
                <el-table-column label="ルート" prop="routePath">
                    <template slot-scope="scope">
                        <span>{{scope.row.routePath}}</span>
                    </template> 
                </el-table-column>
                <el-table-column label="ルート名称" prop="routeName">
                    <template slot-scope="scope">
                        <span>{{scope.row.routeName}}</span>
                    </template> 
                </el-table-column>
                <el-table-column label="Platform管理用" prop="adminRoute">
                    <template slot-scope="scope">
                        <span>{{scope.row.adminRoute}}</span>
                    </template> 
                </el-table-column>
                <el-table-column label="アクション" prop="title" show-overflow-tooltip width="100px">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="编辑" placement="top-start">
                            <i class="el-icon-edit-outline oper-icon" color="warning" @click="toEdit('edit', scope.row)"></i>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除" placement="top-start">
                            <i class="el-icon-delete oper-icon" color="danger" @click="deletes(scope.row.routePath)"></i>
                        </el-tooltip>
                    </template> 
                </el-table-column>
            </el-table>
        </div>
        <el-dialog :title="news==='new'?'新增':'编辑'" :visible.sync="visible" @close="close" class="blackColor sop">
            <el-form ref="form" :model="form" :rules="rules" size="mini" label-width="120px">
                <el-form-item label="ルート" prop="routePath">
                    <el-input v-model="form.routePath" :maxlength='50'></el-input>
                </el-form-item>
                <el-form-item label="ルート名称" prop="routeName">
                    <el-input v-model="form.routeName" :maxlength='50'></el-input>
                </el-form-item>
                <el-form-item label="Platform管理用" prop="adminRoute">
                    <el-checkbox v-model="form.adminRoute"></el-checkbox>
                </el-form-item>
            </el-form>
        <div slot="footer">
            <el-button size="mini" type="primary" @click="submit">保存</el-button>
            <el-button size="mini" @click="close">取消</el-button>
        </div>
        </el-dialog>
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
            tableData: [],
            visible: false,
            news: '',
            form: {
                routePath: '',
                routeName: '',
                adminRoute: false,
                updateTime: moment(new Date()).format('YYYY-MM-DD')
            },
            candidates: [],
            rules: {
                routePath: [{
                    required: true, message: '请输入ルート', trigger: 'blur'
                }],
                routeName: [{
                    required: true, message: '请输入ルート名称', trigger: 'blur'
                }]
                // adminRoute: [{
                //     required: true, message: '请输入Platform管理用', trigger: 'blur'
                // }]
            }
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
        toEdit(id, row) {
            if (id === 'new') {
                this.news = 'new';
                this.form = {
                    routePath: '',
                    routeName: '',
                    adminRoute: false,
                    updateTime: moment(new Date()).format('YYYY-MM-DD')
                };
            } else {
                this.news = 'edit';
                this.form = row;
            }
            this.visible = true;
        },
        close() {
            this.visible = false;
        },
        submit() {
            this.form.updateTime = moment(new Date()).format('YYYY-MM-DD');
            const loading = this.$loading({ lock: true, text: '正在提交资料中...' });
            this.$axios({
                method: 'POST',
                url: '/api/Route/api_updateroute',
                params: this.form,
                formData: true
            }).then(res => {
                loading.close();
                this.visible = false;
                if (res && res.code === 0) {
                    this.getData();
                    this.$message({
                        type: 'success',
                        showClose: true,
                        message: '保存成功'
                    });
                } else {
                    this.$message({
                        type: 'error',
                        showClose: true,
                        message: res.message ? res.message : '接口开小差了，没有返回信息'
                    });
                }
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
        getData() {
            const loading = this.$loading({ lock: true, text: '数据取得中...' });
            let url = '/api/Route/api_getroutelist';
            this.$axios({
                url
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.tableData = res.data || [];
                    console.log(this.tableData);
                } else {
                    this.$message({
                        type: 'error',
                        showClose: false,
                        message: res ? res.message : 'インタフェース異常、データ取得できません！'
                    });
                }
            });
        },
        deletes(ids) {
            // console.log(ids);
            this.$confirm('是否删除', '删除', {
                type: 'warning'
            }).then(() => {
                this.$axios({
                    url: '/api/Route/api_deleteroute',
                    params: {
                        path: ids
                    }
                }).then(res => {
                    if (res && res.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                        this.getData();
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.message
                        });
                    }
                });
            }).catch(() => {});
            // this.tableData.splice(i, 1);
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
