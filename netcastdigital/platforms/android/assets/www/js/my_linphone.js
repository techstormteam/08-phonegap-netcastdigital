window.callSip = function(str, callback) {
    cordova.exec(callback, function(err) {
        callback('Nothing to echo.');
    }, "LinPhonePlugin", "callSip", [str]);
};

window.cancelSip = function(str, callback) {
    cordova.exec(callback, function(err) {
        callback('Nothing to echo.');
    }, "LinPhonePlugin", "cancelSip", [str]);
};

window.registerSip = function(str, callback) {
    cordova.exec(callback, function(err) {
        callback('Nothing to echo.');
    }, "LinPhonePlugin", "registerSip", [str]);
};
