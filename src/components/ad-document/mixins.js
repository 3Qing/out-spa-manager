export default  {
    data() {
        return {
            form: {
                PostingDate: '',
                'doctype.ID': '',
                Comment: ''
            },
            drcr: [{
                label: '借方', value: true
            }, {
                label: '貸方', value: false
            }],
            docTypes: [],
            acCounts: [],
            teams: [],
            employees: [],
            customs: [],
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getDocType();
            vm.getCounts();
            vm.getTeams();
            vm.getCustom();
            vm.getEmployees();
        });
    },
    methods: {
        getDocType() {
            this.$axios({
                url: '/api/doctypesforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.docTypes = res.data || [];
                }
            });
        },
        getCounts() {
            this.$axios({
                url: '/api/accountsforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.acCounts = res.data || [];
                }
            });
        },
        getTeams() {
            this.$axios({
                url: '/api/teamsforselect'
            }).then(res => {
                this.teams = res || [];
            });
        },
        getEmployees() {
            this.$axios({
                url: '/api/employeesforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.employees = res.data || [];
                }
            });
        },
        getCustom() {
            this.$axios({
                url: '/api/customersforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.customs = res.data || [];
                }
            });
        }
    }
};
