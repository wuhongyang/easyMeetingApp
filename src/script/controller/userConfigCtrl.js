define(['utils/appFunc','utils/xhr','VM','SM','i18n!nls/lang'],function(appFunc,xhr,VM,SM,i18n){

    var Ctrl = {

        init: function(query){

            var bindings = [
                {
                    element: '.uc-button',
                    event:   'click',
                    handler: Ctrl.logout
                },{
                    element: '.update-button',
                    event:   'click',
                    handler: Ctrl.checkVersion
                }
            ];

            VM.module('userConfigView').init({
                bindings:bindings
            });
        },
        checkVersion: function(){
            var version = $CONFIG.version;
            var releaseTime = $CONFIG.release_time;
            var userAgent  = navigator ? navigator.userAgent: '';
            EM.alert(i18n.setting.current_version + ' V' + version + '<br/>[ ' + releaseTime + ' ]<br/>' + userAgent);
        },
        logout: function () {
            EM.confirm(i18n.setting.confirm_logout,"",function(){

                EM.showPreloader(i18n.setting.logout);

                xhr.simpleCall({
                    func:'log-out',
                    complete:function(XHR){
                        if(XHR.status != 200)
                        {
                            EM.alert(JSON.parse(XHR.response).msg,function(){
                              EM.hidePreloader();
                            });
                        }
                    }
                },function(response){
                    if(response.success === true){
                        appFunc.clearUserData();
                        mainView.loadPage('page/login.html?from=logout');
                    }else{
                    }
                    EM.hidePreloader();
                });
            });
        }

    };

    return Ctrl;
});