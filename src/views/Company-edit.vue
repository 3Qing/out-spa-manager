<template>
    <main-wrapper class="company-edit-wrapper">
        <div class="main-header" slot="header">
            <el-button type="primary" size="mini" @click="beforeSubmit" v-if="!isDisplay">提交</el-button>
            <el-button type="danger" size="mini" @click="reset" v-if="!isDisplay">重置</el-button>
            <el-button size="mini" @click="$router.back()">リターン</el-button>
        </div>
        <el-row>
            <el-col :span="12">
                <el-form size="mini" label-width="140px" ref="form" :model="form" :rules="isDisplay ? {} : rules" label-suffix="">
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
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="銀行口座名義人">
                                <p v-if="isDisplay">{{form.accountOwner}}</p>
                                <el-input v-model="form.accountOwner" :maxlength="30" v-else></el-input>
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
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
import { mapGetters } from 'vuex';
// import UploadCroppa from '@components/upload-croppa';
import CardUpload from '@components/card-upload';
import ImageCroppa from '@components/image-croppa';
import { fileToBase64 } from '@_public/utils';
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
            data1: '',
            data2: '',
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
                touhonImage: ''
            },
            rules: {},
            isDisplay: false
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            if (to.params.id) {
                vm.getData();
                vm.getLogo();
                vm.getTouhon();
                vm.rules = {
                    title: [{
                        required: true, message: '请输入会社名', trigger: 'blur'
                    }],
                    address: [{
                        required: true, message: '请输入所在地', trigger: 'blur'
                    }],
                    contactPerson: [{
                        required: true, message: '请输入連絡担当者', trigger: 'blur'
                    }]
                };
            } else {
                vm.rules = {
                    mailAddress: [{
                        required: true, message: '请输入メールアドレス', trigger: 'blur'
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
                };
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
                        'user.Name': this.form.userName || '',
                        'user.Password': this.form.userPassword || '',
                        ContactPerson: this.form.contactPerson || '',
                        mailAddress: this.form.mailAddress || '',
                        ContactTelMail: this.form.contactTelMail || '',
                        LogoImage: this.form.logoImage || '',
                        WebSite: this.form.webSite || '',
                        TouhonImage: this.form.touhonImage || ''
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
}
</style>
