<template>
    <el-card class="ac-box">
        <div slot="header" class="card-header">
            <el-row>
                <el-col :span="10">
                    <span class="label">転記日:</span>
                    <span class="fonts">{{form.postingDate}}</span>
                </el-col>
                <el-col :span="10">
                    <span class="label">伝票タイプ:</span>
                    <span class="fonts">{{form.docType}} {{form.docTypeText}}</span>
                </el-col>
                <el-col :span="4">
                    <span class="vfonts">
                        <i class="el-icon-delete oper-icon frp" color="danger" v-if='selectFalse' @click="deletes(form)"></i>
                        <i class="el-icon-edit-outline oper-icon flp" color="warning" v-if='selectFalse' @click="toEdit()"></i>
                        <i class="el-icon-check oper-icon flp" color="success" v-if='!selectFalse' @click="beforeSubmit()"></i>
                    </span>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="10">
                    <span class="label">テキスト:</span>
                    <span class="fonts" v-if='selectFalse'>{{form.comment}}</span>
                    <el-input v-else v-model="form.comment" placeholder="テキスト" size="mini"></el-input>
                </el-col>
                <el-col :span="10">
                    <span class="label">登録者:</span>
                    <span class="fonts">{{form.ownerID}} {{form.ownerName}}</span>
                </el-col>
            </el-row>
            <!-- <el-row v-if="IS_H5">
                <span class="label">転記日:</span>
                <span class="fonts">{{form.postingDate}}</span>
            </el-row>
            <el-row v-if="IS_H5">
                <span class="label">伝票タイプ:</span>
                <span class="fonts">{{form.docType}} {{form.docTypeText}}</span>
            </el-row> -->
            <!-- <el-row :class="[!IS_H5 && 'row-wrapper']">
                <el-col :span="24">
                    <span class="label">テキスト:</span>
                    <span>{{form.comment}}</span>
                </el-col>
            </el-row> -->
        </div>
        <el-table size="mini" :data="form.items" border>
            <el-table-column label="借貸" prop="drcr" width="80px">
                <template slot-scope="scope">
                    <span>{{formatContext(scope.row.drcr, 'drcr')}}</span>
                </template>
            </el-table-column>
            <el-table-column label="勘定コード" prop="accountID" width="100px">
                <template slot-scope="scope">
                    <span>{{scope.row.text || '-'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="金額" prop="amount" width="100px">
                <template slot-scope="scope">
                    <span>{{formatContext(scope.row['amount'], 'amount')}}</span>
                </template>
            </el-table-column>
            <el-table-column label="得意先">
                <template slot-scope="scope">
                    <span >{{scope.row.abbreCustomerTitle || '-'}}</span>
                    <!-- <span v-if='scope.row.abbreCustomerTitle.length>6'>{{scope.row.customerTitle || '-'}}</span> -->
                </template>
            </el-table-column>
            <el-table-column label="部門" prop="teamName">
                <template slot-scope="scope">
                    <span>{{scope.row.teamName ||'-' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="仕入先">
                <template slot-scope="scope">
                    <span>{{scope.row.abbreVendorTitle ||'-' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="従業員" prop="employeeName">
                <template slot-scope="scope">
                    <span>{{scope.row.employeeName ||'-' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="テキスト" prop="comment">
                <template slot-scope="scope">
                    <span v-if='selectFalse'>{{scope.row.comment || '-'}}</span>
                    <el-input v-else v-model="scope.row.comment" placeholder="テキスト" size="mini"></el-input>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    props: {
        form: Object,
        items: Array,
        drcr: Array,
        docTypes: Array,
        acCounts: Array,
        teams: Array,
        employees: Array,
        customs: Array,
        vendors: Array
    },
    data() {
        return {
            selectFalse: true
        };
    },
    computed: {
        ...mapGetters(['IS_H5'])
    },
    methods: {
        deletes(row) {
            this.$confirm('是否删除', '删除', {
                type: 'warning'
            }).then(() => {
                this.$axios({
                    url: '/api/ACDoc/api_deletedocument',
                    params: {
                        docno: row.docNo
                    }
                }).then(res => {
                    if (res && res.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '删除成功'
                        });
                        this.$emit('update');
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.message
                        });
                    }
                });
            }).catch(() => {});
        },
        toEdit() {
            this.selectFalse = false;
        },
        beforeSubmit() {
            this.$confirm('是否保存', '保存', {
                type: 'success'
            }).then(() => {
                this.selectFalse = true;
                this.form.items.forEach((item) => {
                    if (item.clearDate === '') {
                        item.clearDate = '0001-01-01';
                    }
                });
                this.$axios({
                    method: 'POST',
                    url: '/api/ACDoc/api_updatedocument',
                    params: {
                        DocItems: this.form.items,
                        DocNo: this.form.docNo,
                        DocType: this.form.docType,
                        PostingDate: this.form.postingDate,
                        Comment: this.form.comment,
                        OwnerID: this.form.ownerID,
                    },
                    formData: true
                }).then(res => {
                    if (res && res.code === 0) {
                        this.$message({
                            type: 'success',
                            message: '保存成功'
                        });
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.message
                        });
                    }
                });
            }).catch(() => {});
        },
        formatContext(value, type) {
            if (type === 'doctype') {
                for (let item of this.docTypes) {
                    if (value === item.Type) {
                        return item.Text;
                    }
                }
            } else if (type === 'drcr') {
                for (let item of this.drcr) {
                    if (value === item.value) {
                        return item.label;
                    }
                }
            } else if (type === 'account') {
                for (let item of this.acCounts) {
                    if (value === item.Account) {
                        return item.Text;
                    }
                }
            } else if (type === 'customer') {
                for (let item of this.customs) {
                    if (value === item.ID) {
                        return item.Title;
                    }
                }
            } else if (type === 'team') {
                for (let item of this.teams) {
                    if (value === item.TeamID) {
                        return item.TeamName;
                    }
                }
            } else if (type === 'employee') {
                for (let item of this.employees) {
                    if (value === item.ID) {
                        return item.Name;
                    }
                }
            } else if (type === 'amount') {
                return Number(value).toLocaleString();
            }
        }
    }
};
</script>

<style lang="less">
.ac-box {
    .vfonts{
        overflow: hidden;
        i{
            font-size: 16px;
            cursor: pointer;
        }
        .flp{
            float: right;
            margin-right: 10px;
        }
        .frp{
            float: right;
        }
    }
    .label {
        display: inline-block;
        width: 80px;
        color: #606266;
        font-size: 12px;
    }
    .fonts {
        color: #606266;
        font-size: 12px;
    }
    .card-header {
        .el-input {
            width: 200px;
        }
        .row-wrapper {
            margin-top: 10px;
        }
    }
    .errors-tip {
        input {
            border-color: #DB414E !important;
        }
    }
}
</style>
