define(['utils/appFunc','i18n!nls/lang','utils/tplManager',"SM"],function(appFunc,i18n,TM,SM){
    /* global $CONFIG */

    var meetingView = {

        init: function(params){
             appFunc.bindEvents(params.bindings);
        },
        isEmpty: function(){
            return $$('#meeting-user-content >ul> li').length === 0
        },
        buildList: function() { 
            return TM.renderTplById('meetingUserListTemplate', {
                meetingCtrlStore: SM.meetingCtrlStore.toJSON()
            });
        },
        updateUI:function(){
            var userList =meetingView.buildList();
           $$('#meeting-user-content >ul').html(userList);
        },
        showSplitScreen:function(screenMode,point){
             var popoverHTML =  TM.renderTplById('splitScreenTemplate');           
              EM.popover(popoverHTML,point);
              $$(".screenMode"+screenMode).addClass("selected");
              popoverHTML=null;
        },
        userControl:function(point,address){
            var user = SM["meetingCtrlStore"].findWhere({
                address:address
            });
            var jsonData = meetingView.resetData(user);
            var  popupHTML =  TM.renderTplById('userControlTemplate',jsonData);
              EM.popup(popupHTML);
              popupHTML=null;
        },
        resetData:function(user){
            var mute =  user.get("audioRxMuted"),camera=user.get("videoRxMuted");
            var muteImg = mute?"glyph-meetingmiccircledisable":"glyph-meetingmiccircle",
                 cameraImg = camera?"glyph-meetingvideocircledisable":"glyph-meetingvideocircle";
             var renderData = {
                 "userImg":user.get("userImg"), 
                 "name":user.get("name"), 
                 "isCamera" : camera ,
                 "isMute" : mute ,
                 "muteImg":muteImg,   
                 "cameraImg" : cameraImg,
                 "address":user.get("address")
            };
            renderData.camera = camera?"连接视频":"关闭视频";
            renderData.mute = mute?"允许发言":"禁止发言";
            return renderData;
        },
        i18next: function(content){
            var output = TM.renderTplById('meetingUserListTemplate',{meetingCtrlStore:SM.meetingCtrlStore.toJSON()})
            
            return TM.renderTpl(content,{userList:output});
        }
    };

    return meetingView;
});