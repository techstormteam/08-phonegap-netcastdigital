function User(){
    this.data = {};

    this.getId = function(){
      return this.data['id'];
    };
    
     this.getCallerid_autoswitch = function(){
      return this.data['callerid_autoswitch'];
    };

    this.getFirstName = function(){
        return this.data['firstname'];
    };

    this.getLastName = function(){
        return this.data['lastname'];
    };
    this.getCurrency = function(){
        return this.data['currency'];
    };
    //this.getCredit = function(){
    //    return this.data['credit'];
    //};
}