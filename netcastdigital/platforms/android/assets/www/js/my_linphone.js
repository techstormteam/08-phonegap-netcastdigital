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

window.registerSip = function(sipUsername, password, callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "registerSip", [sipUsername, password]);
};

window.pauseSip = function(sipUsername, password, callback) {
    cordova.exec(callback, function(err) {
        callback(err);
    }, "LinPhonePlugin", "pauseSip", [sipUsername, password]);
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