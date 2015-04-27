define(['utils/appFunc'],function(appFunc){
    /* global $CONFIG */

    var forgetView = {

        init: function(params){
            appFunc.bindEvents(params.bindings);
        }
    };

    return forgetView;
});