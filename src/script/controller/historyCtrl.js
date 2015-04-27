define(['utils/appFunc','utils/xhr','VM','FD','SM'],function(appFunc,xhr,VM,FD,SM){
    var loading;
    var page;
    var limit = 10;
    var Ctrl = {

        init: function(){

            var bindings = [{
                element: '#history-content',
                selector: '.item',
                event: 'click',
                handler: Ctrl.showDetail
            }, {
                element: '.infinite-scroll-page-history',
                event: 'infinite',
                handler: Ctrl.infinite
            }];

            VM.historyView.init({
                bindings:bindings
            });
            page = 1;
            loading = false;
            Ctrl.loadGoing();
            SM.historyMeetingStore.off('add').on('add',VM.historyView.addHistory)
        },
        loadGoing: function(){
            /*FD.add({
                "func":"historyCtrl_going"
            });*/
            xhr.simpleCall({
                func: "historyCtrl_history",
                contentType:"application/json",
                method: "POST"
            });
        },

        infinite: function() {
            if (loading) return;
            loading = true;
            $$('.infinite-scroll-page-history > .infinite-scroll-preloader').show();
            xhr.simpleCall({
                func: "historyCtrl_historyInfinite",
                data: {
                    page: ++page,
                    limit:limit
                },
                contentType:"application/json",
                method: "POST"
            }, function(response) {
                var len = response.data.records.length
                $$('.infinite-scroll-page-history > .infinite-scroll-preloader').hide();
                if(len){
                    SM.historyMeetingStore.add(response.data.records);
                }
                if(!len || len < limit ){
                    EM.detachInfiniteScroll($$('.infinite-scroll-page-history'));
                      // Remove preloader
                      $$('.infinite-scroll-page-history > .infinite-scroll-preloader').remove();
                }
                
                loading = false;
                len = null;
            },function(){
                $$('.infinite-scroll-page-history > .infinite-scroll-preloader').hide();
                page --;
                loading = false;
            });
        },
        createMeeting: function(data) {
            var meetingInfo = {
                "type": "I"
            };
             var myContactsData = appFunc.localData.get("myContacts"),constData=JSON.parse(myContactsData);

            if(constData&&constData.length>0&&data.terminals.length>0){
                    _.each(data.terminals,function(terminal){
                           var have = _.where(constData,{address:terminal.address});
                           if(have.length>0){
                                terminal.name = have[0].name;
                           }                           
                    });
                }else{

                }
            meetingInfo.terminals = data.terminals && _.map(data.terminals,function(item){
                return _.pick(item,"name","address");
            });
            meetingInfo.title = $$(".restart-title").val();
            meetingInfo.duration = data.duration;
            meetingInfo.vmr = {};
            if (data.vmr.allotedWay === "auto") {
                meetingInfo.vmr.number = "自动分配";
            } else {
                meetingInfo.vmr.number = data.vmr.number;
            }
            EM.showPreloader('正在创建会议...');
            xhr.simpleCall({
                "func": 'createMeeting',
                data: meetingInfo,
                "method": "POST",
                "complete": function(xhr) {
                    if (xhr.status === 400) {
                        EM.alert(JSON.parse(xhr.response).msg);
                    }
                },
                "contentType": "application/json"
            }, function(response) {
                setTimeout(function(){
                    EM.hidePreloader();
                    EM.hideIndicator();
                },300);
                if (response.success) {
                    mainView.loadPage('page/meeting.html?id=' + response.data.id);
                }
            },function(){
                setTimeout(function(){
                    EM.hidePreloader();
                    EM.hideIndicator();
                },300);
            });
            EM.closeModal('.popup-history-meeting-detail');
        },
        showDetail : function(event){
            var li = event.target.nodeName === "LI" ? $$(event.target) : $$(event.target).parents('li');
            var type = li.data('type');//li.getAttribute('data-type')
            var id = li.data('id');
            var data;
            if(type === "all"){
                //var myContactsData = appFunc.localData.get("myContacts"),constData=JSON.parse(myContactsData);

                data  = SM.historyMeetingStore.get(id).toJSON();

                /*if(constData&&constData.length>0&&data.terminals.length>0){
                    _.each(data.terminals,function(terminal){
                           var have = _.where(constData,{address:terminal.address});
                           if(have.length>0){
                                terminal.name = have[0].name;
                           }                           
                    });
                }else{

                }*/

                data.time = appFunc.dateFormat(data.startTime,'m-d H:i') +' '+ appFunc.dateFormat(data.endTime,'m-d H:i');
                data.users = data.terminals && _.pluck(data.terminals,'name').join(',');
                VM.historyView.showDetail(type,data);
                $$('.popup-history-meeting-detail .createMeeting').off('click').on('click',Ctrl.createMeeting.bind(null,data));
            }else if(type === "going"){
                VM.historyView.showDetail(type,id);
            }
        },
        onGlobalMessage: function(response) {
            var localData = appFunc.localData;
            var data = JSON.parse(response.data);
            data = data.data;
            switch (response.key) {
                case 'historyCtrl_going':
                    if (data) {
                        _.map(data, function(item) {
                            item.count = item.terminals ? item.terminals.length : 0;
                            item.startTime = appFunc.dateFormat(item.startTime, 'm-d H:i')
                            return item
                        });
                        VM.historyView.renderUI('going', data);
                    }
                    break;
                case 'historyCtrl_history':
                    if (response.data !== localData.get("historyMeeting")) {
                        localData.set('historyMeeting', response.data);
                        if (data) {
                            SM.historyMeetingStore.reset(data.records);
                            VM.historyView.renderUI('all');
                        }
                    }
                    break;
            }
        },
        destroy : function(page){
            // FD.remove("historyCtrl_going");
        }

    };

    return Ctrl;
});