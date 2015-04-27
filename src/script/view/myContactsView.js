define(['utils/appFunc','i18n!nls/lang','utils/tplManager',"SM"],function(appFunc,i18n,TM,SM){
    /* global $CONFIG */

    var myContactsView = {

        init: function(params){
            appFunc.bindEvents(params.bindings);
        },

        showAddMyContactPopup:function(){
            var output = TM.renderTplById('addUserTemplate',{
                "name" : 'popup-add-mycontact',
                "title" : '编辑',
                "username" : "",
                "email" : ""
            });
            EM.popup(output);
            output = null;
        },

        showUpdateMyContactPopup:function(contactData){
            var output = TM.renderTplById('addUserTemplate',{
                "name" : 'popup-update-mycontact',
                "title" : '编辑',
                "username" : contactData.name,
                "email" : contactData.address
            });
            EM.popup(output);
            output = null;
        },

        i18next: function(content){
            var renderData = {};
            renderData.title = i18n.myContact.my_contacts;
            var output = TM.renderTpl(content,renderData);
            return output;
        },

        updateUI: function(data){
            var output = TM.renderTplById("myContactsItemTemplate",data);
            $$("#my-contacts-list ul").html(output);
        }

    };

    return myContactsView;
});