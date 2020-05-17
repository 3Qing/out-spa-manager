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
                    <el-select size="mini" v-model="form['DocType']">
                        <el-option v-for="item in docTypes" :key="item.type" :label="item.text" :value="item.type"></el-option>
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
                <el-select size="mini" v-model="form['DocType']">
                    <el-option v-for="item in docTypes" :key="item.type" :label="item.text" :value="item.type"></el-option>
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
            <el-table-column label="勘定コード" :prop="'AccountID'">
                <template slot-scope="scope">
                    <el-select
                        :class="[errors[scope.$index] && errors[scope.$index]['AccountID'] && 'errors-tip']"
                        @change="changeHandler(scope, 'AccountID')"
                        value-key="accountID"
                        v-model="scope.row['AccountID']"
                        size="mini">
                        <el-option
                            v-for="(item, i) in acCounts"
                            :value="item"
                            :label="item.text"
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
            <el-table-column label="得意先" :prop="'CustomerID'">
                <template slot-scope="scope">
                    <el-select v-model="scope.row['CustomerID']" size="mini">
                        <el-option
                            v-for="item in customs"
                            :value="item.id"
                            :label="item.title"
                            :key="item.id"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="仕入先">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.vendorid" size="mini">
                        <el-option
                            v-for="item in vendors"
                            :value="item.id"
                            :label="item.title"
                            :key="item.id"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="部門" :prop="'TeamID'">
                <template slot-scope="scope">
                    <el-select
                        :class="[errors[scope.$index] && errors[scope.$index]['TeamID'] && 'errors-tip']"
                        @change="changeHandler(scope, 'TeamID')"
                        v-model="scope.row['TeamID']"
                        size="mini">
                        <el-option
                            v-for="item in teams"
                            :value="item.id"
                            :label="item.teamName"
                            :key="item.id"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="従業員" :prop="'EmployeeID'">
                <template slot-scope="scope">
                    <el-select
                        :class="[errors[scope.$index] && errors[scope.$index]['EmployeeID'] && 'errors-tip']"
                        @change="changeHandler(scope, 'EmployeeID')"
                        v-model="scope.row['EmployeeID']"
                        size="mini">
                        <el-option
                            v-for="item in employees"
                            :value="item.id"
                            :label="item.name"
                            :key="item.id"></el-option>
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
        errors: Object,
        vendors: Array
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
                'AccountID': '',
                Amount: '',
                'CustomerID': '',
                'TeamID': '',
                'EmployeeID': '',
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
