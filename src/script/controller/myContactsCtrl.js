define(['utils/appFunc','utils/xhr','VM','SM','i18n!nls/lang'],function(appFunc,xhr,VM,SM,i18n){

    var Ctrl = {

        init: function(query){

            var bindings = [
                {
                    element: '#mc-btn-add',
                    event:   'click',
                    handler: Ctrl.addMyContact
                },
                {
                    element: '#my-contacts-list',
                    selector:'a[class="action1"]',
                    event:   'click',
                    handler: Ctrl.updateMyContact
                },//编辑通讯录
                {
                    element: '#my-contacts-list',
                    selector:'li.swipeout',
                    event:   'delete',
                    handler: Ctrl.deleteMyContact
                },//删除通讯录
                {
                    element: '#my-contacts-list',
                    selector:'li.swipeout',
                    event:   'swipeout',
                    handler: Ctrl.showActions
                },
                {
                    element: '#my-contacts-list',
                    selector:'li.swipeout',
                    event:   'closed',
                    handler: Ctrl.hideActions
                }
            ];

            VM.module('myContactsView').init({
                bindings:bindings
            });

            Ctrl.requestUserContacts();
        },

        checkMyContactEditForm: function (myContactName,myContactNumberer) {
            if(myContactName === ''){
                EM.alert(i18n.myContact.err_empty_input_name);
                return false;
            }
            else if(myContactNumberer === ''){
                EM.alert(i18n.myContact.err_empty_input_number);
                return false;
            }

            return true;
        },

        //添加单个通讯录
        addMyContact: function () {
            VM.module('myContactsView').showAddMyContactPopup();
            $$('.popup-add-mycontact').on('click','.done',function(){
                var myContactName = $$(".popup-add-mycontact input[name='name']").val();
                var myContactNumberer = $$(".popup-add-mycontact input[name='email']").val();
                var checkResulte = Ctrl.checkMyContactEditForm(myContactName,myContactNumberer);
                if(checkResulte)
                {
                    EM.showPreloader(i18n.myContact.wait);
                    var params = {
                        "name": myContactName,
                        "address": myContactNumberer
                    };

                    Ctrl.onSaveNewMyContact(params,function(response){
                        if(response.success === true)
                        {
                            var newItemData = {
                                "id":response.data.id,
                                "name":myContactName,
                                "address":myContactNumberer
                            };

                            var data = appFunc.localData.get("myContacts");
                            if(data)
                            {
                                var array = JSON.parse(data);
                                array.push(newItemData);
                                array.sort(Ctrl.sortMyContactsFunc);
                                Ctrl.showMyContactsList({"data":array});
                                appFunc.localData.set("myContacts",array);
                                EM.closeModal('.popup-add-mycontact');
                            }
                        }
                        // else
                        // {
                        // }
                        // EM.alert(response.msg);
                    },null);
                }
            });
        },

        /*
         *  保存通讯录，外部可以调用该方法保存数据
         *  params : {"name":"","address":""}
         *  callback : 保存后执行的回调方法
         *  errorCallback : 保存失败后执行的回调方法
         */
        onSaveNewMyContact: function (params, callback, errorCallback) {
            xhr.simpleCall({
                func:'my-contact',
                data: params,
                method:'POST',
                contentType:'application/json',
                complete:function(XHR){
                    if(XHR.status != 200)
                    {
                        EM.alert(JSON.parse(XHR.response).msg,function(){
                              EM.hidePreloader();
                            });
                        if(errorCallback != null)
                        {
                            errorCallback.call(Ctrl);
                        }
                    }
                }
            },function(response){
                EM.hidePreloader();
                if(callback)
                {
                    callback.call(Ctrl,response)
                } 
            });
        },

        //开始修改单个通讯录
        updateMyContact: function (e) {
            var dataId = Number($$(this).parents('li').attr("data-id"));
            var itemData = Ctrl.getMyContactItemData(dataId);
            if(itemData)
            {
                EM.swipeoutClose($$(this).parents("li.swipeout"));
                VM.module('myContactsView').showUpdateMyContactPopup(itemData);
                $$('.popup-update-mycontact').on('click','.done',function(){
                    var myContactName = $$(".popup-update-mycontact input[name='name']").val();
                    var myContactNumberer = $$(".popup-update-mycontact input[name='email']").val();
                    var checkResulte = Ctrl.checkMyContactEditForm(myContactName,myContactNumberer);
                    if(checkResulte)
                    {
                        EM.showPreloader(i18n.myContact.wait);
                        var params = {
                            "id": dataId,
                            "name": myContactName,
                            "address": myContactNumberer
                        };

                        xhr.simpleCall({
                            func:'my-contact',
                            data:params,
                            method:'PUT',
                            contentType:'application/json',
                            complete:function(XHR){
                                if(XHR.status != 200)
                                {
                                    EM.alert(JSON.parse(XHR.response).msg,function(){
                                            EM.hidePreloader();
                                    });
                                }
                            }
                        },function(response){
                            if(response.success === true)
                            {
                                var data = appFunc.localData.get("myContacts");
                                if(data)
                                {
                                    var array = JSON.parse(data);
                                    array.forEach(function(item){
                                        if(item.id === dataId)
                                        {
                                            item.name = myContactName;
                                            item.address = myContactNumberer;  
                                            return;
                                        }
                                    });

                                    array.sort(Ctrl.sortMyContactsFunc);
                                    Ctrl.showMyContactsList({"data":array});
                                    appFunc.localData.set("myContacts",array);
                                    EM.closeModal('.popup-update-mycontact');
                                }
                            }
                            // else
                            // {
                            // }
                            EM.alert(response.msg);
                            EM.hidePreloader();
                        });
                    }
                });
            }
        },

        //删除单个通讯录
        deleteMyContact: function (e) {
            var dataId = Number($$(this).attr("data-id"));
            if(dataId != "undefined" && !isNaN(dataId))
            {
                EM.showPreloader(i18n.myContact.wait);
                xhr.simpleCall({
                    func:'my-contact-delete',
                    data:{
                        "id": dataId
                    },
                    method:"DELETE",
                    contentType:'application/json',
                    complete:function(XHR){
                        if(XHR.status != 200)
                        {
                            EM.alert(JSON.parse(XHR.response).msg);
                        }
                    }
                },function(response){
                    var data = appFunc.localData.get("myContacts"), array = null;
                    if(data) 
                    {
                        array = JSON.parse(data);
                    }

                    if(response.success === true){
                        // EM.alert(response.msg); //注：框架会自动移除节点
                        if(array)
                        {
                            for(var i = array.length - 1; i >= 0; i --)
                            {
                                if(array[i].id === dataId)
                                {
                                    array.splice(i,1);
                                    break;
                                }
                            }

                            appFunc.localData.set("myContacts",array);
                        }
                        EM.hidePreloader();
                    }else{
                        //框架会自动移除节点，重新刷新数据
                        if(array)
                        {
                            Ctrl.showMyContactsList({"data":array});
                        }
                        
                        EM.hidePreloader();
                        EM.alert(response.msg);
                    }
                });
            }
        },

        //解决framework7.0滚动时会显示部分action button的bug
        showActions: function (e) {
            if($$('.mc-actions').hasClass('mc-actions-default'))
            {
                $$('.mc-actions').removeClass('mc-actions-default').addClass('mc-actions-active');
            }
        },

        hideActions: function (e) {
            if($$('.mc-actions').hasClass('mc-actions-active'))
            {
                $$('.mc-actions').removeClass('mc-actions-active').addClass('mc-actions-default');
            }
        },

        //请求通讯录列表数据
        requestUserContacts: function () {

            EM.showPreloader(i18n.myContact.get_my_contacts);

            xhr.simpleCall({
                func:'my-contacts',
                complete:function(XHR){
                    if(XHR.status != 200 && !showCacheData())
                    {
                        EM.alert(JSON.parse(XHR.response).msg);
                    }
                }
            },function(response){
                if(response.success == true)
                {
                    var array = response.data;
                    array.sort(Ctrl.sortMyContactsFunc);
                    appFunc.localData.set("myContacts",array);
                    Ctrl.showMyContactsList({"data":array});
                    EM.hidePreloader();
                }
                else if(!showCacheData())
                {
                    EM.alert(response.msg);
                }
            });
        },

        //显示缓存数据
        showCacheData: function () {
            var data = appFunc.localData.get("myContacts");
            if(data)
            {
                var array = JSON.parse(data);
                Ctrl.showMyContactsList({"data":array});
                return true;
            }
            return false;
        },

        //从缓存中获取单个通讯录数据
        getMyContactItemData: function (id) {
            var itemData = null;
            var data = appFunc.localData.get("myContacts");
            if(data)
            {
                var array = JSON.parse(data);
                array.forEach(function(item){
                    if(item.id === id)
                    {
                        itemData = item;
                        return;
                    }
                });
            }
            return itemData;
        },

        //显示通讯录列表
        showMyContactsList: function (data) {
            VM['myContactsView'].updateUI(data);
        },

        //根据name属性排序原始数据数组
        sortMyContactsFunc: function(item1,item2){
            return item1['name'].localeCompare(item2['name']);
        }
    };

    return Ctrl;
});