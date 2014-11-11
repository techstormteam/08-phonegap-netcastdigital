function User() {
    this.data = {};

    this.getId = function () {
        return this.data['id'];
    };

    this.getCallerid_autoswitch = function () {
        return this.data['callerid_autoswitch'];
    };

    this.getFirstName = function () {
        return this.data['firstname'];
    };

    this.getLastName = function () {
        return this.data['lastname'];
    };
    this.getCurrency = function () {
        return this.data['currency'];
    };
    this.getStatus = function () {
        return this.data['status'];
    };
    this.setStatus = function (status) {
        this.data['status'] = status;
        global.set('auth', json_encode(this.data));
    };
}