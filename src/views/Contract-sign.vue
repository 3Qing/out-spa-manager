<template>
    <main-wrapper class="contract-sign">
        <div slot="header" class="main-header">
            <el-button v-if="!isDisplay" type="primary" @click="submitForm('forms')" size="small">确认</el-button>
            <el-button v-if="btnfalse" type="primary" @click="submitSave" size="small">保存</el-button>
            <el-button v-if="!isDisplay&&!$route.params.id" @click="resetForm('forms')" size="small" type="danger">重置</el-button>
            <el-button v-if="$route.params.id" size="small" @click="$router.back()">返回</el-button>
            <el-button v-if="isDisplay&&!$route.params.id" size="small" @click="fanhuis">返回</el-button>
        </div>
        <div class="content">
            <el-row v-if="!isDisplay">
                <el-col :span="12">
                    <el-form ref="forms" :model="forms" label-width="110px" :rules="isDisplay ? {} : rules" label-suffix=":">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="注文タイプ">
                                    <el-select v-model="forms['contractCategory']" size="small" @change="changeCustomer">
                                        <el-option v-for="item in selectList" :key="item.id" :value="item.id" :label="item.text"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-form-item label="注文名称" prop="title">
                            <!-- <p v-if="isDisplay">{{form.title || '-'}}</p> -->
                            <el-input v-model="forms.title" size="small"></el-input>
                        </el-form-item>
                        <el-form-item label="注文内容" prop="content">
                            <!-- <p v-if="isDisplay">{{form.content || '-'}}</p> -->
                            <el-input v-model="forms.content" size="small"></el-input>
                        </el-form-item>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="契約期間" prop="fromDate">
                                    <!-- <p v-if="isDisplay">{{form.fromDate}}</p> -->
                                    <el-date-picker placeholder="开始时间" v-model="forms.fromDate" type="date" size="small" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="" prop="toDate">
                                    <!-- <p v-if="isDisplay">{{form.toDate}}</p> -->
                                    <el-date-picker placeholder="结束时间" v-model="forms.toDate" type="date" size="small" value-format="yyyy-MM-dd" format="yyyy-MM-dd"></el-date-picker>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="作業時間範囲">
                                    <!-- <p v-if="isDisplay">{{form.hoursFrom}}~{{form.hoursTo}}</p> -->
                                    <el-input placeholder="开始时间" v-model="forms.hoursFrom" size="small" @change="hoursChange" @blur="hoursChange" :class="{'errborder': erroeMsg}"></el-input>
                                    <div class="err">{{erroeMsg}}</div>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12" v-if="!isDisplay">
                                <el-form-item label="">
                                    <el-input placeholder="结束时间" v-model="forms.hoursTo" size="small" @change="hoursChange" @blur="hoursChange" :class="{'errborder': erroeMsg}"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="得意先" prop="customerID">
                                    <p v-if='$route.params.id'>{{getContent(forms['customerID'], customerList, 'id', 'title')}}</p>
                                    <el-select v-else v-model="forms['customerID']" size="small" @change="changeCustomer">
                                        <el-option v-for="item in customerList" :key="item.id" :value="item.id" :label="item.title"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="支払サイト" prop="paymentTermID">
                                    <!-- <p v-if="isDisplay">{{form['paymenttermId']}}</p> -->
                                    <el-select v-model="forms['paymentTermID']" size="small">
                                        <el-option v-for="item in paymenttermsforselect" :key="item.id" :value="item.id" :label="item.title"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <!-- <el-col :span="12">
                                <el-form-item label="単価" prop="unitPrice">
                                    <el-input v-model="form.unitPrice" size="small" @input="handlePrice" @blur="calculateOverTimePrice"></el-input>
                                </el-form-item>
                            </el-col> -->
                            <el-col :span="12">
                                <el-form-item label="精算単位" prop="calculateUnit">
                                    <el-select v-model="forms.calculateUnit" size="small">
                                        <el-option v-for="item in unit" :key="item.value" :value="item.value" :label="item.label"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="営業担当" prop="salesPersonID">
                                    <el-select v-model="forms['salesPersonID']" size="small">
                                        <el-option v-for="item in salespersonforselect" :key="item.id" :value="item.id" :label="item.name"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <!-- <el-row>
                            <el-col :span="12">
                                <el-form-item label="超過精算単価" prop="overTimePrice">
                                    <el-input v-model="form.overTimePrice" size="small"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="控除精算単価" prop="underTimePrice">
                                    <el-input v-model="form.underTimePrice" size="small"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row> -->
                        <el-row>
                            <!-- <el-col :span="12">
                                <el-form-item label="作業担当" prop="employeeId">
                                    <p v-if='$route.params.id'>{{getContent(form['employeeId'], workList, 'id', 'name')}}</p>
                                    <el-select
                                        v-else
                                        v-model="form['employeeId']"
                                        filterable
                                        remote
                                        reserve-keyword
                                        :remote-method="remoteMethod"
                                        :loading="loading"
                                        size="small">
                                        <el-option v-for="item in workList" :key="item.id" :value="item.id" :label="item.name"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-col> -->
                        </el-row>
                        <el-form-item label="商流備考" prop="businessFlow">
                            <!-- <p v-if="isDisplay">{{form.businessFlow}}</p> -->
                            <el-input v-model="forms.businessFlow" size="small" type="textarea"></el-input>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-table size="small" :data="tableData">
                    <el-table-column label="番号" width="100px">
                        <template slot-scope="scope">
                            <span>{{scope.$index + 1}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="担当者" width="200px">
                        <template slot-scope="scope">
                            <el-select v-if="scope.row.isFalse === true" v-model="scope.row.employeeID" size="mini">
                                <el-option v-for="item in workList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                            </el-select>
                            <span v-else>{{getContent(scope.row.employeeID, workList, 'id', 'name')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="単価" width="160px">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.unitPrice" size="mini" @input="handlePrice" @blur="calculateOverTimePrice"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="人月" width="140px">
                        <template slot-scope="scope">
                            <el-input-number v-model.number="scope.row.ningetsu" size="mini" :precision="2" :step="0.1" :max="1" :min="0" @change="handleChange(scope.row, scope.$index)"></el-input-number>
                        </template>
                    </el-table-column>
                    <el-table-column label="価格" width="100px">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.contractPrice" size="mini"></el-input>
                            <!-- <span>{{priceToString(priceToNumber(scope.row.contractPrice))}}</span> -->
                        </template>
                    </el-table-column>
                    <el-table-column label="超過精算単価">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.overTimePrice" size="mini"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="控除精算単価">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.underTimePrice" size="mini"></el-input>
                        </template>
                    </el-table-column>
                    <el-table-column label="アクション" width="80px">
                        <template slot-scope="scope">
                            <i class="el-icon-plus link" color="primary" @click="handleAdd(scope)"></i>
                            <i class="el-icon-delete link" color="danger" @click="handleDel(scope)"></i>
                        </template>
                    </el-table-column>
                </el-table>
                <el-col :span="12" v-if="isDisplay">
                    <div class="top"></div>
                </el-col>
            </el-row>
            <div class="bottom" v-if="isDisplay">
                <ul>
                    <li>
                        <span>注文名称</span>
                        <span :title='forms.title'>{{forms.title}}</span>
                    </li>
                    <li>
                        <span>注文タイプ</span>
                        <span>{{getContent(forms.contractCategory, selectList, 'id', 'text')}}</span>
                    </li>
                    <li>
                        <span>注文内容</span>
                        <span :title='forms.content'>{{forms.content}}</span>
                    </li>
                    <li>
                        <span>契約期間</span>
                        <span>{{formatTime(forms.fromDate)}}~{{formatTime(forms.toDate)}}</span>
                    </li>
                    <li>
                        <span>作業時間範囲</span>
                        <span>{{forms.hoursFrom}}~{{forms.hoursTo}}</span>
                    </li>
                    <li>
                        <span>得意先</span>
                        <span :title="getContent(forms.customerID, customerList, 'id', 'title')">{{getContent(forms.customerID, customerList, 'id', 'title')}}</span>
                    </li>
                    <li>
                        <span>支払サイト</span>
                        <span>{{getContent(forms.paymentTermID, paymenttermsforselect, 'id', 'title')}}</span>
                    </li>
                    <li>
                        <span>精算単位</span>
                        <span>{{getContent(forms.calculateUnit, unit, 'value', 'label')}}</span>
                    </li>
                    <!-- <li>
                        <span>単価</span>
                        <span>{{forms.unitPrice}}</span>
                    </li>
                    <li>
                        <span>超過精算単価</span>
                        <span>{{forms.overTimePrice}}</span>
                    </li>
                    <li>
                        <span>控除精算単価</span>
                        <span>{{forms.underTimePrice}}</span>
                    </li>
                    <li>
                        <span>作業担当</span>
                        <span>{{getContent(forms.employeeId, workList, 'id', 'name')}}</span>
                    </li> -->
                    <li class="lis">
                        <span>営業担当</span>
                        <span>{{getContent(forms.salesPersonID, salespersonforselect, 'id', 'name')}}</span>
                    </li>
                    <li>
                        <span>商流備考</span>
                        <span>{{forms.businessFlow}}</span>
                    </li>
                </ul>
                <!-- <el-table size="small" :data="forms" border>
                    <el-table-column label="注文名称" prop="title" width="100px"></el-table-column>
                    <el-table-column label="注文内容" prop="content" width="100px"></el-table-column>
                    <el-table-column label="契約期間">
                         <template slot-scope="scope">
                            <span>{{formatTime(scope.row.fromDate)}}</span>~
                            <span>{{formatTime(scope.row.toDate)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="作業時間範囲">
                        <template slot-scope="scope">
                            <span>{{scope.row.hoursFrom}}</span>~
                            <span>{{scope.row.hoursTo}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="得意先">
                        <template slot-scope="scope">
                            <span>{{getContent(scope.row.customerId, customerList, 'id', 'title')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="支払サイト">
                        <template slot-scope="scope">
                            <span>{{scope.row.paymenttermId}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="単価" prop="unitPrice"></el-table-column>
                    <el-table-column label="精算単位">
                        <template slot-scope="scope">
                            <span>{{getContent(scope.row.calculateUnit, unit, 'value', 'label')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="超過精算単価" prop="overTimePrice"></el-table-column>
                    <el-table-column label="控除精算単価" prop="underTimePrice"></el-table-column>
                    <el-table-column label="作業担当">
                        <template slot-scope="scope">
                            <span>{{getContent(scope.row.employeeId, workList, 'id', 'name')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="営業担当" prop="salespersonId"></el-table-column>
                    <el-table-column label="商流備考" prop="businessFlow"></el-table-column>
                </el-table> -->
            </div>
            <div class="bottom" v-if="isDisplay">
                <el-table size="small" :data="tableData" border>
                    <el-table-column type="expand">
                        <template slot-scope="props">
                            <div v-for="(item, index) in props.row.cashflows" :key='index'>
                                <el-form label-position="left" inline class="demo-table">
                                    <el-form-item label="开始日:">
                                        <span class="lop">{{ formatTime(item.fromDate) }}</span>
                                    </el-form-item>
                                    <el-form-item label="结束日:">
                                        <span class="lop">{{ formatTime(item.toDate) }}</span>
                                    </el-form-item>
                                    <el-form-item label="人月:">
                                        <el-input-number v-if="btnfalse" v-model.number="item.ningetsu" size="mini" :precision="2" :step="0.1" :max="1" :min="0" @change="sumPrice(props.row)"></el-input-number>
                                        <span v-else class="lop">{{ (item.ningetsu / 100).toFixed(2) }}</span>
                                    </el-form-item>
                                    <el-form-item label="金额:">
                                        <el-input v-if="btnfalse" v-model="item.contractSales" size="mini"></el-input>
                                        <span v-else class="lop">{{ item.contractSales }}</span>
                                    </el-form-item>
                                    <el-form-item label="支付日:">
                                        <span class="lop">{{ formatTime(item.planCollectDate) }}</span>
                                    </el-form-item>
                                </el-form>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="作業担当" prop="employeeName" width="150px">
                        <template slot-scope="scope">
                            <span>{{getContent(scope.row.employeeID, workList, 'id', 'name')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="単価" prop="unitPrice">
                        <template slot-scope="scope">
                            <span>{{scope.row.unitPrice}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="超過計算単価" prop="overTimePrice"></el-table-column>
                    <el-table-column label="控除精算単価" prop="underTimePrice"></el-table-column>
                    <!-- <el-table-column label="actualMinutes" prop="actualMinutes"></el-table-column>
                    <el-table-column label="planCollectSales" prop="planCollectSales">
                        <template slot-scope="scope">
                            <span>{{priceToString(scope.row.planCollectSales)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="planCollectAddSales" prop="planCollectAddSales">
                        <template slot-scope="scope">
                            <span>{{priceToString(scope.row.planCollectAddSales)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="planCollectTax" prop="planCollectTax">
                        <template slot-scope="scope">
                            <span>{{priceToString(scope.row.planCollectTax)}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="invoiceNo" prop="invoiceNo"></el-table-column> -->
                </el-table>
            </div>
        </div>
        <el-dialog :visible.sync="dialogPresonMonth">
            <el-table :data="personMonthArr" border size="small" v-loading="dialogLoading">
                <el-table-column label="期间" width="220">
                    <template slot-scope="scope">
                        {{formatTime(scope.row.fromdate)}}
                        ~
                        {{formatTime(scope.row.todate)}}
                    </template>
                </el-table-column>
                <el-table-column property="contractworkdays" label="合同工作日数" width="110"></el-table-column>
                <el-table-column property="calendarworkdays" label="日历工作日数" width="110"></el-table-column>
                <el-table-column label="人月">
                    <template slot-scope="scope">
                        <el-input size="mini" @blur="formatNingetsu(scope)" v-model="scope.row.ningetsu"></el-input>
                    </template>
                </el-table-column>
            </el-table>
            <el-form class="preview-form" size="mini" label-width="110px" label-suffix=":" v-if="$route.params.id">
                <el-form-item label="注文名称">
                    <span>{{forms.title}}</span>
                </el-form-item>
                <el-form-item label="内容">
                    <span>{{forms.content}}</span>
                </el-form-item>
                <el-form-item label="作業担当">
                    <span>{{getContent(forms['employeeId'], workList, 'id', 'name')}}</span>
                </el-form-item>
                <el-form-item label="開始期間">
                    <span>{{forms.fromDate}}</span>
                </el-form-item>
                <el-form-item label="終了期間">
                    <span>{{forms.toDate}}</span>
                </el-form-item>
                <el-form-item label="支払サイト">
                    <span>{{formatLabel(forms['paymenttermId'], 'payment')}}</span>
                </el-form-item>
                <el-form-item label="単価">
                    <span>{{forms.unitPrice}}</span>
                </el-form-item>
                <el-form-item label="作業時間">
                    <span>{{forms.hoursFrom}}</span>
                    <span>-</span>
                    <span>{{forms.hoursTo}}</span>
                </el-form-item>
                <el-form-item label="超過精算単価">
                    <span>{{forms.overTimePrice}}</span>
                </el-form-item>
                <el-form-item label="控除精算単価">
                    <span>{{forms.underTimePrice}}</span>
                </el-form-item>
                <el-form-item label="精算単位">
                    <span>{{getContent(forms.calculateUnit, unit, 'value', 'label')}}</span>
                </el-form-item>
                <el-form-item label="営業担当">
                    <span>{{formatLabel(forms['salespersonId'], 'sales')}}</span>
                </el-form-item>
                <el-form-item label="顧客">
                    <span>{{getContent(forms['customerId'], customerList, 'id', 'title')}}</span>
                </el-form-item>
                <el-form-item label="商流備考">
                    <span>{{forms.businessFlow}}</span>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="small" type="primary" @click="confirmDialog" :disabled="dialogLoading">确定</el-button>
            </div>
        </el-dialog>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import { formatTime, priceToString, priceToNumber } from '@_public/utils';
import moment from 'moment';
export default {
    components: {
        MainWrapper
    },
    data() {
        return {
            loading: false,
            forms: {
                calculateUnit: '',
                contractCategory: 0,
                title: '',
                content: '',
                fromDate: this.nextMonthFirstDay(),
                toDate: this.nextMonthLastDay(),
                hoursFrom: 140,
                hoursTo: 180,
                customerID: '',
                paymentTermID: '',
                salesPersonID: '',
                businessFlow: ''
            },
            form: {
                contractCategory: 0,
                title: '',
                content: '',
                'employeeId': '',
                fromDate: this.nextMonthFirstDay(),
                toDate: this.nextMonthLastDay(),
                'paymenttermId': '',
                unitPrice: '',
                hoursFrom: 140,
                hoursTo: 180,
                overTimePrice: '',
                underTimePrice: '',
                calculateUnit: '',
                'salespersonId': '',
                'customerId': '',
                businessFlow: '',
                ningetsu: ''
            },
            unit: [
                {
                    value: 1,
                    label: '60分'
                },
                {
                    value: 2,
                    label: '30分'
                },
                {
                    value: 3,
                    label: '15分'
                }
            ],
            rules: {
                title: [
                    { required: true, message: '请输入注文名称', trigger: 'blur' }
                ],
                // content: [
                //     { required: true, message: '请输入内容', trigger: 'blur' }
                // ],
                // fromDate: [
                //     { required: true, validator: this.validFromDate, trigger: 'blur' }
                // ],
                // toDate: [
                //     { required: true, validator: this.validToDate, trigger: 'blur' }
                // ],
                unitPrice: [
                    { required: true, message: '请输入単価', trigger: 'blur' }
                ],
                overTimePrice: [
                    { required: true, message: '请输入超過精算単価', trigger: 'blur' }
                ],
                underTimePrice: [
                    { required: true, message: '请输入控除精算単価', trigger: 'blur' }
                ],
                calculateUnit: [
                    { required: true, message: '请选择精算単位', trigger: 'blur' }
                ],
                employeeID: [
                    { required: true, message: '请选择作業担当', trigger: 'blur' }
                ],
                salespersonId: [
                    { required: true, message: '请选择営業担当', trigger: 'blur' }
                ],
                customerId: [
                    { required: true, message: '请选择得意先', trigger: 'blur' }
                ],
                paymenttermId: [
                    { required: true, message: '请选择支払サイト', trigger: 'blur' }
                ],
            },
            tableData: [{
                isFalse: true,
                employeeID: '',
                unitPrice: '',
                ningetsu: 0,
                contractPrice: '',
                overTimePrice: '',
                underTimePrice: ''
            }],
            workList: [],
            customerList: [],
            paymenttermsforselect: [],
            salespersonforselect: [],
            erroeMsg: '',
            dialogPresonMonth: false,
            personMonthArr: [],
            dialogLoading: false,
            isDisplay: false,
            cashflows: [],
            nextMonth1: '',
            nextMonth2: '',
            selectList: [],
            btnfalse: false
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (to.query.display) {
                vm.isDisplay = true;
            }
            vm.getContracts(); // 下拉列表
            vm.getWorkList(); // 员工列表
            vm.getCustomerList(); // 客户列表
            vm.getPaymenttermsforselect(); // 支付条件清单
            vm.getSalespersonforselect(); // 销售人员
            if (to.params.id) {
                vm.getData(vm.isDisplay);
            }
            // /api/Contract/api_getcontractfordisplay
        });
    },
    watch: {
        tableData:{
            handler:function(newVal) {
                console.log(newVal);
            },
            deep: true
        }
    },
    methods: {
        formatTime: formatTime,
        priceToString: priceToString,
        priceToNumber: priceToNumber,
        // validFromDate(rule, value, callback) {
        //     const toDate = new Date(this.form.toDate).getTime() || -1;
        //     if (value) {
        //         if (toDate > 0) {
        //             if (new Date(value).getTime() > toDate) {
        //                 callback(new Error('开始时间不得大于结束时间'));
        //             } else {
        //                 callback();
        //             }
        //         } else {
        //             callback();
        //         }
        //     } else {
        //         callback(new Error('请选择开始时间'));
        //     }
        // },
        // validToDate(rule, value, callback) {
        //     const fromDate = new Date(this.form.fromDate).getTime() || -1;
        //     if (value) {
        //         if (fromDate > 0) {
        //             if (new Date(value).getTime() < fromDate) {
        //                 callback(new Error('结束时间不得小于开始时间'));
        //             } else {
        //                 callback();
        //             }
        //         } else {
        //             callback();
        //         }
        //     } else {
        //         callback(new Error('请选择结束时间'));
        //     }
        // },
        // 下个月的第一天
        nextMonthFirstDay() {
            var time = new Date();
            var year = time.getFullYear();
            var month = time.getMonth() + 2;
            if (month > 12) {
                month = month - 12;
                year = year + 1;
            }
            var day = 1;
            return year + '-' + month + '-' + day;
        },
        // 下个月的最后一天
        nextMonthLastDay() {
            var time = new Date();
            var year = time.getFullYear();
            var month = time.getMonth() + 2;
            if (month > 12) {
                month = month - 12;
                year = year + 1;
            }
            var day = this.nextMonthDay(year, month);
            return year + '-' + month + '-' + day;
        },
        nextMonthDay(year, month) {//判断每月多少天
            var day31 = [1, 3, 5, 7, 8, 10, 12];
            var day30 = [4, 6, 9, 11];
            if (day31.indexOf(month) > -1) {
                return 31;
            } else if (day30.indexOf(month) > -1) {
                return 30;
            } else {
                if (this.isLeapYear(year)) {
                    return 29;
                } else {
                    return 28;
                }
            }
        },
        isLeapYear(year) {//判断是否为闰年
            return (year % 4 == 0) && (year % 100 != 0 || year % 400 == 0);
        },
        // 作业时间校验
        hoursChange(val, old) {
            const reg = /^\d+$|^\d+[.]?\d+$/;
            if (val !== old) {
                if (!this.form.hoursFrom || !this.form.hoursTo) {
                    this.erroeMsg = '请输入完整作業時間';
                } else if (!reg.test(this.form.hoursFrom) || !reg.test(this.form.hoursTo)) {
                    this.erroeMsg = '请输入数字';
                } else if (parseInt(this.form.hoursFrom) > parseInt(this.form.hoursTo)) {
                    this.erroeMsg = '结束作業時間需大于开始作業時間';
                } else {
                    this.erroeMsg = '';
                    this.calculateOverTimePrice();
                }
            }
        },
        // 返回页面
        fanhuis() {
            this.isDisplay = false;
            this.btnfalse = false;
        },
        // 人月
        sumPrice(sums) {
            sums.contractSales = parseInt(Number(sums.ningetsu) * Number(sums.unitPrice));
            console.log(sums);
        },
        handleChange(sums, ids) {
            let arr = this.tableData;
            arr.forEach((item, index) => {
                if (ids === index) {
                    item.contractSales = parseInt(Number(item.ningetsu) * Number(item.unitPrice));
                }
            });
            this.tableData = arr;
            console.log(this.tableData);
        },
        getContracts() {
            this.$axios({
                url: '/api/SOContract/api_contractcategoryforselect',
            }).then(res => {
                this.selectList = res.data || [];
            });
        },
        // 添加
        handleAdd(scope) {
            console.log(scope);
            // const tmp = [ ...this.tableData ];
            // tmp.splice(scope.$index + 1, 0, {});
            // this.tableData = [ ...tmp ];
            this.tableData.push({
                isFalse: true,
                employeeID: '',
                unitPrice: '',
                ningetsu: 0,
                contractPrice: '',
                overTimePrice: '',
                underTimePrice: ''
            });
            // if (this.$route.params.updates) {
            //     this.tableData.forEach((item, index) => {
            //         if(scope.$index === index) {
            //             item.isFalse = true;
            //         }
            //     });
            // }
        },
        // 删除
        handleDel(scope) {
            const tmp = [ ...this.tableData ];
            tmp.splice(scope.$index, 1);
            this.tableData = [ ...tmp ];
        },
        getData(type) {
            const loading = this.$loading({ lock: true, text: '正在获取合同资料中...' });
            let url = '/api/SOContract/api_getcontractforupdate';
            if (type) {
                url = '/api/SOContract/api_getcontractfordisplay';
            }
            this.$axios({
                url,
                params: {
                    id: this.$route.params.id
                },
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    const data = res.data || {};
                    const form = {
                        title: data.title || '',
                        content: data.content || '',
                        'employeeId': (data.employee && data.employee.id) || '',
                        fromDate: formatTime(data.fromDate || ''),
                        toDate: formatTime(data.toDate || ''),
                        'paymenttermId': (data.paymentterm && data.paymentterm.id) || '',
                        unitPrice: priceToString(data.unitPrice || ''),
                        hoursFrom: data.hoursFrom || '',
                        hoursTo: data.hoursTo || '',
                        overTimePrice: data.overTimePrice || '',
                        underTimePrice: data.underTimePrice || '',
                        calculateUnit: data.calculateUnit || '',
                        'salespersonId': (data.salesperson && data.salesperson.id) || '',
                        'customerId': (data.customer && data.customer.id) || '',
                        businessFlow: data.businessFlow || ''
                    };
                    if (type) {
                        form['employeeId'] = data.employeeID;
                        form['paymenttermId'] = data.paymentTerm;
                        form['salespersonId'] = data.salesPerson;
                        form['customerId'] = data.customerID;
                    }
                    if (data.cashflows) {
                        if(data.cashflows.length > 0) {
                            let nuing = (data.cashflows[0].ningetsu / 100).toFixed(2);
                            data.cashflows[0].ningetsu = nuing;
                            this.cashflows = data.cashflows;
                        } else {
                            this.cashflows = [];
                        }
                    }
                    data.contractCategory = 0;
                    this.forms = data;
                    this.tableData = data.contractitems || [];
                    if (this.$route.params.updates) {
                        this.tableData.forEach((item) => {
                            item.isFalse = false;
                        });
                    } else {
                        this.tableData.forEach((item) => {
                            item.isFalse = true;
                        });
                    }
                } else {
                    this.$message({
                        type: 'error',
                        showClose: true,
                        message: res.message ? res.message : '接口开小差了，没有返回'
                    });
                }
            });
        },
        getWorkList(keyword = '') {
            this.loading = true;
            this.$axios({
                url: '/api/Employee/api_employeesforselect',
                params: {
                    keyword
                }
            }).then(res => {
                this.loading = false;
                if (res) {
                    this.workList = res.data || [];
                }
            });
        },
        remoteMethod(keyword) {
            this.getWorkList(keyword);
        },
        getCustomerList() {
            this.$axios({
                url: '/api/Customer/api_customersforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.customerList = res.data || [];
                }
            });
        },
        getPaymenttermsforselect() {
            this.$axios({
                url: '/api/PaymentTerm/api_paymenttermsforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.paymenttermsforselect = res.data || [];
                }
            });
        },
        getSalespersonforselect() {
            this.$axios({
                url: '/api/Employee/api_salespersonforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.salespersonforselect = res.data || [];
                }
            });
        },
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid && !this.erroeMsg) {
                    this.isDisplay = true;
                    this.btnfalse = true;
                    this.postSavePanle();
                    // if (this.$route.params.id) {
                    //     // 保存面板
                    // }
                    // if (this.$route.params.id) {
                    //     this.getPersonMonth();
                    // } else {
                    //     if (this.completeMonth()) {
                    //         this.getPersonMonth();
                    //     } else {
                    //         this.submit();
                    //     }
                    // }
                } else {
                    this.$message.warning('请正确输入表单数据');
                    return false;
                }
            });
        },
        // 修改保存
        submitSave() {
            let url = '/api/SOContract/api_createcontract';
            if (this.$route.params.id) {
                url = '/api/SOContract/api_updatecontract';
            }
            const loading = this.$loading({ lock: true, text: '正在提交合同资料中...' });
            this.forms.contractitems.forEach((item) => {
                item.cashflows.forEach((i) => {
                    i.ningetsu = i.ningetsu * 100;
                });
            });
            this.$axios({
                method: 'POST',
                url,
                params: this.forms,
                formData: true,
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                this.btnfalse = true;
                if (res && res.code === 0) {
                    if (!this.$route.params.id) {
                        this.$router.replace({ name: 'ContractEdit', params: { id: res.data }});
                    } else {
                        this.getData('type');
                    }
                    this.$message.success('保存成功');
                } else {
                    this.$message.warning(res.message ? res.message : '接口开小差了，没有返回信息');
                }
            });
        },
        completeMonth() {
            const [ ,, fromD = '' ] = this.form.fromDate.split('-');
            const [ toY = '', toM = '', toD = '' ] = this.form.toDate.split('-');
            if (Number(fromD) === 1 && (new Date(toY, toM, '0').getDate() === Number(toD))) {
                return false;
            } else {
                return true;
            }    
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.tableData = [{
                isFalse: true,
                employeeID: '',
                unitPrice: '',
                ningetsu: 0,
                contractPrice: '',
                overTimePrice: '',
                underTimePrice: ''
            }];
            this.forms = {
                calculateUnit: '',
                contractCategory: 0,
                title: '',
                content: '',
                fromDate: this.nextMonthFirstDay(),
                toDate: this.nextMonthLastDay(),
                hoursFrom: 140,
                hoursTo: 180,
                customerID: '',
                paymentTermID: '',
                salesPersonID: '',
                businessFlow: ''
            };
        },
        postSavePanle() {
            this.forms.contractitems = this.tableData;
            this.forms.contractitems.forEach((item) => {
                item.ningetsu = item.ningetsu * 100;
                delete item.isFalse;
            });
            const loading = this.$loading({ lock: true, text: '正在提交合同资料中...' });
            if (this.$route.params.updates) {
                let url = '/api/SOContract/api_renewcontract';
                this.$axios({
                    method: 'GET',
                    url,
                    params: {
                        contractid: this.forms.id,
                        fromdate: moment(this.forms.fromDate).format('YYYY-MM-DD'),
                        todate: moment(this.forms.toDate).format('YYYY-MM-DD')
                    },
                    custom: {
                        loading,
                        vm: this
                    }
                }).then(res => {
                    loading.close();
                    if (res && res.code === 0) {
                        this.forms = res.data;
                        this.tableData = res.data.contractitems;
                        this.$message.success('保存成功');
                    } else {
                        this.$message.warning(res.message ? res.message : '接口开小差了，没有返回信息');
                    }
                });
            } else {
                let url = '/api/SOContract/api_simulatecontract';
                this.$axios({
                    method: 'POST',
                    url,
                    params: this.forms,
                    formData: true,
                    custom: {
                        loading,
                        vm: this
                    }
                }).then(res => {
                    loading.close();
                    if (res && res.code === 0) {
                        this.forms = res.data;
                        this.tableData = res.data.contractitems;
                        this.$message.success('保存成功');
                    } else {
                        this.$message.warning(res.message ? res.message : '接口开小差了，没有返回信息');
                    }
                });
            }
            
        },
        submit() {
            const params = {
                ID: 0,
                Title: this.form.title || '',
                Content: this.form.content || '',
                FromDate: this.form.fromDate,
                ToDate: this.form.toDate,
                PaymentTermID: this.form['paymenttermId'],
                UnitPrice: priceToNumber(this.form.unitPrice),
                HoursFrom: Number(this.form.hoursFrom),
                HoursTo: Number(this.form.hoursTo),
                CalculateUnit: this.form.calculateUnit,
                OverTimePrice: priceToNumber(this.form.overTimePrice),
                UnderTimePrice: priceToNumber(this.form.underTimePrice),
                CustomerID: this.form['customerId'],
                EmployeeID: this.form['employeeId'],
                SalesPersonID: this.form['salespersonId'],
                BusinessFlow: this.form.businessFlow
                // Ningetsu: this.form.ningetsu
            };
            let url = '/api/contract/api_createcontract';
            if (this.$route.params.id) {
                params.ID = this.$route.params.id;
                url = '/api/contract/api_updatecontract';
            }
            const formData = new FormData();
            for (let key in params) {
                formData.append(key, params[key]);
            }
            if (this.form.ningetsu) {
                // this.form.ningetsu.forEach((item, i) => {
                //     formData.append(`Ningetsu[${i}]`, item);
                // });
                formData.append('Ningetsu', JSON.stringify(this.form.ningetsu || []));
            } else {
                formData.append('Ningetsu', '');
            }
            console.log('params', params, formData);
            const loading = this.$loading({ lock: true, text: '正在提交合同资料中...' });
            this.$axios({
                method: 'POST',
                url,
                params: formData,
                custom: {
                    loading,
                    vm: this
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    if (!this.$route.params.id) {
                        this.$router.replace({ name: 'ContractEdit', params: { id: res.data }});
                    } else {
                        this.getData('type');
                    }
                    this.$message.success('保存成功');
                } else {
                    this.$message.warning(res.message ? res.message : '接口开小差了，没有返回信息');
                }
            });
        },
        getPersonMonth() {
            this.personMonthArr = [];
            this.dialogPresonMonth = true;
            this.dialogLoading = true;
            this.$axios({
                url: '/api/Contract/api_calculateningetsu',
                params: {
                    fromDate: this.form.fromDate,
                    toDate: this.form.toDate
                }
            }).then(res => {
                if (res) {
                    this.dialogLoading = false;
                    const result = [...res.data];
                    result.forEach(item => {
                        item.ningetsu = item.ningetsu / 100;
                    });
                    this.personMonthArr = result;
                }
            });
        },
        confirmDialog() {
            const ningetsu = [];
            this.personMonthArr.forEach(item => {
                ningetsu.push(parseInt(item.ningetsu * 100));
            });
            this.form['ningetsu'] = ningetsu;
            this.submit();
            this.dialogLoading = false;
            this.dialogPresonMonth = false;
        },
        formatNingetsu(scope) {
            const personMonthArr = [...this.personMonthArr];
            let value = Number(scope.row.ningetsu);
            if (value <= 1 && value > 0) {
                value = value.toFixed(2);
                personMonthArr[scope.$index].ningetsu = value;
            } else {
                personMonthArr[scope.$index].ningetsu = 0.01;
            }
            this.personMonthArr = personMonthArr;
        },
        formatLabel(val, type) {
            if (type === 'employee') {
                for (let item of this.workList) {
                    if (item.id === val) {
                        return item.Name;
                    }
                }
            } else if (type === 'payment') {
                for (let item of this.paymenttermsforselect) {
                    if (item.id === val) {
                        return item.title;
                    }
                }
            } else if (type === 'unit') {
                for (let item of this.unit) {
                    if (item.value === val) {
                        return item.label;
                    }
                }
            } else if (type === 'sales') {
                for (let item of this.salespersonforselect) {
                    if (item.id === val) {
                        return item.name;
                    }
                }
            } else if (type === 'custom') {
                for (let item of this.customerList) {
                    if (item.id === val) {
                        return item.title;
                    }
                }
            }
        },
        handlePrice() {
            this.form.unitPrice = priceToString(priceToNumber(this.form.unitPrice)); 
        },
        getContent(val, arr, key, field) {
            for (let item of arr) {
                if (item[key] === val) {
                    return item[field];
                }
            }
            return '-';
        },
        calculateOverTimePrice() {
            if (this.form.unitPrice) {
                if (this.form.hoursFrom) {
                    if (!this.erroeMsg) {
                        this.form.overTimePrice = priceToString(parseInt(priceToNumber(this.form.unitPrice) / Number(this.form.hoursFrom)));
                    }
                }
                if (this.form.hoursTo) {
                    if (!this.erroeMsg) {
                        this.form.underTimePrice = priceToString(parseInt(priceToNumber(this.form.unitPrice) / Number(this.form.hoursTo)));
                    }
                }
            }
        },
        changeCustomer() {
            for (let item of this.customerList) {
                if (item.id === this.form['customerId']) {
                    this.form['paymenttermId'] = item.paymentTermID;
                }
            }
        }
    }
};
</script>

<style lang="less">
.contract-sign {
    .el-form-item {
        margin-bottom: 15px;
    }
    .text-center{
        text-align: center;
    }
    .content {
        padding: 0 20px;
        .el-select, .el-input, .el-date-editor {
            width: 220px;
        }
        .is-required {
            .el-form-item__label {
                color: #606266;
            }
        }
    }
    .errborder{
        .el-input__inner{
            border-color: #DB414E;
        }
    }
    .err{
        color: #DB414E;
        font-size: 12px;
        line-height: 1;
        padding-top: 4px;
        position: absolute;
        top: 100%;
        left: 0;
    }
    .bottom {
        margin-top: 20px;
        ul{
            width: 900px;
            overflow: hidden;
            // height: 280px;
            border: 1px solid #EBEEF5;
            border-top: none;
            li{
                width: 50%;
                float: left;
                height: 50px;
                line-height: 50px;
                border-top: 1px solid #EBEEF5;
                span{
                    color: #606266;
                    float: left;
                    padding: 0 10px;
                    box-sizing: border-box;
                }
                span:first-child{
                    width: 145px;
                    background-color: #F5F7FA;
                }
                span:last-child{
                    width: 300px;
                    overflow:hidden;  /*超过部分不显示*/
                    text-overflow:ellipsis;  /*超过部分用点点表示*/
                    white-space:nowrap; /*不换行*/
                }
            }
            .lis{
                border-bottom: 1px solid #EBEEF5;
            }
        }
    }
    .link {
        font-size: 16px;
        & + .link {
            margin-left: 10px;
        }
    }
}
.preview-form {
    .el-form-item {
        &.el-form-item--mini {
            margin-top: 5px;
            margin-bottom: 0;
        }
    }
}
</style>
