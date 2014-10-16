window.callSip = function(str, callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "callSip", [str]);
};

window.cancelSip = function(str, callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "cancelSip", [str]);
};

window.registerSip = function(str, callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "registerSip", [str]);
};
