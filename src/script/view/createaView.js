define(['utils/appFunc','i18n!nls/lang','utils/tplManager',"SM"],function(appFunc,i18n,TM,SM){
    /* global $CONFIG */

    var createaView = {

        init: function(params){
            appFunc.bindEvents(params.bindings);
        },

        i18next: function(content){
            var renderData = {};
            
            renderData.title = appFunc.getDate();
            SM['meetingInfoStore'].set('title',renderData.title );
            
            
            //renderData.appName = i18n.app.name;
            //renderData.about = i18n.setting.about;

            var output = TM.renderTpl(content,renderData);

            return output;
        }

    };

    return createaView;
});