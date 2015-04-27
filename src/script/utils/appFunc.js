define(['i18n!nls/lang'],function(i18n){

    var $$ = Dom7;

    var appFunc = {
        isFontFaceSupported: function() {
            if (!!navigator.userAgent.match(/(Newman K2)|(ZTE Q503U)|(Android (2.0|2.1))|(Nokia)|(OSRE\/)|(Opera (Mini|Mobi))|(w(eb)?OSBrowser)|(UCWEB)|(Windows Phone)|(XBLWP)|(ZuneWP)/)) {
                return false;
            }
            var sheet,
                doc = document,
                head = doc.head || doc.getElementsByTagName('head')[0] || docElement,
                style = doc.createElement("style"),
                impl = doc.implementation || {
                    hasFeature: function() {
                        return false;
                    }
                };

            style.type = 'text/css';
            head.insertBefore(style, head.firstChild);
            sheet = style.sheet || style.styleSheet;

            var supportAtRule = impl.hasFeature('CSS2', '') ?
                function(rule) {
                    if (!(sheet && rule)) {
                        return false;
                    }
                    var result = false;
                    try {
                        sheet.insertRule(rule, 0);
                        result = !(/unknown/i).test(sheet.cssRules[0].cssText);
                        sheet.deleteRule(sheet.cssRules.length - 1);
                    } catch (e) {}
                    return result;
                } :
                function(rule) {
                    if (!(sheet && rule)) {
                        return false;
                    }
                    sheet.cssText = rule;

                    return sheet.cssText.length !== 0 && !(/unknown/i).test(sheet.cssText) &&
                        sheet.cssText
                        .replace(/\r+|\n+/g, '')
                        .indexOf(rule.split(' ')[0]) === 0;
                };

            return supportAtRule('@font-face{font-family:"font";src:"font.ttf";}');

        },
        localData:{
            cache:{},
            get : function(key){
                return window.localStorage.getItem(key)
            },
            set : function(key,data){
                if(/object|array/.test(typeof data)){
                    data = JSON.stringify(data);
                }
                return window.localStorage.setItem(key,data);
            },
            remove : function(key){
                return window.localStorage.removeItem(key);
            },
            clear : function(){
                return window.localStorage.clear();
            }
        },
        clearUserData : function(){
            appFunc.localData.remove('sid');
            appFunc.localData.remove('jid');
            appFunc.localData.remove('user');
            appFunc.localData.remove('historyMeeting');
            appFunc.localData.remove('createaCtrl_VMR');
            appFunc.localData.remove('topContacts');
            appFunc.localData.remove('personalContacts');
            appFunc.localData.remove('tenantContacts');
            appFunc.localData.remove('currentMeetingId');
            appFunc.localData.remove('myContacts');
        },
        isPhonegap: function() {
            return (typeof(cordova) !== 'undefined' || typeof(phonegap) !== 'undefined');
        },

        isEmail: function(str){
            var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
            return reg.test(str);
        },

        getPageNameInUrl: function(url){
            url = url || '';
            var arr = url.split('.');
            return arr[0];
        },

        isEmpty: function(obj) {
            for(var prop in obj) {
                if(obj.hasOwnProperty(prop))
                    return false;
            }

            return true;
        },

        timeFormat: function(ms){

            ms = ms * 1000;

            var d_second,d_minutes, d_hours, d_days;
            var timeNow = new Date().getTime();
            var d = (timeNow - ms)/1000;
            d_days = Math.round(d / (24*60*60));
            d_hours = Math.round(d / (60*60));
            d_minutes = Math.round(d / 60);
            d_second = Math.round(d);
            if (d_days > 0 && d_days < 2) {
                return d_days + i18n.global.day_ago;
            } else if (d_days <= 0 && d_hours > 0) {
                return d_hours + i18n.global.hour_ago;
            } else if (d_hours <= 0 && d_minutes > 0) {
                return d_minutes + i18n.global.minute_ago;
            } else if (d_minutes <= 0 && d_second >= 0) {
                return i18n.global.just_now;
            } else {
                var s = new Date();
                s.setTime(ms);
                return (s.getFullYear() + '-' + f(s.getMonth() + 1) + '-' + f(s.getDate()) + ' '+ f(s.getHours()) + ':'+ f(s.getMinutes()));
            }

            function f(n){
                if(n < 10)
                    return '0' + n;
                else
                    return n;
            }
        },

        getCharLength: function(str){
            var iLength = 0;
            for(var i = 0;i<str.length;i++)
            {
                if(str.charCodeAt(i) >255)
                {
                    iLength += 2;
                }
                else
                {
                    iLength += 1;
                }
            }
            return iLength;
        },

        matchUrl: function(string){
            var reg = /((http|ftp|https):\/\/)?[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&;:\/~\+#]*[\w\-\@?^=%&;\/~\+#])?/g;

            string = string.replace(reg,function(a){
                if(a.indexOf('http') !== -1 || a.indexOf('ftp') !== -1){
                    return '<a href=\"#\" onclick=\"event.stopPropagation();window.open(\'' + a + '\',\'_blank\')\">' + a + '</a>';
                }
                else
                {
                    return '<a href=\"#\" onclick=\"event.stopPropagation();window.open(\'http://' + a + '\',\'_blank\')\">' + a + '</a>';
                }
            });
            return string;
        },

        bindEvents: function(bindings) {
            for (var i in bindings) {
                if(bindings[i].selector) {
                    $$(bindings[i].element)
                        .on(bindings[i].event,bindings[i].selector , bindings[i].handler);
                }else{
                    $$(bindings[i].element)
                        .on(bindings[i].event, bindings[i].handler);
                }
            }
        },
        //获取当前时间
        getDate:function(){
            return appFunc.dateFormat(null,'Y/m/d H:i')
        },
        postMessage : function(key,data){
            window.postMessage({key:key,data:data},'*');
        },
        isActions : function(key){
            return $$('[data-actions-key=' + key + ']').length > 0 ? true : false;
        },
        isPopup : function(key){
            return $$('.popup.' + key + '').length > 0 ? true : false;
        },
        /**
         * dateFormat.js
         *
         * Year
         *   Y: A full numeric representation of a year, 4 digits.
         * Month
         *   m: Numeric representation of a month, with leading zeros.
         *   n: Numeric representation of a month, without leading zeros.
         * Day
         *   d: Day of the month, 2 digits with leading zeros.
         *   j: Day of the month without leading zeros.
         * Hour
         *   H: 24-hour format of an hour with leading zeros.
         *   h: 12-hour format of an hour with leading zeros.
         * Minute
         *   i: Minutes with leading zeros.
         * Second
         *   s: Seconds, with leading zeros.
         */
        dateFormat: function(d, format) {
            //prepare
            var year, month, date, hours, minutes, seconds;
            if (!format) 
                format = "Y-m-d H:i:s";

            if(d instanceof Date){

            }else if((typeof d) === "number"){
                d = new Date(d);
            }else{
                d = new Date();
            }
            year = d.getFullYear();
            month = d.getMonth() + 1;
            date = d.getDate();
            hours = d.getHours();
            minutes = d.getMinutes();
            seconds = d.getSeconds();

            //create partials used replacement
            var pad = function(n) {
                return n < 10 ? '0' + n : n
            };
            var partials = {
                Y: year,
                n: month,
                m: pad(month),
                j: date,
                d: pad(date),
                h: hours > 12 ? pad(hours - 12) : pad(hours),
                H: pad(hours),
                i: pad(minutes),
                s: pad(seconds)
            };

            //replace
            var regExps = [/Y/gi, /n/gi, /m/gi, /j/gi, /d/gi, /h/gi, /H/gi, /i/gi, /s/gi];
            regExps.forEach(function(regExp) {
                format = format.replace(regExp, function(match) {
                    return partials[match];
                });
            });

            return format;
        }
    };

    return appFunc;
});