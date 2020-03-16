<template>
    <div class="main-header">
        <el-date-picker
            v-model="form.periodfrom"
            type="month"
            size="mini"
            placeholder="开始时间"
            value-format="yyyyMM"
            value="yyyyMM"
            :clearable="clearable"
            @change="changeStartTime">
        </el-date-picker>
        <el-date-picker
            v-model="form.periodto"
            type="month"
            size="mini"
            placeholder="结束时间"
            value-format="yyyyMM"
            value="yyyyMM"
            clearable
            @change="changeEndTime">
        </el-date-picker>
        <slot></slot>
    </div>
</template>

<script>
export default {
    props: {
        form: {
            type: Object,
            default: () => ({
                periodfrom: '',
                periodto: ''
            })
        },
        clearable: {
            type: Boolean,
            default: true
        }
    },
    methods: {
        changeStartTime(val) {
            if (!val) {
                if (this.form.periodto) {
                    this.$message({
                        type: 'warning',
                        message: '请先取消结束时间'
                    });
                } else {
                    this.$emit('update');
                }
            } else {
                this.$emit('update');
            }
        },
        changeEndTime(val) {
            if (this.form.periodfrom) {
                const startTime = new Date(this.form.periodfrom).getTime();
                if (val) {
                    const endTime = new Date(val).getTime();
                    if (startTime > endTime) {
                        this.$message({
                            type: 'warning',
                            message: '开始时间不得小于结束时间'
                        });
                        this.form.periodto = '';
                    } else {
                        this.$emit('update');
                    }
                } else {
                    this.$emit('update');
                }
            } else {
                if (this.form.periodfrom) {
                    this.$message({
                        type: 'warning',
                        message: '请先选择开始时间'
                    });
                }
            }
        },
    }
};
</script>

<style scoped>

</style>
