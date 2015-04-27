define(['utils/appFunc','utils/xhr','VM','SM','i18n!nls/lang','GS'],function(appFunc,xhr,VM,SM,i18n,GS){

    var Ctrl = {

        init: function(query){

            var bindings = [
                {
                    element: '#pe-btn-right',
                    event:   'click',
                    handler: Ctrl.onModifyPassword
                }
            ];

            VM.module('passwordEditorView').init({
                bindings:bindings
            });
        },

        onModifyPassword: function () {

            var oldPsw = $$('#oldPassword').val();
            if(oldPsw === ''){
                EM.alert(i18n.passwordEdit.required_old_psw);
                return;
            }

            var newPsw = $$('#newPassword').val();
            if(newPsw === '')
            {
                EM.alert(i18n.passwordEdit.required_new_psw);
                return;
            }

            var newPswCheck = $$('#newPasswordCheck').val();
            if(newPswCheck === '')
            {
                EM.alert(i18n.passwordEdit.required_new_psw_check);
                return;
            }

            if(newPsw !== newPswCheck)
            {
                EM.alert(i18n.passwordEdit.new_psw_checked_err);
                return;
            }
           
            EM.showPreloader(i18n.global.wait);

            xhr.simpleCall({
                func:'edit-password',
                data:JSON.stringify({
                    "oldPassword": oldPsw,
                    "password": newPsw
                }),
                method:'PUT',
                contentType:'application/json',
                complete:function(XHR){
                    if(XHR.status != 200)
                    {
                        EM.alert(JSON.parse(XHR.response).msg,function(){
                              EM.hidePreloader();
                        });
                    }else{
                        setTimeout(function(){
                            EM.hidePreloader();
                            EM.hideIndicator();
                        },300);
                    }
                }
            },function(response){
                EM.hidePreloader();
                if(response.success === true){
                    // EM.alert({"text":"修改成功","hold":2000});
                    GS.setCurrentUserSid({
                        "username":GS.getCurrentUser().email,
                        "password":newPsw
                    });//修改sid
                    mainView.goBack();
                }else{
                }
            });
        },
    };

    return Ctrl;
});