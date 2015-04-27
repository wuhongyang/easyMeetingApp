define(['utils/appFunc','i18n!nls/lang','utils/tplManager',"SM"],function(appFunc,i18n,TM,SM){
    /* global $CONFIG */

    var passwordEditorView = {

        init: function(params){
            appFunc.bindEvents(params.bindings);

            setTimeout(function(){
                $$("input#oldPassword")[0].focus();
            },1000)
        },

        i18next: function(content){
            var renderData = {};
            renderData.title = i18n.passwordEdit.title;
            renderData.oldPassword = i18n.passwordEdit.old_psw;
            renderData.newPassword = i18n.passwordEdit.new_psw;
            renderData.newPasswordCheck = i18n.passwordEdit.new_psw_check;
            var output = TM.renderTpl(content,renderData);
            return output;
        }

    };

    return passwordEditorView;
});