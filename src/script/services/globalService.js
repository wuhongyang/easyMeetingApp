define(['aes'], function(aes) {
    var CONFIG = null;

    var globalService = {

        init: function(){
            if (!CONFIG) {
                CONFIG = {};
            }
            CONFIG.currentUser = {};
            //if (localStorage.getItem('sid')) {
                CONFIG.sid = localStorage.getItem('sid') || null;
            //}
            if(localStorage.getItem('user')){
                CONFIG.currentUser = JSON.parse(localStorage.getItem('user'));
            }
            //if(localStorage.getItem('autologin')){
                CONFIG.autoLogin = localStorage.getItem('autologin');
                CONFIG.autoLogin = !CONFIG.autoLogin ? '0' : CONFIG.autoLogin;
            //}
            
        },
        secret:'just stupid',

        getCurrentUser: function(){
            return CONFIG.currentUser;
        },

        getSid: function(){
            var m = $$.parseUrlQuery(window.location.href || '');
            return m.sid || localStorage.getItem('sid');
        },

        setCurrentUserSid:function(data){
            var sid;
            data.time = new Date().getTime();
            data = JSON.stringify(data);
            sid = aes.enc(data,globalService.secret);
            CONFIG.sid = sid;
            localStorage.setItem('sid',sid);

        },

        setCurrentUser: function(user){
            CONFIG.currentUser = user;
            localStorage.setItem('user',JSON.stringify(user));
        },

        setAutoLogin: function() {
            CONFIG.autoLogin = (CONFIG.autoLogin === '0') ? '1' : '0';
            
            localStorage.setItem('autologin', CONFIG.autoLogin);
        },
        
        getAutoLogin: function() {
            return CONFIG.autoLogin === '1' ? true : false;
        },

        removeCurrentUser: function(){
            CONFIG.currentUser = {};
            localStorage.removeItem('user');
            localStorage.removeItem('sid');
        },

        isLogin: function(){
            if(CONFIG.autoLogin === '1'){
                if(CONFIG.sid){
                    return JSON.parse(aes.dec(CONFIG.sid, globalService.secret))
                }
                return false;
            }else{
                return false;
            }
        }

    };

    globalService.init();

    return globalService;
});