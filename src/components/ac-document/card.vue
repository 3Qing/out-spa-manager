<template>
    <el-card class="ac-box">
        <div slot="header" class="card-header">
            <el-row v-if="!IS_H5">
                <el-col :span="10">
                    <span class="label">転記日</span>
                    <el-date-picker
                        size="mini"
                        placeholder="転記日"
                        v-model="form.PostingDate"
                        value-format="yyyy-MM-dd"
                        value="yyyy-MM-dd"></el-date-picker>
                </el-col>
                <el-col :span="10">
                    <span class="label">伝票タイプ</span>
                    <el-select size="mini" v-model="form['doctype.Type']">
                        <el-option v-for="item in docTypes" :key="item.Type" :label="item.Text" :value="item.Type"></el-option>
                    </el-select>
                </el-col>
            </el-row>
            <el-row v-if="IS_H5">
                <span class="label">転記日</span>
                <el-date-picker
                    size="mini"
                    placeholder="転記日"
                    v-model="form.PostingDate"
                    value-format="yyyy-MM-dd"
                    value="yyyy-MM-dd"></el-date-picker>
            </el-row>
            <el-row v-if="IS_H5" class="row-wrapper">
                <span class="label">伝票タイプ</span>
                <el-select size="mini" v-model="form['doctype.Type']">
                    <el-option v-for="item in docTypes" :key="item.Type" :label="item.Text" :value="item.Type"></el-option>
                </el-select>
            </el-row>
            <el-row class="row-wrapper">
                <el-col :span="24">
                    <span class="label">テキスト</span>
                    <el-input
                        size="mini"
                        placeholder="テキスト"
                        v-model="form.Comment"
                        :maxlength="100"></el-input>
                </el-col>
            </el-row>
        </div>
        <el-button type="primary" size="mini" @click="addRow">新增</el-button>
        <el-table size="mini" :data="items">
            <el-table-column label="借貸" prop="DRCR">
                <template slot-scope="scope">
                    <el-select
                        :class="[errors[scope.$index] && errors[scope.$index]['DRCR'] && 'errors-tip']"
                        v-model="scope.row.DRCR"
                        size="mini"
                        @change="changeHandler(scope, 'DRCR')">
                        <el-option
                            v-for="(item, i) in drcr"
                            :value="item.value"
                            :label="item.label"
                            :key="i"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="勘定コード" :prop="'account.Account'">
                <template slot-scope="scope">
                    <el-select
                        :class="[errors[scope.$index] && errors[scope.$index]['account.Account'] && 'errors-tip']"
                        @change="changeHandler(scope, 'account.Account')"
                        value-key="Account"
                        v-model="scope.row['account.Account']"
                        size="mini">
                        <el-option
                            v-for="(item, i) in acCounts"
                            :value="item"
                            :label="item.Text"
                            :key="i"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="金額" prop="Amount">
                <template slot-scope="scope">
                    <el-input
                        :class="[errors[scope.$index] && errors[scope.$index]['Amount'] && 'errors-tip']"
                        @blur="formatAmount(scope, 'Amount')"
                        v-model="scope.row.Amount"
                        size="mini"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="得意先" :prop="'customer.ID'">
                <template slot-scope="scope">
                    <el-select v-model="scope.row['customer.ID']" size="mini">
                        <el-option
                            v-for="item in customs"
                            :value="item.ID"
                            :label="item.Title"
                            :key="item.ID"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="部門" :prop="'team.TeamID'">
                <template slot-scope="scope">
                    <el-select
                        :class="[errors[scope.$index] && errors[scope.$index]['team.TeamID'] && 'errors-tip']"
                        @change="changeHandler(scope, 'team.TeamID')"
                        v-model="scope.row['team.TeamID']"
                        size="mini">
                        <el-option
                            v-for="item in teams"
                            :value="item.TeamID"
                            :label="item.TeamName"
                            :key="item.TeamID"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="従業員" :prop="'employee.ID'">
                <template slot-scope="scope">
                    <el-select
                        :class="[errors[scope.$index] && errors[scope.$index]['employee.ID'] && 'errors-tip']"
                        @change="changeHandler(scope, 'employee.ID')"
                        v-model="scope.row['employee.ID']"
                        size="mini">
                        <el-option
                            v-for="item in employees"
                            :value="item.ID"
                            :label="item.Name"
                            :key="item.ID"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="テキスト" prop="Comment">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.Comment" size="mini" :maxlength="100"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="danger" size="mini" @click="delRow(scope)">删除</el-button>
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
        errors: Object
    },
    computed: {
        ...mapGetters(['IS_H5'])
    },
    methods: {
        formatAmount(scope, field) {
            let value = String(scope.row[field]).replace(/,/g, '');
            scope.row[field] = Number(value).toLocaleString();
            this.changeHandler(scope, field);
            console.log(this.errors);
        },
        delRow(scope) {
            this.items.splice(scope.$index, 1);
        },
        addRow() {
            this.items.push({
                DRCR: '',
                'account.Account': '',
                Amount: '',
                'customer.ID': '',
                'team.TeamID': '',
                'employee.ID': '',
                Comment: ''
            });
        },
        changeHandler(scope, field) {
            if (this.errors[scope.$index] && this.errors[scope.$index][field]) {
                this.$delete(this.errors[scope.$index], field);
                if (!Object.keys(this.errors[scope.$index]).length)  {
                    this.$delete(this.errors, scope.$index);
                }
            }
        }
    }
};
</script>

<style lang="less">
.ac-box {
    .errors-tip {
        input {
            border-color: #DB414E !important;
        }
    }
}
</style>
