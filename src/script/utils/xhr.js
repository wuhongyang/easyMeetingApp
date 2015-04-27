define(['utils/appFunc',
        'i18n!nls/lang',
        'components/networkStatus','mustache'],function(appFunc,i18n,networkStatus,mustache) {

    //var apiServerHost = window.location.href;

    var xhr = {
        //webServerAddress : "http://192.168.133.122/tpaas",//
        webServerAddress : "http://tpm.onecc.me/tpaas",
        config:{
            "createaCtrl_VMR":             "/currentuser/tenant/vmrs/idle",
            "user_login":                  "/login",
            "currentuser":                 "/currentuser",
            "sessionTouch":                "/session/touch",
            "createMeeting":               "/currentuser/conference",
            "createbCtrl_addUser":         "/currentuser/personal/contact",
            "createbCtrl_addTerminals":    "/conference/{{id}}/terminal",
            "log-out":                     "/logout",
            "contactsAll":                 "/currentuser/all/contacts",
            "appCtrl_going":               "/currentuser/conference/going",
            "appCtrl_meetingStatus":       "/conference/{{id}}/status",
            "appCtrl_history":             "/currentuser/conference/history",
            "historyCtrl_going":           "/currentuser/conference/going",
            "historyCtrl_history":         "/currentuser/conference/history",
            "historyCtrl_historyInfinite": "/currentuser/conference/history",
            "meetingCtrl_Store":           "/conference/{{id}}",
            "finishControl":               "/conference/{{id}}/end",
            "my-contact":                  "/currentuser/personal/contact",
            "my-contacts":                 "/currentuser/personal/contacts",
            "edit-password":               "/currentuser/password",
            "my-contact-delete":           "/currentuser/personal/contact/{{id}}",
            "terminals-status":            "/conference/{{id}}/status",
            "cut-terminals":               "/conference/{{id}}/terminal/hangup",
            "add-terminals":               "/conference/{{id}}/terminal",
            "connect-terminals":           "/conference/{{id}}/terminal/call",
            "mute-terminals":              "/conference/{{id}}/terminal/audio/mute",
            "video-terminals":             "/conference/{{id}}/terminal/video/mute",
            "screen-mode":                 "/conference/{{id}}/screenmode/{{screenmode}}",
            "new-password":                "/user/password/reset?{{email}}"
        },
        
        search: function(code, array){
            for (var i=0;i< array.length; i++){
                if (array[i].code === code) {
                    return array[i];
                }
            }
            return false;
        },

        getRequestURL: function(options){
           
            var query = options.query || {};
            var func = options.func || '';

            var apiServer = this.config[func] + '?';

            var name;
            if(apiServer.indexOf('{{') > -1){
                apiServer = mustache.render(apiServer,_.extend({},query,options.data));
            }
            if (options.method === "GET") {
                options.data.JSESSIONID = appFunc.localData.get('jid');
                options.data.mobile = true;
            } else {
                if (func !== 'user_login') {
                    query.JSESSIONID = appFunc.localData.get('jid');
                }
                query.mobile = true;
            }
            for (name in query) {
                apiServer += name + '=' + query[name] + '&';
            }

            return xhr.webServerAddress +  apiServer.replace(/&$/gi, '');
        },
        checkConnection : function(){
            if(appFunc.isPhonegap()){
                //Check network connection
                var network = networkStatus.checkConnection();
                if(network === 'NoNetwork'){

                    EM.alert(i18n.error.no_network,function(){
                        EM.hideIndicator();
                        EM.hidePreloader();
                    });

                    return false;
                }
            }
            return true;
        },
        simpleCall: function(options,callback,error){
            options = options || {};
            options.data = options.data ? options.data : {};

            //If you access your server api ,please user `post` method.
            options.method = options.method || 'GET';
            //options.method = options.method || 'POST';
            
            if(!xhr.checkConnection){
                return false;
            }
            // options.start = options.start || function(xhr){
            //     //xhr.setRequestHeader("Accept", "application/json; version=1.0");
            // };


            options.headers = options.headers || {};
            //增加版本号 
            options.headers.Accept = options.headers.Accept || "application/json; version=1.0"
            //
            options.url = xhr.getRequestURL(options);
            options.statusCode = options.statusCode || {};
            
            options.success = (function(success){
                return function(data,statusCode,XHR){
                    //EM.hideIndicator();
                    //EM.hidePreloader();
                    try{
                        data = JSON.parse(data);
                    }catch(e){
                        data = '';
                    }
                    if((typeof(success) === 'function')&&success(data,statusCode,XHR)===false){
                        return false
                    };
                    if((typeof(callback) === 'function') && callback(data)===false){
                        return false
                    };
                    appFunc.postMessage(options.func,XHR.responseText);
                }
            })(options.success,callback);

            options.complete = (function(complete){
                return function(XHR) {
                    //EM.hideIndicator();
                    //EM.hidePreloader();
                    if (XHR.status === 401) {
                        appFunc.postMessage('doLogin', XHR.responseText);
                        //EM.alert('当前功能需要登录后才能执行，请先登录！');
                    } else if (XHR.status !== 200) {
                        (typeof(error) === 'function') && error(XHR);
                    }
                    if ((typeof(complete) === 'function') && complete(XHR) === false) {
                        return false;
                    };
                }
            })(options.complete);

            // options.xhrFields = options.xhrFields || {};
            // //增加timeout
            
            // if(!options.xhrFields.timeout){
            //     options.xhrFields.timeout = 3000;
            //     options.xhrFields.ontimeout = options.xhrFields.ontimeout || options.complete
            // }
            
            return $$.ajax(options);

        }

    };
    return xhr;
});
