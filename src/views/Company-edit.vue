<template>
    <main-wrapper class="company-edit-wrapper">
        <div class="main-header" slot="header">
            <el-button type="primary" size="mini" @click="beforeSubmit">提交</el-button>
            <!-- <el-button type="danger" size="mini">重置</el-button> -->
            <el-button size="mini" @click="$router.back()">返回</el-button>
        </div>
        <el-row>
            <el-col :span="12">
                <el-form size="mini" label-width="100px" ref="form" :model="form">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="title">
                                <el-input v-model="form.title" :maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="Postal">
                                <el-input v-model="form.postal" :maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="Address">
                                <el-input v-model="form.address"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="Phone">
                                <el-input v-model="form.phone" :maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="Fax">
                                <el-input v-model="form.fax" :maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="AccountOwner">
                                <el-input v-model="form.accountOwner" :maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="userName">
                                <el-input v-model="form.userName" :maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="userPassword">
                                <el-input v-model="form.userPassword" show-password :maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="contactPerson">
                                <el-input v-model="form.contactPerson" show-password :maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="contactTelMail">
                                <el-input v-model="form.contactTelMail" show-password :maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="logoImage">
                                <el-input v-model="form.logoImage" show-password :maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="webSite">
                                <el-input v-model="form.webSite" show-password :maxlength="30"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </el-col>
        </el-row>
    </main-wrapper>
</template>

<script>
import MainWrapper from '@components/main-wrapper';
export default {
    components:  {
        MainWrapper
    },
    data() {
        return {
            form: {
                title: '',
                postal: '',
                address: '',
                phone: '',
                fax: '',
                accountOwner: '',
                userName: '',
                userPassword: '',
                contactPerson: '',
                contactTelMail: '',
                logoImage: '',
                webSite: ''
            }
        };
    },
    methods: {
        beforeSubmit() {
            const params = {
                Title: this.form.title,
                Postal: this.form.postal,
                Address: this.form.address || '',
                Phone: this.form.phone || '',
                Fax: this.form.fax || '',
                AccountOwner: this.form.accountOwner || '',
                'user.Name': this.form.userName || '',
                'user.Password': this.form.userPassword || '',
                ContractPerson: this.form.contactPerson || '',
                ContactTelMail: this.form.contactTelMail || '',
                LogoImage: this.form.logoImage || '',
                WebSite: this.form.webSite || ''
            };
            this.submit(params);
        },
        submit(params) {
            const loading = this.$loading({ lock: true, text: '正在提交信息中' });
            this.$axios({
                method: 'POST',
                url: '/api/Company/api_joinerpplatform',
                params,
                formData: true,
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.$message({
                        type: 'success',
                        message: '保存成功'
                    });
                }
            });
        }
    }
};
</script>

<style lang="less">
.company-edit-wrapper {
    .el-form {
        .el-input {
            width: 220px;
        }
    }
}
</style>
