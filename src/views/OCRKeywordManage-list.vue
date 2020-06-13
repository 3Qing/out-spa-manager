<template>
    <main-wrapper class="ocrKey-list">
        <el-form class="main-header" slot="header" size="mini" inline>
            <el-button size="mini" type="primary" @click="addLogin(1)">新增</el-button>
        </el-form>
        <div class="table-wrapper">
            <el-table size="small" :data="tableData" border>
                <el-table-column label="キーワード" prop="keyword"></el-table-column>
                <el-table-column label="勘定コード" prop="accountID" show-overflow-tooltip>
                    <template slot-scope="scope">
                        <span>
                            {{getContent(scope.row.accountID, accountArray, 'accountArray')}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="伝票タイプ" prop="docType">
                    <template slot-scope="scope">
                        <span>
                            {{getContent(scope.row.docType, docArray, 'docArray')}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="重み" prop="weight" show-overflow-tooltip></el-table-column>
                <el-table-column label="タイプ" prop="type">
                    <template slot-scope="scope">
                        <span>
                            {{getContent(scope.row.type, typeArray, 'typeArray')}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="70px">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="编辑" placement="top-start">
                            <i class="el-icon-edit-outline oper-icon" color="warning" @click="addLogin(2, scope.row)"></i>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除" placement="top-start">
                           <i class="el-icon-delete oper-icon" color="danger" @click="deletes(scope.row)"></i>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog :visible.sync="vislble" :title="types === 1?'新增':'编辑'" @close='closeDialog'>
            <el-form size="mini" label-width="100px" :model="form" :rules="rules" ref="form">
                <el-form-item label="キーワード" prop="keyword">
                    <el-input v-model="form.keyword"></el-input>
                </el-form-item>
                <el-form-item label="勘定コード" prop="accountID">
                    <el-select size="mini" v-model="form.accountID">
                        <el-option v-for="item in accountArray" :key="item.accountID" :label="item.text" :value="item.accountID"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="伝票タイプ" prop="docType">
                    <el-select size="mini" v-model="form.docType">
                        <el-option v-for="item in docArray" :key="item.type" :label="item.text" :value="item.type"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="重み" prop="weight">
                    <el-input type='number' v-model="form.weight"></el-input>
                </el-form-item>
                <el-form-item label="タイプ" prop="type">
                    <el-select size="mini" v-model="form.type">
                        <el-option v-for="item in typeArray" :key="item.id" :label="item.text" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button type="primary" size="mini" @click="confirm">确定</el-button>
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
            types: 1,
            form: {
                keyword: '',
                accountID: '',
                docType: '',
                weight: '',
                type: ''
            },
            tableData: [],
            vislble: false,
            accountArray: [],
            docArray: [],
            typeArray: [],
            rules: {
                keyword: [{
                    required: true, message: '请输入キーワード！', trigger: 'blur'
                }],
                accountID: [{
                    required: true, message: '请选择勘定コード！', trigger: 'blur'
                }],
                docType: [{
                    required: true, message: '请选择伝票タイプ！', trigger: 'blur'
                }],
                weight: [{
                    required: true, message: '请输入重み！', trigger: 'blur'
                }],
                type: [{
                    required: true, message: '请选择タイプ！', trigger: 'blur'
                }]
            }
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getlist1();
            vm.getlist2();
            vm.getlist3();
            vm.getData();
        });
    },
    computed: {
        ...mapGetters(['IS_H5', 'TEAMS'])
    },
    methods: {
        // 获取字段函数
        getContent(id, arr , arrName) {
            if (arrName === 'accountArray') {
                for (let item of arr) {
                    if (item.accountID === id) {
                        return item.text;
                    }
                }
                return '-';
            } else if (arrName === 'docArray') {
                for (let item of arr) {
                    if (item.type === id) {
                        return item.text;
                    }
                }
                return '-';
            } else {
                for (let item of arr) {
                    if (item.type === id) {
                        return item.text;
                    }
                }
                return '-';
            }
        },
        // 获取勘定コード列表
        getlist1() {
            this.$axios({
                url: '/api/ACDoc/api_accountsforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.accountArray = res.data || [];
                    console.log('111', res.data);
                }
            });
        },
        // 获取伝票タイプ列表
        getlist2() {
            this.$axios({
                url: '/api/ACDoc/api_doctypesforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.docArray = res.data || [];
                    console.log('222', res.data);
                }
            });
        },
        // 获取タイプ列表
        getlist3() {
            this.$axios({
                url: '/api/OCRKeyword/api_ocrkeywordtypeforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.typeArray = res.data || [];
                    console.log('333', res.data);
                }
            });
        },
        getData() {
            const loading = this.$loading({ lock: true, text: '数据取得中...' });
            let url = '/api/OCRKeyword/api_getocrkeywordlist';
            this.$axios({
                url
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.tableData = res.data.data || [];
                } else {
                    this.$message({
                        type: 'error',
                        showClose: true,
                        message: res ? res.message : 'インタフェース異常、データ取得できません！'
                    });
                }
            });
        },
        closeDialog() {
            this.$refs.form.resetFields();
        },
        // 新增 编辑按钮
        addLogin(type, row) {
            this.types = type;
            if (type === 1) {
                this.form = {
                    keyword: '',
                    accountID: '',
                    docType: '',
                    weight: '',
                    type: ''
                };
            } else {
                this.form = row;
            }
            this.vislble = true;
        },
        // 删除按钮
        deletes(row) {
            this.$confirm('削除確認', '削除', {
                type: 'warning'
            }).then(() => {
                this.$axios({
                    url: '/api/OCRKeyword/api_deleteocrkeyword',
                    params: {
                        id: row.id
                    }
                }).then(res => {
                    if (res && res.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '削除完了！'
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
        },
        confirm() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    // 保存
                    let params = {
                        keyword: this.form.keyword,
                        accountID: this.form.accountID,
                        docType: this.form.docType,
                        weight: this.form.weight,
                        type: this.form.type,
                        id: 0,
                        updateTime: moment(new Date()).format('YYYY-MM-DD HH:MM:ss'),
                        companyID: 0
                    };
                    const loading = this.$loading({ lock: true, text: '正在提交数据中' });
                    const url = '/api/OCRKeyword/api_updateocrkeyword';
                    this.$axios({
                        method: 'POST',
                        url,
                        params,
                        formData: true
                    }).then( res => {
                        loading.close();
                        if (res && res.code === 0) {
                            this.vislble = false;
                            this.getData();
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.message
                            });
                        }
                    });
                }
            });
        }
    }
};
</script>

<style lang="less">
.ocrKey-list {
}
</style>
