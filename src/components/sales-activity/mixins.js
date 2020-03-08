import moment from 'moment';

export default {
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
        cellClassName({ row, columnIndex }) {
            // 1是黄色，7和8是灰色，9是绿色
            const data = row[`date${columnIndex}`];
            if (data) {
                return data.Status === 1 ? 'cell-warning' : data.Status === 9 ? 'cell-success' : data.Status ? 'cell-info' : '';
            }
            return '';
        },
        mobileCellClassName({ row, columnIndex }) {
            if (columnIndex) {
                return row.Status === 1 ? 'cell-warning' : row.Status === 9 ? 'cell-success' : row.Status ? 'cell-info' : '';
            }
        }
    }
};