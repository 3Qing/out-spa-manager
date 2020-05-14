<template>
    <el-dialog custom-class="intro-dialog" title="介绍文" :visible.sync="visible" @close="close">
        <el-form v-if="showDate" inline label-width="50px" size="mini">
            <el-form-item label="Date">
                <el-date-picker
                v-model="tmpData.avaiableDate"
                type="date"
                value-format="yyyy-MM-dd"
                value="yyyy-MM-dd"></el-date-picker>
            </el-form-item>
            <el-form-item label="状态">
                <el-select v-model="empStatus">
                    <el-option v-for="item in status" :key="item.val" :value="item.val" :label="item.label"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <el-input v-model="content" type="textarea" :rows="12" :maxlength="250"></el-input>
        <el-button type="primary" size="small" :disabled="!content" @click="submit">确认</el-button>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            tmpData: {},
            data: {},
            empStatus: '',
            date: '',
            content: '',
            showDate: false,
            visible: false,
            callback: null
        };
    },
    inject: ['status'],
    mounted() {
        this.$root.$off('SHOW_INTRO_DIALOG');
        this.$root.$on('SHOW_INTRO_DIALOG', ({ data = null, callback = null, showDate = false }) => {
            this.tmpData = data || {};
            this.empStatus = this.tmpData.status || 1;
            this.showDate = showDate;
            if (!showDate) {
                this.createProposeText(data);
            } else {
                this.getProposeText(data);
            }
            this.callback = callback;
            this.visible = true;
        });
    },
    methods: {
        close() {
            this.visible = false;
            this.tmpData = {};
            this.date = '';
            this.empStatus = '';
            this.content = '';
        },
        createProposeText(data) {
            this.$axios({
                url: '/api/Candidate/api_generateproposetext',
                params: {
                    empeeid: data.id
                }
            }).then(res => {
                if (res && res.code === 0) {
                    this.content = res.data;
                } else {
                    this.content = '';
                }
            });
        },
        getProposeText(data) {
            this.$axios({
                url: '/api/Candidate/api_getcandidateforupdate',
                params: {
                    id: data.id
                }
            }).then(res => {
                if (res && res.code === 0) {
                    this.content = res.data.proposeText;
                    this.empStatus = res.data.status;
                    this.avaiableDate = res.data.avaiableDate;
                    this.data = { ...res.data };
                } else {
                    this.$message({
                        type: 'error',
                        showClose: true,
                        message: res.message ? res.message : '接口开小差了，没有返回信息'
                    });
                }
            });
        },
        submit() {
            const loading = this.$loading({ lock: true, text: '正在提交候选人信息...' });
            const params = {
                Furigana_FirstName: this.data.furigana_FirstName,
                Furigana_LastName: this.data.furigana_LastName,
                FirstName: this.data.firstName,
                LastName: this.data.lastName,
                Type: this.data.type,
                Birthday: this.data.birthday,
                Nationality: this.data.nationality,
                LiveCity: this.data.liveCity,
                Sex: this.data.sex,
                SalesFromDate: this.data.salesFromDate,
                Comment: this.data.comment,
                CostFrom: this.data.costFrom,
                CostTo: this.data.costTo,
                SalesFrom: this.data.salesFrom,
                SalesTo: this.data.salesTo,
                MainSkill: this.data.mainSkill,
                StartWorkDate: this.data.startWorkDate,
                AttachResume: this.data.attachResume,
                AvaiableDate: this.tmpData.avaiableDate,
                ProposeText: this.content,
                Status: this.empStatus || 1
            };
            if (this.showDate) {
                params.id = this.tmpData.id;
            } else {
                params['EmployeeID'] = this.tmpData.id;
            }
            
            this.$axios({
                method: 'POST',
                url: '/api/Candidate/api_updatecandidate',
                params,
                custom: {
                    loading,
                    vm: this
                },
                formData: true
            }).then(res => {
                loading.close();
                if (res && res.code === 0) {
                    this.callback && this.callback();
                    this.close();
                } else {
                    this.$message({
                        type: 'error',
                        showClose: true,
                        message: res.message ? res.message : '接口开小差了，没有返回信息'
                    });
                }
            });
        }
    }
};
</script>

<style lang="less">
.intro-dialog {
    .el-dialog__body {
        padding-top: 10px;
    }
    .el-button {
        display: block;
        margin: 20px auto 0;
    }
}
</style>
