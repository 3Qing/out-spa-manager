<template>
    <el-card class="ad-box">
        <div slot="header" class="card-header">
            <el-row v-if="!IS_H5">
                <el-col :span="10">
                    <span class="label">転記日:</span>
                    <span>{{form.PostingDate}}</span>
                </el-col>
                <el-col :span="10">
                    <span class="label">伝票タイプ:</span>
                    <span>{{form.DocType_Title}}</span>
                </el-col>
            </el-row>
            <el-row v-if="IS_H5">
                <span class="label">転記日:</span>
                <span>{{form.PostingDate}}</span>
            </el-row>
            <el-row v-if="IS_H5">
                <span class="label">伝票タイプ:</span>
                <span>{{form.DocType_Title}}</span>
            </el-row>
            <el-row :class="[!IS_H5 && 'row-wrapper']">
                <el-col :span="24">
                    <span class="label">テキスト:</span>
                    <span>{{form.Comment}}</span>
                </el-col>
            </el-row>
        </div>
        <el-table size="mini" :data="items">
            <el-table-column label="借貸" prop="DRCR" width="80px">
                <template slot-scope="scope">
                    <span>{{formatContext(scope.row.DRCR, 'DRCR')}}</span>
                </template>
            </el-table-column>
            <el-table-column label="勘定コード" prop="Account_Title" width="100px">
                <template slot-scope="scope">
                    <span>{{scope.row.Account_Title || '-'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="金額" prop="Amount" width="100px">
                <template slot-scope="scope">
                    <span>{{formatContext(scope.row['Amount'], 'Amount')}}</span>
                </template>
            </el-table-column>
            <el-table-column label="得意先" prop="Customer_Title">
                <template slot-scope="scope">
                    <span>{{scope.row.Customer_Title || '-'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="部門" prop="Team_Name">
                <template slot-scope="scope">
                    <span>{{scope.row.Team_Name ||'-' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="従業員" prop="Employee_Name">
                <template slot-scope="scope">
                    <span>{{scope.row.Employee_Name ||'-' }}</span>
                </template>
            </el-table-column>
            <el-table-column label="テキスト" prop="Comment">
                <template slot-scope="scope">
                    <span>{{scope.row.Comment || '-'}}</span>
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
        customs: Array
    },
    computed: {
        ...mapGetters(['IS_H5'])
    },
    methods: {
        formatContext(value, type) {
            if (type === 'doctype') {
                for (let item of this.docTypes) {
                    if (value === item.ID) {
                        return item.Text;
                    }
                }
            } else if (type === 'DRCR') {
                for (let item of this.drcr) {
                    if (value === item.value) {
                        return item.label;
                    }
                }
            } else if (type === 'account') {
                for (let item of this.acCounts) {
                    if (value === item.ID) {
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
            } else if (type === 'Amount') {
                return Number(value).toLocaleString();
            }
        }
    }
};
</script>

<style lang="less">
.ad-box {
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
