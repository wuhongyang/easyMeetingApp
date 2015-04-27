define(['utils/appFunc','i18n!nls/lang','utils/tplManager',"SM"],function(appFunc,i18n,TM,SM){
    /* global $CONFIG */

    var View = {

        init: function(params){
            appFunc.bindEvents(params.bindings);
        },

        i18next: function(content){
            var renderData = {};
            var localData ;
            localData = appFunc.localData.get("historyMeeting");

            if(localData){
                localData = JSON.parse(localData);
                localData = localData.data;
                SM.historyMeetingStore.reset(localData.records);
            }
            
            renderData.historyMeeting = View.buildList('all');
            

            var output = TM.renderTpl(content,renderData);

            return output;
        },
        showDetail : function(type, data){
            var output;
            if(type === 'going'){
                mainView.loadPage('page/meeting.html?id='+ data);
            }else{
                output = TM.renderTplById('historyMeetingDetailTemplate', data);
                EM.popup(output);
            }
            
            output = null;
            selected = null;
        },
        buildList: function(type, data) {
            var list;
            if (type === 'going') {
                list = TM.renderTplById('historyGoingTemplate', {
                    "meeting": data
                });
            } else if (type === 'all') {
                list = '<ul>\n<li class="list-group-title">会议记录</li>\n'
                list += TM.renderTplById('historyAllTemplate', {
                    "meeting": SM.historyMeetingStore.toJSON()
                });
                list += '</ul>';
            }
            return list
        },
        addHistory: function(item){
            var li ;
            li = TM.renderTplById('historyAllTemplate', {meeting:item.toJSON()});
            $$('#history-content > .all > ul').append(li);
        },
        renderUI : function(type,data){
            var list = View.buildList(type,data);
            EM.swipeoutClose(EM.swipeoutOpenedEl);
            if(type === "going"){
                $$('#history-content > .going').html(list);
            }else if(type === "all"){
                $$('#history-content > .all').html(list);
            }
        }

    };

    return View;
});