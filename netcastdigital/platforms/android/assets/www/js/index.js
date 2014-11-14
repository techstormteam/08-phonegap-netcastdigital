




/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var global = new Global();

var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
    },
    
    sipRegister: function(response) {
    	var sipUsername = response;
    	global.set('telno', sipUsername);
    },
    
    // Update DOM on a Received Event
    receivedEvent: function(id) {
    	//global.showPopup('', 'ffff', 'success');
    	// global.showPopup('dd', 'sss', 'error');
        if (global.get('auth') !== null) {
        	var user = global.getUser();
        	global.getSipUsernameApi(user.data.email, user.data.uipass, app.sipRegister);
        	global.general();
        }
    }
};

function Global() {
    this.debug = false;
    var data = {
        'apiUrl':'http://portal.netcastdigital.net/prayerline/selfserve/api',
        'sipUsernameUrl':'http://portal.netcastdigital.net/getInfo.php',
        'dashboardUrl':'http://portal.netcastdigital.net/prayerline/selfserve/',
        'quickTellerPaymentCompleteUrl':'http://portal.netcastdigital.net/prayerline/selfserve/payment-provider-interswitch-quickteller-complete',
        'quickTellerPaymentCode':'888889'
    };

    this.getSipUsernameUrl = function (){
        return data.sipUsernameUrl;
    };
    
    this.getApiUrl = function (){
        return data.apiUrl;
    };
    
    this.getDashboardUrl = function (){
        return data.dashboardUrl;
    };   
    
    this.getQuicktellerPaymentCompleteUrl = function (){
        return data.quickTellerPaymentCompleteUrl;
    };
    
    this.getQuicktellerPaymentCompleteUrl = function (){
        return data.quickTellerPaymentCompleteUrl;
    };
    
    this.getQuicktellerPaymentCode = function (){
        return data.quickTellerPaymentCode;
    };

    this.getRootUrl = function(){
        var loc = window.location.href;
        var dir = loc.substring(0, loc.lastIndexOf('/'));
        dir = dir + '/';
        return dir;
    }

    /**
     * @returns {User}
     */
    this.getUser = function() {
        if (this.get('auth') === null) {
            return null;
        }
        var auth = this.get('auth');
        var user = new User();
        user.data = json_decode(auth);
        return user;
    };
    
    this.updateUser = function(callback){
        var user = this.getUser();
        this.api('login', {username: user.data['email'], password: user.data['uipass']}, function(response){
            if (response.result === 'success') {
                global.set('auth', json_encode(response.details));
                callback();
            }
        });
    }

    /**
     * Gets a key from the key-vaue store, if it does not exist returns NULL
     * @param {string} key
     * @returns {Object}
     */
    this.get = function(key) {
        if (localStorage.getItem(key) !== null) {
            return window.localStorage.getItem(key);
        } else {
            return null;
        }
    };
    /**
     * Sets a value to a key
     * @param {string} key
     * @param {Object} value
     * @returns {void}
     */
    this.set = function(key, value) {
        if (value === null) {
            localStorage.removeItem(key, value);
        } else {
            localStorage.setItem(key, value);
        }
    };

    /**
     * Calls the API with the specified command and the given
     * parameters
     * @param {string} cmd
     * @param {Object} cmd
     * @param {function} callback_success
     * @param {function} callback_error
     * @param {function} callback_complete
     * @returns {void}
     */
    this.api = function(cmd, data, callback_success, callback_error, callback_complete) {
        var url = this.getApiUrl()+'?cmd=' + cmd + '&ts=' + Math.round(+new Date() / 1000);
        if (this.debug === true) {
            LogBucket.debug('7b61e6c1-90e8-477c-9a02-5e7be8ef32fa', 'Calling URL:' + url);
        }
        $.ajax({
            type: 'POST',
            url: url,
            crossDomain: true,
            cache: false,
            dataType: 'json',
            data: data
        }).success(function(data) {
            if (this.debug === true) {
                LogBucket.debug('7b61e6c1-90e8-477c-9a02-5e7be8ef32fa', 'Response: ');
            }
            callback_success(data);
        }).error(function(xhr, status, error) {
            if (this.debug === true) {
                LogBucket.debug('7b61e6c1-90e8-477c-9a02-5e7be8ef32fa', 'Error: ');
            }
            var msg = "<span style='color:red;'>There was an error</span>";
            $('#message').html(msg).show();
        }).complete(function() {
            if (this.debug === true) {
                LogBucket.debug('7b61e6c1-90e8-477c-9a02-5e7be8ef32fa', 'End');
            }
        });
    };
    
    /**
     * Calls the API to get sip username
     * parameters
     * @param {String} email
     * @param {String} password
     * @param {function} callback_success
     * @param {function} callback_error
     * @param {function} callback_complete
     * @returns {void}
     */
    this.getAppState = function(email, password, callback_success, callback_error, callback_complete) {
        var url = this.getSipUsernameUrl()+'?cmd=_app_state&email='+email+'&password='+password+'&app=prayline';
        if (this.debug === true) {
            LogBucket.debug('7b61e6c1-90e8-477c-9a02-5e7be8ef32fa', 'Calling URL:' + url);
        }
        $.ajax({
               type: 'GET',
               url: url,
               crossDomain: false,
               cache: false
               }).success(function(data) {
                          if (this.debug === true) {
                          LogBucket.debug('7b61e6c1-90e8-477c-9a02-5e7be8ef32fa', 'Response: ');
                          }
                          callback_success(data);
                          }).error(function(xhr, status, error) {
                                   if (this.debug === true) {
                                   LogBucket.debug('7b61e6c1-90e8-477c-9a02-5e7be8ef32fa', 'Error: ');
                                   }
                                   var msg = "<span style='color:red;'>There was an error</span>";
                                   $('#message').html(msg).show();
                                   }).complete(function() {
                                               if (this.debug === true) {
                                               LogBucket.debug('7b61e6c1-90e8-477c-9a02-5e7be8ef32fa', 'End');
                                               }
                                               });
    };
    
    /**
     * Calls the API to get sip username
     * parameters
     * @param {String} email
     * @param {String} password
     * @param {function} callback_success
     * @param {function} callback_error
     * @param {function} callback_complete
     * @returns {void}
     */
    this.getSipUsernameApi = function(email, password, callback_success, callback_error, callback_complete) {
        var url = this.getSipUsernameUrl()+'?cmd=_telno&email='+email+'&password='+password;
        if (this.debug === true) {
            LogBucket.debug('7b61e6c1-90e8-477c-9a02-5e7be8ef32fa', 'Calling URL:' + url);
        }
        $.ajax({
               type: 'GET',
               url: url,
               crossDomain: false,
               cache: false
               }).success(function(data) {
                          if (this.debug === true) {
                          LogBucket.debug('7b61e6c1-90e8-477c-9a02-5e7be8ef32fa', 'Response: ');
                          }
                          callback_success(data);
                          }).error(function(xhr, status, error) {
                                   if (this.debug === true) {
                                   LogBucket.debug('7b61e6c1-90e8-477c-9a02-5e7be8ef32fa', 'Error: ');
                                   }
                                   var msg = "<span style='color:red;'>There was an error</span>";
                                   $('#message').html(msg).show();
                                   }).complete(function() {
                                               if (this.debug === true) {
                                               LogBucket.debug('7b61e6c1-90e8-477c-9a02-5e7be8ef32fa', 'End');
                                               }
                                               });
    };
    
    /*
     * 
     * @param {type} title
     * @param {type} message
     * @param {type} type - error / success
     * @returns {undefined}
     */
    this.showPopup = function(title, message, type, callback) {
        if (type === '' || type === undefined) {
            if (callback === ''|| callback === undefined) {
            	sweetAlert(title,message,'error');
            } else {
            	swal({   
            		title: title,   
            		text: message,   
            		type: 'error',   
//            		showCancelButton: true,   
//            		confirmButtonColor: "#DD6B55",   
//            		confirmButtonText: "OK",   
            		closeOnConfirm: false }, 
            		callback);
            }
        } else {
        	if (callback === ''|| callback === undefined) {
        		sweetAlert(title, message, type);
        	} else {
        		swal({   
            		title: title,   
            		text: message,   
            		type: type,   
//            		showCancelButton: true,   
//            		confirmButtonColor: "#DD6B55",   
//            		confirmButtonText: "OK",   
            		closeOnConfirm: false }, 
            		callback);
        	}
        }
    };
    
    this.deregisterUserCall = function(registerStatus) {
    	var sipUsername = global.get('telno');
    	if (sipUsername !== null) {
    		var obj1 = this;
        	window.deregisterSip(sipUsername, registerStatus, function(message) {
        		obj1.showPopupInternetNotAvailable(message);
            });
    	}
    };
    
    this.registerSipUser = function() {
    	var user = global.getUser();
    	var email = user.data.email;
    	var password = user.data.uipass;
    	if (email !== null && password !== null) {
    		this.getAppState(email, password, this.deregisterUserCall);
        }
    };
    
    this.registerScheduled = function () {
    	this.registerSipUser();
    	var obj = this;
    	setInterval(function() {
    		obj.registerSipUser();
    	}, 60000);
    };
    
    this.general = function () {
    	this.registerScheduled();
    };
}


