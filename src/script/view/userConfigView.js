define(['utils/appFunc','i18n!nls/lang','utils/tplManager',"SM"],function(appFunc,i18n,TM,SM){
    /* global $CONFIG */

    var userConfigView = {

        init: function(params){
            appFunc.bindEvents(params.bindings);
        },

        i18next: function(content){
            var renderData = {};
            renderData.title = i18n.app.name;//i18n.index.setting;
            renderData.myContacts = i18n.myContact.my_contacts;
            renderData.passwordEdit = i18n.passwordEdit.title;
            renderData.about = i18n.setting.about;
            renderData.checkUpdate = i18n.setting.check_update;

            renderData.logout = i18n.setting.login_out;
            var output = TM.renderTpl(content,renderData);
            return output;
        }

    };

    return userConfigView;
});