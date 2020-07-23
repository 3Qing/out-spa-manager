<template>
    <el-card class="vendor-box">
        <div slot="header" class="card-header">
            <el-form size="small" label-width="120px" ref="form" :model="form">
                <el-form-item label="請求書番号" prop="invoiceNo">
                    <el-input v-model="form.invoiceNo"></el-input>
                </el-form-item>
                <el-form-item label="仕入先" prop="vendorID">
                    <el-select
                        v-model="form.vendorID"
                        placeholder="仕入先">
                        <el-option v-for="item in vendors" :key="item.id" :label="item.title" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="請求書タイトル" prop="invoiceTitle">
                    <el-input v-model="form.invoiceTitle"></el-input>
                </el-form-item>
                <el-form-item label="請求日" prop="invoiceDate">
                    <el-date-picker
                        size="mini"
                        placeholder="請求日"
                        v-model="form.invoiceDate"
                        value-format="yyyy-MM-dd"
                        value="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item label="支払期日" prop="planCollectDate">
                    <el-date-picker
                        size="mini"
                        placeholder="支払期日"
                        v-model="form.planCollectDate"
                        value-format="yyyy-MM-dd"
                        value="yyyy-MM-dd"></el-date-picker>
                </el-form-item>
                <el-form-item label="合計金額" prop="invoiceAmount">
                    <el-input v-model="form.invoiceAmount"></el-input>
                </el-form-item>
                <el-form-item label="備考" prop="comment">
                    <el-input type='textarea' :rows='4' v-model="form.comment"></el-input>
                </el-form-item>
            </el-form>
        </div>
        <el-button type="primary" size="mini" @click="addRow" style="margin-bottom: 10px;">請求明細選択</el-button>
        <el-table size="mini" :data="items" border>
            <el-table-column label="番号" prop="ids">
                <template slot-scope="scope">
                    <el-input v-if='!show' v-model="scope.row.ids" size="mini"></el-input>
                    <span v-else>{{scope.row.ids}}</span>
                </template>
            </el-table-column>
            <el-table-column label="受注書番号" :prop="'contractNo'" >
                <template slot-scope="scope">
                    <el-input v-if='!show' v-model="scope.row.contractNo" size="mini"></el-input>
                    <span v-else>{{scope.row.contractNo}}</span>
                </template>
            </el-table-column>
            <el-table-column label="担当者" prop="employeeID" >
                <template slot-scope="scope">
                    <el-select
                        v-model="scope.row.employeeID"
                        placeholder="担当者">
                        <el-option v-for="item in vendors" :key="item.id" :label="item.title" :value="item.id"></el-option>
                    </el-select>
                </template>
            </el-table-column>
            <el-table-column label="摘要" prop="invoiceComment" >
                <template slot-scope="scope">
                    <el-input v-model="scope.row.invoiceComment" size="mini" :maxlength="100"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="開始日" >
                <template slot-scope="scope">
                    <el-date-picker
                        size="mini"
                        placeholder="開始日"
                        v-model="scope.row.fromDate"
                        value-format="yyyy-MM-dd"
                        value="yyyy-MM-dd"></el-date-picker>
                </template>
            </el-table-column>
            <el-table-column label="終了日" >
                <template slot-scope="scope">
                    <el-date-picker
                        size="mini"
                        placeholder="終了日"
                        v-model="scope.row.toDate"
                        value-format="yyyy-MM-dd"
                        value="yyyy-MM-dd"></el-date-picker>
                </template>
            </el-table-column>
            <el-table-column label="人月" >
                <template slot-scope="scope">
                    <el-input v-model="scope.row.ningetsu" size="mini"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="支払期日" >
                <template slot-scope="scope">
                    <el-date-picker
                        size="mini"
                        placeholder="支払期日"
                        v-model="scope.row.planCollectDate"
                        value-format="yyyy-MM-dd"
                        value="yyyy-MM-dd"></el-date-picker>
                </template>
            </el-table-column>
            <el-table-column label="契約単価" >
                <template slot-scope="scope">
                    <el-input v-model="scope.row.planCollectSales" size="mini"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="精算額" >
                <template slot-scope="scope">
                    <el-input v-model="scope.row.planCollectAddSales" size="mini"></el-input>
                </template>
            </el-table-column>
            <el-table-column label="消費税" >
                <template slot-scope="scope">
                    <el-input v-model="scope.row.planCollectTax" size="mini"></el-input>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
    props: {
        show: Boolean,
        form: Object,
        items: Array,
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
        addRow() {
        }
    }
};
</script>

<style lang="less">
.vendor-box {
    box-shadow: none !important;
    .errors-tip {
        input {
            border-color: #DB414E !important;
        }
    }
}
</style>
