import moment from 'moment';

export default {
    data() {
        return {
            recomIndex: -1,
            mobileSameName: [],
            sameName: ''
        };
    },
    methods: {
        addSales(item) {
            this.$root.$emit('SHOW_ATY_DIALOG', {
                edit: true,
                opt: Object.assign(this.opt, item),
                callback: () => {
                    this.$emit('update');
                }
            });
        },
        formatContext(row, field) {
            if (row[field]) {
                const duration = moment(new Date(row[field].AtyDate).getTime()).add(row[field].AtyMinutes, 'm').format('HH:mm');
                return `${moment(new Date(row[field].AtyDate).getTime()).format('HH:mm')}~${duration} ${row[field].AtyLocation}`;
            } else {
                return '';
            }
        },
        showDialog(row, filed) {
            this.$root.$emit('SHOW_ATY_DIALOG', {
                edit: true,
                data: row[filed],
                opt: this.opt,
                callback: () => {
                    this.$emit('update');
                }
            });
        },
        cellClassName(data, field) {
            // 1是黄色，7和8是灰色，9是绿色
            if (data[field]) {
                return data[field].Status === 1 ? 'cell-warning' : data[field].Status === 9 ? 'cell-success' : data[field].Status ? 'cell-info' : '';
            }
            return '';
        },
        arraySpanMethod({ row, columnIndex }) {
            if (columnIndex === 0) {
                return [row.rowspan, 1];
            }
        },
        arraySpanMobileMethod({ row, columnIndex }) {
            if (columnIndex === 0) {
                return [row.rowspan || 0, 1];
            }
        }
    }
};