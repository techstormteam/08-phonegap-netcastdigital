function LogBucket() {
    this.url = 'http://logbucket.org/log.php';

    this.log = function(key, message, level) {
        var message = base64_encode(message);
        var script = document.createElement('script');
        script.src = this.url + '?key=' + encodeURIComponent(key) + '&level=' + encodeURIComponent(level) + '&message=' + encodeURIComponent(message);
        document.getElementsByTagName('head')[0].appendChild(script);
        return 'logged';
    };

    this.alert = function(key, message) {
        this.log(key, message, 'alert');
    };

    this.critical = function(key, message) {
        this.log(key, message, 'critical');
    };

    this.debug = function(key, message) {
        this.log(key, message, 'debug');
    };

    this.emergency = function(key, message) {
        this.log(key, message, 'emergency');
    };

    this.error = function(key, message) {
        this.log(key, message, 'error');
    };

    this.info = function(key, message) {
        this.log(key, message, 'info');
    };

    /**
     * Base64 from phpjs.org project
     */
    function base64_encode(data) {
        var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
        var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, enc = "", tmp_arr = [];

        if (!data) {
            return data;
        }

        do { // pack three octets into four hexets
            o1 = data.charCodeAt(i++);
            o2 = data.charCodeAt(i++);
            o3 = data.charCodeAt(i++);

            bits = o1 << 16 | o2 << 8 | o3;

            h1 = bits >> 18 & 0x3f;
            h2 = bits >> 12 & 0x3f;
            h3 = bits >> 6 & 0x3f;
            h4 = bits & 0x3f;

            // use hexets to index into b64, and append result to encoded string
            tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
        } while (i < data.length);
        enc = tmp_arr.join('');
        var r = data.length % 3;

        return (r ? enc.slice(0, r - 3) : enc) + '==='.slice(r || 3);

    }

}
LogBucket = new LogBucket();