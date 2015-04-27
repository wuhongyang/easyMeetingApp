define(['utils/appFunc','i18n!nls/lang','utils/tplManager','SM'],function(appFunc,i18n,TM,SM){
    /* global $CONFIG */

    var createaView = {

        init: function(params){
            appFunc.bindEvents(params.bindings);
        },
        showAddUserPopup:function(){
            var output = TM.renderTplById('addUserTemplate',{
                "name" : 'popup-add-meeting-user',
                "title" : '添加参会方'
            });
            EM.popup(output);
            output = null;
        },
        showSelectedPopup:function(){
            // var selected  = SM.contactsStore.where({
            //                 checked: true
            //             });
            // SM.createSelectedUserStore.reset(_.pluck(selected,'attributes'));
            var output = TM.renderTplById('createShowSelectedTemplate', {
                count: SM.createSelectedUserStore.length,
                selected: SM.createSelectedUserStore.toJSON()
            });
            EM.popup(output);
            output = null;
            selected = null;
        },
        isEmpty: function(){
            return $$('#contacts-content .list-group li').length === 2
        },
        beforeLoadContacts: function(){
            if(createaView.isEmpty()) {
                EM.showIndicator();
                return true;
            }else {
                return false;
            }
        },
        buildList : function(type){
            if(type === 'topContactsStore'){
                return TM.renderTplById('contactListTemplate', {
                contacts: _.sortBy(SM.topContactsStore.toJSON(), function(item) {
                    /*return item.times;*/
                     return item.firstLetter.replace(/[^\d\w]/g,'');
                })
            });
            }else{          
                return TM.renderTplById('contactListTemplate', {
                contacts: _.sortBy(SM.contactsStore.toJSON(), function(item) {
                    return item.firstLetter.replace(/[^\d\w]/g,'');
                })
            });
            }
        },
        render : function(type){

            var list = createaView.buildList(type);
            var dataType = type === 'topContactsStore'? 'top':'all';
            var listGroup = $$('#contacts-content>.list-group.'+dataType+'>ul');
            setTimeout(function(){
                listGroup.children('li').remove();
                if(dataType === 'top'){
                    listGroup.html('<li class="list-group-title">我经常选择的</li>'+list);
                }else{
                    listGroup.html('<li class="list-group-title">全部</li>'+list);
                    $$('#badge-create-users').text(SM.createSelectedUserStore.length);
                }
                EM.hideIndicator();
            },500);
        },
        
        i18next: function(content) {
            var topContacts, personalContacts, tenantContacts;
            var localData = appFunc.localData;
            var renderData = {
                topContacts: '',
                contacts: '',
                count : 0
            };

            topContacts = localData.get('topContacts');
            personalContacts = localData.get('personalContacts');
            tenantContacts = localData.get('tenantContacts');

            if (topContacts && SM.topContactsStore.length < 1) {
                topContacts = JSON.parse(topContacts);
                if (topContacts.length) {
                    SM.topContactsStore.add(topContacts);
                }
            };
            renderData.topContacts = createaView.buildList('topContactsStore');

            if (SM.contactsStore.length < 1 && (personalContacts || tenantContacts)) {
                personalContacts = JSON.parse(personalContacts);
                tenantContacts = JSON.parse(tenantContacts);
                SM.contactsStore.add(topContacts);
                SM.contactsStore.add(tenantContacts,{merge:true});
                SM.contactsStore.add(personalContacts,{merge:true});
                
                
            }
            renderData.contacts = createaView.buildList('contactsStore');

            renderData.count = SM.createSelectedUserStore.length;
            return TM.renderTpl(content, renderData);
        }

    };

    return createaView;
});