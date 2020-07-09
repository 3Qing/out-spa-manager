<template>
    <main-wrapper class="company-edit-wrapper">
        <div class="main-header" slot="header">
            <el-button type="primary" size="mini" @click="beforeSubmit" v-if="!isDisplay">提交</el-button>
            <el-button type="primary" size="mini" v-if="$route.params.id&&form.status!==0" @click="dialogSubmit(1)">アカウント承認</el-button>
            <el-button type="primary" size="mini" v-if="$route.params.id&&form.status===0" @click="dialogSubmit(2)">ステータスとパケージ</el-button>
            <el-button size="mini" @click="$router.back()">リターン</el-button>
        </div>
        <el-row>
            <el-col :span="12">
                <el-form size="mini" label-width="140px" ref="form" :model="form" :rules="isDisplay ? {} : rules" label-suffix="">
                    <p class="infos">基本信息</p>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="会社名" prop="title">
                                <p v-if="isDisplay">{{form.title}}</p>
                                <el-input v-model="form.title" :maxlength="30" v-else></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="简称" prop="imG_Prefix">
                                <p v-if="isDisplay">{{form.imG_Prefix}}</p>
                                <el-input v-model="form.imG_Prefix" :maxlength="4" v-else></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="ホムページ">
                                <p v-if="isDisplay">{{form.webSite}}</p>
                                <el-input v-model="form.webSite" :maxlength="30" v-else></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="郵便番号">
                                <p v-if="isDisplay">{{form.postal}}</p>
                                <el-input v-model="form.postal" :maxlength="30" v-else></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="所在地" prop="address">
                                <p v-if="isDisplay">{{form.address}}</p>
                                <el-input v-model="form.address" v-else></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="電話">
                                <p v-if="isDisplay">{{form.phone}}</p>
                                <el-input v-model="form.phone" :maxlength="30" v-else></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="Fax">
                                <p v-if="isDisplay">{{form.fax}}</p>
                                <el-input v-model="form.fax" :maxlength="30" v-else></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="$route.params.id">
                        <el-col :span="12">
                            <el-form-item label="入驻日期">
                                <p>{{formatTime(form.joinDate)}}</p>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="連絡担当者" prop="contactPerson">
                                <p v-if="isDisplay">{{form.contactPerson}}</p>
                                <el-input v-model="form.contactPerson" :maxlength="30" v-else></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="メールアドレス" prop="mailAddress">
                                <p v-if="isDisplay">{{form.mailAddress}}</p>
                                <el-input v-model="form.mailAddress" :maxlength="30" v-else></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="連絡方法">
                                <p v-if="isDisplay">{{form.contactTelMail}}</p>
                                <el-input v-model="form.contactTelMail" type="textarea" :rows="3" v-else></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <p class="infos">财务基本设置</p>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="开始会计期间" prop="periodFrom">
                                <p v-if="isDisplay">{{getContent(form['periodFrom'], selectList, 'id', 'title')}}</p>
                                <el-select v-else placeholder="开始会计期间" size="mini" v-model="form.periodFrom" >
                                    <el-option v-for="(item) in selectList" :key="item.id" :label="item.title" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="工资支付日期" prop="salaryPayTerm">
                                <p v-if="isDisplay">{{getContent(form['salaryPayTerm'], selectLists, 'id', 'title')}}</p>
                                <el-select v-else placeholder="工资支付日期" size="mini" v-model="form.salaryPayTerm" >
                                    <el-option v-for="(item) in selectLists" :key="item.id" :label="item.title" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="銀行口座名義人">
                                <p v-if="isDisplay">{{form.accountOwner}}</p>
                                <el-input v-model="form.accountOwner" :maxlength="30" v-else></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <p class="infos">编码配置</p>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="员工号" prop="imG_EmployeeNo_Length">
                                <p v-if="isDisplay">{{form.imG_EmployeeNo_Length}}</p>
                                <el-input v-model="form.imG_EmployeeNo_Length" :maxlength="30" v-else></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="报价单号" prop="imG_EstimationNo">
                                <p v-if="isDisplay">{{form.imG_EstimationNo}}</p>
                                <el-input :disabled="(form.last_EstimationNo)?true:false" v-model="form.imG_EstimationNo" v-else></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <p class="mltop">{{form.last_EstimationNo}}</p>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="销售合同号" prop="imG_SOContractNo">
                                <p v-if="isDisplay">{{form.imG_SOContractNo}}</p>
                                <el-input v-else :disabled="(form.last_SOContractNo)?true:false" v-model="form.imG_SOContractNo"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <p class="mltop">{{form.last_SOContractNo}}</p>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="采购合同号" prop="imG_POContractNo">
                                <p v-if="isDisplay">{{form.imG_POContractNo}}</p>
                                <el-input v-else :disabled="(form.last_POContractNo)?true:false"  v-model="form.imG_POContractNo" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <p class="mltop">{{form.last_POContractNo}}</p>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="客户请求书号" prop="imG_CustomerInvoiceNo">
                                <p v-if="isDisplay">{{form.imG_CustomerInvoiceNo}}</p>
                                <el-input v-else :disabled="(form.last_CustomerInvoiceNo)?true:false"  v-model="form.imG_CustomerInvoiceNo" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <p class="mltop">{{form.last_CustomerInvoiceNo}}</p>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="供应商请求书号" prop="imG_VendorInvoiceNo">
                                <p v-if="isDisplay">{{form.imG_VendorInvoiceNo}}</p>
                                <el-input v-else :disabled="(form.last_VendorInvoiceNo)?true:false"  v-model="form.imG_VendorInvoiceNo" ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <p class="mltop">{{form.last_VendorInvoiceNo}}</p>
                        </el-col>
                    </el-row>
                    <p class="infos">其他信息</p>
                    <el-row v-if="$route.params.id">
                        <el-col :span="12">
                            <el-form-item label="入驻状态" prop="companyRoleTitle">
                                <p>{{form.companyRoleTitle || '-'}}</p>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="管理员账户">
                                <p>{{form.userID}} {{form.userName}}</p>
                            </el-form-item>
                        </el-col>
                        <!-- <el-col :span="12">
                            <el-form-item label="其他联系方式" prop="contactTelMail">
                                <p v-if="isDisplay">{{form.contactTelMail}}</p>
                                <el-input v-model="form.contactTelMail" :maxlength="30" v-else></el-input>
                            </el-form-item>
                        </el-col> -->
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="管理者ユーザ名" prop="userName">
                                <p v-if="isDisplay">{{form.userName}}</p>
                                <el-input v-model="form.userName" :maxlength="30" v-else></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="管理者パスワード" prop="userPassword">
                                <p v-if="isDisplay">{{form.userPassword}}</p>
                                <el-input v-model="form.userPassword" show-password :maxlength="30" v-else></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-col>
            <el-col :span="10" :offset="2">
                <div class="image-wrapper" style="margin-right:20px;" v-if="isDisplay">
                    <img :src=data1 >
                </div>
                <div class="image-wrapper" v-if="isDisplay">
                    <img :src=data2 >
                </div>
                <card-upload v-if="!isDisplay&&istrue1" style="margin-right: 20px;" :opt="{btnText: '上传Logo', w: 300, h: 400, field: 'logoImage'}" :form="form" :datas="data1" @success="upload"></card-upload>
                <card-upload v-if="!isDisplay&&istrue2" :opt="{btnText: '上传营业执照', w: 300, h: 400, field: 'touhonImage'}" :form="form" :datas="data2" @success="upload"></card-upload>
                <card-upload v-if="$route.params.edit" style="margin-right: 20px;" :opt="{btnText: '上传Logo', w: 300, h: 400, field: 'logoImage'}" :form="form" :datas="data1" @success="upload"></card-upload>
                <card-upload v-if="$route.params.edit" :opt="{btnText: '上传营业执照', w: 300, h: 400, field: 'touhonImage'}" :form="form" :datas="data2" @success="upload"></card-upload>
                <!-- <card-upload v-if="$route.params.edit" style="margin-right: 20px;" :opt="{btnText: '上传Logo', w: 300, h: 400, field: 'logoImage'}" :form="form" :datas="data1" @success="upload"></card-upload>
                <card-upload v-if="$route.params.edit" :opt="{btnText: '上传营业执照', w: 300, h: 400, field: 'touhonImage'}" :form="form" :datas="data2" @success="upload"></card-upload> -->
                <image-croppa></image-croppa>
            </el-col>
        </el-row>
        <el-dialog :visible.sync="visible" @close="close">
            <div class="card-header">
                <el-row>
                    <el-col :span="10">
                        <span class="label">利用ステータス:</span>
                        <span class="fonts">{{getContent(form.status, studs, 'id', 'text')}}</span>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="10">
                        <span class="label">利用パケージ:</span>
                        <span @click="addClicks" class="fonts" style="cursor: pointer;color: #1473b7;font-size:18px;">+</span>
                    </el-col>
                </el-row>
            </div>
            <el-table size="mini" :data="rolesData" border>
                <el-table-column label="ロールタイトル" prop="userID" >
                    <template slot-scope="scope">
                        <span>{{scope.row.userID}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="チャージ金額" prop="companyRoleID" >
                    <template slot-scope="scope">
                        <span>{{scope.row.companyRoleID}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="利用開始日" prop="fromDate" >
                    <template slot-scope="scope">
                        <span>{{formatTime(scope.row.fromDate)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="利用終了日" prop="toDate" >
                    <template slot-scope="scope">
                        <span>{{formatTime(scope.row.toDate)}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="支払期日" prop="payDate" >
                    <template slot-scope="scope">
                        <span>{{formatTime(scope.row.payDate)}}</span>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
        <el-dialog :visible.sync="visibles" @close="closes">
            <el-form size="mini" :model="forms" :rules="rulesform" ref="rulesform" label-width="120px">
                <el-form-item label="案件タグ" prop="companyRoleID">
                    <el-select placeholder="利用パケージ" size="mini" v-model="forms.companyRoleID">
                        <el-option v-for="(item) in selectList" :key="item.type" :label="item.text" :value="item.type"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="利用開始日" prop="fromDate">
                    <el-date-picker
                        v-model="forms.fromDate"
                        type="date"
                        size="mini"
                        value-format="yyyy-MM-dd"
                        value="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="利用終了日" prop="toDate">
                    <el-date-picker
                        v-model="forms.toDate"
                        type="date"
                        size="mini"
                        value-format="yyyy-MM-dd"
                        value="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="支払期日" prop="payDate">
                    <el-date-picker
                        v-model="forms.payDate"
                        type="date"
                        size="mini"
                        value-format="yyyy-MM-dd"
                        value="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="mini" type="primary" @click="saSubmit">保存</el-button>
                <el-button size="mini" @click="closes">取消</el-button>
            </div>
        </el-dialog>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import { mapGetters } from 'vuex';
// import UploadCroppa from '@components/upload-croppa';
import CardUpload from '@components/card-upload';
import ImageCroppa from '@components/image-croppa';
import { fileToBase64, formatTime} from '@_public/utils';
export default {
    components:  {
        MainWrapper,
        CardUpload,
        ImageCroppa
    },
    data() {
        return {
            istrue1: false,
            istrue2: false,
            visible: false,
            visibles: false,
            data1: '',
            data2: '',
            forms: {
                companyRoleID: '',
                fromDate: '',
                toDate: '',
                payDate: ''
            },
            form: {
                title: '',
                postal: '',
                address: '',
                phone: '',
                fax: '',
                imG_Prefix: '',
                accountOwner: '',
                userName: '',
                userPassword: '',
                contactPerson: '',
                mailAddress: '',
                contactTelMail: '',
                logoImage: '',
                webSite: '',
                touhonImage: '',
                joinDate: '',
                imG_EmployeeNo_Length: '',
                imG_EstimationNo: '',
                imG_SOContractNo: '',
                imG_POContractNo: '',
                salaryPayTerm: '',
                periodFrom: '',
                imG_CustomerInvoiceNo: '',
                imG_VendorInvoiceNo: ''
            },
            rulesform: {
                companyRoleID: [{
                    required: true, message: '请选择利用パケージ', trigger: 'blur'
                }],
                fromDate: [{
                    required: true, message: '请输入利用開始日', trigger: 'blur'
                }],
                toDate: [{
                    required: true, message: '请输入利用終了日', trigger: 'blur'
                }],
                payDate: [{
                    required: true, message: '请输入支払期日', trigger: 'blur'
                }],
            },
            rules: {
                periodFrom: [{
                    required: true, message: '请选择开始会计期间', trigger: 'blur'
                }],
                salaryPayTerm: [{
                    required: true, message: '请选择工资支付日期', trigger: 'blur'
                }],
                accountOwner: [{
                    required: true, message: '请输入銀行口座名義人', trigger: 'blur'
                }],
                mailAddress: [{
                    required: true, message: '请输入メールアドレス', trigger: 'blur',
                }, { 
                    type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur']
                }],
                imG_Prefix: [{
                    required: true, message: '请输入简称', trigger: 'blur'
                }],
                title: [{
                    required: true, message: '请输入会社名', trigger: 'blur'
                }],
                address: [{
                    required: true, message: '请输入所在地', trigger: 'blur'
                }],
                contactPerson: [{
                    required: true, message: '请输入連絡担当者', trigger: 'blur'
                }],
                userName: [{
                    required: true, message: '请输入管理者ユーザ名', trigger: 'blur'
                }],
                userPassword: [{
                    required: true, message: '请输入管理者パスワード', trigger: 'blur'
                }],
                imG_EmployeeNo_Length: [{
                    required: true, message: '请输入员工号', trigger: 'blur'
                }],
                imG_EstimationNo: [{
                    required: true, message: '请输入报价单号', trigger: 'blur'
                }],
                imG_SOContractNo: [{
                    required: true, message: '请输入销售合同号', trigger: 'blur'
                }],
                imG_POContractNo: [{
                    required: true, message: '请输入采购合同号', trigger: 'blur'
                }],
                imG_CustomerInvoiceNo: [{
                    required: true, message: '请输入客户请求书号', trigger: 'blur'
                }],
                imG_VendorInvoiceNo: [{
                    required: true, message: '请输入供应商请求书号', trigger: 'blur'
                }]
            },
            selectList: [{
                id: 1,
                title: '1月'
            }, {
                id: 2,
                title: '2月'
            }, {
                id: 3,
                title: '3月'
            }, {
                id: 4,
                title: '4月'
            }, {
                id: 5,
                title: '5月'
            }, {
                id: 6,
                title: '6月'
            }, {
                id: 7,
                title: '7月'
            }, {
                id: 8,
                title: '8月'
            }, {
                id: 9,
                title: '9月'
            }, {
                id: 10,
                title: '10月'
            }, {
                id: 11,
                title: '11月'
            }, {
                id: 12,
                title: '12月'
            }],
            selectLists: [],
            isDisplay: false,
            rolesData: [],
            studs: []
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getselects();
            if (to.params.id) {
                vm.getData();
                vm.getLogo();
                vm.getTouhon();
                vm.getRoles();
                vm.getStus();
                // vm.rules = {
                //     title: [{
                //         required: true, message: '请输入会社名', trigger: 'blur'
                //     }],
                //     address: [{
                //         required: true, message: '请输入所在地', trigger: 'blur'
                //     }],
                //     contactPerson: [{
                //         required: true, message: '请输入連絡担当者', trigger: 'blur'
                //     }]
                // };
            } else {
                // vm.rules = {
                //     mailAddress: [{
                //         required: true, message: '请输入メールアドレス', trigger: 'blur'
                //     }],
                //     imG_Prefix: [{
                //         required: true, message: '请输入简称', trigger: 'blur'
                //     }],
                //     title: [{
                //         required: true, message: '请输入会社名', trigger: 'blur'
                //     }],
                //     address: [{
                //         required: true, message: '请输入所在地', trigger: 'blur'
                //     }],
                //     contactPerson: [{
                //         required: true, message: '请输入連絡担当者', trigger: 'blur'
                //     }],
                //     userName: [{
                //         required: true, message: '请输入管理者ユーザ名', trigger: 'blur'
                //     }],
                //     userPassword: [{
                //         required: true, message: '请输入管理者パスワード', trigger: 'blur'
                //     }],
                //     imG_EmployeeNo_Length: [{
                //         required: true, message: '请输入员工号', trigger: 'blur'
                //     }],
                //     imG_EstimationNo: [{
                //         required: true, message: '请输入报价单号', trigger: 'blur'
                //     }],
                //     imG_SOContractNo: [{
                //         required: true, message: '请输入销售合同号', trigger: 'blur'
                //     }],
                //     imG_POContractNo: [{
                //         required: true, message: '请输入采购合同号', trigger: 'blur'
                //     }],
                // };
            }
            vm.$nextTick(() => {
                vm.reset();
            });
            if (to.query.display) {
                vm.isDisplay = true;
                vm.getLogo();
                vm.getTouhon();
            }
        });
    },
    computed: {
        ...mapGetters(['GET_LOADING'])
    },
    methods: {
        formatTime: formatTime,
        getStus() {
            this.$axios({
                url: '/api/Company/api_joinstatusforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.studs = res.data || [];
                }
            });
        },
        close() {
            this.visible = false;
        },
        closes() {
            this.visibles = false;
            this.$refs.rulesform.resetFields();
        },
        saSubmit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    const loading = this.$loading({ lock: true, text: '正在保存中...' });
                    let url = '/api/CompanyRole/api_updatecompanypackage';
                    let params = this.forms;
                    this.$axios({
                        method: 'POST',
                        url,
                        params,
                        formData: true,
                    }).then(res => {
                        loading.close();
                        if (res && res.code === 0) {
                            this.visibles = false;
                            this.$message({
                                type: 'success',
                                message: res.message
                            });
                            this.getRoles();
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.message
                            });
                        }
                    });
                }
            });
        },
        addClicks() {
            this.visibles = true;
        },
        dialogSubmit(ids) {
            if (ids === 1) {
                this.$confirm('是否确认更改', '确认', {
                    type: 'warning'
                }).then(() => {
                    this.$axios({
                        url: '/api/Company/api_approveforjoinerp',
                        params: {
                            id: this.$route.params.id
                        }
                    }).then(res => {
                        if (res && res.code === 0) {
                            this.$message({
                                type: 'success',
                                message: '更改成功'
                            });
                            // this.getData();
                        } else {
                            this.$message({
                                type: 'error',
                                message: res.message
                            });
                        }
                    });
                }).catch(() => {});
            } else {
                this.visible = true;
            }
        },
        getRoles() {
            this.$axios({
                url: '/api/CompanyRole/api_getcompanypackagelist',
                params: {
                    companyid: this.$route.params.id
                }
            }).then(res => {
                if (res && res.code === 0) {
                    this.rolesData = res.data;
                } else {
                    this.$message({
                        type: 'error',
                        message: res.message
                    });
                }
            });
        },
        getselects() {
            this.$axios({
                url: '/api/PaymentTerm/api_paymentTermsforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    if (res.data) {
                        const data = res.data || {};
                        this.selectLists = data;
                    }
                }
            });
        },
        getContent(val, arr, key, field) {
            for (let item of arr) {
                if (item[key] === val) {
                    return item[field];
                }
            }
            return '-';
        },
        dataURLtoFile(dataurl, filename) {
            var arr = dataurl.split(","),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n);
            while (n--) {
                u8arr[n] = bstr.charCodeAt(n);
            }
            return new File([u8arr], filename, { type: mime });
        },
        getLogo() {
            this.$axios({
                url: '/api/Company/api_getcompanylogoimg',
                params: {
                    companyid: this.$route.params.id
                },
                headers: {
                    'Content-Type': 'application/octet-stream'
                },
                responseType: 'blob'
            }).then(res => {
                fileToBase64(res).then(result => {
                    if (result.indexOf('image') > -1) {
                        this.form.logoImage = this.dataURLtoFile(result, 'filename');
                        this.data1 = result;
                    }
                    this.istrue1 = true;
                });
            });
        },
        getTouhon() {
            this.$axios({
                url: '/api/Company/api_getcompanytouhonimg',
                params: {
                    companyid: this.$route.params.id
                },
                headers: {
                    'Content-Type': 'application/octet-stream'
                },
                responseType: 'blob'
            }).then(res => {
                fileToBase64(res).then(result => {
                    if (result.indexOf('image') > -1) {
                        this.form.touhonImage = this.dataURLtoFile(result, 'filename');
                        this.data2 = result;
                    }
                    this.istrue2 = true;
                });
            });
        },
        getData() {
            const loading = this.$loading({ lock: true, text: this.GET_LOADING });
            this.$axios({
                url: '/api/Company/api_getcompanyinfo',
                params: {
                    id: this.$route.params.id
                }
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    if (res.data) {
                        const data = res.data || {};
                        this.form = data;
                        this.form['userName'] = this.form.user.name;
                        this.form['userPassword'] = this.form.user.password;
                        console.log(data);
                    }
                }
            });
        },
        reset() {
            this.$refs.form.resetFields();
        },
        beforeSubmit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    console.log(this.form.logoImage, this.form.touhonImage);
                    // if (!this.form.logoImage || !this.form.touhonImage) {
                    //     this.$message({
                    //         type: 'warning',
                    //         message: '请上传图片'
                    //     });
                    //     return;
                    // }
                    const params = {
                        Title: this.form.title,
                        Postal: this.form.postal,
                        Address: this.form.address || '',
                        Phone: this.form.phone || '',
                        Fax: this.form.fax || '',
                        IMG_Prefix: this.form.imG_Prefix || '',
                        AccountOwner: this.form.accountOwner || '',
                        'user.name': this.form.userName || '',
                        'user.password': this.form.userPassword || '',
                        ContactPerson: this.form.contactPerson || '',
                        mailAddress: this.form.mailAddress || '',
                        ContactTelMail: this.form.contactTelMail || '',
                        LogoImage: this.form.logoImage || '',
                        WebSite: this.form.webSite || '',
                        TouhonImage: this.form.touhonImage || '',
                        periodFrom: this.form.periodFrom,
                        salaryPayTerm: this.form.salaryPayTerm,
                        imG_EmployeeNo_Length: this.form.imG_EmployeeNo_Length,
                        imG_EstimationNo: this.form.imG_EstimationNo,
                        imG_SOContractNo: this.form.imG_SOContractNo,
                        imG_POContractNo: this.form.imG_POContractNo,
                        imG_CustomerInvoiceNo: this.form.imG_CustomerInvoiceNo,
                        imG_VendorInvoiceNo: this.form.imG_VendorInvoiceNo
                    };
                    if (this.$route.params.id) {
                        params.ID = this.$route.params.id;
                    }
                    console.log(params);
                    this.submit(params);
                }
            });
        },
        submit(params) {
            const loading = this.$loading({ lock: true, text: 'データ提出中...' });
            let url = '/api/Company/api_joinerpplatform';
            if (params.ID) {
                url = '/api/Company/api_updatecompanyinfo';
            }
            this.$axios({
                method: 'POST',
                url,
                params,
                formData: true,
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.$router.push({ name: 'CompanyList' });
                    this.$message({
                        type: 'success',
                        message: '保存完了'
                    });
                }
            });
        },
        upload({res, opt}) {
            fileToBase64(res.file).then(result => {
                this.form[opt.field] = this.dataURLtoFile(result, opt.field);
            });
        }
    }
};
</script>

<style lang="less">
.company-edit-wrapper {
    .mltop{
        margin-left: 20px;
        line-height: 30px;
    }
    .infos{
        line-height: 50px;
        color: #1473b7;
    }
    .el-form {
        .el-input {
            // width: 220px;
        }
    }
    .image-wrapper {
        display: inline-block;
        vertical-align: top;
        width: 300px;
        height: 400px;
        img {
            width: 100%;
        }
    }
    .card-header {
        margin-bottom: 15px;
        .label {
            display: inline-block;
            width: 150px;
            color: #606266;
            font-size: 12px;
        }
        .fonts {
            color: #606266;
            font-size: 12px;
        }
    }
}
</style>
