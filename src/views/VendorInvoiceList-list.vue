<template>
    <main-wrapper class="vendor-list">
        <el-form class="main-header" slot="header" size="mini" inline>
            <el-date-picker
                class="maright"
                v-model="form.fromperiod"
                type="month"
                size="mini"
                placeholder="开始时间"
                value-format="yyyyMM"
                value="yyyyMM"
                @change="changePnSelect"
                clearable>
            </el-date-picker>
            <el-date-picker
                class="maright"
                v-model="form.toperiod"
                type="month"
                size="mini"
                placeholder="结束时间"
                value-format="yyyyMM"
                value="yyyyMM"
                @change="changePnSelect"
                clearable>
            </el-date-picker>
            <el-select v-model="form.vendorid" placeholder="取引先" size="mini" class="maright" @change="changePnSelect" clearable>
                <el-option v-for="item in vendors" :key="item.id" :value="item.id" :label="item.title"></el-option>
            </el-select>
        </el-form>
        <div class="table-wrapper">
            <el-table size="small" :data="tableData" border>
                <el-table-column label="請求書番号" prop="invoiceNo" width="125"></el-table-column>
                <el-table-column label="請求書タイトル" prop="invoiceTitle" show-overflow-tooltip></el-table-column>
                <el-table-column label="得意先" prop="customerTitle"></el-table-column>
                <el-table-column label="担当者" prop="employeeName" show-overflow-tooltip></el-table-column>
                <el-table-column label="請求額" prop="invoiceAmount" width="100">
                    <template slot-scope="scope">
                        <span>{{priceToString(scope.row.invoiceAmount)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="消費税額" prop="taxAmount" width="100">
                    <template slot-scope="scope">
                        <span>{{priceToString(scope.row.taxAmount) || 0}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="請求日" prop="invoiceDate" width="120"></el-table-column>
                <el-table-column label="支払期日" prop="planCollectDate" width="120"></el-table-column>
                <el-table-column label="ステータス" prop="status" width="140">
                    <template slot-scope="scope">
                        <span>{{getContent(scope.row.status, stausArr, 'id', 'text')}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="アクション" width="160">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" placement="top-start" v-for="item in scope.row.actions" :key="item.id" :content="item.title">
                            <i v-if="item.id==='act_downloadinvoice'" class="el-icon-edit-outline iconfont oper-icon" color="warning" @click="actionHandler(item, scope.row)"></i>
                            <i v-if="item.id==='act_displayinvoice'" class="icon-approve iconfont oper-icon" color="warning" @click="actionHandler(item, scope.row)"></i>
                            <i v-if="item.id==='act_editinvoice'" class="icon-Invoice iconfont oper-icon" color="warning" @click="actionHandler(item, scope.row)"></i>
                            <i v-if="item.id==='act_cancelinvoice'" class="icon-cancel iconfont oper-icon" color="warning" @click="actionHandler(item, scope.row)"></i>
                            <i v-if="item.id==='act_collectsales'" class="icon-cancel iconfont oper-icon" color="warning" @click="actionHandler(item, scope.row)"></i>
                        </el-tooltip>
                    </template>
                </el-table-column>

                <!-- <el-table-column label="操作" width="70px">
                    <template slot-scope="scope">
                        <el-tooltip effect="dark" content="编辑" placement="top-start">
                            <i class="el-icon-edit-outline oper-icon" color="warning" @click="addLogin(2, scope.row)"></i>
                        </el-tooltip>
                        <el-tooltip effect="dark" content="删除" placement="top-start">
                           <i class="el-icon-delete oper-icon" color="danger" @click="deletes(scope.row)"></i>
                        </el-tooltip>
                    </template>
                </el-table-column> -->
            </el-table>
            <el-pagination
                :current-page="page"
                :page-size="pageSize"
                @current-change="changePn"
                :layout="IS_H5 ? 'prev, pager, next' : 'total, prev, pager, next, jumper'"
                :total="total"></el-pagination>
        </div>
        <el-dialog :visible.sync="vislble" :title="types === 1?'新增':'编辑'" @close='closeDialog'>
            <!-- <el-form size="mini" label-width="100px" :model="form" :rules="rules" ref="form">
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
            </div> -->
        </el-dialog>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import { mapGetters } from 'vuex';
import moment from 'moment';
import { priceToString } from '@_public/utils';

export default {
    components: {
        MainWrapper
    },
    data() {
        return {
            page: 1,
            pageSize: 15,
            total: 0,
            types: 1,
            form: {
                fromperiod: '',
                toperiod: '',
                vendorid: ''
            },
            tableData: [],
            vislble: false,
            vendors: [],
            stausArr: [],
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
            vm.form.fromperiod = moment(new Date()).format('YYYYMM');
            vm.getVendors();
            vm.getStaus();
            vm.getData();
        });
    },
    computed: {
        ...mapGetters(['IS_H5', 'TEAMS'])
    },
    methods: {
        priceToString: priceToString,
        // 获取字段函数
        getContent(val, arr, key, field) {
            for (let item of arr) {
                if (item[key] === val) {
                    return item[field];
                }
            }
        },
        getVendors() {
            this.$axios({
                url: '/api/Customer/api_vendorsforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.vendors = res.data || [];
                }
            });
        },
        getStaus() {
            this.$axios({
                url: '/api/POInvoice/api_invoicestatusforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.stausArr = res.data || [];
                }
            });
        },
        getData() {
            const loading = this.$loading({ lock: true, text: '数据取得中...' });
            let url = '/api/POInvoice/api_getinvoicelist';
            this.form['page'] = this.page;
            this.form['pagesize'] = this.pageSize;
            this.$axios({
                url,
                params: this.form
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.tableData = res.data.data || [];
                    this.total = res.data.total;
                } else {
                    this.tableData = [];
                    this.total = 0;
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
        changePnSelect() {
            this.getData();
        },
        changePn(page) {
            this.page = page;
            this.getData();
        },
        actionHandler(item, row) {
            console.log(row);
            if (item.id === 'act_downloadinvoice') {
                // this.createInvoice(row);
            } else if (item.id === 'act_displayinvoice') {
                // this.$root.$emit('SHOW_ESSEDIT_DAILOG', {
                //     id: row.cfid,
                //     type: 'confirm',
                //     callback: () => {
                //         this.getList();
                //     }
                // });
            } else if (item.id === 'act_editinvoice') {
                // this.$root.$emit('SHOW_ESSEDIT_DAILOG', {
                //     id: row.cfid,
                //     type: 'cancel',
                //     callback: () => {
                //         this.getList();
                //     }
                // });
            } else if (item.id === 'act_cancelinvoice') {
                // this.curRow = { ...row };
                // this.show = true;
            } else if (item.id === 'act_collectsales') {
                // this.curRow = { ...row };
                // this.show = true;
            }
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
                        keyword: String(this.form.keyword),
                        accountID: String(this.form.accountID),
                        docType: String(this.form.docType),
                        weight: Number(this.form.weight),
                        type: this.form.type,
                        id: 0,
                        updateTime: moment(new Date()).format('YYYY-MM-DD'),
                        companyID: 0
                    };
                    const loading = this.$loading({ lock: true, text: '正在提交数据中' });
                    const url = '/api/OCRKeyword/api_updateocrkeyword';
                    this.$axios({
                        method: 'POST',
                        url,
                        params: params
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
.vendor-list {
    .maright{
        margin-right: 20px;
    }
}
</style>
