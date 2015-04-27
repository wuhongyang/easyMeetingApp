define(['utils/appFunc','utils/xhr','VM','SM','FD'],function(appFunc,xhr,VM,SM,FD){

    var Ctrl = {

        init: function(query){

            var bindings = [
           {
                element: '#select-create-time',
                event:   'click',
                handler: Ctrl.selectTime
            },{
                element: '#select-create-vmr',
                event:   'click',
                handler: Ctrl.selectVMR
            },{
                element: '#input-createa-title',
                event:   'keyup',
                handler: Ctrl.selectTitle
            }
            ];

            VM.module('createaView').init({
                bindings:bindings
            });
            SM.createTimeStore.reset([{
                text: '30分钟'
            }, {
                text: '60分钟',
                color: 'red'
            }, {
                text: '90分钟'
            }, {
                text: '120分钟'
            }, {
                text: '150分钟'
            }]);
            SM.meetingInfoStore.set({
                //"title": "当前时间",
                "type":"I",
                "duration": "60分钟",
                "vmr":""
            });
            SM['meetingInfoStore'].on('change',Ctrl.updateUI);
            FD.add('createaCtrl_VMR');
        },

         updateUI : function(item){
            var value;
            if(item.hasChanged('duration')){
                value = item.get('duration');
                $$('#select-create-time').find('.item-title').text(value);
            }else if(item.hasChanged('vmr')){
                value = item.get('vmr');
                $$('#select-create-vmr').find('.item-title').text(value);
            }
            value = null;
         },

         updateActions : function(){
            //Ctrl.selectVMR();
         },
         selectTitle: function(event){
            SM.meetingInfoStore.set('title',event.target.value);
         },

        selectTime:function () {
            var store = SM['createTimeStore'].toJSON();
            store.forEach(function(item){
                item.onClick = Ctrl.setTime
            })
            EM.actions(store);
            store = null;
        },
        selectVMR:function () {
            var vmrData  = appFunc.localData.get('createaCtrl_VMR');
            var selected = SM.meetingInfoStore.get('vmr');
            var t;
            if(vmrData){
                vmrData = JSON.parse(vmrData);
                vmrData = vmrData.data;
                _.each(vmrData,function(item){
                    item.text = item.number;
                });
            }else{
                vmrData = [{
                                number: '自动分配',
                                text : "自动分配",
                                color: 'red'
                            }]
            }
            //store.splice(1);
            if (selected) {
                t = _.findWhere(vmrData, {
                    text: selected
                });
                if (t) {
                    t.color = "red";
                } else {
                    vmrData[vmrData.length-1].color = "red";
                    SM.meetingInfoStore.set('vmr','自动分配');
                }
            }
            //store = store.concat(vmrData);

            
            vmrData.forEach(function(item){
                item.onClick = Ctrl.setVMR
            });
            EM.actions(vmrData,'selectVMR');
            t        = null;
            selected = null;
            //store    = null;
            vmrData  = null;
        },
        setTime : function(dom7,event){
            var value      = event && (event.target.innerText || event.target.textContent);
            var timeStore  = SM['createTimeStore'];

            var redItem = timeStore.findWhere({"color":"red"});
            var item;
            redItem.set({"color":""});
            
            item = timeStore.findWhere({"text":value});

            item.set('color','red');
            SM.meetingInfoStore.set('duration',value);
            value     = null;
            item      = null;
            redItem   = null;
            timeStore = null;
        },
        setVMR : function(dom7,event){
            var value     = event && (event.target.innerText || event.target.textContent);
           
            SM.meetingInfoStore.set('vmr',value);
            value = null;
        },
        initVMR : function(data){
            var len = data.length;
            var i = 0;
            var value;
            if(len > 1){
                i = Math.random()*3;
                i = parseInt(i);
            }
            value = data[i].number;
            SM.meetingInfoStore.set('vmr',value);
            len = null;
            i = null;
            value = null;
        },
        onGlobalMessage : function(response){
            var data = JSON.parse(response.data).data;
            if(response.key === 'createaCtrl_VMR'){
                if(data && data.length && SM.meetingInfoStore.get('vmr') === ""){
                    Ctrl.initVMR(data);
                }
                if(appFunc.localData.get(response.key) === response.data){

                }else{
                    appFunc.localData.set(response.key,response.data);
                    if(appFunc.isActions('selectVMR')){
                        EM.addNotification({
                            title:   '提醒',
                            message: 'VMR 使用状态有变化,现在更新选择列表。',
                            hold:    1800,
                            onClose: function() {
                                if(appFunc.isActions('selectVMR')){
                                    EM.closeModal('.actions-modal');
                                    Ctrl.selectVMR();
                                }
                                //EM.alert('Notification closed');
                            }
                        });
                    }else if(mainView.activePage.name === "createb"){
                        EM.addNotification({
                            title:   '提醒',
                            message: 'VMR 使用状态有变化,现在是否重新选择妯？',
                            hold:    1800,
                            onClose: function() {
                                /*if(appFunc.isActions('selectVMR')){
                                    EM.closeModal('.actions-modal');
                                    Ctrl.selectVMR();
                                }*/
                                //EM.alert('Notification closed');
                            }
                        });
                    }
                    
                }
            }
        }

    };

    return Ctrl;
});