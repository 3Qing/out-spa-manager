export default  {
    data() {
        return {
            form: {
                invoiceNo: '',
                vendorID: '',
                invoiceTitle: '',
                invoiceDate: '',
                planCollectDate: '',
                invoiceAmount: '',
                comment: ''
            },
            docTypes: [],
            acCounts: [],
            teams: [],
            employees: [],
            customs: [],
            vendors: []
        };
    },
    beforeRouteEnter(to, from, next) {
        next(vm => {
            vm.getDocType();
            vm.getCounts();
            vm.getTeams();
            vm.getCustom();
            vm.getEmployees();
            vm.getVendors();
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
        },
        getVendors() {
            this.$axios({
                url: '/api/Customer/api_vendorsforselect'
            }).then(res => {
                if (res && res.code === 0) {
                    this.vendors = res.data || [];
                }
            });
        }
    }
};
