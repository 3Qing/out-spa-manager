export default  {
    data() {
        return {
            form: {
                PostingDate: '',
                'DocType': '',
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
                url: '/api/ACDoc/api_doctypesforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.docTypes = res.data || [];
                }
            });
        },
        getCounts() {
            this.$axios({
                url: '/api/ACDoc/api_accountsforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.acCounts = res.data || [];
                }
            });
        },
        getTeams() {
            this.$axios({
                url: '/api/Team/api_teamsforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.teams = res.data || [];
                }
            });
        },
        getEmployees() {
            this.$axios({
                url: '/api/Employee/api_employeesforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.employees = res.data || [];
                }
            });
        },
        getCustom() {
            this.$axios({
                url: '/api/Customer/api_customersforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.customs = res.data || [];
                }
            });
        }
    }
};
