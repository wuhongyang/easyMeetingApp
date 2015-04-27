define(['utils/appFunc','utils/xhr','VM','SM','FD'],function(appFunc,xhr,VM,SM,FD){

    var Ctrl = {

        init: function(query){
            var meetingUser;
            var bindings = [
            {
                element:'.list-group',
                selector:'input[type=checkbox]',
                event:'change',
                handler:Ctrl.checkboxChange
            },
            {
                element: '#btn-create-done',
                event:   'click',
                handler: Ctrl.doDone
            },{
                element: '#btn-create-add-user',
                event:   'click',
                handler: Ctrl.addUser
            },
            {
                element:'#btn-show-selected',
                event: 'click',
                handler:Ctrl.showSelected
            },{
                element:'.nameBar',
                selector:'a',
                event: 'click',
                handler:Ctrl.scrollToName
            }
            ];
            VM.module('createbView').init({
                bindings: bindings
            });
            Ctrl.loadContacts();
            SM.contactsStore.off('change').on('change',Ctrl.updateUI);
            SM.contactsStore.off('reset').on('reset',Ctrl.refreshUI.bind(Ctrl,'contactsStore'));
            SM.topContactsStore.off('reset').on('reset',Ctrl.refreshUI.bind(Ctrl,'topContactsStore'));
            //SM.contactsStore.off('add').on('add',Ctrl.updateUI);
            //
            //Ctrl.count = SM.createSelectedUserStore.length;
            if(query.from === "meetingCtrl" && query.id){
                Ctrl.model = 'meetingCtrl';
                Ctrl.id = query.id;
                var meetingUser = SM.meetingCtrlStore.toJSON();
                SM.contactsStore.map(function(item){
                        return item.set('checked',false);
                    });
                SM.topContactsStore.map(function(item){
                    return item.set('checked',false);
                });
                SM.createSelectedUserStore.reset();
                _.map(meetingUser,function(item){
                    item.checked = true;
                    return item
                });
                SM.contactsStore.add(meetingUser,{merge:true});
            }else{
                Ctrl.model = 'cratebCtrl';
                Ctrl.id = '';
            }
        },
        scrollToName: function(event){
            var n = (event.target.innerText || event.target.textContent);
            var li = $$('#contacts-content .list-group.all li.'+ n);
            var top;
            if(li.length){
                li = li.eq(0);
                top = li.offset().top;
                $$(mainView.activePage.container.querySelector('.page-content')).scrollTop(top);
            }
            n   = null;
            li  = null;
            top = null;
        },
        clearUser : function(){
            var meetingUser = SM.meetingCtrlStore.toJSON();
                meetingUser = _.pluck(meetingUser,'address');
            var user =_.reject(SM.createSelectedUserStore.toJSON(),function(item){
                return  meetingUser.indexOf(item.address) > -1
            });
             return _.map(user, function(item) {
                        return _.pick(item, "name", "address");
                });
        },
        doDone: function() {
            //mainView.loadPage('index.html',false);
            var data = {};
            if (Ctrl.model === "meetingCtrl") {
                data = Ctrl.clearUser();
                xhr.simpleCall({
                    func:"createbCtrl_addTerminals",
                    data : data,
                    query:{id:Ctrl.id},
                    method:"POST",
                    contentType:"application/json",
                    complete:function(){
                        EM.hidePreloader();
                    }
                });
                Ctrl.clearData();
                mainView.goBack();
                //mainView.loadPage('page/meeting.html?id='+Ctrl.id);
            } else {
                data = SM.meetingInfoStore.toJSON();
                data.terminals = _.map(SM.createSelectedUserStore.toJSON(), function(item) {
                    return _.pick(item, "name", "address");
                });
                data.vmr = {
                    "number": data.vmr
                }
                data.duration = data.duration.replace(/[^\d]/g, '');

                
                EM.showPreloader('正在创建会议...');
                xhr.simpleCall({
                    "func": 'createMeeting',
                    data: data,
                    "method": "POST",
                    "complete": function(xhr) {
 						EM.hidePreloader();
                        if (xhr.status === 400) {
                            EM.alert(JSON.parse(xhr.response).msg);
                        }
                        
                    },
                    "contentType": "application/json"
                }, function(response) {
                    if (response.success) {
                        Ctrl.clearData();
                        mainView.loadPage('page/meeting.html?id=' + response.data.id);
                    }
                });
            }

        },
        validUser :function(user){
            if(!user){
                return false;
            }
            if(!(user.name.trim().length)){
                EM.alert('请填写姓名！');
                return false;
            }
            if(!user.address){

                EM.alert('请填写号码！');
                return false
            }
            if(!(/^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,5}$/.test(user.address))){
                EM.alert('号码格式不正确！如：xx@xx.xx');
                return false;
            }
            return true;
        },
        showSelected : function(){
            VM['createbView'].showSelectedPopup();
            $$('.popup-show-selected').on('click','.done',function(){
                    EM.closeModal('.popup-show-selected');
            });
            $$('.popup-show-selected').on('change','input[type=checkbox]',Ctrl.checkboxChange);
            $$('.popup-show-selected').on('click','.close-popup',function(){
                var items = SM.createSelectedUserStore.where({checked:false});
                items.forEach(function(item){
                    item.set('checked',true);
                    SM.contactsStore.findWhere({id:item.id}).set('checked',true);
                });
            });
            $$('.popup-show-selected').on('click','.done',function(){
                SM.createSelectedUserStore.remove(SM.createSelectedUserStore.where({checked:false}));
            });
        },
        xhrAddUser : function(data){
            xhr.simpleCall({
                "func": "createbCtrl_addUser",
                "data":data,
                "method":"POST",
                "contentType":"application/json"
            })
        },
        addUser:function () {
            VM['createbView'].showAddUserPopup();
            $$('.popup-add-meeting-user').on('click','.done',function(){
                var data = EM.formToJSON('#form-add-meeting-user');
                data.address = data.email;
                if(Ctrl.validUser(data)){
                    data.id =  _.uniqueId('add_');
                    data.checked = true;
                    SM.contactsStore.add(data);
                    SM.createSelectedUserStore.add(data);
                    EM.closeModal('.popup-add-meeting-user');
                    Ctrl.refreshUI('contactsStore');
                    //增加私有联系人
                    Ctrl.xhrAddUser(_.pick(data,'name','address'));
                }
            });
        },
        loadContacts: function() {
            VM.module('createbView').beforeLoadContacts()
            xhr.simpleCall({
                func: 'contactsAll'
            },function(){},function(xhr){
                var response;
                EM.hideIndicator();
                try{
                    response = JSON.parse(xhr.responseText);
                    EM.alert(response.msg);
                }catch(e){
                    EM.alert('未知错误！');
                }
                response = null;
            });

        },
        checkboxChange: function(event){
            var id = event.target.getAttribute('data-id');
            var type = event.target.getAttribute('data-type');
            var item ;
            var checked = event.target.checked;
                //id = parseInt(id);
                item = SM.contactsStore.get(id);

                item && item.set('checked',checked);
                
                item = SM.topContactsStore.get(id);
                item && item.set('checked',checked);

                item = SM.createSelectedUserStore.get(id);
                item && item.set('checked',checked);

            item    = null;
            id      = null;
            checked = null;
        },
        refreshUI: function(type){
            VM.createbView.render(type);
            Ctrl.count = SM.createSelectedUserStore.length;
        },
        updateUI : function (item){
            var count = SM.createSelectedUserStore.length;
            if(!('checked' in item.changed )){
                count = null;
                return false;
            }
            if(item.changed.checked === true){
                count ++
                SM.createSelectedUserStore.add(item,{merge:true});
            }else{
                count && count --;
                if(!(appFunc.isPopup('popup-show-selected'))){
                    SM.createSelectedUserStore.remove(item);
                }
            }

            $$('#contacts-content').find('[data-id="'+ item.id +'"]').prop('checked',item.changed.checked);
            $$('#badge-create-users').text(count);
            count = null;
            
        },
        clearData :function(){
            SM.contactsStore.reset();
            SM.createSelectedUserStore.reset();
            SM.topContactsStore.reset();
            //SM.meetingInfoStore.set();
            FD.remove('createaCtrl_VMR');
        },
        destroy : function(){
            if(Ctrl.model === 'meetingCtrl'){
                Ctrl.clearData();
            }
        },
        onGlobalMessage : function(response){
            var topContacts,personalContacts,tenantContacts;
            var localData = appFunc.localData;
            var updateUI;
            var data  = JSON.parse(response.data);
                data = data.data;

            if(response.key === 'contactsAll'){
                
                if((topContacts = data.recentContacts) && JSON.stringify(topContacts) !== localData.get("topContacts")){
                    localData.set('topContacts',topContacts);
                    SM.topContactsStore.reset(topContacts);
                }
                if((personalContacts = data.personalContacts)&&JSON.stringify(personalContacts) !== localData.get("personalContacts")){
                    localData.set('personalContacts',personalContacts);
                    updateUI = true;
                }
                if((tenantContacts = data.tenantContacts)&&JSON.stringify(tenantContacts) !== localData.get('tenantContacts')){
                    localData.set('tenantContacts',tenantContacts);
                    updateUI = true;
                }

                if(updateUI){
                    var jsonArray = [];

                    jsonArray.push(tenantContacts);
                    jsonArray.push(personalContacts);
                    jsonArray.push(topContacts);

                    SM.contactsStore.reset(_.flatten(jsonArray),{merge:true});
                }
                
            }
        }

    };

    return Ctrl;
});