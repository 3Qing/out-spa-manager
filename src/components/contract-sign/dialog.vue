<template>
    <el-dialog :visible.sync="visible">
        <el-form label-width="110px">
            <el-form-item label="注文名称" prop="Title">
                <el-input v-model="form.Title" size="small"></el-input>
            </el-form-item>
            <el-form-item label="内容" prop="Content">
                <el-input v-model="form.Content" size="small"></el-input>
            </el-form-item>
            <el-form-item label="作業担当" prop="empeeid">
                <el-select v-model="form['employee.ID']" size="small">
                    <el-option v-for="item in workList" :key="item.ID" :value="item.ID" :label="item.Name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="開始期間" prop="FromDate">
                <el-date-picker v-model="form.FromDate" type="date" size="small" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item label="終了期間" prop="ToDate">
                <el-date-picker v-model="form.ToDate" type="date" size="small" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item label="支払サイト" prop="paymentterm">
                <el-select v-model="form['paymentterm.ID']" size="small">
                    <el-option v-for="item in paymenttermsforselect" :key="item.ID" :value="item.ID" :label="item.Title"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="単価" prop="UnitPrice">
                <el-input v-model="form.UnitPrice" size="small"></el-input>
            </el-form-item>
            <el-form-item label="作業時間">
                <el-col :span="11">
                    <el-form-item prop="HoursFrom">
                        <el-input v-model="form.HoursFrom" size="small" @change="hoursChange" @blur="hoursChange" :class="{'errborder': erroeMsg}"></el-input>
                    </el-form-item>
                </el-col>
                <el-col class="text-center" :span="2">-</el-col>
                <el-col :span="11">
                    <el-form-item prop="HoursTo">
                        <el-input v-model="form.HoursTo" size="small" @change="hoursChange" @blur="hoursChange" :class="{'errborder': erroeMsg}"></el-input>
                    </el-form-item>
                </el-col>
                <div class="err">{{erroeMsg}}</div>
            </el-form-item>
            <el-form-item label="超過精算単価" prop="OverTimePrice">
                <el-input v-model="form.OverTimePrice" size="small"></el-input>
            </el-form-item>
            <el-form-item label="控除精算単価" prop="UnderTimePrice">
                <el-input v-model="form.UnderTimePrice" size="small"></el-input>
            </el-form-item>
            <el-form-item label="精算単位" prop="CalculateUnit">
                <el-select v-model="form.CalculateUnit" size="small">
                    <el-option v-for="item in unit" :key="item.value" :value="item.value" :label="item.label"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="営業担当" prop="salesperson">
                <el-select v-model="form['salesperson.ID']" size="small">
                    <el-option v-for="item in salespersonforselect" :key="item.ID" :value="item.ID" :label="item.Name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="顧客" prop="customer">
                <el-select v-model="form['customer.ID']" size="small">
                    <el-option v-for="item in customerList" :key="item.ID" :value="item.ID" :label="item.Title"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商流備考" prop="BusinessFlow">
                <el-input v-model="form.BusinessFlow" size="small" type="textarea"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('form')" size="small">提交</el-button>
                <el-button @click="resetForm('form')" size="small">重置</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
export default {};
</script>

<style scoped>

</style>
