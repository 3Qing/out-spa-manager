<template>
    <el-form
        :class="[!edit && 'mini-form']"
        size="small"
        ref="form"
        :model="form"
        label-width="80px"
        :rules="edit ? rules : {}">
        <el-form-item label="活动类型" prop="AtyType">
            <el-select v-model="form.AtyType" v-if="edit" @change="changeHandler">
                <el-option :value="1" label="面试"></el-option>
                <el-option :value="2" label="客户拜访"></el-option>
            </el-select>
            <span v-else>{{form.AtyType === 1 ? '面试' : '客户拜访'}}</span>
        </el-form-item>
        <el-form-item label="活动状态" prop="Status" v-if="form.id">
            <el-select v-model="form.Status" v-if="edit">
                <el-option v-for="item in status" :key="item.value" :value="item.value" :label="item.label"></el-option>
            </el-select>
            <span v-else>{{getContextStatus(form.Status)}}</span>
        </el-form-item>
        <el-form-item label="时间" prop="AtyDate">
            <el-date-picker
                v-if="edit"
                v-model="form.AtyDate"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm"
                format="yyyy-MM-dd HH:mm"
                default-time="10:00"></el-date-picker>
            <span v-else>{{form.AtyDate}}</span>
        </el-form-item>
        <el-form-item label="面试时长" prop="AtyMinutes">
            <el-input v-if="edit" v-model.number="form.AtyMinutes">
                <span slot="suffix">分钟</span>
            </el-input>
            <span v-else>{{form.AtyMinutes}}分钟</span>
        </el-form-item>
        <el-form-item label="营业" prop="SalesPersonID">
            <el-select v-if="edit" v-model="form.SalesPersonID">
                <el-option v-for="item in opt.sales" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <span v-else>{{getContext(form.SalesPersonID, 'sales')}}</span>
        </el-form-item>
        <el-form-item label="社员" prop="EmployeeID">
            <el-select
                v-if="edit"
                v-model="form.EmployeeID"
                filterable
                remote
                reserve-keyword
                clearable
                :remote-method="remoteMethod">
                <el-option v-for="item in opt.employees" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
            <span v-else>{{getContext(form.EmployeeID, 'employees')}}</span>
        </el-form-item>
        <el-form-item label="地点" prop="AtyLocation">
            <el-input v-if="edit" v-model="form.AtyLocation" :maxlength="50"></el-input>
            <span v-else>{{form.AtyLocation}}</span>
        </el-form-item>
        <el-form-item label="案件" prop="AtyPurpose">
            <el-input v-if="edit" v-model="form.AtyPurpose" type="textarea" :maxlength="200" :row="3"></el-input>
            <p v-else>{{form.AtyPurpose}}</p>
        </el-form-item>
        <el-form-item label="商流">
            <el-input v-if="edit" v-model="form.BusinessFlow" :maxlength="50"></el-input>
            <span v-else>{{form.BusinessFlow}}</span>
        </el-form-item>
        <el-form-item label="面试结果" v-if="form.AtyType === 1">
            <el-input v-if="edit" v-model="form.AtyResult" type="textarea" :maxlength="200" :row="3"></el-input>
            <p v-else>{{form.AtyResult}}</p>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    props: {
        data: Object,
        edit: {
            type: Boolean,
            default: false
        },
        opt: {
            type: Object,
            default: () => ({
                employees: [],
                sales: []
            })
        }
    },
    data() {
        return {
            form: {
                AtyDate: '',
                AtyWeekDay: '',
                AtyMinutes: 60,
                AtyType: 1,
                Status: '',
                AtyLocation: '',
                AtyPurpose: '',
                BusinessFlow: '',
                EmployeeID: '',
                EmployeeName: '',
                SalesPersonID: '',
                SalesPerson: '',
                AtyResult: ''
            },
            rules: {
                AtyType: [{
                    required: true, message: '请选择活动类型', trigger: 'blur'
                }],
                AtyDate: [{
                    required: true, message: '请选择时间', trigger: 'blur'
                }],
                AtyMinutes: [{
                    required: true, message: '请输入面试时长', trigger: 'blur'
                }],
                SalesPersonID: [{
                    required: true, message: '请选择营业', trigger: 'blur'
                }],
                AtyLocation: [{
                    required: true, message: '请输入地点', trigger: 'blur'
                }],
                AtyPurpose: [{
                    required: true, message: '请输入案件', trigger: 'blur'
                }],
                EmployeeID: [{
                    required: true, message: '请选择社员', trigger: 'blur'
                }]
            },
            status: [{
                label: '进行中', value: 1
            }, {
                label: '成功完成', value: 9
            }, {
                label: '失败结束', value: 7
            }, {
                label: '取消', value: 8
            }]
        };
    },
    watch: {
        data(data) {
            this.form = data;
        }
    },
    mounted() {
        if (this.data) {
            this.form = this.data;
        }
    },
    methods: {
        getContext(value, type) {
            if (this.opt[type]) {
                for (let i = 0; i < this.opt[type].length; i++) {
                    if (this.opt[type][i].id === value) {
                        return this.opt[type][i].Name;
                    }
                }
            } else {
                return '';
            }
        },
        getContextStatus(value) {
            for (let item of this.status) {
                if (item.value === value) {
                    return item.label;
                }
            }
        },
        changeHandler(val) {
            if (val === 1) {
                this.rules.EmployeeID = [{
                    required: true, message: '请选择社员', trigger: 'blur'
                }];
                this.rules.AtyMinutes = [{
                    required: true, message: '请输入面试时长', trigger: 'blur'
                }];
            } else {
                this.rules.EmployeeID = [];
                this.rules.AtyMinutes = [];
            }
        },
        remoteMethod(key) {
            this.$root.$emit('UPDATE_EMPLOYEES', key);
        }
    }
};
</script>

<style lang="less">
.el-form.mini-form {
    .el-form-item {
        margin-bottom: 8px;
        textarea {
            resize: none;
        }
    }
}
</style>
