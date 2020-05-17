<template>
    <el-card class="ac-box">
        <div slot="header" class="card-header">
            <el-row v-if="!IS_H5">
                <el-col :span="10">
                    <span class="label">転記日:</span>
                    <span>{{form.postingDate}}</span>
                </el-col>
                <el-col :span="10">
                    <span class="label">伝票タイプ:</span>
                    <span>{{form.docTypeText}}</span>
                </el-col>
            </el-row>
            <el-row v-if="IS_H5">
                <span class="label">転記日:</span>
                <span>{{form.postingDate}}</span>
            </el-row>
            <el-row v-if="IS_H5">
                <span class="label">伝票タイプ:</span>
                <span>{{form.docTypeText}}</span>
            </el-row>
            <el-row :class="[!IS_H5 && 'row-wrapper']">
                <el-col :span="24">
                    <span class="label">テキスト:</span>
                    <span>{{form.comment}}</span>
                </el-col>
            </el-row>
        </div>
        <el-table size="mini" :data="docitems">
            <el-table-column label="借貸" prop="drcr" width="80px">
                <template slot-scope="scope">
                    <span>{{formatContext(scope.row.drcr, 'drcr')}}</span>
                </template>
            </el-table-column>
            <el-table-column label="勘定コード" prop="accountText" width="100px">
                <template slot-scope="scope">
                    <span>{{scope.row.accountText || '-'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="金額" prop="amount" width="100px">
                <template slot-scope="scope">
                    <span>{{formatContext(scope.row['amount'], 'amount')}}</span>
                </template>
            </el-table-column>
            <el-table-column label="得意先" prop="customerTitle">
                <template slot-scope="scope">
                    <span>{{scope.row.customerTitle || '-'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="部門" prop="teamName">
                <template slot-scope="scope">
                    <span>{{scope.row.teamName ||'-' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="仕入先">
                <template slot-scope="scope">
                    <span>{{scope.row.vendorid ||'-' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="従業員" prop="employeeName">
                <template slot-scope="scope">
                    <span>{{scope.row.employeeName ||'-' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="テキスト" prop="comment">
                <template slot-scope="scope">
                    <span>{{scope.row.comment || '-'}}</span>
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
        docitems: Array,
        drcr: Array,
        docTypes: Array,
        acCounts: Array,
        teams: Array,
        employees: Array,
        customs: Array,
        vendors: Array
    },
    computed: {
        ...mapGetters(['IS_H5'])
    },
    methods: {
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
    .label {
        display: inline-block;
        width: 80px;
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
