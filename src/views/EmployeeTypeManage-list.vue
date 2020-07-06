<template>
    <main-wrapper class="finReport-list">
        <el-form class="main-header" slot="header" size="mini" inline>
            <el-form-item>
                <el-button size="mini" type="primary" @click="toEdit('new')">新增</el-button>
            </el-form-item>
        </el-form>
        <div class="table-wrapper sosd">
            <el-table size="small" :data="tableData" border>
                <el-table-column label="就職タイプ" prop="title">
                    <template slot-scope="scope">
                        <!-- <el-input v-model="scope.row.title" :maxlength='50'></el-input> -->
                        <span>{{scope.row.title}}</span>
                    </template> 
                </el-table-column>
                <el-table-column label="職能給支給" prop="projectSalary">
                    <template slot-scope="scope">
                        <el-checkbox :disabled=true v-model="scope.row.projectSalary"></el-checkbox>
                    </template> 
                </el-table-column>
                <el-table-column label="基本給支給" prop="baseSalary">
                    <template slot-scope="scope">
                        <el-checkbox :disabled=true v-model="scope.row.baseSalary"></el-checkbox>
                    </template> 
                </el-table-column>
                <el-table-column label="交通代支給" prop="incomeTax" >
                    <template slot-scope="scope">
                        <el-checkbox :disabled=true v-model="scope.row.incomeTax"></el-checkbox>
                    </template> 
                </el-table-column>
                <el-table-column label="健康保険加入" prop="healthInsurance">
                    <template slot-scope="scope">
                        <el-checkbox :disabled=true v-model="scope.row.healthInsurance"></el-checkbox>
                    </template> 
                </el-table-column>
                <el-table-column label="厚生年金加入" prop="endowInsurance">
                    <template slot-scope="scope">
                        <el-checkbox :disabled=true v-model="scope.row.endowInsurance"></el-checkbox>
                    </template> 
                </el-table-column>
                <el-table-column label="雇用保険加入" prop="hireInsurance">
                    <template slot-scope="scope">
                        <el-checkbox :disabled=true v-model="scope.row.hireInsurance"></el-checkbox>
                    </template> 
                </el-table-column>
                <el-table-column label="所属タイプ" prop="type">
                    <template slot-scope="scope">
                        <!-- <el-checkbox :disabled=true v-model="scope.row.type"></el-checkbox> -->
                        <span>{{getContent(scope.row.type, candidates, 'id', 'text')}}</span>
                    </template> 
                </el-table-column>
                <el-table-column label="アクション" prop="title" show-overflow-tooltip width="100px">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="编辑" placement="top-start">
                            <i class="el-icon-edit-outline oper-icon" color="warning" @click="toEdit('edit', scope.row)"></i>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除" placement="top-start">
                            <i class="el-icon-delete oper-icon" color="danger" @click="deletes(scope.row.id)"></i>
                        </el-tooltip>
                    </template> 
                </el-table-column>
            </el-table>
        </div>
        <el-dialog :title="news==='new'?'新增':'编辑'" :visible.sync="visible" @close="close" class="blackColor sop">
            <el-form ref="form" :model="form" :rules="rules" size="mini" label-width="120px">
                <el-form-item label="就職タイプ" prop="title">
                    <el-input v-model="form.title" :maxlength='50'></el-input>
                </el-form-item>
                <el-form-item label="所属タイプ" prop="type">
                    <el-select v-model="form.type">
                        <el-option v-for="item in candidates" :key="item.id" :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="職能給支給" prop="projectSalary">
                    <el-checkbox v-model="form.projectSalary"></el-checkbox>
                </el-form-item>
                <el-form-item label="基本給支給" prop="baseSalary">
                    <el-checkbox v-model="form.baseSalary"></el-checkbox>
                </el-form-item>
                <el-form-item label="交通代支給" prop="incomeTax">
                    <el-checkbox v-model="form.incomeTax"></el-checkbox>
                </el-form-item>
                <el-form-item label="健康保険加入" prop="healthInsurance">
                    <el-checkbox v-model="form.healthInsurance"></el-checkbox>
                </el-form-item>
                <el-form-item label="厚生年金加入" prop="endowInsurance">
                    <el-checkbox v-model="form.endowInsurance"></el-checkbox>
                </el-form-item>
                <el-form-item label="雇用保険加入" prop="hireInsurance">
                    <el-checkbox v-model="form.hireInsurance"></el-checkbox>
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
                title: '',
                projectSalary: '',
                baseSalary: '',
                incomeTax: '',
                healthInsurance: '',
                endowInsurance: '',
                hireInsurance: '',
                type: ''
            },
            candidates: [],
            rules: {
                title: [{
                    required: true, message: '请输入就職タイプ', trigger: 'blur'
                }]
                // projectSalary: [{
                //     required: true, message: '请选择職能給支給', trigger: 'blur'
                // }],
                // baseSalary: [{
                //     required: true, message: '请选择基本給支給', trigger: 'blur'
                // }],
                // incomeTax: [{
                //     required: true, message: '交通代支給', trigger: 'blur'
                // }],
                // healthInsurance: [{
                //     required: true, message: '健康保険加入', trigger: 'blur'
                // }],
                // endowInsurance: [{
                //     required: true, message: '厚生年金加入', trigger: 'blur'
                // }],
                // hireInsurance: [{
                //     required: true, message: '雇用保険加入', trigger: 'blur'
                // }],
                // type: [{
                //     required: true, message: '所属タイプ', trigger: 'blur'
                // }]
            }
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.handleChange();
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
                    title: '',
                    projectSalary: false,
                    baseSalary: false,
                    incomeTax: false,
                    healthInsurance: false,
                    endowInsurance: false,
                    hireInsurance: false,
                    type: '',
                    id: 0
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
            if (this.form.type === '') {
                this.form.type = 0;
            }
            const loading = this.$loading({ lock: true, text: '正在提交资料中...' });
            this.$axios({
                method: 'POST',
                url: '/api/Employee/api_updateemployeetype',
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
        handleChange() {
            let url = '/api/Candidate/api_candidatetypeforselect';
            this.$axios({
                url
            }).then(res => {
                if (res && res.code === 0) {
                    this.candidates = res.data || [];
                    console.log(this.candidates);
                }
            });
        },
        getData() {
            const loading = this.$loading({ lock: true, text: '数据取得中...' });
            let url = '/api/Employee/api_getemployeetypelist';
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
                    url: '/api/Employee/api_deleteemployeetype',
                    params: {
                        id: ids
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