function is_numeric(mixed_var) {
    return (typeof mixed_var === 'number' || typeof mixed_var === 'string') && mixed_var !== '' && !isNaN(mixed_var);
}


function json_decode(str_json) {
    var json = this.window.JSON;
    if (typeof json === 'object' && typeof json.parse === 'function') {
        try {
            return json.parse(str_json);
        } catch (err) {
            if (!(err instanceof SyntaxError)) {
                throw new Error('Unexpected error type in json_decode()');
            }
            this.php_js = this.php_js || {};
            this.php_js.last_error_json = 4; // usable by json_last_error()
            return null;
        }
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
    var j;
    var text = str_json;

    // Parsing happens in four stages. In the first stage, we replace certain
    // Unicode characters with escape sequences. JavaScript handles many characters
    // incorrectly, either silently deleting them, or treating them as line endings.
    cx.lastIndex = 0;
    if (cx.test(text)) {
        text = text.replace(cx, function(a) {
            return '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        });
    }

    // In the second stage, we run the text against regular expressions that look
    // for non-JSON patterns. We are especially concerned with '()' and 'new'
    // because they can cause invocation, and '=' because it can cause mutation.
    // But just to be safe, we want to reject all unexpected forms.
    // We split the second stage into 4 regexp operations in order to work around
    // crippling inefficiencies in IE's and Safari's regexp engines. First we
    // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
    // replace all simple value tokens with ']' characters. Third, we delete all
    // open brackets that follow a colon or comma or that begin the text. Finally,
    // we look to see that the remaining characters are only whitespace or ']' or
    // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.
    if ((/^[\],:{}\s]*$/).
            test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@').
                    replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']').
                    replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

        // In the third stage we use the eval function to compile the text into a
        // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
        // in JavaScript: it can begin a block or an object literal. We wrap the text
        // in parens to eliminate the ambiguity.
        j = eval('(' + text + ')');

        return j;
    }

    this.php_js = this.php_js || {};
    this.php_js.last_error_json = 4; // usable by json_last_error()
    return null;
}

function json_encode(mixed_val) {
    var retVal, json = this.window.JSON;
    try {
        if (typeof json === 'object' && typeof json.stringify === 'function') {
            retVal = json.stringify(mixed_val); // Errors will not be caught here if our own equivalent to resource
            //  (an instance of PHPJS_Resource) is used
            if (retVal === undefined) {
                throw new SyntaxError('json_encode');
            }
            return retVal;
        }

        var value = mixed_val;

        var quote = function(string) {
            var escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
            var meta = {// table of character substitutions
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"': '\\"',
                '\\': '\\\\'
            };

            escapable.lastIndex = 0;
            return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
                var c = meta[a];
                return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
        };

        var str = function(key, holder) {
            var gap = '';
            var indent = '    ';
            var i = 0; // The loop counter.
            var k = ''; // The member key.
            var v = ''; // The member value.
            var length = 0;
            var mind = gap;
            var partial = [];
            var value = holder[key];

            // If the value has a toJSON method, call it to obtain a replacement value.
            if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }

            // What happens next depends on the value's type.
            switch (typeof value) {
                case 'string':
                    return quote(value);

                case 'number':
                    // JSON numbers must be finite. Encode non-finite numbers as null.
                    return isFinite(value) ? String(value) : 'null';

                case 'boolean':
                case 'null':
                    // If the value is a boolean or null, convert it to a string. Note:
                    // typeof null does not produce 'null'. The case is included here in
                    // the remote chance that this gets fixed someday.
                    return String(value);

                case 'object':
                    // If the type is 'object', we might be dealing with an object or an array or
                    // null.
                    // Due to a specification blunder in ECMAScript, typeof null is 'object',
                    // so watch out for that case.
                    if (!value) {
                        return 'null';
                    }
                    if ((this.PHPJS_Resource && value instanceof this.PHPJS_Resource) || (window.PHPJS_Resource && value instanceof window.PHPJS_Resource)) {
                        throw new SyntaxError('json_encode');
                    }

                    // Make an array to hold the partial results of stringifying this object value.
                    gap += indent;
                    partial = [];

                    // Is the value an array?
                    if (Object.prototype.toString.apply(value) === '[object Array]') {
                        // The value is an array. Stringify every element. Use null as a placeholder
                        // for non-JSON values.
                        length = value.length;
                        for (i = 0; i < length; i += 1) {
                            partial[i] = str(i, value) || 'null';
                        }

                        // Join all of the elements together, separated with commas, and wrap them in
                        // brackets.
                        v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                        gap = mind;
                        return v;
                    }

                    // Iterate through all of the keys in the object.
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }

                    // Join all of the member texts together, separated with commas,
                    // and wrap them in braces.
                    v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                    gap = mind;
                    return v;
                case 'undefined':
                    // Fall-through
                case 'function':
                    // Fall-through
                default:
                    throw new SyntaxError('json_encode');
            }
        };

        // Make a fake root object containing our value under the key of ''.
        // Return the result of stringifying the value.
        return str('', {
            '': value
        });

    } catch (err) { // Todo: ensure error handling above throws a SyntaxError in all cases where it could
        // (i.e., when the JSON global is not available and there is an error)
        if (!(err instanceof SyntaxError)) {
            throw new Error('Unexpected error type in json_encode()');
        }
        this.php_js = this.php_js || {};
        this.php_js.last_error_json = 4; // usable by json_last_error()
        return null;
    }
}

var month_names_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/**
 * Retrns GET parameter from URL
 * @param {string} parameter name
 * @returns {string|null} parameter value or null
 */
function getUrlParameter(name) {
    var result = decodeURI(
            (RegExp(name + '=' + '(.+?)(&|$)').exec(location.search) || [, null])[1]
            );
    if (result === 'null') {
        result = null;
        return null;
    }
    return decodeURIComponent(result);
}
function balance_display_in_button() {
    var user = global.getUser();
    var user_id = user.getId();
    var currency = user.getCurrency();
    global.api('get_balance_by_user_id', {user_id: user_id, currency: currency}, balance_display_in_button_process);
}

function balance_display_in_button_process(result) {
    var balance = result.details['balance'];
    $('#make_payment').html("[" + balance + "] - Make Payment").button("refresh");
}
