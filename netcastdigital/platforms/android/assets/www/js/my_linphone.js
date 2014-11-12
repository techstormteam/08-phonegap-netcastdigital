window.callSip = function(callTo, sipUsername, password, callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "callSip", [callTo, sipUsername, password]);
};

window.cancelSip = function(str, callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "cancelSip", [str]);
};

window.registerSip = function(sipUsername, password, callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "registerSip", [sipUsername, password]);
};

window.pauseSip = function(str, callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "pauseSip", [str]);
};

window.backWind = function(sipUsername, password, callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "backWind", [sipUsername, password]);
};

window.forwardWind = function(sipUsername, password, callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "forwardWind", [sipUsername, password]);
};

window.signOut = function(sipUsername, callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "signOut", [sipUsername]);
};

window.deregisterSip = function(sipUsername, registerStatus, callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "deregisterSip", [sipUsername, registerStatus]);
};
