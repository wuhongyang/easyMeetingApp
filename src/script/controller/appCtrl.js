define(['utils/appFunc','utils/xhr','VM','FD'],function(appFunc,xhr,VM,FD){

    var appCtrl = {
        init: function(query){
            /*if(query && query.form && query.form === 'login'){
                $$('div.views').removeClass('hidden-navbar');
                $$('div.views').removeClass('hidden-toolbar');
            }*/
            var meetingId = appFunc.localData.get('currentMeetingId');
            if(meetingId){
                xhr.simpleCall({
                    "func": "appCtrl_meetingStatus",
                    "data": {
                        "id": meetingId
                    }
                },function(response){
                    if(response.success && response.data.status === "going"){
                        EM.addNotification({
                            title:   '提醒',
                            message: '您还有正在进行中的会议，正在为您转到会控页面...',
                            hold:    1800,
                            onClose: function() {
                                appCtrl.goToMeeting(meetingId);
                            }
                        });
                        
                    }else{
                        //VM.appView.showContent();
                        //EM.sizeNavbars();
                    }
                });//,VM.appView.showContent
                
            }

            VM.appView.showContent();

            xhr.simpleCall({
                func:"appCtrl_going"
            });
                
            
            //查询历史会议
            xhr.simpleCall({
                    func:"appCtrl_history",
                    method:"POST"
                });
            //sessionTouch 加入到定时任务
            FD.add({func:'sessionTouch',interval:20*60});
            //清理popup
            EM.closeModal();

           
        },
        // i18next: function(viewName,content){
        //     var output = VM[viewName].i18next(content);
        //     return output;
        // },
        goToMeeting : function(meetingId){
            setTimeout(function(){
                    mainView.loadPage('page/meeting.html?id='+ meetingId);
                },400);
        },
        bindEven: function(){
            var bindings = [{
                element:document,
                selector:'div.item-image>img',
                event: 'click',
                handler: VM['appView'].photoBrowser
            }];

            appFunc.bindEvents(bindings);
        },
        clearHistory: function() {
            //清理历史页面缓存
            $$('.page-on-left').each(function(){
                EM.pageRemoveCallback(mainView,this,'appCtrl');
            }).remove();
            EM.cache.splice(0,EM.cache.length-1);
            mainView.history = ['index.html'];
        },
        onGlobalMessage: function(response){
            var data = JSON.parse(response.data).data;
            switch (response.key){
                case "appCtrl_going" : 
                if(data.length && data[0].id){
                    appCtrl.goToMeeting(data[0].id);
                }
                break;
                case "appCtrl_history":
                    appFunc.localData.set('historyMeeting',response.data);
                    VM.appView.setHistoryCount(data.totals);
                break;
            }
        }

    };

    appCtrl.bindEven();

    return appCtrl;
});